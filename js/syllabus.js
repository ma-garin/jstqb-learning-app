// js/syllabus.js - 公開資料の本文は表示せず、学習位置を示す参照情報のみを扱う。
import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';
import { topicMaps, officialLinks } from './topicMap.js';
import { CERTIFICATIONS, getSelectedCert } from './certifications.js';

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    const certId = getSelectedCert();
    const cert = CERTIFICATIONS.find(c => c.id === certId) || CERTIFICATIONS[0];
    const map = topicMaps[cert.id] || topicMaps['qa-basic'];

    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = `学習範囲マップ - ${cert.name}`;

    initSyllabusScreen(map);
});

export function initSyllabusScreen(chapters) {
    const navigation = document.getElementById('syllabus-navigation');
    const content = document.getElementById('syllabus-content');
    if (!navigation || !content) return;
    navigation.textContent = '';
    content.textContent = '';

    const note = document.querySelector('.syllabus-version-note');
    if (note) note.textContent = 'ここでは章・節・LOコード・Kレベルと自作の学習タイトルだけを表示します。公式情報は必ず公式PDFを確認してください。';

    chapters.forEach(chapter => {
        const button = document.createElement('button');
        button.className = 'syllabus-chapter-button';
        button.textContent = `${chapter.chapter}章 ${chapter.title}`;
        button.addEventListener('click', () => {
            displayChapterContent(chapter, content);
            navigation.querySelectorAll('button').forEach(item => item.classList.remove('active'));
            button.classList.add('active');
        });
        navigation.appendChild(button);
    });

    if (chapters.length) {
        displayChapterContent(chapters[0], content);
        navigation.querySelector('button')?.classList.add('active');
    }
}

export function displayChapterContent(chapter, content) {
    content.textContent = '';
    const heading = document.createElement('h2');
    heading.textContent = `${chapter.chapter}章 ${chapter.title}`;
    content.appendChild(heading);

    chapter.sections.forEach(section => {
        const card = document.createElement('section');
        card.className = 'syllabus-section';
        const title = document.createElement('h3');
        title.textContent = `${section.section} ${section.title}`;
        const learningTitle = document.createElement('p');
        learningTitle.textContent = `自作学習タイトル: ${section.learningTitle}`;
        const meta = document.createElement('p');
        meta.className = 'problem-syllabus-info';
        meta.textContent = [section.loCode && `LO: ${section.loCode}`, section.kLevel && `Kレベル: ${section.kLevel}`].filter(Boolean).join(' ・ ') || '参照コード未設定';
        card.append(title, learningTitle, meta);
        content.appendChild(card);
    });

    const linksHeading = document.createElement('h3');
    linksHeading.textContent = '公式情報への外部リンク';
    const links = document.createElement('ul');
    officialLinks.forEach(item => {
        const li = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.href = item.url;
        anchor.textContent = item.label;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        li.appendChild(anchor);
        links.appendChild(li);
    });
    content.append(linksHeading, links);
}
