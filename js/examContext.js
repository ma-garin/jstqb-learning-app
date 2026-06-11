const STORAGE_KEY = 'qa_basic_course';

export function getExam() {
    return localStorage.getItem(STORAGE_KEY) || 'qa-basic';
}

export function setExam() {
    localStorage.setItem(STORAGE_KEY, 'qa-basic');
}
