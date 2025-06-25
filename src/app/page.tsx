// Next.jsでクライアントサイドレンダリングを明示的に指定
// これにより、ブラウザでのみ実行されるコードを書けます
"use client";

// UIコンポーネントのインポート - shadcn/uiライブラリから取得
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// アイコンライブラリ - 視覚的なアイコンを提供
import { Check, Circle, NotebookPen, Plus, Trash2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// Next.jsのImageコンポーネント - 最適化された画像表示
import Image from "next/image";

// カスタムフック（自作の状態管理）のインポート
import { useTodos } from "@/hooks/useTodos";     // タスクの基本操作（追加・削除・取得）
import { useTaskEdit } from "@/hooks/useTaskEdit"; // タスクの編集機能
import { useVimMode } from "@/hooks/useVimMode";   // Vimスタイルのキーボード操作

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
    todos: todoHooks.todos,                    // タスク一覧（j/kキーでの移動に必要）
    editingId: editHooks.editingId,            // 編集中かどうかの判定に必要
    onAddTodo: todoHooks.addTodo,              // oキーでタスク追加
    onDeleteTodo: todoHooks.deleteTodo,        // ddキーでタスク削除
    onStartEditing: editHooks.startEditing,    // Enterキーで編集開始
  });

  /**
   * タスク更新処理の関数（一時的な実装）
   * 
   * 本来はuseTodosフックに含めるべきですが、
   * 現在は段階的リファクタリング中のため、ここに配置
   * 
   * @param id - 更新するタスクのID
   */
  const saveTask = async (id: string) => {
    // 編集中のタスクが空文字列の場合は何もしない
    if (!editHooks.editingTask.trim()) return;

    try {
      // API（バックエンド）にタスク更新リクエストを送信
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",                                    // 更新操作はPUTメソッド
        headers: { "Content-Type": "application/json" }, // JSON形式でデータを送信
        body: JSON.stringify({ 
          task: editHooks.editingTask.trim()              // 前後の空白を削除した編集内容
        }),
      });

      // レスポンスのステータスコードが200番台でない場合はエラー
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 更新が成功したら、最新のタスク一覧を再取得
      await todoHooks.getAllTodos();
      
      // 編集状態を終了（編集モードから表示モードに戻る）
      editHooks.cancelEditing();
    } catch (error) {
      // エラーが発生した場合はコンソールに出力
      console.error("Failed to update task:", error);
    }
  };

  // === JSXの返却（UIの構造を定義） ===
  return (
    // 全画面を覆うメインコンテナ（グラデーション背景 + パディング）
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      {/* 中央配置コンテナ（最大幅2xl = 672px） */}
      <div className="max-w-2xl mx-auto pt-8">
        
        {/* === ヘッダーセクション === */}
        <div className="text-center mb-8">
          {/* ロゴ画像 */}
          <div className="mb-6">
            <Image
              src="/vimendo_header_logo.svg"
              alt="Vimendo - Modal Todo Editor"
              width={400}
              height={120}
              className="mx-auto"
              priority
            />
          </div>
          <p className="text-gray-400 text-lg">
            Vim-inspired modal editing for your tasks
          </p>
        </div>

        {/* === タスク追加フォームセクション === */}
        <Card className="mb-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                vimHooks.mode === "insert" ? "bg-green-400" : "bg-red-400"
              } animate-pulse`} />
              {vimHooks.mode === "insert" ? "INSERT MODE" : "NORMAL MODE"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                id="new-task-input"                      // Vimモードでフォーカス時に使用するID
                placeholder={vimHooks.mode === "insert" ? "Type your task and press Enter..." : "Press 'i' or 'o' to add a task"}
                value={todoHooks.newTodo.task}           // 現在の入力値を表示
                disabled={vimHooks.mode === "normal"}     // ノーマルモードでは入力無効
                onChange={(e) =>
                  // 入力値が変更されたときの処理
                  // スプレッド演算子でオブジェクトをコピーしてtaskプロパティのみ更新
                  todoHooks.setNewTodo({
                    ...todoHooks.newTodo,
                    task: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  // キーボードイベントの処理
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
                className={`transition-all duration-200 ${
                  vimHooks.mode === "insert" 
                    ? "bg-gray-700/50 border-green-500 text-white placeholder:text-gray-400 focus:border-green-400 focus:ring-green-400/50" 
                    : "bg-gray-700/30 border-red-500/50 text-gray-500 placeholder:text-gray-500 cursor-not-allowed"
                }`}
              />
              {/* タスク追加ボタン（+アイコン） */}
              <Button
                onClick={todoHooks.addTodo}              // クリック時にタスクを追加
                disabled={vimHooks.mode === "normal"}    // ノーマルモードでは無効
                className={`transition-all duration-200 shadow-lg hover:shadow-xl ${
                  vimHooks.mode === "insert"
                    ? "bg-green-400 text-black hover:bg-green-300"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* === タスク一覧表示セクション === */}
        <div className="space-y-3">
          {todoHooks.todos.length === 0 ? (
            <Card className="bg-gray-800/30 border-gray-700 border-dashed">
              <CardContent className="p-8 text-center">
                {/* 装飾用のサークルアイコン */}
                <Circle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <h3 className="text-white text-lg font-medium mb-2">No tasks yet</h3>
                <p className="text-gray-400 mb-4">Press <kbd className="px-2 py-1 bg-gray-700 rounded text-green-400 font-mono text-sm">'i'</kbd> or <kbd className="px-2 py-1 bg-gray-700 rounded text-green-400 font-mono text-sm">'o'</kbd> to add your first task</p>
                <div className="text-sm text-gray-500">
                  <p>Vim shortcuts:</p>
                  <div className="mt-2 space-y-1">
                    <p><kbd className="px-1 bg-gray-700 rounded text-xs">j/k</kbd> navigate • <kbd className="px-1 bg-gray-700 rounded text-xs">dd</kbd> delete • <kbd className="px-1 bg-gray-700 rounded text-xs">Enter</kbd> edit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* 
                タスク一覧の表示（.map()でタスク配列を一つずつ処理）
                各タスクを個別のCardコンポーネントとして表示
              */}
              {todoHooks.todos.map((task, index) => (
                <Card
                  key={index}                             // Reactのリスト表示で必要なキー
                  className={`transition-all duration-300 hover:shadow-lg hover:scale-[1.05] backdrop-blur-sm p-2 mb-3 ${
                    // 三項演算子でVimモードの選択状態に応じてスタイルを変更
                    vimHooks.selectedIndex === index &&   // 現在選択中のタスクかつ
                    vimHooks.mode === "normal"            // Vimのノーマルモードの場合
                      ? "bg-blue-500/20 border-blue-400 shadow-lg ring-2 ring-blue-400/50"  // 選択中のスタイル
                      : "bg-gray-800/50 border-gray-600"                                     // 通常のスタイル
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}  // カードの表示タイミングをずらすアニメーション
                >
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2">
                      {/* 完了チェックボックス（今後の拡張用） */}
                      <Checkbox className="data-[state=checked]:bg-white data-[state=checked]:border-white" />
                      
                      {/* タスクの内容表示エリア（編集モード/表示モードの切り替え） */}
                      <div className="flex-1">
                        {editHooks.editingId === task.id ? (
                          // === 編集モード ===
                          // 現在このタスクが編集中の場合の表示
                          <div className="flex gap-2">
                            <Input
                              value={editHooks.editingTask}    // 編集中のテキスト
                              placeholder="Edit task"
                              onChange={(e) =>
                                // 編集内容をリアルタイムで状態に反映
                                editHooks.setEditingTask(e.target.value)
                              }
                              className="flex-1 bg-gray-700/50 border-gray-600 text-white"
                              onKeyDown={(e) => {
                                // 編集中のキーボードイベント処理
                                if (e.key === "Enter") {
                                  // Enterキー: 編集内容を保存
                                  saveTask(task.id);
                                }
                                if (e.key === "Escape") {
                                  // Escapeキー: 編集をキャンセル
                                  editHooks.cancelEditing();
                                }
                              }}
                              autoFocus                         // 編集開始時に自動でフォーカス
                            />
                            {/* 保存ボタン（チェックアイコン） */}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => saveTask(task.id)}
                              className="text-gray-400 hover:text-green-400 hover:bg-green-400/10 transition-all duration-200"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            {/* キャンセルボタン（×アイコン） */}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={editHooks.cancelEditing}
                              className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          // === 表示モード ===
                          // 通常の表示状態
                          <div>
                            <p className="transition-all duration-200 text-white">
                              {task.task}                       {/* タスクの内容 */}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {/* 作成日時を日本語形式で表示（オプショナルチェーン演算子で安全にアクセス） */}
                              {task.createdAt?.toLocaleDateString("ja-JP")}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* === アクションボタン群 === */}
                      
                      {/* 編集ボタン（ペンアイコン） */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-200"
                        onClick={() => editHooks.startEditing(task)}  // 編集モードを開始
                      >
                        <NotebookPen className="w-4 h-4" />
                      </Button>
                      
                      {/* 削除ボタン（ゴミ箱アイコン） */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                        onClick={() => todoHooks.deleteTodo(task.id)}  // タスクを削除
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>

        {/* === フッターセクション === */}
        <div className="text-center mt-12 pb-8">
          <p className="text-gray-500 text-sm">Built with Next.js • React • Tailwind CSS</p>
          <p className="text-gray-600 text-xs mt-2">Vimendo - Modal editing for modern productivity</p>
        </div>
      </div>
    </div>
  );
}
