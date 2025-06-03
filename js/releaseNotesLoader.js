// js/releaseNotesLoader.js

document.addEventListener('DOMContentLoaded', loadReleaseNotes);

/**
 * CSVファイルをフェッチし、リリースノートテーブルを生成して表示する
 */
async function loadReleaseNotes() {
    const releaseNotesContentDiv = document.getElementById('release-notes-content');
    if (!releaseNotesContentDiv) {
        console.error("Release notes content div not found.");
        return;
    }

    try {
        const response = await fetch('data/release_notes.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        const versions = parseCsv(csvText);

        if (versions.length > 0) {
            // 最新のバージョンから表示するためにソート
            versions.sort((a, b) => {
                // バージョン番号を比較可能な形式に変換（例: "1.0.0" -> [1, 0, 0]）
                const parseVersion = (v) => v.split('.').map(Number);
                const vA = parseVersion(a.version);
                const vB = parseVersion(b.version);

                for (let i = 0; i < Math.max(vA.length, vB.length); i++) {
                    const numA = vA[i] || 0;
                    const numB = vB[i] || 0;
                    if (numA > numB) return -1; // 降順
                    if (numA < numB) return 1;  // 降順
                }
                // バージョンが同じ場合は日付でもソート（新しい日付が上）
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });

            let tableHtml = `
                <table class="release-notes-table">
                    <thead>
                        <tr>
                            <th>Ver.</th>
                            <th>日付</th>
                            <th>対応内容</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            versions.forEach(versionEntry => {
                tableHtml += `
                    <tr>
                        <td>${versionEntry.version}</td>
                        <td>${versionEntry.date}</td>
                        <td>${convertMarkdownToHtml(versionEntry.content)}</td>
                    </tr>
                `;
            });
            tableHtml += `
                    </tbody>
                </table>
            `;
            releaseNotesContentDiv.innerHTML = tableHtml;
        } else {
            releaseNotesContentDiv.innerHTML = '<p>リリースノートはまだありません。</p>';
        }
    } catch (error) {
        console.error("Failed to load release notes:", error);
        releaseNotesContentDiv.innerHTML = '<p style="color: red;">リリースノートの読み込み中にエラーが発生しました。</p>';
    }
}

/**
 * CSVテキストをパースしてオブジェクトの配列に変換する
 * @param {string} csvText - CSV形式の文字列
 * @returns {Array<Object>} パースされたデータ
 */
function parseCsv(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCsvLine(lines[i]);
        if (values.length !== headers.length) {
            console.warn(`Skipping malformed CSV line: ${lines[i]}`);
            continue;
        }
        const row = {};
        headers.forEach((header, index) => {
            // ヘッダー名に応じてプロパティ名を調整
            if (header === 'Ver.') {
                row.version = values[index];
            } else if (header === '日付') {
                row.date = values[index];
            } else if (header === '対応内容') {
                row.content = values[index];
            } else {
                row[header.toLowerCase()] = values[index]; // その他のヘッダーは小文字で
            }
        });
        data.push(row);
    }
    return data;
}

/**
 * CSVの1行をパースする（ダブルクォーテーション対応）
 * @param {string} line - CSVの1行
 * @returns {Array<string>} パースされた値の配列
 */
function parseCsvLine(line) {
    const result = [];
    let inQuote = false;
    let currentField = '';

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuote && i + 1 < line.length && line[i + 1] === '"') {
                // Escaped double quote
                currentField += '"';
                i++; // Skip next quote
            } else {
                inQuote = !inQuote;
            }
        } else if (char === ',' && !inQuote) {
            result.push(currentField);
            currentField = '';
        } else {
            currentField += char;
        }
    }
    result.push(currentField); // Add the last field
    return result;
}


/**
 * 簡単なMarkdownをHTMLに変換する関数
 * @param {string} markdownText
 * @returns {string} HTML文字列
 */
function convertMarkdownToHtml(markdownText) {
    let html = markdownText;

    // ヘッダー (H1, H2, H3)
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // 太字
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');

    // リスト (UL)
    // ネストされたリストは考慮しない簡易版
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>'); // * もリストとして扱う
    // 連続するliをまとめる
    html = html.replace(/(<li>.*<\/li>)\n(<li>.*<\/li>)/gs, '$1$2'); // 連続する<li>を結合
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>'); // ulで囲む

    // 段落 (P) と改行
    // リストやヘッダーではない行をpタグで囲む
    html = html.split('\n').map(line => {
        if (line.trim() === '' || line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('<li>') || line.startsWith('<p>')) {
            return line; // 空行、ヘッダー、リスト、既にpタグの行はそのまま
        }
        return `<p>${line}</p>`;
    }).join('');

    // 連続する<p></p>をまとめる
    html = html.replace(/<\/p><p>/g, '');

    return html;
}
