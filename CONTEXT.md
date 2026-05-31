# JSTQB 学習アプリ — ドメイン用語集

## 試験コンテキスト (Exam Context)

ユーザーが選択している試験種別。`"alta"` または `"altm"` の2値。`localStorage['jstqb_selected_exam']` に保存され、次回起動時に復元される。未設定時は `"alta"` がデフォルト。全ページ共通のタブUIで切り替える。

**ALTA (Advanced Level Test Analyst)**
ISTQB アドバンストレベル テストアナリスト。シラバス V3.1.1.J03、9章（章0〜8）構成、想定問題33問。

**ALTM (Advanced Level Test Management)**
ISTQB アドバンストレベル テストマネジメント。シラバス V3.0.J03、3章（章0〜3）構成、想定問題40問。章1（テスト活動のマネジメント・750分）約22問、章2（プロダクトのマネジメント・390分）約11問、章3（チームのマネジメント・225分）約7問。

## 学習フロー

**想定問題 (Assumed Problems)**
クイズモードの問題データソース。ALTA: `assumedProblemsData_alta.js`（33問）、ALTM: `assumedProblemsData_altm.js`（40問）。`examContext` に応じて切り替える。

**苦手問題 (Weak Questions)**
ユーザーが過去のクイズで不正解にした問題のID集合。試験別に分離して保存。`localStorage['jstqb_alta_wrong_questions']` / `localStorage['jstqb_altm_wrong_questions']`。正解すれば自動削除。

**クイズセッション (Quiz Session)**
`study.html` → `quiz.html` → `result.html` の一連のフロー。`localStorage['quizQuestions']` に問題配列、`currentQuestionIndex`・`correctAnswersCount`・`quizAnswerLog` で状態を管理する。結果画面でのみセッションデータが消去される。

**学習進捗 (Daily Progress)**
試験別に分離して保存。`localStorage['jstqb_alta_progress_today']` / `localStorage['jstqb_altm_progress_today']` に当日の解答数と正解数。連続学習日数も試験別: `jstqb_alta_streak` / `jstqb_altm_streak`。

**AI 問題 (AI Questions)**
Gemini API (`gemini-2.0-flash`) が生成する練習問題。`ai-quiz.html` 専用。`examContext` に応じてプロンプトを自動切り替え（ALTA: JSTQB-TA準拠、ALTM: JSTQB-TM準拠）。進捗データには影響しない。

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

全ページに試験選択タブUI（ALTA / ALTM）を共通表示。`utils.js` の `setupCommonNavigation()` がタブを注入する。

## シラバス章

**ALTA**（`js/syllabus/alta/`）: 章0: 本シラバスの紹介 / 章1: テストプロセス / 章2: リスクベースドテスト / 章3: テスト技法 / 章4: 品質特性テスト / 章5: レビュー / 章6: テストツールと自動化 / 章7〜8: 追加章

**ALTM**（`js/syllabus/altm/`）: 章0: イントロダクション / 章1: テスト活動のマネジメント / 章2: プロダクトのマネジメント / 章3: チームのマネジメント

## 用語集・更新履歴データ

用語集: `glossaryData_alta.js` / `glossaryData_altm.js`（試験別に完全分離）
更新履歴: `data/release_notes_alta.csv` / `data/release_notes_altm.csv`（試験別に完全分離）
