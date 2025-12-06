import { createClient } from '@supabase/supabase-js';
import { Database, FileAttachment } from './database.types';
import { SUPABASE_URL, SUPABASE_ANON_KEY, FILE_UPLOAD } from './config';
import { API_RATE_LIMITER, UPLOAD_RATE_LIMITER, enforceRateLimit } from '../utils/rateLimiter';
import { reportError } from '../utils/errorReporting';

// Validate Supabase configuration
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  const errorMessage = 'Missing Supabase environment variables. Please check your .env file.';
  console.error(errorMessage);
  
  // In production, throw an error to prevent app from running with invalid config
  if (APP_ENV === 'production') {
    throw new Error(errorMessage);
  }
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

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
    const isDemoMode = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' || 
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

export const saveAssessment = async (assessmentData: {
  responses: Record<string, any>;
  totalScore?: number;
  status?: 'draft' | 'submitted';
  assessmentId?: string;
}) => {
  try {
    // Check if we're in development, test, or demo mode
    const isDevMode = process.env.NODE_ENV === 'development';
    const isTestMode = process.env.NODE_ENV === 'test';
    const isDemoMode = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' || 
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
      total_score: assessmentData.totalScore,
      status: assessmentData.status || 'draft',
      metadata: {
        lastModified: new Date().toISOString(),
        responseCount: Object.keys(assessmentData.responses).length
      }
    };

    // For development, testing, or demo mode, we can return a mock response
    if (isDevMode || isTestMode || isDemoMode) {
      return {
        id: assessmentData.assessmentId || 'demo-assessment-id',
        ...assessmentPayload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    let assessment;
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
          value: response.value,
          attachments: attachments,
          // Keep legacy columns for backward compatibility during migration
          files: response.files?.map((f: File) => f.name) || [],
          evidence: response.evidence || []
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
    const isDemoMode = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' || 
                      new URLSearchParams(window.location.search).get('demo') === 'true';
    
    // For development, testing, or demo mode, we can return mock data
    if (isDevMode || isTestMode || isDemoMode) {
      return {
        assessment: {
          id: assessmentId || 'demo-assessment-id',
          user_id: 'demo-user-id',
          status: 'submitted',
          total_score: 75,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: {
            demoData: true,
            sampleAssessment: true,
            lastModified: new Date().toISOString(),
            responseCount: 10
          }
        },
        responses: Array.from({ length: 10 }, (_, i) => ({
          id: `demo-response-${i}`,
          assessment_id: assessmentId || 'demo-assessment-id',
          question_id: `question_${i + 1}`,
          value: {
            answer: 'Sample response for demo purposes',
            score: Math.floor(Math.random() * 100)
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
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
    const isDemoMode = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' || 
                      new URLSearchParams(window.location.search).get('demo') === 'true';
    
    // For development, testing, or demo mode, we can return mock data
    if (isDevMode || isTestMode || isDemoMode) {
      return [
        {
          id: 'demo-assessment-1',
          user_id: 'demo-user-id',
          status: 'submitted',
          total_score: 75,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: { 
            scores: { 
              environmental: 70, 
              social: 75, 
              governance: 80 
            } 
          },
          assessment_responses: []
        },
        {
          id: 'demo-assessment-2',
          user_id: 'demo-user-id',
          status: 'submitted',
          total_score: 68,
          created_at: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: { 
            scores: { 
              environmental: 65, 
              social: 70, 
              governance: 72 
            } 
          },
          assessment_responses: []
        },
        {
          id: 'demo-assessment-3',
          user_id: 'demo-user-id',
          status: 'draft',
          total_score: null,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: { 
            responseCount: 5
          },
          assessment_responses: []
        }
      ];
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
    const isDemoMode = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' || 
                      new URLSearchParams(window.location.search).get('demo') === 'true';
    
    // For development, testing, or demo mode, we can bypass authentication
    if (isDevMode || isTestMode || isDemoMode) {
      return { 
        user: {
          id: 'demo-user-id',
          email: 'demo@esgsoluce.com',
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
    const isDemoMode = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' || 
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
    const isDemoMode = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' || 
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