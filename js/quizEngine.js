import { getSelectedCert } from './certifications.js';
import { certKey, SUFFIXES } from './storage.js';

export function normalize(answer) {
    return String(answer || '').trim().toLowerCase();
}

export function getAnswerText(letter, question) {
    const idx = normalize(letter).charCodeAt(0) - 97;
    if (!question || idx < 0 || idx >= question.choices.length) return '';
    return question.choices[idx].replace(/^[a-dA-D][).]\s*/, '');
}

export function answerIndex(value) {
    if (Number.isInteger(value)) return value;
    const normalized = normalize(value);
    return normalized ? normalized.charCodeAt(0) - 97 : -1;
}

export function formatLabel(letter, question) {
    const normalized = normalize(letter);
    const text = getAnswerText(normalized, question);
    return text ? `${normalized.toUpperCase()}. ${text}` : normalized.toUpperCase();
}

export function getQuizSessionKeys(certId = getSelectedCert()) {
    return {
        questions: certKey(certId, SUFFIXES.quizQuestions),
        nextIndex: certKey(certId, SUFFIXES.quizNextIndex),
        correctCount: certKey(certId, SUFFIXES.quizCorrectCount),
        paused: certKey(certId, SUFFIXES.quizPaused),
    };
}

export function readQuizSession(certId = getSelectedCert(), storage = localStorage) {
    const keys = getQuizSessionKeys(certId);
    const savedQuestions = storage.getItem(keys.questions);
    if (!savedQuestions) return null;

    try {
        const questions = JSON.parse(savedQuestions);
        if (!Array.isArray(questions)) return null;
        return {
            questions,
            nextIndex: parseInt(storage.getItem(keys.nextIndex) || '0', 10),
            correctCount: parseInt(storage.getItem(keys.correctCount) || '0', 10),
        };
    } catch {
        return null;
    }
}

export function saveQuizProgress(nextIndex, correctCount, certId = getSelectedCert(), storage = localStorage) {
    const keys = getQuizSessionKeys(certId);
    storage.setItem(keys.nextIndex, String(nextIndex));
    storage.setItem(keys.correctCount, String(correctCount));
}

export function pauseQuizSession(certId = getSelectedCert(), storage = localStorage) {
    storage.setItem(getQuizSessionKeys(certId).paused, 'true');
}
