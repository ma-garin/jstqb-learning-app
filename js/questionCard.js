import { setTextWithBreaks } from './utils.js';

export function createQuestionCard(question, options = {}) {
    const card = document.createElement('article');
    card.className = 'assumed-problem-item';

    const heading = document.createElement('h3');
    heading.textContent = options.headingText || `問題 ${Number(options.displayIndex ?? 0) + 1}`;

    const meta = document.createElement('p');
    meta.className = 'problem-syllabus-info';
    meta.textContent = [question.topic, question.loCode, question.kLevel].filter(Boolean).join(' ・ ');

    const questionText = document.createElement('p');
    questionText.className = 'question-text';
    setTextWithBreaks(questionText, question.question);

    const choices = document.createElement('div');
    choices.className = 'choices';
    question.choices.forEach((choice, index) => {
        const choiceText = document.createElement('p');
        choiceText.className = 'choice-item';
        choiceText.textContent = `${String.fromCharCode(65 + index)}. ${choice}`;
        choices.appendChild(choiceText);
    });

    const toggle = document.createElement('button');
    toggle.className = 'answer-toggle-button';
    toggle.textContent = '解答・解説を表示';

    const feedback = document.createElement('div');
    feedback.className = 'problem-explanation-area hidden';
    const answer = document.createElement('p');
    answer.className = 'correct-answer-text';
    answer.textContent = `正解: ${String.fromCharCode(65 + question.correctAnswerIndex)}`;
    const explanation = document.createElement('p');
    explanation.className = 'explanation-text';
    setTextWithBreaks(explanation, question.explanation);
    feedback.append(answer, explanation);

    toggle.addEventListener('click', () => {
        feedback.classList.toggle('hidden');
        toggle.textContent = feedback.classList.contains('hidden') ? '解答・解説を表示' : '解答・解説を隠す';
    });

    card.append(heading, meta, questionText, choices, toggle, feedback);
    return card;
}
