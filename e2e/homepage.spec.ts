import { expect, test } from "@playwright/test";

test("homepage should load correctly", async ({ page }) => {
  // 1. トップページにアクセス
  await page.goto("/");

  // 2. ページタイトルに "Vimflow" が含まれているかチェック
  await expect(page).toHaveTitle(/Vimflow/);
});

test("page should have main content", async ({ page }) => {
  // 1. トップページにアクセス
  await page.goto("/");

  // 2. 何かしらのメインコンテンツが表示されているかチェック
  await expect(page.locator("body")).toBeVisible();
});
