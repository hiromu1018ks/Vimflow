// Next.jsの最適化された画像コンポーネントをインポート
import Image from "next/image";

/**
 * アプリケーションのヘッダーコンポーネント
 * 
 * このコンポーネントは以下を表示します：
 * - Vimendoのロゴ画像
 * - アプリケーションの説明文
 * 
 * 初心者向けポイント：
 * - Next.js Imageコンポーネントは自動で画像を最適化してくれます
 * - SVGファイルはベクター形式なので、どんなサイズでも綺麗に表示されます
 * - className="mx-auto"で水平中央配置を実現しています
 */
export default function TodoHeader() {
  return (
    // メインコンテナ（テキストを中央揃え、下にマージン8）
    <div className="text-center mb-8">
      {/* ロゴ画像のコンテナ */}
      <div className="mb-6">
        <Image
          src="/vimendo_header_logo.svg"          // publicフォルダ内の画像パス
          alt="Vimendo - Modal Todo Editor"        // スクリーンリーダー用の説明文
          width={400}                              // 画像の幅（レイアウトシフト防止）
          height={120}                             // 画像の高さ（レイアウトシフト防止）
          className="mx-auto"                      // 水平中央配置（margin: 0 auto;）
          priority                                 // 重要な画像なので優先的に読み込み
        />
      </div>
      {/* アプリケーションの説明文 */}
      <p className="text-gray-400 text-lg">
        Vim-inspired modal editing for your tasks
      </p>
    </div>
  );
}
