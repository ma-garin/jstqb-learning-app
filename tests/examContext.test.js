import { describe, it, expect, beforeEach } from 'vitest';
import { getExam, setExam } from '../js/examContext.js';

beforeEach(() => {
    localStorage.clear();
});

describe('単一QA基礎コース', () => {
    it('保存値がなければ "qa-basic" を返す', () => {
        expect(getExam()).toBe('qa-basic');
    });

    it('setExam後も "qa-basic" を返す', () => {
        setExam('別のコース');
        expect(getExam()).toBe('qa-basic');
        expect(localStorage.getItem('qa_basic_course')).toBe('qa-basic');
    });
});
