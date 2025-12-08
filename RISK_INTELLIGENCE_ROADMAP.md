# ImpactSoluce Risk Intelligence & Evidence Readiness Implementation Roadmap

## Executive Summary

This roadmap outlines the transformation of ImpactSoluce from an ESG assessment platform to a comprehensive **ESG Risk Intelligence & Evidence Readiness** platform. The hybrid approach preserves existing assessment capabilities while adding critical risk intelligence and evidence management features.

**Target Positioning**: "Know where your impact exposure is — before regulators, buyers, or financiers ask."

---

## Strategic Overview

### Current State
- ESG Assessment & Scoring Platform
- Framework Mapping (GRI, SASB, TCFD, CSRD, ISSB, ISO)
- Carbon Tracking & Dashboards
- Report Generation

### Target State
- **Impact Risk Radar™**: Sector/geography-based exposure analysis
- **Evidence Readiness Workspace**: Centralized evidence inventory & readiness tracking
- **Modular Regulatory Intelligence**: EUDR, Child Labor, Supply Chain, Climate Disclosure
- **Assessment Module**: Retained as "Impact Scan" foundation

### Key Differentiators
- Focus on **exposure signals** not performance scores
- **Evidence-first** approach to compliance readiness
- **Regulatory pressure** mapping by region/sector
- **Intelligence layer** not opinion engine

---

## Phase 1: Foundation & Positioning (Weeks 1-4)

### 1.1 Content & Messaging Updates

#### Files to Update:
- `src/pages/Home.tsx` - New hero messaging
- `src/pages/Features.tsx` - Feature descriptions
- `src/pages/About.tsx` - Positioning update
- `src/pages/Pricing.tsx` - Pricing tiers for modules
- `README.md` - Platform description

#### Key Changes:
```typescript
// New positioning statement
"ImpactSoluce transforms environmental, social, and governance obligations 
into decision-grade intelligence. Not reports. Not promises. 
Evidence-based exposure signals."

// Feature hierarchy
1. Impact Risk Radar™ (NEW - Primary)
2. Evidence Readiness Workspace (NEW - Primary)
3. Impact Scan (RENAMED from "ESG Assessment")
4. Regulatory Intelligence Modules (NEW - Modular)
```

#### Tasks:
- [ ] Update all marketing copy to focus on "exposure" and "evidence readiness"
- [ ] Remove language about "improving ESG scores" and "actionable roadmaps"
- [ ] Add messaging about "intelligence layer" vs "opinion engine"
- [ ] Update CTAs to emphasize compliance readiness
- [ ] Create new value proposition: "Know before they ask"

### 1.2 Assessment Module Rebranding

#### Rename "ESG Assessment" → "Impact Scan"
- [ ] Update route: `/assessment` → `/impact-scan` (keep `/assessment` as alias)
- [ ] Update component names: `Assessment.tsx` → `ImpactScan.tsx`
- [ ] Update navigation labels
- [ ] Reposition as foundation layer: "Understand your current posture"
- [ ] Keep scoring but de-emphasize in messaging

#### Files to Modify:
- `src/pages/Assessment.tsx` → `src/pages/ImpactScan.tsx`
- `src/components/assessment/*` → Update component names
- `src/routes/index.tsx` → Update routes
- `src/components/layout/Header.tsx` → Update navigation

---

## Phase 2: Impact Risk Radar™ (Weeks 5-10)

### 2.1 Data Models

#### New Types (`src/types/index.ts`):
```typescript
// Sector & Geography Data
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

export interface SupplierNode {
  id: string;
  name: string;
  geography: string;
  sector: string;
  riskScore: number;
  exposureSignals: ExposureSignal[];
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

// Risk Radar Output
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
```

### 2.2 Core Components

#### New Pages:
- `src/pages/RiskRadar.tsx` - Main Risk Radar interface
- `src/pages/RiskRadarConfiguration.tsx` - Setup wizard (sector, geography, supply chain)

#### New Components:
- `src/components/risk-radar/ExposureMap.tsx` - Geographic exposure visualization
- `src/components/risk-radar/ExposureSignals.tsx` - Signal list & filtering
- `src/components/risk-radar/RegulatoryPressure.tsx` - Regulatory intensity by region
- `src/components/risk-radar/RiskHotspots.tsx` - Supply chain risk visualization
- `src/components/risk-radar/ExposureSummary.tsx` - Overall exposure dashboard

### 2.3 Risk Calculation Engine

