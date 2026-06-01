// js/mock-exam.js — 模擬試験ロジック

import { setupCommonNavigation, setupBackToTopButtons } from './utils.js';
import { mockExamQuestions } from './mockExamData_alta.js';

const EXAM_DURATION = 75 * 60; // 75分（秒）

let currentIndex = 0;
let userAnswers = new Array(mockExamQuestions.length).fill(null);
let timerInterval = null;
let remainingSeconds = EXAM_DURATION;
let examStarted = false;
let examFinished = false;
let elapsedSeconds = 0;

document.addEventListener('DOMContentLoaded', () => {
    setupCommonNavigation();
    setupBackToTopButtons();

    document.getElementById('start-btn').addEventListener('click', startExam);
    document.getElementById('exam-prev-btn').addEventListener('click', () => navigateTo(currentIndex - 1));
    document.getElementById('exam-next-btn').addEventListener('click', () => navigateTo(currentIndex + 1));
    document.getElementById('exam-submit-btn').addEventListener('click', confirmSubmit);
    document.getElementById('retry-btn').addEventListener('click', resetExam);
    document.getElementById('header-back-btn').addEventListener('click', handleBack);

    buildNavGrid();
});

function handleBack(e) {
    if (examStarted && !examFinished) {
        if (!confirm('試験を中断してホームに戻りますか？\n（進捗は保存されません）')) {
            e.preventDefault();
        }
    }
}

function startExam() {
    examStarted = true;
    showSection('exam-screen');
    renderQuestion(0);
    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        remainingSeconds--;
        elapsedSeconds++;
        updateTimerDisplay();
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            finishExam(true);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const min = Math.floor(remainingSeconds / 60);
    const sec = remainingSeconds % 60;
    const display = document.getElementById('timer-display');
    const timerEl = document.getElementById('exam-timer');
    if (display) display.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    if (timerEl) {
        timerEl.classList.remove('warning', 'danger');
        if (remainingSeconds <= 60) timerEl.classList.add('danger');
        else if (remainingSeconds <= 600) timerEl.classList.add('warning');
    }
}

function buildNavGrid() {
    const grid = document.getElementById('exam-nav-grid');
    if (!grid) return;
    grid.innerHTML = '';
    mockExamQuestions.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'exam-nav-btn';
        btn.textContent = i + 1;
        btn.addEventListener('click', () => navigateTo(i));
        grid.appendChild(btn);
    });
}

function updateNavGrid() {
    const grid = document.getElementById('exam-nav-grid');
    if (!grid) return;
    const btns = grid.querySelectorAll('.exam-nav-btn');
    btns.forEach((btn, i) => {
        btn.classList.toggle('answered', userAnswers[i] !== null);
        btn.classList.toggle('current', i === currentIndex);
    });
}

function navigateTo(index) {
    if (index < 0 || index >= mockExamQuestions.length) return;
    currentIndex = index;
    renderQuestion(index);
}

