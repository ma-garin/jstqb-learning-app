import { describe, it, expect, beforeEach } from 'vitest';
import { fetchQuestions, setTextWithBreaks } from '../js/utils.js';
import { setSelectedCert } from '../js/certifications.js';

describe('setTextWithBreaks', () => {
    let el;

    beforeEach(() => {
        el = document.createElement('p');
    });

    it('改行のないテキストをセットする', () => {
        setTextWithBreaks(el, 'テストテキスト');
        expect(el.textContent).toBe('テストテキスト');
        expect(el.querySelector('br')).toBeNull();
    });

    it('\\nリテラル（バックスラッシュ+n）で改行を挿入する', () => {
        // setTextWithBreaks は /\\n/ (バックスラッシュ+n の2文字) を分割する
        setTextWithBreaks(el, '行1\x5cn行2\x5cn行3');
        const brs = el.querySelectorAll('br');
        expect(brs).toHaveLength(2);
        expect(el.textContent).toBe('行1行2行3');
    });

    it('既存のコンテンツをクリアしてからセットする', () => {
        el.textContent = '古いコンテンツ';
        setTextWithBreaks(el, '新しいコンテンツ');
        expect(el.textContent).toBe('新しいコンテンツ');
    });

    it('空文字列を正しく処理する', () => {
        setTextWithBreaks(el, '');
        expect(el.textContent).toBe('');
    });

    it('nullをStringに変換して処理する', () => {
        setTextWithBreaks(el, null);
        expect(el.textContent).toBe('null');
    });

    it('末尾のリテラル\\nで末尾にbrを追加する', () => {
        setTextWithBreaks(el, '行1\x5cn');
        const brs = el.querySelectorAll('br');
        expect(brs).toHaveLength(1);
    });
});

describe('fetchQuestions', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('選択中の資格に対応する問題データを読み込む', async () => {
        setSelectedCert('fl');
        const flQuestions = await fetchQuestions();
        setSelectedCert('alta');
        const altaQuestions = await fetchQuestions();

        expect(flQuestions[0].id).toMatch(/^fl-/);
        expect(altaQuestions[0].id).toMatch(/^alta-/);
    });
});
