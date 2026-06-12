// js/main.js - ホーム画面の初期化
import { setupCommonNavigation, setupBackToTopButtons, fetchQuestions } from './utils.js';
import { getDashboardStats, getWrongQuestionIds } from './progress.js';
import { topicMaps } from './topicMap.js';
import { CERTIFICATIONS, getSelectedCert, setSelectedCert } from './certifications.js';
import { certKey, SUFFIXES } from './storage.js';
import { aggregateChapterStats } from './chapterStats.js';

document.addEventListener('DOMContentLoaded', async () => {
    setupCommonNavigation();
    setupBackToTopButtons();
    renderCertSelector();
    await renderDashboard();
});

function renderCertSelector() {
    const container = document.getElementById('cert-cards');
    if (!container) return;
    const selectedId = getSelectedCert();

    container.textContent = '';
    CERTIFICATIONS.forEach(cert => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'cert-card' + (cert.id === selectedId ? ' cert-card--active' : '') + (!cert.available ? ' cert-card--disabled' : '');
        card.disabled = !cert.available;
        const nameEl = document.createElement('span');
        nameEl.className = 'cert-card-name';
        nameEl.textContent = cert.name;

        const levelEl = document.createElement('span');
        levelEl.className = `cert-card-level cert-card-level--${cert.level}`;
        levelEl.textContent = levelLabel(cert.level);

        const descEl = document.createElement('span');
        descEl.className = 'cert-card-desc';
        descEl.textContent = cert.description;

        const statusEl = document.createElement('span');
        if (cert.available) {
            statusEl.className = 'cert-card-count';
            statusEl.textContent = `${cert.questionCount}問`;
        } else {
            statusEl.className = 'cert-card-coming';
            statusEl.textContent = '近日公開';
        }

        card.append(nameEl, levelEl, descEl, statusEl);
        card.addEventListener('click', async () => {
            setSelectedCert(cert.id);
            container.querySelectorAll('.cert-card').forEach(c => c.classList.remove('cert-card--active'));
            card.classList.add('cert-card--active');
            await renderDashboard();
        });
        container.appendChild(card);
    });
}

function levelLabel(level) {
    const labels = { foundation: '基礎', advanced: '上級', specialist: '専門' };
    return labels[level] || level;
}

function readStoredIds(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function renderChapterHeatmap(questions, certId, map) {
    const section = document.getElementById('chapter-heatmap-section');
    const container = document.getElementById('chapter-heatmap');
    if (!section || !container) return;

    const answeredIds = readStoredIds(certKey(certId, SUFFIXES.answeredIds));
    const stats = aggregateChapterStats(questions, answeredIds, getWrongQuestionIds());
    container.textContent = '';
    section.hidden = stats.length === 0;
    if (!stats.length) return;

    stats.forEach(stat => {
        const tile = document.createElement('button');
        const level = stat.achievement >= 75 ? 'high' : stat.achievement >= 40 ? 'medium' : 'low';
        const chapterInfo = map.find(item => String(item.chapter) === stat.chapter);
        tile.type = 'button';
        tile.className = `chapter-heatmap-tile chapter-heatmap-tile--${level}`;
        tile.setAttribute('aria-label', `${stat.chapter}章 ${chapterInfo?.title || ''} ${stat.achievement}%`);

        const chapter = document.createElement('span');
        chapter.className = 'chapter-heatmap-number';
        chapter.textContent = `${stat.chapter}章`;
        const achievement = document.createElement('strong');
        achievement.className = 'chapter-heatmap-value';
        achievement.textContent = `${stat.achievement}%`;
        const detail = document.createElement('span');
        detail.className = 'chapter-heatmap-detail';
        detail.textContent = `回答 ${stat.answered}/${stat.total}`;

        tile.append(chapter, achievement, detail);
        tile.addEventListener('click', () => {
            window.location.href = `study.html?chapter=${encodeURIComponent(stat.chapter)}`;
        });
        container.appendChild(tile);
    });
}

async function renderDashboard() {
    const certId = getSelectedCert();
    const cert = CERTIFICATIONS.find(c => c.id === certId) || CERTIFICATIONS[0];
    const map = topicMaps[cert.id] || topicMaps.fl;

    const questions = await fetchQuestions();
    const totalQuestions = questions.length;
    const { todayAnswered, todayCorrect, accuracy, streak, totalAnswered } = getDashboardStats();

    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };
    setText('action-desc-quiz', `${cert.name}の自作問題 ${totalQuestions}問で確認`);
    setText('action-desc-problems', `全${totalQuestions}問・独自解説付き`);
    setText('action-desc-syllabus', `${cert.name}: ${map.length}章のマップとレッスン`);
    setText('info-syllabus-version', `${cert.fullName} ・ 自作問題${totalQuestions}問`);
    setText('greeting-sub', cert.fullName);
    setText('stat-answered', todayAnswered);
    setText('stat-correct', todayCorrect);
    setText('stat-accuracy', accuracy !== null ? `${accuracy}%` : '—');
    setText('streak-count', streak);

    const pct = totalQuestions > 0 ? Math.min(Math.round((totalAnswered / totalQuestions) * 100), 100) : 0;
    const bar = document.getElementById('progress-bar-fill');
    if (bar) bar.style.width = `${pct}%`;
    setText('progress-note', `全${totalQuestions}問中 ${Math.min(totalAnswered, totalQuestions)}問 回答済み`);

    const weakBadge = document.getElementById('weak-badge');
    if (weakBadge) {
        const wrongCount = getWrongQuestionIds().length;
        weakBadge.textContent = `復習 ${wrongCount}問`;
        weakBadge.style.display = wrongCount > 0 ? 'inline-block' : 'none';
    }

    renderChapterHeatmap(questions, certId, map);
}
