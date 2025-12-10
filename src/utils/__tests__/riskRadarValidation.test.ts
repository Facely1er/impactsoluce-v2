import { describe, it, expect } from 'vitest';
import { validateRiskRadarConfig, sanitizeRiskRadarConfig, parseRiskRadarConfig } from '../riskRadarValidation';
import { RiskRadarConfig } from '../../types';

describe('riskRadarValidation', () => {
  const validConfig: RiskRadarConfig = {
    sectors: ['A', 'B'],
    geographies: ['US', 'EU'],
    supplyChainDepth: 2,
    createdAt: new Date().toISOString(),
  };

  describe('validateRiskRadarConfig', () => {
    it('should validate a correct config', () => {
      const result = validateRiskRadarConfig(validConfig);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject config with empty sectors', () => {
      const invalidConfig = {
        ...validConfig,
        sectors: [],
      };
      const result = validateRiskRadarConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject config with empty geographies', () => {
      const invalidConfig = {
        ...validConfig,
        geographies: [],
      };
      const result = validateRiskRadarConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject config with invalid supply chain depth', () => {
      const invalidConfig = {
        ...validConfig,
        supplyChainDepth: 0,
      };
      const result = validateRiskRadarConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it('should reject config with supply chain depth > 4', () => {
      const invalidConfig = {
        ...validConfig,
        supplyChainDepth: 5,
      };
      const result = validateRiskRadarConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it('should reject config with missing createdAt', () => {
      const invalidConfig = {
        sectors: ['A'],
        geographies: ['US'],
        supplyChainDepth: 2,
      } as RiskRadarConfig;
      const result = validateRiskRadarConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });
  });

  describe('sanitizeRiskRadarConfig', () => {
    it('should sanitize valid config', () => {
      const result = sanitizeRiskRadarConfig(validConfig);
      expect(result).toBeDefined();
      expect(result.sectors).toEqual(validConfig.sectors);
      expect(result.geographies).toEqual(validConfig.geographies);
      expect(result.supplyChainDepth).toBe(validConfig.supplyChainDepth);
    });

    it('should trim string arrays', () => {
      const configWithSpaces = {
        ...validConfig,
        sectors: [' A ', ' B '],
        geographies: [' US ', ' EU '],
      };
      const result = sanitizeRiskRadarConfig(configWithSpaces);
      expect(result.sectors).toEqual(['A', 'B']);
      expect(result.geographies).toEqual(['US', 'EU']);
    });

    it('should remove empty strings from arrays', () => {
      const configWithEmpty = {
        ...validConfig,
        sectors: ['A', '', 'B'],
        geographies: ['US', '  ', 'EU'],
      };
      const result = sanitizeRiskRadarConfig(configWithEmpty);
      expect(result.sectors).not.toContain('');
      expect(result.geographies).not.toContain('  ');
    });

    it('should clamp supply chain depth to valid range', () => {
      const configLow = {
        ...validConfig,
        supplyChainDepth: 0,
      };
      const resultLow = sanitizeRiskRadarConfig(configLow);
      expect(resultLow.supplyChainDepth).toBeGreaterThanOrEqual(1);

      const configHigh = {
        ...validConfig,
        supplyChainDepth: 10,
      };
      const resultHigh = sanitizeRiskRadarConfig(configHigh);
      expect(resultHigh.supplyChainDepth).toBeLessThanOrEqual(4);
    });
  });

  describe('parseRiskRadarConfig', () => {
    it('should parse valid JSON config', () => {
      const jsonString = JSON.stringify(validConfig);
      const result = parseRiskRadarConfig(jsonString);
      expect(result.config).toBeDefined();
      expect(result.error).toBeUndefined();
      expect(result.config?.sectors).toEqual(validConfig.sectors);
    });

    it('should return error for invalid JSON', () => {
      const invalidJson = '{ invalid json }';
      const result = parseRiskRadarConfig(invalidJson);
      expect(result.config).toBeUndefined();
      expect(result.error).toBeDefined();
    });

    it('should return undefined config for null input', () => {
      const result = parseRiskRadarConfig(null);
      expect(result.config).toBeUndefined();
      expect(result.error).toBeUndefined();
    });

    it('should validate parsed config', () => {
      const invalidConfig = {
        sectors: [],
        geographies: ['US'],
        supplyChainDepth: 2,
        createdAt: new Date().toISOString(),
      };
      const jsonString = JSON.stringify(invalidConfig);
      const result = parseRiskRadarConfig(jsonString);
      expect(result.config).toBeUndefined();
      expect(result.error).toBeDefined();
    });
  });
});

