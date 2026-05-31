// js/study.js
import { setupCommonNavigation, setupBackToTopButtons, fetchQuestions } from './utils.js';
import { getWrongQuestionIds } from './progress.js';
import { getExam } from './examContext.js';

const EXAM_INFO = {
    alta: {
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
    },
    altm: {
        duration: "180分",
        totalQuestions: "65問",
        totalScore: "65点",
        kLevelDistribution: [
            { level: "K2", questions: "36問", scorePerQuestion: "1点", totalScore: "36点" },
            { level: "K3", questions: "5問", scorePerQuestion: "1点", totalScore: "5点" },
            { level: "K4", questions: "7問", scorePerQuestion: "1点", totalScore: "7点" }
        ],
        chapterDistribution: [
            { chapter: "1章", kLevel: "K2-K4", questions: "34問", scorePerQuestion: "1点", totalScore: "34点" },
            { chapter: "2章", kLevel: "K2-K4", questions: "18問", scorePerQuestion: "1点", totalScore: "18点" },
            { chapter: "3章", kLevel: "K2-K4", questions: "13問", scorePerQuestion: "1点", totalScore: "13点" }
        ]
    }
};

const examInfo = EXAM_INFO[getExam()] ?? EXAM_INFO.alta;

export function shuffleQuestions(questions) {
    const arr = [...questions];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function startQuiz(questions) {
    localStorage.setItem('quizQuestions', JSON.stringify(questions));
    localStorage.setItem('currentQuestionIndex', '0');
    localStorage.setItem('correctAnswersCount', '0');
    localStorage.removeItem('quizAnswerLog');
    window.location.href = 'quiz.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    initStudyScreen();
    renderWeakQuizSection();

    // 全問クイズ開始
    const startBtn = document.getElementById('start-actual-quiz-button');
    const shuffleCheckbox = document.getElementById('shuffle-quiz-checkbox');
    if (startBtn) {
        startBtn.addEventListener('click', async () => {
            const questions = await fetchQuestions();
            if (!questions.length) { console.error('問題データの読み込みに失敗しました。'); return; }
            const quizQuestions = shuffleCheckbox?.checked ? shuffleQuestions(questions) : questions;
            startQuiz(quizQuestions);
        });
    }

    // 苦手問題クイズ開始
    const weakBtn = document.getElementById('start-weak-quiz-button');
    if (weakBtn) {
        weakBtn.addEventListener('click', async () => {
            const wrongIds = getWrongQuestionIds();
            if (!wrongIds.length) {
                alert('苦手問題がまだ記録されていません。まず全問クイズに挑戦してください。');
                return;
            }
            const allQuestions = await fetchQuestions();
            const wrongQuestions = allQuestions.filter(q => wrongIds.includes(q.id));
            if (!wrongQuestions.length) {
                alert('苦手問題が見つかりません。');
                return;
            }
            startQuiz(shuffleQuestions(wrongQuestions));
        });
    }
});

export function initStudyScreen() {
    const examDurationEl = document.getElementById('exam-duration');
    const examTotalQEl = document.getElementById('exam-total-questions');
    const kLevelTbody = document.querySelector('#k-level-distribution-table tbody');
    const chapterTbody = document.querySelector('#chapter-distribution-table tbody');

    if (examDurationEl) examDurationEl.textContent = examInfo.duration;
    if (examTotalQEl) examTotalQEl.textContent = examInfo.totalQuestions;

    if (kLevelTbody) {
        kLevelTbody.innerHTML = '';
        examInfo.kLevelDistribution.forEach(item => {
            const row = kLevelTbody.insertRow();
            [item.level, item.questions, item.scorePerQuestion, item.totalScore].forEach(val => {
                row.insertCell().textContent = val;
            });
        });
    }
    if (chapterTbody) {
        chapterTbody.innerHTML = '';
        examInfo.chapterDistribution.forEach(item => {
            const row = chapterTbody.insertRow();
            [item.chapter, item.kLevel, item.questions, item.scorePerQuestion, item.totalScore].forEach(val => {
                row.insertCell().textContent = val;
            });
        });
    }
}

function renderWeakQuizSection() {
    const section = document.getElementById('weak-quiz-section');
    if (!section) return;
    const wrongIds = getWrongQuestionIds();
    const countEl = document.getElementById('weak-question-count');
    if (countEl) countEl.textContent = wrongIds.length;
    section.style.display = wrongIds.length > 0 ? 'block' : 'none';
}
