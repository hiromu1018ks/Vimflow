"use client"

import React, { useState } from "react";
import { CheckCircle, Eye, EyeOff, XCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PasswordValidation {
  length : boolean;
  uppercase : boolean;
  lowercase : boolean;
  number : boolean;
}

export default function RegisterPage() {
  const [ formData, setFormData ] = useState({
    name : "",
    email : "",
    password : "",
    confirmPassword : ""
  });
  const [ isLoading, setIsLoading ] = useState(false);
  const [ showPassword, setShowPassword ] = useState(false);
  const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
  const [ error, setError ] = useState("");
  const [ success, setSuccess ] = useState(false);

  const validatedPassword = (password : string) : PasswordValidation => {
    return {
      length : password.length >= 8,
      uppercase : /[A-Z]/.test(password),
      lowercase : /[a-z]/.test(password),
      number : /\d/.test(password)
    };
  };

  const passwordValidation = validatedPassword(formData.password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isPasswordMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";

  // フォーム送信処理
  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // クライアントサイドバリデーション
    if ( !isPasswordValid ) {
      setError("パスワードの要件を満たしていません");
      setIsLoading(false);
      return;
    }

    if ( !isPasswordMatch ) {
      setError("パスワードが一致しません")
      setIsLoading(false);
      return;
    }

    try {
      console.log("ユーザー登録試行:", formData.email);

      const response = await fetch("/api/auth/register", {
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
        },
        body : JSON.stringify({
          name : formData.name,
          email : formData.email,
          password : formData.password,
        }),
      });

      const data = await response.json();
      console.log("登録レスポンス:", response.status, data);

      if ( response.ok ) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/auth/signin?message=registration-success';
        }, 2000)
      } else {
        setError(data.error || "登録に失敗しました");
      }
    } catch ( error ) {
      console.error("登録エラー", error);
      setError("ネットワークエラーが発生しました")
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (field : string, value : string) => {
    setFormData(prev => ( {
      ...prev,
      [field] : value
    } ));
    if ( error ) setError("");
  }

  // 登録成功画面

  if ( success ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500"/>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              登録完了！
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              ユーザー登録が完了しました。<br/>
              ログインページに移動します...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* ヘッダー */ }
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            新規ユーザー登録
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Vimflowを始めましょう
          </p>
        </div>

        {/* 登録フォーム */ }
        <form onSubmit={ handleSubmit } className="mt-8 space-y-6">
          {/* エラーメッセージ */ }
          { error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center">
              <XCircle className="w-4 h-4 mr-2 flex-shrink-0"/>
              { error }
            </div>
          ) }

          {/* 名前入力 */ }
          <div className="space-y-2">
            <Label htmlFor="name">名前 *</Label>
            <Input
              id="name"
              type="text"
              value={ formData.name }
              onChange={ (e) => handleInputChange('name', e.target.value) }
              placeholder="山田太郎"
              required
              disabled={ isLoading }
              maxLength={ 50 }
            />
          </div>

          {/* メールアドレス入力 */ }
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス *</Label>
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

          {/* パスワード入力 */ }
          <div className="space-y-2">
            <Label htmlFor="password">パスワード *</Label>
            <div className="relative">
              <Input
                id="password"
                type={ showPassword ? "text" : "password" }
                value={ formData.password }
                onChange={ (e) => handleInputChange('password', e.target.value) }
                placeholder="パスワードを入力"
                required
                disabled={ isLoading }
                maxLength={ 100 }
              />
              <button
                type="button"
                onClick={ () => setShowPassword(!showPassword) }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={ isLoading }
              >
                { showPassword ? <EyeOff size={ 20 }/> : <Eye size={ 20 }/> }
              </button>
            </div>

            {/* パスワード要件表示 */ }
            { formData.password && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  パスワード要件:
                </p>
                <div className="space-y-1">
                  { [
                    { key : 'length', label : '8文字以上', valid : passwordValidation.length },
                    { key : 'uppercase', label : '大文字を含む', valid : passwordValidation.uppercase },
                    { key : 'lowercase', label : '小文字を含む', valid : passwordValidation.lowercase },
                    { key : 'number', label : '数字を含む', valid : passwordValidation.number },
                  ].map(({ key, label, valid }) => (
                    <div key={ key } className="flex items-center text-sm">
                      { valid ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2"/>
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mr-2"/>
                      ) }
                      <span
                        className={ valid ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400" }>
                        { label }
                      </span>
                    </div>
                  )) }
                </div>
              </div>
            ) }
          </div>

          {/* パスワード確認入力 */ }
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">パスワード確認 *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={ showConfirmPassword ? "text" : "password" }
                value={ formData.confirmPassword }
                onChange={ (e) => handleInputChange('confirmPassword', e.target.value) }
                placeholder="パスワードを再入力"
                required
                disabled={ isLoading }
                maxLength={ 100 }
              />
              <button
                type="button"
                onClick={ () => setShowConfirmPassword(!showConfirmPassword) }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={ isLoading }
              >
                { showConfirmPassword ? <EyeOff size={ 20 }/> : <Eye size={ 20 }/> }
              </button>
            </div>

            {/* パスワード一致チェック */ }
            { formData.confirmPassword && (
              <div className="flex items-center text-sm mt-1">
                { isPasswordMatch ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2"/>
                    <span className="text-green-700 dark:text-green-400">パスワードが一致しています</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500 mr-2"/>
                    <span className="text-red-700 dark:text-red-400">パスワードが一致しません</span>
                  </>
                ) }
              </div>
            ) }
          </div>

          {/* 登録ボタン */ }
          <Button
            type="submit"
            className="w-full"
            disabled={ isLoading || !formData.name || !formData.email || !isPasswordValid || !isPasswordMatch }
          >
            { isLoading ? (
              <div className="flex items-center justify-center">
                <div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                登録中...
              </div>
            ) : (
              'アカウントを作成'
            ) }
          </Button>
        </form>

        {/* ログインリンク */ }
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            既にアカウントをお持ちの方は{ " " }
            <Link
              href="/auth/signin"
              className="text-blue-600 hover:text-blue-500 underline font-medium"
            >
              こちらからログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}