// js/utils.js

/**
 * 共通のDOM要素を取得し、イベントリスナーを設定する
 * 各ページでナビゲーションボタンを初期化するために呼び出す
 */
export function setupCommonNavigation() {
    const menuIcon = document.getElementById('menu-icon');
    const mainNav = document.getElementById('main-nav');

    // ハンバーガーメニューの開閉
    if (menuIcon && mainNav) {
        menuIcon.addEventListener('click', () => {
            mainNav.classList.toggle('hidden');
        });
    }

    // ナビゲーションボタンのイベントリスナー（ページ遷移）
    const navStartLearningButton = document.getElementById('nav-start-learning-button');
    const navViewSyllabusButton = document.getElementById('nav-view-syllabus-button');
    const navViewAssumedProblemsButton = document.getElementById('nav-view-assumed-problems-button');
    const navBackToWelcomeButton = document.getElementById('nav-back-to-welcome-button');

    if (navStartLearningButton) {
        navStartLearningButton.addEventListener('click', () => {
            window.location.href = 'study.html';
        });
    }
    if (navViewSyllabusButton) {
        navViewSyllabusButton.addEventListener('click', () => {
            window.location.href = 'syllabus.html';
        });
    }
    if (navViewAssumedProblemsButton) {
        navViewAssumedProblemsButton.addEventListener('click', () => {
            window.location.href = 'question.html';
        });
    }
    if (navBackToWelcomeButton) {
        navBackToWelcomeButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // パンくずリストのイベントリスナー
    document.querySelectorAll('.breadcrumb-item').forEach(item => {
        item.addEventListener('click', () => {
            if (!item.classList.contains('active-breadcrumb')) {
                let targetPage = '';
                switch(item.dataset.screenId) {
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
            }
        });
    });
}

/**
 * 共通の「TOPに戻る」ボタンのイベントリスナーを設定する
 * 各ページのフッター付近にあるボタン用
 */
export function setupBackToTopButtons() {
    document.querySelectorAll('.back-to-top-button').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = 'index.html'; // TOPページへ遷移
        });
    });
}

/**
 * 想定問題データをフェッチする関数
 * @returns {Promise<Array>} 想定問題データの配列
 */
export async function fetchQuestions() {
    try {
        // assumedProblemsData.js からインポート
        const { assumedProblems } = await import('../js/assumedProblemsData.js');
        return assumedProblems;
    } catch (error) {
        console.error("想定問題データの読み込み中にエラーが発生しました:", error);
        return []; // エラーが発生した場合は空の配列を返す
    }
}