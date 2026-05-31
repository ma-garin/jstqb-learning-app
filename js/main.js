// js/main.js — ホーム画面の初期化

import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';
import { getDashboardStats, getWrongQuestionIds } from './progress.js';

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    renderDashboard();
});

function renderDashboard() {
    const { todayAnswered, todayCorrect, accuracy, streak, totalAnswered } = getDashboardStats();
    const TOTAL_QUESTIONS = 33;

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
