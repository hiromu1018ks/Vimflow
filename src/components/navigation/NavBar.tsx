"use client"

import React from 'react'
import { useSession } from "next-auth/react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SignOutButton from "@/components/auth/SignOutButton";

export default function NavBar() {
  const { data : session } = useSession();

  if ( !session ) {
    return null;
  }

  return (
    <nav className="relative z-20 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/*左側:ロゴとナビゲーション*/ }
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="/vimendo_header_logo.svg"
                alt="Vimflow"
              />
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <span className="text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 text-sm font-medium">
                タスク管理
              </span>
            </div>
          </div>
          {/* 右側：ユーザー情報、テーマ切り替え、ログアウト */ }
          <div className="flex items-center space-x-4">
            {/* ユーザーアバター */ }
            { session.user?.image && (
              <img
                className="h-8 w-8 rounded-full"
                src={ session.user.image }
                alt={ session.user.name || 'User' }
              />
            ) }

            {/* ユーザー名 */ }
            <span className="text-sm text-gray-700 dark:text-gray-300">
              { session.user?.name || session.user?.email }
            </span>

            {/* テーマ切り替え */ }
            <ThemeToggle/>

            {/* ログアウトボタン */ }
            <SignOutButton/>
          </div>
        </div>
      </div>
    </nav>
  )
}
