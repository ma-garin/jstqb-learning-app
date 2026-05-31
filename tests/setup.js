import { vi } from 'vitest';

const store = {};

const localStorageMock = {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
};

vi.stubGlobal('localStorage', localStorageMock);
