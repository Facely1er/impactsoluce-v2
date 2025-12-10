import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingScreen from '../LoadingScreen';

describe('LoadingScreen Component', () => {
  it('renders correctly', () => {
    render(<LoadingScreen />);
    
    // Check for the app name
    expect(screen.getByText('ImpactSoluce')).toBeInTheDocument();
    
    // Check for the loading text
    expect(screen.getByText('Loading application...')).toBeInTheDocument();
    
    // Check for the loading spinner (the element with the animate-spin class)
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});