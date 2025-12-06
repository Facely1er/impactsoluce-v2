import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorAlert from '../ErrorAlert';

describe('ErrorAlert Component', () => {
  it('renders with the provided message', () => {
    render(<ErrorAlert message="Test error message" />);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders with details when provided', () => {
    render(
      <ErrorAlert 
        message="Test error message" 
        details="These are the error details"
      />
    );
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('These are the error details')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <ErrorAlert 
        message="Test error message" 
        onClose={handleClose}
      />
    );
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not render close button when onClose is not provided', () => {
    render(<ErrorAlert message="Test error message" />);
    
    const closeButton = screen.queryByRole('button');
    expect(closeButton).not.toBeInTheDocument();
  });

  it('applies the correct styles for different variants', () => {
    const { rerender } = render(
      <ErrorAlert message="Error message" variant="error" />
    );
    
    // Error variant
    let alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-red-50');
    expect(alert).toHaveClass('border-red-400');
    
    // Warning variant
    rerender(<ErrorAlert message="Warning message" variant="warning" />);
    alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-yellow-50');
    expect(alert).toHaveClass('border-yellow-400');
    
    // Info variant
    rerender(<ErrorAlert message="Info message" variant="info" />);
    alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-blue-50');
    expect(alert).toHaveClass('border-blue-400');
  });

  it('applies custom className when provided', () => {
    render(
      <ErrorAlert 
        message="Test message" 
        className="custom-class"
      />
    );
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-class');
  });
});