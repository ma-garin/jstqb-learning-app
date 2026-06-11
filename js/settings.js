// js/settings.js
import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';
import { clearAllProgress, clearWrongQuestions, getDashboardStats, getWrongQuestionIds } from './progress.js';
import { getSelectedCert } from './certifications.js';
import { certKey, SUFFIXES } from './storage.js';

function resetAllData() {
    const certId = getSelectedCert();
    clearAllProgress();
    [
        SUFFIXES.quizQuestions,
        SUFFIXES.quizNextIndex,
        SUFFIXES.quizCorrectCount,
        SUFFIXES.quizAnswerLog,
        SUFFIXES.quizPaused,
    ].forEach(suffix => localStorage.removeItem(certKey(certId, suffix)));
}

function renderStats() {
    const el = document.getElementById('stats-summary');
    if (!el) return;
    const { todayAnswered, todayCorrect, streak, totalAnswered } = getDashboardStats();
    el.textContent = `今日：${todayAnswered}問 / 正解${todayCorrect}問 ・ 回答済み：${totalAnswered}問 ・ 復習：${getWrongQuestionIds().length}問 ・ 連続${streak}日`;
}

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    renderStats();

    document.getElementById('reset-wrong-btn')?.addEventListener('click', () => {
        const count = getWrongQuestionIds().length;
        if (!count) {
            alert('復習リストは空です。');
            return;
        }
        if (!confirm(`復習リスト（${count}問）をリセットしますか？`)) return;
        clearWrongQuestions();
        renderStats();
    });

    document.getElementById('reset-all-btn')?.addEventListener('click', () => {
        if (!confirm('すべての学習データをリセットします。この操作は元に戻せません。よろしいですか？')) return;
        resetAllData();
        renderStats();
    });

    const appInfo = document.querySelectorAll('.settings-item-desc');
    appInfo.forEach(item => {
        if (item.textContent.includes('CTAL') || item.textContent.includes('ALTA')) {
            item.textContent = '個人制作の非公式テスト技術学習教材。公式本文・公式問題は収録していません。';
        }
    });
});
