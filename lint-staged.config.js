module.exports = {
  "*.{js,jsx,ts,tsx}": [
    // JavaScript/TypeScriptファイルに対して
    "eslint --fix", // → コードの問題を自動修正
    "prettier --write", // → コードを綺麗に整形
  ],
  "*.{json,md,yml,yaml}": [
    // 設定ファイルやドキュメントに対して
    "prettier --write", // → コードを綺麗に整形
  ],
};
