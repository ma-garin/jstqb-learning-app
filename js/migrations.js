import { GLOBAL_KEYS } from './storage.js';

const OLD_PREFIX = 'qa_basic_';

function copyValue(oldKey, newKey, transform = value => value) {
    const value = localStorage.getItem(oldKey);
    if (value !== null) localStorage.setItem(newKey, transform(value));
}

function rewriteIds(value) {
    const ids = JSON.parse(value);
    return JSON.stringify(ids.map(id => id.replace(/^qa-basic-/, 'fl-')));
}

function rewriteQuestionIds(value) {
    const questions = JSON.parse(value);
    return JSON.stringify(questions.map(question => ({
        ...question,
        id: question.id.replace(/^qa-basic-/, 'fl-'),
    })));
}

export function runMigrations() {
    try {
        if (localStorage.getItem(GLOBAL_KEYS.schemaVersion) === '2') return;

        if (localStorage.getItem(GLOBAL_KEYS.selectedCert) === 'qa-basic') {
            localStorage.setItem(GLOBAL_KEYS.selectedCert, 'fl');
        }

        copyValue('qa_basic_progress_today', 'fl_progress_today');
        copyValue('qa_basic_total_answered', 'fl_total_answered');
        copyValue('qa_basic_wrong_questions', 'fl_wrong_questions', rewriteIds);
        copyValue('qa_basic_answered_ids', 'fl_answered_ids', rewriteIds);
        copyValue('qa_basic_quiz_questions', 'fl_quiz_questions', rewriteQuestionIds);
        copyValue('qa_basic_quiz_next_index', 'fl_quiz_next_index');
        copyValue('qa_basic_quiz_correct_count', 'fl_quiz_correct_count');
        copyValue('qa_basic_quiz_answer_log', 'fl_quiz_answer_log');
        copyValue('qa_basic_quiz_paused', 'fl_quiz_paused');
        copyValue('qa_basic_streak', GLOBAL_KEYS.streak);
        copyValue('qa_basic_last_date', GLOBAL_KEYS.lastDate);

        const oldKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(OLD_PREFIX)) oldKeys.push(key);
        }
        oldKeys.forEach(key => localStorage.removeItem(key));
        localStorage.setItem(GLOBAL_KEYS.schemaVersion, '2');
    } catch (error) {
        console.error('保存データの移行に失敗しました:', error);
    }
}
