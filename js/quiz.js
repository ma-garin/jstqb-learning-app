// js/quiz.js
import { setupCommonNavigation, setupBackToTopButtons, setTextWithBreaks } from './utils.js';
import { addWrongQuestion, removeCorrectQuestion, recordAnswer } from './progress.js';
import {
    answerIndex,
    formatLabel,
    pauseQuizSession,
    readQuizSession,
    saveQuizProgress,
} from './quizEngine.js';

export {
    normalize,
    getAnswerText,
    answerIndex,
    formatLabel,
    getQuizSessionKeys,
    readQuizSession,
    saveQuizProgress,
    pauseQuizSession,
} from './quizEngine.js';

let questionsData = [];
let currentQuestionIndex = 0;
let correctAnswersCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();

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
    const session = readQuizSession();
    if (!session) {
        console.error('クイズデータが見つかりません。学習開始画面に戻ります。');
        window.location.href = 'study.html';
        return;
    }

    questionsData = session.questions;
    currentQuestionIndex = session.nextIndex;
    correctAnswersCount = session.correctCount;

    submitBtn?.addEventListener('click', submitAnswer);
    nextBtn?.addEventListener('click', goToNext);

    // 中断ボタン（ヘッダーの戻るボタンと「中断して保存」テキスト）
    const pauseHandler = () => {
        pauseQuizSession();
        window.location.href = 'study.html';
    };
    document.getElementById('quiz-pause-btn')?.addEventListener('click', pauseHandler);
    document.getElementById('quiz-pause-label-btn')?.addEventListener('click', pauseHandler);

    loadQuestion();

    function loadQuestion() {
        feedbackContainer?.classList.add('hidden');
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

        const pct = Math.round((currentQuestionIndex / questionsData.length) * 100);
        if (progressFill) progressFill.style.width = `${pct}%`;
        if (questionNumberEl) questionNumberEl.textContent = String(currentQuestionIndex + 1);
        if (totalQuestionsEl) totalQuestionsEl.textContent = String(questionsData.length);

        if (questionTextEl) setTextWithBreaks(questionTextEl, q.question);

        if (q.image) {
            if (questionImageEl) questionImageEl.src = q.image;
            questionImageContainer?.classList.remove('hidden');
        } else {
            questionImageContainer?.classList.add('hidden');
            if (questionImageEl) questionImageEl.src = '';
        }

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
        const userAnswer = answerIndex(selected.value);
        const correctAnswer = q.correctAnswerIndex;
        const isCorrect = userAnswer === correctAnswer;

        if (isCorrect) correctAnswersCount++;

        if (resultMessageEl) {
            resultMessageEl.textContent = isCorrect ? '正解です！' : '不正解です。';
            resultMessageEl.style.color = isCorrect ? 'var(--success)' : 'var(--error)';
        }

        if (answerSummaryEl) {
            answerSummaryEl.textContent = '';
            const lines = [
                { label: 'あなたの選択: ', value: formatLabel(String.fromCharCode(97 + userAnswer), q) },
                { label: '正解: ', value: formatLabel(String.fromCharCode(97 + correctAnswer), q) },
            ];
            lines.forEach((line, i) => {
                const strong = document.createElement('strong');
                strong.textContent = line.label;
                answerSummaryEl.appendChild(strong);
                answerSummaryEl.appendChild(document.createTextNode(line.value));
                if (i < lines.length - 1) answerSummaryEl.appendChild(document.createElement('br'));
            });
        }

        if (explanationEl) setTextWithBreaks(explanationEl, q.explanation);

        feedbackContainer?.classList.remove('hidden');
        submitBtn?.classList.add('hidden');
        nextBtn?.classList.remove('hidden');

        optionInputs.forEach(inp => {
            inp.disabled = true;
            const lbl = inp.parentElement;
            const val = answerIndex(inp.value);
            if (val === correctAnswer) lbl.classList.add('correct');
            else if (val === userAnswer) lbl.classList.add('incorrect');
        });

        const qId = q.id;
        if (isCorrect) {
            removeCorrectQuestion(qId);
        } else {
            addWrongQuestion(qId);
        }

        // Record answer immediately (prevents data loss on abandonment)
        recordAnswer(isCorrect, qId);

        // Save next-to-show index so reload cannot re-answer this question
        saveQuizProgress(currentQuestionIndex + 1, correctAnswersCount);
    }

    function goToNext() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questionsData.length) {
            loadQuestion();
        } else {
            window.location.href = 'result.html';
        }
    }
});
