// js/quiz.js
import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';

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
const optionLabels = optionsContainer.querySelectorAll('.option-label');
const optionInputs = optionsContainer.querySelectorAll('input[type="radio"]');
const optionTexts = optionsContainer.querySelectorAll('.option-text');
const submitAnswerButton = document.getElementById('submit-answer-button');
const feedbackContainer = document.getElementById('feedback-container');
const resultMessageElement = document.getElementById('result-message');
const explanationTextElement = document.getElementById('explanation-text');
const nextQuestionButton = document.getElementById('next-question-button');

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();

    // localStorageからクイズの状態を読み込む
    const savedQuestions = localStorage.getItem('quizQuestions');
    const savedIndex = localStorage.getItem('currentQuestionIndex');
    const savedCorrectCount = localStorage.getItem('correctAnswersCount');

    if (savedQuestions && savedIndex !== null && savedCorrectCount !== null) {
        questionsData = JSON.parse(savedQuestions);
        currentQuestionIndex = parseInt(savedIndex, 10);
        correctAnswersCount = parseInt(savedCorrectCount, 10);
        loadQuestion();
    } else {
        // localStorageにデータがない場合（直接quiz.htmlにアクセスした場合など）
        // study.htmlに戻るか、エラーメッセージを表示
        alert('クイズを開始するには「学習を始める」ページから始めてください。');
        window.location.href = 'study.html';
        return;
    }

    // イベントリスナーの設定
    submitAnswerButton.addEventListener('click', submitAnswer);
    nextQuestionButton.addEventListener('click', goToNextQuestion);

    // オプション選択時に「解答する」ボタンを活性化
    optionInputs.forEach(input => {
        input.addEventListener('change', () => {
            submitAnswerButton.disabled = false;
        });
    });
});

/**
 * 現在の問題をロードして表示する
 */
function loadQuestion() {
    if (currentQuestionIndex >= questionsData.length) {
        // 全問終了したら結果画面へ遷移
        window.location.href = 'result.html';
        return;
    }

    const currentQuestion = questionsData[currentQuestionIndex];

    // 各要素をリセット
    questionNumberElement.textContent = currentQuestionIndex + 1;
    totalQuestionsElement.textContent = questionsData.length;
    questionTextElement.innerHTML = currentQuestion.question.replace(/\n/g, '<br>');
    optionInputs.forEach(input => {
        input.checked = false;
        input.disabled = false;
        input.parentElement.classList.remove('correct', 'incorrect');
    });
    feedbackContainer.classList.add('hidden');
    submitAnswerButton.classList.remove('hidden');
    submitAnswerButton.disabled = true; // 解答選択までは無効
    nextQuestionButton.classList.add('hidden');

    // 画像の表示・非表示
    if (currentQuestion.image) {
        questionImageElement.src = currentQuestion.image;
        questionImageContainer.classList.remove('hidden');
    } else {
        questionImageContainer.classList.add('hidden');
        questionImageElement.src = ''; // 画像をクリア
    }

    // 選択肢の表示
    currentQuestion.choices.forEach((choice, index) => {
        const optionLetter = String.fromCharCode(97 + index); // 'a', 'b', 'c', 'd'
        optionInputs[index].value = optionLetter;
        optionTexts[index].innerHTML = choice.replace(/\n/g, '<br>');
    });
}

/**
 * 解答をチェックする
 */
function submitAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');

    if (!selectedOption) {
        alert('解答を選択してください。');
        return;
    }

    const userAnswer = selectedOption.value;
    const currentQuestion = questionsData[currentQuestionIndex];
    const isCorrect = userAnswer === currentQuestion.correctAnswerLetter;

    // フィードバックの表示
    if (isCorrect) {
        resultMessageElement.textContent = '正解です！';
        resultMessageElement.style.color = 'var(--secondary-color)'; // 緑
        correctAnswersCount++;
    } else {
        resultMessageElement.textContent = '不正解です。';
        resultMessageElement.style.color = 'var(--accent-color)'; // 黄
    }
    explanationTextElement.innerHTML = currentQuestion.explanation.replace(/\n/g, '<br>');
    feedbackContainer.classList.remove('hidden');
    submitAnswerButton.classList.add('hidden');
    nextQuestionButton.classList.remove('hidden');

    // 正解・不正解のスタイルを適用
    optionInputs.forEach(input => {
        input.disabled = true; // 解答後は選択肢を無効化
        const label = input.parentElement;
        if (input.value === currentQuestion.correctAnswerLetter) {
            label.classList.add('correct'); // 正解の選択肢
        } else if (input.value === userAnswer) {
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
        // 全問終了したら結果画面へ遷移
        window.location.href = 'result.html';
    }
}