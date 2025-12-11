/**
 * API retry mechanisms and circuit breaker pattern
 */

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
  retryableStatusCodes?: number[];
  timeout?: number;
}

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeout?: number;
  halfOpenMaxCalls?: number;
}

// Default retry options
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  timeout: 30000
};

// Circuit breaker states
enum CircuitState {
  CLOSED = 'closed',    // Normal operation
  OPEN = 'open',        // Failing, reject requests
  HALF_OPEN = 'half-open' // Testing if service recovered
}

// Circuit breaker implementation
class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private successCount = 0;
  
  constructor(
    private options: Required<CircuitBreakerOptions> = {
      failureThreshold: 5,
      resetTimeout: 60000, // 1 minute
      halfOpenMaxCalls: 3
    }
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit should be reset
    if (this.state === CircuitState.OPEN) {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure >= this.options.resetTimeout) {
        this.state = CircuitState.HALF_OPEN;
        this.successCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN - service unavailable');
      }
    }

    // Check half-open state limit
    if (this.state === CircuitState.HALF_OPEN && this.successCount >= this.options.halfOpenMaxCalls) {
      this.state = CircuitState.CLOSED;
      this.failureCount = 0;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.options.failureThreshold) {
      this.state = CircuitState.OPEN;
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
  }
}

// Retry with exponential backoff
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | null = null;
  let delay = opts.retryDelay;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), opts.timeout);
      });

      // Race between function and timeout
      return await Promise.race([fn(), timeoutPromise]);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if error is retryable
      const isRetryable = 
        attempt < opts.maxRetries &&
        (
          !(error instanceof Error) ||
          (error as any).status === undefined ||
          opts.retryableStatusCodes.includes((error as any).status)
        );

      if (!isRetryable) {
        throw lastError;
      }

      // Wait before retry (exponential backoff)
      if (attempt < opts.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= opts.backoffMultiplier;
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
};

// Fetch with retry
export const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> => {
  return retryWithBackoff(async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), retryOptions.timeout || 30000);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      // Check if response is retryable
      if (!response.ok && retryOptions.retryableStatusCodes?.includes(response.status)) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } finally {
      clearTimeout(timeout);
    }
  }, retryOptions);
};

// Circuit breaker instances (one per service)
const circuitBreakers = new Map<string, CircuitBreaker>();

// Get or create circuit breaker for a service
const getCircuitBreaker = (serviceName: string, options?: CircuitBreakerOptions): CircuitBreaker => {
  if (!circuitBreakers.has(serviceName)) {
    circuitBreakers.set(
      serviceName,
      new CircuitBreaker({
        failureThreshold: options?.failureThreshold || 5,
        resetTimeout: options?.resetTimeout || 60000,
        halfOpenMaxCalls: options?.halfOpenMaxCalls || 3
      })
    );
  }
  return circuitBreakers.get(serviceName)!;
};

// Execute with circuit breaker and retry
export const executeWithResilience = async <T>(
  serviceName: string,
  fn: () => Promise<T>,
  options: {
    retry?: RetryOptions;
    circuitBreaker?: CircuitBreakerOptions;
  } = {}
): Promise<T> => {
  const breaker = getCircuitBreaker(serviceName, options.circuitBreaker);
  
  return breaker.execute(() => 
    retryWithBackoff(fn, options.retry)
  );
};

// Reset circuit breaker for a service
export const resetCircuitBreaker = (serviceName: string): void => {
  const breaker = circuitBreakers.get(serviceName);
  if (breaker) {
    breaker.reset();
  }
};

// Get circuit breaker status
export const getCircuitBreakerStatus = (serviceName: string): CircuitState | null => {
  const breaker = circuitBreakers.get(serviceName);
  return breaker ? breaker.getState() : null;
};

