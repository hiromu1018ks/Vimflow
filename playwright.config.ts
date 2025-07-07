import { defineConfig, devices } from "@playwright/test";

/**
 * ファイルから環境変数を読み込む
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * テスト設定については https://playwright.dev/docs/test-configuration をご覧ください
 */
export default defineConfig({
  testDir: "./e2e",
  /* ファイル内のテストを並列で実行 */
  fullyParallel: true,
  /* CI環境で誤ってtest.onlyがソースコードに残っている場合はビルドを失敗させる */
  forbidOnly: !!process.env.CI,
  /* CI環境でのみリトライ */
  retries: process.env.CI ? 2 : 0,
  /* CI環境では並列テストを無効化 */
  workers: process.env.CI ? 1 : undefined,
  /* 使用するレポーター。詳細は https://playwright.dev/docs/test-reporters をご覧ください */
  reporter: "html",
  /* 以下のすべてのプロジェクトで共有される設定。詳細は https://playwright.dev/docs/api/class-testoptions をご覧ください */
  use: {
    /* `await page.goto('/')` のようなアクションで使用するベースURL */
    baseURL: "http://localhost:3000",

    /* 失敗したテストの再試行時にトレースを収集。詳細は https://playwright.dev/docs/trace-viewer をご覧ください */
    trace: "on-first-retry",
  },

  /* 主要ブラウザのプロジェクト設定 */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    //
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* モバイルビューポートに対するテスト */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* ブランド付きブラウザに対するテスト */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* テスト開始前にローカル開発サーバーを実行 */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
