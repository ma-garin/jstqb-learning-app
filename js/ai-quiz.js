// js/ai-quiz.js — AI問題生成ページ

import { setupCommonNavigation, setupBackToTopButtons, setTextWithBreaks } from './utils.js';
import { getApiKey, saveApiKey, clearApiKey, hasApiKey, generateQuestions } from './gemini.js';
import { getExam } from './examContext.js';

let generatedQuestions = [];
let currentIndex = 0;
let correctCount = 0;
let answerLogAI = [];

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    setupEventListeners();
    initPage();
});

function initPage() {
    renderApiKeySection();
    if (hasApiKey()) {
        const masked = maskKey(getApiKey());
        document.getElementById('api-key-display').textContent = masked;
        document.getElementById('api-key-display-gen').textContent = masked;
        showSection('gen-section');
    } else {
        showSection('api-section');
    }
}

function maskKey(key) {
    if (key.length <= 8) return '****';
    return key.slice(0, 4) + '****' + key.slice(-4);
}

function showSection(id) {
    ['api-section', 'gen-section', 'quiz-section', 'result-section'].forEach(s => {
        document.getElementById(s)?.classList.add('hidden');
    });
    document.getElementById(id)?.classList.remove('hidden');
}

function renderApiKeySection() {
    document.getElementById('save-api-key-btn')?.addEventListener('click', () => {
        const input = document.getElementById('api-key-input');
        const key = input?.value?.trim();
        if (!key) { alert('APIキーを入力してください。'); return; }
        saveApiKey(key);
        const masked = maskKey(key);
        document.getElementById('api-key-display').textContent = masked;
        document.getElementById('api-key-display-gen').textContent = masked;
        if (input) input.value = '';
        showSection('gen-section');
    });

    // api-section の削除ボタン
    document.getElementById('clear-api-key-btn')?.addEventListener('click', () => {
        clearApiKey();
        document.getElementById('api-key-display').textContent = '未設定';
        document.getElementById('api-key-display-gen').textContent = '未設定';
    });

    // gen-section の削除ボタン
    document.getElementById('clear-api-key-btn-gen')?.addEventListener('click', () => {
        clearApiKey();
        document.getElementById('api-key-display').textContent = '未設定';
        document.getElementById('api-key-display-gen').textContent = '未設定';
        showSection('api-section');
    });
}

function setupEventListeners() {
    document.getElementById('generate-btn')?.addEventListener('click', handleGenerate);
    document.getElementById('ai-submit-btn')?.addEventListener('click', handleAISubmit);
    document.getElementById('ai-next-btn')?.addEventListener('click', handleAINext);
    document.getElementById('ai-back-btn')?.addEventListener('click', () => showSection('gen-section'));
    // ai-retry-btn (ホームに戻る) は setupBackToTopButtons() が処理するため不要
}

async function handleGenerate() {
    const apiKey = getApiKey();
    if (!apiKey) { alert('Gemini APIキーが設定されていません。'); return; }

    const count = parseInt(document.getElementById('q-count')?.value || '3', 10);
    const topic = document.getElementById('q-topic')?.value || '';
    const kLevel = document.getElementById('q-klevel')?.value || '';

    const loadingEl = document.getElementById('loading-indicator');
    const generateBtn = document.getElementById('generate-btn');
    const errorEl = document.getElementById('error-section');

    loadingEl?.classList.remove('hidden');
    if (generateBtn) generateBtn.disabled = true;
    errorEl?.classList.add('hidden');

    try {
        generatedQuestions = await generateQuestions(apiKey, { count, topic, kLevel, exam: getExam() });
        currentIndex = 0;
        correctCount = 0;
        answerLogAI = [];
        renderQuizQuestion();
        showSection('quiz-section');
    } catch (err) {
        const msgEl = document.getElementById('error-message');
        if (msgEl) msgEl.textContent = err.message;
        errorEl?.classList.remove('hidden');
        console.error('生成エラー:', err);
    } finally {
        loadingEl?.classList.add('hidden');
        if (generateBtn) generateBtn.disabled = false;
    }
}

