/**
 * アプリケーションのフッターコンポーネント
 * 
 * このコンポーネントは以下を表示します：
 * - 使用している技術スタック（Next.js, React, Tailwind CSS）
 * - アプリケーションのブランドメッセージ
 * 
 * 初心者向けポイント：
 * - mt-12は上マージン（margin-top: 3rem）を意味します
 * - pb-8は下パディング（padding-bottom: 2rem）を意味します
 * - text-center でテキストを中央揃えにしています
 * - 色の濃さを変えて情報の重要度を表現しています
 */
export default function Footer() {
  return (
    <>
      {/* フッターセクション */}
      <div className="text-center mt-12 pb-8">
        {/* 技術スタック情報（メイン情報） */}
        <p className="text-gray-500 text-sm">
          Built with Next.js • React • Tailwind CSS
        </p>
        {/* ブランドメッセージ（補足情報） */}
        <p className="text-gray-600 text-xs mt-2">
          Vimendo - Modal editing for modern productivity
        </p>
      </div>
    </>
  );
}
