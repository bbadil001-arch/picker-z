/**
 * Safe in-memory fallback storage when localStorage throws SecurityError
 * (e.g. in sandboxed iframes or private browsing with storage disabled).
 */
const memoryStorage: Record<string, string> = {};
let storageTested = false;
let isStorageAvailable = false;

function checkStorageAvailability(): boolean {
  if (storageTested) return isStorageAvailable;
  storageTested = true;
  try {
    if (typeof window === 'undefined') {
      isStorageAvailable = false;
      return false;
    }
    const testKey = '__rw_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    isStorageAvailable = true;
    return true;
  } catch (e) {
    isStorageAvailable = false;
    return false;
  }
}

export const safeStorage = {
  getItem: (key: string): string | null => {
    if (checkStorageAvailability()) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        isStorageAvailable = false;
      }
    }
    return memoryStorage[key] ?? null;
  },

  setItem: (key: string, value: string): void => {
    if (checkStorageAvailability()) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch (e) {
        isStorageAvailable = false;
      }
    }
    memoryStorage[key] = value;
  },

  removeItem: (key: string): void => {
    if (checkStorageAvailability()) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch (e) {
        isStorageAvailable = false;
      }
    }
    delete memoryStorage[key];
  },
};

/**
 * Returns a safe origin string even in sandboxed or cross-origin iframes
 */
export function getSafeOrigin(): string {
  try {
    if (
      typeof window !== 'undefined' &&
      window.location &&
      window.location.origin &&
      window.location.origin !== 'null'
    ) {
      return window.location.origin;
    }
  } catch (e) {}
  return 'https://randomizerwheel.com';
}

