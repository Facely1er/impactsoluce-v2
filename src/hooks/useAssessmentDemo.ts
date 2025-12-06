import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useAssessmentDemo = () => {
  const [searchParams] = useSearchParams();
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Check if we're in development or test mode
  const isDevMode = process.env.NODE_ENV === 'development';
  const isTestMode = process.env.NODE_ENV === 'test';
  
  // Check if demo mode is enabled via environment variable
  const isDemoEnabled = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';

  useEffect(() => {
    const demoParam = searchParams.get('demo');
    setIsDemoMode(demoParam === 'true' || isDemoEnabled || isDevMode || isTestMode);
  }, [searchParams, isDevMode, isTestMode, isDemoEnabled]);

  return {
    isDemoMode,
    getDemoData: () => ({
      assessmentId: 'demo-assessment-id',
      responses: {
        'org_size': {
          questionId: 'org_size',
          value: '201-1000',
          timestamp: new Date().toISOString()
        },
        'industry': {
          questionId: 'industry',
          value: 'Technology',
          timestamp: new Date().toISOString()
        },
        'region': {
          questionId: 'region',
          value: 'North America',
          timestamp: new Date().toISOString()
        },
        'env_policy': {
          questionId: 'env_policy',
          value: '3',
          timestamp: new Date().toISOString()
        },
        'carbon_tracking': {
          questionId: 'carbon_tracking',
          value: '2',
          timestamp: new Date().toISOString()
        },
        'renewable_energy': {
          questionId: 'renewable_energy',
          value: 35,
          timestamp: new Date().toISOString()
        },
        'diversity_inclusion': {
          questionId: 'diversity_inclusion',
          value: '2',
          timestamp: new Date().toISOString()
        },
        'employee_development': {
          questionId: 'employee_development',
          value: '3',
          timestamp: new Date().toISOString()
        },
        'board_oversight': {
          questionId: 'board_oversight',
          value: '2',
          timestamp: new Date().toISOString()
        },
        'risk_management': {
          questionId: 'risk_management',
          value: '3',
          timestamp: new Date().toISOString()
        }
      },
      progress: 100,
      status: 'submitted',
      totalScore: 68
    })
  };
};