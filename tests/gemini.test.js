import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseGeminiJson, generateQuestions } from '../js/gemini.js';

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

describe('generateQuestions — エラーハンドリング', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('429クォータエラーを日本語メッセージに変換する', async () => {
        fetch.mockResolvedValue({
            ok: false,
            status: 429,
            json: async () => ({ error: { message: 'You exceeded your current quota. Please retry in 58.9s.' } }),
        });
        await expect(generateQuestions('dummy-key')).rejects.toThrow('無料利用枠の上限');
    });

    it('クォータエラーに再試行時間を含める', async () => {
        fetch.mockResolvedValue({
            ok: false,
            status: 429,
            json: async () => ({ error: { message: 'Quota exceeded. Please retry in 120.5s.' } }),
        });
        await expect(generateQuestions('dummy-key')).rejects.toThrow('約121秒後');
    });

    it('400エラーを分かりやすいメッセージに変換する', async () => {
        fetch.mockResolvedValue({
            ok: false,
            status: 400,
            json: async () => ({ error: { message: 'API key not valid.' } }),
        });
        await expect(generateQuestions('dummy-key')).rejects.toThrow('APIキーが無効');
    });

    it('403エラーを分かりやすいメッセージに変換する', async () => {
        fetch.mockResolvedValue({
            ok: false,
            status: 403,
            json: async () => ({ error: { message: 'Permission denied.' } }),
        });
        await expect(generateQuestions('dummy-key')).rejects.toThrow('アクセス権限');
    });

    it('正常レスポンスから問題配列を返す', async () => {
        const mockText = JSON.stringify({
            questions: [
                { question: 'Q', choices: ['A.a', 'B.b', 'C.c', 'D.d'], correctAnswerLetter: 'a', explanation: 'ex' },
            ],
        });
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                candidates: [{ content: { parts: [{ text: mockText }] } }],
            }),
        });
        const result = await generateQuestions('dummy-key');
        expect(result).toHaveLength(1);
        expect(result[0].question).toBe('Q');
    });

    it('model パラメータがURLに反映される', async () => {
        const mockText = JSON.stringify({
            questions: [{ question: 'Q', choices: ['A.a', 'B.b', 'C.c', 'D.d'], correctAnswerLetter: 'a', explanation: 'ex' }],
        });
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ candidates: [{ content: { parts: [{ text: mockText }] } }] }),
        });
        await generateQuestions('dummy-key', { model: 'gemini-1.5-flash' });
        const calledUrl = fetch.mock.calls[0][0];
        expect(calledUrl).toContain('gemini-1.5-flash');
    });

    it('model 未指定時は gemini-2.0-flash がデフォルト', async () => {
        const mockText = JSON.stringify({
            questions: [{ question: 'Q', choices: ['A.a', 'B.b', 'C.c', 'D.d'], correctAnswerLetter: 'a', explanation: 'ex' }],
        });
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ candidates: [{ content: { parts: [{ text: mockText }] } }] }),
        });
        await generateQuestions('dummy-key');
        const calledUrl = fetch.mock.calls[0][0];
        expect(calledUrl).toContain('gemini-2.0-flash');
    });
});
