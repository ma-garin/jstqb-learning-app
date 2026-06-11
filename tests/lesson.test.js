import { describe, expect, it } from 'vitest';
import { parseLessonId, resolveAdjacentLessons, toggleLearnedLesson } from '../js/lesson.js';

describe('レッスンの純粋ロジック', () => {
    it('レッスンIDからcertIdとsectionRefを抽出する', () => {
        expect(parseLessonId('alta-1.4.1')).toEqual({ certId: 'alta', sectionRef: '1.4.1' });
        expect(parseLessonId('unknown-1.2')).toBeNull();
        expect(parseLessonId('alta')).toBeNull();
    });

    it('配列順で前後のレッスンを解決する', () => {
        const lessons = [
            { id: 'alta-1.2' },
            { id: 'alta-1.3' },
            { id: 'alta-1.4.1' },
        ];

        expect(resolveAdjacentLessons(lessons, 'alta-1.3')).toEqual({
            previous: lessons[0],
            next: lessons[2],
        });
        expect(resolveAdjacentLessons(lessons, 'alta-1.2')).toEqual({
            previous: null,
            next: lessons[1],
        });
        expect(resolveAdjacentLessons(lessons, 'missing')).toEqual({ previous: null, next: null });
    });

    it('学習済みIDを追加・解除する', () => {
        const initial = ['alta-1.2'];
        expect(toggleLearnedLesson(initial, 'alta-1.3')).toEqual(['alta-1.2', 'alta-1.3']);
        expect(toggleLearnedLesson(initial, 'alta-1.2')).toEqual([]);
        expect(initial).toEqual(['alta-1.2']);
    });
});
