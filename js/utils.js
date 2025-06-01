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
    const breadcrumbNav = document.getElementById('breadcrumb-nav');
    if (breadcrumbNav) {
        breadcrumbNav.addEventListener('click', (event) => {
            const item = event.target.closest('.breadcrumb-item');
            if (item && !item.classList.contains('active-breadcrumb')) {
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
    }

    // 現在のページに基づいてパンくずリストを初期化
    updateBreadcrumbsBasedOnCurrentPage();
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
        const { assumedProblems } = await import('./assumedProblemsData.js');
        return assumedProblems;
    } catch (error) {
        console.error("想定問題データの読み込み中にエラーが発生しました:", error);
        return []; // エラーが発生した場合は空の配列を返す
    }
}

/**
 * 現在のページに基づいてパンくずリストを更新する関数
 */
function updateBreadcrumbsBasedOnCurrentPage() {
    const breadcrumbNav = document.getElementById('breadcrumb-nav');
    if (!breadcrumbNav) return;

    breadcrumbNav.innerHTML = ''; // クリア

    const pathMap = {
        'index.html': { id: 'welcome-screen', text: 'トップ' },
        'study.html': { id: 'learning-start-screen', text: '学習開始', parent: 'index.html' },
        'quiz.html': { id: 'quiz-screen', text: 'クイズ', parent: 'study.html' },
        'result.html': { id: 'result-screen', text: '結果', parent: 'quiz.html' },
        'syllabus.html': { id: 'syllabus-screen', text: 'シラバス', parent: 'index.html' },
        'question.html': { id: 'assumed-problems-screen', text: '想定問題', parent: 'index.html' }
    };

    const currentPage = window.location.pathname.split('/').pop();
    let currentPath = [];
    let currentItem = pathMap[currentPage];

    while (currentItem) {
        currentPath.unshift(currentItem);
        currentItem = currentItem.parent ? pathMap[currentItem.parent] : null;
    }

    currentPath.forEach((item, index) => {
        const span = document.createElement('span');
        span.classList.add('breadcrumb-item');
        span.textContent = item.text;
        span.dataset.screenId = item.id; // data-screen-id を設定

        if (item.id === pathMap[currentPage].id) {
            span.classList.add('active-breadcrumb');
            span.style.cursor = 'default';
        } else {
            span.classList.add('inactive-breadcrumb'); // クリック可能なパンくず
        }
        breadcrumbNav.appendChild(span);

        if (index < currentPath.length - 1) {
            const separator = document.createElement('span');
            separator.classList.add('breadcrumb-separator');
            separator.textContent = ' > ';
            breadcrumbNav.appendChild(separator);
        }
    });
}
