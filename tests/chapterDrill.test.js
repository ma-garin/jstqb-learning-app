import { beforeEach, describe, expect, it } from 'vitest';
import { filterQuestionsByChapter, saveQuizMeta } from '../js/study.js';

const QUESTIONS = [
    { id: 'q1', sectionRef: '1.1.1' },
    { id: 'q2', sectionRef: '1.4.1' },
    { id: 'q3', sectionRef: '2.1' },
    { id: 'q4' },
];

beforeEach(() => {
    localStorage.clear();
});

describe('filterQuestionsByChapter', () => {
    it('sectionRefの章番号で問題を絞り込む', () => {
        expect(filterQuestionsByChapter(QUESTIONS, '1').map(question => question.id)).toEqual(['q1', 'q2']);
        expect(filterQuestionsByChapter(QUESTIONS, '2').map(question => question.id)).toEqual(['q3']);
    });

    it('章が未選択なら全問題を返す', () => {
        expect(filterQuestionsByChapter(QUESTIONS, '')).toEqual(QUESTIONS);
    });
});

describe('saveQuizMeta', () => {
    it('章ドリルのメタデータを資格別キーへ保存する', () => {
        const meta = saveQuizMeta('alta', '2', 'リスクベースドテスト');

        expect(meta).toEqual({
            mode: 'chapter',
            chapter: '2',
            chapterTitle: 'リスクベースドテスト',
        });
        expect(localStorage.getItem('alta_quiz_meta')).toBe(JSON.stringify(meta));
    });

    it('全章選択のメタデータを保存する', () => {
        saveQuizMeta('fl');
        expect(JSON.parse(localStorage.getItem('fl_quiz_meta'))).toEqual({
            mode: 'all',
            chapter: '',
            chapterTitle: '',
        });
    });
});
