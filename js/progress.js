// js/progress.js - 単一QA基礎コースの進捗管理

const KEYS = {
    today: 'qa_basic_progress_today',
    streak: 'qa_basic_streak',
    lastDate: 'qa_basic_last_date',
    total: 'qa_basic_total_answered',
    wrong: 'qa_basic_wrong_questions',
    answeredIds: 'qa_basic_answered_ids',
};

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

function getTodayProgress() {
    try {
        const value = JSON.parse(localStorage.getItem(KEYS.today) || 'null');
        return value?.date === todayStr() ? value : { answered: 0, correct: 0, date: todayStr() };
    } catch {
        return { answered: 0, correct: 0, date: todayStr() };
    }
}

function readArray(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

export function recordAnswer(isCorrect, questionId = null) {
    const progress = getTodayProgress();
    progress.answered += 1;
    if (isCorrect) progress.correct += 1;
    progress.date = todayStr();
    localStorage.setItem(KEYS.today, JSON.stringify(progress));

    const today = todayStr();
    const lastDate = localStorage.getItem(KEYS.lastDate);
    if (lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const nextStreak = lastDate === yesterday.toISOString().slice(0, 10)
            ? parseInt(localStorage.getItem(KEYS.streak) || '0', 10) + 1
            : 1;
        localStorage.setItem(KEYS.streak, String(nextStreak));
        localStorage.setItem(KEYS.lastDate, today);
    }

    const total = parseInt(localStorage.getItem(KEYS.total) || '0', 10);
    localStorage.setItem(KEYS.total, String(total + 1));
    if (questionId) {
        const ids = readArray(KEYS.answeredIds);
        if (!ids.includes(questionId)) {
            ids.push(questionId);
            localStorage.setItem(KEYS.answeredIds, JSON.stringify(ids));
        }
    }
}

export function getUniqueAnsweredCount() {
    return readArray(KEYS.answeredIds).length;
}

export function getWrongQuestionIds() {
    return readArray(KEYS.wrong);
}

export function addWrongQuestion(id) {
    if (!id) return;
    const ids = getWrongQuestionIds();
    if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem(KEYS.wrong, JSON.stringify(ids));
    }
}

export function removeCorrectQuestion(id) {
    if (!id) return;
    localStorage.setItem(KEYS.wrong, JSON.stringify(getWrongQuestionIds().filter(item => item !== id)));
}

export function clearWrongQuestions() {
    localStorage.removeItem(KEYS.wrong);
}

export function clearAllProgress() {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
}

export function getDashboardStats() {
    const progress = getTodayProgress();
    const accuracy = progress.answered ? Math.round((progress.correct / progress.answered) * 100) : null;
    return {
        todayAnswered: progress.answered,
        todayCorrect: progress.correct,
        accuracy,
        streak: parseInt(localStorage.getItem(KEYS.streak) || '0', 10),
        totalAnswered: getUniqueAnsweredCount(),
    };
}
