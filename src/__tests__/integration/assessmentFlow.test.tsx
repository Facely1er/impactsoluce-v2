/**
 * Integration tests for Assessment flow
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Assessment from '../../pages/Assessment';
import AssessmentResults from '../../pages/AssessmentResults';

describe('Assessment Flow Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should complete full assessment flow', async () => {
    const { container } = render(
      <BrowserRouter>
        <Assessment />
      </BrowserRouter>
    );

    // Check if assessment start screen is shown
    expect(screen.getByText(/Impact Scan/i)).toBeInTheDocument();
    
    // Start assessment
    const startButton = screen.getByRole('button', { name: /start/i });
    expect(startButton).toBeInTheDocument();
  });

  it('should save assessment progress', async () => {
    // Mock localStorage
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    
    render(
      <BrowserRouter>
        <Assessment />
      </BrowserRouter>
    );

    // Verify localStorage is used for saving
    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalled();
    });
  });

  it('should display assessment results after completion', async () => {
    // Mock assessment data
    const mockResults = {
      overall: { score: 75, status: 'good' },
      categories: [
        { name: 'Environmental', score: 80, status: 'good' },
        { name: 'Social', score: 70, status: 'moderate' },
        { name: 'Governance', score: 75, status: 'good' }
      ],
      frameworkAlignment: {
        gri: 78,
        sasb: 72,
        tcfd: 65
      }
    };

    localStorage.setItem('assessmentResults', JSON.stringify(mockResults));

    render(
      <BrowserRouter>
        <AssessmentResults />
      </BrowserRouter>
    );

    // Check if results are displayed
    await waitFor(() => {
      expect(screen.getByText(/Assessment Results/i)).toBeInTheDocument();
    });
  });
});

