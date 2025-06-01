// js/question.js
import { setupCommonNavigation, setupBackToTopButtons, fetchQuestions } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    loadAssumedProblems();
});

async function loadAssumedProblems() {
    const assumedProblemsList = document.getElementById('assumed-problems-list');
    assumedProblemsList.innerHTML = ''; // クリア

    const problems = await fetchQuestions(); // utils.jsから問題をフェッチ

    if (problems.length === 0) {
        assumedProblemsList.innerHTML = '<p>問題の読み込みに失敗しました。</p>';
        return;
    }

    problems.forEach(problem => {
        const problemDiv = document.createElement('div');
        problemDiv.classList.add('assumed-problem-item');
        problemDiv.innerHTML = `
            <h3>問題 ${problem.id}</h3>
            <p class="problem-syllabus-info">シラバス: ${problem.syllabusChapter}章 ${problem.syllabusSection}</p>
            <p class="question-text">${problem.question.replace(/\n/g, '<br>')}</p>
            <div class="choices">
                ${problem.choices.map((choice, index) => {
                    const optionLetter = String.fromCharCode(97 + index); // 'a', 'b', 'c', 'd'
                    return `<p class="choice-item">${optionLetter}. ${choice.replace(/\n/g, '<br>')}</p>`;
                }).join('')}
            </div>
            <button class="show-answer-button" data-problem-id="${problem.id}">解答を表示</button>
            <div class="answer-feedback hidden" id="feedback-${problem.id}">
                <p><strong>正解: ${problem.correctAnswerLetter.toUpperCase()}</strong></p>
                <p><strong>解説:</strong><br>${problem.explanation.replace(/\n/g, '<br>')}</p>
            </div>
        `;
        assumedProblemsList.appendChild(problemDiv);
    });

    // 解答表示ボタンのイベントリスナー設定
    document.querySelectorAll('.show-answer-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const problemId = event.target.dataset.problemId;
            const feedbackDiv = document.getElementById(`feedback-${problemId}`);
            feedbackDiv.classList.toggle('hidden');
            if (feedbackDiv.classList.contains('hidden')) {
                event.target.textContent = '解答を表示';
            } else {
                event.target.textContent = '解答を隠す';
            }
        });
    });
}