// js/utils.js

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

export function setupCommonNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || '';
    const activeId = PAGE_TO_NAV[currentPage];
    if (activeId) {
        document.getElementById(activeId)?.classList.add('active');
    }
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
        const { assumedProblems } = await import('./assumedProblemsData.js');
        return assumedProblems;
    } catch (err) {
        console.error('想定問題データの読み込みエラー:', err);
        return [];
    }
}
