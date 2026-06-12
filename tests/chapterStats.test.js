import { describe, expect, it } from 'vitest';
import { aggregateChapterStats } from '../js/chapterStats.js';

describe('aggregateChapterStats', () => {
    it('章ごとの回答数、正解数、達成率を集計する', () => {
        const questions = [
            { id: 'q1', sectionRef: '1.1.1' },
            { id: 'q2', sectionRef: '1.2.1' },
            { id: 'q3', sectionRef: '1.3.1' },
            { id: 'q4', sectionRef: '2.1.1' },
            { id: 'fl-1' },
        ];

        expect(aggregateChapterStats(questions, ['q1', 'q2', 'q4'], ['q2', 'q4'])).toEqual([
            {
                chapter: '1',
                total: 3,
                answered: 2,
                correct: 1,
                correctRate: 50,
                achievement: 33,
            },
            {
                chapter: '2',
                total: 1,
                answered: 1,
                correct: 0,
                correctRate: 0,
                achievement: 0,
            },
        ]);
    });

    it('sectionRefがない問題だけなら空配列を返す', () => {
        expect(aggregateChapterStats([{ id: 'fl-1' }], ['fl-1'], [])).toEqual([]);
    });
});
