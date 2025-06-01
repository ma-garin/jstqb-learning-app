// js/question.js
import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';
import { assumedProblems } from './assumedProblemsData.js'; // assumedProblemsData.js から問題をインポート

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    loadAssumedProblems();
});

/**
 * 想定問題データをロードして表示する
 */
function loadAssumedProblems() {
    const assumedProblemsList = document.getElementById('assumed-problems-list');
    if (!assumedProblemsList) {
        console.error("Error: #assumed-problems-list element not found.");
        return;
    }
    assumedProblemsList.innerHTML = ''; // クリア

    if (!assumedProblems || assumedProblems.length === 0) {
        assumedProblemsList.innerHTML = '<p>問題の読み込みに失敗しました。</p>';
        return;
    }

    assumedProblems.forEach(problem => {
        const problemDiv = document.createElement('div');
        problemDiv.classList.add('assumed-problem-item');
        problemDiv.innerHTML = `
            <h3>問題 ${problem.id}</h3>
            <p class="problem-syllabus-info">シラバス: ${problem.syllabusChapter}章 ${problem.syllabusSection}</p>
            <p class="question-text">${problem.question.replace(/\\n/g, '<br>')}</p>
            <div class="choices">
                ${problem.choices.map((choice, index) => {
                    const optionLetter = String.fromCharCode(97 + index); // 'a', 'b', 'c', 'd'
                    return `<p class="choice-item"><span class="choice-letter">${optionLetter}.</span> ${choice.replace(/\\n/g, '<br>')}</p>`;
                }).join('')}
            </div>
            <button class="answer-toggle-button" data-problem-id="${problem.id}">解答・解説を表示</button>
            <div class="problem-explanation-area hidden" id="feedback-${problem.id}">
                <p class="correct-answer-text">正解: <span class="correct-answer-letter">${problem.correctAnswerLetter.toUpperCase()}</span></p>
                <p class="explanation-text">解説:<br>${problem.explanation.replace(/\\n/g, '<br>')}</p>
            </div>
        `;
        assumedProblemsList.appendChild(problemDiv);
    });

    // 解答表示ボタンのイベントリスナー設定
    document.querySelectorAll('.answer-toggle-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const problemId = event.target.dataset.problemId;
            const feedbackDiv = document.getElementById(`feedback-${problemId}`);
            if (feedbackDiv) {
                feedbackDiv.classList.toggle('hidden');
                if (feedbackDiv.classList.contains('hidden')) {
                    event.target.textContent = '解答・解説を表示';
                } else {
                    event.target.textContent = '解答・解説を隠す';
                }
            }
        });
    });

    console.log("Assumed Problems Screen Initialized.");
}
