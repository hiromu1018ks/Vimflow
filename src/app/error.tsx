"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FlowBackground from "@/components/ui/FlowBackground";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="relative w-full h-screen">
      <FlowBackground />
      
      {/* テーマ切り替えボタン */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Card className="w-[450px] bg-white/80 dark:bg-black/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
              エラーが発生しました
            </CardTitle>
            <CardDescription>
              申し訳ございません。予期しないエラーが発生しました。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* エラー詳細（開発環境でのみ表示） */}
            {process.env.NODE_ENV === 'development' && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-300 font-mono break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
            
            {/* アクションボタン */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={reset}
                className="w-full transition-transform duration-200 active:scale-95"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                再試行
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="w-full transition-transform duration-200 active:scale-95"
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  ホームに戻る
                </Link>
              </Button>
            </div>
            
            {/* サポート情報 */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-muted-foreground">
                問題が続く場合は、ブラウザをリフレッシュするか<br />
                しばらく時間をおいてから再度お試しください。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}