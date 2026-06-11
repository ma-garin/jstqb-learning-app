// js/progress.js - 資格ごとの進捗管理
import { getSelectedCert } from './certifications.js';
import { certKey, GLOBAL_KEYS, SUFFIXES } from './storage.js';

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

function getTodayProgress(certId = getSelectedCert()) {
    try {
        const value = JSON.parse(localStorage.getItem(certKey(certId, SUFFIXES.today)) || 'null');
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
    const certId = getSelectedCert();
    const progress = getTodayProgress(certId);
    progress.answered += 1;
    if (isCorrect) progress.correct += 1;
    progress.date = todayStr();
    localStorage.setItem(certKey(certId, SUFFIXES.today), JSON.stringify(progress));

    const today = todayStr();
    const lastDate = localStorage.getItem(GLOBAL_KEYS.lastDate);
    if (lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const nextStreak = lastDate === yesterday.toISOString().slice(0, 10)
            ? parseInt(localStorage.getItem(GLOBAL_KEYS.streak) || '0', 10) + 1
            : 1;
        localStorage.setItem(GLOBAL_KEYS.streak, String(nextStreak));
        localStorage.setItem(GLOBAL_KEYS.lastDate, today);
    }

    const totalKey = certKey(certId, SUFFIXES.total);
    const total = parseInt(localStorage.getItem(totalKey) || '0', 10);
    localStorage.setItem(totalKey, String(total + 1));
    if (questionId) {
        const answeredIdsKey = certKey(certId, SUFFIXES.answeredIds);
        const ids = readArray(answeredIdsKey);
        if (!ids.includes(questionId)) {
            ids.push(questionId);
            localStorage.setItem(answeredIdsKey, JSON.stringify(ids));
        }
    }
}

export function getUniqueAnsweredCount() {
    const certId = getSelectedCert();
    return readArray(certKey(certId, SUFFIXES.answeredIds)).length;
}

export function getWrongQuestionIds() {
    const certId = getSelectedCert();
    return readArray(certKey(certId, SUFFIXES.wrong));
}

export function addWrongQuestion(id) {
    if (!id) return;
    const certId = getSelectedCert();
    const ids = getWrongQuestionIds();
    if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem(certKey(certId, SUFFIXES.wrong), JSON.stringify(ids));
    }
}

export function removeCorrectQuestion(id) {
    if (!id) return;
    const certId = getSelectedCert();
    localStorage.setItem(certKey(certId, SUFFIXES.wrong), JSON.stringify(getWrongQuestionIds().filter(item => item !== id)));
}

export function clearWrongQuestions() {
    const certId = getSelectedCert();
    localStorage.removeItem(certKey(certId, SUFFIXES.wrong));
}

export function clearAllProgress() {
    const certId = getSelectedCert();
    [SUFFIXES.today, SUFFIXES.total, SUFFIXES.wrong, SUFFIXES.answeredIds, SUFFIXES.lessonsRead]
        .forEach(suffix => localStorage.removeItem(certKey(certId, suffix)));
    localStorage.removeItem(GLOBAL_KEYS.streak);
    localStorage.removeItem(GLOBAL_KEYS.lastDate);
}

export function getDashboardStats() {
    const certId = getSelectedCert();
    const progress = getTodayProgress(certId);
    const accuracy = progress.answered ? Math.round((progress.correct / progress.answered) * 100) : null;
    return {
        todayAnswered: progress.answered,
        todayCorrect: progress.correct,
        accuracy,
        streak: parseInt(localStorage.getItem(GLOBAL_KEYS.streak) || '0', 10),
        totalAnswered: getUniqueAnsweredCount(),
    };
}
