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
// import { assumedProblems } from './assumedProblemsData.js'; // この行を削除またはコメントアウト
import { setupCommonNavigation, setupBackToTopButtons, fetchQuestions } from './utils.js'; // fetchQuestionsをインポートに追加


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
    const backToWelcomeButton = document.getElementById('back-to-welcome-button'); // シラバス画面からのTOPに戻るボタン
    const backFromAssumedProblemsButton = document.getElementById('back-from-assumed-problems-button'); // 想定問題画面からのTOPに戻るボタン

    // パンくずリスト要素の取得
    const breadcrumbNav = document.getElementById('breadcrumb-nav');

    // 共通ナビゲーションのセットアップ
    setupCommonNavigation();
    setupBackToTopButtons(); // TOPに戻るボタンのイベントリスナーを設定

    // 各画面表示関数
    const showScreen = (screenToShow) => {
        const screens = [welcomeScreen, quizScreen, resultScreen, syllabusScreen, assumedProblemsScreen];
        screens.forEach(screen => {
            if (screen) { // screenが存在するか確認
                screen.classList.add('hidden');
            }
        });
        if (screenToShow) { // screenToShowが存在するか確認
            screenToShow.classList.remove('hidden');
        }
        updateBreadcrumbs(screenToShow.id); // パンくずリストを更新
    };

    // パンくずリストの更新
    const updateBreadcrumbs = (activeScreenId) => {
        breadcrumbNav.innerHTML = ''; // クリア

        const breadcrumbs = [
            { id: 'welcome-screen', text: 'トップ' },
            { id: 'quiz-screen', text: 'クイズ', parent: 'welcome-screen' },
            { id: 'result-screen', text: '結果', parent: 'quiz-screen' },
            { id: 'syllabus-screen', text: 'シラバス', parent: 'welcome-screen' },
            { id: 'assumed-problems-screen', text: '想定問題', parent: 'welcome-screen' }
        ];

        let currentPath = [];
        let currentScreen = breadcrumbs.find(b => b.id === activeScreenId);

        while (currentScreen) {
            currentPath.unshift(currentScreen);
            currentScreen = breadcrumbs.find(b => b.id === currentScreen.parent);
        }

        currentPath.forEach((item, index) => {
            const span = document.createElement('span');
            span.classList.add('breadcrumb-item');
            span.textContent = item.text;
            span.dataset.screenId = item.id;

            if (item.id === activeScreenId) {
                span.classList.add('active-breadcrumb');
                span.style.cursor = 'default';
            } else {
                span.addEventListener('click', () => {
                    const targetScreen = document.getElementById(item.id);
                    if (targetScreen) {
                        showScreen(targetScreen);
                    }
                });
            }
            breadcrumbNav.appendChild(span);
            if (index < currentPath.length - 1) {
                const separator = document.createElement('span');
                separator.classList.add('breadcrumb-separator');
                separator.textContent = ' > ';
                breadcrumbNav.appendChild(separator);
            }
        });
    };


    // ウェルカムスクリーン関連
    if (startQuizButton) {
        startQuizButton.addEventListener('click', () => showScreen(quizScreen));
    }
    if (viewSyllabusButton) {
        viewSyllabusButton.addEventListener('click', () => {
            showScreen(syllabusScreen);
            renderSyllabus(); // シラバスコンテンツをレンダリング
        });
    }
    if (viewAssumedProblemsButton) {
        viewAssumedProblemsButton.addEventListener('click', () => {
            showScreen(assumedProblemsScreen);
            renderAssumedProblems(); // 想定問題をレンダリング
        });
    }

    // クイズスクリーン関連 (このファイルでは画面遷移のみ)
    if (backToWelcomeFromQuizButton) {
        backToWelcomeFromQuizButton.addEventListener('click', () => showScreen(welcomeScreen));
    }

    // 結果スクリーン関連 (このファイルでは画面遷移のみ)
    if (restartQuizButton) {
        restartQuizButton.addEventListener('click', () => showScreen(quizScreen)); // クイズをリスタート
    }
    if (backToWelcomeFromResultButton) {
        backToWelcomeFromResultButton.addEventListener('click', () => showScreen(welcomeScreen));
    }

    // シラバススクリーン関連 (このファイルでは画面遷移のみ)
    if (backToWelcomeButton) {
        backToWelcomeButton.addEventListener('click', () => showScreen(welcomeScreen));
    }

    // 想定問題スクリーン関連 (このファイルでは画面遷移のみ)
    if (backFromAssumedProblemsButton) {
        backFromAssumedProblemsButton.addEventListener('click', () => showScreen(welcomeScreen));
    }


    // シラバスコンテンツのレンダリング
    const renderSyllabus = () => {
        const syllabusNavigation = document.getElementById('syllabus-navigation');
        const syllabusContent = document.getElementById('syllabus-content');
        if (!syllabusNavigation || !syllabusContent) return;

        syllabusNavigation.innerHTML = '';
        syllabusContent.innerHTML = '';

        allChapters.forEach(chapterData => {
            const chapterButton = document.createElement('button');
            chapterButton.classList.add('syllabus-chapter-button');
            chapterButton.textContent = `第${chapterData.chapter}章 ${chapterData.title.split(' - ')[0]}`; // タイトルから時間表記を削除
            chapterButton.dataset.chapter = chapterData.chapter;
            syllabusNavigation.appendChild(chapterButton);

            chapterButton.addEventListener('click', () => {
                // すべてのアクティブクラスを解除
                document.querySelectorAll('.syllabus-chapter-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                // クリックされたボタンにアクティブクラスを追加
                chapterButton.classList.add('active');
                displayChapterContent(chapterData);
            });
        });

        // デフォルトで最初の章を表示
        if (allChapters.length > 0) {
            document.querySelector('.syllabus-chapter-button').click();
        }
    };

    const displayChapterContent = (chapterData) => {
        const syllabusContent = document.getElementById('syllabus-content');
        syllabusContent.innerHTML = `<h2>第${chapterData.chapter}章 ${chapterData.title}</h2>`;

        chapterData.sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.classList.add('syllabus-section');
            sectionDiv.innerHTML += `<h3>${section.section} ${section.title}</h3>`;

            if (section.objectives && section.objectives.length > 0) {
                sectionDiv.innerHTML += `<h4>学習目標:</h4><ul>${section.objectives.map(obj => `<li>${obj}</li>`).join('')}</ul>`;
            }

            if (section.keyTerms && section.keyTerms.length > 0) {
                sectionDiv.innerHTML += `<h4>キーワード:</h4><ul>${section.keyTerms.map(term => `<li><strong>${term.term}</strong>: ${term.definition}</li>`).join('')}</ul>`;
            }

            if (section.content && section.content.length > 0) {
                section.content.forEach(paragraph => {
                    sectionDiv.innerHTML += `<p>${paragraph.replace(/\\n/g, '<br>')}</p>`;
                });
            }
            syllabusContent.appendChild(sectionDiv);
        });
    };

    // 想定問題のレンダリング
    const renderAssumedProblems = async () => { // async を追加
        const assumedProblemsList = document.getElementById('assumed-problems-list');
        if (!assumedProblemsList) return;

        assumedProblemsList.innerHTML = ''; // Clear previous content

        // assumedProblems を fetchQuestions から取得するように変更
        const problems = await fetchQuestions(); // utils.jsから問題をフェッチ

        if (problems.length === 0) {
            assumedProblemsList.innerHTML = '<p>問題の読み込みに失敗しました。</p>';
            return;
        }

        problems.forEach(problem => {
            const problemContainer = document.createElement('div');
            problemContainer.classList.add('assumed-problem-item');
            problemContainer.innerHTML = `
                <h3>問題 ${problem.id}</h3>
                <p class="problem-syllabus-info">シラバス: ${problem.syllabusChapter}章 ${problem.syllabusSection}</p>
                <p class="question-text">${problem.question.replace(/\\n/g, '<br>')}</p>
            `;

            const choicesContainer = document.createElement('div');
            choicesContainer.classList.add('choices');
            problem.choices.forEach((choice, index) => {
                const choiceLetter = String.fromCharCode(97 + index); // 'a', 'b', 'c', 'd'
                const p = document.createElement('p');
                p.classList.add('choice-item');
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
    };

    // 初期表示
    showScreen(welcomeScreen);
});