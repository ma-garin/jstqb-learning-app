// js/gemini.js — Gemini API クライアント

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const STORAGE_KEY = 'jstqb_gemini_key';

export function getApiKey() {
    return localStorage.getItem(STORAGE_KEY) || '';
}

export function saveApiKey(key) {
    localStorage.setItem(STORAGE_KEY, key.trim());
}

export function clearApiKey() {
    localStorage.removeItem(STORAGE_KEY);
}

export function hasApiKey() {
    return !!getApiKey();
}

// Exported for testing
export function parseGeminiJson(text) {
    // Strip code fences if present (```json ... ``` or ``` ... ```)
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonStr = fenced ? fenced[1] : (() => {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start === -1 || end === -1 || end <= start) return null;
        return text.slice(start, end + 1);
    })();

    if (!jsonStr) throw new Error('レスポンスからJSONを取得できませんでした');

    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        throw new Error('問題の生成に失敗しました');
    }
    return parsed.questions;
}

const EXAM_PROMPTS = {
    alta: 'JSTQB Advanced Level テストアナリスト試験（シラバス v3.1.1.J03）',
    altm: 'JSTQB Advanced Level テストマネジメント試験（シラバス v3.0.J03）',
};

export async function generateQuestions(apiKey, { count = 3, topic = '', kLevel = '', exam = 'alta' } = {}) {
    const topicLine = topic ? `テーマ: ${topic}` : '';
    const kLevelLine = kLevel ? `出題レベル: ${kLevel}` : 'K2〜K4レベルを混在';
    const examLabel = EXAM_PROMPTS[exam] || EXAM_PROMPTS.alta;

    const prompt = `あなたは${examLabel}の専門家です。
以下の条件に従い、本番試験に即した日本語の問題を${count}問作成してください。

${topicLine}
${kLevelLine}
- 選択肢は4つ（A〜D）、正解は1つ
- 解説は「なぜ正解か、他の選択肢がなぜ不正解か」を明示

以下のJSON形式のみで返答してください（コードブロック不要）:
{
  "questions": [
    {
      "question": "問題文（具体的なシナリオを含むこと）",
      "choices": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswerLetter": "a",
      "explanation": "詳細な解説"
    }
  ]
}`;

    const res = await fetch(`${API_BASE}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.75, maxOutputTokens: 4096 },
        }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `APIエラー (${res.status})`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return parseGeminiJson(text);
}
