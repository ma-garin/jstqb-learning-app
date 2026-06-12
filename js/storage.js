export const STORAGE_KEYS={session:'exam_starter_session',result:'exam_starter_result',answered:'exam_starter_answered'};
export function readJson(key,fallback,storage=localStorage){try{const value=JSON.parse(storage.getItem(key));return value??fallback}catch{return fallback}}
export function writeJson(key,value,storage=localStorage){storage.setItem(key,JSON.stringify(value))}
export function clearLearningData(storage=localStorage){Object.values(STORAGE_KEYS).forEach(key=>storage.removeItem(key))}
export function getAnsweredCount(storage=localStorage){const ids=readJson(STORAGE_KEYS.answered,[],storage);return Array.isArray(ids)?new Set(ids).size:0}
export function recordAnswered(id,storage=localStorage){const ids=readJson(STORAGE_KEYS.answered,[],storage);writeJson(STORAGE_KEYS.answered,[...new Set([...ids,id])],storage)}
