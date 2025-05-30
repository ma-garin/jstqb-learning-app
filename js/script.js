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
        const response = await fetch('data/questions.csv'); // パスを修正
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status} - Could not load questions.csv`);
            alert("問題データの読み込みに失敗しました。");
            return [];
        }
        const csvText = await response.text();
        return parseCsvQuestions(csvText);
    }

    // CSVをパースして問題データ形式に変換する関数
    function parseCsvQuestions(csv) {
        const lines = csv.trim().split('\n');
        // ヘッダー行をスキップし、データ行のみを処理
        const dataLines = lines.slice(1);
        
        return dataLines.map((line, index) => {
            const parts = line.split(','); // CSVの区切り文字がカンマであることを仮定
            // 必要に応じてデータの整形（例: 文字列のトリム、数値への変換など）
            const questionText = parts[0].trim();
            const choices = [
                parts[1].trim(),
                parts[2].trim(),
                parts[3].trim(),
                parts[4].trim()
            ];
            const correctAnswerIndex = parseInt(parts[5].trim()); // 数値に変換
            const explanation = parts[6].trim();

            return {
                id: index + 1, // 連番IDを付与
                question: questionText,
                choices: choices,
                correctAnswerIndex: correctAnswerIndex,
                explanation: explanation
            };
        });
    }


    function loadQuestion(questions) {
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
            showResult();
        }
    }

    function selectChoice(button) {
        choicesContainer.querySelectorAll('.choice-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
        selectedChoice = parseInt(button.dataset.index);
        submitAnswerButton.disabled = false;
    }

    function submitAnswer() {
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
        } else {
            resultMessageElement.textContent = '不正解です。';
            resultMessageElement.style.color = '#dc3545';
            choicesContainer.children[selectedChoice].style.backgroundColor = '#dc3545';
            choicesContainer.children[selectedChoice].style.color = 'white';
            choicesContainer.children[selectedChoice].style.borderColor = '#dc3545';
        }

        explanationTextElement.innerHTML = `<p>${question.explanation}</p>`;
        feedbackContainer.classList.remove('hidden');

        submitAnswerButton.removeEventListener('click', submitAnswer);
        submitAnswerButton.textContent = "次へ";
        submitAnswerButton.addEventListener('click', showResultOrNextQuestion);
    }

    function showResultOrNextQuestion() {
        if (currentQuestionIndex < questionsData.length - 1) {
            currentQuestionIndex++;
            loadQuestion(questionsData);
        } else {
            showResult();
        }
    }

    function showResult() {
        correctAnswersCountElement.textContent = correctAnswersCount;
        totalQuestionsCountElement.textContent = questionsData.length;
        showScreen(resultScreen);
        resetQuiz();
    }

    function resetQuiz() {
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
        const chapterFiles = [
            'chapter0.js', 'chapter1.js', 'chapter2.js', 'chapter3.js',
            'chapter4.js', 'chapter5.js', 'chapter6.js', 'chapter7.js', 'chapter8.js'
        ];
        const loadedChapters = [];
        for (const file of chapterFiles) {
            try {
                // `js/syllabus/` フォルダからの相対パス
                const chapterModule = await import(`./js/syllabus/${file}`); 
                loadedChapters.push(chapterModule.default); // default export を取得
            } catch (error) {
                console.error(`Failed to load chapter ${file}:`, error);
                alert(`シラバスの章 ${file} の読み込みに失敗しました。`);
            }
        }
        return loadedChapters;
    }

    async function loadSyllabusContent() {
        if (syllabusChapters.length === 0) { // まだ読み込んでいない場合のみ
            syllabusChapters = await fetchSyllabusChapters();
            if (syllabusChapters.length === 0) {
                syllabusContent.innerHTML = '<p>シラバスデータの読み込みに失敗しました。</p>';
                return;
            }
        }

        syllabusNavigation.innerHTML = '';
        syllabusContent.innerHTML = '';

        // ナビゲーションの生成
        syllabusChapters.forEach((chapter, index) => {
            const navItem = document.createElement('a');
            navItem.href = `#chapter-${index}`; // IDを修正
            navItem.classList.add('syllabus-nav-item');
            navItem.textContent = chapter.title; // chapter.title を使用
            navItem.addEventListener('click', (e) => {
                e.preventDefault();
                displaySyllabusChapter(chapter); // chapterオブジェクト全体を渡す
                // ナビゲーションアイテムのアクティブ状態を切り替える
                syllabusNavigation.querySelectorAll('.syllabus-nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                navItem.classList.add('active');
            });
            syllabusNavigation.appendChild(navItem);
        });

        // 初期表示として最初のチャプターを表示
        if (syllabusChapters.length > 0) {
            displaySyllabusChapter(syllabusChapters[0]);
            syllabusNavigation.querySelector('.syllabus-nav-item').classList.add('active');
        }
    }

    // シラバスの章を表示する関数
    function displaySyllabusChapter(chapter) {
        syllabusContent.innerHTML = `<h3>${chapter.title}</h3>`;
        chapter.sections.forEach(section => {
            syllabusContent.innerHTML += `<h4>${section.section} ${section.title}</h4>`;
            if (section.objectives && section.objectives.length > 0) {
                syllabusContent.innerHTML += `<h5>学習目標:</h5><ul>${section.objectives.map(obj => `<li>${obj}</li>`).join('')}</ul>`;
            }
            if (section.keyTerms && section.keyTerms.length > 0) {
                syllabusContent.innerHTML += `<h5>キーワード:</h5><ul>${section.keyTerms.map(term => `<li>${term.term}: ${term.definition}</li>`).join('')}</ul>`;
            }
        });
        syllabusContent.scrollTop = 0;
    }


    // ===============================================
    // 想定問題関連機能
    // ===============================================

    // assumedProblemsData.js の読み込み
    async function fetchAssumedProblems() {
        // js/assumedProblemsData.js を動的にインポート
        try {
            const assumedProblemsModule = await import('./js/assumedProblemsData.js');
            return assumedProblemsModule.default; // default export を取得
        } catch (error) {
            console.error(`Failed to load assumedProblemsData.js:`, error);
            alert("想定問題データの読み込みに失敗しました。");
            return [];
        }
    }

    async function loadAssumedProblems() {
        if (assumedProblemsData.length === 0) { // まだ読み込んでいない場合のみ
            assumedProblemsData = await fetchAssumedProblems();
            if (assumedProblemsData.length === 0) {
                assumedProblemsList.innerHTML = '<p>想定問題がありません。</p>';
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
            });
        });
    }

    // ===============================================
    // イベントリスナーの登録
    // ===============================================

    // メイン画面のボタン
    startQuizButton.addEventListener('click', async () => {
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
        showScreen(syllabusScreen);
        loadSyllabusContent();
    });

    viewAssumedProblemsButton.addEventListener('click', () => {
        showScreen(assumedProblemsScreen);
        loadAssumedProblems();
    });

    // クイズ画面のボタン (submitAnswer は loadQuestion 内で設定し直される)
    nextQuestionButton.addEventListener('click', () => {
        currentQuestionIndex++;
        loadQuestion(questionsData);
    });

    // 各画面からのTOPに戻るボタン
    restartQuizButton.addEventListener('click', () => {
        showScreen(welcomeScreen);
    });
    backToWelcomeButton.addEventListener('click', () => {
        showScreen(welcomeScreen);
    });
    backFromAssumedProblemsButton.addEventListener('click', () => {
        showScreen(welcomeScreen);
    });
    backToWelcomeFromQuizButton.addEventListener('click', () => {
        showScreen(welcomeScreen);
        resetQuiz(); // クイズ途中でTOPに戻った場合もリセット
    });
    backToWelcomeFromResultButton.addEventListener('click', () => {
        showScreen(welcomeScreen);
    });

    // ハンバーガーメニュー関連
    menuIcon.addEventListener('click', () => {
        mainNav.classList.toggle('hidden');
    });

    // ハンバーガーメニュー内のボタン
    navStartQuizButton.addEventListener('click', async () => {
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
        showScreen(syllabusScreen);
        loadSyllabusContent();
    });
    navViewAssumedProblemsButton.addEventListener('click', () => {
        showScreen(assumedProblemsScreen);
        loadAssumedProblems();
    });
    navBackToWelcomeButton.addEventListener('click', () => {
        showScreen(welcomeScreen);
    });

    // 初期表示
    showScreen(welcomeScreen);
    updateBreadcrumb('welcome-screen');
});