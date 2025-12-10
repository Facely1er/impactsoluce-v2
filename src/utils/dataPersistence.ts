/**
 * Data persistence validation utilities
 * Ensures data integrity when storing/retrieving from localStorage
 */

export interface PersistenceValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate data before storing in localStorage
 */
export function validateDataBeforeStore<T>(
  key: string,
  data: T,
  schema?: {
    requiredFields?: string[];
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  }
): PersistenceValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if data is null or undefined
  if (data === null || data === undefined) {
    errors.push(`Data for key "${key}" cannot be null or undefined`);
    return { valid: false, errors, warnings };
  }

  // Check data size
  if (schema?.maxSize) {
    const dataSize = new Blob([JSON.stringify(data)]).size;
    if (dataSize > schema.maxSize) {
      errors.push(
        `Data for key "${key}" exceeds maximum size of ${schema.maxSize} bytes (actual: ${dataSize} bytes)`
      );
    } else if (dataSize > schema.maxSize * 0.8) {
      warnings.push(
        `Data for key "${key}" is approaching size limit (${dataSize}/${schema.maxSize} bytes)`
      );
    }
  }

  // Check required fields
  if (schema?.requiredFields && typeof data === 'object' && data !== null) {
    const dataObj = data as Record<string, unknown>;
    for (const field of schema.requiredFields) {
      if (!(field in dataObj) || dataObj[field] === undefined) {
        errors.push(`Required field "${field}" is missing in data for key "${key}"`);
      }
    }
  }

  // Check data type
  if (schema?.allowedTypes) {
    const dataType = Array.isArray(data) ? 'array' : typeof data;
    if (!schema.allowedTypes.includes(dataType)) {
      errors.push(
        `Data for key "${key}" has invalid type "${dataType}". Allowed types: ${schema.allowedTypes.join(', ')}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Safely store data in localStorage with validation
 */
export function safeStoreData<T>(
  key: string,
  data: T,
  schema?: {
    requiredFields?: string[];
    maxSize?: number;
    allowedTypes?: string[];
  }
): { success: boolean; error?: string } {
  try {
    // Validate data before storing
    const validation = validateDataBeforeStore(key, data, schema);
    
    if (!validation.valid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join('; ')}`,
      };
    }

    // Log warnings if any
    if (validation.warnings.length > 0) {
      console.warn(`Storage warnings for "${key}":`, validation.warnings);
    }

    // Check localStorage quota
    const testKey = '__localStorage_quota_test__';
    try {
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
    } catch {
      return {
        success: false,
        error: 'localStorage quota exceeded. Please clear some data.',
      };
    }

    // Store the data
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to store data: ${errorMessage}`,
    };
  }
}

/**
 * Safely retrieve data from localStorage with validation
 */
export function safeRetrieveData<T>(
  key: string,
  defaultValue?: T,
  schema?: {
    requiredFields?: string[];
    allowedTypes?: string[];
  }
): { success: boolean; data?: T; error?: string } {
  try {
    const stored = localStorage.getItem(key);
    
    if (stored === null) {
      if (defaultValue !== undefined) {
        return { success: true, data: defaultValue };
      }
      return {
        success: false,
        error: `No data found for key "${key}"`,
      };
    }

    // Parse JSON
    let parsed: T;
    try {
      parsed = JSON.parse(stored);
    } catch {
      // If parsing fails, remove corrupted data
      localStorage.removeItem(key);
      return {
        success: false,
        error: `Corrupted data for key "${key}". Data has been removed.`,
      };
    }

    // Validate retrieved data
    if (schema) {
      const validation = validateDataBeforeStore(key, parsed, schema);
      if (!validation.valid) {
        // Remove invalid data
        localStorage.removeItem(key);
        return {
          success: false,
          error: `Invalid data for key "${key}": ${validation.errors.join('; ')}. Data has been removed.`,
        };
      }
    }

    return { success: true, data: parsed };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to retrieve data: ${errorMessage}`,
    };
  }
}

/**
 * Check if localStorage is available and has space
 */
export function checkLocalStorageAvailability(): {
  available: boolean;
  quota?: number;
  usage?: number;
  error?: string;
} {
  try {
    if (typeof Storage === 'undefined') {
      return { available: false, error: 'localStorage is not supported' };
    }

    // Check if we can write
    const testKey = '__localStorage_test__';
    try {
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
    } catch {
      return { available: false, error: 'localStorage quota exceeded or not accessible' };
    }

    // Try to estimate usage (approximate)
    let usage = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        usage += localStorage.getItem(key)?.length || 0;
      }
    }

    // Most browsers have ~5-10MB quota
    const quota = 5 * 1024 * 1024; // 5MB estimate

    return {
      available: true,
      quota,
      usage,
    };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Clear all ImpactSoluce data from localStorage
 */
export function clearImpactSoluceData(): { success: boolean; cleared: string[]; error?: string } {
  const cleared: string[] = [];
  const prefix = 'impactsoluce_';
  
  try {
    const keysToRemove: string[] = [];
    
    // Find all ImpactSoluce keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(prefix) || key.includes('assessment') || key.includes('riskRadar') || key.includes('evidence') || key.includes('eudr'))) {
        keysToRemove.push(key);
      }
    }

    // Remove keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      cleared.push(key);
    });

    return { success: true, cleared };
  } catch (error) {
    return {
      success: false,
      cleared,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

