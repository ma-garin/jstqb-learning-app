// 公開シラバスは学習領域の位置確認にのみ使用し、本文や学習目標文は収録しない。
// 各項目の section / title / loCode / kLevel は公式シラバス目次の参照情報、learningTitle は制作者独自の学習タイトル。

export const flTopicMap = [
    {
        chapter: '1',
        title: 'テストの基礎',
        sections: [
            { section: '1.1.1', title: 'テスト目的', loCode: 'FL-1.1.1', kLevel: 'K1', learningTitle: '欠陥発見だけでなく品質情報の提供までがテストの仕事' },
            { section: '1.1.2', title: 'テストとデバッグ', loCode: 'FL-1.1.2', kLevel: 'K2', learningTitle: '見つける活動と直す活動を区別する' },
            { section: '1.2.1', title: '成功に対するテストの貢献', loCode: 'FL-1.2.1', kLevel: 'K2', learningTitle: 'テストがプロジェクト成功にどう効くかを説明できる' },
            { section: '1.2.2', title: 'テストと品質保証（QA）', loCode: 'FL-1.2.2', kLevel: 'K1', learningTitle: 'テスト（プロダクト指向）とQA（プロセス指向）の違い' },
            { section: '1.2.3', title: 'エラー、欠陥、故障、根本原因', loCode: 'FL-1.2.3', kLevel: 'K2', learningTitle: '人のミスからシステム障害までの連鎖をたどる' },
            { section: '1.3', title: 'テストの原則', loCode: 'FL-1.3.1', kLevel: 'K2', learningTitle: '7つの原則を現場の判断に結び付ける' },
            { section: '1.4.1', title: 'テスト活動とタスク', loCode: 'FL-1.4.1', kLevel: 'K2', learningTitle: '計画から完了までの主要活動を流れで押さえる' },
            { section: '1.4.2', title: 'コンテキストに応じたテストプロセス', loCode: 'FL-1.4.2', kLevel: 'K2', learningTitle: 'プロジェクト状況でテストの形が変わる理由' },
            { section: '1.4.3', title: 'テストウェア', loCode: 'FL-1.4.3', kLevel: 'K2', learningTitle: 'テストの過程で作る成果物を整理する' },
            { section: '1.4.4', title: 'テストベースとのトレーサビリティ', loCode: 'FL-1.4.4', kLevel: 'K2', learningTitle: '要件とテストを双方向にたどれるようにする' },
            { section: '1.4.5', title: 'テストの役割', loCode: 'FL-1.4.5', kLevel: 'K2', learningTitle: 'テストマネジメント役割とテスティング役割の分担' },
            { section: '1.5.1', title: 'テストに必要な汎用的スキル', loCode: 'FL-1.5.1', kLevel: 'K2', learningTitle: '好奇心・批判的な目・コミュニケーション力' },
            { section: '1.5.2', title: 'チーム全体アプローチ', loCode: 'FL-1.5.2', kLevel: 'K1', learningTitle: '品質はテスト担当者だけの仕事ではない' },
            { section: '1.5.3', title: 'テストの独立性', loCode: 'FL-1.5.3', kLevel: 'K2', learningTitle: '独立性の度合いと利点・注意点を理解する' },
        ],
    },
    {
        chapter: '2',
        title: 'ソフトウェア開発ライフサイクル全体を通してのテスト',
        sections: [
            { section: '2.1.1', title: 'SDLCがテストに与える影響', loCode: 'FL-2.1.1', kLevel: 'K2', learningTitle: '開発モデルごとにテストのタイミングと形が変わる' },
            { section: '2.1.2', title: 'SDLCとよい実践例', loCode: 'FL-2.1.2', kLevel: 'K1', learningTitle: 'テストレベル対応・早期テスト・専門化の3つの実践' },
            { section: '2.1.3', title: 'テストが主導するソフトウェア開発', loCode: 'FL-2.1.3', kLevel: 'K1', learningTitle: 'TDD・ATDD・BDDの位置付けを知る' },
            { section: '2.1.4', title: 'DevOpsとテスト', loCode: 'FL-2.1.4', kLevel: 'K2', learningTitle: 'CI/CDパイプラインの中でテストが果たす役割' },
            { section: '2.1.5', title: 'シフトレフトアプローチ', loCode: 'FL-2.1.5', kLevel: 'K2', learningTitle: '早い工程に品質活動を前倒しする' },
            { section: '2.1.6', title: 'ふりかえりとプロセス改善', loCode: 'FL-2.1.6', kLevel: 'K2', learningTitle: 'ふりかえりをテスト改善につなげる' },
            { section: '2.2.1', title: 'テストレベル', loCode: 'FL-2.2.1', kLevel: 'K2', learningTitle: 'コンポーネントから受け入れまでの5つのレベル' },
            { section: '2.2.2', title: 'テストタイプ', loCode: 'FL-2.2.2', kLevel: 'K2', learningTitle: '機能・非機能・ブラックボックス/ホワイトボックスの整理' },
            { section: '2.2.3', title: '確認テストとリグレッションテスト', loCode: 'FL-2.2.3', kLevel: 'K2', learningTitle: '直したことの確認と壊していないことの確認' },
            { section: '2.3', title: 'メンテナンス（保守）テスト', loCode: 'FL-2.3.1', kLevel: 'K2', learningTitle: '稼働後の変更に対するテストの考え方' },
        ],
    },
    {
        chapter: '3',
        title: '静的テスト',
        sections: [
            { section: '3.1.1', title: '静的テストで確認可能な作業成果物', loCode: 'FL-3.1.1', kLevel: 'K1', learningTitle: '要件書からコードまで、実行せずに調べられる対象' },
            { section: '3.1.2', title: '静的テストの価値', loCode: 'FL-3.1.2', kLevel: 'K2', learningTitle: '早期発見による手戻り削減の効果' },
            { section: '3.1.3', title: '静的テストと動的テストの違い', loCode: 'FL-3.1.3', kLevel: 'K2', learningTitle: '見つけやすい欠陥の種類がそれぞれ違う' },
            { section: '3.2.1', title: '早期フィードバックの利点', loCode: 'FL-3.2.1', kLevel: 'K1', learningTitle: 'ステークホルダーの認識ずれを早めに直す' },
            { section: '3.2.2', title: '作業成果物のレビュープロセス', loCode: 'FL-3.2.2', kLevel: 'K2', learningTitle: '計画からフォローアップまでのレビューの流れ' },
            { section: '3.2.3', title: 'レビューでの役割と責務', loCode: 'FL-3.2.3', kLevel: 'K1', learningTitle: 'モデレーター・作成者・レビュアーの役割分担' },
            { section: '3.2.4', title: 'レビュー種別', loCode: 'FL-3.2.4', kLevel: 'K2', learningTitle: '非公式レビューからインスペクションまでの使い分け' },
            { section: '3.2.5', title: 'レビューの成功要因', loCode: 'FL-3.2.5', kLevel: 'K1', learningTitle: 'レビューが機能する条件・失敗する条件' },
        ],
    },
    {
        chapter: '4',
        title: 'テスト分析と設計',
        sections: [
            { section: '4.1', title: 'テスト技法の概要', loCode: 'FL-4.1.1', kLevel: 'K2', learningTitle: 'ブラックボックス・ホワイトボックス・経験ベースの3分類' },
            { section: '4.2.1', title: '同値分割法', loCode: 'FL-4.2.1', kLevel: 'K3', learningTitle: '同じ扱いの入力をグループ化して代表値を選ぶ' },
            { section: '4.2.2', title: '境界値分析', loCode: 'FL-4.2.2', kLevel: 'K3', learningTitle: '条件が切り替わる端を狙って欠陥を見つける' },
            { section: '4.2.3', title: 'デシジョンテーブルテスト', loCode: 'FL-4.2.3', kLevel: 'K3', learningTitle: '条件の組み合わせを表で網羅する' },
            { section: '4.2.4', title: '状態遷移テスト', loCode: 'FL-4.2.4', kLevel: 'K3', learningTitle: '状態と遷移を図にしてテストを導く' },
            { section: '4.3.1', title: 'ステートメントテストとカバレッジ', loCode: 'FL-4.3.1', kLevel: 'K2', learningTitle: 'コードの各行を少なくとも1回通す' },
            { section: '4.3.2', title: 'ブランチテストとカバレッジ', loCode: 'FL-4.3.2', kLevel: 'K2', learningTitle: '分岐の真偽両方を通す' },
            { section: '4.3.3', title: 'ホワイトボックステストの価値', loCode: 'FL-4.3.3', kLevel: 'K2', learningTitle: '仕様にない実装の抜けを見つけられる' },
            { section: '4.4.1', title: 'エラー推測', loCode: 'FL-4.4.1', kLevel: 'K2', learningTitle: '経験から「ここが危ない」を狙い撃つ' },
            { section: '4.4.2', title: '探索的テスト', loCode: 'FL-4.4.2', kLevel: 'K2', learningTitle: '学習・設計・実行を同時に回す' },
            { section: '4.4.3', title: 'チェックリストベースドテスト', loCode: 'FL-4.4.3', kLevel: 'K2', learningTitle: '観点リストで確認漏れを防ぐ' },
            { section: '4.5.1', title: 'ユーザーストーリーの共同執筆', loCode: 'FL-4.5.1', kLevel: 'K2', learningTitle: '3C（カード・会話・確認）で認識を揃える' },
            { section: '4.5.2', title: '受け入れ基準', loCode: 'FL-4.5.2', kLevel: 'K2', learningTitle: '完成の条件をテスト可能な形で書く' },
            { section: '4.5.3', title: '受け入れテスト駆動開発（ATDD）', loCode: 'FL-4.5.3', kLevel: 'K3', learningTitle: '受け入れテストを先に書いて実装を導く' },
        ],
    },
    {
        chapter: '5',
        title: 'テスト活動のマネジメント',
        sections: [
            { section: '5.1.1', title: 'テスト計画書の目的と内容', loCode: 'FL-5.1.1', kLevel: 'K2', learningTitle: '何を・どこまで・どうやってテストするかを定める' },
            { section: '5.1.2', title: 'イテレーション・リリース計画への貢献', loCode: 'FL-5.1.2', kLevel: 'K1', learningTitle: 'テスト担当者が計画づくりで果たす役割' },
            { section: '5.1.3', title: '開始基準と終了基準', loCode: 'FL-5.1.3', kLevel: 'K2', learningTitle: 'テストを始めてよい条件・終えてよい条件' },
            { section: '5.1.4', title: '見積り技法', loCode: 'FL-5.1.4', kLevel: 'K3', learningTitle: '三点見積り・ワイドバンドデルファイなどを使い分ける' },
            { section: '5.1.5', title: 'テストケースの優先順位付け', loCode: 'FL-5.1.5', kLevel: 'K3', learningTitle: 'リスク・カバレッジ・要件で実行順を決める' },
            { section: '5.1.6', title: 'テストピラミッド', loCode: 'FL-5.1.6', kLevel: 'K1', learningTitle: '下層ほど多く速く、上層ほど少なく重く' },
            { section: '5.1.7', title: 'テストの四象限', loCode: 'FL-5.1.7', kLevel: 'K2', learningTitle: 'ビジネス/技術×支援/批評でテストを整理する' },
            { section: '5.2.1', title: 'リスク定義とリスク属性', loCode: 'FL-5.2.1', kLevel: 'K1', learningTitle: '発生可能性と影響度でリスクを捉える' },
            { section: '5.2.2', title: 'プロジェクトリスクとプロダクトリスク', loCode: 'FL-5.2.2', kLevel: 'K2', learningTitle: '進め方のリスクと成果物のリスクを区別する' },
            { section: '5.2.3', title: 'プロダクトリスク分析', loCode: 'FL-5.2.3', kLevel: 'K2', learningTitle: 'リスクの識別とアセスメントの進め方' },
            { section: '5.2.4', title: 'プロダクトリスクコントロール', loCode: 'FL-5.2.4', kLevel: 'K2', learningTitle: '分析結果をテストの濃淡に反映する' },
            { section: '5.3.1', title: 'テストで使用するメトリクス', loCode: 'FL-5.3.1', kLevel: 'K1', learningTitle: '進捗・品質を測る代表的な指標' },
            { section: '5.3.2', title: 'テストレポートの目的・内容・読み手', loCode: 'FL-5.3.2', kLevel: 'K2', learningTitle: '進捗レポートと完了レポートの違い' },
            { section: '5.3.3', title: 'テストステータスの伝達', loCode: 'FL-5.3.3', kLevel: 'K2', learningTitle: '相手に合わせて伝え方を変える' },
            { section: '5.4', title: '構成管理', loCode: 'FL-5.4.1', kLevel: 'K2', learningTitle: 'テストウェアの版と整合性を管理する' },
            { section: '5.5', title: '欠陥マネジメント', loCode: 'FL-5.5.1', kLevel: 'K3', learningTitle: '伝わる欠陥レポートを書き、流れを管理する' },
        ],
    },
    {
        chapter: '6',
        title: 'テストツール',
        sections: [
            { section: '6.1', title: 'テストのためのツールによる支援', loCode: 'FL-6.1.1', kLevel: 'K2', learningTitle: '管理・実行・解析などツールの種類と支援範囲' },
            { section: '6.2', title: 'テスト自動化の利点とリスク', loCode: 'FL-6.2.1', kLevel: 'K1', learningTitle: '自動化で得られるもの・抱え込むもの' },
        ],
    },
];

