/**
 * Local Storage utilities for standalone mode
 * Provides data persistence without requiring a database
 */

export interface StoredAssessment {
  id: string;
  user_id: string;
  submission_date: string | null;
  total_score: number | null;
  status: 'draft' | 'submitted';
  metadata: any;
  created_at: string;
  updated_at: string;
  responses: StoredResponse[];
}

export interface StoredResponse {
  id: string;
  assessment_id: string;
  question_id: string;
  value: any;
  attachments?: any[];
  created_at: string;
  updated_at: string;
}

const STORAGE_KEYS = {
  ASSESSMENTS: 'impactsoluce_assessments',
  CURRENT_USER: 'impactsoluce_current_user',
  USER_PREFERENCES: 'impactsoluce_preferences',
};

export const localStorageService = {
  saveAssessment: (assessment: StoredAssessment): void => {
    try {
      const assessments = localStorageService.getAllAssessments();
      const index = assessments.findIndex((a) => a.id === assessment.id);

      if (index >= 0) {
        assessments[index] = assessment;
      } else {
        assessments.push(assessment);
      }

      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));
    } catch (error) {
      console.error('Error saving assessment to local storage:', error);
    }
  },

  getAssessment: (id: string): StoredAssessment | null => {
    try {
      const assessments = localStorageService.getAllAssessments();
      return assessments.find((a) => a.id === id) || null;
    } catch (error) {
      console.error('Error retrieving assessment from local storage:', error);
      return null;
    }
  },

  getAllAssessments: (): StoredAssessment[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving assessments from local storage:', error);
      return [];
    }
  },

  deleteAssessment: (id: string): void => {
    try {
      const assessments = localStorageService.getAllAssessments();
      const filtered = assessments.filter((a) => a.id !== id);
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting assessment from local storage:', error);
    }
  },

  getCurrentUser: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error retrieving user from local storage:', error);
      return null;
    }
  },

  setCurrentUser: (user: any) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to local storage:', error);
    }
  },

  clearCurrentUser: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch (error) {
      console.error('Error clearing user from local storage:', error);
    }
  },

  getUserPreferences: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error retrieving preferences from local storage:', error);
      return {};
    }
  },

  setUserPreferences: (preferences: any) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences to local storage:', error);
    }
  },

  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  },

  exportData: (): string => {
    try {
      const data = {
        assessments: localStorageService.getAllAssessments(),
        user: localStorageService.getCurrentUser(),
        preferences: localStorageService.getUserPreferences(),
        exportedAt: new Date().toISOString(),
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '{}';
    }
  },

  importData: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);

      if (data.assessments) {
        localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(data.assessments));
      }
      if (data.user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data.user));
      }
      if (data.preferences) {
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(data.preferences));
      }

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },
};
