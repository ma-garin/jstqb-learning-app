// js/result.js

import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';
import { recordAnswer } from './progress.js';

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();

    const totalQuestions = JSON.parse(localStorage.getItem('quizQuestions'))?.length || 0;
    const correctCount = parseInt(localStorage.getItem('correctAnswersCount') || '0', 10);
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // Save progress for each answered question
    const savedAnswers = JSON.parse(localStorage.getItem('quizAnswerLog') || '[]');
    savedAnswers.forEach(isCorrect => recordAnswer(isCorrect));
    localStorage.removeItem('quizAnswerLog');

    // Render score circle
    const elScore = document.getElementById('result-score-value');
    const elScoreLabel = document.getElementById('result-score-label');
    if (elScore) elScore.textContent = `${correctCount}/${totalQuestions}`;
    if (elScoreLabel) elScoreLabel.textContent = `${accuracy}%`;

    // Grade message
    const elGrade = document.getElementById('result-grade');
    if (elGrade) {
        if (accuracy >= 70) {
            elGrade.textContent = '合格ライン達成！🎉';
            elGrade.style.color = 'var(--success)';
        } else if (accuracy >= 50) {
            elGrade.textContent = 'もう少し！頑張りましょう 💪';
            elGrade.style.color = 'var(--warning)';
        } else {
            elGrade.textContent = '再チャレンジしましょう 📖';
            elGrade.style.color = 'var(--error)';
        }
    }

    // Detail cards
    const elTotal = document.getElementById('detail-total');
    const elCorrect = document.getElementById('detail-correct');
    const elAccuracy = document.getElementById('detail-accuracy');
    if (elTotal) elTotal.textContent = `${totalQuestions}問`;
    if (elCorrect) elCorrect.textContent = `${correctCount}問`;
    if (elAccuracy) elAccuracy.textContent = `${accuracy}%`;

    document.getElementById('restart-quiz-button')?.addEventListener('click', () => {
        localStorage.removeItem('quizQuestions');
        localStorage.removeItem('currentQuestionIndex');
        localStorage.removeItem('correctAnswersCount');
        window.location.href = 'study.html';
    });

    document.getElementById('back-to-welcome-from-result-button')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
