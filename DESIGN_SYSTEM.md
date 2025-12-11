# ImpactSoluce Design System

**Version:** 1.0.0  
**Last Updated:** December 2025

## Overview

The ImpactSoluce Design System provides a comprehensive set of design principles, components, and guidelines to ensure consistency, accessibility, and excellence across the platform. This system is built on the foundation of clarity, intelligence, and trust.

---

## Design Principles

### 1. **Intelligence-First**
- Data and signals are primary
- No fluff or marketing speak
- Facts over narratives
- Clear, actionable information

### 2. **Clarity**
- Clear value proposition
- No jargon or confusion
- Straightforward navigation
- Obvious next steps

### 3. **Trust**
- Professional design
- Clear messaging
- No hidden features
- Transparent about capabilities

### 4. **Accessibility**
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast support

### 5. **Performance**
- Fast page loads
- Smooth interactions
- Optimized animations
- Responsive across devices

---

## Color System

### Primary Colors

The primary color palette reflects the ESG and sustainability focus of ImpactSoluce.

#### Primary (Teal/Green)
```css
Primary-50:  #ECFDF5  /* Lightest background */
Primary-100: #D1FAE5  /* Light background */
Primary-200: #A7F3D0  /* Subtle accent */
Primary-300: #6EE7B7  /* Light accent */
Primary-400: #34D399  /* Medium accent */
Primary-500: #10B981  /* Base primary */
Primary-600: #059669  /* Hover state */
Primary-700: #047857  /* Active state */
Primary-800: #065F46  /* Dark variant */
Primary-900: #064E3B  /* Darkest variant */
Primary-950: #022C22  /* Maximum contrast */
```

**Usage:**
- Primary actions (buttons, links)
- Brand elements
- Success states
- Environmental indicators

#### Secondary (Blue)
```css
Secondary-50:  #EFF6FF
Secondary-100: #DBEAFE
Secondary-200: #BFDBFE
Secondary-300: #93C5FD
Secondary-400: #60A5FA
Secondary-500: #3B82F6  /* Base secondary */
Secondary-600: #2563EB
Secondary-700: #1D4ED8
Secondary-800: #1E40AF
Secondary-900: #1E3A8A
Secondary-950: #172554
```

**Usage:**
- Secondary actions
- Information displays
- Links and navigation
- Social indicators

#### Accent (Amber)
```css
Accent-50:  #FFFBEB
Accent-100: #FEF3C7
Accent-200: #FDE68A
Accent-300: #FCD34D
Accent-400: #FBBF24
Accent-500: #F59E0B  /* Base accent */
Accent-600: #D97706
Accent-700: #B45309
Accent-800: #92400E
Accent-900: #78350F
Accent-950: #451A03
```

**Usage:**
- Warnings
- Highlights
- Attention-grabbing elements
- Important notices

### Semantic Colors

#### Success (Green)
- **Base:** `#10B981`
- **Usage:** Success messages, positive indicators, completed states

#### Warning (Amber)
- **Base:** `#F59E0B`
- **Usage:** Warnings, caution messages, pending states

#### Error (Red)
- **Base:** `#EF4444`
- **Usage:** Errors, critical alerts, destructive actions

### Severity Colors

Used for risk and exposure indicators:

- **Critical:** `#DC2626` (Red-600)
- **High:** `#EA580C` (Orange-600)
- **Medium:** `#CA8A04` (Yellow-600)
- **Low:** `#16A34A` (Green-600)

### Neutral Colors

```css
Gray-50:  #F9FAFB  /* Lightest background */
Gray-100: #F3F4F6  /* Light background */
Gray-200: #E5E7EB  /* Borders, dividers */
Gray-300: #D1D5DB  /* Disabled states */
Gray-400: #9CA3AF  /* Placeholder text */
Gray-500: #6B7280  /* Secondary text */
Gray-600: #4B5563  /* Body text */
Gray-700: #374151  /* Headings (light mode) */
Gray-800: #1F2937  /* Headings (dark mode) */
Gray-900: #111827  /* Maximum contrast */
Gray-950: #030712  /* Dark mode background */
```

### Dark Mode

All colors have dark mode variants that maintain contrast ratios and accessibility standards. Dark mode uses:
- Background: `Gray-950` / `Gray-900`
- Surface: `Gray-800` / `Gray-700`
- Text: `Gray-100` / `Gray-200`

---

## Typography

### Font Family

**Primary Font:** Inter (Variable)
- Modern, readable sans-serif
- Excellent for UI and data display
- Supports multiple weights and styles

