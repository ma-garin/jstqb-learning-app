// js/top.js

// main.js から showScreen をインポートする必要はない。
// main.js が initWelcomeScreen を呼び出し、main.js 自身がボタンイベントを設定する。

export function initWelcomeScreen() {
    // welcome-screen に固有の初期化処理があればここに追加
    // 現在は main.js でボタンイベントを設定するため、ここでは特に処理なし
    console.log("Welcome Screen Initialized.");
}