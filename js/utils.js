// js/utils.js

import { getExam, setExam } from './examContext.js';

const PAGE_TO_NAV = {
    'index.html': 'nav-home',
    '': 'nav-home',
    'release_notes.html': 'nav-home',
    'study.html': 'nav-quiz',
    'quiz.html': 'nav-quiz',
    'result.html': 'nav-quiz',
    'question.html': 'nav-quiz',
    'syllabus.html': 'nav-home',
    'ai-quiz.html': 'nav-ai',
    'glossary.html': 'nav-glossary',
};

const EXAM_LABELS = {
    alta: 'JSTQB-TA 学習',
    altm: 'JSTQB-TM 学習',
};

export function setupCommonNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || '';
    const activeId = PAGE_TO_NAV[currentPage];
    if (activeId) {
        document.getElementById(activeId)?.classList.add('active');
    }
    injectExamTabs();
    updateHeaderTitle();
}

function injectExamTabs() {
    const header = document.querySelector('.app-header');
    if (!header || document.querySelector('.exam-tabs')) return;

    const exam = getExam();
    const tabBar = document.createElement('nav');
    tabBar.className = 'exam-tabs';
    tabBar.setAttribute('aria-label', '試験種別');

    ['alta', 'altm'].forEach(key => {
        const btn = document.createElement('button');
        btn.className = 'exam-tab' + (exam === key ? ' active' : '');
        btn.textContent = key === 'alta' ? 'Test Analyst' : 'Test Management';
        btn.setAttribute('aria-pressed', String(exam === key));
        btn.addEventListener('click', () => {
            if (getExam() === key) return;
            setExam(key);
            window.location.reload();
        });
        tabBar.appendChild(btn);
    });

    header.insertAdjacentElement('afterend', tabBar);
}

function updateHeaderTitle() {
    const exam = getExam();
    const label = EXAM_LABELS[exam];
    const el = document.querySelector('.header-home-title, .header-title');
    if (el) el.textContent = label;
}

export function setupBackToTopButtons() {
    document.querySelectorAll('.back-to-top-button').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    });
}

export async function fetchQuestions() {
    try {
        const exam = getExam();
        const mod = exam === 'altm'
            ? await import('./assumedProblemsData_altm.js')
            : await import('./assumedProblemsData_alta.js');
        return mod.assumedProblems;
    } catch (err) {
        console.error('想定問題データの読み込みエラー:', err);
        return [];
    }
}
