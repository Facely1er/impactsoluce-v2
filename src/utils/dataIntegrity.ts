/**
 * Data integrity validation and repair utilities
 */

import { supabase } from '../lib/supabase';
import { logError } from './errorHandler';

export interface DataIntegrityReport {
  tableName: string;
  totalRecords: number;
  issues: Array<{
    type: 'orphaned' | 'duplicate' | 'invalid' | 'missing_reference';
    count: number;
    description: string;
    recordIds?: string[];
  }>;
  lastChecked: string;
}

// Check for orphaned assessment responses
export const checkOrphanedResponses = async (): Promise<DataIntegrityReport> => {
  const report: DataIntegrityReport = {
    tableName: 'assessment_responses',
    totalRecords: 0,
    issues: [],
    lastChecked: new Date().toISOString()
  };

  try {
    // Get total count
    const { count: totalCount } = await supabase
      .from('assessment_responses')
      .select('*', { count: 'exact', head: true });
    
    report.totalRecords = totalCount || 0;

    // Find orphaned responses (responses without valid assessment)
    const { data: orphanedResponses, error } = await supabase
      .from('assessment_responses')
      .select('id, assessment_id')
      .is('assessment_id', null)
      .or('assessment_id.not.in.(select id from assessments)');

    if (error) throw error;

    if (orphanedResponses?.length) {
      report.issues.push({
        type: 'orphaned',
        count: orphanedResponses.length,
        description: 'Assessment responses without valid assessment',
        recordIds: orphanedResponses.map(r => r.id)
      });
    }

    // Check for duplicate responses (same assessment + question)
    const { data: duplicates } = await supabase.rpc('find_duplicate_responses');
    
    if (duplicates?.length) {
      report.issues.push({
        type: 'duplicate',
        count: duplicates.length,
        description: 'Duplicate responses for same assessment and question',
        recordIds: duplicates.map((d: any) => d.id)
      });
    }

  } catch (error) {
    logError(error, 'checkOrphanedResponses');
    report.issues.push({
      type: 'invalid',
      count: 0,
      description: `Error checking data integrity: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  return report;
};

// Fix orphaned responses
export const fixOrphanedResponses = async (): Promise<{
  success: boolean;
  fixed: number;
  errors: string[];
}> => {
  const result = {
    success: true,
    fixed: 0,
    errors: [] as string[]
  };

  try {
    const report = await checkOrphanedResponses();
    const orphanedIssue = report.issues.find(i => i.type === 'orphaned');
    
    if (orphanedIssue?.recordIds?.length) {
      const { error } = await supabase
        .from('assessment_responses')
        .delete()
        .in('id', orphanedIssue.recordIds);
      
      if (error) {
        result.success = false;
        result.errors.push(error.message);
      } else {
        result.fixed = orphanedIssue.recordIds.length;
      }
    }
  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Unknown error');
  }

  return result;
};

// Validate assessment data consistency
export const validateAssessmentConsistency = async (assessmentId: string): Promise<{
  consistent: boolean;
  issues: string[];
  warnings: string[];
}> => {
  const result = {
    consistent: true,
    issues: [] as string[],
    warnings: [] as string[]
  };

  try {
    // Get assessment and responses
    const [assessmentResult, responsesResult] = await Promise.all([
      supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .single(),
      supabase
        .from('assessment_responses')
        .select('*')
        .eq('assessment_id', assessmentId)
    ]);

    if (assessmentResult.error) {
      result.consistent = false;
      result.issues.push(`Assessment not found: ${assessmentResult.error.message}`);
      return result;
    }

    if (responsesResult.error) {
      result.consistent = false;
      result.issues.push(`Could not load responses: ${responsesResult.error.message}`);
      return result;
    }

    const assessment = assessmentResult.data;
    const responses = responsesResult.data || [];

    // Check if assessment status matches response count
    if (assessment.status === 'submitted' && responses.length === 0) {
      result.issues.push('Assessment marked as submitted but has no responses');
      result.consistent = false;
    }

    // Check for responses with invalid values
    responses.forEach(response => {
      if (!response.value || response.value === '') {
        result.warnings.push(`Response ${response.question_id} has empty value`);
      }
      
      if (!response.updated_at) {
        result.warnings.push(`Response ${response.question_id} missing timestamp`);
      }
    });

    // Check attachment integrity
    responses.forEach(response => {
      if (response.attachments) {
        try {
          const attachments = JSON.parse(response.attachments);
          if (Array.isArray(attachments)) {
            attachments.forEach((attachment: any, index: number) => {
              if (!attachment.name || !attachment.url) {
                result.warnings.push(`Response ${response.question_id} has invalid attachment ${index + 1}`);
              }
            });
          }
        } catch (error) {
          result.warnings.push(`Response ${response.question_id} has malformed attachments data`);
        }
      }
    });

  } catch (error) {
    result.consistent = false;
    result.issues.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
};

// Repair assessment data
export const repairAssessmentData = async (assessmentId: string): Promise<{
  success: boolean;
  repaired: string[];
  errors: string[];
}> => {
  const result = {
    success: true,
    repaired: [] as string[],
    errors: [] as string[]
  };

  try {
    const validation = await validateAssessmentConsistency(assessmentId);
    
    // Fix empty response values
    const { data: emptyResponses } = await supabase
      .from('assessment_responses')
      .select('id')
      .eq('assessment_id', assessmentId)
      .or('value.is.null,value.eq.""');
    
    if (emptyResponses?.length) {
      const { error } = await supabase
        .from('assessment_responses')
        .delete()
        .in('id', emptyResponses.map(r => r.id));
      
      if (error) {
        result.errors.push(`Failed to remove empty responses: ${error.message}`);
      } else {
        result.repaired.push(`Removed ${emptyResponses.length} empty responses`);
      }
    }

    // Update assessment metadata
    const { error: updateError } = await supabase
      .from('assessments')
      .update({
        updated_at: new Date().toISOString(),
        metadata: {
          ...(typeof validation === 'object' ? validation : {}),
          lastRepaired: new Date().toISOString()
        }
      })
      .eq('id', assessmentId);
    
    if (updateError) {
      result.errors.push(`Failed to update assessment metadata: ${updateError.message}`);
    } else {
      result.repaired.push('Updated assessment metadata');
    }

  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Unknown repair error');
  }

  return result;
};