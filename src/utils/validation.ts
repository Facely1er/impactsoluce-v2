import { z } from 'zod';
import { FileAttachment } from '../types';

// File attachment schema
export const fileAttachmentSchema = z.object({
  name: z.string().min(1, 'File name is required').max(255, 'File name too long'),
  type: z.string().min(1, 'File type is required'),
  size: z.number().min(1, 'File size must be greater than 0').max(52428800, 'File size exceeds 50MB limit'),
  url: z.string().url('Invalid file URL'),
  uploadedAt: z.string().datetime('Invalid upload timestamp'),
  description: z.string().optional()
});

export const assessmentResponseSchema = z.object({
  questionId: z.string().min(1, 'Question ID is required'),
  value: z.union([
    z.string(),
    z.number(),
    z.array(z.string())
  ]).refine(val => {
    // Check that value is not empty
    if (typeof val === 'string') return val.trim().length > 0;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'number') return !isNaN(val);
    return false;
  }, 'Value cannot be empty'),
  timestamp: z.string().datetime('Invalid timestamp format'),
  files: z.array(z.instanceof(File)).optional(),
  attachments: z.array(fileAttachmentSchema).optional()
});

export const validateAssessmentResponse = (data: unknown) => {
  try {
    const result = assessmentResponseSchema.safeParse(data);
    return {
      success: result.success,
      data: result.success ? result.data : null,
      errors: result.success ? [] : result.error.errors.map(err => err.message)
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      errors: ['Validation failed due to unexpected error']
    };
  }
};

export const validateRequiredFields = (
  responses: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  for (const field of requiredFields) {
    const response = responses[field];
    
    if (!response || response.value === undefined || response.value === null) {
      errors[field] = 'This field is required';
      continue;
    }
    
    // Check for empty values based on type
    if (typeof response.value === 'string' && response.value.trim() === '') {
      errors[field] = 'This field is required';
    } else if (Array.isArray(response.value) && response.value.length === 0) {
      errors[field] = 'Please select at least one option';
    } else if (typeof response.value === 'number' && isNaN(response.value)) {
      errors[field] = 'Please enter a valid number';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateFileUpload = (
  file: File,
  allowedTypes?: string[],
  maxSizeInMB?: number
): { isValid: boolean; error?: string } => {
  // Default allowed types
  const defaultAllowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain',
    'text/csv'
  ];

  const typesToCheck = allowedTypes || defaultAllowedTypes;
  const maxSize = (maxSizeInMB || 50) * 1024 * 1024;

  // Check file type
  if (typesToCheck.length > 0) {
    const isValidType = typesToCheck.includes(file.type);
    
    if (!isValidType) {
      return {
        isValid: false,
        error: `File type "${file.type}" not allowed. Accepted types: ${typesToCheck.join(', ')}`
      };
    }
  }
  
  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeInMB || 50}MB limit (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`
    };
  }

  // Check file name for security
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    return {
      isValid: false,
      error: 'Invalid file name. File names cannot contain path traversal characters.'
    };
  }

  // Check file name length
  if (file.name.length > 255) {
    return {
      isValid: false,
      error: 'File name too long. Maximum 255 characters allowed.'
    };
  }
  
  return { isValid: true };
};

export const validateFileAttachment = (attachment: FileAttachment): { isValid: boolean; error?: string } => {
  try {
    fileAttachmentSchema.parse(attachment);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors.map(e => e.message).join('; ')
      };
    }
    return {
      isValid: false,
      error: 'Invalid file attachment format'
    };
  }
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate file extension against MIME type
export const validateFileExtensionMimeType = (fileName: string, mimeType: string): boolean => {
  const extensionMimeMap: Record<string, string[]> = {
    '.pdf': ['application/pdf'],
    '.doc': ['application/msword'],
    '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    '.xls': ['application/vnd.ms-excel'],
    '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    '.jpg': ['image/jpeg'],
    '.jpeg': ['image/jpeg'],
    '.png': ['image/png'],
    '.gif': ['image/gif'],
    '.webp': ['image/webp'],
    '.txt': ['text/plain'],
    '.csv': ['text/csv', 'application/csv']
  };

  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  const allowedMimeTypes = extensionMimeMap[extension];
  
  return allowedMimeTypes ? allowedMimeTypes.includes(mimeType) : false;
};