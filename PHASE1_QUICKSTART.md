# Phase 1 Quick Start Guide: Foundation & Positioning

## Overview
Phase 1 focuses on updating content, messaging, and rebranding the assessment module. This is a **non-breaking change** that can be implemented immediately without affecting existing functionality.

**Duration**: 4 weeks  
**Priority**: High (Foundation for all future work)

---

## Week 1: Content Audit & Messaging Framework

### Day 1-2: Content Audit
- [ ] Review all user-facing content
- [ ] Identify all instances of "ESG assessment", "scoring", "improvement"
- [ ] Document current messaging vs. target messaging
- [ ] Create content update checklist

### Day 3-5: New Messaging Framework
Create a messaging guide document with:

**Core Positioning Statement:**
```
"ImpactSoluce transforms environmental, social, and governance obligations 
into decision-grade intelligence. Know where your impact exposure is — 
before regulators, buyers, or financiers ask."
```

**Key Messages:**
- ✅ "Exposure signals" not "performance scores"
- ✅ "Evidence readiness" not "ESG improvement"
- ✅ "Intelligence layer" not "opinion engine"
- ✅ "Regulatory pressure" not "best practices"
- ✅ "Compliance readiness" not "sustainability journey"

**What We Are:**
- ESG Risk Intelligence Platform
- Evidence Readiness System
- Regulatory Exposure Analyzer
- Compliance Readiness Tracker

**What We Are NOT:**
- ❌ ESG scoring/certification platform
- ❌ Sustainability consultant replacement
- ❌ Performance improvement tool
- ❌ Storytelling/narrative generator

---

## Week 2: Home Page & Landing Pages

### Files to Update:
1. `src/pages/Home.tsx`
2. `src/pages/Features.tsx`
3. `src/pages/About.tsx`

### Home Page Updates:

#### Hero Section:
```typescript
// OLD:
"Transform your ESG & Impact performance through ImpactSoluce™"

// NEW:
"Know where your impact exposure is — before regulators, buyers, or financiers ask.

ImpactSoluce transforms environmental, social, and governance obligations 
into decision-grade intelligence. Not reports. Not promises. 
Evidence-based exposure signals."
```

#### Feature Cards:
```typescript
// Update feature descriptions to focus on:
1. Impact Risk Radar™
   "Instantly convert your sector, geography, and supply-chain footprint 
   into a clear ESG exposure view. See environmental pressure signals, 
   social risk alerts, governance credibility gaps, and regulatory 
   pressure intensity by region."

2. Evidence Readiness Workspace
   "Centralized space to organize, assess, and evidence your sustainability 
   posture. Get coverage indicators by ESG pillar, readiness snapshots 
   with timestamps, and exportable views for regulators, buyers, and auditors."

3. Impact Scan (formerly "ESG Assessment")
   "Understand your current ESG posture through comprehensive assessment. 
   Foundation for exposure analysis and evidence requirements."

4. Regulatory Intelligence Modules
   "Modular intelligence for EUDR, Child Labor & Social Compliance, 
   Supply-Chain Transparency, and Climate & Environmental Disclosure."
```

#### CTA Updates:
```typescript
// OLD:
"Start Your ESG Assessment"
"Improve Your ESG Performance"

// NEW:
"See Your Exposure"
"Check Your Readiness"
"Start Risk Analysis"
```

### Features Page Updates:
- [ ] Update all feature descriptions
- [ ] Remove language about "improving scores"
- [ ] Add "What ImpactSoluce Is NOT" section
- [ ] Emphasize intelligence and evidence focus

### About Page Updates:
- [ ] Update mission statement
- [ ] Update value proposition
- [ ] Update target audience (exporters, agricultural cooperatives, procurement teams, financial institutions)
- [ ] Remove generic "sustainability journey" language

---

## Week 3: Assessment Module Rebranding

### Step 1: Create ImpactScan Component
- [ ] Copy `src/pages/Assessment.tsx` → `src/pages/ImpactScan.tsx`
- [ ] Update component name and internal references
- [ ] Update page title: "Impact Scan" instead of "ESG Assessment"
- [ ] Update description to position as foundation layer

### Step 2: Update Routes
In `src/routes/index.tsx`:
```typescript
// Add new route
const ImpactScan = lazy(() => import('../pages/ImpactScan'));

// Add route
<Route path="/impact-scan" element={<SuspenseWrapper><ImpactScan /></SuspenseWrapper>} />

// Keep old route as alias (for backward compatibility)
<Route path="/assessment" element={<Navigate to="/impact-scan" replace />} />
```

### Step 3: Update Navigation
In `src/components/layout/Header.tsx`:
```typescript
// Update navigation items
{ name: t('Impact Scan'), href: '/impact-scan', icon: ClipboardList }

// Update any references in dropdowns
```

