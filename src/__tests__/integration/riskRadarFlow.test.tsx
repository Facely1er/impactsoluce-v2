/**
 * Integration tests for Risk Radar flow
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RiskRadar from '../../pages/RiskRadar';
import RiskRadarConfiguration from '../../pages/RiskRadarConfiguration';

describe('Risk Radar Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should show configuration wizard when not configured', async () => {
    render(
      <BrowserRouter>
        <RiskRadar />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Configure Risk Radar/i)).toBeInTheDocument();
    });
  });

  it('should complete configuration flow', async () => {
    const { container } = render(
      <BrowserRouter>
        <RiskRadarConfiguration />
      </BrowserRouter>
    );

    // Check if configuration steps are present
    expect(screen.getByText(/Sector/i)).toBeInTheDocument();
  });

  it('should display risk radar data after configuration', async () => {
    // Mock configuration
    const mockConfig = {
      sector: 'Agriculture',
      geographies: ['EU', 'US'],
      supplyChainTiers: 2
    };
    localStorage.setItem('riskRadarConfig', JSON.stringify(mockConfig));

    render(
      <BrowserRouter>
        <RiskRadar />
      </BrowserRouter>
    );

    // Should show radar data
    await waitFor(() => {
      expect(screen.getByText(/Impact Risk Radar/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

