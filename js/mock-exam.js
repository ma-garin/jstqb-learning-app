// js/mock-exam.js - 自作問題による10分間の復習チャレンジ

import { setupCommonNavigation, setupBackToTopButtons, fetchQuestions } from './utils.js';
import { getCertById, getSelectedCert } from './certifications.js';

const CHALLENGE_DURATION = 10 * 60;
let challengeQuestions = [];
let currentIndex = 0;
let userAnswers = [];
let timerInterval = null;
let remainingSeconds = CHALLENGE_DURATION;
let elapsedSeconds = 0;
let challengeStarted = false;
let challengeFinished = false;

document.addEventListener('DOMContentLoaded', async () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    const questions = await fetchQuestions();
    challengeQuestions = questions.slice(0, Math.min(10, questions.length));
    userAnswers = new Array(challengeQuestions.length).fill(null);
    rewriteStaticLabels();
    buildNavGrid();

    document.getElementById('start-btn')?.addEventListener('click', startChallenge);
    document.getElementById('exam-prev-btn')?.addEventListener('click', () => navigateTo(currentIndex - 1));
    document.getElementById('exam-next-btn')?.addEventListener('click', () => navigateTo(currentIndex + 1));
    document.getElementById('exam-submit-btn')?.addEventListener('click', confirmSubmit);
    document.getElementById('retry-btn')?.addEventListener('click', resetChallenge);
    document.getElementById('header-back-btn')?.addEventListener('click', handleBack);
});

function rewriteStaticLabels() {
    const certName = getCertById(getSelectedCert()).name;
    const header = document.querySelector('.header-title');
    document.title = `${certName} 10分復習チャレンジ - JSTQB-Study`;
    if (header) header.textContent = `${certName} 10分復習チャレンジ`;
    const start = document.getElementById('start-screen');
    if (start) {
        const title = start.querySelector('div p[style*="font-weight:700"]');
        if (title) title.textContent = `${certName} 10分復習チャレンジ`;
        const subtitle = title?.nextElementSibling;
        if (subtitle) subtitle.textContent = `${certName}の制作者による独自問題のみを使用`;
        const values = start.querySelectorAll('.exam-table td:last-child');
        const texts = [`${challengeQuestions.length}問`, '10分', '合否判定なし', '4択の自作問題', '可（後から見直せます）'];
        values.forEach((cell, index) => { if (texts[index]) cell.textContent = texts[index]; });
        const button = document.getElementById('start-btn');
        if (button) button.lastChild.textContent = ' チャレンジを開始する';
    }
    const display = document.getElementById('timer-display');
    if (display) display.textContent = '10:00';
}

function handleBack(event) {
    if (challengeStarted && !challengeFinished && !confirm('復習チャレンジを中断してホームに戻りますか？')) {
        event.preventDefault();
    }
}

