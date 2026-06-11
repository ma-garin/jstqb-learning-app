import { describe, it, expect, beforeEach } from 'vitest';
import {
    recordAnswer,
    getDashboardStats,
    getWrongQuestionIds,
    addWrongQuestion,
    removeCorrectQuestion,
    getUniqueAnsweredCount,
} from '../js/progress.js';

const PROGRESS_KEYS = [
    'qa_basic_progress_today',
    'qa_basic_streak',
    'qa_basic_last_date',
    'qa_basic_total_answered',
    'qa_basic_wrong_questions',
    'qa_basic_answered_ids',
];

beforeEach(() => {
    localStorage.clear();
});

describe('recordAnswer', () => {
    it('QA基礎コースの固定キーへ回答履歴を書き込む', () => {
        recordAnswer(true, 'qa-basic-001');

        expect(localStorage.getItem('qa_basic_total_answered')).toBe('1');
        expect(JSON.parse(localStorage.getItem('qa_basic_answered_ids'))).toEqual(['qa-basic-001']);
        expect(PROGRESS_KEYS.some(key => localStorage.getItem(key) !== null)).toBe(true);
    });
});

describe('苦手問題', () => {
    it('問題IDを固定キーへ重複なく保存する', () => {
        addWrongQuestion('qa-basic-001');
        addWrongQuestion('qa-basic-001');
        addWrongQuestion('qa-basic-002');

        expect(getWrongQuestionIds()).toEqual(['qa-basic-001', 'qa-basic-002']);
        expect(JSON.parse(localStorage.getItem('qa_basic_wrong_questions'))).toEqual([
            'qa-basic-001',
            'qa-basic-002',
        ]);
    });

    it('正解した問題だけを苦手問題から削除する', () => {
        addWrongQuestion('qa-basic-001');
        addWrongQuestion('qa-basic-002');
        removeCorrectQuestion('qa-basic-001');

        expect(getWrongQuestionIds()).toEqual(['qa-basic-002']);
    });
});

describe('getUniqueAnsweredCount', () => {
    it('questionIdなしの回答は固有問題数に含めない', () => {
        recordAnswer(true);
        expect(getUniqueAnsweredCount()).toBe(0);
    });

    it('同じ問題への複数回答は1問として数える', () => {
        recordAnswer(true, 'qa-basic-001');
        recordAnswer(false, 'qa-basic-001');
        expect(getUniqueAnsweredCount()).toBe(1);
    });

    it('異なる問題IDをそれぞれ数える', () => {
        recordAnswer(true, 'qa-basic-001');
        recordAnswer(true, 'qa-basic-002');
        recordAnswer(false, 'qa-basic-003');
        expect(getUniqueAnsweredCount()).toBe(3);
    });
});

describe('getDashboardStats', () => {
    it('totalAnsweredは固有回答問題数を返す', () => {
        recordAnswer(true, 'qa-basic-001');
        recordAnswer(false, 'qa-basic-001');
        recordAnswer(true, 'qa-basic-002');

        const stats = getDashboardStats();
        expect(stats.totalAnswered).toBe(2);
        expect(stats.todayAnswered).toBe(3);
        expect(stats.todayCorrect).toBe(2);
        expect(stats.accuracy).toBe(67);
    });

    it('questionIdなしの回答はtotalAnsweredに反映しない', () => {
        recordAnswer(true);
        recordAnswer(false);
        expect(getDashboardStats().totalAnswered).toBe(0);
    });
});
