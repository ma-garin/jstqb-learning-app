// 公開シラバスは学習領域の位置確認にのみ使用し、本文や学習目標文は収録しない。
export const topicMap = [
    {
        chapter: '1',
        title: 'テストの基本',
        sections: [
            { section: '1.1', title: 'テストの目的', loCode: '', kLevel: 'K1', learningTitle: '品質判断に必要な情報を集める' },
            { section: '1.2', title: '開発中の確認', loCode: '', kLevel: 'K1', learningTitle: '早い段階で認識のずれを見つける' },
        ],
    },
    {
        chapter: '2',
        title: 'テストの進め方',
        sections: [
            { section: '2.1', title: '計画と優先順位', loCode: '', kLevel: 'K2', learningTitle: '重要なリスクから確認する' },
            { section: '2.2', title: '結果と報告', loCode: '', kLevel: 'K2', learningTitle: '判断できる形で結果を伝える' },
        ],
    },
    {
        chapter: '3',
        title: '代表的な設計の考え方',
        sections: [
            { section: '3.1', title: '同じ扱いの値', loCode: '', kLevel: 'K2', learningTitle: '入力を意味のあるグループに分ける' },
            { section: '3.2', title: '境界の値', loCode: '', kLevel: 'K2', learningTitle: '条件が切り替わる端を確認する' },
            { section: '3.3', title: '状態と遷移', loCode: '', kLevel: 'K2', learningTitle: '操作による状態変化を追う' },
        ],
    },
    {
        chapter: '4',
        title: '現場での品質活動',
        sections: [
            { section: '4.1', title: 'レビュー', loCode: '', kLevel: 'K1', learningTitle: '実行前に抜けや曖昧さを探す' },
            { section: '4.2', title: '不具合報告', loCode: '', kLevel: 'K2', learningTitle: '再現と判断に必要な情報を残す' },
            { section: '4.3', title: '変更後の確認', loCode: '', kLevel: 'K2', learningTitle: '修正による周辺影響を確かめる' },
        ],
    },
];

export const officialLinks = [
    { label: 'JSTQB 公開情報', url: 'https://jstqb.jp/syllabus.html' },
    { label: 'ISTQB Certifications', url: 'https://www.istqb.org/certifications/' },
];
