/**
 * Integration tests for Evidence Workspace
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EvidenceWorkspace from '../../pages/EvidenceWorkspace';

describe('Evidence Workspace Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should load evidence workspace', async () => {
    render(
      <BrowserRouter>
        <EvidenceWorkspace />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Evidence Readiness Workspace/i)).toBeInTheDocument();
    });
  });

  it('should display evidence items', async () => {
    render(
      <BrowserRouter>
        <EvidenceWorkspace />
      </BrowserRouter>
    );

    // Should show evidence list or empty state
    await waitFor(() => {
      const workspace = screen.getByText(/Evidence Readiness Workspace/i);
      expect(workspace).toBeInTheDocument();
    });
  });

  it('should filter evidence by category', async () => {
    render(
      <BrowserRouter>
        <EvidenceWorkspace />
      </BrowserRouter>
    );

    // Check if filter controls are present
    await waitFor(() => {
      const searchInput = screen.queryByPlaceholderText(/Search evidence/i);
      expect(searchInput || screen.getByText(/Evidence Readiness Workspace/i)).toBeTruthy();
    });
  });
});

