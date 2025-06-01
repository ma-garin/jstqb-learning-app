// js/syllabus.js

/**
 * シラバス画面の初期化関数
 * @param {Array} allChapters - 全ての章のデータ配列
 */
export function initSyllabusScreen(allChapters) {
    const syllabusNavigation = document.getElementById('syllabus-navigation');
    const syllabusContent = document.getElementById('syllabus-content');

    if (!syllabusNavigation || !syllabusContent) {
        console.error("Syllabus navigation or content element not found.");
        return;
    }

    syllabusNavigation.innerHTML = ''; // ナビゲーションをクリア
    syllabusContent.innerHTML = ''; // コンテンツをクリア

    // ナビゲーションの動的生成
    allChapters.forEach(chapter => {
        const chapterButton = document.createElement('button');
        chapterButton.classList.add('syllabus-chapter-button');
        chapterButton.textContent = `${chapter.chapter}章 ${chapter.title}`;
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
            sectionDiv.innerHTML += '<h4>内容</h4>' +
                section.content.map(p => `<p>${p.replace(/\\n/g, '<br>')}</p>`).join('');
        }

        contentElement.appendChild(sectionDiv);
    });
}