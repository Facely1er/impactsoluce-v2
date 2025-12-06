import { useState, useCallback } from 'react';
import { validateAssessmentResponse, validateRequiredFields } from '../utils/validation';
import { AssessmentResponse, AssessmentQuestion } from '../types';

export const useAssessmentValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateResponse = useCallback((
    response: AssessmentResponse,
    question: AssessmentQuestion
  ) => {
    const result = validateAssessmentResponse(response);
    
    if (!result.success) {
      setErrors(prev => ({
        ...prev,
        [question.id]: 'Invalid response format'
      }));
      return false;
    }

    if (question.required && !response.value) {
      setErrors(prev => ({
        ...prev,
        [question.id]: 'This field is required'
      }));
      return false;
    }

    if (question.validation) {
      if (typeof response.value === 'number') {
        const { min, max } = question.validation;
        if (min !== undefined && response.value < min) {
          setErrors(prev => ({
            ...prev,
            [question.id]: `Value must be at least ${min}`
          }));
          return false;
        }
        if (max !== undefined && response.value > max) {
          setErrors(prev => ({
            ...prev,
            [question.id]: `Value must be at most ${max}`
          }));
          return false;
        }
      }
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[question.id];
      return newErrors;
    });
    return true;
  }, []);

  const validateSection = useCallback((
    responses: Record<string, AssessmentResponse>,
    questions: AssessmentQuestion[]
  ) => {
    const requiredFields = questions
      .filter(q => q.required)
      .map(q => q.id);

    const { isValid, errors: validationErrors } = validateRequiredFields(
      responses,
      requiredFields
    );

    setErrors(validationErrors);
    return isValid;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateResponse,
    validateSection,
    clearErrors
  };
};