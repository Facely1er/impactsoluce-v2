import { ReactNode } from 'react';

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ESGScore {
  environmental: number;
  social: number;
  governance: number;
  total: number;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'docx' | 'xlsx';
  category: 'policy' | 'guide' | 'template' | 'checklist';
  url: string;
}

export interface TechDependency {
  id: string;
  name: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
  emissions: number;
  energy: number;
  risk: number;
  vendor?: {
    name: string;
    esgScore?: number;
    sustainabilityCommitment?: string;
  };
  resilience?: {
    score: number;
    factors: string[];
  };
}

export interface CarbonData {
  month: string;
  value: number;
  target?: number;
  reduction?: number;
}

export interface ESGFramework {
  id: string;
  name: string;
  description: string;
  categories: {
    name: string;
    score: number;
    items: Array<{
      id: string;
      name: string;
      score: number;
      maxScore: number;
      improvement?: string[];
      priority?: 'high' | 'medium' | 'low';
    }>;
  }[];
}

export interface FrameworkMapping {
  id: string;
  name: string;
  code: string;
  description: string;
  deadline?: string;
  requirements?: string[];
  applicability?: string[];
}

export interface FileAttachment {
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  description?: string;
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'likert_scale' | 'text' | 'number' | 'file';
  category: 'demographics' | 'professional' | 'current_situation' | 'goals' | 'needs';
  question: string;
  description?: string;
  required: boolean;
  options?: string[];
  optionDescriptions?: Record<string, string>;
  multiSelect?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
    fileTypes?: string[];
    maxSize?: number;
  };
  frameworks?: {
    gri?: string[];
    sasb?: string[];
    tcfd?: string[];
    iso?: string[];
  };
  weight?: number;
  impactAreas?: ('environmental' | 'social' | 'governance')[];
  dependsOn?: {
    questionId: string;
    value: string | number | string[];
  };
  benchmarks?: {
    industry: string;
    value: number;
  }[];
  compliance?: {
    regulation: string;
    requirement: string;
    deadline?: string;
  }[];
  risks?: {
    category: string;
    level: 'high' | 'medium' | 'low';
    description: string;
  }[];
}

export interface AssessmentSection {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  requiredDocuments?: {
    name: string;
    description: string;
    required: boolean;
    acceptedFormats: string[];
  }[];
  compliance?: {
    framework: string;
    requirements: string[];
    deadline?: string;
  }[];
}

export interface AssessmentResponse {
  questionId: string;
  value: string | number | string[];
  timestamp: string;
  files?: File[];
  attachments?: FileAttachment[];
}

export interface AssessmentHistory {
  id: string;
  date: string;
  scores: ESGScore;
  responses: AssessmentResponse[];
  status: 'draft' | 'submitted' | 'reviewed';
  feedback?: {
    category: string;
    comments: string;
    recommendations: string[];
  }[];
  improvements?: {
    category: string;
    metric: string;
    change: number;
    impact: string;
  }[];
}

export interface AssessmentState {
  currentSection: number;
  responses: Record<string, AssessmentResponse>;
  progress: number;
  lastSaved: string;
  isValid: boolean;
  errors: Record<string, string>;
  lastActive: number;
  hasUnsavedChanges: boolean;
  assessmentId?: string;
}

export interface ESGActionPlan {
  id: string;
  category: 'environmental' | 'social' | 'governance';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'not_started' | 'in_progress' | 'completed';
  timeline: {
    start: string;
    end: string;
    milestones: {
      date: string;
      description: string;
    }[];
  };
  resources: {
    type: string;
    estimate: number;
    unit: string;
  }[];
  metrics: {
    name: string;
    current: number;
    target: number;
    unit: string;
  }[];
  risks: {
    description: string;
    impact: 'high' | 'medium' | 'low';
    mitigation: string;
  }[];
  compliance: {
    framework: string;
    requirement: string;
    deadline: string;
  }[];
}

