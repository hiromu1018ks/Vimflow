"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react"; // useThemeフックをインポート

export default function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme(); // テーマ情報と切り替え関数を取得

  return (
    <button
      onClick={toggleTheme} // ボタンがクリックされたらtoggleTheme関数を実行
      className={`
        h-10 w-10 rounded-md
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        hover:scale-105
        ${
          isDark // isDarkの値に応じて、ボタンのスタイルを切り替える
            ? "bg-gray-700 border border-gray-600 text-white hover:bg-gray-600" // ダークモード時のスタイル
            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50" // ライトモード時のスタイル
        }
      `}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`} // スクリーンリーダー用の説明
    >
      {isDark ? ( // isDarkがtrueならライトモードへの切り替え表示
        <Sun className="h-4 w-4" />
      ) : (
        // isDarkがfalseならダークモードへの切り替え表示
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
