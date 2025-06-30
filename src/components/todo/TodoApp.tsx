"use client"

import { Session } from "next-auth";
import { useTheme } from "@/contexts/ThemeContext";
import { useTodos } from "@/hooks/useTodos";
import { useTaskEdit } from "@/hooks/useTaskEdit";
import { useVimMode } from "@/hooks/useVimMode";
import FlowBackground from "@/components/ui/FlowBackground";
import TodoHeader from "@/components/todo/TodoHeader";
import AddTodoForm from "@/components/todo/AddTodoForm";
import TodoList from "@/components/todo/TodoList";
import Footer from "@/components/todo/Footer";
import UserDropdown from "@/components/auth/UserDropdown";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface TodoAppProps {
  session : Session
}

export default function TodoApp({ session } : TodoAppProps) {

  const { isDark } = useTheme();
  const todoHooks = useTodos();
  const editHooks = useTaskEdit();
  // const { recommendedIntensity } = useFlowBackground();

  const vimHooks = useVimMode({
    todos : todoHooks.todos,
    editingId : editHooks.editingId,
    onAddTodo : todoHooks.addTodo,
    onDeleteTodo : todoHooks.deleteTodo,
    onStartEditing : editHooks.startEditing,
  });

  /**
   * タスク更新処理の関数（一時的な実装）
   *
   * 本来はuseTodosフックに含めるべきですが、
   * 現在は段階的リファクタリング中のため、ここに配置
   *
   * @param id - 更新するタスクのID
   */
  const handleSaveTask = async (id : string) => {
    await todoHooks.updateTask(id, editHooks.editingTask);
    editHooks.cancelEditing();
  };

  return (
    // 最も外側のdivにテーマに応じた背景グラデーションと色の変化アニメーションを適用
    <div className={ `min-h-screen relative p-4 transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950' // ダークモード時の背景グラデーション
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50' // ライトモード時の背景グラデーション
    }` }>
      {/* 背景アニメーションコンポーネントを配置 */ }
      <FlowBackground
        enabled={ true }
        intensity="normal"
      />

      <div className="fixed top-4 right-4 z-30 p-4">
        <div className="flex items-center space-x-3">
          {/*{ドロップダウンメニューを配置}*/ }
          <UserDropdown/>

          {/* テーマ切り替えボタンを配置 */ }
          <ThemeToggle/>
        </div>
      </div>

      {/* アプリケーションの主要コンテンツ */ }
      <div className="relative z-10 max-w-2xl mx-auto pt-8">
        <TodoHeader/>
        <AddTodoForm vimHooks={ vimHooks } todoHooks={ todoHooks }/>
        <TodoList
          todos={ todoHooks.todos }
          selectedIndex={ vimHooks.selectedIndex }
          mode={ vimHooks.mode }
          editingId={ editHooks.editingId }
          editingTask={ editHooks.editingTask }
          setEditingTask={ editHooks.setEditingTask }
          startEditing={ editHooks.startEditing }
          cancelEditing={ editHooks.cancelEditing }
          onSave={ handleSaveTask }
          onDelete={ todoHooks.deleteTodo }
          isLoading={ todoHooks.isLoading }
        />
        <Footer/>
      </div>
    </div>
  )
}