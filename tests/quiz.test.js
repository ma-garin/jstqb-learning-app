import { describe, it, expect } from 'vitest';
import { normalize, getAnswerText, formatLabel } from '../js/quiz.js';

const SAMPLE_QUESTION = {
    id: 'fl-001',
    question: 'テスト問題',
    choices: [
        'a. 選択肢A',
        'b. 選択肢B',
        'c. 選択肢C',
        'd. 選択肢D',
    ],
    correctAnswerIndex: 0,
    explanation: '解説',
};

describe('normalize', () => {
    it('小文字に変換してトリムする', () => {
        expect(normalize('  A  ')).toBe('a');
        expect(normalize('B')).toBe('b');
    });

    it('nullは空文字列になる', () => {
        expect(normalize(null)).toBe('');
    });

    it('undefinedは空文字列になる', () => {
        expect(normalize(undefined)).toBe('');
    });

    it('空文字列はそのまま返す', () => {
        expect(normalize('')).toBe('');
    });
});

describe('getAnswerText', () => {
    it('正しい選択肢テキストを返す（プレフィックス除去）', () => {
        expect(getAnswerText('a', SAMPLE_QUESTION)).toBe('選択肢A');
        expect(getAnswerText('b', SAMPLE_QUESTION)).toBe('選択肢B');
        expect(getAnswerText('d', SAMPLE_QUESTION)).toBe('選択肢D');
    });

    it('大文字の選択肢レターでも正しく動作する', () => {
        expect(getAnswerText('A', SAMPLE_QUESTION)).toBe('選択肢A');
        expect(getAnswerText('C', SAMPLE_QUESTION)).toBe('選択肢C');
    });

    it('範囲外のインデックスは空文字列を返す', () => {
        expect(getAnswerText('e', SAMPLE_QUESTION)).toBe('');
        expect(getAnswerText('z', SAMPLE_QUESTION)).toBe('');
    });

    it('questionがnullの場合は空文字列を返す', () => {
        expect(getAnswerText('a', null)).toBe('');
    });

    it('questionがundefinedの場合は空文字列を返す', () => {
        expect(getAnswerText('a', undefined)).toBe('');
    });
});

describe('formatLabel', () => {
    it('選択肢レターとテキストを結合して返す', () => {
        expect(formatLabel('a', SAMPLE_QUESTION)).toBe('A. 選択肢A');
        expect(formatLabel('b', SAMPLE_QUESTION)).toBe('B. 選択肢B');
    });

    it('テキストが取れない場合はレターのみ返す', () => {
        expect(formatLabel('e', SAMPLE_QUESTION)).toBe('E');
    });

    it('大文字入力を正規化して処理する', () => {
        expect(formatLabel('A', SAMPLE_QUESTION)).toBe('A. 選択肢A');
    });
});
