import SignInButton from "@/components/auth/SignInButton";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Vimflowにサインイン
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            効率的なタスク管理を始めましょう
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <SignInButton/>
        </div>
      </div>
    </div>
  );
}