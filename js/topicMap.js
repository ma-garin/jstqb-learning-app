// 公開シラバスは学習領域の位置確認にのみ使用し、本文や学習目標文は収録しない。
export const topicMap = [
    {
        chapter: '1',
        title: 'テストの基本',
        sections: [
            { section: '1.1', title: 'テストの目的', loCode: '', kLevel: 'K1', learningTitle: '品質判断に必要な情報を集める' },
            { section: '1.2', title: '開発中の早期確認', loCode: '', kLevel: 'K1', learningTitle: '早い段階で認識のずれを見つける' },
            { section: '1.3', title: 'テストの7原則', loCode: '', kLevel: 'K1', learningTitle: 'テストの限界と考え方を理解する' },
            { section: '1.4', title: '欠陥の原因と影響', loCode: '', kLevel: 'K2', learningTitle: 'ミス・欠陥・故障の連鎖を理解する' },
        ],
    },
    {
        chapter: '2',
        title: 'テストレベルとテストタイプ',
        sections: [
            { section: '2.1', title: 'テストレベル', loCode: '', kLevel: 'K1', learningTitle: '単体・結合・システム・受入の違い' },
            { section: '2.2', title: 'テストタイプ', loCode: '', kLevel: 'K1', learningTitle: '機能・非機能・構造・変更関連' },
            { section: '2.3', title: '非機能テスト', loCode: '', kLevel: 'K2', learningTitle: '性能・負荷・セキュリティ・ユーザビリティ' },
            { section: '2.4', title: '確認テストと回帰テスト', loCode: '', kLevel: 'K2', learningTitle: '修正確認と周辺影響確認の違い' },
        ],
    },
    {
        chapter: '3',
        title: 'テスト設計技法',
        sections: [
            { section: '3.1', title: '同値分割', loCode: '', kLevel: 'K2', learningTitle: '入力を意味のあるグループに分ける' },
            { section: '3.2', title: '境界値分析', loCode: '', kLevel: 'K2', learningTitle: '条件が切り替わる端を確認する' },
            { section: '3.3', title: '決定表テスト', loCode: '', kLevel: 'K2', learningTitle: '複数条件の組み合わせを網羅する' },
            { section: '3.4', title: '状態遷移テスト', loCode: '', kLevel: 'K2', learningTitle: '操作による状態変化を追う' },
            { section: '3.5', title: 'ユースケーステスト', loCode: '', kLevel: 'K2', learningTitle: 'ユーザーの一連の操作を検証する' },
            { section: '3.6', title: 'ペアワイズテスト', loCode: '', kLevel: 'K2', learningTitle: '組み合わせ爆発を効率よく削減する' },
            { section: '3.7', title: 'ブラックボックス vs ホワイトボックス', loCode: '', kLevel: 'K2', learningTitle: '仕様ベースと構造ベースの設計を使い分ける' },
            { section: '3.8', title: 'カバレッジ基準', loCode: '', kLevel: 'K2', learningTitle: '文書・分岐カバレッジの意味を理解する' },
            { section: '3.9', title: '経験ベーステスト', loCode: '', kLevel: 'K2', learningTitle: 'エラー推測・探索的テスト・チェックリスト' },
        ],
    },
    {
        chapter: '4',
        title: 'テストの進め方',
        sections: [
            { section: '4.1', title: 'テスト計画', loCode: '', kLevel: 'K1', learningTitle: '目的・スコープ・スケジュールを定める' },
            { section: '4.2', title: 'テストモニタリングとコントロール', loCode: '', kLevel: 'K2', learningTitle: '重要なリスクから確認し、問題を調整する' },
            { section: '4.3', title: 'テスト完了基準', loCode: '', kLevel: 'K2', learningTitle: '実行結果・残留リスクで判断する' },
            { section: '4.4', title: 'テスト報告書', loCode: '', kLevel: 'K1', learningTitle: '判断できる形で結果を伝える' },
            { section: '4.5', title: 'テスト見積もり', loCode: '', kLevel: 'K2', learningTitle: '工数と優先度を見積もる' },
        ],
    },
    {
        chapter: '5',
        title: '静的テストとレビュー',
        sections: [
            { section: '5.1', title: 'レビューの目的と種類', loCode: '', kLevel: 'K1', learningTitle: '実行前に抜けや曖昧さを探す' },
            { section: '5.2', title: '要件・設計・コードレビュー', loCode: '', kLevel: 'K2', learningTitle: '各フェーズで見つかりやすい問題' },
            { section: '5.3', title: '静的解析ツール', loCode: '', kLevel: 'K1', learningTitle: 'lintなどでコードの問題を自動検出する' },
        ],
    },
    {
        chapter: '6',
        title: '現場での品質活動',
        sections: [
            { section: '6.1', title: '不具合報告', loCode: '', kLevel: 'K2', learningTitle: '再現と判断に必要な情報を残す' },
            { section: '6.2', title: '欠陥の重大度と優先度', loCode: '', kLevel: 'K2', learningTitle: 'バグトリアージの考え方' },
            { section: '6.3', title: 'バグのライフサイクル', loCode: '', kLevel: 'K1', learningTitle: '発見からクローズまでの流れ' },
            { section: '6.4', title: 'ルートコーズ分析', loCode: '', kLevel: 'K2', learningTitle: '根本原因を掘り下げて再発を防ぐ' },
            { section: '6.5', title: 'リスク優先度', loCode: '', kLevel: 'K2', learningTitle: '発生頻度と影響の大きさで優先する' },
        ],
    },
    {
        chapter: '7',
        title: 'テストツールと自動化',
        sections: [
            { section: '7.1', title: 'テストツールの種類', loCode: '', kLevel: 'K1', learningTitle: '実行・管理・解析・欠陥管理ツール' },
            { section: '7.2', title: 'テスト自動化の目的とリスク', loCode: '', kLevel: 'K2', learningTitle: '自動化のメリットと保守コスト' },
            { section: '7.3', title: 'CI/CDとテスト', loCode: '', kLevel: 'K2', learningTitle: '継続的インテグレーションへの組み込み' },
            { section: '7.4', title: 'テスト環境の管理', loCode: '', kLevel: 'K1', learningTitle: '環境の再現性と差異管理' },
            { section: '7.5', title: 'テストダブル（スタブ・モック）', loCode: '', kLevel: 'K2', learningTitle: '依存コンポーネントを置き換えて分離する' },
        ],
    },
    {
        chapter: '8',
        title: 'アジャイルとモダン開発でのテスト',
        sections: [
            { section: '8.1', title: 'アジャイルにおけるテスト', loCode: '', kLevel: 'K1', learningTitle: 'スプリントでのテスト活動' },
            { section: '8.2', title: 'テスト駆動開発（TDD）', loCode: '', kLevel: 'K2', learningTitle: 'テストを先に書いて実装を導く' },
            { section: '8.3', title: 'シフトレフトテスト', loCode: '', kLevel: 'K1', learningTitle: '早い段階からテストを組み込む' },
            { section: '8.4', title: 'カナリアリリースとフィーチャーフラグ', loCode: '', kLevel: 'K2', learningTitle: '段階的リリースでリスクを下げる' },
        ],
    },
];

