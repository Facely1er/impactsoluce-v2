import { createClient } from '@supabase/supabase-js';
import { Database, FileAttachment, Tables, Json } from './database.types';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SCHEMA, FILE_UPLOAD, APP_ENV, HAS_DATABASE } from './config';
import { UPLOAD_RATE_LIMITER, enforceRateLimit } from '../utils/rateLimiter';
import { reportError } from '../utils/errorReporting';
import { localStorageService, StoredAssessment } from '../utils/localStorage';

// Log application mode
if (!HAS_DATABASE) {
  console.info('✓ Running in standalone mode - all data stored locally');
  console.info('  To enable backend persistence, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
  console.info('  Using shared database with AgroSoluce: https://nuwfdvwqiynzhbbsqagw.supabase.co');
} else {
  console.info('✓ Database connected - using shared Supabase database for data persistence');
  console.info(`  Schema: ${SUPABASE_SCHEMA}`);
  console.info('  Shared with AgroSoluce: https://nuwfdvwqiynzhbbsqagw.supabase.co');
}

// Use fallback values if Supabase is not configured (for standalone mode)
// Using shared database with AgroSoluce: https://nuwfdvwqiynzhbbsqagw.supabase.co
// NOTE: Never hardcode API keys or secrets. Always use environment variables.
// If SUPABASE_ANON_KEY is not set, the app will run in standalone mode without database.
const supabaseUrl = SUPABASE_URL || 'https://nuwfdvwqiynzhbbsqagw.supabase.co';
const supabaseKey = SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: SUPABASE_SCHEMA,
  },
  global: {
    fetch: (...args) => {
      if (APP_ENV === 'development') {
        console.log('Supabase fetch:', args[0]);
      }
      return fetch(...args);
    },
  },
});

// Export database availability flag
export const isSupabaseConfigured = HAS_DATABASE;

// Server-side file validation
const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size
  if (file.size > FILE_UPLOAD.MAX_SIZE_MB * 1024 * 1024) {
    return {
      isValid: false,
      error: `File size exceeds ${FILE_UPLOAD.MAX_SIZE_MB}MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    };
  }

  // Check file type
  const isValidType = FILE_UPLOAD.ALLOWED_TYPES.includes(file.type);
  const isValidExtension = FILE_UPLOAD.ALLOWED_EXTENSIONS.some(ext => 
    file.name.toLowerCase().endsWith(ext.toLowerCase())
  );

  if (!isValidType && !isValidExtension) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${FILE_UPLOAD.ALLOWED_EXTENSIONS.join(', ')}`
    };
  }

  // Check for potentially malicious file names
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