function startChallenge() {
    if (!challengeQuestions.length) {
        alert('問題データを読み込めませんでした。');
        return;
    }
    challengeStarted = true;
    showSection('exam-screen');
    renderQuestion(0);
    timerInterval = setInterval(() => {
        remainingSeconds -= 1;
        elapsedSeconds += 1;
        updateTimerDisplay();
        if (remainingSeconds <= 0) finishChallenge(true);
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const display = document.getElementById('timer-display');
    if (display) display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const timer = document.getElementById('exam-timer');
    timer?.classList.toggle('danger', remainingSeconds <= 60);
    timer?.classList.toggle('warning', remainingSeconds > 60 && remainingSeconds <= 180);
}

function buildNavGrid() {
    const grid = document.getElementById('exam-nav-grid');
    if (!grid) return;
    grid.textContent = '';
    challengeQuestions.forEach((_, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'exam-nav-btn';
        button.textContent = index + 1;
        button.addEventListener('click', () => navigateTo(index));
        grid.appendChild(button);
    });
}

function updateNavGrid() {
    document.querySelectorAll('#exam-nav-grid .exam-nav-btn').forEach((button, index) => {
        button.classList.toggle('answered', userAnswers[index] !== null);
        button.classList.toggle('current', index === currentIndex);
    });
}

function navigateTo(index) {
    if (index >= 0 && index < challengeQuestions.length) renderQuestion(index);
}

function renderQuestion(index) {
    currentIndex = index;
    const question = challengeQuestions[index];
    const answered = userAnswers.filter(answer => answer !== null).length;
    const fill = document.getElementById('exam-progress-fill');
    if (fill) fill.style.width = `${Math.round((answered / challengeQuestions.length) * 100)}%`;
    const progress = document.getElementById('exam-progress-text');
    if (progress) progress.textContent = `${index + 1} / ${challengeQuestions.length}`;

    const meta = document.getElementById('exam-question-meta');
    if (meta) meta.textContent = [question.topic, question.kLevel, `第${index + 1}問`].filter(Boolean).join(' ・ ');
    const body = document.getElementById('exam-question-body');
    if (body) body.textContent = question.question;
    const choices = document.getElementById('exam-choices');
    if (choices) {
        choices.textContent = '';
        question.choices.forEach((choice, choiceIndex) => {
            const label = document.createElement('label');
            label.className = 'exam-choice-label';
            label.classList.toggle('selected', userAnswers[index] === choiceIndex);
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'exam-answer';
            radio.value = String(choiceIndex);
            radio.checked = userAnswers[index] === choiceIndex;
            radio.addEventListener('change', () => selectAnswer(choiceIndex));
            const text = document.createElement('span');
            text.className = 'exam-choice-text';
            text.textContent = choice;
            label.append(radio, text);
            choices.appendChild(label);
        });
    }
    const prev = document.getElementById('exam-prev-btn');
    if (prev) prev.disabled = index === 0;
    const next = document.getElementById('exam-next-btn');
    if (next) next.style.display = index === challengeQuestions.length - 1 ? 'none' : '';
    updateHint();
    updateNavGrid();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectAnswer(index) {
    userAnswers[currentIndex] = index;
    renderQuestion(currentIndex);
}

function updateHint() {
    const unanswered = userAnswers.filter(answer => answer === null).length;
    const hint = document.getElementById('unanswered-hint');
    if (hint) hint.textContent = unanswered ? `未回答：${unanswered}問` : 'すべて回答しました';
}

function confirmSubmit() {
    const unanswered = userAnswers.filter(answer => answer === null).length;
    const message = unanswered ? `未回答が${unanswered}問あります。このまま結果を確認しますか？` : '結果を確認しますか？';
    if (confirm(message)) finishChallenge(false);
}

function finishChallenge(timeUp) {
    challengeFinished = true;
    clearInterval(timerInterval);
    if (timeUp) alert('10分経過しました。結果を確認します。');
    renderResult();
    showSection('result-screen');
}

function renderResult() {
    const correct = challengeQuestions.reduce((count, question, index) =>
        count + (userAnswers[index] === question.correctAnswerIndex ? 1 : 0), 0);
    const accuracy = Math.round((correct / challengeQuestions.length) * 100);
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };
    setText('result-score', `${correct}/${challengeQuestions.length}`);
    setText('result-accuracy', `${accuracy}%`);
    setText('result-grade', accuracy >= 70 ? '基礎をよく確認できています。' : '解説を読み、迷ったテーマを復習しましょう。');
    setText('result-time', `所要時間：${Math.floor(elapsedSeconds / 60)}分${elapsedSeconds % 60}秒`);

    const summary = document.getElementById('chapter-summary');
    if (summary) summary.textContent = 'この結果は資格試験の合否や到達度を示すものではありません。';
    const review = document.getElementById('result-review');
    if (!review) return;
    review.textContent = '';
    challengeQuestions.forEach((question, index) => {
        const card = document.createElement('article');
        card.className = 'exam-result-card';
        const heading = document.createElement('h4');
        heading.textContent = `第${index + 1}問 ${userAnswers[index] === question.correctAnswerIndex ? '正解' : '要復習'}`;
        const body = document.createElement('p');
        body.textContent = question.question;
        const answer = document.createElement('p');
        answer.textContent = `正解: ${String.fromCharCode(65 + question.correctAnswerIndex)}. ${question.choices[question.correctAnswerIndex]}`;
        const explanation = document.createElement('p');
        explanation.className = 'exam-explanation';
        explanation.textContent = question.explanation;
        card.append(heading, body, answer, explanation);
        review.appendChild(card);
    });
}

function resetChallenge() {
    currentIndex = 0;
    userAnswers = new Array(challengeQuestions.length).fill(null);
    remainingSeconds = CHALLENGE_DURATION;
    elapsedSeconds = 0;
    challengeStarted = false;
    challengeFinished = false;
    clearInterval(timerInterval);
    updateTimerDisplay();
    buildNavGrid();
    showSection('start-screen');
    window.scrollTo({ top: 0 });
}

function showSection(id) {
    ['start-screen', 'exam-screen', 'result-screen'].forEach(section => {
        document.getElementById(section)?.classList.toggle('hidden', section !== id);
    });
}
