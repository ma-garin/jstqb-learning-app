// js/glossary.js

import glossaryTerms from './glossaryData.js'; // 用語集データをインポート
import { setupCommonNavigation, setupBackToTopButtons } from './utils.js'; // 共通関数をインポート

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation(); // 共通ナビゲーションの初期化
    setupBackToTopButtons(); // TOPに戻るボタンの初期化

    const glossaryList = document.getElementById('glossary-list');
    const searchInput = document.getElementById('glossary-search-input');
    const noResultsMessage = glossaryList.querySelector('.no-results');

    /**
     * 用語集リストをレンダリングする
     * @param {Array} termsToDisplay - 表示する用語の配列
     */
    function renderGlossary(termsToDisplay) {
        glossaryList.innerHTML = ''; // 既存のリストをクリア

        if (termsToDisplay.length === 0) {
            noResultsMessage.classList.remove('hidden');
            return;
        } else {
            noResultsMessage.classList.add('hidden');
        }

        termsToDisplay.forEach(term => {
            const termItem = document.createElement('div');
            termItem.classList.add('glossary-term-item');
            termItem.innerHTML = `
                <h3>${term.term}</h3>
                <p>${term.definition}</p>
            `;
            glossaryList.appendChild(termItem);
        });
    }

    /**
     * 検索入力に基づいて用語集をフィルタリングし、再レンダリングする
     */
    function filterGlossary() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTerms = glossaryTerms.filter(term =>
            term.term.toLowerCase().includes(searchTerm) ||
            term.definition.toLowerCase().includes(searchTerm)
        );
        renderGlossary(filteredTerms);
    }

    // 検索入力フィールドのイベントリスナー
    searchInput.addEventListener('input', filterGlossary);

    // ページ読み込み時に全用語をレンダリング
    renderGlossary(glossaryTerms);
});
