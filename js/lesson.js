import { CERTIFICATIONS } from './certifications.js';
import { createQuestionCard } from './questionCard.js';
import { certKey, SUFFIXES } from './storage.js';
import { topicMaps } from './topicMap.js';
import { fetchLessons, fetchQuestions, setupBackToTopButtons, setupCommonNavigation } from './utils.js';

export function parseLessonId(id, certifications = CERTIFICATIONS) {
    if (typeof id !== 'string') return null;
    const separatorIndex = id.indexOf('-');
    if (separatorIndex <= 0 || separatorIndex === id.length - 1) return null;

    const certId = id.slice(0, separatorIndex);
    const sectionRef = id.slice(separatorIndex + 1);
    if (!certifications.some(cert => cert.id === certId)) return null;
    return { certId, sectionRef };
}

export function resolveAdjacentLessons(lessons, lessonId) {
    const index = lessons.findIndex(lesson => lesson.id === lessonId);
    if (index < 0) return { previous: null, next: null };
    return {
        previous: lessons[index - 1] || null,
        next: lessons[index + 1] || null,
    };
}

export function toggleLearnedLesson(learnedIds, lessonId) {
    return learnedIds.includes(lessonId)
        ? learnedIds.filter(id => id !== lessonId)
        : [...learnedIds, lessonId];
}

function readLearnedLessons(certId) {
    try {
        const value = JSON.parse(localStorage.getItem(certKey(certId, SUFFIXES.lessonsRead)) || '[]');
        return Array.isArray(value) ? value.filter(id => typeof id === 'string') : [];
    } catch {
        return [];
    }
}

function createHeading(text) {
    const heading = document.createElement('h2');
    heading.textContent = text;
    return heading;
}

function renderNotFound(container) {
    container.textContent = '';
    const message = document.createElement('p');
    message.className = 'lesson-not-found';
    message.textContent = 'レッスンが見つかりません';
    const link = document.createElement('a');
    link.className = 'lesson-back-link';
    link.href = 'syllabus.html';
    link.textContent = '学習範囲マップへ戻る';
    container.append(message, link);
}

function renderLessonMeta(container, lesson, section) {
    const meta = document.createElement('section');
    meta.className = 'lesson-meta';

    const sectionNumber = document.createElement('p');
    sectionNumber.className = 'lesson-section-number';
    sectionNumber.textContent = `セクション ${lesson.sectionRef}`;
    const sectionTitle = document.createElement('p');
    sectionTitle.className = 'lesson-section-title';
    sectionTitle.textContent = section?.title || 'セクション情報未設定';
    const codes = document.createElement('p');
    codes.className = 'problem-syllabus-info';
    codes.textContent = [section?.loCode && `LO: ${section.loCode}`, section?.kLevel && `Kレベル: ${section.kLevel}`]
        .filter(Boolean)
        .join(' ・ ') || '参照コード未設定';

    meta.append(sectionNumber, sectionTitle, codes);
    container.appendChild(meta);
}

function renderBody(container, body) {
    body.forEach(block => {
        const heading = document.createElement('h3');
        heading.textContent = block.heading;
        container.appendChild(heading);
        block.paragraphs.forEach(text => {
            const paragraph = document.createElement('p');
            paragraph.textContent = text;
            container.appendChild(paragraph);
        });
    });
}

function renderKeyPoints(container, keyPoints) {
    container.appendChild(createHeading('要点'));
    const list = document.createElement('ul');
    list.className = 'lesson-key-points';
    keyPoints.forEach(point => {
        const item = document.createElement('li');
        item.textContent = point;
        list.appendChild(item);
    });
    container.appendChild(list);
}

function renderExample(container, example) {
    container.appendChild(createHeading('例'));
    const scenario = document.createElement('p');
    scenario.className = 'lesson-example-scenario';
    scenario.textContent = example.scenario;
    const walkthrough = document.createElement('ol');
    walkthrough.className = 'lesson-walkthrough';
    example.walkthrough.forEach(step => {
        const item = document.createElement('li');
        item.textContent = step;
        walkthrough.appendChild(item);
    });
    container.append(scenario, walkthrough);
}

