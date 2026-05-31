import { describe, it, expect } from 'vitest';
import { parseCsv, parseCsvLine, convertMarkdownToHtml } from '../js/releaseNotesLoader.js';

describe('parseCsvLine', () => {
    it('カンマ区切りのシンプルな行をパースする', () => {
        expect(parseCsvLine('a,b,c')).toEqual(['a', 'b', 'c']);
    });

    it('ダブルクォートで囲まれたフィールドをパースする', () => {
        expect(parseCsvLine('"hello, world",b,c')).toEqual(['hello, world', 'b', 'c']);
    });

    it('ダブルクォートのエスケープ（""）を処理する', () => {
        expect(parseCsvLine('"say ""hello""",b')).toEqual(['say "hello"', 'b']);
    });

    it('空フィールドを処理する', () => {
        expect(parseCsvLine('a,,c')).toEqual(['a', '', 'c']);
    });
});

describe('parseCsv', () => {
    it('ヘッダー行とデータ行をパースする', () => {
        const csv = `Ver.,日付,対応内容\n1.0.0,2024-01-01,初回リリース`;
        const result = parseCsv(csv);
        expect(result).toHaveLength(1);
        expect(result[0].version).toBe('1.0.0');
        expect(result[0].date).toBe('2024-01-01');
        expect(result[0].content).toBe('初回リリース');
    });

    it('複数行のデータをパースする', () => {
        const csv = `Ver.,日付,対応内容\n1.0.0,2024-01-01,v1\n1.1.0,2024-02-01,v1.1`;
        const result = parseCsv(csv);
        expect(result).toHaveLength(2);
        expect(result[1].version).toBe('1.1.0');
    });

    it('列数が合わない行をスキップする', () => {
        const csv = `Ver.,日付,対応内容\n1.0.0,2024-01-01,v1\nbadline`;
        const result = parseCsv(csv);
        expect(result).toHaveLength(1);
    });

    it('空のCSVは空配列を返す', () => {
        expect(parseCsv('')).toEqual([]);
    });
});

describe('convertMarkdownToHtml', () => {
    it('**bold**を<strong>に変換する', () => {
        expect(convertMarkdownToHtml('**テスト**')).toContain('<strong>テスト</strong>');
    });

    it('### h3見出しを変換する', () => {
        expect(convertMarkdownToHtml('### 見出し')).toContain('<h3>見出し</h3>');
    });

    it('- リストアイテムをliに変換する', () => {
        expect(convertMarkdownToHtml('- アイテム')).toContain('<li>アイテム</li>');
    });

    it('プレーンテキストはそのまま返す', () => {
        const result = convertMarkdownToHtml('普通のテキスト');
        expect(result).toContain('普通のテキスト');
    });
});