#### New Utilities:
- `src/utils/riskRadarEngine.ts` - Core exposure calculation logic
- `src/utils/regulatoryIntelligence.ts` - Regulatory mapping & pressure calculation
- `src/utils/sectorProfiles.ts` - Sector risk factor database
- `src/utils/geographyProfiles.ts` - Regional regulatory database

#### Key Functions:
```typescript
// Calculate exposure based on sector + geography
export function calculateExposure(
  sector: SectorProfile,
  geographies: GeographyProfile[],
  supplyChain?: SupplyChainFootprint
): RiskRadarOutput

// Map regulations to organization profile
export function mapRegulatoryExposure(
  sector: string,
  geographies: string[],
  supplyChainTiers?: number
): RegulatoryExposure[]

// Generate exposure signals
export function generateExposureSignals(
  riskRadarOutput: RiskRadarOutput
): ExposureSignal[]
```

### 2.4 Data Sources & Integration

#### Initial Data (Static):
- Sector risk profiles (NACE/NAICS mapping)
- Regional regulatory databases
- Regulation applicability matrices

#### Future Integration Points:
- External regulatory intelligence APIs
- Supply chain data providers
- Real-time regulatory updates

### 2.5 UI/UX Design

#### Risk Radar Dashboard Layout:
```
┌─────────────────────────────────────────────────┐
│  Impact Risk Radar™                             │
│  [Configure] [Export] [Refresh]                 │
├─────────────────────────────────────────────────┤
│  Overall Exposure                               │
│  [E] [S] [G] [Regulatory] - Visual indicators  │
├─────────────────────────────────────────────────┤
│  Exposure Signals (Priority)                    │
│  - Critical: 3 | High: 8 | Medium: 15          │
│  [Signal List with filters]                     │
├─────────────────────────────────────────────────┤
│  Regulatory Pressure by Region                  │
│  [Map visualization]                            │
│  EU: Critical | US: High | APAC: Medium        │
├─────────────────────────────────────────────────┤
│  Risk Hotspots                                  │
│  [Supply chain visualization]                   │
└─────────────────────────────────────────────────┘
```

---

## Phase 3: Evidence Readiness Workspace (Weeks 11-16)

### 3.1 Data Models

#### New Types:
```typescript
export interface EvidenceItem {
  id: string;
  name: string;
  description: string;
  category: 'environmental' | 'social' | 'governance';
  type: 'document' | 'certificate' | 'audit' | 'policy' | 'data' | 'other';
  status: 'complete' | 'partial' | 'missing' | 'expired';
  uploadDate?: string;
  expiryDate?: string;
  files: FileAttachment[];
  metadata: {
    framework?: string;
    regulation?: string;
    requirement?: string;
    coverage?: string[];
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
```

### 3.2 Core Components

#### New Pages:
- `src/pages/EvidenceWorkspace.tsx` - Main evidence management interface
- `src/pages/EvidenceUpload.tsx` - Evidence upload & categorization
- `src/pages/ReadinessDashboard.tsx` - Readiness snapshots & trends

#### New Components:
- `src/components/evidence/EvidenceInventory.tsx` - Evidence list & search
- `src/components/evidence/EvidenceCard.tsx` - Individual evidence item
- `src/components/evidence/CoverageIndicators.tsx` - Coverage visualization
- `src/components/evidence/ReadinessSnapshot.tsx` - Readiness scorecard
- `src/components/evidence/EvidenceGaps.tsx` - Gap analysis view
- `src/components/evidence/EvidenceLinker.tsx` - Link evidence to regulations/risks
- `src/components/evidence/ExportView.tsx` - Export for regulators/auditors

### 3.3 Evidence Management Engine

#### New Utilities:
- `src/utils/evidenceEngine.ts` - Evidence categorization & scoring
- `src/utils/readinessCalculator.ts` - Readiness score calculation
- `src/utils/gapAnalysis.ts` - Gap identification logic
- `src/utils/evidenceMapping.ts` - Map evidence to requirements

#### Key Functions:
```typescript
// Calculate readiness based on evidence inventory
export function calculateReadiness(
  inventory: EvidenceInventory,
  requirements: EvidenceRequirement[]
): ReadinessSnapshot

// Identify evidence gaps
export function identifyGaps(
  inventory: EvidenceInventory,
  requirements: EvidenceRequirement[],
  riskSignals?: ExposureSignal[]
): EvidenceGap[]

// Map evidence to regulatory requirements
export function mapEvidenceToRequirements(
  evidence: EvidenceItem[],
  requirements: EvidenceRequirement[]
): Map<string, EvidenceItem[]>
```

