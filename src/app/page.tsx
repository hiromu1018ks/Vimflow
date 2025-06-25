// Next.jsでクライアントサイドレンダリングを明示的に指定
// これにより、ブラウザでのみ実行されるコードを書けます
"use client";

// カスタムフック（自作の状態管理）のインポート
import { useTodos } from "@/hooks/useTodos"; // タスクの基本操作（追加・削除・取得）
import { useTaskEdit } from "@/hooks/useTaskEdit"; // タスクの編集機能
import { useVimMode } from "@/hooks/useVimMode"; // Vimスタイルのキーボード操作
import TodoHeader from "@/components/todo/TodoHeader";
import Footer from "@/components/todo/Footer";
import AddTodoForm from "@/components/todo/AddTodoForm";
import TodoList from "@/components/todo/TodoList";

/**
 * メインのTodoアプリケーションコンポーネント
 *
 * このコンポーネントは3つのカスタムフックを組み合わせて
 * 完全なTodoアプリケーションを実現しています：
 * 1. useTodos: タスクの基本的なCRUD操作
 * 2. useTaskEdit: タスクの編集状態管理
 * 3. useVimMode: Vimスタイルのキーボードナビゲーション
 */
export default function Home() {
  // === カスタムフックの初期化 ===

  // タスクの基本操作を管理するフック
  // todos: タスクの配列, addTodo: タスク追加関数, deleteTodo: タスク削除関数 etc.
  const todoHooks = useTodos();

  // タスクの編集状態を管理するフック
  // editingId: 現在編集中のタスクID, startEditing: 編集開始関数 etc.
  const editHooks = useTaskEdit();

  // Vimスタイルのキーボード操作を管理するフック
  // 他のフックの状態と関数を依存関係として渡す必要がある
  const vimHooks = useVimMode({
    todos: todoHooks.todos, // タスク一覧（j/kキーでの移動に必要）
    editingId: editHooks.editingId, // 編集中かどうかの判定に必要
    onAddTodo: todoHooks.addTodo, // oキーでタスク追加
    onDeleteTodo: todoHooks.deleteTodo, // ddキーでタスク削除
    onStartEditing: editHooks.startEditing, // Enterキーで編集開始
  });

  /**
   * タスク更新処理の関数（一時的な実装）
   *
   * 本来はuseTodosフックに含めるべきですが、
   * 現在は段階的リファクタリング中のため、ここに配置
   *
   * @param id - 更新するタスクのID
   */
  const handleSaveTask = async (id: string) => {
    await todoHooks.updateTask(id, editHooks.editingTask);
    editHooks.cancelEditing();
  };

  // === JSXの返却（UIの構造を定義） ===
  return (
    // 全画面を覆うメインコンテナ（グラデーション背景 + パディング）
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      {/* 中央配置コンテナ（最大幅2xl = 672px） */}
      <div className="max-w-2xl mx-auto pt-8">
        {/* ヘッダー */}
        <TodoHeader />

        {/* タスク追加フォーム */}
        <AddTodoForm vimHooks={vimHooks} todoHooks={todoHooks} />

        {/* タスクリスト */}
        <TodoList
          todos={todoHooks.todos}
          selectedIndex={vimHooks.selectedIndex}
          mode={vimHooks.mode}
          editingId={editHooks.editingId}
          editingTask={editHooks.editingTask}
          setEditingTask={editHooks.setEditingTask}
          startEditing={editHooks.startEditing}
          cancelEditing={editHooks.cancelEditing}
          onSave={handleSaveTask}
          onDelete={todoHooks.deleteTodo}
          isLoading={todoHooks.isLoading}
        />

        {/* フッター */}
        <Footer />
      </div>
    </div>
  );
}
