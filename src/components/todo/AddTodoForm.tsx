// アイコンライブラリから Plus アイコンをインポート
import { Plus } from "lucide-react";
// shadcn/ui のボタンコンポーネント
import { Button } from "../ui/button";
// shadcn/ui のカードコンポーネント（見た目の枠組み）
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// shadcn/ui の入力フィールドコンポーネント
import { Input } from "../ui/input";
// 型定義ファイルから必要な型をインポート
import { VimMode } from "@/hooks/useVimMode";

/**
 * このコンポーネントが受け取るprops（引数）の型定義
 *
 * 初心者向けポイント：
 * - TypeScriptでは引数の型を明確に定義することで、バグを防げます
 * - vimHooks: Vimモードの状態と操作関数
 * - todoHooks: タスクの状態と操作関数
 */
interface AddTodoFormProps {
  // Vimモードの状態管理用のオブジェクト
  vimHooks: {
    // 現在のVimモード（"insert" または "normal"）
    mode: VimMode;
    // Vimモードを変更する関数
    setMode: (mode: VimMode) => void;
  };
  // タスク管理用のオブジェクト
  todoHooks: {
    // 新しく追加するタスクの内容を保持するオブジェクト
    newTodo: { task: string };
    // 新しいタスクの内容を更新する関数
    setNewTodo: (todo: { task: string }) => void;
    // タスクを追加する非同期関数（サーバーにデータを送信）
    addTodo: () => Promise<void>;
    // タスク追加処理中かどうかを示すフラグ
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
  };
}

/**
 * Todo追加フォームコンポーネント
 *
 * このコンポーネントの役割：
 * 1. Vimモードの表示（INSERT MODE / NORMAL MODE）
 * 2. タスク入力フィールドの管理
 * 3. キーボードショートカットの処理（Enter, Escape）
 * 4. タスク追加ボタンの提供
 *
 * 初心者向けポイント：
 * - Vimエディタのモード概念を再現しています
 * - INSERT MODE: 文字入力可能
 * - NORMAL MODE: キーボードナビゲーション用
 */
export default function AddTodoForm({ vimHooks, todoHooks }: AddTodoFormProps) {
  // キーボードイベントの処理関数を定義
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enterキーが押された場合の処理
    if (e.key === "Enter") {
      // 日本語入力（IME）の変換中かどうかをチェック
      // isComposingがtrueの場合、まだ変換が確定していないのでタスク追加しない
      if (e.nativeEvent.isComposing) {
        return; // 何もせずに関数を終了
      }

      // タスクを追加する処理を実行（非同期なのでawaitを使用）
      await todoHooks.addTodo();
      // タスク追加後、Vimモードを通常モードに戻す
      vimHooks.setMode("normal");
    }
    // Escapeキーが押された場合の処理
    else if (e.key === "Escape") {
      // Vimモードを通常モードに戻す
      vimHooks.setMode("normal");
      // 入力フィールドの内容を空にする
      todoHooks.setNewTodo({ task: "" });
      // 入力フィールドからフォーカスを外す（blur）
      (e.target as HTMLInputElement).blur();
    }
  };

  // コンポーネントのUIを返す
  return (
    <>
      <Card className="mb-6 bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-lg">
        {/* カードのヘッダー部分 */}
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-slate-100 flex items-center gap-2">
            {/* Vimモードを示すインジケーター（丸い点） */}
            <div
              className={`w-3 h-3 rounded-full ${
                vimHooks.mode === "insert" ? "bg-emerald-500" : "bg-rose-500"
              } animate-pulse shadow-sm`}
            />
            {/* 現在のVimモードをテキストで表示 */}
            {vimHooks.mode === "insert" ? "INSERT MODE" : "NORMAL MODE"}
          </CardTitle>
        </CardHeader>

        {/* カードの内容部分 */}
        <CardContent className="space-y-4">
          {/* 入力フィールドとボタンを横並びにするコンテナ */}
          {/* 入力エリア */}
          <div className="space-y-3">
            {/* 入力フィールドとボタン */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  id="new-task-input"
                  placeholder={
                    vimHooks.mode === "insert"
                      ? "Type your task and press Enter..."
                      : "Press 'i' or 'o' to add a task"
                  }
                  value={todoHooks.newTodo.task}
                  maxLength={200}
                  disabled={vimHooks.mode === "normal" || todoHooks.isLoading}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 200) {
                      todoHooks.setNewTodo({
                        ...todoHooks.newTodo,
                        task: value,
                      });
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  className={`transition-all duration-200 pr-16 ${
                    vimHooks.mode === "insert"
                      ? "bg-white dark:bg-slate-700 border-emerald-300 dark:border-emerald-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/30"
                      : "bg-slate-100 dark:bg-slate-700/50 border-rose-300/50 dark:border-rose-600/50 text-slate-500 placeholder:text-slate-400 cursor-not-allowed"
                  }`}
                />
                {/* 文字数カウンター（入力フィールド内） */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 pointer-events-none">
                  {todoHooks.newTodo.task.length}/200
                </div>
              </div>

              <Button
                onClick={todoHooks.addTodo}
                disabled={vimHooks.mode === "normal" || todoHooks.isLoading}
                className={`transition-all duration-200 shadow-md hover:shadow-lg ${
                  vimHooks.mode === "insert"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-slate-300 dark:bg-slate-600 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* 文字数制限警告 */}
            {todoHooks.newTodo.task.length > 180 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-amber-700 dark:text-amber-300">
                  残り{200 - todoHooks.newTodo.task.length}文字
                </span>
              </div>
            )}

            {/* エラー表示 */}
            {todoHooks.error && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-red-700 dark:text-red-300 flex-1">
                  {todoHooks.error}
                </span>
                <button
                  onClick={todoHooks.clearError}
                  className="text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300 transition-colors p-1 rounded hover:bg-red-100 dark:hover:bg-red-800/30"
                >
                  <Plus className="w-3 h-3 rotate-45" />
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
