"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react"; // useThemeフックをインポート

export default function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme(); // テーマ情報と切り替え関数を取得

  return (
    <button
      onClick={ toggleTheme } // ボタンがクリックされたらtoggleTheme関数を実行
      className={ `
        fixed top-6 right-6 z-50 /* 画面の右上（上から6、右から6の距離）に固定表示し、z-indexで最前面に */
        px-4 py-2 rounded-full /* パディングと角丸 */
        font-medium text-sm /* フォントの太さとサイズ */
        transition-all duration-300 ease-in-out /* 全てのプロパティの変化を0.3秒かけてスムーズに */
        transform hover:scale-105 hover:-translate-y-1 /* ホバー時に少し拡大し、上に移動するアニメーション */
        backdrop-filter backdrop-blur-md /* 背景をぼかすガラスエフェクト */
        ${ isDark // isDarkの値に応じて、ボタンのスタイルを切り替える
        ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20 shadow-lg' // ダークモード時のスタイル
        : 'bg-white/80 border border-black/10 text-gray-800 hover:bg-white/95 shadow-lg' // ライトモード時のスタイル
      }
      ` }
      aria-label={ `Switch to ${ isDark ? 'light' : 'dark' } mode` } // スクリーンリーダー用の説明
    >
      <span className="flex items-center gap-2">
        { isDark ? ( // isDarkがtrueならライトモードへの切り替え表示
          <>
            <span className="text-lg"><Sun/></span> {/* 太陽の絵文字 */ }
          </>
        ) : ( // isDarkがfalseならダークモードへの切り替え表示
          <>
            <span className="text-lg"><Moon/></span> {/* 月の絵文字 */ }
          </>
        ) }
      </span>
    </button>
  );
}