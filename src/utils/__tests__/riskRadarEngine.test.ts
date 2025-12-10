import { describe, it, expect } from 'vitest';
import { calculateExposure, mapRegulatoryExposure, generateExposureSignals } from '../riskRadarEngine';
import { RiskRadarConfig, SectorProfile, GeographyProfile } from '../../types';

describe('riskRadarEngine', () => {
  const mockConfig: RiskRadarConfig = {
    sectors: ['A', 'B'],
    geographies: ['US', 'EU'],
    supplyChainDepth: 2,
    createdAt: new Date().toISOString(),
  };

  const mockSectorProfiles: SectorProfile[] = [
    {
      code: 'A',
      name: 'Agriculture',
      riskFactors: {
        environmental: 75,
        social: 60,
        governance: 50,
      },
    },
    {
      code: 'B',
      name: 'Manufacturing',
      riskFactors: {
        environmental: 65,
        social: 70,
        governance: 80,
      },
    },
  ];

  const mockGeographyProfiles: GeographyProfile[] = [
    {
      code: 'US',
      name: 'United States',
      region: 'North America',
      regulatoryIntensity: {
        environmental: 70,
        social: 75,
        governance: 85,
      },
      activeRegulations: ['EPA', 'OSHA'],
      upcomingRegulations: ['Climate Disclosure'],
    },
    {
      code: 'EU',
      name: 'European Union',
      region: 'Europe',
      regulatoryIntensity: {
        environmental: 85,
        social: 80,
        governance: 90,
      },
      activeRegulations: ['GDPR', 'CSRD'],
      upcomingRegulations: ['EUDR'],
    },
  ];

  describe('calculateExposure', () => {
    it('should calculate exposure scores correctly', () => {
      const result = calculateExposure(
        mockConfig,
        mockSectorProfiles,
        mockGeographyProfiles
      );

      expect(result).toBeDefined();
      expect(result.overallExposure).toBeDefined();
      expect(result.overallExposure.environmental).toBeGreaterThanOrEqual(0);
      expect(result.overallExposure.environmental).toBeLessThanOrEqual(100);
      expect(result.overallExposure.social).toBeGreaterThanOrEqual(0);
      expect(result.overallExposure.social).toBeLessThanOrEqual(100);
      expect(result.overallExposure.governance).toBeGreaterThanOrEqual(0);
      expect(result.overallExposure.governance).toBeLessThanOrEqual(100);
      expect(result.overallExposure.regulatory).toBeGreaterThanOrEqual(0);
      expect(result.overallExposure.regulatory).toBeLessThanOrEqual(100);
    });

    it('should handle empty sectors', () => {
      const emptyConfig: RiskRadarConfig = {
        ...mockConfig,
        sectors: [],
      };

      const result = calculateExposure(
        emptyConfig,
        mockSectorProfiles,
        mockGeographyProfiles
      );

      expect(result.overallExposure.environmental).toBe(0);
      expect(result.overallExposure.social).toBe(0);
      expect(result.overallExposure.governance).toBe(0);
    });

    it('should handle empty geographies', () => {
      const emptyConfig: RiskRadarConfig = {
        ...mockConfig,
        geographies: [],
      };

      const result = calculateExposure(
        emptyConfig,
        mockSectorProfiles,
        mockGeographyProfiles
      );

      expect(result.overallExposure.regulatory).toBe(0);
    });

    it('should account for supply chain depth', () => {
      const deepConfig: RiskRadarConfig = {
        ...mockConfig,
        supplyChainDepth: 4,
      };

      const result = calculateExposure(
        deepConfig,
        mockSectorProfiles,
        mockGeographyProfiles
      );

      // Deeper supply chain should increase exposure
      expect(result.overallExposure.environmental).toBeGreaterThan(0);
    });
  });

  describe('mapRegulatoryExposure', () => {
    it('should map regulatory exposure by region', () => {
      const result = mapRegulatoryExposure(mockConfig, mockGeographyProfiles);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      const usExposure = result.find(r => r.region === 'North America');
      expect(usExposure).toBeDefined();
      if (usExposure) {
        expect(usExposure.intensity).toBeGreaterThanOrEqual(0);
        expect(usExposure.intensity).toBeLessThanOrEqual(100);
      }
    });

    it('should handle unknown geographies gracefully', () => {
      const unknownConfig: RiskRadarConfig = {
        ...mockConfig,
        geographies: ['XX'],
      };

      const result = mapRegulatoryExposure(unknownConfig, mockGeographyProfiles);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('generateExposureSignals', () => {
    it('should generate exposure signals', () => {
      const exposure = calculateExposure(
        mockConfig,
        mockSectorProfiles,
        mockGeographyProfiles
      );

      const signals = generateExposureSignals(
        exposure,
        mockConfig,
        mockSectorProfiles,
        mockGeographyProfiles
      );

      expect(signals).toBeDefined();
      expect(Array.isArray(signals)).toBe(true);
      expect(signals.length).toBeGreaterThan(0);

      signals.forEach(signal => {
        expect(signal.id).toBeDefined();
        expect(signal.type).toBeDefined();
        expect(['environmental', 'social', 'governance', 'regulatory']).toContain(signal.type);
        expect(signal.severity).toBeDefined();
        expect(['low', 'medium', 'high', 'critical']).toContain(signal.severity);
        expect(signal.description).toBeDefined();
      });
    });

    it('should generate high severity signals for high exposure', () => {
      const highRiskConfig: RiskRadarConfig = {
        sectors: ['A'],
        geographies: ['EU'],
        supplyChainDepth: 4,
        createdAt: new Date().toISOString(),
      };

      const exposure = calculateExposure(
        highRiskConfig,
        mockSectorProfiles,
        mockGeographyProfiles
      );

      const signals = generateExposureSignals(
        exposure,
        highRiskConfig,
        mockSectorProfiles,
        mockGeographyProfiles
      );

      const highSeveritySignals = signals.filter(s => 
        s.severity === 'high' || s.severity === 'critical'
      );

      expect(highSeveritySignals.length).toBeGreaterThan(0);
    });
  });
});

