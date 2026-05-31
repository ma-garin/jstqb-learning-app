// js/progress.js — 学習進捗の管理（localStorage・試験別ネームスペース）

import { getExam } from './examContext.js';

function keys() {
    const e = getExam();
    return {
        today:   `jstqb_${e}_progress_today`,
        streak:  `jstqb_${e}_streak`,
        lastDate:`jstqb_${e}_last_date`,
        total:   `jstqb_${e}_total_answered`,
        wrong:   `jstqb_${e}_wrong_questions`,
    };
}

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

function getTodayProgress() {
    const stored = localStorage.getItem(keys().today);
    if (!stored) return { answered: 0, correct: 0, date: todayStr() };
    try {
        const p = JSON.parse(stored);
        return p.date === todayStr() ? p : { answered: 0, correct: 0, date: todayStr() };
    } catch {
        return { answered: 0, correct: 0, date: todayStr() };
    }
}

export function recordAnswer(isCorrect) {
    const k = keys();
    const p = getTodayProgress();
    p.answered += 1;
    if (isCorrect) p.correct += 1;
    p.date = todayStr();
    localStorage.setItem(k.today, JSON.stringify(p));

    const lastDate = localStorage.getItem(k.lastDate);
    const today = todayStr();
    if (lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);
        const streak = parseInt(localStorage.getItem(k.streak) || '0', 10);
        localStorage.setItem(k.streak, String(lastDate === yesterdayStr ? streak + 1 : 1));
        localStorage.setItem(k.lastDate, today);
    }

    const total = parseInt(localStorage.getItem(k.total) || '0', 10);
    localStorage.setItem(k.total, String(total + 1));
}

export function getWrongQuestionIds() {
    try {
        return JSON.parse(localStorage.getItem(keys().wrong) || '[]');
    } catch {
        return [];
    }
}

export function addWrongQuestion(id) {
    if (!id) return;
    const ids = getWrongQuestionIds();
    if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem(keys().wrong, JSON.stringify(ids));
    }
}

export function removeCorrectQuestion(id) {
    if (!id) return;
    const ids = getWrongQuestionIds().filter(i => i !== id);
    localStorage.setItem(keys().wrong, JSON.stringify(ids));
}

export function clearWrongQuestions() {
    localStorage.removeItem(keys().wrong);
}

export function getDashboardStats() {
    const k = keys();
    const p = getTodayProgress();
    const streak = parseInt(localStorage.getItem(k.streak) || '0', 10);
    const totalAnswered = parseInt(localStorage.getItem(k.total) || '0', 10);
    const accuracy = p.answered > 0 ? Math.round((p.correct / p.answered) * 100) : null;
    return { todayAnswered: p.answered, todayCorrect: p.correct, accuracy, streak, totalAnswered };
}
