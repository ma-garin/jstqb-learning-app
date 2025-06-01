// js/index.js
import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // 共通ナビゲーションのセットアップ
    setupCommonNavigation();
    setupBackToTopButtons(); // TOPに戻るボタン（もしあれば）

    // ボタン要素
    const startLearningButton = document.getElementById('start-learning-button');
    const viewSyllabusButton = document.getElementById('view-syllabus-button');
    const viewAssumedProblemsButton = document.getElementById('view-assumed-problems-button');

    // ボタンのイベントリスナー（ページ遷移）
    if (startLearningButton) {
        startLearningButton.addEventListener('click', () => {
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
});