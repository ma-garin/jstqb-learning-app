// js/syllabus.js

import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';
import { getExam } from './examContext.js';

document.addEventListener('DOMContentLoaded', async () => {
    setupCommonNavigation();
    setupBackToTopButtons();

    const exam = getExam();
    const allChapters = await loadChapters(exam);
    initSyllabusScreen(allChapters);
});

async function loadChapters(exam) {
    if (exam === 'altm') {
        const [c0, c1, c2, c3] = await Promise.all([
            import('./syllabus/altm/chapter0.js'),
            import('./syllabus/altm/chapter1.js'),
            import('./syllabus/altm/chapter2.js'),
            import('./syllabus/altm/chapter3.js'),
        ]);
        return [c0.default, c1.default, c2.default, c3.default];
    }
    const [c0, c1, c2, c3, c4, c5, c6, c7, c8] = await Promise.all([
        import('./syllabus/alta/chapter0.js'),
        import('./syllabus/alta/chapter1.js'),
        import('./syllabus/alta/chapter2.js'),
        import('./syllabus/alta/chapter3.js'),
        import('./syllabus/alta/chapter4.js'),
        import('./syllabus/alta/chapter5.js'),
        import('./syllabus/alta/chapter6.js'),
        import('./syllabus/alta/chapter7.js'),
        import('./syllabus/alta/chapter8.js'),
    ]);
    return [c0.default, c1.default, c2.default, c3.default, c4.default, c5.default, c6.default, c7.default, c8.default];
}

function initSyllabusScreen(allChapters) {
    const syllabusNavigation = document.getElementById('syllabus-navigation');
    const syllabusContent = document.getElementById('syllabus-content');

    if (!syllabusNavigation || !syllabusContent) {
        console.error("Syllabus navigation or content element not found.");
        return;
    }

    syllabusNavigation.innerHTML = '';
    syllabusContent.innerHTML = '';

    allChapters.forEach(chapter => {
        const chapterButton = document.createElement('button');
        chapterButton.classList.add('syllabus-chapter-button');
        const chapterTitleWithoutTime = chapter.title.includes(' - ') ? chapter.title.split(' - ')[0] : chapter.title;
        chapterButton.textContent = `${chapter.chapter}章 ${chapterTitleWithoutTime}`;
        chapterButton.dataset.chapter = chapter.chapter;

        syllabusNavigation.appendChild(chapterButton);

        chapterButton.addEventListener('click', () => {
            displayChapterContent(chapter, syllabusContent);
            document.querySelectorAll('.syllabus-chapter-button').forEach(btn => {
                btn.classList.remove('active');
            });
            chapterButton.classList.add('active');
        });
    });

    if (allChapters.length > 0) {
        displayChapterContent(allChapters[0], syllabusContent);
        const firstButton = syllabusNavigation.querySelector('.syllabus-chapter-button');
        if (firstButton) firstButton.classList.add('active');
    }
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function appendHeading(parent, tag, text) {
    const el = document.createElement(tag);
    el.textContent = text;
    parent.appendChild(el);
}

function displayChapterContent(chapterData, contentElement) {
    contentElement.innerHTML = '';
    appendHeading(contentElement, 'h2', `${chapterData.chapter}章 ${chapterData.title}`);

    chapterData.sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('syllabus-section');
        appendHeading(sectionDiv, 'h3', `${section.section} ${section.title}`);

        if (section.objectives && section.objectives.length > 0) {
            appendHeading(sectionDiv, 'h4', '学習目標');
            const ul = document.createElement('ul');
            section.objectives.forEach(obj => {
                const li = document.createElement('li');
                li.textContent = obj;
                ul.appendChild(li);
            });
            sectionDiv.appendChild(ul);
        }

        if (section.keyTerms && section.keyTerms.length > 0) {
            appendHeading(sectionDiv, 'h4', '主要用語');
            const ul = document.createElement('ul');
            section.keyTerms.forEach(term => {
                const li = document.createElement('li');
                const span = document.createElement('span');
                span.className = 'key-term';
                span.title = term.definition;
                span.textContent = term.term;
                li.appendChild(span);
                ul.appendChild(li);
            });
            sectionDiv.appendChild(ul);
        }

        if (section.content && section.content.length > 0) {
            section.content.forEach(paragraph => {
                const p = document.createElement('p');
                p.innerHTML = escapeHtml(paragraph).replace(/\\n/g, '<br>');
                sectionDiv.appendChild(p);
            });
        }

        contentElement.appendChild(sectionDiv);
    });
}