### Step 4: Update Assessment Page Content
In `src/pages/ImpactScan.tsx`:
```typescript
// Update page title
<h1>Impact Scan</h1>

// Update description
<p>
  Understand your current ESG posture through comprehensive assessment. 
  This foundation analysis helps identify your sector, geography, and 
  operational profile for exposure analysis.
</p>

// De-emphasize scoring in messaging
// Keep scoring functionality but position as "baseline understanding"
```

### Step 5: Update Component References
- [ ] Update `AssessmentState.tsx` comments/references
- [ ] Update `AssessmentResults.tsx` to reference "Impact Scan Results"
- [ ] Update any assessment-related components

---

## Week 4: Pricing, Documentation & Final Polish

### Pricing Page Updates
In `src/pages/Pricing.tsx`:

#### Update Plan Descriptions:
```typescript
// Free/Trial Plan:
"Perfect for organizations beginning their exposure analysis journey"

// Pro Plan:
"Comprehensive risk intelligence and evidence readiness for SMBs"
Features:
- Impact Risk Radar™
- Evidence Readiness Workspace
- Impact Scan
- Basic regulatory intelligence

// Enterprise Plan:
"Complete risk intelligence platform for large organizations"
Features:
- All Pro features
- All regulatory intelligence modules
- Advanced supply chain analysis
- Custom integrations
```

#### Add Module Pricing:
```typescript
// Add section for modular add-ons
const moduleAddOns = [
  {
    name: 'EU Deforestation Regulation (EUDR)',
    price: '$299/month',
    description: 'EUDR compliance tracking and evidence management'
  },
  {
    name: 'Child Labor & Social Compliance',
    price: '$199/month',
    description: 'Labor risk assessment and audit tracking'
  },
  // ... other modules
];
```

### README Updates
In `README.md`:
```markdown
# ImpactSoluce™ by ERMITS

ESG Risk Intelligence & Evidence Readiness Platform

Transform environmental, social, and governance obligations into 
decision-grade intelligence. Know where your impact exposure is — 
before regulators, buyers, or financiers ask.

## Core Features

- **Impact Risk Radar™**: Sector, geography, and supply-chain exposure analysis
- **Evidence Readiness Workspace**: Centralized evidence inventory and readiness tracking
- **Impact Scan**: Comprehensive ESG posture assessment
- **Regulatory Intelligence Modules**: EUDR, Child Labor, Supply Chain, Climate Disclosure

## What ImpactSoluce Does

- Converts your footprint into ESG exposure signals
- Identifies regulatory pressure by region
- Tracks evidence readiness for compliance
- Shows what exists, what's missing, and where pressure will hit next

## What ImpactSoluce Is NOT

- ❌ Does not generate ESG stories
- ❌ Does not replace consultants
- ❌ Does not certify or score moral performance
- ❌ Does not recommend remediation actions

ImpactSoluce is an intelligence layer, not an opinion engine.
```

### Translation Updates
- [ ] Update `public/locales/en/*.json` with new messaging
- [ ] Update `public/locales/fr/*.json` with French translations
- [ ] Ensure all new terms are translated

### Final Checklist
- [ ] All user-facing text updated
- [ ] All CTAs updated
- [ ] Navigation updated
- [ ] Routes updated (with backward compatibility)
- [ ] Documentation updated
- [ ] Translations updated
- [ ] No broken links
- [ ] All pages tested

---

## Implementation Tips

### 1. Use Feature Flags (Optional)
If you want to gradually roll out changes:
```typescript
// In config
const FEATURES = {
  NEW_POSITIONING: true,
  IMPACT_SCAN_REBRAND: true,
  // ...
};
```

### 2. Backward Compatibility
- Keep `/assessment` route as redirect to `/impact-scan`
- Don't break existing bookmarks
- Maintain API compatibility

### 3. A/B Testing (Optional)
- Test new messaging vs. old messaging
- Measure conversion rates
- Gather user feedback

### 4. Content Review Process
- Review all changes with stakeholders
- Ensure consistency across all pages
- Check for tone and voice alignment

---

## Success Criteria

By end of Phase 1:
- [ ] All content reflects new positioning
- [ ] Assessment module rebranded to "Impact Scan"
- [ ] No references to "improving ESG scores" in primary messaging
- [ ] Clear "What We Are / What We Are NOT" messaging
- [ ] All CTAs updated to new positioning
- [ ] Documentation updated
- [ ] No broken functionality
- [ ] User testing completed

---

## Next Steps After Phase 1

Once Phase 1 is complete:
1. Begin Phase 2: Risk Radar development
2. Gather user feedback on new positioning
3. Refine messaging based on feedback
4. Start data collection for regulatory intelligence

---

## Questions?

If you encounter issues or need clarification:
1. Refer to `RISK_INTELLIGENCE_ROADMAP.md` for full context
2. Review messaging framework document
3. Check with stakeholders for positioning alignment

