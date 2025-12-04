const STORAGE_KEY = 'mermaid-ai-architect-code';

export function saveToStorage(code: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch (e) {
    console.warn('Failed to save to local storage', e);
  }
}

export function loadFromStorage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to load from local storage', e);
    return null;
  }
}