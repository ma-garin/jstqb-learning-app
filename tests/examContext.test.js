import { describe, it, expect, beforeEach } from 'vitest';
import { getExam, setExam } from '../js/examContext.js';

beforeEach(() => {
    localStorage.clear();
});

describe('getExam', () => {
    it('localStorageに値がなければ "alta" を返す', () => {
        expect(getExam()).toBe('alta');
    });

    it('setExam("altm") 後は "altm" を返す', () => {
        setExam('altm');
        expect(getExam()).toBe('altm');
    });

    it('setExam("alta") 後は "alta" を返す', () => {
        setExam('altm');
        setExam('alta');
        expect(getExam()).toBe('alta');
    });

    it('不正な値を setExam に渡しても "alta" にフォールバックする', () => {
        setExam('unknown');
        expect(getExam()).toBe('alta');
    });
});
