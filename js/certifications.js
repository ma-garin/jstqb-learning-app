// 学習対象資格の定義。問題数は更新時に同期すること。
export const CERTIFICATIONS = [
    {
        id: 'qa-basic',
        name: 'QA基礎',
        fullName: 'ソフトウェアテスト QA基礎',
        description: 'テストの基本・設計技法・プロセス管理など基礎全般',
        level: 'foundation',
        questionCount: 152,
        available: true,
        dataFile: 'questionsData',
    },
    {
        id: 'alta',
        name: 'ALTA',
        fullName: 'Advanced Level テストアナリスト',
        description: 'テスト技法・リスクベーストテスト・品質特性・ツール',
        level: 'advanced',
        questionCount: 40,
        available: true,
        dataFile: 'questionsData_alta',
    },
    {
        id: 'altm',
        name: 'ALTM',
        fullName: 'Advanced Level テストマネジメント',
        description: 'テスト計画・リスク管理・メトリクス・チームマネジメント',
        level: 'advanced',
        questionCount: 40,
        available: true,
        dataFile: 'questionsData_altm',
    },
    {
        id: 'ct-ai',
        name: 'CT-AI',
        fullName: 'AIテスティング (CT-AI)',
        description: 'AI/ML基礎・AIシステムのテスト技法・AIツール活用',
        level: 'specialist',
        questionCount: 0,
        available: false,
        dataFile: 'questionsData_ctai',
    },
    {
        id: 'ct-genai',
        name: 'CT-GenAI',
        fullName: '生成AIテスティング (CT-GenAI)',
        description: 'プロンプトエンジニアリング・ハルシネーション・LLMインフラ',
        level: 'specialist',
        questionCount: 0,
        available: false,
        dataFile: 'questionsData_ctgenai',
    },
];

export const SELECTED_CERT_KEY = 'qa_selected_cert';

export function getSelectedCert() {
    return localStorage.getItem(SELECTED_CERT_KEY) || 'qa-basic';
}

export function setSelectedCert(certId) {
    localStorage.setItem(SELECTED_CERT_KEY, certId);
}

export function getCertById(certId) {
    return CERTIFICATIONS.find(c => c.id === certId) || CERTIFICATIONS[0];
}
