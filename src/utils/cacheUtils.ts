/**
 * Cache utility functions
 */

// Cache keys
export const CACHE_KEYS = {
  USER: 'user',
  ASSESSMENT: 'assessment',
  ASSESSMENT_HISTORY: 'assessment-history',
  TECH_DEPENDENCIES: 'tech-dependencies',
  CARBON_DATA: 'carbon-data',
  ESG_SCORE: 'esg-score',
  SETTINGS: 'settings',
};

// Cache durations in milliseconds
export const CACHE_DURATIONS = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
};

// Local storage cache
export const localStorageCache = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const { value, expiry } = JSON.parse(item);
      
      // Check if the item has expired
      if (expiry && expiry < Date.now()) {
        localStorage.removeItem(key);
        return null;
      }
      
      return value as T;
    } catch (error) {
      console.error(`Error getting item from cache: ${key}`, error);
      return null;
    }
  },
  
  set: <T>(key: string, value: T, ttl?: number): void => {
    try {
      const item = {
        value,
        expiry: ttl ? Date.now() + ttl : null,
      };
      
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error(`Error setting item in cache: ${key}`, error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from cache: ${key}`, error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing cache', error);
    }
  },
};

// Session storage cache
export const sessionStorageCache = {
  get: <T>(key: string): T | null => {
    try {
      const item = sessionStorage.getItem(key);
      if (!item) return null;
      
      const { value, expiry } = JSON.parse(item);
      
      // Check if the item has expired
      if (expiry && expiry < Date.now()) {
        sessionStorage.removeItem(key);
        return null;
      }
      
      return value as T;
    } catch (error) {
      console.error(`Error getting item from session cache: ${key}`, error);
      return null;
    }
  },
  
  set: <T>(key: string, value: T, ttl?: number): void => {
    try {
      const item = {
        value,
        expiry: ttl ? Date.now() + ttl : null,
      };
      
      sessionStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error(`Error setting item in session cache: ${key}`, error);
    }
  },
  
  remove: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from session cache: ${key}`, error);
    }
  },
  
  clear: (): void => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing session cache', error);
    }
  },
};

// In-memory cache for runtime data
const memoryCache = new Map<string, { value: any; expiry: number | null }>();

export const memoryStorageCache = {
  get: <T>(key: string): T | null => {
    try {
      const item = memoryCache.get(key);
      if (!item) return null;
      
      // Check if the item has expired
      if (item.expiry && item.expiry < Date.now()) {
        memoryCache.delete(key);
        return null;
      }
      
      return item.value as T;
    } catch (error) {
      console.error(`Error getting item from memory cache: ${key}`, error);
      return null;
    }
  },
  
  set: <T>(key: string, value: T, ttl?: number): void => {
    try {
      const item = {
        value,
        expiry: ttl ? Date.now() + ttl : null,
      };
      
      memoryCache.set(key, item);
    } catch (error) {
      console.error(`Error setting item in memory cache: ${key}`, error);
    }
  },
  
  remove: (key: string): void => {
    try {
      memoryCache.delete(key);
    } catch (error) {
      console.error(`Error removing item from memory cache: ${key}`, error);
    }
  },
  
  clear: (): void => {
    try {
      memoryCache.clear();
    } catch (error) {
      console.error('Error clearing memory cache', error);
    }
  },
};

// Clear all expired items from caches
export const clearExpiredCache = (): void => {
  try {
    // Clear expired items from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const { expiry } = JSON.parse(item);
            if (expiry && expiry < Date.now()) {
              localStorage.removeItem(key);
            }
          } catch (e) {
            // Not a valid cache item, skip
          }
        }
      }
    }
    
    // Clear expired items from sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const item = sessionStorage.getItem(key);
        if (item) {
          try {
            const { expiry } = JSON.parse(item);
            if (expiry && expiry < Date.now()) {
              sessionStorage.removeItem(key);
            }
          } catch (e) {
            // Not a valid cache item, skip
          }
        }
      }
    }
    
    // Clear expired items from memoryCache
    for (const [key, item] of memoryCache.entries()) {
      if (item.expiry && item.expiry < Date.now()) {
        memoryCache.delete(key);
      }
    }
  } catch (error) {
    console.error('Error clearing expired cache', error);
  }
};

// Set up periodic cache cleanup
export const initCacheCleanup = (intervalMs = 15 * 60 * 1000): () => void => {
  const intervalId = setInterval(clearExpiredCache, intervalMs);
  return () => clearInterval(intervalId);
};