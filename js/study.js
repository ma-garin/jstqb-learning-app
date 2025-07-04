// js/study.js
import { setupCommonNavigation, setupBackToTopButtons, fetchQuestions } from './utils.js';

// 試験情報を保持する変数（ここではダミーデータ）
const examInfo = {
    duration: "180分",
    totalQuestions: "90問",
    totalScore: "90点",
    kLevelDistribution: [
        { level: "K1", questions: "10問", scorePerQuestion: "1点", totalScore: "10点" },
        { level: "K2", questions: "30問", scorePerQuestion: "1点", totalScore: "30点" },
        { level: "K3", questions: "30問", scorePerQuestion: "1点", totalScore: "30点" },
        { level: "K4", questions: "20問", scorePerQuestion: "1点", totalScore: "20点" }
    ],
    chapterDistribution: [
        { chapter: "1章", kLevel: "K1-K4", questions: "20問", scorePerQuestion: "1点", totalScore: "20点" },
        { chapter: "2章", kLevel: "K1-K4", questions: "15問", scorePerQuestion: "1点", totalScore: "15点" },
        { chapter: "3章", kLevel: "K1-K4", questions: "25問", scorePerQuestion: "1点", totalScore: "25点" },
        { chapter: "4章", kLevel: "K1-K4", questions: "20問", scorePerQuestion: "1点", totalScore: "20点" },
        { chapter: "5章", kLevel: "K1-K4", questions: "10問", scorePerQuestion: "1点", totalScore: "10点" }
    ]
};

document.addEventListener('DOMContentLoaded', async () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    initStudyScreen();

    // クイズ開始ボタン
    const startActualQuizButton = document.getElementById('start-actual-quiz-button');
    if (startActualQuizButton) {
        startActualQuizButton.addEventListener('click', async () => {
            // クイズデータを取得
            const questions = await fetchQuestions();
            if (questions.length === 0) {
                console.error('問題データの読み込みに失敗しました。');
                return;
            }

            // localStorageにクイズの状態を保存してクイズ画面へ遷移
            localStorage.setItem('quizQuestions', JSON.stringify(questions));
            localStorage.setItem('currentQuestionIndex', '0');
            localStorage.setItem('correctAnswersCount', '0');

            window.location.href = 'quiz.html'; // クイズ画面へ
        });
    }
});


export function initStudyScreen() {
    // DOM要素が存在するか確認
    const examDurationElement = document.getElementById('exam-duration');
    const examTotalQuestionsElement = document.getElementById('exam-total-questions');
    const examTotalScoreElement = document.getElementById('exam-total-score');
    const kLevelTableBody = document.querySelector('#k-level-distribution-table tbody');
    const chapterTableBody = document.querySelector('#chapter-distribution-table tbody');

    if (examDurationElement) {
        examDurationElement.textContent = examInfo.duration;
    }
    if (examTotalQuestionsElement) {
        examTotalQuestionsElement.textContent = examInfo.totalQuestions;
    }
    if (examTotalScoreElement) {
        examTotalScoreElement.textContent = examInfo.totalScore;
    }

    if (kLevelTableBody) {
        kLevelTableBody.innerHTML = ''; // クリア
        examInfo.kLevelDistribution.forEach(item => {
            const row = kLevelTableBody.insertRow();
            row.innerHTML = `
                <td>${item.level}</td>
                <td>${item.questions}</td>
                <td>${item.scorePerQuestion}</td>
                <td>${item.totalScore}</td>
            `;
        });
    }

    if (chapterTableBody) {
        chapterTableBody.innerHTML = ''; // クリア
        examInfo.chapterDistribution.forEach(item => {
            const row = chapterTableBody.insertRow();
            row.innerHTML = `
                <td>${item.chapter}</td>
                <td>${item.kLevel}</td>
                <td>${item.questions}</td>
                <td>${item.scorePerQuestion}</td>
                <td>${item.totalScore}</td>
            `;
        });
    }
    console.log("Study Screen Initialized.");
}
