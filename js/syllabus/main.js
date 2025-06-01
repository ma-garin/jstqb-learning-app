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
    const backToWelcomeButton = document.getElementById('back-to-welcome-button');
    const backToWelcomeFromQuizButton = document.getElementById('back-to-welcome-from-quiz-button');
    const backToWelcomeFromResultButton = document.getElementById('back-to-welcome-from-result-button');
    const backFromAssumedProblemsButton = document.getElementById('back-from-assumed-problems-button');
    const navStartQuizButton = document.getElementById('nav-start-quiz-button');
    const navViewSyllabusButton = document.getElementById('nav-view-syllabus-button');
    const navViewAssumedProblemsButton = document.getElementById('nav-view-assumed-problems-button');
    const navBackToWelcomeButton = document.getElementById('nav-back-to-welcome-button');
    const menuIcon = document.getElementById('menu-icon');
    const mainNav = document.getElementById('main-nav');

    // パンくずリスト要素の取得
    const breadcrumbNav = document.getElementById('breadcrumb-nav');

    // シラバス表示要素
    const syllabusNavigation = document.getElementById('syllabus-navigation');
    const syllabusContent = document.getElementById('syllabus-content');

    // 画面表示関数
    const showScreen = (screenToShow) => {
        const screens = [welcomeScreen, quizScreen, resultScreen, syllabusScreen, assumedProblemsScreen];
        screens.forEach(screen => {
            if (screen) { // nullチェックを追加
                screen.classList.add('hidden');
            }
        });
        if (screenToShow) { // nullチェックを追加
            screenToShow.classList.remove('hidden');
        }
        updateBreadcrumb(screenToShow.id);
        if (mainNav) { // ハンバーガーメニューが開いていたら閉じる
            mainNav.classList.add('hidden');
        }
    };

    // パンくずリスト更新関数
    const updateBreadcrumb = (currentScreenId) => {
        if (!breadcrumbNav) return;

        breadcrumbNav.innerHTML = ''; // クリア

        const createBreadcrumbItem = (text, screenId, isActive = false) => {
            const span = document.createElement('span');
            span.classList.add('breadcrumb-item');
            span.textContent = text;
            if (isActive) {
                span.classList.add('active-breadcrumb');
            } else {
                span.addEventListener('click', () => {
                    const targetScreen = document.getElementById(screenId);
                    if (targetScreen) {
                        showScreen(targetScreen);
                    }
                });
            }
            return span;
        };

        breadcrumbNav.appendChild(createBreadcrumbItem('トップ', 'welcome-screen', currentScreenId === 'welcome-screen'));

        if (currentScreenId === 'quiz-screen') {
            const arrow = document.createElement('span');
            arrow.classList.add('breadcrumb-arrow');
            arrow.textContent = ' > ';
            breadcrumbNav.appendChild(arrow);
            breadcrumbNav.appendChild(createBreadcrumbItem('学習を開始する', 'quiz-screen', true));
        } else if (currentScreenId === 'syllabus-screen') {
            const arrow = document.createElement('span');
            arrow.classList.add('breadcrumb-arrow');
            arrow.textContent = ' > ';
            breadcrumbNav.appendChild(arrow);
            breadcrumbNav.appendChild(createBreadcrumbItem('シラバスを見る', 'syllabus-screen', true));
        } else if (currentScreenId === 'assumed-problems-screen') {
            const arrow = document.createElement('span');
            arrow.classList.add('breadcrumb-arrow');
            arrow.textContent = ' > ';
            breadcrumbNav.appendChild(arrow);
            breadcrumbNav.appendChild(createBreadcrumbItem('想定問題を見る', 'assumed-problems-screen', true));
        } else if (currentScreenId === 'result-screen') {
            const arrow1 = document.createElement('span');
            arrow1.classList.add('breadcrumb-arrow');
            arrow1.textContent = ' > ';
            breadcrumbNav.appendChild(arrow1);
            breadcrumbNav.appendChild(createBreadcrumbItem('学習を開始する', 'quiz-screen', false)); // クイズ画面に戻れるように
            const arrow2 = document.createElement('span');
            arrow2.classList.add('breadcrumb-arrow');
            arrow2.textContent = ' > ';
            breadcrumbNav.appendChild(arrow2);
            breadcrumbNav.appendChild(createBreadcrumbItem('学習結果', 'result-screen', true));
        }
    };


    // ボタンのイベントリスナー
    if (startQuizButton) {
        startQuizButton.addEventListener('click', () => showScreen(quizScreen));
    }
    if (viewSyllabusButton) {
        viewSyllabusButton.addEventListener('click', () => {
            showScreen(syllabusScreen);
            renderSyllabus(); // シラバス画面表示時にレンダリング
        });
    }
    if (viewAssumedProblemsButton) {
        viewAssumedProblemsButton.addEventListener('click', () => {
            showScreen(assumedProblemsScreen);
            renderAssumedProblems(); // 想定問題画面表示時にレンダリング
        });
    }

    // ハンバーガーメニューのイベントリスナー
    if (menuIcon) {
        menuIcon.addEventListener('click', () => {
            if (mainNav) {
                mainNav.classList.toggle('hidden');
            }
        });
    }

    // ナビゲーションメニューのボタンイベントリスナー
    if (navStartQuizButton) {
        navStartQuizButton.addEventListener('click', () => showScreen(quizScreen));
    }
    if (navViewSyllabusButton) {
        navViewSyllabusButton.addEventListener('click', () => {
            showScreen(syllabusScreen);
            renderSyllabus(); // シラバス画面表示時にレンダリング
        });
    }
    if (navViewAssumedProblemsButton) {
        navViewAssumedProblemsButton.addEventListener('click', () => {
            showScreen(assumedProblemsScreen);
            renderAssumedProblems(); // 想定問題画面表示時にレンダリング
        });
    }
    if (navBackToWelcomeButton) {
        navBackToWelcomeButton.addEventListener('click', () => showScreen(welcomeScreen));
    }

    // 各画面からの「TOPに戻る」ボタンのイベントリスナー
    const backButtons = [
        backToWelcomeButton,
        backToWelcomeFromQuizButton,
        backToWelcomeFromResultButton,
        backFromAssumedProblemsButton
    ];
    backButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', () => showScreen(welcomeScreen));
        }
    });

    // シラバスのレンダリング関数
    const renderSyllabus = () => {
        if (!syllabusNavigation || !syllabusContent) return;

        syllabusNavigation.innerHTML = ''; // ナビゲーションをクリア
        syllabusContent.innerHTML = ''; // コンテンツをクリア

        allChapters.forEach(chapter => {
            // ナビゲーションに章のタイトルを追加
            const chapterTitleElement = document.createElement('div');
            chapterTitleElement.classList.add('syllabus-chapter-title');
            chapterTitleElement.textContent = `Chapter ${chapter.chapter}: ${chapter.title}`;
            syllabusNavigation.appendChild(chapterTitleElement);

            const sectionList = document.createElement('ul');
            sectionList.classList.add('syllabus-section-list');
            syllabusNavigation.appendChild(sectionList);

            chapter.sections.forEach(section => {
                const sectionItem = document.createElement('li');
                const sectionLink = document.createElement('a');
                sectionLink.href = `#chapter-${chapter.chapter}-section-${section.section.replace(/\./g, '-')}`;
                sectionLink.textContent = `${section.section} ${section.title}`;
                sectionLink.addEventListener('click', (event) => {
                    event.preventDefault(); // デフォルトのアンカーリンクの挙動を無効化
                    // クリックされたセクションに対応するコンテンツまでスクロール
                    const targetElement = document.getElementById(`chapter-${chapter.chapter}-section-${section.section.replace(/\./g, '-')}-content`);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
                sectionItem.appendChild(sectionLink);
                sectionList.appendChild(sectionItem);
            });

            // コンテンツエリアに章と節のコンテンツを追加
            const chapterContentContainer = document.createElement('div');
            chapterContentContainer.classList.add('syllabus-chapter-content-container');
            syllabusContent.appendChild(chapterContentContainer);

            const h3 = document.createElement('h3');
            h3.textContent = `Chapter ${chapter.chapter}: ${chapter.title}`;
            chapterContentContainer.appendChild(h3);

            chapter.sections.forEach(section => {
                const sectionContainer = document.createElement('div');
                sectionContainer.classList.add('syllabus-section-content');
                sectionContainer.id = `chapter-${chapter.chapter}-section-${section.section.replace(/\./g, '-')}-content`;
                chapterContentContainer.appendChild(sectionContainer);

                const h4 = document.createElement('h4');
                h4.textContent = `${section.section} ${section.title}`;
                sectionContainer.appendChild(h4);

                // 学習目標 (Objectives)
                if (section.objectives && section.objectives.length > 0 && section.objectives[0] !== "学習の目的はなし") {
                    const objectivesTitle = document.createElement('h5');
                    objectivesTitle.textContent = '学習目標';
                    sectionContainer.appendChild(objectivesTitle);
                    const objectivesList = document.createElement('ul');
                    section.objectives.forEach(objective => {
                        const li = document.createElement('li');
                        li.textContent = objective;
                        objectivesList.appendChild(li);
                    });
                    sectionContainer.appendChild(objectivesList);
                }

                // 主要用語 (Key Terms)
                if (section.keyTerms && section.keyTerms.length > 0) {
                    const keyTermsTitle = document.createElement('h5');
                    keyTermsTitle.textContent = '主要用語';
                    sectionContainer.appendChild(keyTermsTitle);
                    const keyTermsList = document.createElement('dl');
                    section.keyTerms.forEach(term => {
                        const dt = document.createElement('dt');
                        dt.textContent = term.term;
                        const dd = document.createElement('dd');
                        dd.textContent = term.definition;
                        keyTermsList.appendChild(dt);
                        keyTermsList.appendChild(dd);
                    });
                    sectionContainer.appendChild(keyTermsList);
                }

                // コンテンツ (Content)
                if (section.content && section.content.length > 0) {
                    const contentTitle = document.createElement('h5');
                    contentTitle.textContent = 'コンテンツ';
                    sectionContainer.appendChild(contentTitle);
                    section.content.forEach(paragraph => {
                        const p = document.createElement('p');
                        p.innerHTML = paragraph.replace(/\n/g, '<br>'); // 改行コードを<br>タグに変換
                        sectionContainer.appendChild(p);
                    });
                }
            });
        });
    };

    // 想定問題のレンダリング関数 (仮実装)
    const renderAssumedProblems = () => {
        if (!assumedProblemsScreen) return;
        const assumedProblemsList = document.getElementById('assumed-problems-list');
        if (assumedProblemsList) {
            assumedProblemsList.innerHTML = ''; // リストをクリア

            assumedProblems.forEach((problem, index) => {
                const problemContainer = document.createElement('div');
                problemContainer.classList.add('assumed-problem-item');

                const questionNumber = document.createElement('p');
                questionNumber.classList.add('problem-question-number');
                questionNumber.textContent = `問題 ${index + 1} (ID: ${problem.id})`;
                problemContainer.appendChild(questionNumber);

                const syllabusRef = document.createElement('p');
                syllabusRef.classList.add('problem-syllabus-ref');
                syllabusRef.textContent = `シラバス参照: Chapter ${problem.syllabusChapter}, Section ${problem.syllabusSection} (${problem.syllabusObjective})`;
                problemContainer.appendChild(syllabusRef);

                const questionText = document.createElement('p');
                questionText.classList.add('problem-question-text');
                questionText.innerHTML = problem.question.replace(/\n/g, '<br>'); // 改行を<br>に変換
                problemContainer.appendChild(questionText);

                const choicesContainer = document.createElement('div');
                choicesContainer.classList.add('problem-choices-container');
                problem.choices.forEach((choice, i) => {
                    const choiceLetter = String.fromCharCode(97 + i); // 'a', 'b', 'c', ...
                    const p = document.createElement('p');
                    p.innerHTML = `<span class="choice-letter">${choiceLetter}.</span> ${choice.replace(/\n/g, '<br>')}`;
                    choicesContainer.appendChild(p);
                });
                problemContainer.appendChild(choicesContainer);

                const answerToggle = document.createElement('button');
                answerToggle.classList.add('answer-toggle-button');
                answerToggle.textContent = '解答・解説を表示';
                problemContainer.appendChild(answerToggle);

                const explanationArea = document.createElement('div');
                explanationArea.classList.add('problem-explanation-area', 'hidden'); // 最初は非表示
                explanationArea.innerHTML = `<p class="correct-answer-text">正解: <span class="correct-answer-letter">${problem.correctAnswerLetter.toUpperCase()}</span></p><p class="explanation-text">${problem.explanation.replace(/\n/g, '<br>')}</p>`;
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
    };

    // 初期表示
    showScreen(welcomeScreen);
});