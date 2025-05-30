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

    // 結果画面の要素
    const correctAnswersCountElement = document.getElementById('correct-answers-count');
    const totalQuestionsCountElement = document.getElementById('total-questions-count');
    const restartQuizButton = document.getElementById('restart-quiz-button');

    // 各画面からのTOPに戻るボタン
    const backToWelcomeButton = document.getElementById('back-to-welcome-button'); // シラバス画面のTOPボタン
    const backFromAssumedProblemsButton = document.getElementById('back-from-assumed-problems-button'); // 想定問題画面のTOPボタン
    const backToWelcomeFromQuizButton = document.getElementById('back-to-welcome-from-quiz-button'); // クイズ画面からのTOPボタン
    const backToWelcomeFromResultButton = document.getElementById('back-to-welcome-from-result-button'); // 結果画面からのTOPボタン

    // シラバス画面の要素
    const syllabusNavigation = document.getElementById('syllabus-navigation');
    const syllabusContent = document.getElementById('syllabus-content');

    // 想定問題画面の要素
    const assumedProblemsListContainer = document.getElementById('assumed-problems-list');

    // グローバル変数
    let currentQuestionIndex = 0;
    let correctAnswersCount = 0;
    let selectedChoice = null; // クイズの選択肢のインデックス
    let questionsData = []; // クイズの問題データ
    let allSyllabusChapters = []; // シラバスの章データ

    // 現在表示されている画面のIDを保持
    let currentScreenId = 'welcome-screen';

    // 画面定義マップ (パンくずリスト用)
    const screenDefinitions = {
        'welcome-screen': { name: 'トップ', showBreadcrumb: false },
        'quiz-screen': { name: 'クイズ', showBreadcrumb: true },
        'result-screen': { name: '結果', showBreadcrumb: true },
        'syllabus-screen': { name: 'シラバス', showBreadcrumb: true },
        'assumed-problems-screen': { name: '想定問題', showBreadcrumb: true }
    };

    // 画面表示を切り替える関数
    function showScreen(screenToShow, updateBreadcrumb = true) {
        const screens = [welcomeScreen, quizScreen, resultScreen, syllabusScreen, assumedProblemsScreen];
        screens.forEach(screen => {
            if (screen === screenToShow) {
                screen.classList.remove('hidden');
                screen.classList.add('active'); // activeクラスを追加
                currentScreenId = screen.id; // 現在の画面IDを更新
            } else {
                screen.classList.add('hidden');
                screen.classList.remove('active'); // activeクラスを削除
            }
        });

        // ハンバーガーメニューを閉じる
        if (!mainNav.classList.contains('hidden')) {
            mainNav.classList.add('hidden');
        }

        if (updateBreadcrumb) {
            updateBreadcrumbNav(); // パンくずリストを更新
        }
    }

    // パンくずリストを更新する関数
    function updateBreadcrumbNav() {
        breadcrumbNav.innerHTML = ''; // リストをクリア

        const welcomeItem = document.createElement('span');
        welcomeItem.classList.add('breadcrumb-item');
        welcomeItem.textContent = screenDefinitions['welcome-screen'].name;
        welcomeItem.dataset.screenId = 'welcome-screen';
        welcomeItem.addEventListener('click', () => {
            if (currentScreenId !== 'welcome-screen') {
                showScreen(welcomeScreen);
            }
        });
        breadcrumbNav.appendChild(welcomeItem);

        if (currentScreenId !== 'welcome-screen' && screenDefinitions[currentScreenId].showBreadcrumb) {
            const currentItem = document.createElement('span');
            currentItem.classList.add('breadcrumb-item', 'active-breadcrumb');
            currentItem.textContent = screenDefinitions[currentScreenId].name;
            currentItem.dataset.screenId = currentScreenId;
            breadcrumbNav.appendChild(currentItem);
        } else {
            welcomeItem.classList.add('active-breadcrumb'); // トップ画面の場合、トップをアクティブにする
        }
    }


    // クイズの問題データを読み込む関数
    async function fetchQuestions() {
        try {
            const response = await fetch('js/questions.js'); // JSONファイルを想定
            const text = await response.text();
            try {
                const data = JSON.parse(text); // JSONとしてパースを試みる
                if (data && data.questions) {
                    return data.questions;
                } else {
                    console.error('questions.js のデータ構造が不正です。');
                    alert('問題データを読み込めませんでした。ファイル形式を確認してください。');
                    return [];
                }
            } catch (jsonError) {
                console.error('questions.js が有効なJSONではありません:', jsonError);
                alert('問題データを読み込めませんでした。ファイル形式を確認してください。');
                return [];
            }
        } catch (error) {
            console.error('問題の読み込みに失敗しました:', error);
            alert('問題データを読み込めませんでした。ファイルが存在するか確認してください。');
            return [];
        }
    }

    // クイズの問題を読み込み、表示する関数
    function loadQuestion(questions) {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            questionNumberElement.textContent = `問題 ${currentQuestionIndex + 1}`;
            questionTextElement.textContent = question.question;
            choicesContainer.innerHTML = '';
            selectedChoice = null; // 選択肢をリセット

            question.choices.forEach((choice, index) => {
                const choiceButton = document.createElement('button');
                choiceButton.classList.add('choice-button');
                choiceButton.textContent = choice;
                choiceButton.dataset.index = index; // データ属性にインデックスを保持
                choiceButton.addEventListener('click', () => {
                    // すでに選択されている選択肢があればハイライトを解除
                    const currentSelected = choicesContainer.querySelector('.selected-choice');
                    if (currentSelected) {
                        currentSelected.classList.remove('selected-choice');
                    }
                    // 新しく選択された選択肢をハイライト
                    choiceButton.classList.add('selected-choice');
                    selectedChoice = index;
                });
                choicesContainer.appendChild(choiceButton);
            });

            // フィードバックと解答ボタンをリセット
            feedbackContainer.classList.add('hidden');
            submitAnswerButton.classList.remove('hidden');
            submitAnswerButton.disabled = false; // 解答ボタンを有効化
            // 選択肢の無効化を解除
            Array.from(choicesContainer.children).forEach(button => {
                button.disabled = false;
                button.classList.remove('correct-answer', 'incorrect-answer'); // 色もリセット
            });

        } else {
            // 全問題が終了した場合
            showResult();
        }
    }

    // クイズの解答を送信する関数
    function submitAnswer() {
        if (selectedChoice === null) {
            alert('選択肢を選んでください。');
            return;
        }

        const question = questionsData[currentQuestionIndex];
        const isCorrect = (selectedChoice === question.correctAnswer);

        resultMessageElement.textContent = isCorrect ? '正解！' : '不正解...';
        explanationTextElement.textContent = question.explanation;
        feedbackContainer.classList.remove('hidden');
        submitAnswerButton.classList.add('hidden'); // 解答ボタンを非表示
        submitAnswerButton.disabled = true; // 解答ボタンを無効化

        // 選択肢の表示を更新
        Array.from(choicesContainer.children).forEach((button, index) => {
            button.disabled = true; // 全ての選択肢を無効化
            if (index === question.correctAnswer) {
                button.classList.add('correct-answer');
            } else if (index === selectedChoice && !isCorrect) {
                button.classList.add('incorrect-answer');
            }
        });

        if (isCorrect) {
            correctAnswersCount++;
        }
    }

    // クイズの結果を表示する関数
    function showResult() {
        showScreen(resultScreen);
        correctAnswersCountElement.textContent = correctAnswersCount;
        totalQuestionsCountElement.textContent = questionsData.length;
    }

    // シラバスコンテンツを読み込む関数
    async function loadSyllabusContent() {
        try {
            const response = await fetch('js/syllabusData.js'); // JSONファイルを想定
            const text = await response.text();
            try {
                const data = JSON.parse(text);
                if (data && data.chapters) {
                    allSyllabusChapters = data.chapters;
                    renderSyllabusNavigation(allSyllabusChapters);
                    if (allSyllabusChapters.length > 0) {
                        displaySyllabusChapter(allSyllabusChapters[0]);
                    }
                } else {
                    console.error('syllabusData.js のデータ構造が不正です。');
                    alert('シラバスデータを読み込めませんでした。ファイル形式を確認してください。');
                    syllabusNavigation.innerHTML = '<p>シラバスを読み込めませんでした。</p>';
                    syllabusContent.innerHTML = '<p>シラバスを読み込めませんでした。</p>';
                }
            } catch (jsonError) {
                console.error('syllabusData.js が有効なJSONではありません:', jsonError);
                alert('シラバスデータを読み込めませんでした。ファイル形式を確認してください。');
                syllabusNavigation.innerHTML = '<p>シラバスを読み込めませんでした。</p>';
                syllabusContent.innerHTML = '<p>シラバスを読み込めませんでした。</p>';
            }
        } catch (error) {
            console.error('シラバスデータの読み込みに失敗しました:', error);
            alert('シラバスデータを読み込めませんでした。ファイルが存在するか確認してください。');
            syllabusNavigation.innerHTML = '<p>シラバスを読み込めませんでした。</p>';
            syllabusContent.innerHTML = '<p>シラバスを読み込めませんでした。</p>';
        }
    }

    // シラバスナビゲーションをレンダリングする関数
    function renderSyllabusNavigation(chapters) {
        syllabusNavigation.innerHTML = '';
        chapters.forEach(chapter => {
            const chapterLink = document.createElement('a');
            chapterLink.href = "#";
            chapterLink.textContent = chapter.title;
            chapterLink.classList.add('syllabus-nav-item');
            chapterLink.addEventListener('click', (e) => {
                e.preventDefault();
                displaySyllabusChapter(chapter);
                // アクティブな章のスタイルを切り替える
                Array.from(syllabusNavigation.children).forEach(link => link.classList.remove('active'));
                chapterLink.classList.add('active');
            });
            syllabusNavigation.appendChild(chapterLink);
        });
        // 最初の章をアクティブにする
        if (syllabusNavigation.children.length > 0) {
            syllabusNavigation.children[0].classList.add('active');
        }
    }

    // シラバスの章の内容を表示する関数
    function displaySyllabusChapter(chapter) {
        syllabusContent.innerHTML = '';
        const chapterTitle = document.createElement('h3');
        chapterTitle.textContent = chapter.title;
        syllabusContent.appendChild(chapterTitle);

        if (chapter.sections && chapter.sections.length > 0) {
            chapter.sections.forEach(section => {
                const sectionDiv = document.createElement('div');
                sectionDiv.classList.add('syllabus-section');

                const sectionTitle = document.createElement('h4');
                sectionTitle.textContent = `${section.section}. ${section.title}`;
                sectionDiv.appendChild(sectionTitle);

                if (section.objectives && section.objectives.length > 0) {
                    const objectivesList = document.createElement('ul');
                    objectivesList.innerHTML = '<h5>学習目標:</h5>';
                    section.objectives.forEach(obj => {
                        const listItem = document.createElement('li');
                        listItem.textContent = obj;
                        objectivesList.appendChild(listItem);
                    });
                    sectionDiv.appendChild(objectivesList);
                }

                if (section.keyTerms && section.keyTerms.length > 0) {
                    const keyTermsDiv = document.createElement('div');
                    keyTermsDiv.innerHTML = '<h5>重要用語:</h5>';
                    section.keyTerms.forEach(term => {
                        const termItem = document.createElement('div');
                        termItem.classList.add('syllabus-term');
                        termItem.innerHTML = `<strong>${term.term}:</strong> ${term.definition}`;
                        keyTermsDiv.appendChild(termItem);
                    });
                    sectionDiv.appendChild(keyTermsDiv);
                }

                if (section.content && section.content.length > 0) {
                    section.content.forEach(line => {
                        const contentP = document.createElement('p');
                        contentP.textContent = line;
                        sectionDiv.appendChild(contentP);
                    });
                }
                syllabusContent.appendChild(sectionDiv);
            });
        } else {
            const noContentP = document.createElement('p');
            noContentP.textContent = 'この章には詳細なコンテンツがありません。';
            syllabusContent.appendChild(noContentP);
        }
    }

    // 想定問題を読み込み、表示する関数
    async function loadAssumedProblems() {
        try {
            const response = await fetch('js/assumedProblemsData.js'); // JSONファイルを想定
            const text = await response.text();
            try {
                const data = JSON.parse(text);
                if (data && data.problems) {
                    const assumedProblems = data.problems;
                    assumedProblemsListContainer.innerHTML = ''; // 既存のリストをクリア

                    assumedProblems.forEach((problem, index) => {
                        const problemDiv = document.createElement('div');
                        problemDiv.classList.add('assumed-problem-item');

                        const problemTitle = document.createElement('h3');
                        problemTitle.textContent = `想定問題 ${index + 1}: ${problem.id}`; // idを表示
                        problemDiv.appendChild(problemTitle);

                        // シラバスとの紐付け情報を表示
                        const syllabusInfo = document.createElement('p');
                        syllabusInfo.innerHTML = `<strong>シラバス:</strong> ${problem.syllabusChapter}.${problem.syllabusSection} - ${problem.syllabusObjective}`;
                        problemDiv.appendChild(syllabusInfo);

                        const problemQuestion = document.createElement('p');
                        problemQuestion.classList.add('problem-question');
                        problemQuestion.innerHTML = problem.question.replace(/\n/g, '<br>'); // 改行を<br>に変換
                        problemDiv.appendChild(problemQuestion);

                        // 選択肢の表示
                        const choicesDiv = document.createElement('div');
                        choicesDiv.classList.add('choices');
                        problem.choices.forEach((choice, choiceIndex) => {
                            const choiceOptionDiv = document.createElement('div');
                            choiceOptionDiv.classList.add('choice-option');
                            choiceOptionDiv.textContent = `${String.fromCharCode(97 + choiceIndex)}. ${choice}`; // a., b., c., d.
                            choiceOptionDiv.dataset.choiceLetter = String.fromCharCode(97 + choiceIndex);
                            choiceOptionDiv.addEventListener('click', () => {
                                // 同じ問題内の他の選択肢の選択状態を解除
                                Array.from(choicesDiv.children).forEach(opt => {
                                    opt.classList.remove('selected-ap');
                                });
                                choiceOptionDiv.classList.add('selected-ap');
                            });
                            choicesDiv.appendChild(choiceOptionDiv);
                        });
                        problemDiv.appendChild(choicesDiv);

                        const toggleAnswerButton = document.createElement('button');
                        toggleAnswerButton.textContent = '解答と解説を見る';
                        toggleAnswerButton.classList.add('toggle-answer-button');
                        problemDiv.appendChild(toggleAnswerButton);

                        const problemAnswer = document.createElement('div');
                        problemAnswer.classList.add('problem-answer', 'hidden'); // 最初は非表示
                        problemAnswer.innerHTML = `
                            <h4>解答: ${problem.correctAnswerLetter.toUpperCase()}</h4>
                            <p><strong>解説:</strong></p>
                            <p>${problem.explanation.replace(/\n/g, '<br>')}</p>
                        `;
                        problemDiv.appendChild(problemAnswer);

                        toggleAnswerButton.addEventListener('click', () => {
                            problemAnswer.classList.toggle('hidden');
                            toggleAnswerButton.textContent = problemAnswer.classList.contains('hidden') ? '解答と解説を見る' : '解答と解説を隠す';
                        });

                        assumedProblemsListContainer.appendChild(problemDiv);
                    });
                } else {
                    console.error('assumedProblemsData.js のデータ構造が不正です。');
                    alert('想定問題データを読み込めませんでした。ファイル形式を確認してください。');
                    assumedProblemsListContainer.innerHTML = '<p>想定問題を読み込めませんでした。</p>';
                }
            } catch (jsonError) {
                console.error('assumedProblemsData.js が有効なJSONではありません:', jsonError);
                alert('想定問題データを読み込めませんでした。ファイル形式を確認してください。');
                assumedProblemsListContainer.innerHTML = '<p>想定問題を読み込めませんでした。</p>';
            }
        } catch (error) {
            console.error('想定問題の読み込みに失敗しました:', error);
            alert('想定問題データを読み込めませんでした。ファイルが存在するか確認してください。');
            assumedProblemsListContainer.innerHTML = '<p>想定問題を読み込めませんでした。</p>';
        }
    }


    // イベントリスナー
    // ハンバーガーメニューの開閉
    menuIcon.addEventListener('click', () => {
        mainNav.classList.toggle('hidden');
    });

    // メイン画面のボタン
    startQuizButton.addEventListener('click', async () => {
        showScreen(quizScreen);
        currentQuestionIndex = 0;
        correctAnswersCount = 0;
        questionsData = await fetchQuestions(); // ここでデータフェッチ
        if (questionsData.length > 0) {
            loadQuestion(questionsData);
        } else {
            // alertはfetchQuestions内で出しているので不要
            showScreen(welcomeScreen); // データがなければウェルカム画面に戻る
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

    // クイズ画面の操作ボタン
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
    showScreen(welcomeScreen); // welcomeScreenにactiveクラスが付与される
});