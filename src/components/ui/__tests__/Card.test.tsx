import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card';

describe('Card Components', () => {
  describe('Card Component', () => {
    it('renders children correctly', () => {
      render(<Card>Card Content</Card>);
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('applies the correct shadow classes', () => {
      const { rerender } = render(<Card shadow="sm">Card Content</Card>);
      expect(screen.getByText('Card Content').parentElement).toHaveClass('shadow-sm');
      
      rerender(<Card shadow="md">Card Content</Card>);
      expect(screen.getByText('Card Content').parentElement).toHaveClass('shadow-md');
      
      rerender(<Card shadow="lg">Card Content</Card>);
      expect(screen.getByText('Card Content').parentElement).toHaveClass('shadow-lg');
      
      rerender(<Card shadow="none">Card Content</Card>);
      expect(screen.getByText('Card Content').parentElement).not.toHaveClass('shadow-sm');
      expect(screen.getByText('Card Content').parentElement).not.toHaveClass('shadow-md');
      expect(screen.getByText('Card Content').parentElement).not.toHaveClass('shadow-lg');
    });

    it('applies border class when border prop is true', () => {
      const { rerender } = render(<Card border>Card Content</Card>);
      expect(screen.getByText('Card Content').parentElement).toHaveClass('border');
      
      rerender(<Card border={false}>Card Content</Card>);
      expect(screen.getByText('Card Content').parentElement).not.toHaveClass('border');
    });

    it('applies the correct padding classes', () => {
      const { rerender } = render(<Card padding="sm">Card Content</Card>);
      expect(screen.getByText('Card Content').parentElement).toHaveClass('p-3');
      
      rerender(<Card padding="md">Card Content</Card>);
      expect(screen.getByText('Card Content').parentElement).toHaveClass('p-5');
      
      rerender(<Card padding="lg">Card Content</Card>);
      expect(screen.getByText('Card Content').parentElement).toHaveClass('p-7');
      
      rerender(<Card padding="none">Card Content</Card>);
      expect(screen.getByText('Card Content').parentElement).toHaveClass('p-0');
    });

    it('applies custom className when provided', () => {
      render(<Card className="custom-class">Card Content</Card>);
      expect(screen.getByText('Card Content').parentElement).toHaveClass('custom-class');
    });
  });

  describe('CardHeader Component', () => {
    it('renders children correctly', () => {
      render(<CardHeader>Header Content</CardHeader>);
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      render(<CardHeader className="custom-header">Header Content</CardHeader>);
      expect(screen.getByText('Header Content').parentElement).toHaveClass('custom-header');
    });
  });

  describe('CardTitle Component', () => {
    it('renders children correctly', () => {
      render(<CardTitle>Card Title</CardTitle>);
      expect(screen.getByText('Card Title')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      render(<CardTitle className="custom-title">Card Title</CardTitle>);
      expect(screen.getByText('Card Title')).toHaveClass('custom-title');
    });
  });

  describe('CardDescription Component', () => {
    it('renders children correctly', () => {
      render(<CardDescription>Card Description</CardDescription>);
      expect(screen.getByText('Card Description')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      render(<CardDescription className="custom-desc">Card Description</CardDescription>);
      expect(screen.getByText('Card Description')).toHaveClass('custom-desc');
    });
  });

  describe('CardContent Component', () => {
    it('renders children correctly', () => {
      render(<CardContent>Content</CardContent>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      render(<CardContent className="custom-content">Content</CardContent>);
      expect(screen.getByText('Content').parentElement).toHaveClass('custom-content');
    });
  });

  describe('CardFooter Component', () => {
    it('renders children correctly', () => {
      render(<CardFooter>Footer Content</CardFooter>);
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      render(<CardFooter className="custom-footer">Footer Content</CardFooter>);
      expect(screen.getByText('Footer Content').parentElement).toHaveClass('custom-footer');
    });
  });

  describe('Card Composition', () => {
    it('composes all card components correctly', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Card Content</CardContent>
          <CardFooter>Card Footer</CardFooter>
        </Card>
      );
      
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Description')).toBeInTheDocument();
      expect(screen.getByText('Card Content')).toBeInTheDocument();
      expect(screen.getByText('Card Footer')).toBeInTheDocument();
    });
  });
});