export const altaTopicMap = [
    {
        chapter: '1',
        title: 'テストプロセスにおけるテストアナリストのタスク',
        sections: [
            { section: '1.2', title: 'ソフトウェア開発ライフサイクルにおけるテスト', loCode: 'TA-1.2.1', kLevel: 'K2', learningTitle: '開発モデルごとのテストアナリストの関わり方' },
            { section: '1.3', title: 'テスト分析', loCode: 'TA-1.3.1', kLevel: 'K2', learningTitle: 'テストベースから「何をテストするか」を識別する' },
            { section: '1.4.1', title: 'ローレベルテストケースとハイレベルテストケース', loCode: 'TA-1.4.1', kLevel: 'K2', learningTitle: '論理ケースと具体ケースの使い分け' },
            { section: '1.4.2', title: 'テストケースの設計', loCode: 'TA-1.4.2', kLevel: 'K4', learningTitle: 'テスト条件から実行可能なケースへ落とし込む' },
            { section: '1.5', title: 'テスト実装', loCode: 'TA-1.5.1', kLevel: 'K2', learningTitle: '手順書・データ・環境を実行直前まで整える' },
            { section: '1.6', title: 'テスト実行', loCode: 'TA-1.6.1', kLevel: 'K2', learningTitle: '記録・ログ・再現性ある欠陥報告' },
        ],
    },
    {
        chapter: '2',
        title: 'リスクベースドテストにおけるテストアナリストのタスク',
        sections: [
            { section: '2.1', title: 'リスクベースドテストでの役割', loCode: 'TA-2.1.1', kLevel: 'K3', learningTitle: 'リスク識別・アセスメント・軽減への参画' },
            { section: '2.2', title: 'リスク識別', loCode: '', kLevel: 'K2', learningTitle: 'プロダクト品質リスクを洗い出す観点' },
            { section: '2.3', title: 'リスクアセスメント', loCode: '', kLevel: 'K3', learningTitle: '発生可能性×影響度でリスクレベルを評価する' },
            { section: '2.4.1', title: 'テストの優先度付け', loCode: '', kLevel: 'K3', learningTitle: '高リスク領域へテストリソースを集中する' },
            { section: '2.4.2', title: '将来のテストサイクルに向けたテストの調整', loCode: '', kLevel: 'K2', learningTitle: '結果を見てリスク評価と配分を更新する' },
        ],
    },
    {
        chapter: '3',
        title: 'テスト技法',
        sections: [
            { section: '3.2.1', title: '同値分割法', loCode: 'TA-3.2.1', kLevel: 'K4', learningTitle: '有効・無効クラスを設計し適用範囲を判断する' },
            { section: '3.2.2', title: '境界値分析', loCode: 'TA-3.2.2', kLevel: 'K4', learningTitle: '2値BVAと3値BVAを使い分ける' },
            { section: '3.2.3', title: 'デシジョンテーブルテスト', loCode: 'TA-3.2.3', kLevel: 'K4', learningTitle: 'ルール統合とDon\'t Careで効率化する' },
            { section: '3.2.4', title: '状態遷移テスト', loCode: 'TA-3.2.4', kLevel: 'K4', learningTitle: '遷移カバレッジを意識してシーケンスを設計する' },
            { section: '3.2.5', title: 'クラシフィケーションツリー技法', loCode: 'TA-3.2.5', kLevel: 'K2', learningTitle: '入力の分類を木構造で可視化する' },
            { section: '3.2.6', title: 'ペアワイズテスト', loCode: 'TA-3.2.6', kLevel: 'K4', learningTitle: '2因子間の組み合わせを最少ケースで網羅する' },
            { section: '3.2.7', title: 'ユースケーステスト', loCode: 'TA-3.2.7', kLevel: 'K4', learningTitle: 'メインシナリオと代替フローを体系的に検証する' },
            { section: '3.2.8', title: '技法の組み合わせ', loCode: 'TA-3.2.8', kLevel: 'K4', learningTitle: '対象の性質に応じて複数技法を重ねる' },
            { section: '3.3.1', title: 'エラー推測', loCode: 'TA-3.3.1', kLevel: 'K2', learningTitle: '欠陥が出やすい箇所を経験から予測する' },
            { section: '3.3.2', title: 'チェックリストベースドテスト', loCode: 'TA-3.3.2', kLevel: 'K3', learningTitle: 'チェックリストを育てて観点漏れを防ぐ' },
            { section: '3.3.3', title: '探索的テスト', loCode: 'TA-3.3.3', kLevel: 'K2', learningTitle: 'セッションベースで学習しながらテストする' },
            { section: '3.3.4', title: '欠陥ベースのテスト技法', loCode: '', kLevel: 'K2', learningTitle: '欠陥タクソノミーから狙いを定める' },
            { section: '3.4', title: '最善の技法の適用', loCode: 'TA-3.4.1', kLevel: 'K4', learningTitle: '状況に最適な技法を選択する判断基準' },
        ],
    },
    {
        chapter: '4',
        title: 'ソフトウェア品質特性のテスト',
        sections: [
            { section: '4.2.1', title: '機能正確性テスト', loCode: 'TA-4.2.1', kLevel: 'K2', learningTitle: '計算・判定が正しい結果を返すかを確かめる' },
            { section: '4.2.2', title: '機能適切性テスト', loCode: 'TA-4.2.2', kLevel: 'K2', learningTitle: 'ユーザーの目的達成に適した機能かを評価する' },
            { section: '4.2.3', title: '機能完全性テスト', loCode: 'TA-4.2.3', kLevel: 'K2', learningTitle: '必要な機能がすべて揃っているかを確認する' },
            { section: '4.2.4', title: '相互運用性テスト', loCode: 'TA-4.2.4', kLevel: 'K2', learningTitle: '他システムとのデータ交換・連携を検証する' },
            { section: '4.2.5', title: '使用性評価', loCode: 'TA-4.2.5', kLevel: 'K2', learningTitle: '有効性・効率・満足度の3軸で評価する' },
            { section: '4.2.6', title: '移植性テスト', loCode: 'TA-4.2.6', kLevel: 'K2', learningTitle: '環境の違いへの適応性とインストール性を確認する' },
        ],
    },
    {
        chapter: '5',
        title: 'レビュー',
        sections: [
            { section: '5.2.1', title: '要件レビュー', loCode: 'TA-5.2.1', kLevel: 'K3', learningTitle: 'チェックリストで要件の欠陥を見つける' },
            { section: '5.2.2', title: 'ユーザーストーリーレビュー', loCode: 'TA-5.2.2', kLevel: 'K3', learningTitle: 'INVESTなどの観点でストーリーを点検する' },
            { section: '5.2.3', title: 'チェックリストの調整', loCode: '', kLevel: 'K2', learningTitle: '欠陥データをもとにチェックリストを改善する' },
        ],
    },
    {
        chapter: '6',
        title: 'テストツールおよび自動化',
        sections: [
            { section: '6.2', title: 'キーワード駆動テスト', loCode: 'TA-6.2.1', kLevel: 'K3', learningTitle: 'アクションとデータを分離して自動化を設計する' },
            { section: '6.3.1', title: 'テスト設計ツール', loCode: 'TA-6.3.1', kLevel: 'K2', learningTitle: 'テストケース生成・管理を支援するツール' },
            { section: '6.3.2', title: 'テストデータ準備ツール', loCode: '', kLevel: 'K2', learningTitle: '大量データ生成とマスキングの自動化' },
            { section: '6.3.3', title: 'テスト自動実行ツール', loCode: '', kLevel: 'K2', learningTitle: 'リグレッションを高速・安定に回す' },
        ],
    },
];