**Fallback Stack:**
```css
font-family: 'Inter var', 'Inter', ui-sans-serif, system-ui, 
             -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| H1 | 3rem (48px) | 700 | 1.2 | Page titles |
| H2 | 2.25rem (36px) | 700 | 1.3 | Section titles |
| H3 | 1.875rem (30px) | 600 | 1.4 | Subsection titles |
| H4 | 1.5rem (24px) | 600 | 1.5 | Card titles |
| H5 | 1.25rem (20px) | 600 | 1.5 | Small headings |
| H6 | 1.125rem (18px) | 600 | 1.5 | Labels |
| Body Large | 1.125rem (18px) | 400 | 1.6 | Lead text |
| Body | 1rem (16px) | 400 | 1.6 | Body text |
| Body Small | 0.875rem (14px) | 400 | 1.5 | Secondary text |
| Caption | 0.75rem (12px) | 400 | 1.4 | Captions, labels |

### Typography Hierarchy

**Headings:**
- Use semantic HTML (`<h1>` through `<h6>`)
- Maintain hierarchy (don't skip levels)
- One H1 per page
- Use appropriate weight and size

**Body Text:**
- Default: 16px (1rem)
- Line height: 1.6 for readability
- Maximum line length: 75 characters
- Use appropriate contrast (WCAG AA)

**Links:**
- Color: Primary-600
- Underline on hover
- Clear focus states
- Descriptive text (not "click here")

---

## Spacing System

### Base Unit: 4px

All spacing uses multiples of 4px for consistency.

| Token | Value | Usage |
|-------|-------|-------|
| Space-1 | 0.25rem (4px) | Tight spacing, icons |
| Space-2 | 0.5rem (8px) | Compact spacing |
| Space-3 | 0.75rem (12px) | Small gaps |
| Space-4 | 1rem (16px) | Default spacing |
| Space-6 | 1.5rem (24px) | Medium spacing |
| Space-8 | 2rem (32px) | Large spacing |
| Space-12 | 3rem (48px) | Section spacing |
| Space-16 | 4rem (64px) | Large section spacing |
| Space-20 | 5rem (80px) | Hero spacing |
| Space-24 | 6rem (96px) | Maximum spacing |

### Usage Guidelines

- **Padding:** Use for internal spacing within components
- **Margin:** Use for external spacing between components
- **Gap:** Use in flex/grid layouts for consistent spacing
- **Consistent spacing:** Maintain rhythm throughout the interface

---

## Layout

### Container Widths

| Breakpoint | Max Width | Usage |
|------------|-----------|-------|
| Mobile | 100% | Full width on mobile |
| Tablet | 768px | Tablet layouts |
| Desktop | 1280px (7xl) | Standard desktop |
| Large Desktop | 1536px | Large screens |

### Grid System

**12-Column Grid:**
- Flexible grid system
- Responsive breakpoints
- Consistent gutters

**Breakpoints:**
```css
sm:  640px   /* Small devices */
md:  768px   /* Tablets */
lg:  1024px  /* Desktops */
xl:  1280px  /* Large desktops */
2xl: 1536px  /* Extra large */
```

### Layout Patterns

**Page Layout:**
- Header: Fixed or sticky
- Main content: Max-width container with padding
- Footer: Full width

**Card Layout:**
- Consistent padding: 1.5rem (24px)
- Border radius: 0.5rem (8px)
- Shadow: Subtle elevation
- Spacing between cards: 1rem (16px)

---

## Components

### Buttons

#### Variants

**Primary Button:**
- Background: Primary-600
- Text: White
- Usage: Primary actions, CTAs

**Secondary Button:**
- Background: Secondary-600
- Text: White
- Usage: Secondary actions

**Outline Button:**
- Border: Primary-600
- Text: Primary-600
- Background: Transparent
- Usage: Alternative actions

**Ghost Button:**
- Text: Gray-700
- Background: Transparent
- Usage: Tertiary actions, subtle actions

#### Sizes

- **Small:** `text-xs px-3 py-1.5`
- **Medium:** `text-sm px-4 py-2` (default)
- **Large:** `text-base px-6 py-3`

#### States

- **Default:** Base styling
- **Hover:** Slight scale (1.02), shadow increase
- **Active:** Scale down (0.98), shadow decrease
- **Disabled:** Reduced opacity (60%), no interaction
- **Loading:** Spinner icon, disabled state

### Cards

**Structure:**
- Container with border or shadow
- Padding: 1.5rem (24px)
- Border radius: 0.5rem (8px)
- Background: White (light) / Gray-800 (dark)

**Variants:**
- **Default:** Border + subtle shadow
- **Elevated:** Stronger shadow for emphasis
- **Outlined:** Border only, no shadow

### Forms

**Input Fields:**
- Border: Gray-300
- Border radius: 0.375rem (6px)
- Padding: 0.75rem (12px)
- Focus: Primary-600 border, ring

**Labels:**
- Font size: 0.875rem (14px)
- Font weight: 500
- Color: Gray-700
- Required indicator: Asterisk (*)

**Error States:**
- Border: Error-500
- Text: Error-600
- Icon: Alert triangle

**Success States:**
- Border: Success-500
- Text: Success-600
- Icon: Check circle

### Alerts

**Types:**
- **Success:** Green background, check icon
- **Warning:** Amber background, alert icon
- **Error:** Red background, error icon
- **Info:** Blue background, info icon

**Structure:**
- Icon on left
- Message in center
- Close button on right (optional)

### Badges

**Variants:**
- **Default:** Gray background
- **Primary:** Primary color
- **Success:** Green
- **Warning:** Amber
- **Error:** Red

**Sizes:**
- Small: `text-xs px-2 py-0.5`
- Medium: `text-sm px-2.5 py-1` (default)

---

## Icons

### Icon Library

**Lucide React Icons**
- Consistent style
- Accessible (SVG)
- Customizable size and color

### Icon Guidelines

- **Size:** 16px, 20px, 24px (standard)
- **Color:** Inherit from text or use semantic colors
- **Spacing:** 0.5rem (8px) from text
- **Accessibility:** Include `aria-label` when icon-only

### Common Icons

- **Actions:** ArrowRight, Download, Settings, Refresh
- **Status:** CheckCircle, AlertTriangle, Info, X
- **Navigation:** Home, Menu, ChevronRight, ChevronDown
- **Data:** BarChart, LineChart, PieChart, TrendingUp

---

## Shadows & Elevation

### Shadow Levels

| Level | Shadow | Usage |
|-------|--------|-------|
| None | `none` | Flat elements |
| Sm | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| Base | `0 1px 3px rgba(0,0,0,0.1)` | Default cards |
| Md | `0 4px 6px rgba(0,0,0,0.1)` | Elevated cards |
| Lg | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| Xl | `0 20px 25px rgba(0,0,0,0.1)` | Maximum elevation |

---

## Border Radius

| Size | Value | Usage |
|------|-------|-------|
| None | `0` | Square elements |
| Sm | `0.125rem (2px)` | Small elements |
| Base | `0.25rem (4px)` | Buttons, inputs |
| Md | `0.375rem (6px)` | Cards, containers |
| Lg | `0.5rem (8px)` | Large cards |
| Xl | `0.75rem (12px)` | Hero sections |
| 2xl | `1rem (16px)` | Maximum rounding |
| Full | `9999px` | Pills, avatars |

---

## Animations & Transitions

### Principles

- **Purposeful:** Every animation serves a purpose
- **Subtle:** Don't distract from content
- **Fast:** Keep animations under 300ms
- **Smooth:** Use easing functions

### Standard Transitions

**Duration:**
- Fast: 150ms
- Base: 200ms
- Slow: 300ms

**Easing:**
- Default: `ease-in-out`
- Enter: `ease-out`
- Exit: `ease-in`

### Common Animations

**Fade In:**
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Slide Up:**
```css
@keyframes slide-up {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

**Scale:**
- Hover: `scale(1.02)`
- Active: `scale(0.98)`

---

## Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

**Keyboard Navigation:**
- All interactive elements keyboard accessible
- Visible focus indicators
- Logical tab order
- Skip links for main content

**Screen Readers:**
- Semantic HTML
- ARIA labels where needed
- Alt text for images
- Descriptive link text

**Focus Management:**
- Visible focus rings
- Focus trap in modals
- Focus restoration after actions

### Accessibility Checklist

- [ ] All images have alt text
- [ ] All buttons have accessible labels
- [ ] Forms have proper labels
- [ ] Color is not the only indicator
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Focus indicators visible
- [ ] Contrast ratios meet WCAG AA

---

## Responsive Design

### Mobile-First Approach

Design for mobile first, then enhance for larger screens.

### Breakpoint Strategy

1. **Mobile (< 640px):**
   - Single column layout
   - Stacked components
   - Full-width buttons
   - Simplified navigation

2. **Tablet (640px - 1024px):**
   - Two-column layouts
   - Side-by-side components
   - Collapsible navigation

3. **Desktop (> 1024px):**
   - Multi-column layouts
   - Full navigation visible
   - Hover states active
   - Maximum content width

### Touch Targets

- Minimum size: 44x44px
- Adequate spacing between targets
- Large enough for easy tapping

---

## Dark Mode

### Implementation

- Uses `class` strategy (Tailwind)
- Toggle in header
- Persists user preference
- Smooth transitions

### Color Adjustments

- Backgrounds: Darker grays
- Text: Lighter grays
- Borders: Subtle, lower opacity
- Maintains contrast ratios

### Best Practices

- Test all components in dark mode
- Adjust shadows for dark backgrounds
- Use appropriate opacity levels
- Maintain brand colors

---

## Usage Guidelines

### Do's ✅

- Use design system tokens consistently
- Follow spacing system
- Maintain typography hierarchy
- Test accessibility
- Use semantic HTML
- Keep animations subtle
- Ensure responsive design

### Don'ts ❌

- Don't create custom colors outside the system
- Don't skip heading levels
- Don't use color alone for information
- Don't ignore accessibility
- Don't use excessive animations
- Don't break responsive layouts
- Don't mix design patterns

---

## Resources

### Design Tools

- **Figma:** Design system file (if available)
- **Storybook:** Component library (if available)
- **Tailwind CSS:** Utility classes
- **Lucide Icons:** Icon library

### Documentation

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Lucide Icons](https://lucide.dev)

---

## Version History

- **v1.0.0** (December 2025): Initial design system documentation

---

*This design system is a living document and will be updated as the platform evolves.*

