// js/result.js
import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();

    const correctAnswersCountElement = document.getElementById('correct-answers-count');
    const totalQuestionsCountElement = document.getElementById('total-questions-count');
    const restartQuizButton = document.getElementById('restart-quiz-button');

    // localStorageから結果を読み込み
    const totalQuestions = JSON.parse(localStorage.getItem('quizQuestions'))?.length || 0;
    const correctCount = parseInt(localStorage.getItem('correctAnswersCount') || '0', 10);

    correctAnswersCountElement.textContent = correctCount;
    totalQuestionsCountElement.textContent = totalQuestions;

    // もう一度学習するボタン
    if (restartQuizButton) {
        restartQuizButton.addEventListener('click', () => {
            // localStorageのクイズ状態をクリアして、学習開始画面に戻る
            localStorage.removeItem('quizQuestions');
            localStorage.removeItem('currentQuestionIndex');
            localStorage.removeItem('correctAnswersCount');
            window.location.href = 'study.html'; // 学習開始ページへ
        });
    }

    // 結果画面からのTOPに戻るボタンはutils.jsで対応
});