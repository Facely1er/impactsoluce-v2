import { describe, it, expect, beforeEach } from 'vitest';
import { 
  validateAssessmentResponse, 
  validateRequiredFields,
  validateFileUpload,
  validateEmail,
  validateUrl,
  sanitizeInput
} from '../validation';

describe('Validation Utilities', () => {
  describe('validateAssessmentResponse', () => {
    it('validates a valid assessment response', () => {
      const validResponse = {
        questionId: 'q1',
        value: 'test answer',
        timestamp: new Date().toISOString()
      };
      
      const result = validateAssessmentResponse(validResponse);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validResponse);
    });

    it('rejects an invalid assessment response', () => {
      const invalidResponse = {
        questionId: '',
        value: '',
        timestamp: 'not-a-date'
      };
      
      const result = validateAssessmentResponse(invalidResponse);
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('validates numeric values', () => {
      const numericResponse = {
        questionId: 'q1',
        value: 42,
        timestamp: new Date().toISOString()
      };
      
      const result = validateAssessmentResponse(numericResponse);
      expect(result.success).toBe(true);
    });

    it('validates array values', () => {
      const arrayResponse = {
        questionId: 'q1',
        value: ['option1', 'option2'],
        timestamp: new Date().toISOString()
      };
      
      const result = validateAssessmentResponse(arrayResponse);
      expect(result.success).toBe(true);
    });
  });

  describe('validateRequiredFields', () => {
    it('validates when all required fields are present', () => {
      const responses = {
        q1: { questionId: 'q1', value: 'answer1', timestamp: new Date().toISOString() },
        q2: { questionId: 'q2', value: 'answer2', timestamp: new Date().toISOString() }
      };
      
      const result = validateRequiredFields(responses, ['q1', 'q2']);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('fails validation when required fields are missing', () => {
      const responses = {
        q1: { questionId: 'q1', value: 'answer1', timestamp: new Date().toISOString() }
      };
      
      const result = validateRequiredFields(responses, ['q1', 'q2']);
      expect(result.isValid).toBe(false);
      expect(result.errors.q2).toBeDefined();
    });

    it('fails validation when required fields have empty values', () => {
      const responses = {
        q1: { questionId: 'q1', value: '', timestamp: new Date().toISOString() },
        q2: { questionId: 'q2', value: 'answer2', timestamp: new Date().toISOString() }
      };
      
      const result = validateRequiredFields(responses, ['q1', 'q2']);
      expect(result.isValid).toBe(false);
      expect(result.errors.q1).toBeDefined();
    });
  });

  describe('validateFileUpload', () => {
    let mockFile: File;
    
    beforeEach(() => {
      // Create a mock file
      const blob = new Blob(['test file content'], { type: 'text/plain' });
      mockFile = new File([blob], 'test.txt', { type: 'text/plain' });
    });
    
    it('validates a valid file', () => {
      const result = validateFileUpload(mockFile, ['text/plain'], 10);
      expect(result.isValid).toBe(true);
    });
    
    it('rejects a file with invalid type', () => {
      const result = validateFileUpload(mockFile, ['application/pdf'], 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File type');
    });
    
    it('rejects a file that exceeds size limit', () => {
      // Mock a file size calculation that would exceed the limit
      Object.defineProperty(mockFile, 'size', { value: 11 * 1024 * 1024 });
      
      const result = validateFileUpload(mockFile, ['text/plain'], 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('size exceeds');
    });
  });

  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('user.name@example.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });
    
    it('rejects invalid email addresses', () => {
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user@example')).toBe(false);
      expect(validateEmail('user.example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validateUrl', () => {
    it('validates correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://example.com/path?query=value')).toBe(true);
    });
    
    it('rejects invalid URLs', () => {
      expect(validateUrl('example.com')).toBe(false);
      expect(validateUrl('not a url')).toBe(false);
      expect(validateUrl('')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('trims whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('test');
    });
    
    it('limits length', () => {
      const longString = 'a'.repeat(2000);
      expect(sanitizeInput(longString).length).toBe(1000);
    });
    
    it('removes potential HTML tags', () => {
      expect(sanitizeInput('<script>alert("XSS")</script>')).toBe('scriptalert("XSS")/script');
    });
  });
});