// js/quiz.js
import { showScreen } from './main.js'; // main.js から showScreen をインポート

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
const feedbackContainer = document.getElementById('feedback-container');
const resultMessageElement = document.getElementById('result-message');
const explanationTextElement = document.getElementById('explanation-text');
const nextQuestionButton = document.getElementById('next-question-button');
const backToWelcomeFromQuizButton = document.getElementById('back-to-welcome-from-quiz-button');


export function initQuizScreen() {
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
        console.error("クイズ問題データがLocalStorageにありません。");
        // 必要に応じてTOP画面に戻るなどの処理
        showScreen('welcome-screen');
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
        backToWelcomeFromQuizButton.removeEventListener('click', () => showScreen('welcome-screen'));
        backToWelcomeFromQuizButton.addEventListener('click', () => showScreen('welcome-screen'));
    }

    loadQuestion();
    console.log("Quiz Screen Initialized.");
}

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

    if (currentQuestionIndex >= questionsData.length) {
        // 全問終了したら結果画面へ
        showScreen('result-screen');
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
        // 解答が選択されていない場合
        alert('解答を選択してください。'); // カスタムモーダルに置き換える
        return;
    }

    const userAnswer = selectedOption.value;
    const currentQuestion = questionsData[currentQuestionIndex];
    const isCorrect = userAnswer === currentQuestion.correctAnswerLetter;

    // フィードバックの表示
    resultMessageElement.textContent = isCorrect ? '正解です！' : '不正解です。';
    resultMessageElement.style.color = isCorrect ? 'var(--secondary-color)' : 'var(--accent-color)';
    if (isCorrect) {
        correctAnswersCount++;
    }
    explanationTextElement.innerHTML = currentQuestion.explanation.replace(/\\n/g, '<br>');
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
        // 全問終了したら結果画面へ
        showScreen('result-screen');
    }
}