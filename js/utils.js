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
    const navViewReleaseNotesButton = document.getElementById('nav-view-release-notes-button');
    const navViewGlossaryButton = document.getElementById('nav-view-glossary-button'); // 追加
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
    if (navViewReleaseNotesButton) {
        navViewReleaseNotesButton.addEventListener('click', () => {
            window.location.href = 'release_notes.html';
        });
    }
    // 用語集ボタンのイベントリスナーを追加
    if (navViewGlossaryButton) {
        navViewGlossaryButton.addEventListener('click', () => {
            window.location.href = 'glossary.html';
        });
    }
    if (navBackToWelcomeButton) {
        navBackToWelcomeButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // パンくずリストのイベントリスナー（動的に生成するため、ここで呼び出す）
    const breadcrumbNav = document.getElementById('breadcrumb-nav');
    if (breadcrumbNav) {
        setupBreadcrumb(breadcrumbNav);
    }
}

/**
 * パンくずリストを動的に生成し、イベントリスナーを設定する
 * @param {HTMLElement} breadcrumbNav - パンくずリストのnav要素
 */
function setupBreadcrumb(breadcrumbNav) {
    if (!breadcrumbNav) return;

    breadcrumbNav.innerHTML = ''; // クリア

    // ページパスとパンくずリスト項目のマッピング
    const pathMap = {
        'index.html': { id: 'welcome-screen', text: 'トップ' },
        'study.html': { id: 'learning-start-screen', text: '学習開始', parent: 'index.html' },
        'quiz.html': { id: 'quiz-screen', text: 'クイズ', parent: 'study.html' },
        'result.html': { id: 'result-screen', text: '結果', parent: 'quiz.html' },
        'syllabus.html': { id: 'syllabus-screen', text: 'シラバス', parent: 'index.html' },
        'question.html': { id: 'assumed-problems-screen', text: '想定問題', parent: 'index.html' },
        'release_notes.html': { id: 'release-notes-screen', text: 'リリースノート', parent: 'index.html' },
        'glossary.html': { id: 'glossary-screen', text: '用語集', parent: 'index.html' } // 用語集ページを追加
    };

    const currentPage = window.location.pathname.split('/').pop();
    let currentPath = [];
    let currentItem = pathMap[currentPage];

    // 現在のページからルートまでのパスを構築
    while (currentItem) {
        currentPath.unshift(currentItem);
        currentItem = currentItem.parent ? pathMap[currentItem.parent] : null;
    }

    // パンくずリストをレンダリングし、クリックイベントを設定
    currentPath.forEach((item, index) => {
        const span = document.createElement('span');
        span.classList.add('breadcrumb-item');
        span.textContent = item.text;
        span.dataset.screenId = item.id; // data-screen-id を設定

        if (item.id === pathMap[currentPage].id) {
            span.classList.add('active-breadcrumb');
            span.style.cursor = 'default'; // アクティブな項目はクリック不可
        } else {
            span.classList.add('inactive-breadcrumb'); // クリック可能なパンくず
            span.addEventListener('click', () => {
                let targetPage = '';
                switch(item.dataset.screenId) {
                    case 'welcome-screen': targetPage = 'index.html'; break;
                    case 'learning-start-screen': targetPage = 'study.html'; break;
                    case 'quiz-screen': targetPage = 'quiz.html'; break;
                    case 'result-screen': targetPage = 'result.html'; break;
                    case 'syllabus-screen': targetPage = 'syllabus.html'; break;
                    case 'assumed-problems-screen': targetPage = 'question.html'; break;
                    case 'release-notes-screen': targetPage = 'release_notes.html'; break;
                    case 'glossary-screen': targetPage = 'glossary.html'; break; // 用語集ページを追加
                }
                if (targetPage) {
                    window.location.href = targetPage;
                }
            });
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
        const { assumedProblems } = await import('./assumedProblemsData.js'); // パスを修正
        return assumedProblems;
    } catch (error) {
        console.error("想定問題データの読み込み中にエラーが発生しました:", error);
        return []; // エラーが発生した場合は空の配列を返す
    }
}
