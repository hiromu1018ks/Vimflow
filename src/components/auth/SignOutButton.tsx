"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";

export default function AnimatedSignOutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);

    // アニメーション用の遅延
    await new Promise((resolve) => setTimeout(resolve, 500));

    await signOut({
      callbackUrl: "/auth/signin",
      redirect: true,
    });
  };

  return (
    <Button
      onClick={handleSignOut}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className={`
        flex items-center gap-2 transition-all duration-300
        ${isLoading ? "animate-pulse" : "hover:scale-105"}
      `}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      {isLoading ? "ログアウト中..." : "ログアウト"}
    </Button>
  );
}
