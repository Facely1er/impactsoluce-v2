import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { 
  CheckCircle2, 
  FileText,
  PlayCircle,
  Save,
  Send,
  Timer,
  Info
} from 'lucide-react';
import Button from '../components/ui/Button';
import { assessmentSections } from '../utils/data';
import QuestionCard from '../components/assessment/QuestionCard';
import AssessmentNavigation from '../components/assessment/AssessmentNavigation';
import AssessmentProgress from '../components/assessment/AssessmentProgress';
import { useAssessment } from '../components/assessment/AssessmentState';
import { useAssessmentValidation } from '../hooks/useAssessmentValidation';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAssessmentSync } from '../hooks/useAssessmentSync';
import { useErrorHandler } from '../hooks/useErrorHandler';
import ErrorAlert from '../components/ui/ErrorAlert';
import { useAssessmentData } from '../hooks/useAssessmentData';
import { useAssessmentDemo } from '../hooks/useAssessmentDemo';
import { FileAttachment } from '../types';

export default function Assessment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, dispatch } = useAssessment();
  const { errors, validateResponse, validateSection, clearErrors } = useAssessmentValidation();
  const [isStarted, setIsStarted] = React.useState(false);
  const { error, handleError, clearError } = useErrorHandler();
  const { 
    saveAssessmentData, 
    isSaving, 
    isError, 
    isDemoMode, 
    isAuthenticated, 
    isLoading: isDataLoading 
  } = useAssessmentData(state.assessmentId);
  const { getDemoData } = useAssessmentDemo();
  useAssessmentSync();

  // Check authentication status on component mount (skip for demo mode)
  useEffect(() => {
    const checkAuthentication = async () => {
      if (isDemoMode) {
        // In demo mode, only load demo data if there are no existing responses
        // This preserves any user input that might have been saved to localStorage
        if (Object.keys(state.responses).length === 0) {
          const demoData = getDemoData();
          dispatch({ type: 'SET_ASSESSMENT_ID', payload: demoData.assessmentId });
          Object.entries(demoData.responses).forEach(([questionId, response]) => {
            dispatch({
              type: 'SET_RESPONSE',
              payload: { questionId, response }
            });
          });
          dispatch({ type: 'UPDATE_PROGRESS', payload: demoData.progress });
        }
        return;
      }

      // Wait for authentication status to be determined
      if (isDataLoading) return;

      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
    };

    checkAuthentication();
  }, [navigate, isDemoMode, getDemoData, dispatch, isAuthenticated, isDataLoading, state.responses]);

  // Calculate section progress
  const sectionProgress = React.useMemo(() => {
    const progress: Record<string, number> = {};
    assessmentSections.forEach(section => {
      const totalQuestions = section.questions.length;
      const answeredQuestions = section.questions.filter(q => 
        state.responses[q.id]?.value !== undefined && state.responses[q.id]?.value !== ''
      ).length;
      progress[section.id] = Math.round((answeredQuestions / totalQuestions) * 100);
    });
    return progress;
  }, [state.responses]);

  // Update overall progress
  useEffect(() => {
    const totalQuestions = assessmentSections.reduce(
      (acc, section) => acc + section.questions.length,
      0
    );
    const answeredQuestions = Object.values(state.responses).filter(
      response => response.value !== undefined && response.value !== ''
    ).length;
    const progress = Math.round((answeredQuestions / totalQuestions) * 100);
    dispatch({ type: 'UPDATE_PROGRESS', payload: progress });
  }, [state.responses, dispatch]);

  const handleResponseChange = (questionId: string, value: string | number | string[], files?: File[], attachments?: FileAttachment[]) => {
    const question = assessmentSections[state.currentSection].questions.find(
      q => q.id === questionId
    );
    if (!question) return;

    const response = {
      questionId,
      value,
      timestamp: new Date().toISOString(),
      files: files || [],
      attachments: attachments || []
    };

    try {
      if (validateResponse(response, question)) {
        dispatch({
          type: 'SET_RESPONSE',
          payload: { questionId, response }
        });
      }
    } catch (validationError) {
      handleError(validationError);
    }
  };

  const handleSaveProgress = async () => {
    if (isSaving) return; // Prevent double-saving

    try {
      const result = await saveAssessmentData({
        responses: state.responses,
        status: 'draft',
        assessmentId: state.assessmentId
      });
      
      if (result?.id && !state.assessmentId) {
        dispatch({ type: 'SET_ASSESSMENT_ID', payload: result.id });
      }
      
      dispatch({ type: 'SAVE_DRAFT' });
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmitAssessment = async () => {
    if (isSaving) return; // Prevent double-submission

    const currentSection = assessmentSections[state.currentSection];
    if (!validateSection(state.responses, currentSection.questions)) {
      return;
    }

    try {
      await saveAssessmentData({
        responses: state.responses,
        status: 'submitted',
        totalScore: state.progress, // Use progress as a basic score for now
        assessmentId: state.assessmentId
      });
      
      // Navigate to results page
      if (isDemoMode) {
        navigate('/assessment/results?demo=true');
      } else {
        navigate('/assessment/results');
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSectionChange = (index: number) => {
    if (index < 0 || index >= assessmentSections.length) return;
    
    clearErrors();
    dispatch({ type: 'SET_SECTION', payload: index });
  };

  // Show loading while checking authentication
  if (isDataLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              {isDemoMode ? t('Loading demo...') : t('Checking authentication...')}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isStarted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('ESG Assessment')} {isDemoMode && <span className="text-primary">(Demo)</span>}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('Impact Scan: Evaluate your organization\'s ESG performance against global standards (GRI, SASB, TCFD, CSRD, ISSB, ISO). This assessment takes approximately 45-60 minutes and produces a comprehensive scorecard with E, S, G breakdowns and an actionable roadmap.')}
            </p>
            {isDemoMode && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-blue-800 dark:text-blue-200">
                  <Info className="h-5 w-5" />
                  <span className="font-medium">Demo Mode</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                  This is a demonstration of the ESG assessment. Your responses will not be saved.
                </p>
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{t('Before You Begin')}</CardTitle>
                <CardDescription>
                  {t('Please ensure you have the following ready:')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {t('Required Documentation')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t('Environmental policies, social impact reports, and governance documents')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Timer className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {t('Time Required')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t('Approximately 45-60 minutes to complete the assessment. The assessment covers Environmental (E), Social (S), and Governance (G) pillars with evidence-based questions.')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {t('Progress Saving')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {isDemoMode 
                          ? t('Demo mode: Progress will not be saved permanently')
                          : t('You can save your progress and return later to complete the assessment')
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                size="lg"
                className="bg-primary"
                icon={<PlayCircle size={20} />}
                onClick={() => setIsStarted(true)}
              >
                {isDemoMode ? t('Start Demo Assessment') : t('Start Assessment')}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const currentSectionData = assessmentSections[state.currentSection];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t('ESG Assessment')} {isDemoMode && <span className="text-primary">(Demo)</span>}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {t('Impact Scan: Evaluate your organization\'s ESG performance against global standards')}
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              icon={<Save size={18} />}
              onClick={handleSaveProgress}
              disabled={isSaving}
              loading={isSaving}
            >
              {isDemoMode ? t('Save Demo Progress') : t('Save Progress')}
            </Button>
            <Button
              className="bg-primary"
              icon={<Send size={18} />}
              onClick={handleSubmitAssessment}
              disabled={isSaving || state.progress < 100}
            >
              {isDemoMode ? t('Complete Demo') : t('Submit Assessment')}
            </Button>
          </div>
        </div>

        {(error || isError) && (
          <ErrorAlert
            message={error?.message || 'An error occurred'}
            onClose={clearError}
            className="mb-6"
          />
        )}

        {state.progress < 100 && (
          <ErrorAlert
            message={t('Assessment incomplete')}
            details={t('Please complete all sections before submitting')}
            variant="warning"
            className="mb-6"
          />
        )}

        <AssessmentProgress
          currentSection={state.currentSection}
          totalSections={assessmentSections.length}
          completionRate={state.progress}
          onViewHistory={() => navigate(isDemoMode ? '/assessment/history?demo=true' : '/assessment/history')}
          onExportReport={() => {}}
        />

        <AssessmentNavigation
          sections={assessmentSections}
          currentSection={state.currentSection}
          onSectionChange={handleSectionChange}
          sectionProgress={sectionProgress}
        />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t(currentSectionData.title)}</CardTitle>
              <CardDescription>{t(currentSectionData.description)}</CardDescription>
            </CardHeader>
          </Card>

          {currentSectionData.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              value={state.responses[question.id]?.value || null}
              onChange={(value, files, attachments) => handleResponseChange(question.id, value, files, attachments)}
              error={errors[question.id]}
              isRequired={question.required}
              initialAttachments={state.responses[question.id]?.attachments}
            />
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => handleSectionChange(state.currentSection - 1)}
            disabled={state.currentSection === 0}
          >
            {t('Previous Section')}
          </Button>
          <Button
            className="bg-primary"
            onClick={() => handleSectionChange(state.currentSection + 1)}
            disabled={state.currentSection === assessmentSections.length - 1}
          >
            {t('Next Section')}
          </Button>
        </div>
      </div>
    </Layout>
  );
}