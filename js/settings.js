// js/settings.js
import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';
import { clearAllProgress, clearWrongQuestions, getDashboardStats, getWrongQuestionIds } from './progress.js';

const QUIZ_KEYS = [
    'qa_basic_quiz_questions',
    'qa_basic_quiz_next_index',
    'qa_basic_quiz_correct_count',
    'qa_basic_quiz_answer_log',
    'qa_basic_quiz_paused',
];

function resetAllData() {
    clearAllProgress();
    QUIZ_KEYS.forEach(key => localStorage.removeItem(key));
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
            item.textContent = '個人制作の非公式QA基礎教材。公式本文・公式問題は収録していません。';
        }
    });
});
