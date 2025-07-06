// 型定義のインポート
import { VimMode } from "@/hooks/useVimMode";
import { getAllTask } from "@/types/type";
// 子コンポーネントのインポート
import TodoItem from "./TodoItem";
// UIコンポーネントのインポート
import { Card, CardContent } from "../ui/card";
import { Circle } from "lucide-react";

/**
 * Todoリストコンポーネントが受け取るpropsの型定義
 *
 * 初心者向けポイント：
 * - このコンポーネントは複数のTodoItemを管理します
 * - タスクが0個の場合は「空の状態」を表示します
 * - 各TodoItemに必要なpropsを渡す役割があります
 */
interface TodoListProps {
  // ===== データ関連 =====
  todos: getAllTask[]; // 表示するタスクの配列

  // ===== Vimモード関連 =====
  selectedIndex: number; // 現在選択中のタスク位置
  mode: VimMode; // 現在のVimモード

  // ===== 編集機能関連 =====
  editingId: string | null; // 編集中のタスクID
  editingTask: string; // 編集中の内容
  setEditingTask: (task: string) => void; // 編集内容を更新する関数
  startEditing: (task: getAllTask) => void; // 編集を開始する関数
  cancelEditing: () => void; // 編集をキャンセルする関数

  // ===== アクション関連 =====
  onSave: (id: string) => Promise<void>; // 保存処理の関数
  onDelete: (id: string) => Promise<void>; // 削除処理の関数
  onToggleComplete: (id: string) => Promise<void>;

  // ===== UI状態関連 =====
  isLoading?: boolean; // ローディング中かどうか
}
/**
 * Todoリストコンポーネント
 *
 * このコンポーネントの役割：
 * 1. タスクの配列を受け取り、1つずつTodoItemコンポーネントで表示する
 * 2. タスクが0個の場合は「空の状態」を表示する
 * 3. 各TodoItemに必要なpropsを適切に渡す
 * 4. Vimキーボードショートカットのガイドを提供する
 *
 * 初心者向けポイント：
 * - 条件分岐でタスクありなし状態を切り替えています
 * - .map()関数で配列の各要素をコンポーネントに変換しています
 * - propsの「バケツリレー」でデータを子コンポーネントに渡しています
 */
export default function TodoList({
  todos, // 表示するタスクの配列
  selectedIndex, // 現在選択中のタスク位置
  mode, // 現在のVimモード
  editingId, // 編集中のタスクID
  editingTask, // 編集中の内容
  setEditingTask, // 編集内容を更新する関数
  startEditing, // 編集を開始する関数
  cancelEditing, // 編集をキャンセルする関数
  onSave, // 保存処理の関数
  onDelete, // 削除処理の関数
  onToggleComplete,
  isLoading = false, // ローディング状態（デフォルト値：false）
}: TodoListProps) {
  // ===== 条件分岐：タスクが0個の場合 =====

  if (todos.length === 0) {
    return (
      <Card className="bg-white/85 dark:bg-slate-800/85 border-slate-300 dark:border-slate-600 border-dashed shadow-md backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <Circle className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />

          <h3 className="text-slate-800 dark:text-slate-100 text-lg font-medium mb-2">
            No tasks yet
          </h3>

          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Press {/* kbdタグ：キーボードキーを表現するセマンティックHTML */}
            <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-emerald-600 dark:text-emerald-400 font-mono text-sm">
              &apos;i&apos;
            </kbd>{" "}
            or{" "}
            <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-emerald-600 dark:text-emerald-400 font-mono text-sm">
              &apos;o&apos;
            </kbd>{" "}
            to add your first task
          </p>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            <p>Vim shortcuts:</p>
            <div className="mt-2 space-y-1">
              <p>
                <kbd className="px-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">
                  j/k
                </kbd>{" "}
                navigate •{" "}
                <kbd className="px-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">
                  dd
                </kbd>{" "}
                delete •{" "}
                <kbd className="px-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">
                  Enter
                </kbd>{" "}
                edit
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ===== タスクがある場合：TodoItemのリストを表示 =====

  return (
    // タスクアイテムのコンテナ（縦方向に間隔をあけて配置）
    <div className="space-y-3">
      {/* 
        配列.map()の使用：
        - todosの各要素（task）に対してTodoItemコンポーネントを作成
        - indexは配列内の位置（0, 1, 2...）
        - key={task.id}でReactのリスト最適化を実現
      */}
      {todos.map((task, index) => (
        <TodoItem
          key={task.id} // Reactのリスト用のキー（重要！）
          task={task} // 個別のタスクデータ
          index={index} // リスト内の位置
          selectedIndex={selectedIndex} // 現在選択中の位置
          mode={mode} // Vimモード
          editingId={editingId} // 編集中のタスクID
          editingTask={editingTask} // 編集中の内容
          setEditingTask={setEditingTask} // 編集内容更新関数
          startEditing={startEditing} // 編集開始関数
          cancelEditing={cancelEditing} // 編集キャンセル関数
          onSave={onSave} // 保存処理関数
          onDelete={onDelete} // 削除処理関数
          onToggleComplete={onToggleComplete}
          isLoading={isLoading} // ローディング状態
        />
      ))}
    </div>
  );
}
