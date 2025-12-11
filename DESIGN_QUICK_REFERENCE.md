# ImpactSoluce Design Quick Reference

**Quick access to design system tokens and common patterns**

---

## Colors

### Primary (Teal/Green)
```css
bg-primary        /* #0F766E - Base */
bg-primary-600    /* #059669 - Hover */
bg-primary-700    /* #047857 - Active */
text-primary      /* Text color */
```

### Severity Colors
```css
Critical: bg-red-600 text-red-600
High:     bg-orange-600 text-orange-600
Medium:   bg-yellow-600 text-yellow-600
Low:      bg-green-600 text-green-600
```

### Semantic Colors
```css
Success: bg-green-500 text-green-600
Warning: bg-yellow-500 text-yellow-600
Error:   bg-red-500 text-red-600
Info:    bg-blue-500 text-blue-600
```

---

## Typography

### Headings
```css
text-4xl font-bold    /* H1 - 48px */
text-3xl font-bold    /* H2 - 36px */
text-2xl font-semibold /* H3 - 30px */
text-xl font-semibold  /* H4 - 24px */
text-lg font-semibold  /* H5 - 20px */
```

### Body Text
```css
text-base    /* 16px - Default */
text-lg      /* 18px - Large */
text-sm      /* 14px - Small */
text-xs      /* 12px - Caption */
```

---

## Spacing

### Common Spacing
```css
p-4    /* 16px - Default padding */
p-6    /* 24px - Card padding */
p-8    /* 32px - Section padding */
gap-4  /* 16px - Default gap */
gap-6  /* 24px - Medium gap */
mb-4   /* 16px - Default margin */
mb-8   /* 32px - Section margin */
```

---

## Buttons

### Variants
```tsx
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

### Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### States
```tsx
<Button loading={true}>Loading</Button>
<Button disabled={true}>Disabled</Button>
```

---

## Cards

### Basic Card
```tsx
<Card>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Card with Header
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Card Variants
```tsx
<Card shadow="sm">Light shadow</Card>
<Card shadow="md">Medium shadow</Card>
<Card shadow="lg">Strong shadow</Card>
<Card border>With border</Card>
```

---

## Forms

### Input Field
```tsx
<label className="block text-sm font-medium mb-1">
  Label <span className="text-red-500">*</span>
</label>
<input
  type="text"
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
/>
```

### Error State
```tsx
<input
  className="border-2 border-red-300 focus:ring-red-500"
  aria-invalid="true"
/>
<p className="text-sm text-red-600">Error message</p>
```

---

## Alerts

```tsx
<ErrorAlert
  message="Error message"
  details="Additional details"
  onClose={() => {}}
/>

<ErrorAlert variant="warning" message="Warning" />
<ErrorAlert variant="info" message="Information" />
```

---

## Badges

```tsx
<span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
  Critical
</span>

<span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
  High
</span>
```

---

## Layout

### Container
```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  Content
</div>
```

### Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  Items
</div>
```

### Flex
```tsx
<div className="flex items-center justify-between gap-4">
  Items
</div>
```

---

## Loading States

### Spinner
```tsx
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
```

### Skeleton
```tsx
<LoadingSkeleton className="h-32" />
<CardSkeleton />
```

---

## Empty States

```tsx
<div className="text-center py-12">
  <Icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
  <h3 className="text-lg font-medium mb-2">No items</h3>
  <p className="text-gray-500 mb-6">Description</p>
  <Button>Action</Button>
</div>
```

---

## Responsive Breakpoints

```css
sm:  640px   /* Small devices */
md:  768px   /* Tablets */
lg:  1024px  /* Desktops */
xl:  1280px  /* Large desktops */
2xl: 1536px  /* Extra large */
```

### Usage
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>
```

---

## Dark Mode

All components support dark mode automatically via Tailwind's `dark:` prefix.

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content
</div>
```

---

## Accessibility

### Focus States
```css
focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
```

### ARIA Labels
```tsx
<button aria-label="Close dialog">
  <X />
</button>
```

### Skip Link
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

---

## Common Patterns

### Form Actions
```tsx
<div className="flex justify-end gap-3 mt-6">
  <Button variant="outline" onClick={onCancel}>Cancel</Button>
  <Button onClick={onSubmit}>Save</Button>
</div>
```

### Metric Card
```tsx
<Card>
  <CardContent className="p-6">
    <p className="text-sm text-gray-600">Label</p>
    <p className="text-3xl font-bold mt-2">72</p>
    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
      High
    </span>
  </CardContent>
</Card>
```

### Page Header
```tsx
<div className="mb-8">
  <h1 className="text-3xl font-bold mb-2">Page Title</h1>
  <p className="text-gray-600">Description</p>
</div>
```

---

## Documentation Links

- **Full Design System:** `DESIGN_SYSTEM.md`
- **UI/UX Guidelines:** `UI_UX_GUIDELINES.md`
- **Component Guide:** `COMPONENT_USAGE_GUIDE.md`
- **Onboarding Guide:** `USER_ONBOARDING_GUIDE.md`

---

*Quick reference for common design patterns. See full documentation for detailed guidelines.*

