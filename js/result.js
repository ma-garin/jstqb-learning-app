// js/result.js

import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';
import { getSelectedCert } from './certifications.js';
import { certKey, SUFFIXES } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();

    const certId = getSelectedCert();
    const questionsKey = certKey(certId, SUFFIXES.quizQuestions);
    const nextIndexKey = certKey(certId, SUFFIXES.quizNextIndex);
    const correctCountKey = certKey(certId, SUFFIXES.quizCorrectCount);
    const quizMetaKey = certKey(certId, SUFFIXES.quizMeta);
    const totalQuestions = JSON.parse(localStorage.getItem(questionsKey) || '[]').length;
    const correctCount = parseInt(localStorage.getItem(correctCountKey) || '0', 10);
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    try {
        const quizMeta = JSON.parse(localStorage.getItem(quizMetaKey) || 'null');
        if (quizMeta?.mode === 'chapter') {
            const context = document.getElementById('result-quiz-context') || document.createElement('h2');
            context.id = 'result-quiz-context';
            context.className = 'result-quiz-context';
            context.textContent = `${quizMeta.chapter}章 ${quizMeta.chapterTitle} ドリル`;
            if (!context.parentElement) {
                document.querySelector('#result-screen .result-score-circle')?.before(context);
            }
        }
    } catch {
        localStorage.removeItem(quizMetaKey);
    }

    const elScore = document.getElementById('result-score-value');
    const elScoreLabel = document.getElementById('result-score-label');
    if (elScore) elScore.textContent = `${correctCount}/${totalQuestions}`;
    if (elScoreLabel) elScoreLabel.textContent = `${accuracy}%`;

    const elGrade = document.getElementById('result-grade');
    if (elGrade) {
        if (accuracy >= 70) {
            elGrade.textContent = '基礎をよく確認できています。';
            elGrade.style.color = 'var(--success)';
        } else if (accuracy >= 50) {
            elGrade.textContent = '誤答したテーマを復習しましょう。';
            elGrade.style.color = 'var(--warning)';
        } else {
            elGrade.textContent = '解説を読み、もう一度確認しましょう。';
            elGrade.style.color = 'var(--error)';
        }
    }

    const elTotal = document.getElementById('detail-total');
    const elCorrect = document.getElementById('detail-correct');
    const elAccuracy = document.getElementById('detail-accuracy');
    if (elTotal) elTotal.textContent = `${totalQuestions}問`;
    if (elCorrect) elCorrect.textContent = `${correctCount}問`;
    if (elAccuracy) elAccuracy.textContent = `${accuracy}%`;

    document.getElementById('restart-quiz-button')?.addEventListener('click', () => {
        localStorage.removeItem(questionsKey);
        localStorage.removeItem(nextIndexKey);
        localStorage.removeItem(correctCountKey);
        localStorage.removeItem(quizMetaKey);
        window.location.href = 'study.html';
    });

    document.getElementById('back-to-welcome-from-result-button')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
