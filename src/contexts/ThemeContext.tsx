"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'

// テーマの種類を定義する型（ライトモードまたはダークモード）
type Theme = "light" | "dark"

// テーマコンテキストで提供されるデータと関数の型定義
interface ThemeContextType {
  theme : Theme;        // 現在のテーマ状態
  toggleTheme : () => void;  // テーマを切り替える関数
  isDark : boolean;     // ダークモードかどうかを判定するフラグ
}

// テーマコンテキストを作成（初期値はundefined）
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * テーマプロバイダーコンポーネント
 * アプリケーション全体でテーマ状態を管理し、子コンポーネントに提供する
 */
export function ThemeProvider({ children } : { children : React.ReactNode }) {
  // テーマ状態を管理するstate（デフォルトはライトモード）
  const [ theme, setTheme ] = useState<Theme>("light");

  // コンポーネントがマウントされたかどうかを追跡するstate
  // これによりサーバーサイドレンダリング時のハイドレーションエラーを防ぐ
  const [ mounted, setMounted ] = useState(false);

  // 初回マウント時にテーマを初期化するeffect
  useEffect(() => {
    // localStorageに保存されたテーマ設定を取得
    const saved = localStorage.getItem("theme") as Theme;
    if ( saved ) {
      // 保存されたテーマが存在する場合はそれを使用
      setTheme(saved);
    } else {
      // 保存されたテーマがない場合はシステムの設定を確認
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? "dark" : "light");
    }
    // マウント完了フラグを立てる
    setMounted(true);
  }, []);

  // テーマが変更された際にlocalStorageへの保存とDOM操作を行うeffect
  useEffect(() => {
    if ( mounted ) {
      // 現在のテーマをlocalStorageに保存
      localStorage.setItem('theme', theme);

      // ダークモードの場合はhtmlタグにdarkクラスを追加
      // ライトモードの場合はdarkクラスを削除
      if ( theme === "dark" ) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [ theme, mounted ]);

  // テーマを切り替える関数
  // 現在がライトモードならダークモードに、ダークモードならライトモードに切り替える
  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  }

  // まだマウントされていない場合はデフォルト値でThemeProviderを提供
  // これによりサーバーサイドレンダリング時のクラス不整合を防ぎつつ、useThemeを使用可能にする
  if ( !mounted ) {
    return (
      <ThemeContext.Provider
        value={ {
          theme: "light",
          toggleTheme: () => {},
          isDark: false
        } }>
        { children }
      </ThemeContext.Provider>
    )
  }

  // テーマコンテキストプロバイダーで子コンポーネントをラップ
  // テーマ状態、切り替え関数、ダークモード判定フラグを提供
  return (
    <ThemeContext.Provider
      value={ {
        theme,
        toggleTheme,
        isDark : theme === "dark"
      } }>
      { children }
    </ThemeContext.Provider>
  )
}

/**
 * テーマコンテキストを使用するためのカスタムフック
 * テーマプロバイダー内でのみ使用可能
 */
export function useTheme() {
  // テーマコンテキストから現在の値を取得
  const context = useContext(ThemeContext);

  // コンテキストが未定義の場合はエラーを投げる
  // これによりプロバイダー外での使用を防ぐ
  if ( context === undefined ) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  // テーマコンテキストの値を返す
  return context;
}