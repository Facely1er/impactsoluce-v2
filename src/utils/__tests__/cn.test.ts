import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('cn utility function', () => {
  it('combines class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
  });

  it('handles undefined and null values', () => {
    expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
  });

  it('handles empty strings', () => {
    expect(cn('class1', '', 'class2')).toBe('class1 class2');
  });

  it('handles objects with boolean values', () => {
    expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');
  });

  it('handles arrays of class names', () => {
    expect(cn('class1', ['class2', 'class3'])).toBe('class1 class2 class3');
  });

  it('handles complex combinations', () => {
    const isActive = true;
    const isDisabled = false;
    const className = 'custom-class';
    
    expect(cn(
      'base-class',
      isActive && 'active',
      isDisabled && 'disabled',
      className,
      { 'hover:bg-blue-500': isActive, 'cursor-not-allowed': isDisabled }
    )).toBe('base-class active custom-class hover:bg-blue-500');
  });

  it('handles Tailwind CSS utility classes', () => {
    expect(cn(
      'px-4 py-2',
      'bg-blue-500',
      'hover:bg-blue-600',
      'text-white'
    )).toBe('px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white');
  });

  it('handles conflicting classes with tailwind-merge', () => {
    // tailwind-merge should resolve conflicts by using the last class
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('bg-red-500 text-white', 'bg-blue-500')).toBe('text-white bg-blue-500');
  });
});