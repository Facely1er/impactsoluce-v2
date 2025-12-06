import { useMemo } from 'react';
import { AssessmentResponse, AssessmentQuestion } from '../types';
import { calculateAssessmentScore, AssessmentScoreResult } from '../utils/scoring';

export const useAssessmentScoring = (
  responses: Record<string, AssessmentResponse>,
  questions: AssessmentQuestion[],
  industry: string = 'Other'
): AssessmentScoreResult => {
  return useMemo(() => {
    return calculateAssessmentScore(responses, questions, industry);
  }, [responses, questions, industry]);
};

export const useQuestionProgress = (
  responses: Record<string, AssessmentResponse>,
  questions: AssessmentQuestion[]
): {
  totalQuestions: number;
  answeredQuestions: number;
  completionRate: number;
  sectionProgress: Record<string, number>;
} => {
  return useMemo(() => {
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(responses).length;
    const completionRate = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

    // Calculate section progress (simplified - assumes questions have section info)
    const sectionProgress: Record<string, number> = {};
    const sectionQuestions: Record<string, number> = {};
    const sectionAnswered: Record<string, number> = {};

    questions.forEach(question => {
      const section = question.category || 'general';
      sectionQuestions[section] = (sectionQuestions[section] || 0) + 1;
      
      if (responses[question.id]) {
        sectionAnswered[section] = (sectionAnswered[section] || 0) + 1;
      }
    });

    Object.keys(sectionQuestions).forEach(section => {
      const answered = sectionAnswered[section] || 0;
      const total = sectionQuestions[section];
      sectionProgress[section] = Math.round((answered / total) * 100);
    });

    return {
      totalQuestions,
      answeredQuestions,
      completionRate,
      sectionProgress
    };
  }, [responses, questions]);
};