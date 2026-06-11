import { vi } from 'vitest';

const store = {};

const localStorageMock = {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    key: (index) => Object.keys(store)[index] ?? null,
    get length() { return Object.keys(store).length; },
};

vi.stubGlobal('localStorage', localStorageMock);
