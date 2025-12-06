import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AssessmentState, AssessmentResponse } from '../../types';

interface AssessmentContextType {
  state: AssessmentState;
  dispatch: React.Dispatch<AssessmentAction>;
}

type AssessmentAction =
  | { type: 'SET_SECTION'; payload: number }
  | { type: 'SET_RESPONSE'; payload: { questionId: string; response: AssessmentResponse } }
  | { type: 'UPDATE_PROGRESS'; payload: number }
  | { type: 'SET_ERROR'; payload: { questionId: string; error: string } }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'SAVE_DRAFT' }
  | { type: 'LOAD_DRAFT'; payload: AssessmentState }
  | { type: 'RESET' }
  | { type: 'SET_LAST_ACTIVE'; payload: number }
  | { type: 'SET_HAS_UNSAVED_CHANGES'; payload: boolean }
  | { type: 'SET_ASSESSMENT_ID'; payload: string };

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
const SESSION_TIMEOUT = 3600000; // 1 hour

const initialState: AssessmentState = {
  currentSection: 0,
  responses: {},
  progress: 0,
  lastSaved: '',
  isValid: true,
  errors: {},
  lastActive: Date.now(),
  hasUnsavedChanges: false,
  assessmentId: undefined
};

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

const assessmentReducer = (state: AssessmentState, action: AssessmentAction): AssessmentState => {
  switch (action.type) {
    case 'SET_SECTION':
      return {
        ...state,
        currentSection: Math.max(0, Math.min(action.payload, 10)), // Clamp between 0 and max sections
        lastActive: Date.now()
      };
    case 'SET_RESPONSE':
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.payload.questionId]: {
            ...action.payload.response,
            timestamp: new Date().toISOString() // Ensure fresh timestamp
          },
        },
        lastActive: Date.now(),
        hasUnsavedChanges: true
      };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: Math.max(0, Math.min(100, action.payload)), // Clamp between 0 and 100
        lastActive: Date.now()
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.questionId]: action.payload.error,
        },
        isValid: false,
        lastActive: Date.now()
      };
    case 'CLEAR_ERROR':
      const { [action.payload]: _, ...remainingErrors } = state.errors;
      return {
        ...state,
        errors: remainingErrors,
        isValid: Object.keys(remainingErrors).length === 0,
        lastActive: Date.now()
      };
    case 'SAVE_DRAFT':
      try {
        localStorage.setItem('assessment_draft', JSON.stringify({
          ...state,
          lastSaved: new Date().toISOString(),
          hasUnsavedChanges: false
        }));
      } catch (error) {
        console.warn('Failed to save draft to localStorage:', error);
      }
      return {
        ...state,
        lastSaved: new Date().toISOString(),
        hasUnsavedChanges: false,
        lastActive: Date.now()
      };
    case 'LOAD_DRAFT':
      return {
        ...action.payload,
        lastActive: Date.now(),
        hasUnsavedChanges: false
      };
    case 'RESET':
      try {
        localStorage.removeItem('assessment_draft');
      } catch (error) {
        console.warn('Failed to remove draft from localStorage:', error);
      }
      return {
        ...initialState,
        lastActive: Date.now()
      };
    case 'SET_LAST_ACTIVE':
      return {
        ...state,
        lastActive: action.payload
      };
    case 'SET_HAS_UNSAVED_CHANGES':
      return {
        ...state,
        hasUnsavedChanges: action.payload
      };
    case 'SET_ASSESSMENT_ID':
      return {
        ...state,
        assessmentId: action.payload
      };
    default:
      return state;
  }
};

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);

  // Load saved draft on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('assessment_draft');
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);
        // Validate the parsed draft has required properties
        if (parsedDraft && typeof parsedDraft === 'object' && 'responses' in parsedDraft) {
          dispatch({ type: 'LOAD_DRAFT', payload: parsedDraft });
        }
      }
    } catch (error) {
      console.error('Error loading assessment draft:', error);
      // Clear corrupted data
      localStorage.removeItem('assessment_draft');
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (!state.hasUnsavedChanges) return;

    const saveTimer = setTimeout(() => {
      dispatch({ type: 'SAVE_DRAFT' });
    }, AUTO_SAVE_INTERVAL);

    return () => clearTimeout(saveTimer);
  }, [state.hasUnsavedChanges, state.responses]);

  // Session timeout handling
  useEffect(() => {
    const checkSession = () => {
      const now = Date.now();
      if (now - state.lastActive > SESSION_TIMEOUT) {
        if (state.hasUnsavedChanges) {
          dispatch({ type: 'SAVE_DRAFT' });
        }
        // Don't reset automatically, just warn user
        console.warn('Session timeout detected. Please save your work.');
      }
    };

    const sessionTimer = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(sessionTimer);
  }, [state.lastActive, state.hasUnsavedChanges]);

  // Prompt before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.hasUnsavedChanges]);

  return (
    <AssessmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};