### 3.4 Integration with Risk Radar

#### Link Evidence to Exposure Signals:
- When Risk Radar identifies exposure → Show required evidence
- When evidence is missing → Highlight in Risk Radar
- Evidence readiness affects exposure severity

### 3.5 Export Functionality

#### Export Views:
- **Regulator View**: Evidence organized by regulation
- **Buyer View**: Evidence for supplier assessment
- **Auditor View**: Complete evidence inventory with metadata
- **Financier View**: Evidence for ESG-linked financing

#### Export Formats:
- PDF (formatted reports)
- JSON (structured data)
- Excel (evidence inventory spreadsheet)
- CSV (evidence list)

---

## Phase 4: Modular Regulatory Intelligence (Weeks 17-24)

### 4.1 Module Architecture

#### Module Structure:
```typescript
export interface RegulatoryModule {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'coming_soon';
  regulations: string[];
  features: {
    exposureAnalysis: boolean;
    evidenceRequirements: boolean;
    complianceTracking: boolean;
    reporting: boolean;
  };
  configuration: ModuleConfiguration;
}

export interface ModuleConfiguration {
  enabled: boolean;
  applicableSectors: string[];
  applicableGeographies: string[];
  customSettings?: Record<string, any>;
}
```

### 4.2 EU Deforestation Regulation (EUDR) Module

#### Features:
- **Commodity Mapping**: Identify covered commodities (cattle, cocoa, coffee, palm oil, rubber, soya, wood)
- **Due Diligence Requirements**: Track DD obligations
- **Geolocation Tracking**: Map supply chain origins
- **Evidence Requirements**: Required documentation checklist
- **Compliance Status**: Track compliance readiness

#### Components:
- `src/components/modules/eudr/CommodityMapper.tsx`
- `src/components/modules/eudr/SupplyChainTracker.tsx`
- `src/components/modules/eudr/DDRequirements.tsx`
- `src/components/modules/eudr/ComplianceStatus.tsx`

#### Data Models:
```typescript
export interface EUDRCommodity {
  id: string;
  name: string;
  code: string;
  covered: boolean;
  supplyChain: {
    origin: GeographyProfile[];
    volume: number;
    riskLevel: 'high' | 'medium' | 'low';
  };
}

export interface EUDRCompliance {
  organizationId: string;
  commodities: EUDRCommodity[];
  dueDiligence: {
    status: 'complete' | 'in_progress' | 'not_started';
    evidence: EvidenceItem[];
    gaps: EvidenceGap[];
  };
  geolocationData: {
    commodity: string;
    coordinates: { lat: number; lng: number }[];
    date: string;
  }[];
  complianceScore: number;
}
```

### 4.3 Child Labor & Social Compliance Module

#### Features:
- **Labor Risk Assessment**: Identify high-risk geographies/sectors
- **Supplier Audits**: Track audit requirements
- **Remediation Tracking**: Monitor remediation actions
- **Certification Management**: Track certifications (SMETA, SA8000, etc.)

#### Components:
- `src/components/modules/child-labor/RiskAssessment.tsx`
- `src/components/modules/child-labor/SupplierAudits.tsx`
- `src/components/modules/child-labor/RemediationTracker.tsx`
- `src/components/modules/child-labor/CertificationManager.tsx`

### 4.4 Supply Chain Transparency Module

#### Features:
- **Supply Chain Mapping**: Visualize supply chain tiers
- **Transparency Requirements**: Track disclosure obligations
- **Supplier Data Collection**: Manage supplier questionnaires
- **Risk Propagation**: Analyze risk through supply chain

#### Components:
- `src/components/modules/supply-chain/ChainMapper.tsx`
- `src/components/modules/supply-chain/TransparencyTracker.tsx`
- `src/components/modules/supply-chain/SupplierPortal.tsx`
- `src/components/modules/supply-chain/RiskPropagation.tsx`

### 4.5 Climate & Environmental Disclosure Module

#### Features:
- **Disclosure Requirements**: Track CSRD, TCFD, SEC Climate rules
- **Data Collection**: Manage climate data requirements
- **Scenario Analysis**: Track scenario planning requirements
- **Target Setting**: Monitor climate target disclosures

#### Components:
- `src/components/modules/climate/DisclosureTracker.tsx`
- `src/components/modules/climate/DataCollection.tsx`
- `src/components/modules/climate/ScenarioAnalysis.tsx`
- `src/components/modules/climate/TargetTracking.tsx`

