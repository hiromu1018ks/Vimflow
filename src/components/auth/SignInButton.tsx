"use client"

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";

/**
 * サインインコンポーネント
 *
 * 機能概要:
 * - メールアドレス/パスワードでのログイン
 * - Google OAuth認証
 * - GitHub OAuth認証
 * - 新規登録ページへのリンク
 *
 * 状態管理:
 * - isCredentials: メールアドレスログインフォームの表示切り替え
 * - formData: フォーム入力値の管理
 * - isLoading: ローディング状態
 * - showPassword: パスワード表示/非表示
 * - error: エラーメッセージ
 */
export default function SignInButton() {
  // ========== 状態管理 ==========

  /** メールアドレスログインフォームの表示状態 */
  const [ isCredentials, setIsCredentials ] = useState(false);

  /** フォーム入力データ */
  const [ formData, setFormData ] = useState({
    email : '',
    password : ''
  })

  /** ローディング状態（API通信中など） */
  const [ isLoading, setIsLoading ] = useState(false);

  /** パスワード表示/非表示の切り替え */
  const [ showPassword, setShowPassword ] = useState(false);

  /** エラーメッセージ */
  const [ error, setError ] = useState("");

  // ========== イベントハンドラー ==========

  /**
   * メールアドレス・パスワードでのログイン処理
   *
   * 処理フロー:
   * 1. バリデーション（必須項目チェック）
   * 2. NextAuth.jsのcredentials認証を実行
   * 3. 認証結果に応じてエラー表示またはリダイレクト
   *
   * @param e - フォーム送信イベント
   */
  const handleCredentialsSignIn = async (e : React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("ログイン試行:", formData.email);

      // NextAuth.jsのcredentials認証を実行
      // redirect: falseにより、認証後の自動リダイレクトを無効化
      const result = await signIn("credentials", {
        email : formData.email,
        password : formData.password,
        redirect : false,
      });

      console.log("ログイン結果:", result);

      // 認証結果の判定
      if ( result?.error ) {
        console.log("ログインエラー:", result.error);
        setError('メールアドレスまたはパスワードが正しくありません');
      } else if ( result?.ok ) {
        console.log("ログイン成功、リダイレクト中...");
        // 認証成功時はホームページにリダイレクト
        window.location.href = '/';
      } else {
        // 予期しないエラーの場合
        setError('ログインに失敗しました');
      }
    } catch ( error ) {
      // ネットワークエラーやその他の例外
      console.error("ログイン処理エラー:", error);
      setError('ネットワークエラーが発生しました');
    } finally {
      // 成功・失敗に関わらずローディング状態を解除
      setIsLoading(false);
    }
  }

  /**
   * フォーム入力値の更新処理
   *
   * 機能:
   * - 指定されたフィールドの値を更新
   * - エラー状態をクリア（ユーザーが再入力を開始した際の UX向上）
   *
   * @param field - 更新対象のフィールド名 ('email' | 'password')
   * @param value - 新しい値
   */
  const handleInputChange = (field : string, value : string) => {
    setFormData(prev => ( {
      ...prev,
      [field] : value
    } ));
    // ユーザーが入力を開始したらエラーメッセージをクリア
    if ( error ) setError("")
  }

  // ========== レンダリング ==========

  /**
   * メールアドレスログインフォーム
   * isCredentials が true の場合に表示される
   */
  if ( isCredentials ) {
    return (
      <div className="space-y-2">
        <form onSubmit={ handleCredentialsSignIn } className="space-y-4">

          {/* エラーメッセージ表示エリア */ }
          { error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              { error }
            </div>
          ) }

          {/* メールアドレス入力フィールド */ }
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={ formData.email }
              onChange={ (e) => handleInputChange('email', e.target.value) }
              placeholder="your@email.com"
              required
              disabled={ isLoading }
            />
          </div>

          {/* パスワード入力フィールド（表示/非表示切り替え機能付き） */ }
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <div className="relative">
              <Input
                id="password"
                type={ showPassword ? 'text' : 'password' }
                value={ formData.password }
                onChange={ (e) => handleInputChange('password', e.target.value) }
                placeholder="パスワードを入力"
                required
                disabled={ isLoading }
              />
              {/* パスワード表示/非表示切り替えボタン */ }
              <button
                type="button"
                onClick={ () => setShowPassword(!showPassword) }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={ isLoading }
                aria-label={ showPassword ? "パスワードを非表示" : "パスワードを表示" }
              >
                { showPassword ? <EyeOff size={ 20 }/> : <Eye size={ 20 }/> }
              </button>
            </div>
          </div>

          {/* ログイン実行ボタン */ }
          <Button
            type="submit"
            className="w-full transition-transform duration-200 active:scale-95"
            disabled={ isLoading || !formData.email || !formData.password }
          >
            { isLoading ? (
              // ローディング中の表示（スピナー付き）
              <div className="flex items-center justify-center">
                <div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ログイン中...
              </div>
            ) : (
              "ログイン"
            ) }
          </Button>
        </form>

        {/* 新規登録ページへのリンク */ }
        <div className="text-center">
          <Link
            href="/auth/register"
            className="text-sm text-blue-600 hover:text-blue-500 underline"
          >
            新規ユーザー登録はこちら
          </Link>
        </div>

        {/* OAuth認証選択画面に戻るボタン */ }
        <Button
          onClick={ () => {
            setIsCredentials(false);
            setError("");
            setFormData({ email : "", password : "" });
          } }
          variant="outline"
          className="w-full transition-transform duration-200 active:scale-95"
          disabled={ isLoading }
        >
          他の方法でログイン
        </Button>
      </div>
    )
  }

  /**
   * ログイン方法選択画面（デフォルト表示）
   * - メールアドレスログイン
   * - Google OAuth
   * - GitHub OAuth
   */
  return (
    <div className="space-y-4">

      {/* メールアドレスログイン選択ボタン */ }
      <Button
        onClick={ () => setIsCredentials(true) }
        className="w-full transition-transform duration-200 active:scale-95"
        variant="default"
      >
        <Mail/> メールアドレスでログイン
      </Button>

      {/* 区切り線（視覚的な分離） */ }
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"/>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">または</span>
        </div>
      </div>

      {/* Google OAuth認証ボタン */ }
      <Button
        onClick={ () => signIn('google', { callbackUrl : '/' }) }
        className="w-full transition-transform duration-200 active:scale-95"
        variant="outline"
      >
        {/* Googleアイコン（SVG） */ }
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Googleでログイン
      </Button>

      {/* GitHub OAuth認証ボタン */ }
      <Button
        onClick={ () => signIn('github', { callbackUrl : '/' }) }
        className="w-full transition-transform duration-200 active:scale-95"
        variant="outline"
      >
        {/* GitHubアイコン（SVG） */ }
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        GitHubでログイン
      </Button>

      {/* 新規登録への誘導リンク */ }
      <div className="text-center pt-4">
        <p className="text-sm text-gray-600">
          アカウントをお持ちでない方は{ " " }
          <Link
            href="/auth/register"
            className="text-blue-600 hover:text-blue-500 underline font-medium"
          >
            こちらから新規登録
          </Link>
        </p>
      </div>
    </div>
  )
}