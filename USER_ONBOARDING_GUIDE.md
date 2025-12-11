# ImpactSoluce User Onboarding Guide

**Version:** 1.0.0  
**Last Updated:** December 2025

This guide provides strategies and patterns for onboarding new users to ImpactSoluce, ensuring they understand the platform and can quickly achieve value.

---

## Onboarding Philosophy

### Core Principles

1. **Fast Time to Value:** Users should see value in under 5 minutes
2. **Progressive Disclosure:** Show what's needed when it's needed
3. **Guided Experience:** Help users understand what to do next
4. **No Overwhelm:** Avoid information overload
5. **Learn by Doing:** Let users explore while providing guidance

---

## Onboarding Flows

### Flow 1: First-Time Visitor → Risk Radar

**Goal:** Get user to see their exposure in under 5 minutes

**Steps:**

1. **Landing Page**
   - Clear value proposition
   - Primary CTA: "See Your Exposure"
   - Secondary CTA: "Check Your Readiness"

2. **Risk Radar Welcome Screen**
   - Explain what Risk Radar does
   - Show what information is needed
   - Clear setup button

3. **Configuration Wizard (3 Steps)**
   - **Step 1:** Sector selection
     - Clear instructions
     - Searchable list
     - Progress indicator
   - **Step 2:** Geography selection
     - Visual region cards
     - Multi-select interface
     - Clear descriptions
   - **Step 3:** Supply chain depth
     - Simple options
     - Clear explanations
     - Final confirmation

4. **Results Dashboard**
   - Immediate exposure view
   - Clear signals and alerts
   - Next steps guidance

**Success Metrics:**
- Configuration completion rate > 80%
- Time to first results < 5 minutes
- User understands what they're seeing

### Flow 2: First-Time Visitor → Impact Scan

**Goal:** Guide user through comprehensive assessment

**Steps:**

1. **Impact Scan Welcome**
   - Explain what Impact Scan does
   - Set expectations (time, requirements)
   - Show benefits

2. **Assessment Start**
   - Overview of sections
   - Progress tracking
   - Save/resume capability

3. **During Assessment**
   - Section-by-section guidance
   - Helpful tooltips
   - Progress indicators
   - Save reminders

4. **Results & Next Steps**
   - Clear results presentation
   - Actionable insights
   - Next steps guidance

---

## Onboarding Elements

### Welcome Screens

**Purpose:** Set expectations and explain value

**Components:**
- Clear title and description
- Visual illustration or preview
- Key benefits list
- Primary action button
- Optional: Skip option

**Example:**
```tsx
<div className="text-center max-w-2xl mx-auto py-12">
  <Radar className="h-16 w-16 text-primary mx-auto mb-6" />
  <h1 className="text-3xl font-bold mb-4">
    Impact Risk Radar™
  </h1>
  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
    Instantly convert your sector, geography, and supply-chain footprint 
    into a clear ESG exposure view.
  </p>
  <div className="space-y-4 mb-8">
    <div className="flex items-start gap-3">
      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
      <span>See environmental pressure signals</span>
    </div>
    <div className="flex items-start gap-3">
      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
      <span>Identify regulatory pressure by region</span>
    </div>
    <div className="flex items-start gap-3">
      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
      <span>Track evidence readiness</span>
    </div>
  </div>
  <Button size="lg" onClick={onStart}>
    Configure Risk Radar
  </Button>
</div>
```

### Progress Indicators

**Purpose:** Show users where they are in a process

**Types:**
- Step indicators (1 of 3)
- Progress bars (percentage)
- Breadcrumbs (navigation path)

**Example:**
```tsx
<div className="mb-8">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
      Step {currentStep} of {totalSteps}
    </span>
    <span className="text-sm text-gray-500 dark:text-gray-400">
      {Math.round((currentStep / totalSteps) * 100)}% Complete
    </span>
  </div>
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
    <div
      className="bg-primary h-2 rounded-full transition-all duration-300"
      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
    />
  </div>
</div>
```

### Tooltips & Help Text

**Purpose:** Provide contextual help without cluttering the interface

**Guidelines:**
- Use for non-obvious features
- Keep text concise
- Show on hover/focus
- Accessible (keyboard accessible)

**Example:**
```tsx
<div className="relative group">
  <label className="block text-sm font-medium mb-1">
    Sector Selection
    <button
      type="button"
      className="ml-1 text-gray-400 hover:text-gray-600"
      aria-label="Help: Sector Selection"
    >
      <Info className="h-4 w-4" />
    </button>
  </label>
  <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-10">
    <div className="bg-gray-900 text-white text-sm rounded-lg p-3 max-w-xs">
      Select your primary business sector. This helps us identify 
      relevant regulations and exposure factors.
    </div>
  </div>
</div>
```

### Empty States

**Purpose:** Guide users when there's no content yet

**Components:**
- Visual illustration (icon or illustration)
- Clear heading
- Helpful description
- Action button

**Example:**
```tsx
<div className="text-center py-12">
  <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
    <Radar className="h-16 w-16" />
  </div>
  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
    No Risk Radar Configuration
  </h3>
  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
    Configure your Risk Radar to see exposure signals based on your 
    sector, geography, and supply chain.
  </p>
  <Button onClick={onConfigure}>
    Configure Risk Radar
  </Button>
</div>
```