function renderQuestion(index) {
    const q = mockExamQuestions[index];
    currentIndex = index;

    // Progress
    const answered = userAnswers.filter(a => a !== null).length;
    const pct = Math.round((answered / mockExamQuestions.length) * 100);
    const fill = document.getElementById('exam-progress-fill');
    const text = document.getElementById('exam-progress-text');
    if (fill) fill.style.width = `${pct}%`;
    if (text) text.textContent = `${index + 1} / ${mockExamQuestions.length}`;

    // Meta tags
    const meta = document.getElementById('exam-question-meta');
    if (meta) {
        meta.innerHTML = `
            <span class="exam-meta-tag">第${q.syllabusChapter}章</span>
            <span class="exam-meta-tag">${q.kLevel}</span>
            <span class="exam-meta-tag">第${index + 1}問</span>
        `;
    }

    // Question body — static controlled HTML only
    const body = document.getElementById('exam-question-body');
    if (body) {
        if (q.questionHtml) {
            body.innerHTML = q.questionHtml;
        } else {
            body.textContent = q.question || '';
        }
    }

    // Choices
    const choicesEl = document.getElementById('exam-choices');
    if (choicesEl) {
        choicesEl.innerHTML = '';
        const letters = ['a', 'b', 'c', 'd'];
        q.choices.forEach((choice, ci) => {
            const label = document.createElement('label');
            label.className = 'exam-choice-label';
            if (userAnswers[index] === letters[ci]) label.classList.add('selected');

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'exam-answer';
            radio.value = letters[ci];
            if (userAnswers[index] === letters[ci]) radio.checked = true;
            radio.addEventListener('change', () => selectAnswer(letters[ci]));

            const span = document.createElement('span');
            span.className = 'exam-choice-text';
            span.textContent = choice;

            label.appendChild(radio);
            label.appendChild(span);
            label.addEventListener('click', () => {
                document.querySelectorAll('#exam-choices .exam-choice-label').forEach(l => l.classList.remove('selected'));
                label.classList.add('selected');
            });
            choicesEl.appendChild(label);
        });
    }

    // Warning
    document.getElementById('exam-warning')?.classList.add('hidden');

    // Prev/Next buttons
    const prevBtn = document.getElementById('exam-prev-btn');
    const nextBtn = document.getElementById('exam-next-btn');
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) {
        if (index === mockExamQuestions.length - 1) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = '';
            nextBtn.disabled = false;
        }
    }

    // Unanswered hint
    const unanswered = userAnswers.filter(a => a === null).length;
    const hint = document.getElementById('unanswered-hint');
    if (hint) {
        hint.textContent = unanswered > 0
            ? `未回答：${unanswered}問（採点ボタンで全問採点）`
            : 'すべての問題に回答しました';
    }

    updateNavGrid();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectAnswer(letter) {
    userAnswers[currentIndex] = letter;
    updateNavGrid();

    const unanswered = userAnswers.filter(a => a === null).length;
    const hint = document.getElementById('unanswered-hint');
    if (hint) {
        hint.textContent = unanswered > 0
            ? `未回答：${unanswered}問（採点ボタンで全問採点）`
            : 'すべての問題に回答しました';
    }

    const pct = Math.round((userAnswers.filter(a => a !== null).length / mockExamQuestions.length) * 100);
    const fill = document.getElementById('exam-progress-fill');
    if (fill) fill.style.width = `${pct}%`;
}

function confirmSubmit() {
    const unanswered = userAnswers.filter(a => a === null).length;
    const msg = unanswered > 0
        ? `まだ${unanswered}問が未回答です。このまま採点しますか？`
        : '全問回答済みです。採点しますか？';
    if (confirm(msg)) finishExam(false);
}

function finishExam(timeUp) {
    examFinished = true;
    clearInterval(timerInterval);
    if (timeUp) alert('時間になりました。採点します。');
    renderResult();
    showSection('result-screen');
}

