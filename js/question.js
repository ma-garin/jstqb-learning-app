// js/question.js
import { setupCommonNavigation, setupBackToTopButtons, fetchQuestions } from './utils.js';
import { createQuestionCard } from './questionCard.js';

export function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', async () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    await loadQuestions();
});

async function loadQuestions() {
    const list = document.getElementById('assumed-problems-list');
    if (!list) return;
    list.textContent = '';
    const questions = await fetchQuestions();
    if (!questions.length) {
        list.textContent = '問題の読み込みに失敗しました。';
        return;
    }

    questions.forEach((problem, displayIndex) => {
        list.appendChild(createQuestionCard(problem, { displayIndex }));
    });
}
