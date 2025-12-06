import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { checkColorContrast, auditAccessibility, trapFocus } from '../accessibility';

describe('Accessibility Utilities', () => {
  describe('checkColorContrast', () => {
    it('calculates contrast ratios correctly', () => {
      // Black on white should have high contrast
      const blackOnWhite = checkColorContrast('#000000', '#ffffff');
      expect(blackOnWhite.ratio).toBeGreaterThan(20);
      expect(blackOnWhite.level).toBe('AAA');
      expect(blackOnWhite.passes).toBe(true);
    });

    it('identifies poor contrast', () => {
      // Light gray on white should have poor contrast
      const lightGrayOnWhite = checkColorContrast('#cccccc', '#ffffff');
      expect(lightGrayOnWhite.ratio).toBeLessThan(4.5);
      expect(lightGrayOnWhite.level).toBe('Fail');
      expect(lightGrayOnWhite.passes).toBe(false);
    });

    it('handles AA level contrast', () => {
      // Should meet AA but not AAA
      const result = checkColorContrast('#666666', '#ffffff');
      expect(result.ratio).toBeGreaterThan(4.5);
      expect(result.ratio).toBeLessThan(7);
      expect(result.level).toBe('AA');
    });
  });

  describe('auditAccessibility', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it('detects missing alt text on images', () => {
      container.innerHTML = '<img src="test.jpg" />';
      
      const audit = auditAccessibility();
      
      expect(audit.issues.some(issue => issue.includes('alt text'))).toBe(true);
    });

    it('detects buttons without accessible names', () => {
      container.innerHTML = '<button></button>';
      
      const audit = auditAccessibility();
      
      expect(audit.issues.some(issue => issue.includes('accessible name'))).toBe(true);
    });

    it('detects form inputs without labels', () => {
      container.innerHTML = '<input type="text" />';
      
      const audit = auditAccessibility();
      
      expect(audit.issues.some(issue => issue.includes('label'))).toBe(true);
    });

    it('calculates accessibility score', () => {
      // Add accessible content
      container.innerHTML = `
        <img src="test.jpg" alt="Test image" />
        <button>Click me</button>
        <label for="input1">Name</label>
        <input id="input1" type="text" />
      `;
      
      const audit = auditAccessibility();
      
      expect(audit.score).toBeGreaterThan(0);
      expect(audit.issues.length).toBe(0);
    });
  });

  describe('trapFocus', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
      container = document.createElement('div');
      container.innerHTML = `
        <button id="first">First</button>
        <button id="middle">Middle</button>
        <button id="last">Last</button>
      `;
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it('traps focus within container', () => {
      const cleanup = trapFocus(container);
      
      // First element should be focused
      expect(document.activeElement?.id).toBe('first');
      
      cleanup();
    });

    it('cycles focus correctly with Tab key', () => {
      const cleanup = trapFocus(container);
      
      const lastButton = document.getElementById('last');
      lastButton?.focus();
      
      // Simulate Tab key
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      container.dispatchEvent(tabEvent);
      
      cleanup();
    });
  });
});