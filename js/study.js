// js/study.js
import { setupCommonNavigation, setupBackToTopButtons, fetchQuestions } from './utils.js';
import { getWrongQuestionIds } from './progress.js';

const SESSION_KEYS = {
    questions: 'qa_basic_quiz_questions',
    nextIndex: 'qa_basic_quiz_next_index',
    correctCount: 'qa_basic_quiz_correct_count',
    answerLog: 'qa_basic_quiz_answer_log',
    paused: 'qa_basic_quiz_paused',
};

const COURSE_INFO = {
    pageTitle: 'QA基礎コース',
    overview: '新卒・初学者が、ソフトウェアの品質確認を現場の場面と結び付けて学ぶための個人制作コースです。資格試験の模擬教材ではありません。',
    note: '章番号・節番号・LOコード・Kレベルは学習範囲を探すための参照情報です。公式情報は必ず公開元の資料で確認してください。',
    topics: ['テストの目的と期待結果', '入力値のグループ分けと境界の確認', '状態変化と変更後の確認', 'リスクに応じた優先順位', '伝わる不具合報告とレビュー'],
};

export function shuffleQuestions(questions) {
    const arr = [...questions];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function clearQuizSession() {
    Object.values(SESSION_KEYS).forEach(key => localStorage.removeItem(key));
}

function startQuiz(questions) {
    clearQuizSession();
    localStorage.setItem(SESSION_KEYS.questions, JSON.stringify(questions));
    localStorage.setItem(SESSION_KEYS.nextIndex, '0');
    localStorage.setItem(SESSION_KEYS.correctCount, '0');
    window.location.href = 'quiz.html';
}

function hasPausedSession() {
    const nextIndex = parseInt(localStorage.getItem(SESSION_KEYS.nextIndex) || '0', 10);
    return localStorage.getItem(SESSION_KEYS.paused) === 'true'
        && nextIndex > 0
        && !!localStorage.getItem(SESSION_KEYS.questions);
}

function renderResumeSection() {
    const section = document.getElementById('resume-quiz-section');
    if (!section) return;
    if (!hasPausedSession()) {
        section.style.display = 'none';
        return;
    }
    const total = JSON.parse(localStorage.getItem(SESSION_KEYS.questions) || '[]').length;
    const nextIndex = parseInt(localStorage.getItem(SESSION_KEYS.nextIndex) || '0', 10);
    const correct = parseInt(localStorage.getItem(SESSION_KEYS.correctCount) || '0', 10);
    const progress = document.getElementById('resume-progress-text');
    if (progress) progress.textContent = `${nextIndex}/${total}問完了・正解${correct}問`;
    section.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    initStudyScreen();
    renderWeakQuizSection();
    renderResumeSection();

    document.getElementById('resume-quiz-button')?.addEventListener('click', () => {
        localStorage.removeItem(SESSION_KEYS.paused);
        window.location.href = 'quiz.html';
    });
    document.getElementById('discard-quiz-button')?.addEventListener('click', () => {
        if (confirm('中断中のクイズを破棄しますか？')) {
            clearQuizSession();
            renderResumeSection();
        }
    });

    document.getElementById('start-actual-quiz-button')?.addEventListener('click', async () => {
        if (hasPausedSession() && !confirm('中断中のクイズを破棄して最初から始めますか？')) return;
        const questions = await fetchQuestions();
        if (!questions.length) return;
        const shouldShuffle = document.getElementById('shuffle-quiz-checkbox')?.checked;
        startQuiz(shouldShuffle ? shuffleQuestions(questions) : questions);
    });

    document.getElementById('start-weak-quiz-button')?.addEventListener('click', async () => {
        const wrongIds = getWrongQuestionIds();
        if (!wrongIds.length) {
            alert('復習対象はまだありません。まずQA基礎クイズに挑戦してください。');
            return;
        }
        const questions = (await fetchQuestions()).filter(q => wrongIds.includes(q.id));
        if (questions.length) startQuiz(shuffleQuestions(questions));
    });
});

export function initStudyScreen() {
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };
    setText('exam-page-title', COURSE_INFO.pageTitle);
    setText('exam-overview', COURSE_INFO.overview);
    setText('exam-syllabus-note', COURSE_INFO.note);
    setText('exam-scope-heading', 'このコースで扱う内容');
    setText('exam-duration', '自分のペースで進められます');
    setText('exam-total-questions', '自作問題を収録');
    setText('exam-format', '4択クイズと短時間の復習チャレンジで理解を確認します。');

    const scope = document.getElementById('exam-scope-list');
    if (scope) {
        scope.textContent = '';
        COURSE_INFO.topics.forEach(text => {
            const li = document.createElement('li');
            li.textContent = text;
            scope.appendChild(li);
        });
    }
    const requirements = document.getElementById('exam-requirements-list');
    if (requirements) {
        requirements.textContent = '';
        const item = document.createElement('li');
        item.textContent = '前提資格はありません。ソフトウェア開発やQAに関心がある初学者向けです。';
        requirements.appendChild(item);
    }
    const passRates = document.getElementById('exam-pass-rates');
    if (passRates) passRates.textContent = '合否判定はありません。誤答した問題を復習し、説明できる状態を目指します。';

    ['k-level-distribution-table', 'chapter-distribution-table'].forEach(id => {
        const table = document.getElementById(id);
        if (table) table.closest('.exam-info-section').style.display = 'none';
    });
    const headings = document.querySelectorAll('.exam-info-section > h3');
    headings.forEach(heading => {
        if (heading.textContent === '試験概要') heading.textContent = '学習方法';
        if (heading.textContent === '受験資格') heading.textContent = '対象者';
        if (heading.textContent === '合格率') heading.textContent = '学習の目安';
    });
}

function renderWeakQuizSection() {
    const section = document.getElementById('weak-quiz-section');
    if (!section) return;
    const count = getWrongQuestionIds().length;
    const countEl = document.getElementById('weak-question-count');
    if (countEl) countEl.textContent = count;
    section.style.display = count > 0 ? 'block' : 'none';
}