### 4.6 Module Activation System

#### Module Management:
- `src/pages/Modules.tsx` - Module activation/deactivation
- `src/components/modules/ModuleCard.tsx` - Individual module card
- `src/utils/moduleManager.ts` - Module configuration logic

---

## Phase 5: Integration & Workflow (Weeks 25-28)

### 5.1 Unified Workflow

#### User Journey:
```
1. Impact Scan (Assessment)
   ↓
2. Risk Radar Configuration
   ↓
3. Exposure Analysis
   ↓
4. Evidence Requirements Identified
   ↓
5. Evidence Workspace
   ↓
6. Readiness Dashboard
   ↓
7. Export for Regulators/Buyers
```

### 5.2 Cross-Feature Integration

#### Integration Points:
- **Risk Radar → Evidence Workspace**: Link exposure signals to evidence requirements
- **Evidence Workspace → Risk Radar**: Evidence gaps increase exposure severity
- **Modules → Risk Radar**: Module-specific exposure signals
- **Modules → Evidence Workspace**: Module-specific evidence requirements
- **Impact Scan → Risk Radar**: Use assessment data to refine exposure analysis

### 5.3 Dashboard Consolidation

#### New Unified Dashboard:
- `src/pages/Dashboard.tsx` - Update to show:
  - Exposure Overview (from Risk Radar)
  - Evidence Readiness (from Workspace)
  - Module Status
  - Recent Activity
  - Quick Actions

---

## Phase 6: Data & Intelligence Layer (Weeks 29-32)

### 6.1 Regulatory Intelligence Database

#### Data Structure:
- Regulation definitions
- Applicability matrices (sector × geography)
- Requirement mappings
- Evidence expectations
- Deadline tracking

#### Initial Data Sources:
- EU regulations (EUDR, CSRD, etc.)
- US regulations (SEC Climate, etc.)
- UK regulations (Modern Slavery Act, etc.)
- Industry-specific requirements

### 6.2 Sector & Geography Profiles

#### Sector Database:
- NACE/NAICS codes
- Risk factors by sector
- Typical supply chain structures
- Common regulatory exposures

#### Geography Database:
- ISO 3166 country codes
- Regional regulatory intensity
- Active regulations by region
- Upcoming regulatory changes

### 6.3 Exposure Signal Generation

#### Signal Sources:
- Regulatory changes
- Sector-specific risks
- Geography-specific risks
- Supply chain analysis
- Evidence gaps

#### Signal Prioritization:
- Critical: Regulatory deadline approaching + missing evidence
- High: High regulatory pressure + partial evidence
- Medium: Moderate pressure + some evidence
- Low: Low pressure + adequate evidence

---

## Phase 7: UI/UX Refinement (Weeks 33-36)

### 7.1 Navigation Restructure

#### New Navigation Hierarchy:
```
Primary:
- Home
- Risk Radar
- Evidence Workspace
- Impact Scan
- Modules
- Dashboard

Secondary (Dropdowns):
- Reports
- Settings
- Resources
```

### 7.2 Visual Design Updates

#### Design Principles:
- **Intelligence-focused**: Data visualization over narratives
- **Evidence-first**: Prominent evidence status indicators
- **Signal-driven**: Clear exposure signal prioritization
- **Regulatory clarity**: Clear regulatory pressure indicators

### 7.3 User Onboarding

#### Onboarding Flow:
1. Welcome & positioning
2. Risk Radar configuration (sector, geography, supply chain)
3. Initial exposure analysis
4. Evidence workspace setup
5. Module activation (if applicable)

---

## Technical Implementation Details

### Database Schema Extensions

#### New Tables (Supabase):
```sql
-- Risk Radar
CREATE TABLE risk_radar_configs (
  id UUID PRIMARY KEY,
  organization_id UUID,
  sector_code TEXT,
  geographies TEXT[],
  supply_chain_tiers INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE exposure_signals (
  id UUID PRIMARY KEY,
  organization_id UUID,
  type TEXT,
  category TEXT,
  severity TEXT,
  description TEXT,
  source TEXT,
  related_regulation TEXT,
  created_at TIMESTAMP
);

-- Evidence Workspace
CREATE TABLE evidence_items (
  id UUID PRIMARY KEY,
  organization_id UUID,
  name TEXT,
  category TEXT,
  type TEXT,
  status TEXT,
  metadata JSONB,
  linked_to JSONB,
  readiness_score INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE evidence_requirements (
  id UUID PRIMARY KEY,
  regulation TEXT,
  requirement TEXT,
  category TEXT,
  evidence_types TEXT[],
  applicable_to JSONB
);

-- Modules
CREATE TABLE module_configurations (
  id UUID PRIMARY KEY,
  organization_id UUID,
  module_id TEXT,
  enabled BOOLEAN,
  configuration JSONB,
  created_at TIMESTAMP
);
```

