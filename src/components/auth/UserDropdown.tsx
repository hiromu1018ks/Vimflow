"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import Image from "next/image";

export default function UserDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session) return null;

  return (
    <div className="relative">
      {/*ドロップダウントリガー*/}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 h-10 px-3 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
      >
        {session.user?.image && (
          <Image
            className="h-6 w-6 rounded-full"
            src={session.user.image}
            alt={session.user.name || "User"}
            width={24}
            height={24}
          />
        )}
        <span>{session.user?.name || session.user?.email}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
            {session.user?.email}
          </div>

          <button
            onClick={() => {
              /* プロフィール設定 */
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <User className="h-4 w-4 mr-3" />
            profile[未実装]
          </button>

          <button
            onClick={() => {
              /* 設定 */
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings className="h-4 w-4 mr-3" />
            settings[未実装]
          </button>

          <hr className="border-gray-200 dark:border-gray-600" />

          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut className="h-4 w-4 mr-3" />
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}
