export { auth as middleware } from "@/lib/auth";

export const config = {
  // 🆕 最適化された matcher 設定
  matcher: [
    /*
     * 以下のパスを除く全てのルートで認証チェックを実行:
     * - api/auth (認証API)
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化)
     * - favicon.ico (ファビコン)
     * - ルートディレクトリの画像ファイル
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
