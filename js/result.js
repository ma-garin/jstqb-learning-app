// js/result.js

import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();

    const totalQuestions = JSON.parse(localStorage.getItem('qa_basic_quiz_questions') || '[]').length;
    const correctCount = parseInt(localStorage.getItem('qa_basic_quiz_correct_count') || '0', 10);
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

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
        localStorage.removeItem('qa_basic_quiz_questions');
        localStorage.removeItem('qa_basic_quiz_next_index');
        localStorage.removeItem('qa_basic_quiz_correct_count');
        window.location.href = 'study.html';
    });

    document.getElementById('back-to-welcome-from-result-button')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
