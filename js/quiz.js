// js/quiz.js
import { setupCommonNavigation, setupBackToTopButtons } from './utils.js'; // showScreenのインポートを削除

let questionsData = [];
let currentQuestionIndex = 0;
let correctAnswersCount = 0;

// DOM要素の取得
const questionNumberElement = document.getElementById('question-number');
const totalQuestionsElement = document.getElementById('total-questions');
const questionTextElement = document.getElementById('question-text');
const questionImageContainer = document.getElementById('question-image-container');
const questionImageElement = document.getElementById('question-image');
const optionsContainer = document.getElementById('options-container');
const optionLabels = optionsContainer ? optionsContainer.querySelectorAll('.option-label') : [];
const optionInputs = optionsContainer ? optionsContainer.querySelectorAll('input[type="radio"]') : [];
const optionTexts = optionsContainer ? optionsContainer.querySelectorAll('.option-text') : [];
const submitAnswerButton = document.getElementById('submit-answer-button');
const answerWarningElement = document.getElementById('answer-warning');
const feedbackContainer = document.getElementById('feedback-container');
const resultMessageElement = document.getElementById('result-message');
const answerSummaryElement = document.getElementById('answer-summary');
const explanationTextElement = document.getElementById('explanation-text');
const nextQuestionButton = document.getElementById('next-question-button');
const backToWelcomeFromQuizButton = document.getElementById('back-to-welcome-from-quiz-button');

function normalizeAnswerLetter(answer) {
    return String(answer || '').trim().toLowerCase();
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getAnswerText(answerLetter) {
    const answerIndex = normalizeAnswerLetter(answerLetter).charCodeAt(0) - 97;
    const currentQuestion = questionsData[currentQuestionIndex];
    if (!currentQuestion || answerIndex < 0 || answerIndex >= currentQuestion.choices.length) {
        return '';
    }
    return currentQuestion.choices[answerIndex].replace(/^[a-dA-D][).]\s*/, '');
}

function formatAnswerLabel(answerLetter) {
    const normalizedAnswer = normalizeAnswerLetter(answerLetter);
    const answerText = getAnswerText(normalizedAnswer);
    return answerText ? `${normalizedAnswer.toUpperCase()}. ${answerText}` : normalizedAnswer.toUpperCase();
}

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();

    // localStorageからクイズの状態を読み込む
    const savedQuestions = localStorage.getItem('quizQuestions');
    const savedIndex = localStorage.getItem('currentQuestionIndex');
    const savedCorrectCount = localStorage.getItem('correctAnswersCount');

    if (savedQuestions) {
        questionsData = JSON.parse(savedQuestions);
        currentQuestionIndex = parseInt(savedIndex || '0', 10);
        correctAnswersCount = parseInt(savedCorrectCount || '0', 10);
    } else {
        // 問題データがない場合はエラーハンドリングするか、デフォルトの動作を定義
        console.error("クイズ問題データがLocalStorageにありません。学習開始画面に戻ります。");
        window.location.href = 'study.html'; // 学習開始画面に戻る
        return;
    }

    // イベントリスナーを再設定（DOMが再描画される可能性があるため）
    if (submitAnswerButton) {
        submitAnswerButton.removeEventListener('click', submitAnswer); // 重複登録防止
        submitAnswerButton.addEventListener('click', submitAnswer);
    }
    if (nextQuestionButton) {
        nextQuestionButton.removeEventListener('click', goToNextQuestion); // 重複登録防止
        nextQuestionButton.addEventListener('click', goToNextQuestion);
    }
    if (backToWelcomeFromQuizButton) {
        backToWelcomeFromQuizButton.removeEventListener('click', () => {
            window.location.href = 'index.html'; // TOP画面に戻る
        });
        backToWelcomeFromQuizButton.addEventListener('click', () => {
            window.location.href = 'index.html'; // TOP画面に戻る
        });
    }

    loadQuestion();
    console.log("Quiz Screen Initialized.");
});

/**
 * 現在の問題をロードして表示する
 */
