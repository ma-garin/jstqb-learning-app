document.addEventListener('DOMContentLoaded', async () => {
    // 画面要素の取得
    const appContainer = document.getElementById('app-container');
    const welcomeScreen = document.getElementById('welcome-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    const syllabusScreen = document.getElementById('syllabus-screen');
    const assumedProblemsScreen = document.getElementById('assumed-problems-screen');

    // ボタン要素 (メイン画面)
    const startQuizButton = document.getElementById('start-quiz-button');
    const viewSyllabusButton = document.getElementById('view-syllabus-button');
    const viewAssumedProblemsButton = document.getElementById('view-assumed-problems-button');

    // ハンバーガーメニュー関連
    const menuIcon = document.getElementById('menu-icon');
    const mainNav = document.getElementById('main-nav');
    const navStartQuizButton = document.getElementById('nav-start-quiz-button');
    const navViewSyllabusButton = document.getElementById('nav-view-syllabus-button');
    const navViewAssumedProblemsButton = document.getElementById('nav-view-assumed-problems-button');
    const navBackToWelcomeButton = document.getElementById('nav-back-to-welcome-button');

    // パンくずリスト関連
    const breadcrumbNav = document.getElementById('breadcrumb-nav');

    // クイズ画面の要素
    const questionNumberElement = document.getElementById('question-number');
    const questionTextElement = document.getElementById('question-text');
    const choicesContainer = document.getElementById('choices-container');
    const submitAnswerButton = document.getElementById('submit-answer-button');
    const feedbackContainer = document.getElementById('feedback-container');
    const resultMessageElement = document.getElementById('result-message');
    const explanationTextElement = document.getElementById('explanation-text');
    const nextQuestionButton = document.getElementById('next-question-button');
    const correctAnswersCountElement = document.getElementById('correct-answers-count');
    const totalQuestionsCountElement = document.getElementById('total-questions-count');
    const restartQuizButton = document.getElementById('restart-quiz-button');

    // シラバス画面の要素
    const syllabusNavigation = document.getElementById('syllabus-navigation');
    const syllabusContent = document.getElementById('syllabus-content');

    // 想定問題画面の要素
    const assumedProblemsList = document.getElementById('assumed-problems-list');

    // 各画面からのTOPに戻るボタン (共通クラス名も持つ)
    const backToWelcomeButton = document.getElementById('back-to-welcome-button'); // シラバス画面から
    const backFromAssumedProblemsButton = document.getElementById('back-from-assumed-problems-button'); // 想定問題画面から
    const backToWelcomeFromQuizButton = document.getElementById('back-to-welcome-from-quiz-button'); // クイズ画面から
    const backToWelcomeFromResultButton = document.getElementById('back-to-welcome-from-result-button'); // 結果画面から

    let questionsData = []; // クイズ問題データ
    let currentQuestionIndex = 0;
    let correctAnswersCount = 0;
    let selectedChoice = null;
    let syllabusChapters = []; // シラバスデータ (複数のチャプターを格納)
    let assumedProblemsData = []; // 想定問題データ

    // ===============================================
    // 画面切り替え関数
    // ===============================================
    function showScreen(screenToShow) {
        console.log(`[App] Showing screen: ${screenToShow.id}`); // ログ追加
        const screens = [welcomeScreen, quizScreen, resultScreen, syllabusScreen, assumedProblemsScreen];
        screens.forEach(screen => {
            if (screen === screenToShow) {
                screen.classList.remove('hidden');
                screen.classList.add('active');
            } else {
                screen.classList.add('hidden');
                screen.classList.remove('active');
            }
        });
        if (!mainNav.classList.contains('hidden')) {
            mainNav.classList.add('hidden');
        }
        updateBreadcrumb(screenToShow.id);
    }

    // ===============================================
    // パンくずリスト関連
    // ===============================================
    function updateBreadcrumb(currentScreenId) {
        console.log(`[Breadcrumb] Updating for screen: ${currentScreenId}`); // ログ追加
        breadcrumbNav.innerHTML = `<span class="breadcrumb-item" data-screen-id="welcome-screen">トップ</span>`;
        if (currentScreenId !== 'welcome-screen') {
            const currentScreenName = {
                'quiz-screen': '学習',
                'result-screen': '学習結果',
                'syllabus-screen': 'シラバス',
                'assumed-problems-screen': '想定問題'
            }[currentScreenId];
            breadcrumbNav.innerHTML += `
                <span class="breadcrumb-separator"> > </span>
                <span class="breadcrumb-item active-breadcrumb" data-screen-id="${currentScreenId}">${currentScreenName}</span>
            `;
        }
        addBreadcrumbListeners();
    }

    function addBreadcrumbListeners() {
        breadcrumbNav.querySelectorAll('.breadcrumb-item').forEach(item => {
            if (!item.classList.contains('active-breadcrumb')) {
                item.addEventListener('click', (event) => {
                    const screenId = event.target.dataset.screenId;
                    console.log(`[Breadcrumb] Clicked: ${screenId}`); // ログ追加
                    const screenMap = {
                        'welcome-screen': welcomeScreen,
                        'quiz-screen': quizScreen,
                        'result-screen': resultScreen,
                        'syllabus-screen': syllabusScreen,
                        'assumed-problems-screen': assumedProblemsScreen
                    };
                    if (screenMap[screenId]) {
                        showScreen(screenMap[screenId]);
                        if (screenId === 'welcome-screen' && (quizScreen.classList.contains('active') || resultScreen.classList.contains('active'))) {
                            resetQuiz();
                        }
                    }
                });
            }
        });
    }

    // ===============================================
    // クイズ関連機能
    // ===============================================

    // questions.csv の読み込みとパース
    async function fetchQuestions() {
        console.log('[Quiz] Fetching questions from data/questions.csv'); // ログ追加
        const response = await fetch('data/questions.csv'); // パスを修正
        if (!response.ok) {
            console.error(`[Quiz Error] HTTP error! status: ${response.status} - Could not load questions.csv`);
            alert("問題データの読み込みに失敗しました。");
            return [];
        }
        const csvText = await response.text();
        console.log('[Quiz] CSV text loaded, parsing...'); // ログ追加
        return parseCsvQuestions(csvText);
    }

    // CSVをパースして問題データ形式に変換する関数
    function parseCsvQuestions(csv) {
        const lines = csv.trim().split('\n');
        const dataLines = lines.slice(1); // ヘッダー行をスキップ
        
        console.log(`[Quiz] Parsing ${dataLines.length} data lines.`); // ログ追加
        return dataLines.map((line, index) => {
            const parts = line.split(',');
            const questionText = parts[0].trim();
            const choices = [
                parts[1].trim(),
                parts[2].trim(),
                parts[3].trim(),
                parts[4].trim()
            ];
            const correctAnswerIndex = parseInt(parts[5].trim());
            const explanation = parts[6].trim();

            return {
                id: index + 1,
                question: questionText,
                choices: choices,
                correctAnswerIndex: correctAnswerIndex,
                explanation: explanation
            };
        });
    }


    function loadQuestion(questions) {
        console.log(`[Quiz] Loading question ${currentQuestionIndex + 1}/${questions.length}`); // ログ追加
        selectedChoice = null;
        feedbackContainer.classList.add('hidden');
        submitAnswerButton.disabled = true;
        choicesContainer.innerHTML = '';

        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            questionNumberElement.textContent = `第 ${currentQuestionIndex + 1} 問`;
            questionTextElement.textContent = question.question;

            question.choices.forEach((choice, index) => {
                const button = document.createElement('button');
                button.classList.add('choice-button');
                button.dataset.index = index;
                button.textContent = choice;
                button.addEventListener('click', () => {
                    selectChoice(button);
                });
                choicesContainer.appendChild(button);
            });
            submitAnswerButton.textContent = "解答する";
            submitAnswerButton.removeEventListener('click', showResultOrNextQuestion);
            submitAnswerButton.addEventListener('click', submitAnswer);
        } else {
            console.log('[Quiz] All questions answered, showing result.'); // ログ追加
            showResult();
        }
    }

    function selectChoice(button) {
        console.log(`[Quiz] Choice selected: ${button.textContent}`); // ログ追加
        choicesContainer.querySelectorAll('.choice-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
        selectedChoice = parseInt(button.dataset.index);
        submitAnswerButton.disabled = false;
    }

    function submitAnswer() {
        console.log(`[Quiz] Submitting answer for question ${currentQuestionIndex + 1}`); // ログ追加
        if (selectedChoice === null) {
            alert('選択肢を選んでください。');
            return;
        }

        const question = questionsData[currentQuestionIndex];
        const isCorrect = (selectedChoice === question.correctAnswerIndex);

        choicesContainer.querySelectorAll('.choice-button').forEach(btn => {
            btn.disabled = true;
            btn.classList.remove('selected');
        });

        choicesContainer.children[question.correctAnswerIndex].style.backgroundColor = 'var(--secondary-color)';
        choicesContainer.children[question.correctAnswerIndex].style.color = 'white';
        choicesContainer.children[question.correctAnswerIndex].style.borderColor = 'var(--secondary-color)';

        if (isCorrect) {
            correctAnswersCount++;
            resultMessageElement.textContent = '正解です！';
            resultMessageElement.style.color = 'var(--secondary-color)';
            console.log('[Quiz] Correct answer!'); // ログ追加
        } else {
            resultMessageElement.textContent = '不正解です。';
            resultMessageElement.style.color = '#dc3545';
            choicesContainer.children[selectedChoice].style.backgroundColor = '#dc3545';
            choicesContainer.children[selectedChoice].style.color = 'white';
            choicesContainer.children[selectedChoice].style.borderColor = '#dc3545';
            console.log('[Quiz] Incorrect answer.'); // ログ追加
        }

        explanationTextElement.innerHTML = `<p>${question.explanation}</p>`;
        feedbackContainer.classList.remove('hidden');

        submitAnswerButton.removeEventListener('click', submitAnswer);
        submitAnswerButton.textContent = "次へ";
        submitAnswerButton.addEventListener('click', showResultOrNextQuestion);
    }

    function showResultOrNextQuestion() {
        console.log(`[Quiz] Moving to next question or showing result.`); // ログ追加
        if (currentQuestionIndex < questionsData.length - 1) {
            currentQuestionIndex++;
            loadQuestion(questionsData);
        } else {
            showResult();
        }
    }

    function showResult() {
        console.log('[Quiz] Displaying final result.'); // ログ追加
        correctAnswersCountElement.textContent = correctAnswersCount;
        totalQuestionsCountElement.textContent = questionsData.length;
        showScreen(resultScreen);
        resetQuiz();
    }

    function resetQuiz() {
        console.log('[Quiz] Resetting quiz state.'); // ログ追加
        currentQuestionIndex = 0;
        correctAnswersCount = 0;
        selectedChoice = null;
        feedbackContainer.classList.add('hidden');
        submitAnswerButton.disabled = true;
        choicesContainer.innerHTML = '';
        submitAnswerButton.removeEventListener('click', showResultOrNextQuestion);
        submitAnswerButton.removeEventListener('click', submitAnswer);
    }

    // ===============================================
    // シラバス関連機能
    // ===============================================

    // シラバスの全章を動的にインポート
    async function fetchSyllabusChapters() {
        console.log('[Syllabus] Starting to fetch chapters.'); // ログ追加
        const chapterFiles = [
            'chapter0.js', 'chapter1.js', 'chapter2.js', 'chapter3.js',
            'chapter4.js', 'chapter5.js', 'chapter6.js', 'chapter7.js', 'chapter8.js'
        ];
        const loadedChapters = [];
        for (const file of chapterFiles) {
            try {
                // `script.js` から `js/syllabus/` への正しい相対パス
                const chapterModule = await import(`./syllabus/${file}`); // ★修正点：パスから余分な 'js/' を削除★
                loadedChapters.push(chapterModule.default);
                console.log(`[Syllabus] Successfully loaded ${file}`); // ログ追加
            } catch (error) {
                console.error(`[Syllabus Error] Failed to load chapter ${file}:`, error);
                // alert(`シラバスの章 ${file} の読み込みに失敗しました。`); // エラーが多すぎるのでコメントアウト
            }
        }
        console.log(`[Syllabus] Finished fetching chapters. Loaded ${loadedChapters.length} chapters.`); // ログ追加
        return loadedChapters;
    }

    async function loadSyllabusContent() {
        console.log('[Syllabus] Loading syllabus content.'); // ログ追加
        if (syllabusChapters.length === 0) {
            syllabusChapters = await fetchSyllabusChapters();
            if (syllabusChapters.length === 0) {
                syllabusContent.innerHTML = '<p>シラバスデータの読み込みに失敗しました。ブラウザのコンソールを確認してください。</p>';
                console.error('[Syllabus Error] No syllabus chapters loaded.'); // ログ追加
                return;
            }
        }

        syllabusNavigation.innerHTML = '';
        syllabusContent.innerHTML = '';

        syllabusChapters.forEach((chapter, index) => {
            const navItem = document.createElement('a');
            navItem.href = `#chapter-${index}`;
            navItem.classList.add('syllabus-nav-item');
            navItem.textContent = chapter.title;
            navItem.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`[Syllabus] Nav clicked: ${chapter.title}`); // ログ追加
                displaySyllabusChapter(chapter);
                syllabusNavigation.querySelectorAll('.syllabus-nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                navItem.classList.add('active');
            });
            syllabusNavigation.appendChild(navItem);
        });

        if (syllabusChapters.length > 0) {
            displaySyllabusChapter(syllabusChapters[0]);
            if (syllabusNavigation.querySelector('.syllabus-nav-item')) { // nullチェックを追加
                syllabusNavigation.querySelector('.syllabus-nav-item').classList.add('active');
            }
        }
    }

    function displaySyllabusChapter(chapter) {
        console.log(`[Syllabus] Displaying chapter: ${chapter.title}`); // ログ追加
        syllabusContent.innerHTML = `<h3>${chapter.title}</h3>`;
        chapter.sections.forEach(section => {
            syllabusContent.innerHTML += `<h4>${section.section} ${section.title}</h4>`;
            if (section.objectives && section.objectives.length > 0) {
                syllabusContent.innerHTML += `<h5>学習目標:</h5><ul>${section.objectives.map(obj => `<li>${obj}</li>`).join('')}</ul>`;
            }
            if (section.keyTerms && section.keyTerms.length > 0) {
                syllabusContent.innerHTML += `<h5>キーワード:</h5><ul>${section.keyTerms.map(term => `<li>${term.term}: ${term.definition}</li>`).join('')}</ul>`;
            }
            if (section.content && section.content.length > 0) {
                syllabusContent.innerHTML += `<div>${section.content.map(c => `<p>${c}</p>`).join('')}</div>`;
            }
        });
        syllabusContent.scrollTop = 0;
    }


    // ===============================================
    // 想定問題関連機能
    // ===============================================

    // assumedProblemsData.js の読み込み
    async function fetchAssumedProblems() {
        console.log('[Assumed Problems] Fetching assumedProblemsData.js'); // ログ追加
        try {
            const assumedProblemsModule = await import('./assumedProblemsData.js'); // ★修正点：パスから余分な 'js/' を削除★
            return assumedProblemsModule.default;
        } catch (error) {
            console.error(`[Assumed Problems Error] Failed to load assumedProblemsData.js:`, error);
            alert("想定問題データの読み込みに失敗しました。");
            return [];
        }
    }

    async function loadAssumedProblems() {
        console.log('[Assumed Problems] Loading content.'); // ログ追加
        if (assumedProblemsData.length === 0) {
            assumedProblemsData = await fetchAssumedProblems();
            if (assumedProblemsData.length === 0) {
                assumedProblemsList.innerHTML = '<p>想定問題がありません。</p>';
                console.error('[Assumed Problems Error] No assumed problems loaded.'); // ログ追加
                return;
            }
        }
        
        assumedProblemsList.innerHTML = '';

        assumedProblemsData.forEach((problem, index) => {
            const problemItem = document.createElement('div');
            problemItem.classList.add('assumed-problem-item');
            problemItem.innerHTML = `
                <h3>問題 ${index + 1}: ${problem.question}</h3>
                <div class="choices">
                    ${problem.choices.map((choice, i) => `<p>${String.fromCharCode(65 + i)}. ${choice}</p>`).join('')}
                </div>
                <button class="show-answer-button" data-problem-index="${index}">解答を見る</button>
                <div class="answer-feedback hidden">
                    <p><strong>正解: ${String.fromCharCode(65 + problem.correctAnswerIndex)}</strong></p>
                    <p><strong>解説:</strong> ${problem.explanation}</p>
                </div>
            `;
            assumedProblemsList.appendChild(problemItem);
        });

        assumedProblemsList.querySelectorAll('.show-answer-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const feedbackDiv = event.target.nextElementSibling;
                feedbackDiv.classList.toggle('hidden');
                event.target.textContent = feedbackDiv.classList.contains('hidden') ? '解答を見る' : '解答を隠す';
                console.log(`[Assumed Problems] Toggled answer for problem ${event.target.dataset.problemIndex}`); // ログ追加
            });
        });
    }

    // ===============================================
    // イベントリスナーの登録
    // ===============================================

    // メイン画面のボタン
    startQuizButton.addEventListener('click', async () => {
        console.log('[Event] Start Quiz button clicked.'); // ログ追加
        showScreen(quizScreen);
        currentQuestionIndex = 0;
        correctAnswersCount = 0;
        questionsData = await fetchQuestions();
        if (questionsData.length > 0) {
            loadQuestion(questionsData);
        } else {
            alert("問題データの読み込みに失敗しました。アプリケーションを再読み込みしてください。");
            showScreen(welcomeScreen);
        }
    });

    viewSyllabusButton.addEventListener('click', () => {
        console.log('[Event] View Syllabus button clicked.'); // ログ追加
        showScreen(syllabusScreen);
        loadSyllabusContent();
    });

    viewAssumedProblemsButton.addEventListener('click', () => {
        console.log('[Event] View Assumed Problems button clicked.'); // ログ追加
        showScreen(assumedProblemsScreen);
        loadAssumedProblems();
    });

    // クイズ画面のボタン (submitAnswer は loadQuestion 内で設定し直される)
    nextQuestionButton.addEventListener('click', () => {
        console.log('[Event] Next Question button clicked.'); // ログ追加
        currentQuestionIndex++;
        loadQuestion(questionsData);
    });

    // 各画面からのTOPに戻るボタン
    restartQuizButton.addEventListener('click', () => {
        console.log('[Event] Restart Quiz button clicked.'); // ログ追加
        showScreen(welcomeScreen);
    });
    backToWelcomeButton.addEventListener('click', () => {
        console.log('[Event] Back to Welcome (Syllabus) button clicked.'); // ログ追加
        showScreen(welcomeScreen);
    });
    backFromAssumedProblemsButton.addEventListener('click', () => {
        console.log('[Event] Back to Welcome (Assumed Problems) button clicked.'); // ログ追加
        showScreen(welcomeScreen);
    });
    backToWelcomeFromQuizButton.addEventListener('click', () => {
        console.log('[Event] Back to Welcome (from Quiz) button clicked.'); // ログ追加
        showScreen(welcomeScreen);
        resetQuiz();
    });
    backToWelcomeFromResultButton.addEventListener('click', () => {
        console.log('[Event] Back to Welcome (from Result) button clicked.'); // ログ追加
        showScreen(welcomeScreen);
    });

    // ハンバーガーメニュー関連
    menuIcon.addEventListener('click', () => {
        console.log('[Event] Menu icon clicked. Toggling main nav.'); // ログ追加
        mainNav.classList.toggle('hidden');
    });

    // ハンバーガーメニュー内のボタン
    navStartQuizButton.addEventListener('click', async () => {
        console.log('[Event] Nav Start Quiz button clicked.'); // ログ追加
        showScreen(quizScreen);
        currentQuestionIndex = 0;
        correctAnswersCount = 0;
        questionsData = await fetchQuestions();
        if (questionsData.length > 0) {
            loadQuestion(questionsData);
        } else {
            alert("問題データの読み込みに失敗しました。アプリケーションを再読み込みしてください。");
            showScreen(welcomeScreen);
        }
    });
    navViewSyllabusButton.addEventListener('click', () => {
        console.log('[Event] Nav View Syllabus button clicked.'); // ログ追加
        showScreen(syllabusScreen);
        loadSyllabusContent();
    });
    navViewAssumedProblemsButton.addEventListener('click', () => {
        console.log('[Event] Nav View Assumed Problems button clicked.'); // ログ追加
        showScreen(assumedProblemsScreen);
        loadAssumedProblems();
    });
    navBackToWelcomeButton.addEventListener('click', () => {
        console.log('[Event] Nav Back to Welcome button clicked.'); // ログ追加
        showScreen(welcomeScreen);
    });

    // 初期表示
    console.log('[App] Initializing application.'); // ログ追加
    showScreen(welcomeScreen);
    updateBreadcrumb('welcome-screen');
});