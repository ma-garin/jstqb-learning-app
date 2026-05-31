# JSTQB-TA 学習アプリ — ドメイン用語集

## 学習フロー

**想定問題 (Assumed Problems)**
`assumedProblemsData.js` に収録された33問のクイズ問題。シラバス章・節・学習目標・問題文・選択肢・正解・解説で構成される。クイズモードの唯一のデータソース。

**苦手問題 (Weak Questions)**
ユーザーが過去のクイズで不正解にした問題のID集合。`localStorage['jstqb_wrong_questions']` に JSON 配列として保存される。正解すれば自動削除。苦手問題モードでのみ対象問題として絞り込まれる。

**クイズセッション (Quiz Session)**
`study.html` → `quiz.html` → `result.html` の一連のフロー。`localStorage['quizQuestions']` に問題配列、`currentQuestionIndex`・`correctAnswersCount`・`quizAnswerLog` で状態を管理する。結果画面でのみセッションデータが消去される。

**学習進捗 (Daily Progress)**
`localStorage['jstqb_progress_today']` に当日の解答数と正解数を保存。日付が変わると自動リセット。`localStorage['jstqb_streak']` で連続学習日数を管理。

**AI 問題 (AI Questions)**
Gemini API (`gemini-2.0-flash`) が生成する JSTQB-TA シラバス準拠の練習問題。`ai-quiz.html` 専用。`assumedProblemsData.js` の問題とは別管理で、localStorage や進捗データには影響しない（苦手問題記録も対象外）。

**Gemini API キー**
ユーザー自身が Google AI Studio で発行し UI から入力するキー。`localStorage['jstqb_gemini_key']` にのみ保存。ソースコードには絶対に含まれない。

## ナビゲーション構造

| ページ | ファイル | ボトムナビ |
|---|---|---|
| ホーム | index.html | nav-home (active) |
| クイズ設定 | study.html | nav-quiz |
| クイズ実施 | quiz.html | nav-quiz |
| 結果 | result.html | nav-quiz |
| 問題集 | question.html | nav-quiz |
| シラバス | syllabus.html | nav-home |
| 更新履歴 | release_notes.html | nav-home |
| 用語集 | glossary.html | nav-glossary |
| AI 問題 | ai-quiz.html | nav-ai |

## シラバス章

章0: 本シラバスの紹介 / 章1: テストプロセス / 章2: リスクベースドテスト / 章3: テスト技法 / 章4: 品質特性テスト / 章5: レビュー / 章6: テストツールと自動化 / 章7〜8: 追加章
