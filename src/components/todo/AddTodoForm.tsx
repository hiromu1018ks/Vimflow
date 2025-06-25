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
  };
}

/**
 * タスク追加フォームコンポーネント
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
      {/* メインのカードコンテナ - 背景色とボーダーを設定 */}
      <Card className="mb-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        {/* カードのヘッダー部分 */}
        <CardHeader>
          {/* カードのタイトル部分 - Vimモードの表示 */}
          <CardTitle className="text-white flex items-center gap-2">
            {/* Vimモードを示すインジケーター（丸い点） */}
            <div
              className={`w-3 h-3 rounded-full ${
                // INSERTモードの場合は緑色、NORMALモードの場合は赤色
                vimHooks.mode === "insert" ? "bg-green-400" : "bg-red-400"
              } animate-pulse`}
            />
            {/* 現在のVimモードをテキストで表示 */}
            {vimHooks.mode === "insert" ? "INSERT MODE" : "NORMAL MODE"}
          </CardTitle>
        </CardHeader>

        {/* カードの内容部分 */}
        <CardContent className="space-y-4">
          {/* 入力フィールドとボタンを横並びにするコンテナ */}
          <div className="flex gap-3">
            {/* タスク入力フィールド */}
            <Input
              // 入力フィールドのID（アクセシビリティ用）
              id="new-task-input"
              // プレースホルダーテキスト（入力例の表示）
              placeholder={
                vimHooks.mode === "insert"
                  ? "Type your task and press Enter..."
                  : "Press 'i' or 'o' to add a task"
              }
              // 入力フィールドの現在の値（制御されたコンポーネント）
              value={todoHooks.newTodo.task}
              // 入力フィールドの無効化条件（NORMALモードまたは処理中の場合）
              disabled={vimHooks.mode === "normal" || todoHooks.isLoading}
              // 入力値が変更された時の処理
              onChange={(e) =>
                // 新しいタスクの内容を更新（スプレッド構文で既存の値を保持）
                todoHooks.setNewTodo({
                  ...todoHooks.newTodo,
                  task: e.target.value,
                })
              }
              // キーボードイベントの処理
              onKeyDown={handleKeyDown}
              // 動的なスタイル設定（Vimモードに応じて色を変更）
              className={`transition-all duration-200 ${
                vimHooks.mode === "insert"
                  ? "bg-gray-700/50 border-green-500 text-white placeholder:text-gray-400 focus:border-green-400 focus:ring-green-400/50"
                  : "bg-gray-700/30 border-red-500/50 text-gray-500 placeholder:text-gray-500 cursor-not-allowed"
              }`}
            />

            {/* タスク追加ボタン */}
            <Button
              // ボタンクリック時の処理
              onClick={todoHooks.addTodo}
              // ボタンの無効化条件（NORMALモードまたは処理中の場合）
              disabled={vimHooks.mode === "normal" || todoHooks.isLoading}
              // 動的なスタイル設定（Vimモードに応じて色を変更）
              className={`transition-all duration-200 shadow-lg hover:shadow-xl ${
                vimHooks.mode === "insert"
                  ? "bg-green-400 text-black hover:bg-green-300"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {/* Plusアイコンを表示 */}
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
