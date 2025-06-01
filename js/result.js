// js/result.js
import { showScreen } from './main.js'; // main.js から showScreen をインポート

export function initResultScreen() {
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
        backToWelcomeFromResultButton.removeEventListener('click', () => showScreen('welcome-screen'));
        backToWelcomeFromResultButton.addEventListener('click', () => showScreen('welcome-screen'));
    }

    console.log("Result Screen Initialized.");
}

function restartQuiz() {
    // localStorageのクイズ状態をクリアして、学習開始画面に戻る
    localStorage.removeItem('quizQuestions');
    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('correctAnswersCount');
    showScreen('learning-start-screen'); // 学習開始ページへ
}