export const altmTopicMap = [
    {
        chapter: '1',
        title: 'テスト活動のマネジメント',
        sections: [
            { section: '1.1.1', title: 'テスト計画の活動', loCode: 'TM-1.1.1', kLevel: 'K2', learningTitle: 'スコープ・リスク・リソース・スケジュールを定める' },
            { section: '1.1.2', title: 'テストモニタリングとコントロールの活動', loCode: 'TM-1.1.2', kLevel: 'K2', learningTitle: '計画とのずれを検知して是正する' },
            { section: '1.1.3', title: 'テスト完了の活動', loCode: 'TM-1.1.3', kLevel: 'K2', learningTitle: '完了判断・成果物整理・教訓の引き継ぎ' },
            { section: '1.2.1', title: 'テストステークホルダー', loCode: 'TM-1.2.1', kLevel: 'K2', learningTitle: 'テストに関わる利害関係者を特定する' },
            { section: '1.2.2', title: 'ステークホルダーの知見の重要性', loCode: 'TM-1.2.2', kLevel: 'K2', learningTitle: '現場知識をテストマネジメントに取り込む' },
            { section: '1.2.3', title: 'ハイブリッド開発モデルでのテストマネジメント', loCode: 'TM-1.2.3', kLevel: 'K2', learningTitle: 'ウォーターフォールとアジャイルの混在に対応する' },
            { section: '1.2.4', title: 'SDLCモデル別のテストマネジメント活動', loCode: 'TM-1.2.4', kLevel: 'K2', learningTitle: '開発モデルに合わせて管理の力点を変える' },
            { section: '1.2.5', title: 'テストレベル別のテストマネジメント活動', loCode: 'TM-1.2.5', kLevel: 'K2', learningTitle: '各テストレベルで管理すべきこと' },
            { section: '1.2.6', title: 'テストタイプ別のテストマネジメント活動', loCode: 'TM-1.2.6', kLevel: 'K2', learningTitle: '機能・非機能テストの管理上の違い' },
            { section: '1.2.7', title: '計画・モニタリング・コントロールの統合', loCode: 'TM-1.2.7', kLevel: 'K4', learningTitle: 'コンテキストを分析して管理活動を設計する' },
            { section: '1.3.1', title: 'リスク軽減活動としてのテスト', loCode: 'TM-1.3.1', kLevel: 'K2', learningTitle: 'テストはリスクを減らす投資である' },
            { section: '1.3.2', title: '品質リスクの識別', loCode: 'TM-1.3.2', kLevel: 'K2', learningTitle: 'ステークホルダーと協働してリスクを洗い出す' },
            { section: '1.3.3', title: '品質リスクアセスメント', loCode: 'TM-1.3.3', kLevel: 'K2', learningTitle: '発生可能性と影響度でリスクを格付けする' },
            { section: '1.3.4', title: '適切なテストによる品質リスク軽減', loCode: 'TM-1.3.4', kLevel: 'K4', learningTitle: 'リスクレベルに応じてテストの深さを決める' },
            { section: '1.3.5', title: 'リスクベースドテストの技法', loCode: 'TM-1.3.5', kLevel: 'K2', learningTitle: '代表的なリスクベースドテストの進め方' },
            { section: '1.3.6', title: '成功メトリクスと困難さ', loCode: 'TM-1.3.6', kLevel: 'K2', learningTitle: 'リスクベースドテストの効果測定と落とし穴' },
            { section: '1.4.1', title: 'テストアプローチの選択', loCode: 'TM-1.4.1', kLevel: 'K2', learningTitle: '分析的・モデルベースなどアプローチの引き出し' },
            { section: '1.4.2', title: '組織戦略・プロジェクトコンテキストの分析', loCode: 'TM-1.4.2', kLevel: 'K4', learningTitle: '組織のテスト方針を踏まえて戦略を立てる' },
            { section: '1.4.3', title: 'テスト目的の定義', loCode: 'TM-1.4.3', kLevel: 'K3', learningTitle: '測定可能なテスト目的を設定する' },
            { section: '1.5.1', title: 'テスト改善プロセス（IDEAL）', loCode: 'TM-1.5.1', kLevel: 'K2', learningTitle: '開始・診断・確立・実行・学習のサイクル' },
            { section: '1.5.2', title: 'モデルベースのテストプロセス改善', loCode: 'TM-1.5.2', kLevel: 'K2', learningTitle: 'TMMi・TPI Nextなどのモデルを使う' },
            { section: '1.5.3', title: '分析ベースの改善アプローチ', loCode: 'TM-1.5.3', kLevel: 'K2', learningTitle: '因果分析・メトリクス分析から改善点を導く' },
            { section: '1.5.4', title: 'ふりかえり', loCode: 'TM-1.5.4', kLevel: 'K3', learningTitle: 'ふりかえりを改善アクションにつなげる' },
            { section: '1.6.1', title: 'ツール導入のためのよい実践', loCode: 'TM-1.6.1', kLevel: 'K2', learningTitle: 'パイロットから段階展開する' },
            { section: '1.6.2', title: 'ツール選定の技術的・ビジネス的側面', loCode: 'TM-1.6.2', kLevel: 'K2', learningTitle: '機能適合性とコストの両面で評価する' },
            { section: '1.6.3', title: '選定プロセスとROI評価', loCode: 'TM-1.6.3', kLevel: 'K4', learningTitle: '投資対効果を見積もって意思決定する' },
            { section: '1.6.4', title: 'ツールのライフサイクル', loCode: 'TM-1.6.4', kLevel: 'K2', learningTitle: '導入・運用・保守・廃止までを管理する' },
            { section: '1.6.5', title: 'ツールメトリクス', loCode: 'TM-1.6.5', kLevel: 'K2', learningTitle: 'ツールの効果を数値で把握する' },
        ],
    },
    {
        chapter: '2',
        title: 'プロダクトのマネジメント',
        sections: [
            { section: '2.1.1', title: 'テストマネジメント活動のためのメトリクス', loCode: 'TM-2.1.1', kLevel: 'K2', learningTitle: '進捗・品質・カバレッジを測る指標を選ぶ' },
            { section: '2.1.2', title: 'モニタリング・コントロール・完了', loCode: 'TM-2.1.2', kLevel: 'K2', learningTitle: 'メトリクスを管理サイクルに組み込む' },
            { section: '2.1.3', title: 'テスト報告', loCode: 'TM-2.1.3', kLevel: 'K4', learningTitle: '読み手が判断できるレポートを設計する' },
            { section: '2.2.1', title: 'テストに関する活動の見積り', loCode: 'TM-2.2.1', kLevel: 'K2', learningTitle: '見積りの対象と前提を明確にする' },
            { section: '2.2.2', title: 'テスト工数に影響を与える要因', loCode: 'TM-2.2.2', kLevel: 'K2', learningTitle: 'プロダクト・プロセス・人の3つの要因' },
            { section: '2.2.3', title: 'テスト見積り技法の選択', loCode: 'TM-2.2.3', kLevel: 'K4', learningTitle: '類推・WBS・デルファイなどを使い分ける' },
            { section: '2.3.1', title: '欠陥のライフサイクル', loCode: 'TM-2.3.1', kLevel: 'K3', learningTitle: '発見からクローズまでの状態管理' },
            { section: '2.3.2', title: '機能横断的な欠陥マネジメント', loCode: 'TM-2.3.2', kLevel: 'K2', learningTitle: '開発・テスト・ビジネスが協働で欠陥に対処する' },
            { section: '2.3.3', title: 'アジャイルチームにおける欠陥マネジメント', loCode: 'TM-2.3.3', kLevel: 'K2', learningTitle: '軽量な欠陥管理とすぐ直す文化' },
            { section: '2.3.4', title: 'ハイブリッド開発における欠陥マネジメントの課題', loCode: 'TM-2.3.4', kLevel: 'K2', learningTitle: 'プロセスの違いをまたぐ欠陥管理' },
            { section: '2.3.5', title: '欠陥レポート情報', loCode: 'TM-2.3.5', kLevel: 'K3', learningTitle: '分析に耐える欠陥データを集める' },
            { section: '2.3.6', title: '欠陥データを用いたプロセス改善', loCode: 'TM-2.3.6', kLevel: 'K2', learningTitle: '欠陥の傾向から改善アクションを定義する' },
        ],
    },
    {
        chapter: '3',
        title: 'チームのマネジメント',
        sections: [
            { section: '3.1.1', title: '4つの能力領域における代表的なスキル', loCode: 'TM-3.1.1', kLevel: 'K2', learningTitle: '専門・方法論・ソーシャル・マネジメントの4領域' },
            { section: '3.1.2', title: 'チームメンバーに求められるスキルの分析', loCode: 'TM-3.1.2', kLevel: 'K4', learningTitle: 'プロジェクトに必要なスキルセットを設計する' },
            { section: '3.1.3', title: 'スキルアセスメント', loCode: 'TM-3.1.3', kLevel: 'K2', learningTitle: '現在地を把握してギャップを見える化する' },
            { section: '3.1.4', title: 'スキル開発', loCode: 'TM-3.1.4', kLevel: 'K2', learningTitle: '研修・OJT・資格でチームを育てる' },
            { section: '3.1.5', title: 'テストチームに必要なマネジメントスキル', loCode: 'TM-3.1.5', kLevel: 'K2', learningTitle: '調整・交渉・育成のスキル' },
            { section: '3.1.6', title: 'モチベーションを上げる要因・下げる要因', loCode: 'TM-3.1.6', kLevel: 'K2', learningTitle: 'チームの士気に効く要因を理解する' },
            { section: '3.2.1', title: '品質コスト', loCode: 'TM-3.2.1', kLevel: 'K2', learningTitle: '予防・評価・失敗コストでテストの価値を説明する' },
            { section: '3.2.2', title: 'テストの費用対効果', loCode: 'TM-3.2.2', kLevel: 'K3', learningTitle: 'テスト投資の効果をステークホルダーに示す' },
        ],
    },
];

export const topicMaps = {
    fl: flTopicMap,
    alta: altaTopicMap,
    altm: altmTopicMap,
};

// 参照したシラバスの版数（公式情報の確認先を示すための表示用メタデータ）
export const topicMapVersions = {
    fl: 'JSTQB Foundation Level シラバス v4.0 を参照',
    alta: 'JSTQB Advanced Level テストアナリスト シラバス v3.1.1 を参照',
    altm: 'JSTQB Advanced Level テストマネジメント シラバス v3.0 を参照',
};

// 旧名の互換エクスポート（既存テスト・コードが参照している場合に備える）
export const topicMap = flTopicMap;

export const officialLinks = [
    { label: 'JSTQB 公開情報', url: 'https://jstqb.jp/syllabus.html' },
    { label: 'ISTQB Certifications', url: 'https://www.istqb.org/certifications/' },
];
