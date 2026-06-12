function getChapter(question) {
    return question?.sectionRef ? String(question.sectionRef).split('.')[0] : null;
}

export function aggregateChapterStats(questions, answeredIds, wrongIds) {
    const answered = new Set(answeredIds || []);
    const wrong = new Set(wrongIds || []);
    const stats = new Map();

    (questions || []).forEach(question => {
        const chapter = getChapter(question);
        if (!chapter) return;

        if (!stats.has(chapter)) {
            stats.set(chapter, { chapter, total: 0, answered: 0, correct: 0 });
        }

        const item = stats.get(chapter);
        item.total += 1;
        if (answered.has(question.id)) {
            item.answered += 1;
            if (!wrong.has(question.id)) item.correct += 1;
        }
    });

    return [...stats.values()].map(item => ({
        ...item,
        correctRate: item.answered ? Math.round((item.correct / item.answered) * 100) : 0,
        achievement: item.total ? Math.round((item.correct / item.total) * 100) : 0,
    }));
}