export const uploadFileToStorage = async (file: File, path?: string): Promise<FileAttachment> => {
  try {
    // Check rate limit for uploads
    const rateLimit = enforceRateLimit(UPLOAD_RATE_LIMITER);
    if (!rateLimit.allowed) {
      throw new Error(`Upload rate limit exceeded. Try again in ${Math.ceil(rateLimit.timeUntilReset / 1000)} seconds.`);
    }

    // Check if we're in development, test, or demo mode
    const isDevMode = process.env.NODE_ENV === 'development';
    const isTestMode = process.env.NODE_ENV === 'test';
    const isDemoMode = !isSupabaseConfigured ||
                      import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' ||
                      new URLSearchParams(window.location.search).get('demo') === 'true';

    // For development, testing, or demo mode, we can bypass authentication
    let userId = 'demo-user-id';
    
    if (!isDevMode && !isTestMode && !isDemoMode) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to upload files');
      }
      
      userId = user.id;
    }

    // Server-side validation
    const validation = validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Generate secure file name
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}_${randomString}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : `${userId}/${fileName}`;
    
    // For development, testing, or demo mode, we can return a mock response
    if (isDevMode || isTestMode || isDemoMode) {
      // Create a mock public URL
      const mockPublicUrl = `https://example.com/storage/assessment-files/${filePath}`;
      
      // Return structured file attachment
      return {
        name: file.name,
        type: file.type,
        size: file.size,
        url: mockPublicUrl,
        uploadedAt: new Date().toISOString(),
        description: `Uploaded file: ${file.name} (DEMO MODE)`
      };
    }
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('assessment-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('assessment-files')
      .getPublicUrl(data.path);

    // Return structured file attachment
    const attachment: FileAttachment = {
      name: file.name,
      type: file.type,
      size: file.size,
      url: publicUrl.publicUrl,
      uploadedAt: new Date().toISOString(),
      description: `Uploaded file: ${file.name}`
    };

    return attachment;
  } catch (error) {
    console.error('Error uploading file:', error);
    if (error instanceof Error) {
      reportError(error, { context: 'file_upload', fileName: file.name, fileSize: file.size });
    }
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

interface AssessmentResponse {
  value: unknown;
  files?: File[];
  attachments?: FileAttachment[];
  evidence?: unknown;
}

export const saveAssessment = async (assessmentData: {
  responses: Record<string, AssessmentResponse>;
  totalScore?: number;
  status?: 'draft' | 'submitted';
  assessmentId?: string;
}) => {
  try {
    // Check if we're in development, test, or demo mode
    const isDevMode = process.env.NODE_ENV === 'development';
    const isTestMode = process.env.NODE_ENV === 'test';
    const isDemoMode = !isSupabaseConfigured ||
                      import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' ||
                      new URLSearchParams(window.location.search).get('demo') === 'true';

    // For development, testing, or demo mode, we can bypass authentication
    let userId = 'demo-user-id';
    
    if (!isDevMode && !isTestMode && !isDemoMode) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to save assessments');
      }
      
      userId = user.id;
    }

    // Create or update assessment record
    const assessmentPayload = {
      user_id: userId,
      submission_date: assessmentData.status === 'submitted' ? new Date().toISOString() : null,
      total_score: assessmentData.totalScore ?? null,
      status: assessmentData.status || 'draft',
      metadata: {
        lastModified: new Date().toISOString(),
        responseCount: Object.keys(assessmentData.responses).length
      }
    };

    // For development, testing, or demo mode, use local storage
    if (isDevMode || isTestMode || isDemoMode) {
      const assessmentId = assessmentData.assessmentId || `assessment-${Date.now()}`;
      const timestamp = new Date().toISOString();

      const storedAssessment: StoredAssessment = {
        id: assessmentId,
        ...assessmentPayload,
        total_score: assessmentPayload.total_score ?? null,
        created_at: timestamp,
        updated_at: timestamp,
        responses: Object.entries(assessmentData.responses).map(([questionId, response]: [string, AssessmentResponse]) => ({
          id: `response-${questionId}-${Date.now()}`,
          assessment_id: assessmentId,
          question_id: questionId,
          value: response.value,
          attachments: response.attachments || [],
          created_at: timestamp,
          updated_at: timestamp,
        })),
      };

      localStorageService.saveAssessment(storedAssessment);

      return storedAssessment;
    }

    let assessment: Tables<'assessments'>;
    if (assessmentData.assessmentId) {
      // Update existing assessment
      const { data, error } = await supabase
        .from('assessments')
        .update(assessmentPayload)
        .eq('id', assessmentData.assessmentId)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      assessment = data;
    } else {
      // Create new assessment
      const { data, error } = await supabase
        .from('assessments')
        .insert(assessmentPayload)
        .select()
        .single();
      
      if (error) throw error;
      assessment = data;
    }

    // Process responses and handle file uploads
    const processedResponses = await Promise.all(
      Object.entries(assessmentData.responses).map(async ([questionId, response]) => {
        let attachments: FileAttachment[] = [];

        // Handle file uploads if present
        if (response.files?.length) {
          try {
            const uploadPromises = response.files.map(async (file: File) => {
              return await uploadFileToStorage(file, `assessment-${assessment.id}`);
            });

            attachments = await Promise.all(uploadPromises);
          } catch (uploadError) {
            console.warn('File upload failed for question', questionId, uploadError);
            throw new Error(`File upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
          }
        }

        // Merge with existing attachments
        if (response.attachments?.length) {
          attachments = [...attachments, ...response.attachments];
        }

        return {
          assessment_id: assessment.id,
          question_id: questionId,
          value: response.value as Json,
          attachments: JSON.parse(JSON.stringify(attachments)) as Json, // Convert FileAttachment[] to Json
          // Keep legacy columns for backward compatibility during migration
          files: (response.files?.map((f: File) => f.name) || []) as Json,
          evidence: (response.evidence || []) as Json
        };
      })
    );

    // Save all responses using upsert to handle updates
    const { error: responsesError } = await supabase
      .from('assessment_responses')
      .upsert(processedResponses, {
        onConflict: 'assessment_id,question_id'
      });

    if (responsesError) {
      console.error('Error saving responses:', responsesError);
      throw new Error(`Failed to save responses: ${responsesError.message}`);
    }

    return assessment;
  } catch (error) {
    console.error('Error saving assessment:', error);
    throw new Error(`Failed to save assessment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getAssessment = async (assessmentId: string) => {
  try {
    // Check if we're in development, test, or demo mode
    const isDevMode = process.env.NODE_ENV === 'development';
    const isTestMode = process.env.NODE_ENV === 'test';
    const isDemoMode = !isSupabaseConfigured ||
                      import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' ||
                      new URLSearchParams(window.location.search).get('demo') === 'true';

    // For development, testing, or demo mode, use local storage
    if (isDevMode || isTestMode || isDemoMode) {
      const stored = localStorageService.getAssessment(assessmentId);

      if (stored) {
        return {
          assessment: {
            id: stored.id,
            user_id: stored.user_id,
            status: stored.status,
            total_score: stored.total_score,
            submission_date: stored.submission_date,
            created_at: stored.created_at,
            updated_at: stored.updated_at,
            metadata: stored.metadata,
          },
          responses: stored.responses,
        };
      }

      // Return empty assessment if not found
      return {
        assessment: null,
        responses: [],
      };
    }
    
    // For production, get real data from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to access assessments');
    }

    const [assessmentResult, responsesResult] = await Promise.all([
      supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('assessment_responses')
        .select('*')
        .eq('assessment_id', assessmentId)
    ]);

    if (assessmentResult.error) {
      if (assessmentResult.error.code === 'PGRST116') {
        throw new Error('Assessment not found or access denied');
      }
      throw assessmentResult.error;
    }
    
    if (responsesResult.error) throw responsesResult.error;

    return {
      assessment: assessmentResult.data,
      responses: responsesResult.data
    };
  } catch (error) {
    console.error('Error fetching assessment:', error);
    throw new Error(`Failed to fetch assessment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getAssessmentHistory = async () => {
  try {
    // Check if we're in development, test, or demo mode
    const isDevMode = process.env.NODE_ENV === 'development';
    const isTestMode = process.env.NODE_ENV === 'test';
    const isDemoMode = !isSupabaseConfigured ||
                      import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' ||
                      new URLSearchParams(window.location.search).get('demo') === 'true';

    // For development, testing, or demo mode, use local storage
    if (isDevMode || isTestMode || isDemoMode) {
      const assessments = localStorageService.getAllAssessments();

      return assessments.map((a) => ({
        id: a.id,
        user_id: a.user_id,
        status: a.status,
        total_score: a.total_score,
        submission_date: a.submission_date,
        created_at: a.created_at,
        updated_at: a.updated_at,
        metadata: a.metadata,
        assessment_responses: a.responses,
      }));
    }
    
    // For production, get real data from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to access assessment history');
    }

    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        assessment_responses (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching assessment history:', error);
    throw new Error(`Failed to fetch assessment history: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper function to check authentication status
export const checkAuthStatus = async () => {
  try {
    // Check if we're in development, test, or demo mode
    const isDevMode = process.env.NODE_ENV === 'development';
    const isTestMode = process.env.NODE_ENV === 'test';
    const isDemoMode = !isSupabaseConfigured ||
                      import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' ||
                      new URLSearchParams(window.location.search).get('demo') === 'true';

    // For development, testing, or demo mode, we can bypass authentication
    if (isDevMode || isTestMode || isDemoMode) {
      return { 
        user: {
          id: 'demo-user-id',
          email: 'demo@impactsoluce.com',
          user_metadata: {
            first_name: 'Demo',
            last_name: 'User',
            company: 'Demo Company',
          }
        }, 
        isAuthenticated: true 
      };
    }
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    // Handle the case where there's no session gracefully
    if (error && error.message === 'Auth session missing!') {
      return { user: null, isAuthenticated: false };
    }
    
    if (error) {
      console.error('Unexpected auth error:', error);
      return { user: null, isAuthenticated: false };
    }
    
    return { user, isAuthenticated: !!user };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return { user: null, isAuthenticated: false };
  }
};

// Helper function for sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Helper function to delete file from storage
export const deleteFileFromStorage = async (filePath: string): Promise<void> => {
  try {
    // Check if we're in development, test, or demo mode
    const isDevMode = process.env.NODE_ENV === 'development';
    const isTestMode = process.env.NODE_ENV === 'test';
    const isDemoMode = !isSupabaseConfigured ||
                      import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' ||
                      new URLSearchParams(window.location.search).get('demo') === 'true';

    // For development, testing, or demo mode, we can bypass authentication
    if (isDevMode || isTestMode || isDemoMode) {
      console.log('Demo mode: Simulating file deletion for', filePath);
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to delete files');
    }

    const { error } = await supabase.storage
      .from('assessment-files')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Helper function to get file metadata
export const getFileMetadata = async (filePath: string) => {
  try {
    // Check if we're in development, test, or demo mode
    const isDevMode = process.env.NODE_ENV === 'development';
    const isTestMode = process.env.NODE_ENV === 'test';
    const isDemoMode = !isSupabaseConfigured ||
                      import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' ||
                      new URLSearchParams(window.location.search).get('demo') === 'true';

    // For development, testing, or demo mode, we can return mock data
    if (isDevMode || isTestMode || isDemoMode) {
      return {
        name: filePath.split('/').pop() || 'demo-file',
        metadata: {
          size: 1024 * 1024, // 1MB
          mimetype: 'application/pdf',
          cacheControl: 'max-age=3600',
          lastModified: new Date().toISOString()
        }
      };
    }
    
    const { data, error } = await supabase.storage
      .from('assessment-files')
      .list(filePath.split('/').slice(0, -1).join('/'), {
        search: filePath.split('/').pop()
      });

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error getting file metadata:', error);
    return null;
  }
};