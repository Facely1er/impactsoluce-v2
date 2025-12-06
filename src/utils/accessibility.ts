/**
 * Accessibility utilities and WCAG compliance helpers
 */

// ARIA live region manager
class AriaLiveRegionManager {
  private politeRegion: HTMLDivElement | null = null;
  private assertiveRegion: HTMLDivElement | null = null;

  constructor() {
    this.createRegions();
  }

  private createRegions(): void {
    // Create polite live region
    this.politeRegion = document.createElement('div');
    this.politeRegion.setAttribute('aria-live', 'polite');
    this.politeRegion.setAttribute('aria-atomic', 'true');
    this.politeRegion.className = 'sr-only';
    document.body.appendChild(this.politeRegion);

    // Create assertive live region
    this.assertiveRegion = document.createElement('div');
    this.assertiveRegion.setAttribute('aria-live', 'assertive');
    this.assertiveRegion.setAttribute('aria-atomic', 'true');
    this.assertiveRegion.className = 'sr-only';
    document.body.appendChild(this.assertiveRegion);
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const region = priority === 'assertive' ? this.assertiveRegion : this.politeRegion;
    
    if (region) {
      // Clear previous message
      region.textContent = '';
      
      // Add new message after a brief delay
      setTimeout(() => {
        region.textContent = message;
      }, 100);
    }
  }

  cleanup(): void {
    if (this.politeRegion) {
      document.body.removeChild(this.politeRegion);
      this.politeRegion = null;
    }
    
    if (this.assertiveRegion) {
      document.body.removeChild(this.assertiveRegion);
      this.assertiveRegion = null;
    }
  }
}

export const liveRegionManager = new AriaLiveRegionManager();

// Keyboard navigation helpers
export const trapFocus = (element: HTMLElement): (() => void) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  element.addEventListener('keydown', handleTabKey);
  
  // Focus first element
  if (firstElement) {
    firstElement.focus();
  }

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

// Color contrast checker
export const checkColorContrast = (
  foreground: string,
  background: string
): {
  ratio: number;
  level: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  passes: boolean;
} => {
  // Convert colors to RGB
  const getRGB = (color: string): [number, number, number] => {
    const hex = color.replace('#', '');
    return [
      parseInt(hex.substr(0, 2), 16),
      parseInt(hex.substr(2, 2), 16),
      parseInt(hex.substr(4, 2), 16)
    ];
  };

  // Calculate relative luminance
  const getLuminance = (rgb: [number, number, number]): number => {
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const fg = getRGB(foreground);
  const bg = getRGB(background);
  
  const fgLuminance = getLuminance(fg);
  const bgLuminance = getLuminance(bg);
  
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  
  const ratio = (lighter + 0.05) / (darker + 0.05);

  let level: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  if (ratio >= 7) {
    level = 'AAA';
  } else if (ratio >= 4.5) {
    level = 'AA';
  } else if (ratio >= 3) {
    level = 'AA Large';
  } else {
    level = 'Fail';
  }

  return {
    ratio: Math.round(ratio * 100) / 100,
    level,
    passes: ratio >= 4.5
  };
};

// Accessibility audit
export const auditAccessibility = (): {
  issues: string[];
  warnings: string[];
  score: number;
} => {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check for images without alt text
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.alt && !img.getAttribute('aria-hidden')) {
      issues.push(`Image ${index + 1} missing alt text`);
    }
  });

  // Check for buttons without accessible names
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    const hasAccessibleName = button.textContent?.trim() || 
                            button.getAttribute('aria-label') ||
                            button.getAttribute('aria-labelledby');
    
    if (!hasAccessibleName) {
      issues.push(`Button ${index + 1} missing accessible name`);
    }
  });

  // Check for form inputs without labels
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach((input, index) => {
    const hasLabel = input.getAttribute('aria-label') ||
                    input.getAttribute('aria-labelledby') ||
                    document.querySelector(`label[for="${input.id}"]`);
    
    if (!hasLabel) {
      issues.push(`Form control ${index + 1} missing label`);
    }
  });

  // Check for heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    
    if (index === 0 && level !== 1) {
      warnings.push('Page should start with h1 heading');
    }
    
    if (level > lastLevel + 1) {
      warnings.push(`Heading level ${level} skips levels after h${lastLevel}`);
    }
    
    lastLevel = level;
  });

  // Calculate score (basic scoring)
  const totalChecks = images.length + buttons.length + inputs.length + headings.length;
  const passedChecks = totalChecks - issues.length - warnings.length;
  const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;

  return { issues, warnings, score };
};

// Initialize accessibility features
export const initAccessibility = (): void => {
  // Add skip links
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md';
  skipLink.textContent = 'Skip to main content';
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Add high contrast mode styles
  const style = document.createElement('style');
  style.textContent = `
    .high-contrast {
      filter: contrast(1.5);
    }
    
    .reduce-motion * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    
    .font-large {
      font-size: 110% !important;
    }
    
    .font-larger {
      font-size: 120% !important;
    }
    
    .focus-visible *:focus {
      outline: 3px solid #0F766E !important;
      outline-offset: 2px !important;
    }
  `;
  document.head.appendChild(style);
};