function renderQuizQuestion() {
    if (currentIndex >= generatedQuestions.length) {
        renderResult();
        showSection('result-section');
        return;
    }

    const q = generatedQuestions[currentIndex];

    // Progress bar
    const pct = Math.round((currentIndex / generatedQuestions.length) * 100);
    const fillEl = document.getElementById('ai-quiz-progress-fill');
    const textEl = document.getElementById('ai-quiz-progress-text');
    if (fillEl) fillEl.style.width = `${pct}%`;
    if (textEl) textEl.textContent = `${currentIndex + 1} / ${generatedQuestions.length}`;

    // Question text (safe DOM API)
    const qEl = document.getElementById('ai-question-text');
    if (qEl) setTextWithBreaks(qEl, q.question);

    // Choices (safe DOM API)
    const labels = document.querySelectorAll('#ai-options-container .option-label');
    const inputs = document.querySelectorAll('#ai-options-container input[type="radio"]');
    const texts = document.querySelectorAll('#ai-options-container .option-text');

    labels.forEach(l => l.classList.remove('correct', 'incorrect'));
    inputs.forEach(i => { i.checked = false; i.disabled = false; });

    q.choices.forEach((choice, idx) => {
        if (texts[idx]) setTextWithBreaks(texts[idx], choice);
    });

    // Reset feedback UI
    document.getElementById('ai-feedback-container')?.classList.add('hidden');
    document.getElementById('ai-submit-btn')?.classList.remove('hidden');
    document.getElementById('ai-next-btn')?.classList.add('hidden');
    document.getElementById('ai-warning')?.classList.add('hidden');
}

function handleAISubmit() {
    const selected = document.querySelector('#ai-options-container input[type="radio"]:checked');
    if (!selected) {
        document.getElementById('ai-warning')?.classList.remove('hidden');
        return;
    }
    document.getElementById('ai-warning')?.classList.add('hidden');

    const q = generatedQuestions[currentIndex];
    const userAnswer = selected.value.toLowerCase();
    const correctAnswer = String(q.correctAnswerLetter || 'a').toLowerCase();
    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) correctCount++;
    answerLogAI.push(isCorrect);

    // Highlight options
    document.querySelectorAll('#ai-options-container input[type="radio"]').forEach(inp => {
        inp.disabled = true;
        const lbl = inp.parentElement;
        const val = inp.value.toLowerCase();
        if (val === correctAnswer) lbl.classList.add('correct');
        else if (val === userAnswer) lbl.classList.add('incorrect');
    });

    // Result message (safe: textContent only)
    const msgEl = document.getElementById('ai-result-message');
    if (msgEl) {
        msgEl.textContent = isCorrect ? '正解です！' : '不正解です。';
        msgEl.style.color = isCorrect ? 'var(--success)' : 'var(--error)';
    }

    // Answer summary (safe: textContent only)
    const summaryEl = document.getElementById('ai-answer-summary');
    if (summaryEl) summaryEl.textContent = `正解: ${correctAnswer.toUpperCase()}`;

    // Explanation (safe DOM API)
    const explEl = document.getElementById('ai-explanation-text');
    if (explEl) setTextWithBreaks(explEl, q.explanation || '');

    document.getElementById('ai-feedback-container')?.classList.remove('hidden');
    document.getElementById('ai-submit-btn')?.classList.add('hidden');
    document.getElementById('ai-next-btn')?.classList.remove('hidden');
}

function handleAINext() {
    currentIndex++;
    renderQuizQuestion();
}

function renderResult() {
    const total = generatedQuestions.length;
    const acc = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    const scoreEl = document.getElementById('ai-result-score');
    const accEl = document.getElementById('ai-result-accuracy');
    if (scoreEl) scoreEl.textContent = `${correctCount} / ${total}`;
    if (accEl) accEl.textContent = `${acc}%`;

    const gradeEl = document.getElementById('ai-result-grade');
    if (gradeEl) {
        if (acc >= 70) { gradeEl.textContent = '合格ライン達成！🎉'; gradeEl.style.color = 'var(--success)'; }
        else if (acc >= 50) { gradeEl.textContent = 'あと少し！💪'; gradeEl.style.color = 'var(--warning)'; }
        else { gradeEl.textContent = 'もう一度挑戦しましょう 📖'; gradeEl.style.color = 'var(--error)'; }
    }

    document.getElementById('ai-result-retry-btn')?.addEventListener('click', () => {
        showSection('gen-section');
    }, { once: true });
}