### API Endpoints (Future)

#### Risk Radar:
- `GET /api/risk-radar/config` - Get configuration
- `POST /api/risk-radar/config` - Update configuration
- `GET /api/risk-radar/exposure` - Get exposure analysis
- `GET /api/risk-radar/signals` - Get exposure signals

#### Evidence Workspace:
- `GET /api/evidence/inventory` - Get evidence inventory
- `POST /api/evidence/upload` - Upload evidence
- `GET /api/evidence/readiness` - Get readiness snapshot
- `GET /api/evidence/gaps` - Get evidence gaps

#### Modules:
- `GET /api/modules` - List available modules
- `POST /api/modules/:id/activate` - Activate module
- `GET /api/modules/:id/status` - Get module status

---

## Migration Strategy

### Phase 1: Non-Breaking Changes
- Content updates (messaging, positioning)
- Assessment rebranding (Impact Scan)
- No data migration required

### Phase 2: Additive Features
- Risk Radar (new feature, doesn't affect existing)
- Evidence Workspace (new feature, doesn't affect existing)
- Existing assessment data remains intact

### Phase 3: Integration
- Link existing assessment data to Risk Radar
- Migrate existing evidence/uploads to Evidence Workspace
- Gradual feature adoption

### Phase 4: Module Rollout
- Modules as opt-in features
- Existing users can activate modules
- No forced migration

---

## Success Metrics

### Phase 1-2 (Foundation):
- [ ] All content updated to new positioning
- [ ] Risk Radar MVP functional
- [ ] Evidence Workspace MVP functional

### Phase 3-4 (Modules):
- [ ] EUDR module complete
- [ ] Child Labor module complete
- [ ] Supply Chain module complete
- [ ] Climate Disclosure module complete

### Phase 5-6 (Integration):
- [ ] Unified workflow functional
- [ ] Cross-feature integration complete
- [ ] Regulatory intelligence database populated

### Phase 7 (Polish):
- [ ] UI/UX updates complete
- [ ] User onboarding flow complete
- [ ] Documentation updated

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1: Foundation | 4 weeks | Content updates, Assessment rebranding |
| Phase 2: Risk Radar | 6 weeks | Risk Radar MVP, Exposure analysis |
| Phase 3: Evidence Workspace | 6 weeks | Evidence management, Readiness tracking |
| Phase 4: Regulatory Modules | 8 weeks | EUDR, Child Labor, Supply Chain, Climate |
| Phase 5: Integration | 4 weeks | Unified workflow, Cross-feature links |
| Phase 6: Intelligence Layer | 4 weeks | Regulatory database, Signal generation |
| Phase 7: UI/UX | 4 weeks | Navigation, Design, Onboarding |
| **Total** | **36 weeks** | **Full platform transformation** |

---

## Next Steps

1. **Review & Approve Roadmap** - Stakeholder alignment
2. **Prioritize Phases** - Determine if any phases can run in parallel
3. **Resource Allocation** - Assign development team
4. **Data Collection** - Begin gathering regulatory intelligence data
5. **Design Mockups** - Create UI/UX designs for new features
6. **Technical Spike** - Proof of concept for Risk Radar engine
7. **Kickoff Phase 1** - Begin content updates

---

## Questions & Considerations

### Open Questions:
1. **Data Sources**: Where will regulatory intelligence data come from?
2. **Supply Chain Data**: How will we collect supply chain information?
3. **Pricing Model**: How to price modular features?
4. **Migration**: How to handle existing users during transition?
5. **External APIs**: Which third-party services to integrate?

### Technical Considerations:
- Performance: Risk Radar calculations may be computationally intensive
- Data Volume: Evidence storage requirements
- Real-time Updates: How to keep regulatory data current
- Scalability: Multi-tenant architecture considerations

### Business Considerations:
- Market Education: Educating market on new positioning
- Sales Enablement: Training sales team on new features
- Customer Communication: How to communicate changes to existing users
- Competitive Response: How competitors might react

---

*This roadmap is a living document and should be updated as implementation progresses and requirements evolve.*