function renderRelatedQuestions(container, lesson, questions) {
    container.appendChild(createHeading('関連問題'));
    const questionsById = new Map(questions.map(question => [question.id, question]));
    const list = document.createElement('div');
    list.className = 'lesson-related-questions';
    lesson.relatedQuestionIds.forEach((questionId, index) => {
        const question = questionsById.get(questionId);
        if (question) list.appendChild(createQuestionCard(question, { headingText: `関連問題 ${index + 1}` }));
    });
    container.appendChild(list);
}

function renderLessonNavigation(container, adjacent) {
    const navigation = document.createElement('nav');
    navigation.className = 'lesson-section-nav';
    navigation.setAttribute('aria-label', '前後のレッスン');

    if (adjacent.previous) {
        const previous = document.createElement('a');
        previous.className = 'lesson-nav-link lesson-nav-link--previous';
        previous.href = `lesson.html?id=${encodeURIComponent(adjacent.previous.id)}`;
        previous.textContent = `前へ: ${adjacent.previous.sectionRef}`;
        navigation.appendChild(previous);
    }
    if (adjacent.next) {
        const next = document.createElement('a');
        next.className = 'lesson-nav-link lesson-nav-link--next';
        next.href = `lesson.html?id=${encodeURIComponent(adjacent.next.id)}`;
        next.textContent = `次へ: ${adjacent.next.sectionRef}`;
        navigation.appendChild(next);
    }
    container.appendChild(navigation);
}

function renderLearnedButton(container, certId, lessonId) {
    let learnedIds = readLearnedLessons(certId);
    const button = document.createElement('button');
    button.className = 'lesson-learned-button';

    const updateButton = () => {
        const isLearned = learnedIds.includes(lessonId);
        button.classList.toggle('is-learned', isLearned);
        button.setAttribute('aria-pressed', String(isLearned));
        button.textContent = isLearned ? '学習済みを解除' : '学習済みにする';
    };

    button.addEventListener('click', () => {
        learnedIds = toggleLearnedLesson(learnedIds, lessonId);
        localStorage.setItem(certKey(certId, SUFFIXES.lessonsRead), JSON.stringify(learnedIds));
        updateButton();
    });

    updateButton();
    container.appendChild(button);
}

async function initLessonPage() {
    setupCommonNavigation();
    setupBackToTopButtons();

    const container = document.getElementById('lesson-content');
    if (!container) return;
    const parsed = parseLessonId(new URLSearchParams(window.location.search).get('id'));
    if (!parsed) {
        renderNotFound(container);
        return;
    }

    const lessons = await fetchLessons(parsed.certId);
    const lesson = lessons.find(item => item.id === `${parsed.certId}-${parsed.sectionRef}`);
    if (!lesson) {
        renderNotFound(container);
        return;
    }

    const chapter = topicMaps[parsed.certId]?.find(item => item.chapter === lesson.chapter);
    const section = chapter?.sections.find(item => item.section === parsed.sectionRef);
    const questions = await fetchQuestions(parsed.certId);
    container.textContent = '';

    const backLink = document.createElement('a');
    backLink.className = 'lesson-back-link';
    backLink.href = 'syllabus.html';
    backLink.textContent = '学習範囲マップへ戻る';
    container.appendChild(backLink);

    renderLessonMeta(container, lesson, section);
    const title = document.createElement('h1');
    title.className = 'lesson-title';
    title.textContent = lesson.title;
    container.appendChild(title);
    renderBody(container, lesson.body);
    renderKeyPoints(container, lesson.keyPoints);
    renderExample(container, lesson.example);
    renderRelatedQuestions(container, lesson, questions);
    renderLessonNavigation(container, resolveAdjacentLessons(lessons, lesson.id));
    renderLearnedButton(container, parsed.certId, lesson.id);

    document.title = `${lesson.title} - JSTQB-Study`;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initLessonPage);
}
