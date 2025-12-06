import { useEffect } from 'react';
import { useAssessment } from '../components/assessment/AssessmentState';
import { supabase } from '../lib/supabase';
import { useAssessmentData } from './useAssessmentData';

export const useAssessmentSync = () => {
  const { state, dispatch } = useAssessment();
  const { saveAssessmentData } = useAssessmentData();

  useEffect(() => {
    if (!state.assessmentId) return;

    // Subscribe to real-time changes
    const subscription = supabase
      .channel(`assessment-${state.assessmentId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'assessment_responses',
        filter: `assessment_id=eq.${state.assessmentId}`,
      }, (payload) => {
        // Update local state when remote changes occur
        if (payload.new) {
          dispatch({
            type: 'SET_RESPONSE',
            payload: {
              questionId: payload.new.question_id,
              response: {
                questionId: payload.new.question_id,
                value: payload.new.value,
                timestamp: payload.new.updated_at,
                files: [], // Files are only for client-side File objects before upload
                attachments: payload.new.attachments || [] // Use the new attachments column
              },
            },
          });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [state.assessmentId]);

  // Auto-save changes to Supabase with debouncing
  useEffect(() => {
    if (!state.hasUnsavedChanges || !state.assessmentId) return;

    const saveTimer = setTimeout(() => {
      saveAssessmentData({
        responses: state.responses,
        status: 'draft',
        assessmentId: state.assessmentId
      });
      dispatch({ type: 'SET_HAS_UNSAVED_CHANGES', payload: false });
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [state.responses, state.hasUnsavedChanges, state.assessmentId]);

  return null;
};