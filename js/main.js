// js/main.js - ホーム画面の初期化

import { setupCommonNavigation, setupBackToTopButtons, fetchQuestions } from './utils.js';
import { getDashboardStats, getWrongQuestionIds } from './progress.js';
import { topicMap } from './topicMap.js';

document.addEventListener('DOMContentLoaded', async () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    await renderDashboard();
});

async function renderDashboard() {
    const questions = await fetchQuestions();
    const totalQuestions = questions.length;
    const { todayAnswered, todayCorrect, accuracy, streak, totalAnswered } = getDashboardStats();

    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };
    setText('action-desc-quiz', `自作問題${totalQuestions}問で基礎を確認`);
    setText('action-desc-problems', `全${totalQuestions}問・独自解説付き`);
    setText('action-desc-syllabus', `${topicMap.length}章の学習トピックを確認`);
    setText('info-syllabus-version', `個人制作のQA基礎コース ・ 自作問題${totalQuestions}問`);
    setText('greeting-sub', 'ソフトウェアテスト基礎トレーナー');
    setText('stat-answered', todayAnswered);
    setText('stat-correct', todayCorrect);
    setText('stat-accuracy', accuracy !== null ? `${accuracy}%` : '—');
    setText('streak-count', streak);

    const pct = totalQuestions > 0 ? Math.min(Math.round((totalAnswered / totalQuestions) * 100), 100) : 0;
    const bar = document.getElementById('progress-bar-fill');
    if (bar) bar.style.width = `${pct}%`;
    setText('progress-note', `全${totalQuestions}問中 ${Math.min(totalAnswered, totalQuestions)}問 回答済み`);

    const weakBadge = document.getElementById('weak-badge');
    if (weakBadge) {
        const wrongCount = getWrongQuestionIds().length;
        weakBadge.textContent = `復習 ${wrongCount}問`;
        weakBadge.style.display = wrongCount > 0 ? 'inline-block' : 'none';
    }
}
