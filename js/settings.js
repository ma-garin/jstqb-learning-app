// js/settings.js
import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';
import { getDashboardStats, getWrongQuestionIds } from './progress.js';
import { getExam } from './examContext.js';

const GEMINI_KEY = 'jstqb_gemini_key';

function progressKeys(exam) {
    return [
        `jstqb_${exam}_progress_today`,
        `jstqb_${exam}_streak`,
        `jstqb_${exam}_last_date`,
        `jstqb_${exam}_total_answered`,
        `jstqb_${exam}_wrong_questions`,
        `jstqb_${exam}_answered_ids`,
    ];
}

function resetAllData() {
    ['alta', 'altm'].forEach(exam => {
        progressKeys(exam).forEach(k => localStorage.removeItem(k));
    });
    ['quizQuestions', 'quizNextIndex', 'currentQuestionIndex',
     'correctAnswersCount', 'quizAnswerLog', 'quizPaused'].forEach(k => localStorage.removeItem(k));
}

function resetWrongOnly() {
    ['alta', 'altm'].forEach(exam => {
        localStorage.removeItem(`jstqb_${exam}_wrong_questions`);
    });
}

function renderStats() {
    const el = document.getElementById('stats-summary');
    if (!el) return;
    const exam = getExam();
    const { todayAnswered, todayCorrect, streak, totalAnswered } = getDashboardStats();
    const wrong = getWrongQuestionIds().length;
    el.textContent = `今日：${todayAnswered}問 / 正解${todayCorrect}問 ・ 累計：${totalAnswered}問 ・ 苦手：${wrong}問 ・ 連続${streak}日`;
}

function showStatus(msg, isError = false) {
    const el = document.getElementById('gemini-key-status');
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? 'var(--error,#DC2626)' : 'var(--success,#16A34A)';
    setTimeout(() => { el.textContent = ''; }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    renderStats();

    // — 苦手リセット —
    document.getElementById('reset-wrong-btn')?.addEventListener('click', () => {
        const wrong = getWrongQuestionIds().length;
        if (wrong === 0) { alert('苦手問題リストは空です。'); return; }
        if (!confirm(`苦手問題リスト（${wrong}問）をリセットしますか？`)) return;
        resetWrongOnly();
        renderStats();
        alert('苦手問題リストをリセットしました。');
    });

    // — 全データリセット —
    document.getElementById('reset-all-btn')?.addEventListener('click', () => {
        if (!confirm('すべての学習データ（進捗・連続日数・苦手問題・累計回答）をリセットします。\nこの操作は元に戻せません。よろしいですか？')) return;
        resetAllData();
        renderStats();
        alert('学習データをリセットしました。');
    });

    // — Gemini APIキー —
    const keyInput = document.getElementById('gemini-key-input');
    const saved = localStorage.getItem(GEMINI_KEY);
    if (saved && keyInput) keyInput.value = saved;

    document.getElementById('gemini-key-toggle')?.addEventListener('click', () => {
        if (!keyInput) return;
        const isPassword = keyInput.type === 'password';
        keyInput.type = isPassword ? 'text' : 'password';
        const icon = document.getElementById('gemini-key-toggle-icon');
        if (icon) icon.textContent = isPassword ? 'visibility_off' : 'visibility';
    });

    document.getElementById('gemini-key-save-btn')?.addEventListener('click', () => {
        const val = keyInput?.value.trim();
        if (!val) { showStatus('キーを入力してください。', true); return; }
        localStorage.setItem(GEMINI_KEY, val);
        showStatus('APIキーを保存しました。');
    });

    document.getElementById('gemini-key-delete-btn')?.addEventListener('click', () => {
        if (!confirm('Gemini APIキーを削除しますか？')) return;
        localStorage.removeItem(GEMINI_KEY);
        if (keyInput) keyInput.value = '';
        showStatus('APIキーを削除しました。');
    });
});
