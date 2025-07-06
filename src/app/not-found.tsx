"use client";

import React from "react";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FlowBackground from "@/components/ui/FlowBackground";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";

export default function NotFoundPage() {
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
              <FileQuestion className="h-16 w-16 text-blue-500" />
            </div>
            <CardTitle className="text-2xl font-bold">
              ページが見つかりません
            </CardTitle>
            <CardDescription>
              お探しのページは存在しないか、移動した可能性があります。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 404情報 */}
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-6xl font-bold text-blue-500 mb-2">404</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Page Not Found
              </p>
            </div>

            {/* 推奨アクション */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                以下をお試しください：
              </p>
              <ul className="text-sm text-muted-foreground text-left space-y-1 mb-4">
                <li>• URLを正しく入力しているか確認してください</li>
                <li>• ブラウザの戻るボタンで前のページに戻る</li>
                <li>• ホームページから目的のページを探す</li>
              </ul>
            </div>

            {/* アクションボタン */}
            <div className="flex flex-col gap-3">
              <Button
                asChild
                className="w-full transition-transform duration-200 active:scale-95"
                variant="default"
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  ホームに戻る
                </Link>
              </Button>

              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="w-full transition-transform duration-200 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                前のページに戻る
              </Button>
            </div>

            {/* ヘルプ情報 */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-muted-foreground">
                Vimflow - 効率的なタスク管理
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
