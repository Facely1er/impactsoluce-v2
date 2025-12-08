import {
  RiskRadarOutput,
  RiskRadarConfig,
  SectorProfile,
  GeographyProfile,
  ExposureSignal,
  ExposureLevel,
  RegulatoryExposure,
  SupplyChainFootprint
} from '../types';

/**
 * Calculate exposure based on sector, geography, and supply chain
 */
export function calculateExposure(
  config: RiskRadarConfig,
  sectorProfile?: SectorProfile,
  geographyProfiles?: GeographyProfile[],
  supplyChain?: SupplyChainFootprint
): RiskRadarOutput {
  const now = new Date().toISOString();
  
  // Initialize exposure levels
  const environmental: ExposureLevel = {
    level: 'low',
    score: 0,
    signals: []
  };
  
  const social: ExposureLevel = {
    level: 'low',
    score: 0,
    signals: []
  };
  
  const governance: ExposureLevel = {
    level: 'low',
    score: 0,
    signals: []
  };
  
  const regulatory: ExposureLevel = {
    level: 'low',
    score: 0,
    signals: []
  };

  const allSignals: ExposureSignal[] = [];
  const regulatoryPressure: RiskRadarOutput['regulatoryPressure'] = [];
  const riskHotspots: RiskRadarOutput['riskHotspots'] = [];

  // Calculate environmental exposure
  if (sectorProfile) {
    const envRiskFactors = sectorProfile.riskFactors.environmental;
    if (envRiskFactors.length > 0) {
      const highRiskCount = envRiskFactors.filter(r => r.severity === 'high').length;
      const mediumRiskCount = envRiskFactors.filter(r => r.severity === 'medium').length;
      
      environmental.score = Math.min(100, (highRiskCount * 30) + (mediumRiskCount * 15));
      environmental.level = getExposureLevel(environmental.score);
      
      // Generate signals from risk factors
      envRiskFactors.forEach((factor, index) => {
        const signal: ExposureSignal = {
          id: `env-${index}`,
          type: 'environmental',
          category: factor.category,
          severity: factor.severity,
          description: factor.description,
          source: 'Sector Analysis',
          timestamp: now,
          evidenceRequired: factor.severity === 'high' || factor.severity === 'critical'
        };
        environmental.signals.push(signal);
        allSignals.push(signal);
      });
    }
  }

  // Calculate social exposure
  if (sectorProfile) {
    const socialRiskFactors = sectorProfile.riskFactors.social;
    if (socialRiskFactors.length > 0) {
      const highRiskCount = socialRiskFactors.filter(r => r.severity === 'high').length;
      const mediumRiskCount = socialRiskFactors.filter(r => r.severity === 'medium').length;
      
      social.score = Math.min(100, (highRiskCount * 30) + (mediumRiskCount * 15));
      social.level = getExposureLevel(social.score);
      
      socialRiskFactors.forEach((factor, index) => {
        const signal: ExposureSignal = {
          id: `social-${index}`,
          type: 'social',
          category: factor.category,
          severity: factor.severity,
          description: factor.description,
          source: 'Sector Analysis',
          timestamp: now,
          evidenceRequired: factor.severity === 'high' || factor.severity === 'critical'
        };
        social.signals.push(signal);
        allSignals.push(signal);
      });
    }
  }

  // Calculate governance exposure
  if (sectorProfile) {
    const govRiskFactors = sectorProfile.riskFactors.governance;
    if (govRiskFactors.length > 0) {
      const highRiskCount = govRiskFactors.filter(r => r.severity === 'high').length;
      const mediumRiskCount = govRiskFactors.filter(r => r.severity === 'medium').length;
      
      governance.score = Math.min(100, (highRiskCount * 30) + (mediumRiskCount * 15));
      governance.level = getExposureLevel(governance.score);
      
      govRiskFactors.forEach((factor, index) => {
        const signal: ExposureSignal = {
          id: `gov-${index}`,
          type: 'governance',
          category: factor.category,
          severity: factor.severity,
          description: factor.description,
          source: 'Sector Analysis',
          timestamp: now,
          evidenceRequired: factor.severity === 'high' || factor.severity === 'critical'
        };
        governance.signals.push(signal);
        allSignals.push(signal);
      });
    }
  }

  // Calculate regulatory exposure
  if (sectorProfile && geographyProfiles) {
    const allRegulations: RegulatoryExposure[] = [];
    
    // Collect regulations from sector profile
    allRegulations.push(...sectorProfile.regulatoryExposure);
    
    // Collect regulations from geography profiles
    geographyProfiles.forEach(geo => {
      allRegulations.push(...geo.activeRegulations);
      allRegulations.push(...geo.upcomingRegulations);
    });

    // Calculate regulatory pressure by region
    const regionMap = new Map<string, RegulatoryExposure[]>();
    allRegulations.forEach(reg => {
      const existing = regionMap.get(reg.region) || [];
      regionMap.set(reg.region, [...existing, reg]);
    });

    regionMap.forEach((regulations, region) => {
      const criticalCount = regulations.filter(r => r.pressureLevel === 'critical').length;
      const highCount = regulations.filter(r => r.pressureLevel === 'high').length;
      const mediumCount = regulations.filter(r => r.pressureLevel === 'medium').length;
      
      const intensity = Math.min(100, (criticalCount * 40) + (highCount * 25) + (mediumCount * 15));
      
      regulatoryPressure.push({
        region,
        intensity,
        regulations
      });

      // Generate regulatory signals
      regulations.forEach((reg, index) => {
        if (reg.pressureLevel === 'critical' || reg.pressureLevel === 'high') {
          const signal: ExposureSignal = {
            id: `reg-${region}-${index}`,
            type: 'regulatory',
            category: reg.regulation,
            severity: reg.pressureLevel === 'critical' ? 'critical' : 'high',
            description: `${reg.regulation} applies to your operations in ${region}`,
            source: 'Regulatory Intelligence',
            timestamp: now,
            relatedRegulation: reg.regulation,
            evidenceRequired: true
          };
          regulatory.signals.push(signal);
          allSignals.push(signal);
        }
      });
    });

    // Calculate overall regulatory score
    const avgIntensity = regulatoryPressure.length > 0
      ? regulatoryPressure.reduce((sum, p) => sum + p.intensity, 0) / regulatoryPressure.length
      : 0;
    regulatory.score = Math.round(avgIntensity);
    regulatory.level = getExposureLevel(regulatory.score);
  }

  // Process supply chain hotspots
  if (supplyChain) {
    riskHotspots.push(...supplyChain.riskHotspots);
  }

  return {
    organizationId: config.organizationId || 'unknown',
    generatedAt: now,
    overallExposure: {
      environmental,
      social,
      governance,
      regulatory
    },
    exposureSignals: allSignals.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    regulatoryPressure,
    riskHotspots,
    supplyChainExposure: supplyChain
  };
}

