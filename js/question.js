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
    await loadAssumedProblems();
});

async function loadAssumedProblems() {
    const list = document.getElementById('assumed-problems-list');
    if (!list) return;
    list.innerHTML = '';

    const assumedProblems = await fetchQuestions();

    if (!assumedProblems || assumedProblems.length === 0) {
        list.innerHTML = '<p>問題の読み込みに失敗しました。</p>';
        return;
    }

    assumedProblems.forEach(problem => {
        const div = document.createElement('div');
        div.classList.add('assumed-problem-item');

        const h3 = document.createElement('h3');
        h3.textContent = `問題 ${problem.id}`;

        const syllabusInfo = document.createElement('p');
        syllabusInfo.className = 'problem-syllabus-info';
        syllabusInfo.textContent = `シラバス: ${problem.syllabusChapter}章 ${problem.syllabusSection}`;

        const questionText = document.createElement('p');
        questionText.className = 'question-text';
        setTextWithBreaks(questionText, problem.question);

        const choicesDiv = document.createElement('div');
        choicesDiv.className = 'choices';
        problem.choices.forEach((choice, index) => {
            const p = document.createElement('p');
            p.className = 'choice-item';
            const letter = String.fromCharCode(97 + index);
            const letterSpan = document.createElement('span');
            letterSpan.className = 'choice-letter';
            letterSpan.textContent = `${letter}.`;
            const textSpan = document.createElement('span');
            setTextWithBreaks(textSpan, choice);
            p.appendChild(letterSpan);
            p.appendChild(document.createTextNode(' '));
            p.appendChild(textSpan);
            choicesDiv.appendChild(p);
        });

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'answer-toggle-button';
        toggleBtn.dataset.problemId = problem.id;
        toggleBtn.textContent = '解答・解説を表示';

        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'problem-explanation-area hidden';
        feedbackDiv.id = `feedback-${problem.id}`;

        const correctP = document.createElement('p');
        correctP.className = 'correct-answer-text';
        const correctLabel = document.createTextNode('正解: ');
        const correctSpan = document.createElement('span');
        correctSpan.className = 'correct-answer-letter';
        correctSpan.textContent = problem.correctAnswerLetter.toUpperCase();
        correctP.appendChild(correctLabel);
        correctP.appendChild(correctSpan);

        const explP = document.createElement('p');
        explP.className = 'explanation-text';
        const explLabel = document.createElement('strong');
        explLabel.textContent = '解説:';
        const explTextSpan = document.createElement('span');
        setTextWithBreaks(explTextSpan, problem.explanation);
        explP.appendChild(explLabel);
        explP.appendChild(document.createElement('br'));
        explP.appendChild(explTextSpan);

        feedbackDiv.appendChild(correctP);
        feedbackDiv.appendChild(explP);

        div.appendChild(h3);
        div.appendChild(syllabusInfo);
        div.appendChild(questionText);
        div.appendChild(choicesDiv);
        div.appendChild(toggleBtn);
        div.appendChild(feedbackDiv);
        list.appendChild(div);
    });

    list.querySelectorAll('.answer-toggle-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const fd = document.getElementById(`feedback-${btn.dataset.problemId}`);
            if (!fd) return;
            fd.classList.toggle('hidden');
            btn.textContent = fd.classList.contains('hidden') ? '解答・解説を表示' : '解答・解説を隠す';
        });
    });
}
