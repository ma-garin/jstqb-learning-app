// js/main.js

import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // 共通ナビゲーション（ハンバーガーメニュー、パンくずリスト）の初期化
    setupCommonNavigation();
    // 共通の「TOPに戻る」ボタンの初期化
    setupBackToTopButtons();

    // index.html の画面内ボタンのイベントリスナーを設定
    const startLearningButton = document.getElementById('start-learning-button');
    const viewSyllabusButton = document.getElementById('view-syllabus-button');
    const viewAssumedProblemsButton = document.getElementById('view-assumed-problems-button');
    const viewReleaseNotesButton = document.getElementById('view-release-notes-button');
    const viewGlossaryButton = document.getElementById('view-glossary-button');

    if (startLearningButton) {
        startLearningButton.addEventListener('click', () => {
            window.location.href = 'study.html';
        });
    }

    if (viewSyllabusButton) {
        viewSyllabusButton.addEventListener('click', () => {
            window.location.href = 'syllabus.html';
        });
    }

    if (viewAssumedProblemsButton) {
        viewAssumedProblemsButton.addEventListener('click', () => {
            window.location.href = 'question.html';
        });
    }

    if (viewReleaseNotesButton) {
        viewReleaseNotesButton.addEventListener('click', () => {
            window.location.href = 'release_notes.html';
        });
    }

    if (viewGlossaryButton) {
        viewGlossaryButton.addEventListener('click', () => {
            window.location.href = 'glossary.html';
        });
    }

    console.log("Main screen (index.html) initialized.");
});

