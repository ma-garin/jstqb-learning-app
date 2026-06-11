import { beforeEach, describe, expect, it } from 'vitest';
import { runMigrations } from '../js/migrations.js';

beforeEach(() => {
    localStorage.clear();
});

describe('runMigrations', () => {
    it('旧QA基礎キーをv2スキーマへ移行し、再実行しても値を維持する', () => {
        const progress = JSON.stringify({ answered: 3, correct: 2, date: '2026-06-12' });
        const answerLog = JSON.stringify([{ correct: true }]);
        localStorage.setItem('qa_selected_cert', 'qa-basic');
        localStorage.setItem('qa_basic_progress_today', progress);
        localStorage.setItem('qa_basic_total_answered', '8');
        localStorage.setItem('qa_basic_wrong_questions', JSON.stringify(['qa-basic-001']));
        localStorage.setItem('qa_basic_answered_ids', JSON.stringify(['qa-basic-001', 'qa-basic-002']));
        localStorage.setItem('qa_basic_quiz_questions', JSON.stringify([
            { id: 'qa-basic-003', question: '既存問題' },
        ]));
        localStorage.setItem('qa_basic_quiz_next_index', '2');
        localStorage.setItem('qa_basic_quiz_correct_count', '1');
        localStorage.setItem('qa_basic_quiz_answer_log', answerLog);
        localStorage.setItem('qa_basic_quiz_paused', 'true');
        localStorage.setItem('qa_basic_streak', '4');
        localStorage.setItem('qa_basic_last_date', '2026-06-11');
        localStorage.setItem('qa_basic_unused', 'delete-me');

        runMigrations();

        expect(localStorage.getItem('qa_selected_cert')).toBe('fl');
        expect(localStorage.getItem('fl_progress_today')).toBe(progress);
        expect(localStorage.getItem('fl_total_answered')).toBe('8');
        expect(JSON.parse(localStorage.getItem('fl_wrong_questions'))).toEqual(['fl-001']);
        expect(JSON.parse(localStorage.getItem('fl_answered_ids'))).toEqual(['fl-001', 'fl-002']);
        expect(JSON.parse(localStorage.getItem('fl_quiz_questions'))).toEqual([
            { id: 'fl-003', question: '既存問題' },
        ]);
        expect(localStorage.getItem('fl_quiz_next_index')).toBe('2');
        expect(localStorage.getItem('fl_quiz_correct_count')).toBe('1');
        expect(localStorage.getItem('fl_quiz_answer_log')).toBe(answerLog);
        expect(localStorage.getItem('fl_quiz_paused')).toBe('true');
        expect(localStorage.getItem('app_streak')).toBe('4');
        expect(localStorage.getItem('app_last_date')).toBe('2026-06-11');
        expect(localStorage.getItem('app_schema_version')).toBe('2');
        expect(Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)))
            .not.toEqual(expect.arrayContaining([expect.stringMatching(/^qa_basic_/)]));

        const snapshot = Array.from({ length: localStorage.length }, (_, i) => {
            const key = localStorage.key(i);
            return [key, localStorage.getItem(key)];
        });
        runMigrations();
        expect(Array.from({ length: localStorage.length }, (_, i) => {
            const key = localStorage.key(i);
            return [key, localStorage.getItem(key)];
        })).toEqual(snapshot);
    });
});