function loadQuestion() {
    // 既存のフィードバックをリセット
    feedbackContainer.classList.add('hidden');
    submitAnswerButton.classList.remove('hidden');
    nextQuestionButton.classList.add('hidden');

    // 選択肢のスタイルをリセット
    optionLabels.forEach(label => {
        label.classList.remove('correct', 'incorrect');
    });
    optionInputs.forEach(input => {
        input.checked = false; // 選択をクリア
        input.disabled = false; // 有効化
    });
    if (answerWarningElement) {
        answerWarningElement.classList.add('hidden');
    }
    if (answerSummaryElement) {
        answerSummaryElement.textContent = '';
    }

    if (currentQuestionIndex >= questionsData.length) {
        // 全問終了したら結果画面へ
        window.location.href = 'result.html'; // 結果画面へ遷移
        return;
    }

    const currentQuestion = questionsData[currentQuestionIndex];

    // 問題番号と総問題数を更新
    questionNumberElement.textContent = (currentQuestionIndex + 1).toString();
    totalQuestionsElement.textContent = questionsData.length.toString();

    // 問題文と画像を更新
    questionTextElement.innerHTML = currentQuestion.question.replace(/\\n/g, '<br>');
    if (currentQuestion.image) {
        questionImageElement.src = currentQuestion.image;
        questionImageContainer.classList.remove('hidden');
    } else {
        questionImageContainer.classList.add('hidden');
        questionImageElement.src = ''; // 画像をクリア
    }

    // 選択肢を更新
    currentQuestion.choices.forEach((choice, index) => {
        if (optionTexts[index]) {
            optionTexts[index].innerHTML = choice.replace(/\\n/g, '<br>');
        }
    });
}

/**
 * 解答を送信する
 */
function submitAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) {
        if (answerWarningElement) {
            answerWarningElement.classList.remove('hidden');
        }
        return;
    }

    if (answerWarningElement) {
        answerWarningElement.classList.add('hidden');
    }

    const userAnswer = normalizeAnswerLetter(selectedOption.value);
    const currentQuestion = questionsData[currentQuestionIndex];
    const correctAnswer = normalizeAnswerLetter(currentQuestion.correctAnswerLetter);
    const isCorrect = userAnswer === correctAnswer;

    // フィードバックの表示
    resultMessageElement.textContent = isCorrect ? '正解です！' : '不正解です。';
    resultMessageElement.style.color = isCorrect ? 'var(--secondary-color)' : 'var(--accent-color)';
    if (isCorrect) {
        correctAnswersCount++;
    }
    if (answerSummaryElement) {
        answerSummaryElement.innerHTML = `
            <strong>あなたの選択:</strong> ${escapeHtml(formatAnswerLabel(userAnswer))}<br>
            <strong>正解:</strong> ${escapeHtml(formatAnswerLabel(correctAnswer))}
        `;
    }
    explanationTextElement.innerHTML = currentQuestion.explanation.replace(/\\n/g, '<br>');
    feedbackContainer.classList.remove('hidden');
    submitAnswerButton.classList.add('hidden');
    nextQuestionButton.classList.remove('hidden');

    // 正解・不正解のスタイルを適用
    optionInputs.forEach(input => {
        input.disabled = true; // 解答後は選択肢を無効化
        const label = input.parentElement;
        if (normalizeAnswerLetter(input.value) === correctAnswer) {
            label.classList.add('correct'); // 正解の選択肢
        } else if (normalizeAnswerLetter(input.value) === userAnswer) {
            label.classList.add('incorrect'); // ユーザーが選んだ不正解の選択肢
        }
    });

    // localStorageに現在の状態を保存
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex.toString());
    localStorage.setItem('correctAnswersCount', correctAnswersCount.toString());
}

/**
 * 次の問題へ進む、または結果画面へ遷移する
 */
function goToNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questionsData.length) {
        loadQuestion();
    } else {
        // 全問終了したら結果画面へ
        window.location.href = 'result.html'; // 結果画面へ遷移
    }
}
