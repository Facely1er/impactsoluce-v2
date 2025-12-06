import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { saveAssessment, getAssessment, getAssessmentHistory, checkAuthStatus } from '../lib/supabase';
import { AssessmentResponse } from '../types';
import { useToast } from './useToast';
import { useAssessmentDemo } from './useAssessmentDemo';

export const useAssessmentData = (assessmentId?: string) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { isDemoMode, getDemoData } = useAssessmentDemo();
  
  // Check if we're in development or test mode
  const isDevMode = process.env.NODE_ENV === 'development';
  const isTestMode = process.env.NODE_ENV === 'test';

  // Check authentication status first
  const {
    data: authStatus,
    isLoading: isAuthLoading
  } = useQuery({
    queryKey: ['authStatus'],
    queryFn: checkAuthStatus,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isAuthenticated = authStatus?.isAuthenticated || false;
  const shouldBypassAuth = isDemoMode || isDevMode || isTestMode;

  const {
    data: assessmentData,
    isLoading: isAssessmentLoading,
    error,
    isError
  } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve({
          assessment: {
            id: 'demo-assessment-id',
            user_id: 'demo-user',
            status: 'submitted',
            total_score: 68,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            metadata: getDemoData()
          },
          responses: []
        });
      }
      return assessmentId ? getAssessment(assessmentId) : null;
    },
    enabled: (!!assessmentId || isDemoMode) && (isAuthenticated || shouldBypassAuth) && !isAuthLoading,
    retry: (failureCount, error) => {
      // Don't retry on authentication or permission errors
      if (error instanceof Error && 
          (error.message.includes('not found') || 
           error.message.includes('access denied') ||
           error.message.includes('authenticated'))) {
        return false;
      }
      return failureCount < 3;
    },
    onError: (error: Error) => {
      if (!isDemoMode) {
        addToast('error', 'Failed to load assessment data', error.message);
        console.error('Error loading assessment:', error);
      }
    }
  });

  const { 
    data: history,
    isLoading: isHistoryLoading,
    error: historyError
  } = useQuery({
    queryKey: ['assessmentHistory'],
    queryFn: () => {
      if (isDemoMode) {
        return Promise.resolve([
          {
            id: 'demo-assessment-1',
            user_id: 'demo-user',
            status: 'submitted',
            total_score: 68,
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            metadata: { scores: { environmental: 65, social: 70, governance: 72 } },
            assessment_responses: []
          },
          {
            id: 'demo-assessment-2',
            user_id: 'demo-user',
            status: 'submitted',
            total_score: 72,
            created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            metadata: { scores: { environmental: 70, social: 74, governance: 75 } },
            assessment_responses: []
          }
        ]);
      }
      return getAssessmentHistory();
    },
    enabled: (isAuthenticated || shouldBypassAuth) && !isAuthLoading,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('authenticated')) {
        return false;
      }
      return failureCount < 3;
    },
    onError: (error: Error) => {
      if (!isDemoMode) {
        addToast('error', 'Failed to load assessment history', error.message);
        console.error('Error loading history:', error);
      }
    }
  });

  const { 
    mutate: saveAssessmentData, 
    isPending: isSaving,
    error: saveError
  } = useMutation({
    mutationFn: (data: {
      responses: Record<string, AssessmentResponse>;
      totalScore?: number;
      status?: 'draft' | 'submitted';
      assessmentId?: string;
    }) => {
      if (isDemoMode || isDevMode || isTestMode) {
        // In demo mode, simulate saving without actually calling the API
        return Promise.resolve({
          id: 'demo-assessment-id',
          user_id: 'demo-user',
          status: data.status || 'draft',
          total_score: data.totalScore,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: data
        });
      }
      
      // Check authentication before saving
      if (!isAuthenticated && !shouldBypassAuth) {
        throw new Error('User must be authenticated to save assessments');
      }
      
      return saveAssessment(data);
    },
    onSuccess: (data) => {
      if (!isDemoMode && !isDevMode && !isTestMode) {
        queryClient.invalidateQueries({ queryKey: ['assessment'] });
        queryClient.invalidateQueries({ queryKey: ['assessmentHistory'] });
      }
      addToast('success', isDemoMode ? 'Demo assessment saved' : 'Assessment saved successfully');
      return data;
    },
    onError: (error: Error) => {
      if (!isDemoMode && !isDevMode && !isTestMode) {
        addToast('error', 'Failed to save assessment', error.message);
        console.error('Error saving assessment:', error);
      }
    }
  });

  return {
    assessmentData,
    history,
    saveAssessmentData,
    isLoading: isAuthLoading || isAssessmentLoading || isHistoryLoading,
    isSaving,
    error: error || historyError || saveError,
    isError: isError || !!historyError || !!saveError,
    isDemoMode: shouldBypassAuth,
    isAuthenticated,
    authStatus
  };
};