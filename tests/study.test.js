import { describe, it, expect } from 'vitest';
import { shuffleQuestions } from '../js/study.js';

const SAMPLE_QUESTIONS = [
    { id: 'fl-001', question: '問題1' },
    { id: 'fl-002', question: '問題2' },
    { id: 'fl-003', question: '問題3' },
    { id: 'fl-004', question: '問題4' },
    { id: 'fl-005', question: '問題5' },
];

describe('shuffleQuestions', () => {
    it('同じ要素を含む配列を返す', () => {
        const result = shuffleQuestions(SAMPLE_QUESTIONS);
        expect(result).toHaveLength(SAMPLE_QUESTIONS.length);
        SAMPLE_QUESTIONS.forEach(q => {
            expect(result.some(r => r.id === q.id)).toBe(true);
        });
    });

    it('元の配列を変更しない', () => {
        const original = SAMPLE_QUESTIONS.map(q => ({ ...q }));
        shuffleQuestions(SAMPLE_QUESTIONS);
        expect(SAMPLE_QUESTIONS).toEqual(original);
    });

    it('空配列を渡すと空配列を返す', () => {
        expect(shuffleQuestions([])).toEqual([]);
    });

    it('1要素配列はそのまま返す', () => {
        const single = [{ id: 'fl-001' }];
        expect(shuffleQuestions(single)).toEqual(single);
    });

    it('十分な回数シャッフルすると元の順と異なる配列が得られる', () => {
        const originalOrder = SAMPLE_QUESTIONS.map(q => q.id).join(',');
        const allSame = Array.from({ length: 100 }, () =>
            shuffleQuestions(SAMPLE_QUESTIONS).map(q => q.id).join(',')
        ).every(order => order === originalOrder);
        expect(allSame).toBe(false);
    });
});
