// js/utils.js

const PAGE_TO_NAV = {
    'index.html': 'nav-home',
    '': 'nav-home',
    'release_notes.html': 'nav-home',
    'study.html': 'nav-quiz',
    'quiz.html': 'nav-quiz',
    'result.html': 'nav-quiz',
    'question.html': 'nav-quiz',
    'mock-exam.html': 'nav-quiz',
    'syllabus.html': 'nav-home',
    'ai-quiz.html': 'nav-ai',
    'glossary.html': 'nav-glossary',
};

const DISCLAIMER_LINES = [
    '本アプリは、ソフトウェアテスト学習を目的とした個人制作の非公式教材です。',
    'ISTQB、JSTQB、その他関連団体の公式教材、認定教材、認定トレーニングではありません。',
    '学習範囲の確認には、ISTQB/JSTQBが公開する公式シラバスおよび公式情報を参照してください。',
    '本アプリ内の説明、問題、解説は制作者による独自コンテンツです。',
];

export function setTextWithBreaks(el, text) {
    el.textContent = '';
    String(text).split(/\\n/).forEach((line, i, arr) => {
        el.appendChild(document.createTextNode(line));
        if (i < arr.length - 1) el.appendChild(document.createElement('br'));
    });
}

export function setupCommonNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || '';
    const activeId = PAGE_TO_NAV[currentPage];
    if (activeId) document.getElementById(activeId)?.classList.add('active');
    injectSettingsButton(currentPage);
    updateHeaderTitle();
    injectRightsDisclaimer();
}

function injectSettingsButton(currentPage) {
    if (currentPage === 'settings.html') return;
    const headerInner = document.querySelector('.header-inner');
    if (!headerInner || headerInner.querySelector('.header-settings-btn')) return;
    const btn = document.createElement('a');
    btn.href = 'settings.html';
    btn.className = 'header-settings-btn';
    btn.setAttribute('aria-label', '設定');
    btn.style.cssText = 'display:flex;align-items:center;color:var(--text-muted);padding:8px;margin-right:-8px;margin-left:auto;border-radius:var(--radius-sm);flex-shrink:0;';
    btn.innerHTML = '<span class="material-icons" style="font-size:22px;">settings</span>';
    headerInner.appendChild(btn);
}

function updateHeaderTitle() {
    const el = document.querySelector('.header-home-title');
    if (el) el.textContent = 'JSTQB-Study';
}

function injectRightsDisclaimer() {
    if (document.getElementById('rights-safety-disclaimer')) return;
    const footer = document.createElement('aside');
    footer.id = 'rights-safety-disclaimer';
    footer.setAttribute('aria-label', '非公式教材に関する注意');
    footer.style.cssText = 'margin:24px auto 88px;max-width:960px;padding:16px;color:var(--text-muted);font-size:0.78rem;line-height:1.7;border-top:1px solid var(--border);';
    DISCLAIMER_LINES.forEach(line => {
        const p = document.createElement('p');
        p.textContent = line;
        p.style.margin = '0 0 4px';
        footer.appendChild(p);
    });
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) bottomNav.insertAdjacentElement('beforebegin', footer);
    else document.body.appendChild(footer);
}

export function setupBackToTopButtons() {
    document.querySelectorAll('.back-to-top-button').forEach(btn => {
        btn.addEventListener('click', () => { window.location.href = 'index.html'; });
    });
}

const CERT_FILE_MAP = {
    'qa-basic': './questionsData.js',
    'alta': './questionsData_alta.js',
    'altm': './questionsData_altm.js',
};

export async function fetchQuestions() {
    const certId = localStorage.getItem('qa_selected_cert') || 'qa-basic';
    const file = CERT_FILE_MAP[certId] || CERT_FILE_MAP['qa-basic'];
    try {
        const { questions } = await import(file);
        return questions;
    } catch (err) {
        console.error('問題データの読み込みエラー:', err);
        return [];
    }
}
