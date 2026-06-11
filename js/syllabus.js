// js/syllabus.js - 公開資料の本文は表示せず、学習位置を示す参照情報のみを扱う。
import { setupCommonNavigation, setupBackToTopButtons, fetchLessons } from './utils.js';
import { topicMaps, topicMapVersions, officialLinks } from './topicMap.js';
import { CERTIFICATIONS, getSelectedCert } from './certifications.js';
import { certKey, SUFFIXES } from './storage.js';

document.addEventListener('DOMContentLoaded', async () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    const certId = getSelectedCert();
    const cert = CERTIFICATIONS.find(c => c.id === certId) || CERTIFICATIONS[0];
    const map = topicMaps[cert.id] || topicMaps.fl;

    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = `学習範囲マップ - ${cert.name}`;

    const lessons = await fetchLessons(cert.id);
    initSyllabusScreen(map, topicMapVersions[cert.id], {
        certId: cert.id,
        lessons,
        learnedIds: readLearnedLessons(cert.id),
    });
});

function readLearnedLessons(certId) {
    try {
        const value = JSON.parse(localStorage.getItem(certKey(certId, SUFFIXES.lessonsRead)) || '[]');
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

export function initSyllabusScreen(chapters, versionNote = '', options = {}) {
    const navigation = document.getElementById('syllabus-navigation');
    const content = document.getElementById('syllabus-content');
    if (!navigation || !content) return;
    navigation.textContent = '';
    content.textContent = '';

    const note = document.querySelector('.syllabus-version-note');
    if (note) {
        const base = 'ここでは章・節・LOコード・Kレベルと自作の学習タイトルだけを表示します。公式情報は必ず公式シラバスを確認してください。';
        note.textContent = versionNote ? `${versionNote}。${base}` : base;
    }

    chapters.forEach(chapter => {
        const chapterLessons = (options.lessons || []).filter(lesson => lesson.chapter === chapter.chapter);
        const learnedCount = chapterLessons.filter(lesson => (options.learnedIds || []).includes(lesson.id)).length;
        const button = document.createElement('button');
        button.className = 'syllabus-chapter-button';
        const progress = chapterLessons.length ? ` ✓ ${learnedCount}/${chapterLessons.length}` : '';
        button.textContent = `${chapter.chapter}章 ${chapter.title}${progress}`;
        button.addEventListener('click', () => {
            displayChapterContent(chapter, content, options);
            navigation.querySelectorAll('button').forEach(item => item.classList.remove('active'));
            button.classList.add('active');
        });
        navigation.appendChild(button);
    });

    if (chapters.length) {
        displayChapterContent(chapters[0], content, options);
        navigation.querySelector('button')?.classList.add('active');
    }
}

export function displayChapterContent(chapter, content, options = {}) {
    content.textContent = '';
    const heading = document.createElement('h2');
    heading.textContent = `${chapter.chapter}章 ${chapter.title}`;
    content.appendChild(heading);

    chapter.sections.forEach(section => {
        const lesson = (options.lessons || []).find(item => item.sectionRef === section.section);
        const isLearned = lesson && (options.learnedIds || []).includes(lesson.id);
        const card = document.createElement('section');
        card.className = 'syllabus-section';
        const title = document.createElement('h3');
        title.className = 'syllabus-section-heading';
        if (lesson) {
            const link = document.createElement('a');
            link.href = `lesson.html?id=${encodeURIComponent(lesson.id)}`;
            link.textContent = `${section.section} ${section.title}`;
            title.appendChild(link);
        } else {
            title.textContent = `${section.section} ${section.title}`;
        }
        const learningTitle = document.createElement('p');
        learningTitle.textContent = `自作学習タイトル: ${section.learningTitle}`;
        const meta = document.createElement('p');
        meta.className = 'problem-syllabus-info';
        meta.textContent = [section.loCode && `LO: ${section.loCode}`, section.kLevel && `Kレベル: ${section.kLevel}`].filter(Boolean).join(' ・ ') || '参照コード未設定';
        card.appendChild(title);
        if (isLearned || !lesson) {
            const badge = document.createElement('span');
            badge.className = isLearned ? 'lesson-badge lesson-badge--learned' : 'lesson-badge lesson-badge--preparing';
            badge.textContent = isLearned ? '✓ 学習済み' : 'レッスン準備中';
            card.appendChild(badge);
        }
        card.append(learningTitle, meta);
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
