// js/question.js
import { setupCommonNavigation, setupBackToTopButtons, fetchQuestions, setTextWithBreaks } from './utils.js';

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
        const card = document.createElement('article');
        card.className = 'assumed-problem-item';

        const heading = document.createElement('h3');
        heading.textContent = `問題 ${displayIndex + 1}`;
        const meta = document.createElement('p');
        meta.className = 'problem-syllabus-info';
        meta.textContent = [problem.topic, problem.loCode, problem.kLevel].filter(Boolean).join(' ・ ');
        const questionText = document.createElement('p');
        questionText.className = 'question-text';
        setTextWithBreaks(questionText, problem.question);

        const choices = document.createElement('div');
        choices.className = 'choices';
        problem.choices.forEach((choice, index) => {
            const p = document.createElement('p');
            p.className = 'choice-item';
            p.textContent = `${String.fromCharCode(65 + index)}. ${choice}`;
            choices.appendChild(p);
        });

        const toggle = document.createElement('button');
        toggle.className = 'answer-toggle-button';
        toggle.textContent = '解答・解説を表示';
        const feedback = document.createElement('div');
        feedback.className = 'problem-explanation-area hidden';
        const answer = document.createElement('p');
        answer.className = 'correct-answer-text';
        answer.textContent = `正解: ${String.fromCharCode(65 + problem.correctAnswerIndex)}`;
        const explanation = document.createElement('p');
        explanation.className = 'explanation-text';
        setTextWithBreaks(explanation, problem.explanation);
        feedback.append(answer, explanation);
        toggle.addEventListener('click', () => {
            feedback.classList.toggle('hidden');
            toggle.textContent = feedback.classList.contains('hidden') ? '解答・解説を表示' : '解答・解説を隠す';
        });

        card.append(heading, meta, questionText, choices, toggle, feedback);
        list.appendChild(card);
    });
}
