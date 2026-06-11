import { describe, it, expect } from 'vitest';
import { escapeHtml } from '../js/question.js';

describe('escapeHtml', () => {
    it('&をエスケープする', () => {
        expect(escapeHtml('a & b')).toBe('a &amp; b');
    });

    it('<をエスケープする', () => {
        expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    });

    it('>をエスケープする', () => {
        expect(escapeHtml('a > b')).toBe('a &gt; b');
    });

    it('"をエスケープする', () => {
        expect(escapeHtml('"quoted"')).toBe('&quot;quoted&quot;');
    });

    it("'をエスケープする", () => {
        expect(escapeHtml("it's")).toBe('it&#39;s');
    });

    it('複数の特殊文字を含む文字列をエスケープする', () => {
        expect(escapeHtml('<a href="url">Link & Text</a>')).toBe(
            '&lt;a href=&quot;url&quot;&gt;Link &amp; Text&lt;/a&gt;'
        );
    });

    it('特殊文字がない場合はそのまま返す', () => {
        expect(escapeHtml('普通のテキスト')).toBe('普通のテキスト');
    });

    it('数値を文字列に変換してエスケープする', () => {
        expect(escapeHtml(42)).toBe('42');
    });

    it('空文字列はそのまま返す', () => {
        expect(escapeHtml('')).toBe('');
    });
});
