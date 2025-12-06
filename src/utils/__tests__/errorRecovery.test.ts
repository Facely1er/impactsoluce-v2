import { describe, it, expect, vi } from 'vitest';
import { 
  classifyError, 
  generateRecoveryActions, 
  executeRecovery,
  SmartErrorRecovery,
  RecoveryStrategy
} from '../errorRecovery';

describe('Error Recovery', () => {
  describe('classifyError', () => {
    it('classifies network errors correctly', () => {
      const networkError = new Error('Network request failed');
      const classification = classifyError(networkError);
      
      expect(classification.type).toBe('network');
      expect(classification.recoverable).toBe(true);
      expect(classification.severity).toBe('medium');
    });

    it('classifies auth errors correctly', () => {
      const authError = new Error('Unauthorized access');
      const classification = classifyError(authError);
      
      expect(classification.type).toBe('auth');
      expect(classification.recoverable).toBe(true);
      expect(classification.severity).toBe('high');
    });

    it('classifies data errors correctly', () => {
      const dataError = new Error('Validation failed: required field missing');
      const classification = classifyError(dataError);
      
      expect(classification.type).toBe('data');
      expect(classification.recoverable).toBe(false);
      expect(classification.severity).toBe('low');
    });

    it('handles unknown errors', () => {
      const unknownError = new Error('Something unexpected happened');
      const classification = classifyError(unknownError);
      
      expect(classification.type).toBe('unknown');
      expect(classification.recoverable).toBe(false);
      expect(classification.severity).toBe('critical');
    });
  });

  describe('generateRecoveryActions', () => {
    it('generates retry action for network errors', () => {
      const networkError = new Error('Fetch failed');
      const actions = generateRecoveryActions(networkError);
      
      expect(actions.length).toBeGreaterThan(0);
      expect(actions[0].strategy).toBe(RecoveryStrategy.RETRY);
    });

    it('generates refresh action for auth errors', () => {
      const authError = new Error('Token expired');
      const actions = generateRecoveryActions(authError);
      
      expect(actions.length).toBeGreaterThan(0);
      expect(actions.some(a => a.strategy === RecoveryStrategy.REFRESH)).toBe(true);
    });

    it('sorts actions by priority', () => {
      const error = new Error('Network error');
      const actions = generateRecoveryActions(error);
      
      for (let i = 1; i < actions.length; i++) {
        expect(actions[i].priority).toBeGreaterThanOrEqual(actions[i - 1].priority);
      }
    });
  });

  describe('SmartErrorRecovery', () => {
    let recovery: SmartErrorRecovery;

    beforeEach(() => {
      recovery = new SmartErrorRecovery();
    });

    it('allows recovery for recoverable errors', () => {
      const recoverableError = new Error('Network timeout');
      expect(recovery.shouldAttemptRecovery(recoverableError)).toBe(true);
    });

    it('prevents recovery after max attempts', async () => {
      const error = new Error('Network error');
      
      // Attempt recovery multiple times
      await recovery.attemptRecovery(error);
      await recovery.attemptRecovery(error);
      await recovery.attemptRecovery(error);
      
      // Fourth attempt should be rejected
      expect(recovery.shouldAttemptRecovery(error)).toBe(false);
    });

    it('resets counters after successful recovery', async () => {
      const error = new Error('Network error');
      const context = {
        retryFunction: vi.fn().mockResolvedValue({ success: true })
      };
      
      const recovered = await recovery.attemptRecovery(error, context);
      
      expect(recovered).toBe(true);
      expect(recovery.shouldAttemptRecovery(new Error('New error'))).toBe(true);
    });
  });
});