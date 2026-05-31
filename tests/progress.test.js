import { describe, it, expect, beforeEach } from 'vitest';
import { recordAnswer, getDashboardStats, getWrongQuestionIds, addWrongQuestion, removeCorrectQuestion } from '../js/progress.js';

const ALTA_KEYS = [
    'jstqb_alta_progress_today',
    'jstqb_alta_streak',
    'jstqb_alta_last_date',
    'jstqb_alta_total_answered',
    'jstqb_alta_wrong_questions',
];
const ALTM_KEYS = [
    'jstqb_altm_progress_today',
    'jstqb_altm_streak',
    'jstqb_altm_last_date',
    'jstqb_altm_total_answered',
    'jstqb_altm_wrong_questions',
];

beforeEach(() => {
    [...ALTA_KEYS, ...ALTM_KEYS].forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('jstqb_selected_exam');
});

describe('recordAnswer — ALTA/ALTM分離', () => {
    it('alta選択中に recordAnswer するとALTAキーに書き込む', () => {
        localStorage.setItem('jstqb_selected_exam', 'alta');
        recordAnswer(true);
        expect(localStorage.getItem('jstqb_alta_total_answered')).toBe('1');
        expect(localStorage.getItem('jstqb_altm_total_answered')).toBeNull();
    });

    it('altm選択中に recordAnswer するとALTMキーに書き込む', () => {
        localStorage.setItem('jstqb_selected_exam', 'altm');
        recordAnswer(true);
        expect(localStorage.getItem('jstqb_altm_total_answered')).toBe('1');
        expect(localStorage.getItem('jstqb_alta_total_answered')).toBeNull();
    });

    it('altaとaltmの回答数は互いに影響しない', () => {
        localStorage.setItem('jstqb_selected_exam', 'alta');
        recordAnswer(true);
        recordAnswer(false);
        localStorage.setItem('jstqb_selected_exam', 'altm');
        recordAnswer(true);
        expect(localStorage.getItem('jstqb_alta_total_answered')).toBe('2');
        expect(localStorage.getItem('jstqb_altm_total_answered')).toBe('1');
    });
});

describe('getDashboardStats — 試験別データ返却', () => {
    it('altm選択中はALTMの進捗データのみ返す', () => {
        localStorage.setItem('jstqb_selected_exam', 'alta');
        recordAnswer(true);
        recordAnswer(true);
        localStorage.setItem('jstqb_selected_exam', 'altm');
        const stats = getDashboardStats();
        expect(stats.totalAnswered).toBe(0);
    });
});

describe('苦手問題 — ALTA/ALTM分離', () => {
    it('alta選択中に addWrongQuestion するとALTAキーに保存する', () => {
        localStorage.setItem('jstqb_selected_exam', 'alta');
        addWrongQuestion('TA-1.2.1-1');
        const altaIds = JSON.parse(localStorage.getItem('jstqb_alta_wrong_questions') || '[]');
        const altmIds = JSON.parse(localStorage.getItem('jstqb_altm_wrong_questions') || '[]');
        expect(altaIds).toContain('TA-1.2.1-1');
        expect(altmIds).not.toContain('TA-1.2.1-1');
    });

    it('altmの苦手問題がaltaのクイズに混入しない', () => {
        localStorage.setItem('jstqb_selected_exam', 'altm');
        addWrongQuestion('TM-1.1.1-1');
        localStorage.setItem('jstqb_selected_exam', 'alta');
        const ids = getWrongQuestionIds();
        expect(ids).not.toContain('TM-1.1.1-1');
    });

    it('removeCorrectQuestion は選択中の試験の苦手問題のみ削除する', () => {
        localStorage.setItem('jstqb_selected_exam', 'alta');
        addWrongQuestion('TA-1.2.1-1');
        localStorage.setItem('jstqb_selected_exam', 'altm');
        addWrongQuestion('TM-1.1.1-1');
        localStorage.setItem('jstqb_selected_exam', 'alta');
        removeCorrectQuestion('TA-1.2.1-1');
        const altaIds = getWrongQuestionIds();
        localStorage.setItem('jstqb_selected_exam', 'altm');
        const altmIds = getWrongQuestionIds();
        expect(altaIds).not.toContain('TA-1.2.1-1');
        expect(altmIds).toContain('TM-1.1.1-1');
    });
});
