import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { questions as flQuestions } from '../js/questionsData_fl.js';
import { questions as altaQuestions } from '../js/questionsData_alta.js';
import { questions as altmQuestions } from '../js/questionsData_altm.js';
import { altaTopicMap, altmTopicMap } from '../js/topicMap.js';

const ROOT = process.cwd();
const QUESTION_SETS = [
    { file: '../js/questionsData_fl.js', questions: flQuestions, idPrefix: /^fl-/ },
    { file: '../js/questionsData_alta.js', questions: altaQuestions, idPrefix: /^alta-/ },
    { file: '../js/questionsData_altm.js', questions: altmQuestions, idPrefix: /^altm-/ },
];

function walk(dir) {
    return readdirSync(dir).flatMap(name => {
        if (name === '.git' || name === 'node_modules') return [];
        const path = join(dir, name);
        return statSync(path).isDirectory() ? walk(path) : [path];
    });
}

describe('権利安全チェック', () => {
    it.each(QUESTION_SETS)('$file は独自コンテンツ用スキーマを満たす', ({ questions, idPrefix }) => {
        expect(questions.length).toBeGreaterThan(0);
        questions.forEach(question => {
            expect(question.id).toMatch(idPrefix);
            expect(question.sourcePolicy).toBe('original');
            expect(question.officialQuestionUsed).toBe(false);
            expect(question.certificationReference).toContain('topic map');
            expect(question.choices).toHaveLength(4);
            expect(question.correctAnswerIndex).toBeGreaterThanOrEqual(0);
            expect(question.correctAnswerIndex).toBeLessThanOrEqual(3);
            expect(question.reviewerStatus).toBe('reviewed');
        });
    });

    it('ALTAレッスンは独自コンテンツ用スキーマと参照整合性を満たす', async context => {
        let lessons;
        try {
            ({ lessons } = await import('../js/lessonsData_alta.js'));
        } catch {
            context.skip();
            return;
        }

        const sectionRefs = new Set(altaTopicMap.flatMap(chapter => chapter.sections.map(section => section.section)));
        const questionIds = new Set(altaQuestions.map(question => question.id));
        expect(lessons.length).toBeGreaterThan(0);
        lessons.forEach(lesson => {
            expect(lesson.sourcePolicy).toBe('original');
            expect(lesson.officialTextUsed).toBe(false);
            expect(lesson.reviewerStatus).toBe('reviewed');
            const paragraphCharacters = lesson.body
                .flatMap(block => block.paragraphs)
                .reduce((total, paragraph) => total + paragraph.length, 0);
            expect(paragraphCharacters).toBeGreaterThan(300);
            expect(sectionRefs.has(lesson.sectionRef)).toBe(true);
            lesson.relatedQuestionIds.forEach(questionId => expect(questionIds.has(questionId)).toBe(true));
            expect(lesson.id).toBe(`alta-${lesson.sectionRef}`);
        });
    });

    it('ALTMレッスンは独自コンテンツ用スキーマと参照整合性を満たす', async context => {
        let lessons;
        try {
            ({ lessons } = await import('../js/lessonsData_altm.js'));
        } catch {
            context.skip();
            return;
        }

        const sectionRefs = new Set(altmTopicMap.flatMap(chapter => chapter.sections.map(section => section.section)));
        const questionIds = new Set(altmQuestions.map(question => question.id));
        expect(lessons.length).toBeGreaterThan(0);
        lessons.forEach(lesson => {
            expect(lesson.sourcePolicy).toBe('original');
            expect(lesson.officialTextUsed).toBe(false);
            expect(lesson.reviewerStatus).toBe('reviewed');
            const paragraphCharacters = lesson.body
                .flatMap(block => block.paragraphs)
                .reduce((total, paragraph) => total + paragraph.length, 0);
            expect(paragraphCharacters).toBeGreaterThan(300);
            expect(sectionRefs.has(lesson.sectionRef)).toBe(true);
            lesson.relatedQuestionIds.forEach(questionId => expect(questionIds.has(questionId)).toBe(true));
            expect(lesson.id).toBe(`altm-${lesson.sectionRef}`);
        });
    });

    it('現行HEADの作業ファイルにPDFと旧公式風画像がない', () => {
        const files = walk(ROOT).map(path => relative(ROOT, path));
        expect(files.filter(path => path.toLowerCase().endsWith('.pdf'))).toEqual([]);
        expect(files).not.toContain('img/JSTQB_TA.png');
    });

    it('削除済みの旧データ参照がない', () => {
        const targets = walk(ROOT).filter(path =>
            /\.(?:html|js|json|md|css|csv)$/.test(path)
            && relative(ROOT, path) !== 'tests/contentSafety.test.js'
        );
        const combined = targets.map(path => readFileSync(path, 'utf8')).join('\n');
        const forbiddenPatterns = [
            new RegExp('assumedProblemsData_' + '(?:alta|altm)'),
            new RegExp('mockExamData_' + 'alta'),
            new RegExp('glossaryData_' + '(?:alta|altm)'),
            new RegExp('img/' + 'JSTQB_TA\\.png'),
        ];
        forbiddenPatterns.forEach(pattern => expect(combined).not.toMatch(pattern));
    });
});
