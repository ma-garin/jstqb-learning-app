// js/glossary.js
import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';
import { glossaryTerms } from './glossaryData.js';

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();

    const list = document.getElementById('glossary-list');
    const search = document.getElementById('glossary-search-input');
    if (!list || !search) return;

    function render(terms) {
        list.querySelectorAll('.glossary-term-item').forEach(item => item.remove());
        const noResults = list.querySelector('.no-results');
        noResults?.classList.toggle('hidden', terms.length > 0);
        terms.forEach(term => {
            const card = document.createElement('article');
            card.className = 'glossary-term-item';
            const heading = document.createElement('h3');
            heading.textContent = term.term;
            const description = document.createElement('p');
            description.textContent = term.definition;
            card.append(heading, description);
            list.appendChild(card);
        });
    }

    search.addEventListener('input', () => {
        const query = search.value.trim().toLocaleLowerCase('ja');
        render(glossaryTerms.filter(item =>
            item.term.toLocaleLowerCase('ja').includes(query)
            || item.definition.toLocaleLowerCase('ja').includes(query)
        ));
    });
    render(glossaryTerms);
});
