// js/study.js
import { setupCommonNavigation, setupBackToTopButtons, fetchQuestions } from './utils.js';
import { getWrongQuestionIds } from './progress.js';
import { getExam } from './examContext.js';

const EXAM_INFO = {
    alta: {
        pageTitle: 'JSTQB-TA 試験について',
        overview: 'JSTQB Advanced Level テストアナリスト試験は、テスト設計・分析・実行の高度な専門知識を問う上級資格試験です。Foundation Levelの上位に位置します。',
        syllabusNote: '本アプリはシラバス Version 3.1.1.J03 対応です。ISTQB CTAL-TA v4.0 とは章立てが異なる場合があります。',
        scopeHeading: '試験範囲（6章）',
        scope: [
            'テストプロセスにおけるテストアナリストのタスク',
            'リスクベースドテストにおけるタスク',
            'テスト技法',
            'ソフトウェア品質特性のテスト',
            'レビュー',
            'テストツールおよび自動化',
        ],
        format: '形式：選択式（K1〜K4レベル混在）',
        requirements: [
            'JSTQB Foundation Level 合格が必須',
            'テストアナリストとしての実務経験3年以上が望ましい',
        ],
        passRates: [
            '2023年度：43.64%（103名／236名）',
            '2024年度：34.83%（147名／422名）',
        ],
        duration: '180分',
        totalQuestions: '90問',
        totalScore: '90点',
        kLevelDistribution: [
            { level: 'K1', questions: '10問', scorePerQuestion: '1点', totalScore: '10点' },
            { level: 'K2', questions: '30問', scorePerQuestion: '1点', totalScore: '30点' },
            { level: 'K3', questions: '30問', scorePerQuestion: '1点', totalScore: '30点' },
            { level: 'K4', questions: '20問', scorePerQuestion: '1点', totalScore: '20点' },
        ],
        chapterDistribution: [
            { chapter: '1章', kLevel: 'K1-K4', questions: '20問', scorePerQuestion: '1点', totalScore: '20点' },
            { chapter: '2章', kLevel: 'K1-K4', questions: '15問', scorePerQuestion: '1点', totalScore: '15点' },
            { chapter: '3章', kLevel: 'K1-K4', questions: '25問', scorePerQuestion: '1点', totalScore: '25点' },
            { chapter: '4章', kLevel: 'K1-K4', questions: '20問', scorePerQuestion: '1点', totalScore: '20点' },
            { chapter: '5章', kLevel: 'K1-K4', questions: '10問', scorePerQuestion: '1点', totalScore: '10点' },
        ],
    },
    altm: {
        pageTitle: 'JSTQB-TM 試験について',
        overview: 'JSTQB Advanced Level テストマネージャ試験は、テストプロジェクトのマネジメントに必要な高度な専門知識を問う上級資格試験です。Foundation Levelの上位に位置します。',
        syllabusNote: '本アプリはシラバス V3.0.J03 対応です。',
        scopeHeading: '試験範囲（3章）',
        scope: [
            'テストマネジメント',
            'リスクベースドテストおよびその他のテストの優先順位づけアプローチ',
            'テストドキュメント',
        ],
        format: '形式：選択式（K2〜K4レベル混在）',
        requirements: [
            'JSTQB Foundation Level 合格が必須',
            'テストマネージャとしての実務経験3年以上が望ましい',
        ],
        passRates: [
            '試験実施状況については JSTQB 公式サイトをご確認ください。',
        ],
        duration: '180分',
        totalQuestions: '65問',
        totalScore: '65点',
        kLevelDistribution: [
            { level: 'K2', questions: '36問', scorePerQuestion: '1点', totalScore: '36点' },
            { level: 'K3', questions: '5問', scorePerQuestion: '1点', totalScore: '5点' },
            { level: 'K4', questions: '7問', scorePerQuestion: '1点', totalScore: '7点' },
        ],
        chapterDistribution: [
            { chapter: '1章', kLevel: 'K2-K4', questions: '34問', scorePerQuestion: '1点', totalScore: '34点' },
            { chapter: '2章', kLevel: 'K2-K4', questions: '18問', scorePerQuestion: '1点', totalScore: '18点' },
            { chapter: '3章', kLevel: 'K2-K4', questions: '13問', scorePerQuestion: '1点', totalScore: '13点' },
        ],
    },
};

const examInfo = EXAM_INFO[getExam()] ?? EXAM_INFO.alta;

