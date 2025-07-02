"use client";

import React, { useState } from "react";
import { CheckCircle, Eye, EyeOff, XCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FlowBackground from "@/components/ui/FlowBackground";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validatedPassword = (password: string): PasswordValidation => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    };
  };

  const passwordValidation = validatedPassword(formData.password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isPasswordMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!isPasswordValid) {
      setError("パスワードの要件を満たしていません");
      setIsLoading(false);
      return;
    }

    if (!isPasswordMatch) {
      setError("パスワードが一致しません");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // 登録成功後、自動ログインを実行
        const { signIn } = await import("next-auth/react");
        const signInResult = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false
        });

        if (signInResult?.ok) {
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          // 自動ログイン失敗時はログイン画面に誘導
          setTimeout(() => {
            window.location.href = "/auth/signin?message=registration-success";
          }, 2000);
        }
      } else {
        setError(data.error || "登録に失敗しました");
      }
    } catch (error) {
      setError("ネットワークエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    return Object.values(passwordValidation).filter(Boolean).length;
  };

  const strength = getPasswordStrength();
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
  const strengthLabels = ["弱い", "普通", "良い", "強い"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const renderForm = () => (
    <div className="relative w-full h-screen">
      <FlowBackground />
      
      {/* テーマ切り替えボタン */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {success ? (
          <Card className="w-[450px] bg-white/80 dark:bg-black/80 backdrop-blur-sm text-center">
            <CardContent className="p-10">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold mt-4">
                登録完了！
              </h2>
              <p className="text-muted-foreground mt-2">
                ユーザー登録が完了しました。<br />
                アプリケーションを開始します...
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-[450px] bg-white/80 dark:bg-black/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                新規ユーザー登録
              </CardTitle>
              <CardDescription>
                Vimflowを始めましょう
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center">
                    <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">名前 *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="山田太郎"
                    required
                    disabled={isLoading}
                    maxLength={50}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">パスワード *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="パスワードを入力"
                      required
                      disabled={isLoading}
                      maxLength={100}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${strength > 0 ? strengthColors[strength - 1] : 'bg-gray-200'}`}
                            style={{ width: `${(strength / 4) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {strength > 0 ? strengthLabels[strength - 1] : ""}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className={`flex items-center ${passwordValidation.length ? 'text-green-600' : 'text-gray-500'}`}>
                          {passwordValidation.length ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                          <span>8文字以上</span>
                        </div>
                        <div className={`flex items-center ${passwordValidation.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                          {passwordValidation.uppercase ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                          <span>大文字</span>
                        </div>
                        <div className={`flex items-center ${passwordValidation.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                          {passwordValidation.lowercase ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                          <span>小文字</span>
                        </div>
                        <div className={`flex items-center ${passwordValidation.number ? 'text-green-600' : 'text-gray-500'}`}>
                          {passwordValidation.number ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                          <span>数字</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">パスワード確認 *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="パスワードを再入力"
                      required
                      disabled={isLoading}
                      maxLength={100}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <div className="flex items-center text-sm mt-1">
                      {isPasswordMatch ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-green-700 dark:text-green-400">パスワードが一致しています</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="text-red-700 dark:text-red-400">パスワードが一致しません</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full transition-transform duration-200 active:scale-95"
                  disabled={isLoading || !formData.name || !formData.email || !isPasswordValid || !isPasswordMatch}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      登録中...
                    </div>
                  ) : (
                    "アカウントを作成"
                  )}
                </Button>
              </form>
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  既にアカウントをお持ちの方は{" "}
                  <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500 underline font-medium">
                    こちらからログイン
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  return renderForm();
}