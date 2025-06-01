// js/utils.js

/**
 * 共通のDOM要素を取得し、イベントリスナーを設定する
 * 各ページでナビゲーションボタンを初期化するために呼び出す
 * @param {function} showScreenCallback - 画面を切り替えるためのコールバック関数
 */
export function setupCommonNavigation(showScreenCallback) {
    const menuIcon = document.getElementById('menu-icon');
    const mainNav = document.getElementById('main-nav');

    // ハンバーガーメニューの開閉
    if (menuIcon && mainNav) {
        menuIcon.addEventListener('click', () => {
            mainNav.classList.toggle('hidden');
        });
    }

    // ナビゲーションボタンのイベントリスナー（SPA対応）
    const navStartLearningButton = document.getElementById('nav-start-learning-button');
    const navViewSyllabusButton = document.getElementById('nav-view-syllabus-button');
    const navViewAssumedProblemsButton = document.getElementById('nav-view-assumed-problems-button');
    const navBackToWelcomeButton = document.getElementById('nav-back-to-welcome-button');

    if (navStartLearningButton) {
        navStartLearningButton.addEventListener('click', () => {
            showScreenCallback('learning-start-screen');
            mainNav.classList.add('hidden'); // メニューを閉じる
        });
    }
    if (navViewSyllabusButton) {
        navViewSyllabusButton.addEventListener('click', () => {
            showScreenCallback('syllabus-screen');
            mainNav.classList.add('hidden'); // メニューを閉じる
        });
    }
    if (navViewAssumedProblemsButton) {
        navViewAssumedProblemsButton.addEventListener('click', () => {
            showScreenCallback('assumed-problems-screen');
            mainNav.classList.add('hidden'); // メニューを閉じる
        });
    }
    if (navBackToWelcomeButton) {
        navBackToWelcomeButton.addEventListener('click', () => {
            showScreenCallback('welcome-screen');
            mainNav.classList.add('hidden'); // メニューを閉じる
        });
    }
}

/**
 * 共通の「TOPに戻る」ボタンのイベントリスナーを設定する
 * 各ページのフッター付近にあるボタン用
 * @param {function} showScreenCallback - 画面を切り替えるためのコールバック関数
 */
export function setupBackToTopButtons(showScreenCallback) {
    document.querySelectorAll('.back-to-top-button').forEach(button => {
        button.addEventListener('click', () => {
            showScreenCallback('welcome-screen'); // TOPページへ遷移
        });
    });
}

/**
 * パンくずリストを更新する関数 (SPA対応)
 * @param {string} currentScreenId - 現在表示されている画面のID
 */
export function updateBreadcrumb(currentScreenId) {
    const breadcrumbNav = document.getElementById('breadcrumb-nav');
    breadcrumbNav.innerHTML = ''; // 一度クリア

    const breadcrumbMap = {
        'welcome-screen': 'トップ',
        'learning-start-screen': '学習開始',
        'quiz-screen': 'クイズ',
        'result-screen': '結果',
        'syllabus-screen': 'シラバス',
        'assumed-problems-screen': '想定問題'
    };

    let pathSegments = [];

    // パス構築ロジック
    if (currentScreenId === 'welcome-screen') {
        pathSegments = ['welcome-screen'];
    } else if (currentScreenId === 'learning-start-screen') {
        pathSegments = ['welcome-screen', 'learning-start-screen'];
    } else if (currentScreenId === 'quiz-screen') {
        pathSegments = ['welcome-screen', 'learning-start-screen', 'quiz-screen'];
    } else if (currentScreenId === 'result-screen') {
        pathSegments = ['welcome-screen', 'learning-start-screen', 'quiz-screen', 'result-screen'];
    } else if (currentScreenId === 'syllabus-screen') {
        pathSegments = ['welcome-screen', 'syllabus-screen'];
    } else if (currentScreenId === 'assumed-problems-screen') {
        pathSegments = ['welcome-screen', 'assumed-problems-screen'];
    }

    pathSegments.forEach((id, index) => {
        const item = document.createElement('span');
        item.classList.add('breadcrumb-item');
        item.textContent = breadcrumbMap[id];
        item.dataset.screenId = id; // データ属性に画面IDを保存

        if (id === currentScreenId) {
            item.classList.add('active-breadcrumb');
        } else {
            // パンくずリストのクリックイベントは main.js で showScreen を呼び出すようにする
            // ここではイベントリスナーを設定しない
        }

        breadcrumbNav.appendChild(item);

        if (index < pathSegments.length - 1) {
            const separator = document.createElement('span');
            separator.classList.add('breadcrumb-separator');
            separator.innerHTML = ' &gt; '; // 区切り文字
            breadcrumbNav.appendChild(separator);
        }
    });
}

/**
 * 想定問題データをフェッチする関数
 * assumedProblemsData.js からインポートするため、この関数は不要になります。
 * main.js で assumedProblems を直接インポートして利用します。
 */
// export async function fetchQuestions() {
//     try {
//         // パスを修正: utils.js から assumedProblemsData.js への相対パス
//         const { assumedProblems } = await import('./assumedProblemsData.js');
//         return assumedProblems;
//     } catch (error) {
//         console.error("想定問題データの読み込みに失敗しました:", error);
//         return [];
//     }
// }