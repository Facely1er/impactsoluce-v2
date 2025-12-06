import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, Check, AlertCircle, Info, File as FileIcon } from 'lucide-react';
import Button from './Button';
import { cn } from '../../utils/cn';
import { FileAttachment } from '../../types';
import { useFileUpload } from '../../hooks/useFileUpload';
import { FILE_UPLOAD } from '../../lib/config';

interface FileUploadProps {
  onChange: (files: File[], attachments: FileAttachment[]) => void;
  initialAttachments?: FileAttachment[];
  maxFiles?: number;
  maxSizeMB?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
  uploadPath?: string;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
  showFileList?: boolean;
  label?: string;
  description?: string;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onChange,
  initialAttachments = [],
  maxFiles = 10,
  maxSizeMB = FILE_UPLOAD.MAX_SIZE_MB,
  allowedTypes = FILE_UPLOAD.ALLOWED_TYPES,
  allowedExtensions = FILE_UPLOAD.ALLOWED_EXTENSIONS,
  uploadPath = '',
  className = '',
  disabled = false,
  multiple = true,
  showFileList = true,
  label,
  description,
  error: externalError,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const {
    files,
    attachments,
    uploading,
    progress,
    error: uploadError,
    addFiles,
    removeFile,
    removeAttachment,
    setInitialAttachments
  } = useFileUpload({
    maxFiles,
    maxSizeMB,
    allowedTypes,
    path: uploadPath
  });
  
  // Set initial attachments when they change
  React.useEffect(() => {
    setInitialAttachments(initialAttachments);
  }, [initialAttachments, setInitialAttachments]);
  
  // Notify parent component when files or attachments change
  React.useEffect(() => {
    onChange(files, attachments);
  }, [files, attachments, onChange]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = ''; // Reset input
    }
  };
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };
  
  const handleRemoveFile = (index: number) => {
    removeFile(index);
  };
  
  const handleRemoveAttachment = async (index: number) => {
    await removeAttachment(index);
  };
  
  const error = externalError || uploadError;
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('text')) return '📃';
    return '📎';
  };

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      {/* Drag & Drop area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-700",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          error ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10" : ""
        )}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          multiple={multiple}
          accept={allowedTypes.join(',')}
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
            <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('Drag and drop files here, or click to browse')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {allowedExtensions.join(', ')} • {t('Max size')}: {maxSizeMB}MB
          </p>
        </div>
      </div>
      
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      
      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* File list */}
      {showFileList && (
        <div className="space-y-2">
          {/* Pending files */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('Pending uploads')}
              </p>
              {files.map((file, index) => (
                <div
                  key={`file-${index}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-shrink-0 text-lg">{getFileIcon(file.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    disabled={disabled || uploading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Uploaded attachments */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('Uploaded files')}
              </p>
              {attachments.map((attachment, index) => (
                <div
                  key={`attachment-${index}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-shrink-0 text-lg">{getFileIcon(attachment.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <FileIcon className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(index)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    disabled={disabled || uploading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Upload progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('Uploading...')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {progress}%
            </p>
          </div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className="h-2 bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;