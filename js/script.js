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
    const restartQuizButton = document.getElementById('restart-quiz-button'); // ★修正点：この行を追加★


    // シラバス関連要素
    const syllabusNavigation = document.getElementById('syllabus-navigation');
    const syllabusContentDiv = document.getElementById('syllabus-content');

    // 想定問題関連要素
    const assumedProblemsList = document.getElementById('assumed-problems-list');

    // 各画面への戻るボタン
    const backToWelcomeButton = document.getElementById('back-to-welcome-button'); // シラバスからTOPへ
    const backFromAssumedProblemsButton = document.getElementById('back-from-assumed-problems-button'); // 想定問題からTOPへ
    const backToWelcomeFromQuizButton = document.getElementById('back-to-welcome-from-quiz-button'); // クイズ画面からTOPへ
    const backToWelcomeFromResultButton = document.getElementById('back-to-welcome-from-result-button'); // 結果画面からTOPへ


    let questionsData = [];
    let currentQuestionIndex = 0;
    let correctAnswersCount = 0;
    let syllabusData = null;
    let assumedProblemsData = null;

    // 画面表示を切り替える関数
    function showScreen(screenToShow) {
        // 全てのセクションを非表示にする前にnullチェックを行う
        [welcomeScreen, quizScreen, resultScreen, syllabusScreen, assumedProblemsScreen].forEach(screen => {
            if (screen) {
                screen.classList.add('hidden');
            }
        });
        // 指定されたセクションを表示する前にnullチェックを行う
        if (screenToShow) {
            screenToShow.classList.remove('hidden');
        }
        updateBreadcrumb(screenToShow.id);
        mainNav.classList.add('hidden'); // メニューを閉じる
    }

    // パンくずリストの更新
    function updateBreadcrumb(currentScreenId) {
        breadcrumbNav.innerHTML = ''; // クリア

        // 各画面のパンくず情報を定義
        const screenMap = {
            'welcome-screen': 'トップ',
            'quiz-screen': 'クイズ',
            'result-screen': '結果',
            'syllabus-screen': 'シラバス',
            'assumed-problems-screen': '想定問題'
        };

        const addBreadcrumbItem = (id, text, isActive) => {
            const item = document.createElement('span');
            item.classList.add('breadcrumb-item');
            item.textContent = text;
            item.dataset.screenId = id; // データ属性にIDを保存

            if (isActive) {
                item.classList.add('active-breadcrumb');
            } else {
                item.addEventListener('click', () => showScreen(document.getElementById(id)));
            }
            breadcrumbNav.appendChild(item);
        };

        // トップ画面は常に最初に表示
        addBreadcrumbItem('welcome-screen', 'トップ', currentScreenId === 'welcome-screen');

        if (currentScreenId !== 'welcome-screen') {
            const currentScreenText = screenMap[currentScreenId] || '';
            if (currentScreenText) {
                const separator = document.createElement('span');
                separator.classList.add('breadcrumb-separator');
                separator.textContent = ' > ';
                breadcrumbNav.appendChild(separator);
                addBreadcrumbItem(currentScreenId, currentScreenText, true);
            }
        }
    }


    // 問題データを読み込む関数
    async function fetchQuestions() {
        try {
            const response = await fetch('js/questions.json'); // または 'js/questions.js'
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.questions;
        } catch (error) {
            console.error('問題データの読み込みエラー:', error);
            alert('問題データの読み込みに失敗しました。開発者ツールでコンソールを確認してください。');
            return [];
        }
    }

    // シラバスデータを読み込む関数
    async function fetchSyllabusData() {
        try {
            const response = await fetch('js/syllabusData.json'); // または 'js/syllabusData.js'
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.chapters;
        } catch (error) {
            console.error('シラバスデータの読み込みエラー:', error);
            alert('シラバスデータの読み込みに失敗しました。開発者ツールでコンソールを確認してください。');
            return [];
        }
    }

    // 想定問題データを読み込む関数
    async function fetchAssumedProblemsData() {
        try {
            const response = await fetch('js/assumedProblemsData.json'); // または 'js/assumedProblemsData.js'
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.problems;
        } catch (error) {
            console.error('想定問題データの読み込みエラー:', error);
            alert('想定問題データの読み込みに失敗しました。開発者ツールでコンソールを確認してください。');
            return [];
        }
    }

    // 問題をロードする関数
    function loadQuestion(questions) {
        feedbackContainer.classList.add('hidden');
        choicesContainer.innerHTML = ''; // 選択肢をクリア
        submitAnswerButton.disabled = false; // 解答ボタンを有効化

        if (currentQuestionIndex >= questions.length) {
            // 全問終了
            correctAnswersCountElement.textContent = correctAnswersCount;
            totalQuestionsCountElement.textContent = questions.length;
            showScreen(resultScreen);
            return;
        }

        const question = questions[currentQuestionIndex];
        questionNumberElement.textContent = `第 ${currentQuestionIndex + 1} 問`;
        questionTextElement.textContent = question.question;

        question.choices.forEach((choice, index) => {
            const choiceButton = document.createElement('button');
            choiceButton.classList.add('choice-button');
            choiceButton.textContent = choice;
            choiceButton.dataset.index = index;
            choiceButton.addEventListener('click', () => selectChoice(choiceButton));
            choicesContainer.appendChild(choiceButton);
        });

        submitAnswerButton.classList.remove('hidden'); // 解答ボタンを表示
        nextQuestionButton.classList.add('hidden'); // 次の問題ボタンを非表示
    }

    // 選択肢が選択された時の処理
    let selectedChoiceButton = null;

    function selectChoice(button) {
        if (selectedChoiceButton) {
            selectedChoiceButton.classList.remove('selected');
        }
        button.classList.add('selected');
        selectedChoiceButton = button;
    }

    // 解答を提出する関数
    function submitAnswer() {
        if (!selectedChoiceButton) {
            alert('選択肢を選んでください！');
            return;
        }

        const selectedAnswerIndex = parseInt(selectedChoiceButton.dataset.index);
        const question = questionsData[currentQuestionIndex];

        // 全ての選択肢を無効化する
        Array.from(choicesContainer.children).forEach(button => {
            button.disabled = true;
            // 正解と不正解の視覚的フィードバック
            if (parseInt(button.dataset.index) === question.correctAnswer) {
                button.style.backgroundColor = '#d4edda'; // 正解は緑系
                button.style.borderColor = '#28a745';
            } else if (button === selectedChoiceButton) {
                button.style.backgroundColor = '#f8d7da'; // 選択した不正解は赤系
                button.style.borderColor = '#dc3545';
            }
        });


        if (selectedAnswerIndex === question.correctAnswer) {
            resultMessageElement.textContent = '正解！';
            resultMessageElement.style.color = 'green';
            correctAnswersCount++;
        } else {
            resultMessageElement.textContent = '不正解...';
            resultMessageElement.style.color = 'red';
        }

        explanationTextElement.innerHTML = `
            <p><strong>正解:</strong> ${String.fromCharCode(97 + question.correctAnswer)}. ${question.choices[question.correctAnswer]}</p>
            <p><strong>解説:</strong></p>
            <p>${question.explanation}</p>
        `;

        feedbackContainer.classList.remove('hidden');
        submitAnswerButton.classList.add('hidden'); // 解答ボタンを非表示
        nextQuestionButton.classList.remove('hidden'); // 次の問題ボタンを表示
        selectedChoiceButton.classList.remove('selected'); // 選択状態を解除
        selectedChoiceButton = null; // 選択肢をリセット
    }

    // シラバスコンテンツをロードする関数
    async function loadSyllabusContent() {
        if (!syllabusData) {
            syllabusData = await fetchSyllabusData();
        }

        syllabusNavigation.innerHTML = '';
        syllabusContentDiv.innerHTML = '';

        if (syllabusData.length === 0) {
            syllabusContentDiv.innerHTML = '<p>シラバスデータがありません。</p>';
            return;
        }

        syllabusData.forEach((chapter, chapterIndex) => {
            const chapterLink = document.createElement('a');
            chapterLink.href = `#chapter-${chapterIndex}`;
            chapterLink.textContent = chapter.title;
            chapterLink.classList.add('syllabus-nav-item');
            chapterLink.addEventListener('click', (e) => {
                e.preventDefault();
                displaySyllabusChapter(chapterIndex);
                // アクティブクラスの切り替え
                Array.from(syllabusNavigation.children).forEach(link => link.classList.remove('active'));
                chapterLink.classList.add('active');
            });
            syllabusNavigation.appendChild(chapterLink);
        });

        // 最初の章をデフォルトで表示
        if (syllabusData.length > 0) {
            displaySyllabusChapter(0);
            if (syllabusNavigation.firstChild) {
                syllabusNavigation.firstChild.classList.add('active');
            }
        }
    }

    // 特定のシラバス章を表示する関数
    function displaySyllabusChapter(chapterIndex) {
        const chapter = syllabusData[chapterIndex];
        if (!chapter) return; // chapterがundefinedの場合のガード

        syllabusContentDiv.innerHTML = `<h3>${chapter.title}</h3>`;

        chapter.sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<h4>${section.section} ${section.title}</h4>`;
            if (section.objectives && section.objectives.length > 0) {
                sectionDiv.innerHTML += `<p><strong>学習目標:</strong></p><ul>${section.objectives.map(obj => `<li>${obj}</li>`).join('')}</ul>`;
            }
            if (section.keyTerms && section.keyTerms.length > 0) {
                sectionDiv.innerHTML += `<p><strong>主要用語:</strong></p><ul>${section.keyTerms.map(term => `<li>${term.term}: ${term.definition}</li>`).join('')}</ul>`;
            }
            if (section.content && section.content.length > 0) {
                sectionDiv.innerHTML += `<p>${section.content.join('<br>')}</p>`;
            }
            syllabusContentDiv.appendChild(sectionDiv);
        });
    }

    // 想定問題をロードする関数
    async function loadAssumedProblems() {
        if (!assumedProblemsData) {
            assumedProblemsData = await fetchAssumedProblemsData();
        }

        assumedProblemsList.innerHTML = ''; // リストをクリア

        if (assumedProblemsData.length === 0) {
            assumedProblemsList.innerHTML = '<p>想定問題データがありません。</p>';
            return;
        }

        assumedProblemsData.forEach((problem, index) => {
            const problemDiv = document.createElement('div');
            problemDiv.classList.add('assumed-problem-item');
            problemDiv.innerHTML = `
                <h3>問題 ${index + 1}: ${problem.question}</h3>
                <p><strong>シラバス参照:</strong> 第${problem.syllabusChapter}章 ${problem.syllabusSection} - ${problem.syllabusObjective}</p>
                <div class="choices">
                    ${problem.choices.map((choice, i) => `<p>${String.fromCharCode(97 + i)}. ${choice}</p>`).join('')}
                </div>
                <button class="show-answer-button" data-index="${index}">解答を見る</button>
                <div class="answer-feedback hidden">
                    <p><strong>正解:</strong> ${problem.correctAnswerLetter}. ${problem.choices[problem.correctAnswer]}</p>
                    <p><strong>解説:</strong> ${problem.explanation}</p>
                </div>
            `;
            assumedProblemsList.appendChild(problemDiv);
        });

        // 解答表示ボタンにイベントリスナーを追加
        document.querySelectorAll('.show-answer-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const feedbackDiv = e.target.nextElementSibling; // 次の要素が解答フィードバック
                feedbackDiv.classList.toggle('hidden');
                e.target.textContent = feedbackDiv.classList.contains('hidden') ? '解答を見る' : '解答を隠す';
            });
        });
    }

    // イベントリスナーの登録

    // ハンバーガーメニューの開閉
    menuIcon.addEventListener('click', () => {
        mainNav.classList.toggle('hidden');
    });

    startQuizButton.addEventListener('click', async () => {
        showScreen(quizScreen);
        currentQuestionIndex = 0;
        correctAnswersCount = 0;
        questionsData = await fetchQuestions();
        if (questionsData.length > 0) {
            loadQuestion(questionsData);
        } else {
            // 問題がない場合はウェルカム画面に戻る
            alert("問題データの読み込みに失敗しました。");
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

    submitAnswerButton.addEventListener('click', submitAnswer);

    nextQuestionButton.addEventListener('click', () => {
        currentQuestionIndex++;
        loadQuestion(questionsData);
    });

    // 各画面からのTOPに戻るボタン
    restartQuizButton.addEventListener('click', () => { // 結果画面からTOPへ
        showScreen(welcomeScreen);
    });
    backToWelcomeButton.addEventListener('click', () => { // シラバス画面からTOPへ
        showScreen(welcomeScreen);
    });
    backFromAssumedProblemsButton.addEventListener('click', () => { // 想定問題画面からTOPへ
        showScreen(welcomeScreen);
    });
    backToWelcomeFromQuizButton.addEventListener('click', () => {
        showScreen(welcomeScreen);
    });
    backToWelcomeFromResultButton.addEventListener('click', () => {
        showScreen(welcomeScreen);
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
    showScreen(welcomeScreen); // アプリ起動時にウェルカム画面を表示
});