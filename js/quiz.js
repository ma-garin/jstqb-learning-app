// js/quiz.js
import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';
import { addWrongQuestion, removeCorrectQuestion } from './progress.js';

let questionsData = [];
let currentQuestionIndex = 0;
let correctAnswersCount = 0;

const questionNumberEl = document.getElementById('question-number');
const totalQuestionsEl = document.getElementById('total-questions');
const questionTextEl = document.getElementById('question-text');
const questionImageContainer = document.getElementById('question-image-container');
const questionImageEl = document.getElementById('question-image');
const optionsContainer = document.getElementById('options-container');
const optionLabels = optionsContainer ? [...optionsContainer.querySelectorAll('.option-label')] : [];
const optionInputs = optionsContainer ? [...optionsContainer.querySelectorAll('input[type="radio"]')] : [];
const optionTexts = optionsContainer ? [...optionsContainer.querySelectorAll('.option-text')] : [];
const submitBtn = document.getElementById('submit-answer-button');
const answerWarningEl = document.getElementById('answer-warning');
const feedbackContainer = document.getElementById('feedback-container');
const resultMessageEl = document.getElementById('result-message');
const answerSummaryEl = document.getElementById('answer-summary');
const explanationEl = document.getElementById('explanation-text');
const nextBtn = document.getElementById('next-question-button');
const progressFill = document.getElementById('quiz-progress-fill');

function normalize(answer) {
    return String(answer || '').trim().toLowerCase();
}

// テキストと改行コードを安全にセット（innerHTML を使わない）
function setTextWithBreaks(el, text) {
    el.textContent = '';
    String(text).split(/\\n/).forEach((line, i, arr) => {
        el.appendChild(document.createTextNode(line));
        if (i < arr.length - 1) el.appendChild(document.createElement('br'));
    });
}

function getAnswerText(letter) {
    const idx = normalize(letter).charCodeAt(0) - 97;
    const q = questionsData[currentQuestionIndex];
    if (!q || idx < 0 || idx >= q.choices.length) return '';
    return q.choices[idx].replace(/^[a-dA-D][).]\s*/, '');
}

function formatLabel(letter) {
    const n = normalize(letter);
    const text = getAnswerText(n);
    return text ? `${n.toUpperCase()}. ${text}` : n.toUpperCase();
}

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();

    const saved = localStorage.getItem('quizQuestions');
    if (!saved) {
        console.error('クイズデータが見つかりません。学習開始画面に戻ります。');
        window.location.href = 'study.html';
        return;
    }

    questionsData = JSON.parse(saved);
    currentQuestionIndex = parseInt(localStorage.getItem('currentQuestionIndex') || '0', 10);
    correctAnswersCount = parseInt(localStorage.getItem('correctAnswersCount') || '0', 10);

    submitBtn?.addEventListener('click', submitAnswer);
    nextBtn?.addEventListener('click', goToNext);

    loadQuestion();
});

function loadQuestion() {
    feedbackContainer.classList.add('hidden');
    submitBtn?.classList.remove('hidden');
    nextBtn?.classList.add('hidden');

    optionLabels.forEach(l => l.classList.remove('correct', 'incorrect'));
    optionInputs.forEach(i => { i.checked = false; i.disabled = false; });
    answerWarningEl?.classList.add('hidden');
    if (answerSummaryEl) answerSummaryEl.textContent = '';

    if (currentQuestionIndex >= questionsData.length) {
        window.location.href = 'result.html';
        return;
    }

    const q = questionsData[currentQuestionIndex];

    // 進捗バー
    const pct = Math.round((currentQuestionIndex / questionsData.length) * 100);
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (questionNumberEl) questionNumberEl.textContent = String(currentQuestionIndex + 1);
    if (totalQuestionsEl) totalQuestionsEl.textContent = String(questionsData.length);

    // 問題文（安全なDOM API）
    setTextWithBreaks(questionTextEl, q.question);

    // 画像
    if (q.image) {
        questionImageEl.src = q.image;
        questionImageContainer?.classList.remove('hidden');
    } else {
        questionImageContainer?.classList.add('hidden');
        if (questionImageEl) questionImageEl.src = '';
    }

    // 選択肢（安全なDOM API）
    q.choices.forEach((choice, i) => {
        if (optionTexts[i]) setTextWithBreaks(optionTexts[i], choice);
    });
}

function submitAnswer() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
        answerWarningEl?.classList.remove('hidden');
        return;
    }
    answerWarningEl?.classList.add('hidden');

    const q = questionsData[currentQuestionIndex];
    const userAnswer = normalize(selected.value);
    const correctAnswer = normalize(q.correctAnswerLetter);
    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) correctAnswersCount++;

    // 結果メッセージ
    if (resultMessageEl) {
        resultMessageEl.textContent = isCorrect ? '正解です！' : '不正解です。';
        resultMessageEl.style.color = isCorrect ? 'var(--success)' : 'var(--error)';
    }

    // 解答サマリー（安全なDOM API）
    if (answerSummaryEl) {
        answerSummaryEl.textContent = '';
        const lines = [
            { label: 'あなたの選択: ', value: formatLabel(userAnswer) },
            { label: '正解: ', value: formatLabel(correctAnswer) },
        ];
        lines.forEach((line, i) => {
            const strong = document.createElement('strong');
            strong.textContent = line.label;
            answerSummaryEl.appendChild(strong);
            answerSummaryEl.appendChild(document.createTextNode(line.value));
            if (i < lines.length - 1) answerSummaryEl.appendChild(document.createElement('br'));
        });
    }

    // 解説（安全なDOM API）
    if (explanationEl) setTextWithBreaks(explanationEl, q.explanation);

    feedbackContainer.classList.remove('hidden');
    submitBtn?.classList.add('hidden');
    nextBtn?.classList.remove('hidden');

    // 選択肢ハイライト
    optionInputs.forEach(inp => {
        inp.disabled = true;
        const lbl = inp.parentElement;
        const val = normalize(inp.value);
        if (val === correctAnswer) lbl.classList.add('correct');
        else if (val === userAnswer) lbl.classList.add('incorrect');
    });

    // 苦手問題の記録
    const qId = q.id;
    if (isCorrect) {
        removeCorrectQuestion(qId);
    } else {
        addWrongQuestion(qId);
    }

    // localStorageへ保存
    localStorage.setItem('currentQuestionIndex', String(currentQuestionIndex));
    localStorage.setItem('correctAnswersCount', String(correctAnswersCount));
    const log = JSON.parse(localStorage.getItem('quizAnswerLog') || '[]');
    log.push(isCorrect);
    localStorage.setItem('quizAnswerLog', JSON.stringify(log));
}

function goToNext() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questionsData.length) {
        loadQuestion();
    } else {
        window.location.href = 'result.html';
    }
}
