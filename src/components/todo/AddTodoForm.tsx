// アイコンライブラリから Plus アイコンをインポート
import { Plus } from "lucide-react";
// shadcn/ui のボタンコンポーネント
import { Button } from "../ui/button";
// shadcn/ui のカードコンポーネント（見た目の枠組み）
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// shadcn/ui の入力フィールドコンポーネント
import { Input } from "../ui/input";
// 型定義ファイルから必要な型をインポート
import { createTask, getAllTask } from "@/types/type";
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
  vimHooks: { 
    mode: VimMode;                              // 現在のVimモード（"normal" | "insert"）
    setMode: (mode: VimMode) => void;           // モードを変更する関数
  };
  todoHooks: {
    todos: getAllTask[];                        // 全タスクの配列
    newTodo: createTask;                        // 新しく作成中のタスク
    setNewTodo: (task: createTask) => void;     // 新タスクを更新する関数
    addTodo: () => void;                        // タスクを追加する関数
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
  return (
    <>
      {/* タスク追加フォームセクション */}
      <Card className="mb-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        
        {/* フォームのヘッダー：現在のVimモードを表示 */}
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            {/* モードインジケーター（色付きの丸） */}
            <div
              className={`w-3 h-3 rounded-full ${
                vimHooks.mode === "insert" 
                  ? "bg-green-400"      // INSERT MODE: 緑色（操作可能）
                  : "bg-red-400"        // NORMAL MODE: 赤色（読み取り専用）
              } animate-pulse`}          // 点滅アニメーション
            />
            {/* モード名をテキストで表示 */}
            {vimHooks.mode === "insert" ? "INSERT MODE" : "NORMAL MODE"}
          </CardTitle>
        </CardHeader>
        
        {/* フォームのメインコンテンツ */}
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            
            {/* タスク入力フィールド */}
            <Input
              id="new-task-input"                   // Vimモードでフォーカス時に使用するID
              placeholder={
                vimHooks.mode === "insert"
                  ? "Type your task and press Enter..."      // INSERT MODE: 入力方法を案内
                  : "Press 'i' or 'o' to add a task"         // NORMAL MODE: モード切替方法を案内
              }
              value={todoHooks.newTodo.task}        // 現在の入力値を表示
              disabled={vimHooks.mode === "normal"} // ノーマルモードでは入力無効化
              
              // 入力内容が変更された時の処理
              onChange={(e) =>
                // スプレッド演算子（...）でオブジェクトをコピーし、taskプロパティのみ更新
                // これにより、他のプロパティを保持しながら部分更新が可能
                todoHooks.setNewTodo({
                  ...todoHooks.newTodo,
                  task: e.target.value,
                })
              }
              
              // キーボードイベントの処理
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // Enterキー: タスクを追加してVimのノーマルモードに戻る
                  todoHooks.addTodo();
                  vimHooks.setMode("normal");
                } else if (e.key === "Escape") {
                  // Escapeキー: Vimのノーマルモードに戻り、入力をクリア
                  vimHooks.setMode("normal");
                  todoHooks.setNewTodo({ task: "" });
                  // フォーカスを外す（型アサーションでHTMLInputElementとして扱う）
                  (e.target as HTMLInputElement).blur();
                }
              }}
              
              // モードに応じた動的スタイリング
              className={`transition-all duration-200 ${
                vimHooks.mode === "insert"
                  // INSERT MODE: 緑色系（操作可能を表現）
                  ? "bg-gray-700/50 border-green-500 text-white placeholder:text-gray-400 focus:border-green-400 focus:ring-green-400/50"
                  // NORMAL MODE: 赤色系（読み取り専用を表現）
                  : "bg-gray-700/30 border-red-500/50 text-gray-500 placeholder:text-gray-500 cursor-not-allowed"
              }`}
            />
            
            {/* タスク追加ボタン（プラスアイコン） */}
            <Button
              onClick={todoHooks.addTodo}           // クリック時にタスクを追加
              disabled={vimHooks.mode === "normal"} // ノーマルモードでは無効化
              className={`transition-all duration-200 shadow-lg hover:shadow-xl ${
                vimHooks.mode === "insert"
                  // INSERT MODE: 緑色系（操作可能）
                  ? "bg-green-400 text-black hover:bg-green-300"
                  // NORMAL MODE: グレー系（無効状態）
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
