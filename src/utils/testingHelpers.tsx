/**
 * Testing utilities and helpers for production testing
 */

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../providers/ToastProvider';
import { HelmetProvider } from '../providers/HelmetProvider';
import { AssessmentProvider } from '../components/assessment/AssessmentState';

// Custom render function with all providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <BrowserRouter>
            <AssessmentProvider>
              {children}
            </AssessmentProvider>
          </BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const createMockAssessment = (overrides = {}) => ({
  id: 'test-assessment-id',
  user_id: 'test-user-id',
  status: 'draft',
  total_score: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  metadata: {},
  ...overrides
});

export const createMockAssessmentResponse = (overrides = {}) => ({
  id: 'test-response-id',
  assessment_id: 'test-assessment-id',
  question_id: 'test-question',
  value: 'test-answer',
  attachments: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    first_name: 'Test',
    last_name: 'User',
    company: 'Test Company'
  },
  created_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  ...overrides
});

// Performance testing helpers
export const measureRenderTime = async (renderFunction: () => void): Promise<number> => {
  const start = performance.now();
  renderFunction();
  
  // Wait for next frame
  await new Promise(resolve => requestAnimationFrame(resolve));
  
  return performance.now() - start;
};

// Accessibility testing helpers
export const checkAccessibility = (container: HTMLElement): {
  violations: string[];
  warnings: string[];
  score: number;
} => {
  const violations: string[] = [];
  const warnings: string[] = [];

  // Check for missing alt text
  const images = container.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.alt && !img.getAttribute('aria-hidden')) {
      violations.push(`Image ${index + 1} missing alt text`);
    }
  });

  // Check for proper heading hierarchy
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    
    if (index === 0 && level !== 1) {
      warnings.push('Should start with h1');
    }
    
    if (level > lastLevel + 1) {
      violations.push(`Heading ${heading.textContent} skips levels`);
    }
    
    lastLevel = level;
  });

  // Check for keyboard accessibility
  const interactiveElements = container.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach((element) => {
    if (element.getAttribute('tabindex') === '-1' && !element.getAttribute('aria-hidden')) {
      warnings.push(`Interactive element may not be keyboard accessible`);
    }
  });

  const totalChecks = images.length + headings.length + interactiveElements.length;
  const passedChecks = totalChecks - violations.length - warnings.length;
  const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;

  return { violations, warnings, score };
};

// Visual regression testing helpers
export const captureScreenshot = async (element: HTMLElement): Promise<string> => {
  try {
    // Use html2canvas for client-side screenshots (would need to install)
    // This is a placeholder for the actual implementation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Basic implementation - in production you'd use html2canvas or similar
    canvas.width = element.offsetWidth;
    canvas.height = element.offsetHeight;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL();
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    return '';
  }
};

// Load testing helpers
export const simulateUserInteraction = async (
  actions: Array<() => Promise<void>>,
  concurrent = false
): Promise<{ duration: number; errors: string[] }> => {
  const start = performance.now();
  const errors: string[] = [];

  try {
    if (concurrent) {
      // Run actions concurrently
      const results = await Promise.allSettled(actions.map(action => action()));
      
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          errors.push(`Action ${index + 1}: ${result.reason}`);
        }
      });
    } else {
      // Run actions sequentially
      for (let i = 0; i < actions.length; i++) {
        try {
          await actions[i]();
        } catch (error) {
          errors.push(`Action ${i + 1}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
  } catch (error) {
    errors.push(`Test execution failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  return {
    duration: performance.now() - start,
    errors
  };
};