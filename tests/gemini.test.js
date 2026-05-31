import { describe, it, expect } from 'vitest';
import { parseGeminiJson } from '../js/gemini.js';

const VALID_PAYLOAD = JSON.stringify({
    questions: [
        {
            question: 'テスト問題',
            choices: ['A. 選択肢1', 'B. 選択肢2', 'C. 選択肢3', 'D. 選択肢4'],
            correctAnswerLetter: 'a',
            explanation: '解説テキスト',
        },
    ],
});

describe('parseGeminiJson', () => {
    it('プレーンなJSONをパースする', () => {
        const result = parseGeminiJson(VALID_PAYLOAD);
        expect(result).toHaveLength(1);
        expect(result[0].question).toBe('テスト問題');
    });

    it('```jsonコードフェンスで囲まれたJSONをパースする', () => {
        const result = parseGeminiJson('```json\n' + VALID_PAYLOAD + '\n```');
        expect(result).toHaveLength(1);
        expect(result[0].correctAnswerLetter).toBe('a');
    });

    it('```コードフェンス（言語指定なし）で囲まれたJSONをパースする', () => {
        const result = parseGeminiJson('```\n' + VALID_PAYLOAD + '\n```');
        expect(result).toHaveLength(1);
    });

    it('前後にテキストがあってもJSONを抽出する', () => {
        const result = parseGeminiJson('以下の問題です:\n' + VALID_PAYLOAD + '\n以上です。');
        expect(result).toHaveLength(1);
    });

    it('複数問の配列を正しく返す', () => {
        const multi = JSON.stringify({
            questions: [
                { question: 'Q1', choices: ['A.a', 'B.b', 'C.c', 'D.d'], correctAnswerLetter: 'a', explanation: 'ex1' },
                { question: 'Q2', choices: ['A.a', 'B.b', 'C.c', 'D.d'], correctAnswerLetter: 'b', explanation: 'ex2' },
            ],
        });
        const result = parseGeminiJson(multi);
        expect(result).toHaveLength(2);
        expect(result[1].correctAnswerLetter).toBe('b');
    });

    it('JSONが含まれない場合はエラーをスローする', () => {
        expect(() => parseGeminiJson('JSONではないテキスト')).toThrow('レスポンスからJSONを取得できませんでした');
    });

    it('questions配列が空の場合はエラーをスローする', () => {
        const empty = JSON.stringify({ questions: [] });
        expect(() => parseGeminiJson(empty)).toThrow('問題の生成に失敗しました');
    });

    it('questionsキーがない場合はエラーをスローする', () => {
        const wrong = JSON.stringify({ data: [] });
        expect(() => parseGeminiJson(wrong)).toThrow('問題の生成に失敗しました');
    });

    it('不正なJSONの場合はSyntaxErrorをスローする', () => {
        expect(() => parseGeminiJson('{invalid json}')).toThrow(SyntaxError);
    });
});