/**
 * Get exposure level from score
 */
function getExposureLevel(score: number): 'critical' | 'high' | 'medium' | 'low' {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

/**
 * Map regulations to organization profile
 */
export function mapRegulatoryExposure(
  sector: string,
  geographies: string[],
  supplyChainTiers?: number
): RegulatoryExposure[] {
  const exposures: RegulatoryExposure[] = [];

  // EU regulations
  if (geographies.includes('EU')) {
    exposures.push({
      regulation: 'CSRD',
      region: 'EU',
      applicability: 'direct',
      pressureLevel: 'high',
      requirements: ['Sustainability reporting', 'Double materiality assessment'],
      evidenceNeeded: ['Sustainability report', 'Materiality matrix']
    });

    // EUDR for certain sectors
    if (['A', 'C'].includes(sector)) {
      exposures.push({
        regulation: 'EUDR',
        region: 'EU',
        applicability: 'direct',
        pressureLevel: 'critical',
        deadline: '2024-12-30',
        requirements: ['Due diligence', 'Geolocation data', 'Commodity traceability'],
        evidenceNeeded: ['Due diligence statement', 'Geolocation coordinates', 'Supplier declarations']
      });
    }
  }

  // UK regulations
  if (geographies.includes('UK')) {
    exposures.push({
      regulation: 'UK Modern Slavery Act',
      region: 'UK',
      applicability: 'direct',
      pressureLevel: 'high',
      requirements: ['Modern slavery statement', 'Supply chain transparency'],
      evidenceNeeded: ['Modern slavery statement', 'Supplier audit reports']
    });
  }

  // US regulations
  if (geographies.includes('US')) {
    exposures.push({
      regulation: 'SEC Climate Disclosure',
      region: 'US',
      applicability: 'direct',
      pressureLevel: 'medium',
      requirements: ['Climate risk disclosure', 'GHG emissions reporting'],
      evidenceNeeded: ['Climate risk assessment', 'Emissions data']
    });
  }

  return exposures;
}

/**
 * Generate exposure signals from various sources
 */
export function generateExposureSignals(
  riskRadarOutput: RiskRadarOutput
): ExposureSignal[] {
  return riskRadarOutput.exposureSignals;
}

