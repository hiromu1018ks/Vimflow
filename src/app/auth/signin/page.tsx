import SignInButton from "@/components/auth/SignInButton";
import FlowBackground from "@/components/ui/FlowBackground";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function SignInPage() {
  return (
    <div className="relative w-full h-screen">
      <FlowBackground />
      
      {/* テーマ切り替えボタン */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Card className="w-[400px] bg-white/80 dark:bg-black/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Vimflowにサインイン
            </CardTitle>
            <CardDescription>
              効率的なタスク管理を始めましょう
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}