export const altaTopicMap = [
    {
        chapter: '1',
        title: 'リスクベーストテストにおけるタスク',
        sections: [
            { section: '1.1', title: 'リスクの識別', loCode: 'TA-1.1', kLevel: 'K2', learningTitle: 'プロダクトリスクと品質リスクを見極める' },
            { section: '1.2', title: 'リスクアセスメント', loCode: 'TA-1.2', kLevel: 'K3', learningTitle: '発生可能性と影響度でリスクレベルを評価する' },
            { section: '1.3', title: 'リスク軽減策とテスト優先度付け', loCode: 'TA-1.3', kLevel: 'K3', learningTitle: '高リスク領域に優先的にテストリソースを配分する' },
            { section: '1.4', title: 'リスク再評価とサイクル調整', loCode: 'TA-1.4', kLevel: 'K2', learningTitle: '各テストサイクルでリスク状況を更新する' },
        ],
    },
    {
        chapter: '2',
        title: 'テストプロセスにおけるタスク',
        sections: [
            { section: '2.1', title: 'テスト分析', loCode: 'TA-2.1', kLevel: 'K3', learningTitle: 'テストベースから何をテストするかを識別する' },
            { section: '2.2', title: 'テスト設計', loCode: 'TA-2.2', kLevel: 'K3', learningTitle: 'テスト条件からハイレベル・ローレベルテストケースを作る' },
            { section: '2.3', title: 'テスト実装', loCode: 'TA-2.3', kLevel: 'K3', learningTitle: 'テスト手順書・テストデータ・テスト環境を整える' },
            { section: '2.4', title: 'テスト実行と欠陥報告', loCode: 'TA-2.4', kLevel: 'K3', learningTitle: '実行結果の記録と再現性ある欠陥報告' },
            { section: '2.5', title: 'トレーサビリティの維持', loCode: 'TA-2.5', kLevel: 'K2', learningTitle: '要件・リスク・テストケースの対応関係を管理する' },
        ],
    },
    {
        chapter: '3',
        title: 'テスト技法',
        sections: [
            { section: '3.1', title: '同値分割（高度な適用）', loCode: 'TA-3.1', kLevel: 'K3', learningTitle: '弱い/強い同値分割と有効/無効クラスを適切に使う' },
            { section: '3.2', title: '境界値分析（2値・3値BVA）', loCode: 'TA-3.2', kLevel: 'K3', learningTitle: '2点・3点BVAの違いを判断して適用する' },
            { section: '3.3', title: 'デシジョンテーブルテスト', loCode: 'TA-3.3', kLevel: 'K3', learningTitle: 'ルール統合とDon\'t Careで効率化する' },
            { section: '3.4', title: '状態遷移テスト（高度な適用）', loCode: 'TA-3.4', kLevel: 'K3', learningTitle: 'n-スイッチカバレッジとシーケンスを設計する' },
            { section: '3.5', title: 'ペアワイズテスト・オールペア法', loCode: 'TA-3.5', kLevel: 'K3', learningTitle: '多パラメーター組み合わせを最小テスト件数でカバーする' },
            { section: '3.6', title: 'クラシフィケーションツリー技法', loCode: 'TA-3.6', kLevel: 'K3', learningTitle: '入力を木構造で体系化しテスト組み合わせを可視化する' },
            { section: '3.7', title: 'ユースケーステスト・ユーザーストーリーテスト', loCode: 'TA-3.7', kLevel: 'K3', learningTitle: 'メインシナリオと代替フローを体系的にテストする' },
            { section: '3.8', title: 'ドメイン分析テスト', loCode: 'TA-3.8', kLevel: 'K3', learningTitle: '複数変数の依存関係を考慮した境界の組み合わせ' },
            { section: '3.9', title: '欠陥ベーステスト技法', loCode: 'TA-3.9', kLevel: 'K2', learningTitle: '欠陥タクソノミーを参照して見落としを防ぐ' },
            { section: '3.10', title: '探索的テスト', loCode: 'TA-3.10', kLevel: 'K3', learningTitle: 'セッションベーステストで学習・設計・実行を同時に行う' },
            { section: '3.11', title: 'エラー推測', loCode: 'TA-3.11', kLevel: 'K3', learningTitle: '経験と直感を体系化して欠陥を予測する' },
            { section: '3.12', title: 'チェックリストベーステスト', loCode: 'TA-3.12', kLevel: 'K2', learningTitle: 'チェックリストを継続改善して観点の漏れを防ぐ' },
        ],
    },
    {
        chapter: '4',
        title: 'ソフトウェア品質特性',
        sections: [
            { section: '4.1', title: '機能的品質特性', loCode: 'TA-4.1', kLevel: 'K2', learningTitle: '機能正確性・完全性・適切性のテスト観点' },
            { section: '4.2', title: '信頼性テスト', loCode: 'TA-4.2', kLevel: 'K2', learningTitle: '成熟性・可用性・耐障害性・回復性を評価する' },
            { section: '4.3', title: '性能効率性テスト', loCode: 'TA-4.3', kLevel: 'K2', learningTitle: '時間挙動・リソース利用・キャパシティの計測' },
            { section: '4.4', title: '使用性テスト', loCode: 'TA-4.4', kLevel: 'K3', learningTitle: 'ユーザビリティ・アクセシビリティ・習得容易性を評価する' },
            { section: '4.5', title: 'セキュリティテスト', loCode: 'TA-4.5', kLevel: 'K2', learningTitle: '機密性・完全性・否認防止・真正性・責任追跡性' },
            { section: '4.6', title: '互換性テスト', loCode: 'TA-4.6', kLevel: 'K2', learningTitle: '相互運用性と共存性のテスト設計' },
            { section: '4.7', title: '保守性テスト', loCode: 'TA-4.7', kLevel: 'K2', learningTitle: '変更容易性・テスト容易性・モジュール性の確認' },
            { section: '4.8', title: '移植性テスト', loCode: 'TA-4.8', kLevel: 'K2', learningTitle: '異なる環境への適応性とインストール可能性' },
        ],
    },
    {
        chapter: '5',
        title: 'レビューにおけるテストアナリストのタスク',
        sections: [
            { section: '5.1', title: 'テストアナリストのレビュー観点', loCode: 'TA-5.1', kLevel: 'K2', learningTitle: '要件・設計・テストベースのテスト可能性を評価する' },
            { section: '5.2', title: 'レビュー技法の選択と活用', loCode: 'TA-5.2', kLevel: 'K3', learningTitle: 'ウォークスルー・インスペクション・チェックリストを使い分ける' },
        ],
    },
    {
        chapter: '6',
        title: 'テストツール',
        sections: [
            { section: '6.1', title: 'テスト設計・実装支援ツール', loCode: 'TA-6.1', kLevel: 'K2', learningTitle: 'クラシフィケーションツリーエディタ等の設計ツール活用' },
            { section: '6.2', title: 'テストデータ準備ツール', loCode: 'TA-6.2', kLevel: 'K2', learningTitle: '大量テストデータの生成とマスキング自動化' },
            { section: '6.3', title: 'テスト自動実行ツール', loCode: 'TA-6.3', kLevel: 'K2', learningTitle: 'キーワード駆動・データ駆動テストによる自動化' },
        ],
    },
];