export interface ESGReport {
  id: string;
  date: string;
  type: 'monthly' | 'quarterly' | 'annual';
  metrics: {
    category: string;
    name: string;
    value: number;
    change: number;
    target: number;
    unit: string;
  }[];
  highlights: {
    category: string;
    achievement: string;
    impact: string;
  }[];
  challenges: {
    description: string;
    status: string;
    nextSteps: string[];
  }[];
  compliance: {
    framework: string;
    status: string;
    gaps?: string[];
    actions?: string[];
  }[];
  stakeholderUpdates: {
    group: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

// Risk Radar Types
export interface RiskFactor {
  id: string;
  category: 'climate' | 'deforestation' | 'traceability' | 'labor' | 'sourcing' | 'governance';
  name: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  indicators: string[];
  regulatoryTriggers: string[];
}

export interface RegulatoryExposure {
  regulation: string; // 'EUDR', 'CSRD', 'UK Modern Slavery Act', etc.
  region: string;
  applicability: 'direct' | 'indirect' | 'upstream' | 'downstream';
  pressureLevel: 'critical' | 'high' | 'medium' | 'low';
  deadline?: string;
  requirements: string[];
  evidenceNeeded: string[];
}

export interface SectorProfile {
  id: string;
  name: string;
  code: string; // NACE, NAICS, etc.
  riskFactors: {
    environmental: RiskFactor[];
    social: RiskFactor[];
    governance: RiskFactor[];
  };
  regulatoryExposure: RegulatoryExposure[];
}

export interface GeographyProfile {
  id: string;
  name: string;
  code: string; // ISO 3166
  region: string;
  regulatoryIntensity: {
    environmental: number; // 0-100
    social: number;
    governance: number;
  };
  activeRegulations: RegulatoryExposure[];
  upcomingRegulations: RegulatoryExposure[];
}

export interface SupplierNode {
  id: string;
  name: string;
  geography: string;
  sector: string;
  riskScore: number;
  exposureSignals: ExposureSignal[];
}

export interface SupplyChainFootprint {
  id: string;
  organizationId: string;
  tiers: {
    tier: number; // 1 = direct suppliers, 2 = suppliers' suppliers, etc.
    suppliers: SupplierNode[];
  }[];
  riskHotspots: {
    geography: string;
    sector: string;
    riskLevel: 'high' | 'medium' | 'low';
    factors: string[];
  }[];
}

export interface ExposureSignal {
  id: string;
  type: 'environmental' | 'social' | 'governance' | 'regulatory';
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  source: string;
  timestamp: string;
  relatedRegulation?: string;
  evidenceRequired?: boolean;
}

export interface ExposureLevel {
  level: 'critical' | 'high' | 'medium' | 'low';
  score: number; // 0-100
  signals: ExposureSignal[];
  trends?: {
    period: string;
    score: number;
  }[];
}

export interface RiskRadarOutput {
  organizationId: string;
  generatedAt: string;
  overallExposure: {
    environmental: ExposureLevel;
    social: ExposureLevel;
    governance: ExposureLevel;
    regulatory: ExposureLevel;
  };
  exposureSignals: ExposureSignal[];
  regulatoryPressure: {
    region: string;
    intensity: number;
    regulations: RegulatoryExposure[];
  }[];
  riskHotspots: {
    geography: string;
    sector: string;
    riskLevel: string;
    factors: string[];
  }[];
  supplyChainExposure?: SupplyChainFootprint;
}

export interface RiskRadarConfig {
  id?: string;
  organizationId?: string;
  sectorCode?: string;
  geographies: string[];
  supplyChainTiers?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Evidence Workspace Types
export interface EvidenceItem {
  id: string;
  title: string;
  description?: string;
  type: 'document' | 'certificate' | 'audit' | 'policy' | 'report' | 'data' | 'other';
  category: 'environmental' | 'social' | 'governance';
  status: 'complete' | 'partial' | 'missing' | 'expired';
  uploadedAt: string;
  expiresAt?: string;
  file?: {
    name: string;
    type: string;
    size: number;
    url: string;
  };
  metadata: {
    framework?: string[];
    regulation?: string[];
    tags?: string[];
    version?: string;
    author?: string;
  };
  linkedTo: {
    riskSignal?: string;
    regulation?: string;
    assessment?: string;
  }[];
  readinessScore: number; // 0-100
}

export interface EvidenceInventory {
  organizationId: string;
  lastUpdated: string;
  items: EvidenceItem[];
  coverage: {
    byPillar: {
      environmental: CoverageMetrics;
      social: CoverageMetrics;
      governance: CoverageMetrics;
    };
    byRegulation: Record<string, CoverageMetrics>;
    byFramework: Record<string, CoverageMetrics>;
  };
  gaps: EvidenceGap[];
  readiness: ReadinessSnapshot;
}

export interface CoverageMetrics {
  total: number;
  complete: number;
  partial: number;
  missing: number;
  expired: number;
  coveragePercentage: number;
}

export interface EvidenceGap {
  id: string;
  category: string;
  regulation?: string;
  framework?: string;
  requirement: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  evidenceNeeded: string[];
  deadline?: string;
  linkedRiskSignal?: string;
}

export interface ReadinessSnapshot {
  timestamp: string;
  overall: number; // 0-100
  byPillar: {
    environmental: number;
    social: number;
    governance: number;
  };
  byRegulation: Record<string, number>;
  trends: {
    period: string;
    score: number;
  }[];
  nextReviewDate: string;
}

export interface EvidenceRequirement {
  id: string;
  regulation: string;
  requirement: string;
  category: 'environmental' | 'social' | 'governance';
  evidenceTypes: string[];
  mandatory: boolean;
  frequency?: 'one-time' | 'annual' | 'quarterly' | 'ongoing';
  applicableTo: {
    sectors: string[];
    geographies: string[];
    organizationSize?: string[];
  };
}