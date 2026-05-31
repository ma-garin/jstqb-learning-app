const STORAGE_KEY = 'jstqb_selected_exam';
const VALID_EXAMS = ['alta', 'altm'];

export function getExam() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return VALID_EXAMS.includes(stored) ? stored : 'alta';
}

export function setExam(exam) {
    if (!VALID_EXAMS.includes(exam)) return;
    localStorage.setItem(STORAGE_KEY, exam);
}
