export const GLOBAL_KEYS = {
    selectedCert: 'qa_selected_cert',
    schemaVersion: 'app_schema_version',
    streak: 'app_streak',
    lastDate: 'app_last_date',
};
export function certKey(certId, suffix) { return `${certId}_${suffix}`; }
export const SUFFIXES = {
    today: 'progress_today',
    total: 'total_answered',
    wrong: 'wrong_questions',
    answeredIds: 'answered_ids',
    lessonsRead: 'lessons_read',
    quizQuestions: 'quiz_questions',
    quizNextIndex: 'quiz_next_index',
    quizCorrectCount: 'quiz_correct_count',
    quizAnswerLog: 'quiz_answer_log',
    quizPaused: 'quiz_paused',
    quizMeta: 'quiz_meta',
};
