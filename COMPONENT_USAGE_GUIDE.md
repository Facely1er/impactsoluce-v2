# ImpactSoluce Component Usage Guide

**Version:** 1.0.0  
**Last Updated:** December 2024

This guide provides detailed usage examples and best practices for all UI components in ImpactSoluce.

---

## Table of Contents

1. [Buttons](#buttons)
2. [Cards](#cards)
3. [Forms](#forms)
4. [Alerts](#alerts)
5. [Loading States](#loading-states)
6. [Navigation](#navigation)
7. [Data Display](#data-display)
8. [Layout Components](#layout-components)

---

## Buttons

### Basic Usage

```tsx
import Button from '../components/ui/Button';

// Primary button (default)
<Button>Save Changes</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Outline button
<Button variant="outline">Learn More</Button>

// Ghost button
<Button variant="ghost">Skip</Button>
```

### Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
```

### With Icons

```tsx
import { ArrowRight, Download } from 'lucide-react';

<Button icon={<ArrowRight />}>
  Continue
</Button>

<Button variant="outline" icon={<Download />}>
  Export Report
</Button>
```

### Loading State

```tsx
<Button loading={isLoading}>
  Save Configuration
</Button>
```

### Disabled State

```tsx
<Button disabled={!isValid}>
  Submit
</Button>
```

### Best Practices

✅ **Do:**
- Use primary button for main action
- Use clear, action-oriented labels
- Include icons for visual clarity
- Show loading state during async operations

❌ **Don't:**
- Use multiple primary buttons on same page
- Use vague labels like "Click Here"
- Disable buttons without explanation
- Use buttons for navigation (use Link instead)

### Common Patterns

**Form Actions:**
```tsx
<div className="flex justify-end gap-3 mt-6">
  <Button variant="outline" onClick={onCancel}>
    Cancel
  </Button>
  <Button onClick={onSubmit} loading={isSubmitting}>
    Save Changes
  </Button>
</div>
```

**CTA Section:**
```tsx
<div className="flex flex-col sm:flex-row gap-4">
  <Button size="lg" icon={<ArrowRight />}>
    See Your Exposure
  </Button>
  <Button variant="outline" size="lg">
    Learn More
  </Button>
</div>
```

---

## Cards

### Basic Card

```tsx
import { Card, CardContent } from '../components/ui/Card';

<Card>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

### Card with Header

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

<Card>
  <CardHeader>
    <CardTitle>Exposure Overview</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content here</p>
  </CardContent>
</Card>
```

### Card Variants

```tsx
// With border
<Card border>
  <CardContent>Content</CardContent>
</Card>

// Different shadows
<Card shadow="sm">Light shadow</Card>
<Card shadow="md">Medium shadow (default)</Card>
<Card shadow="lg">Strong shadow</Card>
<Card shadow="none">No shadow</Card>

// Different padding
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding (default)</Card>
<Card padding="lg">Large padding</Card>
```

### Metric Card Pattern

```tsx
<Card>
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Environmental Exposure
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
          72
        </p>
      </div>
      <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 rounded-full">
        <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
          High
        </span>
      </div>
    </div>
  </CardContent>
</Card>
```

### Interactive Card

```tsx
<Card className="hover:shadow-lg transition-shadow cursor-pointer">
  <CardContent>
    <h3 className="font-semibold mb-2">Risk Signal</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      High carbon footprint in supply chain
    </p>
  </CardContent>
</Card>
```

### Best Practices

✅ **Do:**
- Use consistent padding
- Group related information
- Use clear hierarchy (title, content, action)
- Add hover states for interactive cards

❌ **Don't:**
- Nest cards unnecessarily
- Use inconsistent spacing
- Overload cards with information
- Use cards for simple text blocks

---

## Forms

### Input Field

```tsx
<div className="mb-4">
  <label htmlFor="sector" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    Sector Selection <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    id="sector"
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
    placeholder="Select your sector"
  />
  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
    This helps us identify relevant regulations
  </p>
</div>
```

### Select Dropdown

```tsx
<div className="mb-4">
  <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    Operating Region
  </label>
  <select
    id="region"
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
  >
    <option value="">Select a region</option>
    <option value="eu">European Union</option>
    <option value="us">United States</option>
  </select>
</div>
```

### Checkbox

```tsx
<div className="flex items-center">
  <input
    type="checkbox"
    id="terms"
    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
  />
  <label htmlFor="terms" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
    I agree to the terms and conditions
  </label>
</div>
```

### Radio Button

```tsx
<div className="space-y-2">
  <div className="flex items-center">
    <input
      type="radio"
      id="tier1"
      name="tier"
      value="1"
      className="h-4 w-4 text-primary focus:ring-primary"
    />
    <label htmlFor="tier1" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
      Tier 1 only
    </label>
  </div>
  <div className="flex items-center">
    <input
      type="radio"
      id="tier2"
      name="tier"
      value="2"
      className="h-4 w-4 text-primary focus:ring-primary"
    />
    <label htmlFor="tier2" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
      Tier 1 and 2
    </label>
  </div>
</div>
```

### Error State

```tsx
<div className="mb-4">
  <label htmlFor="email" className="block text-sm font-medium text-red-700 dark:text-red-400 mb-1">
    Email Address <span className="text-red-500">*</span>
  </label>
  <input
    type="email"
    id="email"
    className="w-full px-3 py-2 border-2 border-red-300 dark:border-red-600 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
    Please enter a valid email address
  </p>
</div>
```

### Form Layout Pattern

```tsx
<form onSubmit={handleSubmit} className="max-w-2xl">
  <div className="space-y-6">
    {/* Form fields */}
    <div>
      <label>Field 1</label>
      <input type="text" />
    </div>
    
    <div>
      <label>Field 2</label>
      <input type="text" />
    </div>
  </div>
  
  <div className="flex justify-end gap-3 mt-8">
    <Button variant="outline" type="button" onClick={onCancel}>
      Cancel
    </Button>
    <Button type="submit" loading={isSubmitting}>
      Save
    </Button>
  </div>
</form>
```

### Best Practices

✅ **Do:**
- Use proper labels (not placeholder-only)
- Mark required fields clearly
- Provide helpful placeholder text
- Show validation errors inline
- Group related fields

❌ **Don't:**
- Use placeholder as label
- Hide validation errors
- Use vague error messages
- Skip required field indicators
- Create overly long forms

---

## Alerts

### Error Alert

```tsx
import ErrorAlert from '../components/ui/ErrorAlert';

<ErrorAlert
  message="Failed to save configuration"
  details="Please check your connection and try again."
  onClose={() => setError(null)}
/>
```

### Warning Alert

```tsx
<ErrorAlert
  variant="warning"
  message="Configuration incomplete"
  details="Some fields are missing. Please complete all required fields."
/>
```

### Info Alert

```tsx
<ErrorAlert
  variant="info"
  message="New features available"
  details="Check out the latest updates in the Evidence Workspace."
/>
```

### Best Practices

✅ **Do:**
- Use appropriate variant
- Provide clear, actionable messages
- Include details when helpful
- Make dismissible (except critical errors)
- Position appropriately (top of form, inline)

❌ **Don't:**
- Use technical error messages
- Overuse alerts
- Hide important information
- Use alerts for success (use toast instead)

---

## Loading States

### Spinner

```tsx
<div className="flex items-center justify-center p-8">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  <span className="ml-3 text-gray-600 dark:text-gray-400">Loading...</span>
</div>
```

### Skeleton Loader

```tsx
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

<LoadingSkeleton className="h-32" />
```

### Card Skeleton

```tsx
import { CardSkeleton } from '../components/ui/LoadingSkeleton';

<CardSkeleton />
```

### Loading Button

```tsx
<Button loading={isLoading}>
  Save Changes
</Button>
```

### Best Practices

✅ **Do:**
- Show loading state immediately
- Provide context ("Loading exposure data...")
- Use skeleton screens for content loading
- Match skeleton to final content layout

❌ **Don't:**
- Show blank screens
- Use generic "Loading..." everywhere
- Block entire UI unnecessarily
- Forget to handle loading errors

---

## Navigation

### Breadcrumbs

```tsx
<nav aria-label="Breadcrumb">
  <ol className="flex items-center space-x-2 text-sm">
    <li>
      <Link to="/" className="text-gray-500 hover:text-gray-700">
        Home
      </Link>
    </li>
    <li className="text-gray-400">/</li>
    <li>
      <Link to="/risk-radar" className="text-gray-500 hover:text-gray-700">
        Risk Radar
      </Link>
    </li>
    <li className="text-gray-400">/</li>
    <li className="text-gray-900 dark:text-white font-medium">
      Configuration
    </li>
  </ol>
</nav>
```

### Tabs

```tsx
<div className="border-b border-gray-200 dark:border-gray-700">
  <nav className="flex space-x-8">
    <button className="border-b-2 border-primary text-primary py-4 px-1 font-medium">
      Overview
    </button>
    <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1">
      Details
    </button>
    <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1">
      Settings
    </button>
  </nav>
</div>
```

---

## Data Display

### Table

```tsx
<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
    <thead className="bg-gray-50 dark:bg-gray-800">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Signal
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Severity
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Category
        </th>
      </tr>
    </thead>
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
          High carbon footprint
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
            High
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          Environmental
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Empty State

```tsx
<div className="text-center py-12">
  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
    <Radar className="h-12 w-12" />
  </div>
  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
    No exposure signals
  </h3>
  <p className="text-gray-500 dark:text-gray-400 mb-6">
    Configure your Risk Radar to see exposure signals.
  </p>
  <Button onClick={onConfigure}>
    Configure Risk Radar
  </Button>
</div>
```

### Badge

```tsx
// Severity badges
<span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full">
  Critical
</span>

<span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 rounded-full">
  High
</span>

<span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full">
  Medium
</span>

<span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
  Low
</span>
```

---

## Layout Components

### Container

```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

### Section Spacing

```tsx
<section className="py-16">
  {/* Section content */}
</section>
```

### Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Grid items */}
</div>
```

### Flex Layout

```tsx
<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
  {/* Flex items */}
</div>
```

---

## Accessibility Patterns

### Skip Link

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded">
  Skip to main content
</a>
```

### Focus Management

```tsx
// Focus trap in modal
useEffect(() => {
  const firstFocusable = modalRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  firstFocusable?.focus();
}, []);
```

### ARIA Labels

```tsx
<button
  aria-label="Close dialog"
  onClick={onClose}
>
  <X className="h-5 w-5" />
</button>
```

---

## Common Patterns

### Modal/Dialog

```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
    <h2 className="text-xl font-semibold mb-4">Confirm Action</h2>
    <p className="text-gray-600 dark:text-gray-400 mb-6">
      Are you sure you want to proceed?
    </p>
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onConfirm}>
        Confirm
      </Button>
    </div>
  </div>
</div>
```

### Toast Notification

```tsx
// Use ToastProvider for toast notifications
import { useToast } from '../providers/ToastProvider';

const { showToast } = useToast();

showToast({
  message: 'Configuration saved successfully',
  type: 'success'
});
```

---

## Best Practices Summary

### Component Composition

✅ **Do:**
- Compose components from smaller pieces
- Use consistent spacing and sizing
- Follow design system tokens
- Make components reusable

### Accessibility

✅ **Do:**
- Use semantic HTML
- Include ARIA labels
- Ensure keyboard navigation
- Test with screen readers

### Performance

✅ **Do:**
- Lazy load heavy components
- Optimize re-renders
- Use appropriate loading states
- Code split when needed

---

## Resources

- **Design System:** See DESIGN_SYSTEM.md
- **UI/UX Guidelines:** See UI_UX_GUIDELINES.md
- **Component Source:** `src/components/ui/`

---

*This guide is a living document. Components and patterns will be updated as the platform evolves.*

