import { EvidenceItem, EvidenceInventory, EvidenceRequirement, ReadinessSnapshot, CoverageMetrics, EvidenceGap, ExposureSignal } from '../types';

/**
 * Calculate coverage metrics for evidence items
 */
export function calculateCoverageMetrics(items: EvidenceItem[]): CoverageMetrics {
  const total = items.length;
  const complete = items.filter(item => item.status === 'complete').length;
  const partial = items.filter(item => item.status === 'partial').length;
  const missing = items.filter(item => item.status === 'missing').length;
  const expired = items.filter(item => item.status === 'expired').length;
  
  const coveragePercentage = total > 0 ? Math.round((complete / total) * 100) : 0;
  
  return {
    total,
    complete,
    partial,
    missing,
    expired,
    coveragePercentage
  };
}

/**
 * Calculate readiness snapshot based on evidence inventory
 */
export function calculateReadiness(
  inventory: EvidenceInventory,
  requirements: EvidenceRequirement[] = []
): ReadinessSnapshot {
  const now = new Date().toISOString();
  
  // Calculate by pillar
  const environmental = inventory.coverage.byPillar.environmental.coveragePercentage;
  const social = inventory.coverage.byPillar.social.coveragePercentage;
  const governance = inventory.coverage.byPillar.governance.coveragePercentage;
  
  // Calculate overall (weighted average)
  const overall = Math.round((environmental + social + governance) / 3);
  
  // Calculate by regulation
  const byRegulation: Record<string, number> = {};
  Object.keys(inventory.coverage.byRegulation).forEach(regulation => {
    byRegulation[regulation] = inventory.coverage.byRegulation[regulation].coveragePercentage;
  });
  
  // Generate trends (last 6 months)
  const trends = generateTrends(inventory);
  
  // Next review date (30 days from now)
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + 30);
  
  return {
    timestamp: now,
    overall,
    byPillar: {
      environmental,
      social,
      governance
    },
    byRegulation,
    trends,
    nextReviewDate: nextReviewDate.toISOString()
  };
}

/**
 * Generate trends for readiness over time
 */
function generateTrends(inventory: EvidenceInventory): { period: string; score: number }[] {
  const trends: { period: string; score: number }[] = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const period = date.toISOString().slice(0, 7); // YYYY-MM
    
    // Simulate trend (in real implementation, this would come from historical data)
    const baseScore = inventory.readiness.overall;
    const variation = (Math.random() - 0.5) * 10; // ±5% variation
    const score = Math.max(0, Math.min(100, baseScore + variation));
    
    trends.push({ period, score: Math.round(score) });
  }
  
  return trends;
}

/**
 * Identify evidence gaps based on requirements and risk signals
 */
export function identifyGaps(
  inventory: EvidenceInventory,
  requirements: EvidenceRequirement[],
  riskSignals?: ExposureSignal[]
): EvidenceGap[] {
  const gaps: EvidenceGap[] = [];
  
  // Check requirements against inventory
  requirements.forEach(requirement => {
    const matchingEvidence = inventory.items.filter(item => {
      return item.metadata.regulation?.includes(requirement.regulation) ||
             item.metadata.framework?.some(fw => requirement.regulation.includes(fw));
    });
    
    if (matchingEvidence.length === 0 || matchingEvidence.every(e => e.status !== 'complete')) {
      const linkedSignal = riskSignals?.find(signal => 
        signal.relatedRegulation === requirement.regulation
      );
      
      gaps.push({
        id: `gap-${requirement.id}`,
        category: requirement.category,
        regulation: requirement.regulation,
        requirement: requirement.requirement,
        severity: requirement.mandatory ? 'high' : 'medium',
        description: `Missing evidence for ${requirement.requirement}`,
        evidenceNeeded: requirement.evidenceTypes,
        deadline: requirement.frequency === 'annual' ? getNextYearDate() : undefined,
        linkedRiskSignal: linkedSignal?.id
      });
    }
  });
  
  // Check for expired evidence
  inventory.items.forEach(item => {
    if (item.status === 'expired' || (item.expiresAt && new Date(item.expiresAt) < new Date())) {
      gaps.push({
        id: `gap-expired-${item.id}`,
        category: item.category,
        regulation: item.metadata.regulation?.[0],
        requirement: `Renew ${item.title}`,
        severity: 'medium',
        description: `Evidence expired: ${item.title}`,
        evidenceNeeded: [item.type],
        deadline: item.expiresAt
      });
    }
  });
  
  return gaps.sort((a, b) => {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
}

/**
 * Get next year date for annual requirements
 */
function getNextYearDate(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString();
}

/**
 * Map evidence items to regulatory requirements
 */
export function mapEvidenceToRequirements(
  evidence: EvidenceItem[],
  requirements: EvidenceRequirement[]
): Map<string, EvidenceItem[]> {
  const mapping = new Map<string, EvidenceItem[]>();
  
  requirements.forEach(requirement => {
    const matchingEvidence = evidence.filter(item => {
      return item.metadata.regulation?.includes(requirement.regulation) ||
             item.metadata.framework?.some(fw => requirement.regulation.includes(fw)) ||
             item.category === requirement.category;
    });
    
    if (matchingEvidence.length > 0) {
      mapping.set(requirement.id, matchingEvidence);
    }
  });
  
  return mapping;
}

/**
 * Calculate coverage by pillar from evidence items
 */
export function calculateCoverageByPillar(items: EvidenceItem[]): {
  environmental: CoverageMetrics;
  social: CoverageMetrics;
  governance: CoverageMetrics;
} {
  const environmental = items.filter(item => item.category === 'environmental');
  const social = items.filter(item => item.category === 'social');
  const governance = items.filter(item => item.category === 'governance');
  
  return {
    environmental: calculateCoverageMetrics(environmental),
    social: calculateCoverageMetrics(social),
    governance: calculateCoverageMetrics(governance)
  };
}

/**
 * Calculate coverage by regulation from evidence items
 */
export function calculateCoverageByRegulation(items: EvidenceItem[]): Record<string, CoverageMetrics> {
  const regulationMap = new Map<string, EvidenceItem[]>();
  
  items.forEach(item => {
    item.metadata.regulation?.forEach(regulation => {
      if (!regulationMap.has(regulation)) {
        regulationMap.set(regulation, []);
      }
      regulationMap.get(regulation)!.push(item);
    });
  });
  
  const result: Record<string, CoverageMetrics> = {};
  regulationMap.forEach((items, regulation) => {
    result[regulation] = calculateCoverageMetrics(items);
  });
  
  return result;
}

