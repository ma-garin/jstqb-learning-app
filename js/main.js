// js/main.js

// 各章のデータをインポート
import chapter0 from './syllabus/chapter0.js';
import chapter1 from './syllabus/chapter1.js';
import chapter2 from './syllabus/chapter2.js';
import chapter3 from './syllabus/chapter3.js';
import chapter4 from './syllabus/chapter4.js';
import chapter5 from './syllabus/chapter5.js';
import chapter6 from './syllabus/chapter6.js';
import chapter7 from './syllabus/chapter7.js';
import chapter8 from './syllabus/chapter8.js';


// assumedProblemsData.js も将来的にここでインポートする可能性あり
import { assumedProblems } from './assumedProblemsData.js'; // これを追加または確認
// import { assumedProblems } from './assumedProblemsData.js'; // assumedProblemsData.js がエクスポートされる前提

// 全ての章のデータを配列にまとめる
const allChapters = [
    chapter0,
    chapter1,
    chapter2,
    chapter3,
    chapter4,
    chapter5,
    chapter6,
    chapter7,
    chapter8
];

document.addEventListener('DOMContentLoaded', () => {
    // 画面要素の取得
    const welcomeScreen = document.getElementById('welcome-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    const syllabusScreen = document.getElementById('syllabus-screen');
    const assumedProblemsScreen = document.getElementById('assumed-problems-screen');

    // ボタン要素の取得
    const startQuizButton = document.getElementById('start-quiz-button');
    const viewSyllabusButton = document.getElementById('view-syllabus-button');
    const viewAssumedProblemsButton = document.getElementById('view-assumed-problems-button');
    const backToWelcomeFromQuizButton = document.getElementById('back-to-welcome-from-quiz-button');
    const restartQuizButton = document.getElementById('restart-quiz-button');
    const backToWelcomeFromResultButton = document.getElementById('back-to-welcome-from-result-button');
    const backToWelcomeButton = document.getElementById('back-to-welcome-button'); // シラバス画面用
    const backFromAssumedProblemsButton = document.getElementById('back-from-assumed-problems-button'); // 想定問題画面用

    // ナビゲーションメニューのボタン
    const navStartQuizButton = document.getElementById('nav-start-quiz-button');
    const navViewSyllabusButton = document.getElementById('nav-view-syllabus-button');
    const navViewAssumedProblemsButton = document.getElementById('nav-view-assumed-problems-button');
    const navBackToWelcomeButton = document.getElementById('nav-back-to-welcome-button');
    const menuIcon = document.getElementById('menu-icon');
    const mainNav = document.getElementById('main-nav');

    // クイズ関連要素 (メイン画面で直接クイズを実行する場合に使用)
    const questionNumberElement = document.getElementById('question-number');
    const totalQuestionsElement = document.getElementById('total-questions');
    const questionTextElement = document.getElementById('question-text');
    const questionImageContainer = document.getElementById('question-image-container');
    const questionImageElement = document.getElementById('question-image');
    const optionsContainer = document.getElementById('options-container');
    const submitAnswerButton = document.getElementById('submit-answer-button');
    const feedbackContainer = document.getElementById('feedback-container');
    const resultMessageElement = document.getElementById('result-message');
    const explanationTextElement = document.getElementById('explanation-text');
    const nextQuestionButton = document.getElementById('next-question-button');

    // 結果画面の要素
    const correctAnswersCountElement = document.getElementById('correct-answers-count');
    const totalQuestionsCountElement = document.getElementById('total-questions-count');

    // シラバス画面の要素
    const syllabusNavigation = document.getElementById('syllabus-navigation');
    const syllabusContent = document.getElementById('syllabus-content');

    // 想定問題画面の要素
    const assumedProblemsList = document.getElementById('assumed-problems-list');


    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let correctAnswersCount = 0;

    // 画面表示を制御する関数
    function showScreen(screenToShow) {
        const screens = [welcomeScreen, quizScreen, resultScreen, syllabusScreen, assumedProblemsScreen];
        screens.forEach(screen => {
            if (screen) { // screenが存在するかチェック
                screen.classList.add('hidden');
            }
        });
        if (screenToShow) { // screenToShowが存在するかチェック
            screenToShow.classList.remove('hidden');
        }
        updateBreadcrumbs(screenToShow.id);
    }

    // パンくずリストの更新
    function updateBreadcrumbs(activeScreenId) {
        const breadcrumbNav = document.getElementById('breadcrumb-nav');
        if (!breadcrumbNav) return;

        const breadcrumbItems = breadcrumbNav.querySelectorAll('.breadcrumb-item');
        breadcrumbItems.forEach(item => {
            item.classList.remove('active-breadcrumb');
            item.classList.remove('inactive-breadcrumb'); // 以前のinactiveクラスをクリア

            if (item.dataset.screenId === activeScreenId) {
                item.classList.add('active-breadcrumb');
            } else {
                item.classList.add('inactive-breadcrumb');
            }
        });

        // 存在しないパンくず項目を作成して追加
        const screenMap = {
            'welcome-screen': 'トップ',
            'learning-start-screen': '学習開始', // study.html
            'quiz-screen': 'クイズ',
            'result-screen': '結果',
            'syllabus-screen': 'シラバス',
            'assumed-problems-screen': '想定問題'
        };

        const currentPath = [];
        let foundActive = false;
        for (const id in screenMap) {
            currentPath.push({ id: id, name: screenMap[id] });
            if (id === activeScreenId) {
                foundActive = true;
                break;
            }
        }

        breadcrumbNav.innerHTML = ''; // 一度クリア
        currentPath.forEach((pathItem, index) => {
            const span = document.createElement('span');
            span.classList.add('breadcrumb-item');
            span.dataset.screenId = pathItem.id;
            span.textContent = pathItem.name;

            if (pathItem.id === activeScreenId) {
                span.classList.add('active-breadcrumb');
            } else {
                span.classList.add('inactive-breadcrumb');
                span.addEventListener('click', () => {
                    // パンくずリストからの遷移ロジック
                    let targetPage = '';
                    switch(pathItem.id) {
                        case 'welcome-screen': targetPage = 'index.html'; break;
                        case 'learning-start-screen': targetPage = 'study.html'; break;
                        case 'quiz-screen': targetPage = 'quiz.html'; break;
                        case 'result-screen': targetPage = 'result.html'; break;
                        case 'syllabus-screen': targetPage = 'syllabus.html'; break;
                        case 'assumed-problems-screen': targetPage = 'question.html'; break;
                    }
                    if (targetPage) {
                        window.location.href = targetPage;
                    }
                });
            }
            breadcrumbNav.appendChild(span);
            if (index < currentPath.length - 1 && pathItem.id !== activeScreenId) {
                const separator = document.createElement('span');
                separator.classList.add('breadcrumb-separator');
                separator.textContent = ' > ';
                breadcrumbNav.appendChild(separator);
            }
        });
    }


    // ハンバーガーメニューの開閉
    if (menuIcon && mainNav) {
        menuIcon.addEventListener('click', () => {
            mainNav.classList.toggle('hidden');
        });
    }

    // ナビゲーションボタンのイベントリスナー（ページ遷移）
    if (navStartQuizButton) {
        navStartQuizButton.addEventListener('click', () => {
            window.location.href = 'study.html'; // 学習開始ページへ
        });
    }
    if (navViewSyllabusButton) {
        navViewSyllabusButton.addEventListener('click', () => {
            window.location.href = 'syllabus.html'; // シラバスページへ
        });
    }
    if (navViewAssumedProblemsButton) {
        navViewAssumedProblemsButton.addEventListener('click', () => {
            window.location.href = 'question.html'; // 想定問題ページへ
        });
    }
    if (navBackToWelcomeButton) {
        navBackToWelcomeButton.addEventListener('click', () => {
            window.location.href = 'index.html'; // TOPページへ
        });
    }

    // ウェルカム画面のボタン
    if (startQuizButton) {
        startQuizButton.addEventListener('click', () => {
            window.location.href = 'study.html'; // 学習開始ページへ
        });
    }
    if (viewSyllabusButton) {
        viewSyllabusButton.addEventListener('click', () => {
            window.location.href = 'syllabus.html'; // シラバスページへ
        });
    }
    if (viewAssumedProblemsButton) {
        viewAssumedProblemsButton.addEventListener('click', () => {
            window.location.href = 'question.html'; // 想定問題ページへ
        });
    }

    // 各画面の「TOPに戻る」ボタン
    if (backToWelcomeFromQuizButton) {
        backToWelcomeFromQuizButton.addEventListener('click', () => showScreen(welcomeScreen));
    }
    if (backToWelcomeFromResultButton) {
        backToWelcomeFromResultButton.addEventListener('click', () => showScreen(welcomeScreen));
    }
    if (backToWelcomeButton) { // シラバス画面のTOPに戻るボタン
        backToWelcomeButton.addEventListener('click', () => showScreen(welcomeScreen));
    }
    if (backFromAssumedProblemsButton) { // 想定問題画面のTOPに戻るボタン
        backFromAssumedProblemsButton.addEventListener('click', () => showScreen(welcomeScreen));
    }


    // シラバス表示ロジック
    function loadSyllabusContent() {
        if (!syllabusNavigation || !syllabusContent) return;

        syllabusNavigation.innerHTML = '';
        syllabusContent.innerHTML = '';

        allChapters.forEach(chapterData => {
            const chapterTitleButton = document.createElement('button');
            chapterTitleButton.classList.add('syllabus-chapter-button');
            chapterTitleButton.textContent = `${chapterData.chapter}章 ${chapterData.title.split(' - ')[0]}`; // 時間表記を削除
            chapterTitleButton.addEventListener('click', () => {
                displayChapterContent(chapterData);
                // アクティブな章ボタンのスタイルを更新
                syllabusNavigation.querySelectorAll('.syllabus-chapter-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                chapterTitleButton.classList.add('active');
            });
            syllabusNavigation.appendChild(chapterTitleButton);
        });

        // デフォルトで最初の章を表示
        if (allChapters.length > 0) {
            displayChapterContent(allChapters[0]);
            syllabusNavigation.querySelector('.syllabus-chapter-button').classList.add('active');
        }
    }

    function displayChapterContent(chapterData) {
        if (!syllabusContent) return;

        syllabusContent.innerHTML = `<h2>${chapterData.chapter}章 ${chapterData.title}</h2>`;

        chapterData.sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.classList.add('syllabus-section');
            sectionDiv.innerHTML = `<h3>${section.section} ${section.title}</h3>`;

            if (section.objectives && section.objectives.length > 0) {
                const objectivesList = document.createElement('ul');
                objectivesList.innerHTML = '<strong>学習目標:</strong>';
                section.objectives.forEach(obj => {
                    const listItem = document.createElement('li');
                    listItem.textContent = obj;
                    objectivesList.appendChild(listItem);
                });
                sectionDiv.appendChild(objectivesList);
            }

            if (section.keyTerms && section.keyTerms.length > 0) {
                const keyTermsList = document.createElement('ul');
                keyTermsList.innerHTML = '<strong>キーワード:</strong>';
                section.keyTerms.forEach(term => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<strong>${term.term}</strong>: ${term.definition}`;
                    keyTermsList.appendChild(listItem);
                });
                sectionDiv.appendChild(keyTermsList);
            }

            if (section.content && section.content.length > 0) {
                section.content.forEach(paragraph => {
                    const p = document.createElement('p');
                    p.innerHTML = paragraph.replace(/\\n/g, '<br>'); // 改行コードを<br>に変換
                    sectionDiv.appendChild(p);
                });
            }
            syllabusContent.appendChild(sectionDiv);
        });
    }

    // 想定問題の表示ロジック
    function loadAssumedProblems() {
        if (!assumedProblemsList) return;

        assumedProblemsList.innerHTML = ''; // リストをクリア

        if (assumedProblems.length === 0) {
            assumedProblemsList.innerHTML = '<p>問題の読み込みに失敗しました。</p>';
            return;
        }

        assumedProblems.forEach(problem => {
            const problemContainer = document.createElement('div');
            problemContainer.classList.add('assumed-problem-item');

            const problemHeader = document.createElement('h3');
            problemHeader.textContent = `問題 ${problem.id}`;
            problemContainer.appendChild(problemHeader);

            const syllabusInfo = document.createElement('p');
            syllabusInfo.classList.add('problem-syllabus-info');
            syllabusInfo.textContent = `シラバス: ${problem.syllabusChapter}章 ${problem.syllabusSection}`;
            problemContainer.appendChild(syllabusInfo);

            const questionText = document.createElement('p');
            questionText.classList.add('question-text');
            questionText.innerHTML = problem.question.replace(/\\n/g, '<br>');
            problemContainer.appendChild(questionText);

            const choicesContainer = document.createElement('div');
            choicesContainer.classList.add('choices');
            problem.choices.forEach((choice, index) => {
                const p = document.createElement('p');
                p.classList.add('choice-item');
                const choiceLetter = String.fromCharCode(97 + index); // 'a', 'b', 'c', 'd'
                p.innerHTML = `<span class="choice-letter">${choiceLetter}.</span> ${choice.replace(/\\n/g, '<br>')}`;
                choicesContainer.appendChild(p);
            });
            problemContainer.appendChild(choicesContainer);

            const answerToggle = document.createElement('button');
            answerToggle.classList.add('answer-toggle-button');
            answerToggle.textContent = '解答・解説を表示';
            problemContainer.appendChild(answerToggle);

            const explanationArea = document.createElement('div');
            explanationArea.classList.add('problem-explanation-area', 'hidden'); // 最初は非表示
            explanationArea.innerHTML = `<p class="correct-answer-text">正解: <span class="correct-answer-letter">${problem.correctAnswerLetter.toUpperCase()}</span></p><p class="explanation-text">${problem.explanation.replace(/\\n/g, '<br>')}</p>`;
            problemContainer.appendChild(explanationArea);

            answerToggle.addEventListener('click', () => {
                explanationArea.classList.toggle('hidden');
                if (explanationArea.classList.contains('hidden')) {
                    answerToggle.textContent = '解答・解説を表示';
                } else {
                    answerToggle.textContent = '解答・解説を隠す';
                }
            });

            assumedProblemsList.appendChild(problemContainer);
        });
    }

    // 初期表示
    showScreen(welcomeScreen);
});