function renderResult() {
    const total = mockExamQuestions.length;
    let correct = 0;
    const chapterStats = {};

    mockExamQuestions.forEach((q, i) => {
        const isCorrect = userAnswers[i] === q.correctAnswerLetter;
        if (isCorrect) correct++;

        const ch = q.syllabusChapter;
        if (!chapterStats[ch]) chapterStats[ch] = { correct: 0, total: 0 };
        chapterStats[ch].total++;
        if (isCorrect) chapterStats[ch].correct++;
    });

    const acc = Math.round((correct / total) * 100);
    const passed = correct >= 30;

    const scoreEl = document.getElementById('result-score');
    const accEl = document.getElementById('result-accuracy');
    const gradeEl = document.getElementById('result-grade');
    const timeEl = document.getElementById('result-time');
    const badgeEl = document.getElementById('score-badge');

    if (scoreEl) scoreEl.textContent = `${correct}/${total}`;
    if (accEl) accEl.textContent = `${acc}%`;
    if (gradeEl) {
        gradeEl.className = passed ? 'exam-pass' : 'exam-fail';
        gradeEl.textContent = passed ? '合格ライン達成！' : '不合格（65%未満）';
    }
    if (badgeEl) {
        badgeEl.style.borderColor = passed ? 'var(--success)' : 'var(--error)';
        badgeEl.style.background = passed ? 'var(--success-light)' : 'var(--error-light)';
        const valEl = badgeEl.querySelector('.exam-score-value');
        if (valEl) valEl.style.color = passed ? 'var(--success)' : 'var(--error)';
    }

    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    if (timeEl) timeEl.textContent = `所要時間：${mins}分${secs}秒`;

    // 章別成績
    const chapterNames = {
        '1': '第1章 テストプロセス',
        '2': '第2章 リスクベースドテスト',
        '3': '第3章 テスト技法',
        '4': '第4章 品質特性',
        '5': '第5章 レビュー',
        '6': '第6章 テストツール',
    };
    const summaryEl = document.getElementById('chapter-summary');
    if (summaryEl) {
        summaryEl.innerHTML = '<p style="font-weight:700;font-size:0.9em;margin:0 0 10px;">章別成績</p>';
        Object.entries(chapterStats).sort((a, b) => a[0].localeCompare(b[0])).forEach(([ch, stat]) => {
            const pct = Math.round((stat.correct / stat.total) * 100);
            const row = document.createElement('div');
            row.className = 'exam-chapter-row';
            row.innerHTML = `
                <span style="min-width:150px;font-size:0.82em;">${chapterNames[ch] || '第' + ch + '章'}</span>
                <div class="exam-chapter-bar-wrap">
                    <div class="exam-chapter-bar-fill" style="width:${pct}%;background:${pct >= 65 ? 'var(--success)' : 'var(--error)'}"></div>
                </div>
                <span style="min-width:55px;text-align:right;font-size:0.82em;">${stat.correct}/${stat.total}（${pct}%）</span>
            `;
            summaryEl.appendChild(row);
        });
    }

    // 解説
    const reviewEl = document.getElementById('result-review');
    if (reviewEl) {
        reviewEl.innerHTML = '';
        mockExamQuestions.forEach((q, i) => {
            const isCorrect = userAnswers[i] === q.correctAnswerLetter;
            const userAns = userAnswers[i] ? userAnswers[i].toUpperCase() : '未回答';
            const correctAns = q.correctAnswerLetter.toUpperCase();

            const card = document.createElement('div');
            card.className = 'exam-result-card';

            const header = document.createElement('div');
            header.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:10px;';
            header.innerHTML = `
                <span class="material-icons" style="color:${isCorrect ? 'var(--success)' : 'var(--error)'};font-size:20px;">
                    ${isCorrect ? 'check_circle' : 'cancel'}
                </span>
                <span style="font-weight:700;font-size:0.9em;">第${i + 1}問（第${q.syllabusChapter}章・${q.kLevel}）</span>
            `;
            card.appendChild(header);

            // Question text (same static HTML)
            const qBody = document.createElement('div');
            qBody.className = 'exam-question-body';
            qBody.style.cssText = 'font-size:0.85em;margin-bottom:10px;max-height:200px;overflow:hidden;position:relative;';
            if (q.questionHtml) {
                qBody.innerHTML = q.questionHtml;
            } else {
                qBody.textContent = q.question || '';
            }
            card.appendChild(qBody);

            // Answer summary
            const ansDiv = document.createElement('div');
            ansDiv.className = 'exam-result-answer';
            ansDiv.innerHTML = `
                <span style="font-size:0.85em;">あなたの解答：<strong class="${isCorrect ? 'exam-result-correct' : 'exam-result-wrong'}">${userAns}</strong></span>
                ${!isCorrect ? `<span style="font-size:0.85em;">正解：<strong class="exam-result-correct">${correctAns}</strong></span>` : ''}
            `;
            card.appendChild(ansDiv);

            // Explanation
            const expDiv = document.createElement('div');
            expDiv.className = 'exam-explanation';
            expDiv.textContent = q.explanation;
            card.appendChild(expDiv);

            reviewEl.appendChild(card);
        });
    }
}

function resetExam() {
    currentIndex = 0;
    userAnswers = new Array(mockExamQuestions.length).fill(null);
    remainingSeconds = EXAM_DURATION;
    elapsedSeconds = 0;
    examStarted = false;
    examFinished = false;
    clearInterval(timerInterval);
    const display = document.getElementById('timer-display');
    if (display) display.textContent = '75:00';
    buildNavGrid();
    showSection('start-screen');
    window.scrollTo({ top: 0 });
}

function showSection(id) {
    ['start-screen', 'exam-screen', 'result-screen'].forEach(s => {
        document.getElementById(s)?.classList.add('hidden');
    });
    document.getElementById(id)?.classList.remove('hidden');
}
