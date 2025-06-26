"use client";

import { useTodos } from "@/hooks/useTodos";
import { useTaskEdit } from "@/hooks/useTaskEdit";
import { useVimMode } from "@/hooks/useVimMode";
import TodoHeader from "@/components/todo/TodoHeader";
import Footer from "@/components/todo/Footer";
import AddTodoForm from "@/components/todo/AddTodoForm";
import TodoList from "@/components/todo/TodoList";
import FlowBackground from "@/components/ui/FlowBackground";

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
  const todoHooks = useTodos();
  const editHooks = useTaskEdit();
  // const { recommendedIntensity } = useFlowBackground();
  
  const vimHooks = useVimMode({
    todos: todoHooks.todos,
    editingId: editHooks.editingId,
    onAddTodo: todoHooks.addTodo,
    onDeleteTodo: todoHooks.deleteTodo,
    onStartEditing: editHooks.startEditing,
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

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 p-4">
      <FlowBackground 
        enabled={true} 
        intensity="strong"
      />
      <div className="relative z-10 max-w-2xl mx-auto pt-8">
        {/* ヘッダー */}
        <TodoHeader />

        {/* Todo追加フォーム */}
        <AddTodoForm vimHooks={vimHooks} todoHooks={todoHooks} />

        {/* Todoリスト */}
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
