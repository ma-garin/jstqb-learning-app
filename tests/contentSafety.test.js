import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { questions as flQuestions } from '../js/questionsData_fl.js';
import { questions as altaQuestions } from '../js/questionsData_alta.js';
import { questions as altmQuestions } from '../js/questionsData_altm.js';

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
