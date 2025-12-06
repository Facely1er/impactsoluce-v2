import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingSkeleton, LoadingSpinner, LoadingCard, ErrorState, EmptyState } from '../LoadingStates';

describe('Loading States Components', () => {
  describe('LoadingSkeleton', () => {
    it('renders correct number of skeleton lines', () => {
      render(<LoadingSkeleton lines={5} />);
      
      const skeletonLines = document.querySelectorAll('.bg-gray-200');
      expect(skeletonLines.length).toBe(5);
    });

    it('applies animation when animate prop is true', () => {
      render(<LoadingSkeleton animate={true} />);
      
      const skeletonLines = document.querySelectorAll('.animate-pulse');
      expect(skeletonLines.length).toBeGreaterThan(0);
    });
  });

  describe('LoadingSpinner', () => {
    it('renders with different sizes', () => {
      const { rerender } = render(<LoadingSpinner size="sm" />);
      expect(document.querySelector('.h-4')).toBeInTheDocument();
      
      rerender(<LoadingSpinner size="md" />);
      expect(document.querySelector('.h-6')).toBeInTheDocument();
      
      rerender(<LoadingSpinner size="lg" />);
      expect(document.querySelector('.h-8')).toBeInTheDocument();
    });

    it('shows label when provided', () => {
      render(<LoadingSpinner label="Loading data..." />);
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });
  });

  describe('LoadingCard', () => {
    it('renders title and description when provided', () => {
      render(
        <LoadingCard 
          title="Loading Assessment" 
          description="Please wait while we load your data"
        />
      );
      
      expect(screen.getByText('Loading Assessment')).toBeInTheDocument();
      expect(screen.getByText('Please wait while we load your data')).toBeInTheDocument();
    });
  });

  describe('ErrorState', () => {
    it('renders error message', () => {
      render(<ErrorState message="Something went wrong" />);
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('shows retry button when onRetry is provided', () => {
      const mockRetry = vi.fn();
      render(<ErrorState message="Error" onRetry={mockRetry} />);
      
      const retryButton = screen.getByRole('button');
      expect(retryButton).toBeInTheDocument();
    });
  });

  describe('EmptyState', () => {
    it('renders title and description', () => {
      render(
        <EmptyState 
          title="No data found" 
          description="Start by creating your first assessment"
        />
      );
      
      expect(screen.getByText('No data found')).toBeInTheDocument();
      expect(screen.getByText('Start by creating your first assessment')).toBeInTheDocument();
    });

    it('renders action button when provided', () => {
      const mockAction = vi.fn();
      render(
        <EmptyState 
          title="No data" 
          description="Description"
          action={{
            label: 'Create New',
            onClick: mockAction
          }}
        />
      );
      
      expect(screen.getByRole('button', { name: 'Create New' })).toBeInTheDocument();
    });
  });
});