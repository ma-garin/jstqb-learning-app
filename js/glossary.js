// js/glossary.js

import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';
import { getExam } from './examContext.js';

document.addEventListener('DOMContentLoaded', async () => {
    setupCommonNavigation();
    setupBackToTopButtons();

    const exam = getExam();
    const mod = exam === 'altm'
        ? await import('./glossaryData_altm.js')
        : await import('./glossaryData_alta.js');
    const glossaryTerms = mod.glossaryTerms;

    const glossaryList = document.getElementById('glossary-list');
    const searchInput = document.getElementById('glossary-search-input');

    function renderGlossary(termsToDisplay) {
        const existingItems = glossaryList.querySelectorAll('.glossary-term-item');
        existingItems.forEach(el => el.remove());

        const noResults = glossaryList.querySelector('.no-results');

        if (termsToDisplay.length === 0) {
            noResults?.classList.remove('hidden');
            return;
        }

        noResults?.classList.add('hidden');

        termsToDisplay.forEach(term => {
            const div = document.createElement('div');
            div.classList.add('glossary-term-item');

            const h3 = document.createElement('h3');
            h3.textContent = term.term;

            const p = document.createElement('p');
            p.textContent = term.definition;

            div.appendChild(h3);
            div.appendChild(p);
            glossaryList.appendChild(div);
        });
    }

    function filterGlossary() {
        const q = searchInput.value.toLowerCase();
        const filtered = glossaryTerms.filter(t =>
            t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
        );
        renderGlossary(filtered);
    }

    searchInput.addEventListener('input', filterGlossary);
    renderGlossary(glossaryTerms);
});
