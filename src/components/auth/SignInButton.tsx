"use client"

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <Button
      onClick={ () => signIn('google', { callbackUrl : '/' }) }
      className="w-full"
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        {/*{Google Icon}*/ }
      </svg>
      Google Sign In
    </Button>
  )
}