export const altmTopicMap = [
    {
        chapter: '1',
        title: '組織の中のテスティング',
        sections: [
            { section: '1.1', title: 'テスト方針とテスト戦略', loCode: 'TM-1.1', kLevel: 'K2', learningTitle: '組織のゴールに沿ったテスト方針・戦略を策定する' },
            { section: '1.2', title: 'ライフサイクルへのテスト戦略の適合', loCode: 'TM-1.2', kLevel: 'K2', learningTitle: 'ウォーターフォール・アジャイル・DevOpsでの戦略の違い' },
            { section: '1.3', title: 'リスクベーストテストとその他の優先度付け', loCode: 'TM-1.3', kLevel: 'K3', learningTitle: 'リスク評価と組織制約を統合してテスト優先度を決める' },
            { section: '1.4', title: 'テストプロセス改善の取り組み', loCode: 'TM-1.4', kLevel: 'K2', learningTitle: 'TMMi・TPI Next等のモデルを使ったプロセス改善' },
        ],
    },
    {
        chapter: '2',
        title: 'テストマネジメント',
        sections: [
            { section: '2.1', title: 'テスト計画の立案', loCode: 'TM-2.1', kLevel: 'K3', learningTitle: 'スコープ・リスク・リソース・スケジュールを計画する' },
            { section: '2.2', title: 'テストモニタリングとコントロール', loCode: 'TM-2.2', kLevel: 'K3', learningTitle: 'テストメトリクスを使って進捗を把握し是正する' },
            { section: '2.3', title: 'テスト見積もり技法', loCode: 'TM-2.3', kLevel: 'K3', learningTitle: '類推・デルファイ法・WBSでテスト工数を見積もる' },
            { section: '2.4', title: 'テスト報告と意思決定支援', loCode: 'TM-2.4', kLevel: 'K3', learningTitle: '経営層・ステークホルダーに判断できる形で報告する' },
            { section: '2.5', title: '分散・アウトソースチームのマネジメント', loCode: 'TM-2.5', kLevel: 'K2', learningTitle: 'オフショア・クロスファンクショナルチームの管理' },
        ],
    },
    {
        chapter: '3',
        title: 'レビューのマネジメント',
        sections: [
            { section: '3.1', title: 'マネジメントレビューと監査', loCode: 'TM-3.1', kLevel: 'K2', learningTitle: 'プロジェクト品質状況を経営層が把握するレビュー' },
            { section: '3.2', title: 'ライフサイクルモデル別のレビュー戦略', loCode: 'TM-3.2', kLevel: 'K2', learningTitle: 'ウォーターフォールとアジャイルでのレビュー戦略の違い' },
            { section: '3.3', title: 'レビュープロセスの管理', loCode: 'TM-3.3', kLevel: 'K3', learningTitle: 'レビュー計画・役割分担・結果管理を担う' },
        ],
    },
    {
        chapter: '4',
        title: '欠陥マネジメント',
        sections: [
            { section: '4.1', title: '欠陥ライフサイクルと管理プロセス', loCode: 'TM-4.1', kLevel: 'K2', learningTitle: '発見・分類・優先度付け・クローズまでの欠陥追跡' },
            { section: '4.2', title: '欠陥報告情報の活用', loCode: 'TM-4.2', kLevel: 'K3', learningTitle: '欠陥データを分析してプロセス・品質改善に活かす' },
            { section: '4.3', title: '欠陥メトリクスとプロセス能力評価', loCode: 'TM-4.3', kLevel: 'K3', learningTitle: 'DRE・欠陥密度・根本原因分析でプロセス品質を測定する' },
        ],
    },
    {
        chapter: '5',
        title: 'テストプロセスの改善',
        sections: [
            { section: '5.1', title: 'テスト改善のアプローチ', loCode: 'TM-5.1', kLevel: 'K2', learningTitle: 'PDCAサイクルを使ったテストプロセス継続改善' },
            { section: '5.2', title: 'TMMi（テスト成熟度モデル統合）', loCode: 'TM-5.2', kLevel: 'K2', learningTitle: '5段階成熟度でテスト組織の現状と目標を評価する' },
            { section: '5.3', title: 'TPI Next（テストプロセス改善Next）', loCode: 'TM-5.3', kLevel: 'K2', learningTitle: '16のキーエリアで改善ポイントを特定する' },
            { section: '5.4', title: 'その他の改善モデル（CTP/STEP）', loCode: 'TM-5.4', kLevel: 'K1', learningTitle: 'CTPとSTEPの特徴と適用場面を理解する' },
        ],
    },
    {
        chapter: '6',
        title: 'テストツールと自動化のマネジメント',
        sections: [
            { section: '6.1', title: 'テストツールの評価と選択', loCode: 'TM-6.1', kLevel: 'K3', learningTitle: 'ROI・互換性・保守コストを考慮してツールを選定する' },
            { section: '6.2', title: 'テストツールの導入ライフサイクル', loCode: 'TM-6.2', kLevel: 'K2', learningTitle: 'パイロット・展開・保守・廃止のライフサイクル管理' },
            { section: '6.3', title: 'テスト自動化アーキテクチャとメトリクス', loCode: 'TM-6.3', kLevel: 'K2', learningTitle: '自動化ROI・成功率・保守工数を計測する' },
        ],
    },
];

export const topicMaps = {
    'qa-basic': topicMap,
    'alta': altaTopicMap,
    'altm': altmTopicMap,
};

export const officialLinks = [
    { label: 'JSTQB 公開情報', url: 'https://jstqb.jp/syllabus.html' },
    { label: 'ISTQB Certifications', url: 'https://www.istqb.org/certifications/' },
];
