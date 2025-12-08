import { RiskRadarConfig } from '../types';

/**
 * Validate Risk Radar configuration
 */
export function validateRiskRadarConfig(config: RiskRadarConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.sectorCode || config.sectorCode.trim() === '') {
    errors.push('Sector code is required');
  }

  if (!config.geographies || config.geographies.length === 0) {
    errors.push('At least one geography must be selected');
  }

  if (config.supplyChainTiers === undefined || config.supplyChainTiers === null) {
    errors.push('Supply chain tiers must be specified');
  } else if (config.supplyChainTiers < 1 || config.supplyChainTiers > 10) {
    errors.push('Supply chain tiers must be between 1 and 10');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize Risk Radar configuration
 */
export function sanitizeRiskRadarConfig(config: Partial<RiskRadarConfig>): RiskRadarConfig {
  return {
    sectorCode: config.sectorCode?.trim() || '',
    geographies: config.geographies || [],
    supplyChainTiers: config.supplyChainTiers || 1,
    organizationId: config.organizationId,
    id: config.id,
    createdAt: config.createdAt,
    updatedAt: config.updatedAt || new Date().toISOString()
  };
}

/**
 * Parse and validate Risk Radar configuration from localStorage
 */
export function parseRiskRadarConfig(configStr: string | null): { config: RiskRadarConfig | null; error: string | null } {
  if (!configStr) {
    return { config: null, error: null };
  }

  try {
    const parsed = JSON.parse(configStr);
    const sanitized = sanitizeRiskRadarConfig(parsed);
    const validation = validateRiskRadarConfig(sanitized);

    if (!validation.valid) {
      return {
        config: null,
        error: validation.errors.join(', ')
      };
    }

    return {
      config: sanitized,
      error: null
    };
  } catch (err) {
    return {
      config: null,
      error: err instanceof Error ? err.message : 'Invalid configuration format'
    };
  }
}

