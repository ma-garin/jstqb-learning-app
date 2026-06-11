import { describe, it, expect, beforeEach } from 'vitest';
import {
    recordAnswer,
    getDashboardStats,
    getWrongQuestionIds,
    addWrongQuestion,
    removeCorrectQuestion,
    getUniqueAnsweredCount,
} from '../js/progress.js';
import { setSelectedCert } from '../js/certifications.js';

const PROGRESS_KEYS = [
    'fl_progress_today',
    'app_streak',
    'app_last_date',
    'fl_total_answered',
    'fl_wrong_questions',
    'fl_answered_ids',
];

beforeEach(() => {
    localStorage.clear();
    setSelectedCert('fl');
});

describe('recordAnswer', () => {
    it('選択中の資格キーへ回答履歴を書き込む', () => {
        recordAnswer(true, 'fl-001');

        expect(localStorage.getItem('fl_total_answered')).toBe('1');
        expect(JSON.parse(localStorage.getItem('fl_answered_ids'))).toEqual(['fl-001']);
        expect(PROGRESS_KEYS.some(key => localStorage.getItem(key) !== null)).toBe(true);
    });

    it('FLとALTAの進捗を別々のキーへ保存する', () => {
        recordAnswer(true, 'fl-001');
        setSelectedCert('alta');
        recordAnswer(false, 'alta-001');

        expect(JSON.parse(localStorage.getItem('fl_answered_ids'))).toEqual(['fl-001']);
        expect(JSON.parse(localStorage.getItem('alta_answered_ids'))).toEqual(['alta-001']);
        expect(localStorage.getItem('fl_total_answered')).toBe('1');
        expect(localStorage.getItem('alta_total_answered')).toBe('1');
    });
});

describe('苦手問題', () => {
    it('問題IDを固定キーへ重複なく保存する', () => {
        addWrongQuestion('fl-001');
        addWrongQuestion('fl-001');
        addWrongQuestion('fl-002');

        expect(getWrongQuestionIds()).toEqual(['fl-001', 'fl-002']);
        expect(JSON.parse(localStorage.getItem('fl_wrong_questions'))).toEqual([
            'fl-001',
            'fl-002',
        ]);
    });

    it('正解した問題だけを苦手問題から削除する', () => {
        addWrongQuestion('fl-001');
        addWrongQuestion('fl-002');
        removeCorrectQuestion('fl-001');

        expect(getWrongQuestionIds()).toEqual(['fl-002']);
    });
});

describe('getUniqueAnsweredCount', () => {
    it('questionIdなしの回答は固有問題数に含めない', () => {
        recordAnswer(true);
        expect(getUniqueAnsweredCount()).toBe(0);
    });

    it('同じ問題への複数回答は1問として数える', () => {
        recordAnswer(true, 'fl-001');
        recordAnswer(false, 'fl-001');
        expect(getUniqueAnsweredCount()).toBe(1);
    });

    it('異なる問題IDをそれぞれ数える', () => {
        recordAnswer(true, 'fl-001');
        recordAnswer(true, 'fl-002');
        recordAnswer(false, 'fl-003');
        expect(getUniqueAnsweredCount()).toBe(3);
    });
});

describe('getDashboardStats', () => {
    it('totalAnsweredは固有回答問題数を返す', () => {
        recordAnswer(true, 'fl-001');
        recordAnswer(false, 'fl-001');
        recordAnswer(true, 'fl-002');

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
