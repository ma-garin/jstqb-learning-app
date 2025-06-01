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

// assumedProblemsData.js もインポート
import { assumedProblems } from './assumedProblemsData.js';

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
    // シラバス画面の初期化
    initSyllabusScreen();

    // 想定問題画面の初期化
    initAssumedProblemsScreen();
});

/**
 * シラバス画面の初期化関数
 * main.js が syllabus.html で読み込まれることを想定
 */
function initSyllabusScreen() {
    const syllabusNavigation = document.getElementById('syllabus-navigation');
    const syllabusContent = document.getElementById('syllabus-content');

    if (!syllabusNavigation || !syllabusContent) {
        // console.error("Syllabus navigation or content element not found.");
        return; // syllabus.html 以外のページでは要素がないため処理を中断
    }

    syllabusNavigation.innerHTML = ''; // ナビゲーションをクリア
    syllabusContent.innerHTML = ''; // コンテンツをクリア

    // ナビゲーションの動的生成
    allChapters.forEach(chapter => {
        const chapterButton = document.createElement('button');
        chapterButton.classList.add('syllabus-chapter-button');
        // タイトルから時間表記を削除
        const chapterTitleWithoutTime = chapter.title.includes(' - ') ? chapter.title.split(' - ')[0] : chapter.title;
        chapterButton.textContent = `${chapter.chapter}章 ${chapterTitleWithoutTime}`;
        chapterButton.dataset.chapter = chapter.chapter; // データ属性に章番号を保存

        syllabusNavigation.appendChild(chapterButton);

        chapterButton.addEventListener('click', () => {
            displayChapterContent(chapter, syllabusContent);
            // アクティブなボタンのスタイルを更新
            document.querySelectorAll('.syllabus-chapter-button').forEach(btn => {
                btn.classList.remove('active');
            });
            chapterButton.classList.add('active');
        });
    });

    // 初期表示として最初の章のコンテンツを表示
    if (allChapters.length > 0) {
        displayChapterContent(allChapters[0], syllabusContent);
        // 最初のボタンをアクティブにする
        const firstButton = syllabusNavigation.querySelector('.syllabus-chapter-button');
        if (firstButton) {
            firstButton.classList.add('active');
        }
    }

    console.log("Syllabus Screen Initialized.");
}

/**
 * 指定された章のコンテンツを表示する
 * @param {Object} chapterData - 表示する章のデータ
 * @param {HTMLElement} contentElement - コンテンツを表示するDOM要素
 */
function displayChapterContent(chapterData, contentElement) {
    contentElement.innerHTML = `
        <h2>${chapterData.chapter}章 ${chapterData.title}</h2>
    `;

    chapterData.sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('syllabus-section');
        sectionDiv.innerHTML = `
            <h3>${section.section} ${section.title}</h3>
        `;

        // 学習目標
        if (section.objectives && section.objectives.length > 0) {
            sectionDiv.innerHTML += '<h4>学習目標</h4><ul>' +
                section.objectives.map(obj => `<li>${obj}</li>`).join('') +
                '</ul>';
        }

        // 主要用語 (ツールチップ対応)
        if (section.keyTerms && section.keyTerms.length > 0) {
            sectionDiv.innerHTML += '<h4>主要用語</h4><ul>' +
                section.keyTerms.map(term => `<li><span class="key-term" title="${term.definition}">${term.term}</span></li>`).join('') +
                '</ul>';
        }

        // 本文コンテンツ
        if (section.content && section.content.length > 0) {
            section.content.forEach(paragraph => {
                const p = document.createElement('p');
                p.innerHTML = paragraph.replace(/\\n/g, '<br>'); // 改行コードを<br>に変換
                sectionDiv.appendChild(p);
            });
        }

        contentElement.appendChild(sectionDiv);
    });
}

/**
 * 想定問題画面の初期化関数
 * main.js が question.html で読み込まれることを想定
 */
function initAssumedProblemsScreen() {
    const assumedProblemsList = document.getElementById('assumed-problems-list');
    if (!assumedProblemsList) {
        // console.error("Error: #assumed-problems-list element not found.");
        return; // question.html 以外のページでは要素がないため処理を中断
    }
    assumedProblemsList.innerHTML = ''; // クリア

    if (!assumedProblems || assumedProblems.length === 0) {
        assumedProblemsList.innerHTML = '<p>問題の読み込みに失敗しました。</p>';
        return;
    }

    assumedProblems.forEach(problem => {
        const problemDiv = document.createElement('div');
        problemDiv.classList.add('assumed-problem-item');
        problemDiv.innerHTML = `
            <h3>問題 ${problem.id}</h3>
            <p class="problem-syllabus-info">シラバス: ${problem.syllabusChapter}章 ${problem.syllabusSection}</p>
            <p class="question-text">${problem.question.replace(/\\n/g, '<br>')}</p>
            <div class="choices">
                ${problem.choices.map((choice, index) => {
                    const optionLetter = String.fromCharCode(97 + index); // 'a', 'b', 'c', 'd'
                    return `<p class="choice-item"><span class="choice-letter">${optionLetter}.</span> ${choice.replace(/\\n/g, '<br>')}</p>`;
                }).join('')}
            </div>
            <button class="answer-toggle-button" data-problem-id="${problem.id}">解答・解説を表示</button>
            <div class="problem-explanation-area hidden" id="feedback-${problem.id}">
                <p class="correct-answer-text">正解: <span class="correct-answer-letter">${problem.correctAnswerLetter.toUpperCase()}</span></p>
                <p class="explanation-text">解説:<br>${problem.explanation.replace(/\\n/g, '<br>')}</p>
            </div>
        `;
        assumedProblemsList.appendChild(problemDiv);
    });

    // 解答表示ボタンのイベントリスナー設定
    document.querySelectorAll('.answer-toggle-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const problemId = event.target.dataset.problemId;
            const feedbackDiv = document.getElementById(`feedback-${problemId}`);
            if (feedbackDiv) {
                feedbackDiv.classList.toggle('hidden');
                if (feedbackDiv.classList.contains('hidden')) {
                    event.target.textContent = '解答・解説を表示';
                } else {
                    event.target.textContent = '解答・解説を隠す';
                }
            }
        });
    });

    console.log("Assumed Problems Screen Initialized.");
}
