import { useState, useCallback } from 'react';
import { uploadFileToStorage, deleteFileFromStorage } from '../lib/supabase';
import { FileAttachment } from '../types';
import { validateFileUpload } from '../utils/validation';
import { useToast } from './useToast';
import { FILE_UPLOAD } from '../lib/config';

interface UseFileUploadOptions {
  maxFiles?: number;
  maxSizeMB?: number;
  allowedTypes?: string[];
  path?: string;
}

interface FileUploadState {
  files: File[];
  attachments: FileAttachment[];
  uploading: boolean;
  progress: number;
  error: string | null;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const {
    maxFiles = 10,
    maxSizeMB = FILE_UPLOAD.MAX_SIZE_MB,
    allowedTypes = FILE_UPLOAD.ALLOWED_TYPES,
    path = ''
  } = options;
  
  const [state, setState] = useState<FileUploadState>({
    files: [],
    attachments: [],
    uploading: false,
    progress: 0,
    error: null
  });
  
  const { addToast } = useToast();

  // Validate files before upload
  const validateFiles = useCallback((files: File[]): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    // Check if adding these files would exceed the max files limit
    if (state.files.length + files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return { valid: [], errors };
    }
    
    // Validate each file
    files.forEach(file => {
      const validation = validateFileUpload(file, allowedTypes, maxSizeMB);
      if (validation.isValid) {
        validFiles.push(file);
      } else if (validation.error) {
        errors.push(validation.error);
      }
    });
    
    return { valid: validFiles, errors };
  }, [state.files.length, maxFiles, allowedTypes, maxSizeMB]);

  // Add files to state (without uploading)
  const addFiles = useCallback((newFiles: FileList | File[]): { success: boolean; errors: string[] } => {
    const filesToAdd = Array.from(newFiles);
    const { valid, errors } = validateFiles(filesToAdd);
    
    if (valid.length > 0) {
      setState(prev => ({
        ...prev,
        files: [...prev.files, ...valid],
        error: errors.length > 0 ? errors.join('; ') : null
      }));
    } else if (errors.length > 0) {
      setState(prev => ({
        ...prev,
        error: errors.join('; ')
      }));
    }
    
    return {
      success: valid.length > 0,
      errors
    };
  }, [validateFiles]);

  // Upload files to storage
  const uploadFiles = useCallback(async (customPath?: string): Promise<{ success: boolean; attachments: FileAttachment[] }> => {
    const { files } = state;
    
    if (files.length === 0) {
      return { success: true, attachments: [] };
    }
    
    setState(prev => ({
      ...prev,
      uploading: true,
      progress: 0,
      error: null
    }));
    
    try {
      const uploadPath = customPath || path;
      const totalFiles = files.length;
      const newAttachments: FileAttachment[] = [];
      
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const attachment = await uploadFileToStorage(file, uploadPath);
        newAttachments.push(attachment);
        
        // Update progress
        setState(prev => ({
          ...prev,
          progress: Math.round(((i + 1) / totalFiles) * 100)
        }));
      }
      
      setState(prev => ({
        ...prev,
        files: [],
        attachments: [...prev.attachments, ...newAttachments],
        uploading: false,
        progress: 100
      }));
      
      return { success: true, attachments: newAttachments };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'File upload failed';
      
      setState(prev => ({
        ...prev,
        uploading: false,
        error: errorMessage
      }));
      
      addToast('error', 'Upload failed', errorMessage);
      return { success: false, attachments: [] };
    }
  }, [state, path, addToast]);

  // Remove a file from state (before upload)
  const removeFile = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
      error: null
    }));
  }, []);

  // Remove an attachment (after upload)
  const removeAttachment = useCallback(async (index: number): Promise<boolean> => {
    const attachment = state.attachments[index];
    if (!attachment) return false;
    
    try {
      // Extract file path from URL
      const url = new URL(attachment.url);
      const filePath = url.pathname.replace('/storage/v1/object/public/assessment-files/', '');
      
      await deleteFileFromStorage(filePath);
      
      setState(prev => ({
        ...prev,
        attachments: prev.attachments.filter((_, i) => i !== index),
        error: null
      }));
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove file';
      
      setState(prev => ({
        ...prev,
        error: errorMessage
      }));
      
      addToast('error', 'Remove failed', errorMessage);
      return false;
    }
  }, [state.attachments, addToast]);

  // Reset the state
  const reset = useCallback(() => {
    setState({
      files: [],
      attachments: [],
      uploading: false,
      progress: 0,
      error: null
    });
  }, []);

  // Set initial attachments (e.g., when loading existing data)
  const setInitialAttachments = useCallback((attachments: FileAttachment[]) => {
    setState(prev => ({
      ...prev,
      attachments,
      error: null
    }));
  }, []);

  return {
    ...state,
    addFiles,
    uploadFiles,
    removeFile,
    removeAttachment,
    reset,
    setInitialAttachments
  };
};