### Success States

**Purpose:** Celebrate completion and guide next steps

**Components:**
- Success icon or animation
- Clear success message
- Summary of what was accomplished
- Next steps or actions

**Example:**
```tsx
<div className="text-center py-12">
  <div className="mx-auto h-16 w-16 text-green-500 mb-4">
    <CheckCircle className="h-16 w-16" />
  </div>
  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
    Configuration Complete!
  </h3>
  <p className="text-gray-500 dark:text-gray-400 mb-6">
    Your Risk Radar is now configured. We're analyzing your exposure...
  </p>
  <div className="flex justify-center gap-3">
    <Button variant="outline" onClick={onEdit}>
      Edit Configuration
    </Button>
    <Button onClick={onViewResults}>
      View Results
    </Button>
  </div>
</div>
```

---

## Guided Tours

### Feature Discovery

**Purpose:** Introduce new features to existing users

**Implementation:**
- Highlight new features
- Show brief explanation
- Allow dismissal
- Track if user has seen it

**Example:**
```tsx
{showFeatureHighlight && (
  <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm z-50 border border-primary">
    <div className="flex items-start justify-between mb-2">
      <h4 className="font-semibold text-gray-900 dark:text-white">
        New: Evidence Workspace
      </h4>
      <button
        onClick={() => setShowFeatureHighlight(false)}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
      Organize and track your compliance evidence in one place.
    </p>
    <Button size="sm" onClick={onExplore}>
      Explore Now
    </Button>
  </div>
)}
```

### Interactive Tutorials

**Purpose:** Walk users through complex features step-by-step

**Components:**
- Step-by-step instructions
- Highlighted elements
- Next/Previous navigation
- Skip option
- Progress indicator

---

## Contextual Help

### Inline Help

**Purpose:** Provide help where users need it

**Types:**
- Help icons next to fields
- Expandable help sections
- Info badges

### Help Documentation

**Purpose:** Comprehensive help when needed

**Access Points:**
- Help menu in header
- "Learn More" links
- Documentation page
- FAQ sections

---

## Onboarding Best Practices

### Do's ✅

- **Set Clear Expectations**
  - Tell users what they'll accomplish
  - Estimate time required
  - Explain what information is needed

- **Provide Immediate Value**
  - Show results quickly
  - Celebrate small wins
  - Make progress visible

- **Use Progressive Disclosure**
  - Don't show everything at once
  - Reveal features as needed
  - Guide users step-by-step

- **Make It Optional**
  - Allow users to skip
  - Don't force tutorials
  - Provide easy access to help

- **Test and Iterate**
  - Track completion rates
  - Monitor drop-off points
  - Gather user feedback
  - Continuously improve

### Don'ts ❌

- **Don't Overwhelm**
  - Avoid long tutorials
  - Don't show all features at once
  - Keep instructions concise

- **Don't Block Users**
  - Allow skipping
  - Don't force completion
  - Provide alternative paths

- **Don't Assume Knowledge**
  - Explain terminology
  - Provide context
  - Use plain language

- **Don't Ignore Feedback**
  - Listen to users
  - Fix pain points
  - Improve based on data

---

## Onboarding Metrics

### Key Metrics to Track

1. **Completion Rate**
   - % of users who complete onboarding
   - Drop-off points
   - Time to completion

2. **Engagement**
   - Feature adoption
   - Return visits
   - Time spent in app

3. **Success**
   - Users who achieve first value
   - Task completion rates
   - User satisfaction scores

4. **Support**
   - Help requests
   - Common questions
   - Support ticket volume

### Target Metrics

- **Onboarding Completion:** > 80%
- **Time to First Value:** < 5 minutes
- **Feature Discovery:** > 60% within first week
- **User Satisfaction:** > 4/5

---

## Implementation Examples

### Onboarding Hook

```tsx
// hooks/useOnboarding.ts
import { useState, useEffect } from 'react';

export function useOnboarding() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem('hasSeenOnboarding');
    setHasSeenOnboarding(seen === 'true');
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setHasSeenOnboarding(true);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  return {
    hasSeenOnboarding,
    currentStep,
    completeOnboarding,
    nextStep,
    previousStep,
  };
}
```

### Onboarding Component

```tsx
// components/onboarding/OnboardingWizard.tsx
import { useState } from 'react';
import Button from '../ui/Button';
import { Card } from '../ui/Card';

interface OnboardingWizardProps {
  steps: Array<{
    title: string;
    content: React.ReactNode;
  }>;
  onComplete: () => void;
  onSkip?: () => void;
}

export function OnboardingWizard({ steps, onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">
            {steps[currentStep].title}
          </h2>
          <div>{steps[currentStep].content}</div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div>
            {onSkip && (
              <Button variant="ghost" onClick={onSkip}>
                Skip
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {!isFirstStep && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            <Button onClick={handleNext}>
              {isLastStep ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
```

---

## Resources

- **UI/UX Guidelines:** See UI_UX_GUIDELINES.md
- **Component Usage:** See COMPONENT_USAGE_GUIDE.md
- **Design System:** See DESIGN_SYSTEM.md

---

## Version History

- **v1.0.0** (December 2025): Initial onboarding guide

---

*This guide will be updated based on user feedback and onboarding analytics.*

