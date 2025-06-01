// js/result.js
import { setupCommonNavigation, setupBackToTopButtons } from './utils.js'; // showScreenのインポートを削除

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();

    const correctAnswersCountElement = document.getElementById('correct-answers-count');
    const totalQuestionsCountElement = document.getElementById('total-questions-count');
    const restartQuizButton = document.getElementById('restart-quiz-button');
    const backToWelcomeFromResultButton = document.getElementById('back-to-welcome-from-result-button');


    // localStorageから結果を読み込み
    const totalQuestions = JSON.parse(localStorage.getItem('quizQuestions'))?.length || 0;
    const correctCount = parseInt(localStorage.getItem('correctAnswersCount') || '0', 10);

    if (correctAnswersCountElement) {
        correctAnswersCountElement.textContent = correctCount;
    }
    if (totalQuestionsCountElement) {
        totalQuestionsCountElement.textContent = totalQuestions;
    }

    // もう一度学習するボタン
    if (restartQuizButton) {
        restartQuizButton.removeEventListener('click', restartQuiz); // 重複登録防止
        restartQuizButton.addEventListener('click', restartQuiz);
    }
    if (backToWelcomeFromResultButton) {
        backToWelcomeFromResultButton.removeEventListener('click', () => {
            window.location.href = 'index.html'; // TOP画面に戻る
        });
        backToWelcomeFromResultButton.addEventListener('click', () => {
            window.location.href = 'index.html'; // TOP画面に戻る
        });
    }

    console.log("Result Screen Initialized.");
});

function restartQuiz() {
    // localStorageのクイズ状態をクリアして、学習開始画面に戻る
    localStorage.removeItem('quizQuestions');
    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('correctAnswersCount');
    window.location.href = 'study.html'; // 学習開始ページへ
}
