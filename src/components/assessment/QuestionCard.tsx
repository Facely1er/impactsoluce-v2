import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { AssessmentQuestion, FileAttachment } from '../../types';
import { Check, Upload, X, AlertCircle, Info } from 'lucide-react';
import FrameworkIndicator from './FrameworkIndicator';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

interface QuestionCardProps {
  question: AssessmentQuestion;
  value: string | number | string[] | null;
  onChange: (value: string | number | string[], files?: File[], attachments?: FileAttachment[]) => void;
  error?: string;
  industryBenchmark?: number;
  isRequired?: boolean;
  initialAttachments?: FileAttachment[];
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  value,
  onChange,
  error,
  industryBenchmark,
  isRequired = false,
  initialAttachments = [],
}) => {
  const { t } = useTranslation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = React.useState<string>('');
  const [attachments, setAttachments] = React.useState<FileAttachment[]>(initialAttachments);

  // Update attachments when initialAttachments changes
  React.useEffect(() => {
    setAttachments(initialAttachments);
  }, [initialAttachments]);

  // File validation constants
  const ALLOWED_FILE_TYPES = [
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

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File "${file.name}" exceeds 50MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`
      };
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: `File type "${file.type}" is not allowed for "${file.name}"`
      };
    }

    // Check file name
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return {
        isValid: false,
        error: `Invalid file name: "${file.name}"`
      };
    }

    if (file.name.length > 255) {
      return {
        isValid: false,
        error: `File name too long: "${file.name}" (max 255 characters)`
      };
    }

    return { isValid: true };
  };

  const handleMultipleChoiceChange = (option: string, isMulti: boolean = false) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(option)
        ? currentValues.filter(v => v !== option)
        : [...currentValues, option];
      onChange(newValues, undefined, attachments);
    } else {
      onChange(option, undefined, attachments);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setUploadError('');
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      const validation = validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors.push(validation.error!);
      }
    });

    if (errors.length > 0) {
      setUploadError(errors.join('; '));
      return;
    }

    if (validFiles.length > 0) {
      // Create temporary file attachments for display
      const newAttachments: FileAttachment[] = validFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: '', // Will be set after upload
        uploadedAt: new Date().toISOString(),
        description: `Pending upload: ${file.name}`
      }));

      const updatedAttachments = [...attachments, ...newAttachments];
      setAttachments(updatedAttachments);
      onChange(value || '', validFiles, updatedAttachments);
    }

    // Reset input
    event.target.value = '';
  };

  const handleRemoveAttachment = (index: number) => {
    const updatedAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(updatedAttachments);
    onChange(value || '', undefined, updatedAttachments);
  };

  const renderInput = () => {
    switch (question.type) {
      case 'file':
        return (
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple={question.multiSelect}
              accept={ALLOWED_FILE_TYPES.join(',')}
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              icon={<Upload className="h-4 w-4" />}
            >
              {t('Upload Files')}
            </Button>

            {/* Display attached files */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {attachment.type} • {(attachment.size / 1024 / 1024).toFixed(2)}MB
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveAttachment(index)}
                      className="text-red-500 hover:text-red-600 flex-shrink-0"
                      aria-label={t('Remove file')}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* File upload guidelines */}
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p className="flex items-center gap-1">
                <Info className="h-3 w-3" />
                {t('Accepted formats')}: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, TXT, CSV
              </p>
              <p>{t('Max size')}: 50MB per file</p>
            </div>

            {/* Upload error */}
            {uploadError && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        );

      case 'multiple_choice':
        const isMulti = question.multiSelect;
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option}
                className={cn(
                  "relative flex items-center p-4 rounded-lg border transition-all cursor-pointer",
                  "hover:bg-gray-50 dark:hover:bg-gray-800",
                  ((isMulti && Array.isArray(value) && value.includes(option)) ||
                    (!isMulti && value === option))
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-gray-200 dark:border-gray-700"
                )}
              >
                <input
                  type={isMulti ? "checkbox" : "radio"}
                  name={question.id}
                  value={option}
                  checked={isMulti 
                    ? Array.isArray(value) && value.includes(option)
                    : value === option
                  }
                  onChange={() => handleMultipleChoiceChange(option, isMulti)}
                  className="sr-only"
                />
                <div className="flex-grow">
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {t(option)}
                  </span>
                  {question.optionDescriptions?.[option] && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {t(question.optionDescriptions[option])}
                    </p>
                  )}
                </div>
                {((isMulti && Array.isArray(value) && value.includes(option)) || 
                  (!isMulti && value === option)) && (
                  <Check className="h-5 w-5 text-primary ml-4" />
                )}
              </label>
            ))}
          </div>
        );

      case 'likert_scale':
        return (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {question.options?.map((option, index) => (
              <label
                key={option}
                className={cn(
                  "flex flex-col items-center p-4 rounded-lg border transition-all cursor-pointer",
                  "hover:bg-gray-50 dark:hover:bg-gray-800",
                  value === index.toString()
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-gray-200 dark:border-gray-700"
                )}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={index}
                  checked={value === index.toString()}
                  onChange={(e) => onChange(e.target.value, undefined, attachments)}
                  className="sr-only"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center mb-3">
                  {t(option)}
                </span>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold",
                  value === index.toString()
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                )}>
                  {index + 1}
                </div>
              </label>
            ))}
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <input
              type="number"
              value={value || ''}
              onChange={(e) => {
                const num = parseFloat(e.target.value);
                if (!isNaN(num)) {
                  if (question.validation?.min !== undefined && num < question.validation.min) return;
                  if (question.validation?.max !== undefined && num > question.validation.max) return;
                  onChange(num, undefined, attachments);
                }
              }}
              min={question.validation?.min}
              max={question.validation?.max}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg transition-colors",
                "border border-gray-300 dark:border-gray-700",
                "focus:ring-2 focus:ring-primary focus:border-primary",
                "dark:bg-gray-800 dark:text-white",
                error ? "border-red-500 focus:ring-red-500" : ""
              )}
            />
            {industryBenchmark !== undefined && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Info className="h-4 w-4" />
                {t('Industry Average')}: {industryBenchmark}
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value, undefined, attachments)}
            className={cn(
              "w-full px-4 py-2.5 rounded-lg transition-colors",
              "border border-gray-300 dark:border-gray-700",
              "focus:ring-2 focus:ring-primary focus:border-primary",
              "dark:bg-gray-800 dark:text-white",
              error ? "border-red-500 focus:ring-red-500" : ""
            )}
          />
        );
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200",
      error ? "border-red-200 dark:border-red-800" : ""
    )}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-start gap-2">
              <span>{t(question.question)}</span>
              {isRequired && (
                <span className="text-red-500">*</span>
              )}
            </CardTitle>
            {question.description && (
              <CardDescription>{t(question.description)}</CardDescription>
            )}
          </div>
          {question.frameworks && (
            <FrameworkIndicator frameworks={question.frameworks} />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderInput()}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;