export function shuffleQuestions(questions) {
    const arr = [...questions];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function clearQuizSession() {
    localStorage.removeItem('quizQuestions');
    localStorage.removeItem('quizNextIndex');
    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('correctAnswersCount');
    localStorage.removeItem('quizAnswerLog');
    localStorage.removeItem('quizPaused');
}

function startQuiz(questions) {
    clearQuizSession();
    localStorage.setItem('quizQuestions', JSON.stringify(questions));
    localStorage.setItem('quizNextIndex', '0');
    localStorage.setItem('correctAnswersCount', '0');
    window.location.href = 'quiz.html';
}

function hasPausedSession() {
    const paused = localStorage.getItem('quizPaused') === 'true';
    const nextIndex = parseInt(localStorage.getItem('quizNextIndex') || '0', 10);
    const saved = localStorage.getItem('quizQuestions');
    return paused && nextIndex > 0 && !!saved;
}

function renderResumeSection() {
    const section = document.getElementById('resume-quiz-section');
    if (!section) return;
    if (hasPausedSession()) {
        const total = JSON.parse(localStorage.getItem('quizQuestions')).length;
        const nextIndex = parseInt(localStorage.getItem('quizNextIndex') || '0', 10);
        const correct = parseInt(localStorage.getItem('correctAnswersCount') || '0', 10);
        const progressText = document.getElementById('resume-progress-text');
        if (progressText) progressText.textContent = `${nextIndex}/${total}問完了・正解${correct}問`;
        section.style.display = 'block';
    } else {
        section.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    initStudyScreen();
    renderWeakQuizSection();
    renderResumeSection();

    // 再開ボタン
    document.getElementById('resume-quiz-button')?.addEventListener('click', () => {
        localStorage.removeItem('quizPaused');
        window.location.href = 'quiz.html';
    });

    // 破棄ボタン
    document.getElementById('discard-quiz-button')?.addEventListener('click', () => {
        if (confirm('中断中のクイズを破棄しますか？進捗は失われます。')) {
            clearQuizSession();
            renderResumeSection();
        }
    });

    // 全問クイズ開始
    const startBtn = document.getElementById('start-actual-quiz-button');
    const shuffleCheckbox = document.getElementById('shuffle-quiz-checkbox');
    if (startBtn) {
        startBtn.addEventListener('click', async () => {
            if (hasPausedSession() && !confirm('中断中のクイズがあります。最初から始めると進捗が失われます。よろしいですか？')) return;
            const questions = await fetchQuestions();
            if (!questions.length) { console.error('問題データの読み込みに失敗しました。'); return; }
            const quizQuestions = shuffleCheckbox?.checked ? shuffleQuestions(questions) : questions;
            startQuiz(quizQuestions);
        });
    }

    // 苦手問題クイズ開始
    const weakBtn = document.getElementById('start-weak-quiz-button');
    if (weakBtn) {
        weakBtn.addEventListener('click', async () => {
            if (hasPausedSession() && !confirm('中断中のクイズがあります。苦手問題クイズを始めると進捗が失われます。よろしいですか？')) return;
            const wrongIds = getWrongQuestionIds();
            if (!wrongIds.length) {
                alert('苦手問題がまだ記録されていません。まず全問クイズに挑戦してください。');
                return;
            }
            const allQuestions = await fetchQuestions();
            const wrongQuestions = allQuestions.filter(q => wrongIds.includes(q.id));
            if (!wrongQuestions.length) {
                alert('苦手問題が見つかりません。');
                return;
            }
            startQuiz(shuffleQuestions(wrongQuestions));
        });
    }
});

export function initStudyScreen() {
    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };

    setText('exam-page-title', examInfo.pageTitle);
    setText('exam-overview', examInfo.overview);
    setText('exam-syllabus-note', examInfo.syllabusNote);
    setText('exam-duration', examInfo.duration);
    setText('exam-total-questions', examInfo.totalQuestions);
    setText('exam-format', examInfo.format);

    const scopeHeading = document.getElementById('exam-scope-heading');
    if (scopeHeading) scopeHeading.textContent = examInfo.scopeHeading;

    const scopeList = document.getElementById('exam-scope-list');
    if (scopeList) {
        scopeList.innerHTML = '';
        examInfo.scope.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            scopeList.appendChild(li);
        });
    }

    const reqList = document.getElementById('exam-requirements-list');
    if (reqList) {
        reqList.innerHTML = '';
        examInfo.requirements.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            reqList.appendChild(li);
        });
    }

    const passRates = document.getElementById('exam-pass-rates');
    if (passRates) {
        passRates.innerHTML = '';
        examInfo.passRates.forEach(text => {
            const p = document.createElement('p');
            p.textContent = text;
            passRates.appendChild(p);
        });
    }

    const kLevelTbody = document.querySelector('#k-level-distribution-table tbody');
    if (kLevelTbody) {
        kLevelTbody.innerHTML = '';
        examInfo.kLevelDistribution.forEach(item => {
            const row = kLevelTbody.insertRow();
            [item.level, item.questions, item.scorePerQuestion, item.totalScore].forEach(val => {
                row.insertCell().textContent = val;
            });
        });
    }

    const chapterTbody = document.querySelector('#chapter-distribution-table tbody');
    if (chapterTbody) {
        chapterTbody.innerHTML = '';
        examInfo.chapterDistribution.forEach(item => {
            const row = chapterTbody.insertRow();
            [item.chapter, item.kLevel, item.questions, item.scorePerQuestion, item.totalScore].forEach(val => {
                row.insertCell().textContent = val;
            });
        });
    }
}

function renderWeakQuizSection() {
    const section = document.getElementById('weak-quiz-section');
    if (!section) return;
    const wrongIds = getWrongQuestionIds();
    const countEl = document.getElementById('weak-question-count');
    if (countEl) countEl.textContent = wrongIds.length;
    section.style.display = wrongIds.length > 0 ? 'block' : 'none';
}
