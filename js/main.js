// js/main.js — ホーム画面の初期化

import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';
import { getDashboardStats, getWrongQuestionIds } from './progress.js';
import { getExam } from './examContext.js';

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    renderDashboard();
});

const EXAM_META = {
    alta: { totalQuestions: 120, syllabusInfo: 'シラバス v3.1.1.J03 対応 ・ K1〜K4', syllabusChapters: 8, greeting: 'Advanced Level Test Analyst' },
    altm: { totalQuestions: 40, syllabusInfo: 'シラバス V3.0.J03 対応 ・ K2〜K4', syllabusChapters: 3, greeting: 'Advanced Level Test Manager' },
};

function renderDashboard() {
    const exam = getExam();
    const { todayAnswered, todayCorrect, accuracy, streak, totalAnswered } = getDashboardStats();
    const { totalQuestions: TOTAL_QUESTIONS, syllabusInfo, syllabusChapters, greeting } = EXAM_META[exam] ?? EXAM_META.alta;

    const descQuiz = document.getElementById('action-desc-quiz');
    const descProblems = document.getElementById('action-desc-problems');
    const descSyllabus = document.getElementById('action-desc-syllabus');
    const infoVersion = document.getElementById('info-syllabus-version');
    const greetingSub = document.getElementById('greeting-sub');
    if (descQuiz) descQuiz.textContent = `想定問題${TOTAL_QUESTIONS}問で実力試し`;
    if (descProblems) descProblems.textContent = `全${TOTAL_QUESTIONS}問・解説付き`;
    if (descSyllabus) descSyllabus.textContent = `${syllabusChapters}章を章別に閲覧`;
    if (infoVersion) infoVersion.textContent = `${syllabusInfo} ・ ${TOTAL_QUESTIONS}問収録`;
    if (greetingSub) greetingSub.textContent = greeting;

    const elAnswered = document.getElementById('stat-answered');
    const elCorrect = document.getElementById('stat-correct');
    const elAccuracy = document.getElementById('stat-accuracy');
    const elStreak = document.getElementById('streak-count');
    const elBar = document.getElementById('progress-bar-fill');
    const elNote = document.getElementById('progress-note');

    if (elAnswered) elAnswered.textContent = todayAnswered;
    if (elCorrect) elCorrect.textContent = todayCorrect;
    if (elAccuracy) elAccuracy.textContent = accuracy !== null ? `${accuracy}%` : '—';
    if (elStreak) elStreak.textContent = streak;

    const pct = Math.min(Math.round((totalAnswered / TOTAL_QUESTIONS) * 100), 100);
    if (elBar) elBar.style.width = `${pct}%`;
    if (elNote) elNote.textContent = `全${TOTAL_QUESTIONS}問中 ${Math.min(totalAnswered, TOTAL_QUESTIONS)}問 累計回答`;

    // 苦手問題バッジ
    const wrongIds = getWrongQuestionIds();
    const weakBadge = document.getElementById('weak-badge');
    if (weakBadge) {
        if (wrongIds.length > 0) {
            weakBadge.textContent = `苦手 ${wrongIds.length}問`;
            weakBadge.style.display = 'inline-block';
        } else {
            weakBadge.style.display = 'none';
        }
    }
}
