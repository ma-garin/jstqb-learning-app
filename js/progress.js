// js/progress.js — 学習進捗の管理（localStorage）

const KEY_TODAY = 'jstqb_progress_today';
const KEY_STREAK = 'jstqb_streak';
const KEY_LAST_DATE = 'jstqb_last_date';
const KEY_TOTAL = 'jstqb_total_answered';

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

function getTodayProgress() {
    const stored = localStorage.getItem(KEY_TODAY);
    if (!stored) return { answered: 0, correct: 0, date: todayStr() };
    try {
        const p = JSON.parse(stored);
        return p.date === todayStr() ? p : { answered: 0, correct: 0, date: todayStr() };
    } catch {
        return { answered: 0, correct: 0, date: todayStr() };
    }
}

export function recordAnswer(isCorrect) {
    const p = getTodayProgress();
    p.answered += 1;
    if (isCorrect) p.correct += 1;
    p.date = todayStr();
    localStorage.setItem(KEY_TODAY, JSON.stringify(p));

    // streak update
    const lastDate = localStorage.getItem(KEY_LAST_DATE);
    const today = todayStr();
    if (lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);
        const streak = parseInt(localStorage.getItem(KEY_STREAK) || '0', 10);
        if (lastDate === yesterdayStr) {
            localStorage.setItem(KEY_STREAK, String(streak + 1));
        } else {
            localStorage.setItem(KEY_STREAK, '1');
        }
        localStorage.setItem(KEY_LAST_DATE, today);
    }

    // total answered
    const total = parseInt(localStorage.getItem(KEY_TOTAL) || '0', 10);
    localStorage.setItem(KEY_TOTAL, String(total + 1));
}

// ── 苦手問題管理 ──────────────────────────

const KEY_WRONG = 'jstqb_wrong_questions';

export function getWrongQuestionIds() {
    try {
        return JSON.parse(localStorage.getItem(KEY_WRONG) || '[]');
    } catch {
        return [];
    }
}

export function addWrongQuestion(id) {
    if (!id) return;
    const ids = getWrongQuestionIds();
    if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem(KEY_WRONG, JSON.stringify(ids));
    }
}

export function removeCorrectQuestion(id) {
    if (!id) return;
    const ids = getWrongQuestionIds().filter(i => i !== id);
    localStorage.setItem(KEY_WRONG, JSON.stringify(ids));
}

export function clearWrongQuestions() {
    localStorage.removeItem(KEY_WRONG);
}

export function getDashboardStats() {
    const p = getTodayProgress();
    const streak = parseInt(localStorage.getItem(KEY_STREAK) || '0', 10);
    const totalAnswered = parseInt(localStorage.getItem(KEY_TOTAL) || '0', 10);
    const accuracy = p.answered > 0 ? Math.round((p.correct / p.answered) * 100) : null;
    return { todayAnswered: p.answered, todayCorrect: p.correct, accuracy, streak, totalAnswered };
}
