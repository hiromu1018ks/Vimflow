// Next.jsでクライアントサイドレンダリングを指定
"use client";

// アイコンライブラリから必要なアイコンをインポート
import { Check, NotebookPen, Trash2, X } from "lucide-react";
// UIコンポーネントのインポート
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "@radix-ui/react-checkbox";
// 型定義のインポート
import { getAllTask } from "@/types/type";
import { VimMode } from "@/hooks/useVimMode";

/**
 * 個別のタスクアイテムが受け取るpropsの型定義
 * 
 * 初心者向けポイント：
 * - このコンポーネントは1つのタスクを表示・編集するために使われます
 * - 多くのpropsを受け取りますが、それぞれに明確な役割があります
 * - props を細かく分類することで、何のために使われるかが分かりやすくなります
 */
interface TodoItemProps {
  // ===== タスクの基本データ =====
  task: getAllTask;                           // 表示するタスクのデータ
  index: number;                              // リスト内での位置（0, 1, 2...）

  // ===== Vimモード関連 =====
  selectedIndex: number;                      // 現在選択されているタスクの位置
  mode: VimMode;                              // 現在のVimモード（"normal" | "insert"）

  // ===== 編集機能関連 =====
  editingId: string | null;                  // 現在編集中のタスクID（null = 編集中なし）
  editingTask: string;                        // 編集中のタスク内容
  setEditingTask: (task: string) => void;     // 編集内容を更新する関数
  startEditing: (task: getAllTask) => void;   // 編集を開始する関数
  cancelEditing: () => void;                  // 編集をキャンセルする関数

  // ===== アクション（操作）関連 =====
  onSave: (id: string) => Promise<void>;     // タスクを保存する関数
  onDelete: (id: string) => Promise<void>;   // タスクを削除する関数

  // ===== UI状態関連 =====
  isLoading?: boolean;                        // ローディング中かどうか（?は省略可能の意味）
}

/**
 * 個別のタスクアイテムコンポーネント
 * 
 * このコンポーネントの役割：
 * 1. 1つのタスクを表示する
 * 2. タスクの編集機能を提供する
 * 3. Vimスタイルの選択状態を視覚化する
 * 4. タスクの削除・編集ボタンを提供する
 * 
 * 初心者向けポイント：
 * - 表示モードと編集モードを切り替えられます
 * - Vimの選択状態（青いハイライト）を表現しています
 * - 条件分岐（三項演算子）で見た目を動的に変更しています
 */
export default function TodoItem({
  task,           // 表示するタスクのデータ
  index,          // このタスクのリスト内位置
  mode,           // 現在のVimモード
  selectedIndex,  // 現在選択中のタスク位置
  editingId,      // 編集中のタスクID
  editingTask,    // 編集中の内容
  setEditingTask, // 編集内容を更新する関数
  startEditing,   // 編集を開始する関数
  onSave,         // 保存処理の関数
  onDelete,       // 削除処理の関数
  cancelEditing,  // 編集キャンセルの関数
  isLoading,      // ローディング状態
}: TodoItemProps) {
  
  // ===== 状態の計算 =====
  
  // このタスクが現在選択されているかを判定
  // 条件: 選択位置が一致 AND Vimがノーマルモード
  const isSelected = selectedIndex === index && mode === "normal";
  
  // このタスクが現在編集中かを判定
  // 編集中のIDと、このタスクのIDが一致するかで判定
  const isEditing = editingId === task.id;

  // ===== イベントハンドラー =====
  
  /**
   * 編集中のキーボードイベント処理
   * Enter: 保存, Escape: キャンセル
   * 
   * 日本語入力対応：
   * IME変換中のEnterキーは無視して、変換確定のみを処理
   */
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // 日本語入力（IME）の変換中かどうかをチェック
      // isComposingがtrueの場合、まだ変換が確定していないので保存しない
      if (e.nativeEvent.isComposing) {
        return; // 何もせずに関数を終了
      }
      
      // Enterキー: 編集内容を保存
      await onSave(task.id);
    }
    if (e.key === "Escape") {
      // Escapeキー: 編集をキャンセル
      cancelEditing();
    }
  };

  // ===== JSXの返却（UIの描画） =====
  
  return (
    // タスクアイテムのメインコンテナ
    <div
      // 動的なクラス名の組み合わせ（三項演算子を使用）
      className={`transition-all duration-300 hover:shadow-lg hover:scale-[1.02] backdrop-blur-sm p-3 mb-3 rounded-lg border ${
        isSelected
          // 選択中: 青いハイライト（Vimの選択状態を表現）
          ? "bg-blue-500/20 border-blue-400 shadow-lg ring-2 ring-blue-400/50"
          // 通常: グレー系の背景
          : "bg-gray-800/50 border-gray-600"
      }`}
      // CSSアニメーション: 各タスクが少しずつ時間差で表示される
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* タスクアイテム内の要素配置 */}
      <div className="flex items-center gap-3">
        
        {/* 完了チェックボックス（将来の機能拡張用） */}
        <Checkbox className="data-[state=checked]:bg-white data-[state=checked]:border-white" />

        {/* タスクの内容表示エリア（メインコンテンツ） */}
        <div className="flex-1">
          {isEditing ? (
            // ===== 編集モード =====
            <div className="flex gap-2">
              {/* 編集用の入力フィールド */}
              <Input
                value={editingTask}                     // 現在の編集内容
                placeholder="Edit task"                 // プレースホルダー
                onChange={(e) => setEditingTask(e.target.value)}  // 入力内容の更新
                className="flex-1 bg-gray-700/50 border-gray-600 text-white"
                onKeyDown={handleKeyDown}               // キーボードイベント
                autoFocus                               // 編集開始時に自動フォーカス
                disabled={isLoading}                    // ローディング中は無効化
              />
              
              {/* 保存ボタン（チェックマークアイコン） */}
              <Button
                size="sm"                               // 小さいサイズ
                variant="ghost"                         // 透明背景
                onClick={() => onSave(task.id)}         // 保存処理を実行
                disabled={isLoading}                    // ローディング中は無効化
                className="text-gray-400 hover:text-green-400 hover:bg-green-400/10 transition-all duration-200"
              >
                <Check className="w-4 h-4" />
              </Button>
              
              {/* キャンセルボタン（×アイコン） */}
              <Button
                size="sm"
                variant="ghost"
                onClick={cancelEditing}                 // 編集をキャンセル
                disabled={isLoading}
                className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            // ===== 表示モード =====
            <div>
              {/* タスクの内容テキスト */}
              <p className="transition-all duration-200 text-white">
                {task.task}
              </p>
              {/* 作成日時の表示 */}
              <p className="text-xs text-gray-500 mt-1">
                {/* ?. は オプショナルチェーン：createdAtがnullでもエラーにならない */}
                {task.createdAt?.toLocaleDateString("ja-JP")}
              </p>
            </div>
          )}
        </div>

        {/* アクションボタン群（編集中ではない時のみ表示） */}
        {!isEditing && (
          <>
            {/* 編集ボタン（ペンアイコン） */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-200"
              onClick={() => startEditing(task)}       // 編集モードを開始
              disabled={isLoading}
            >
              <NotebookPen className="w-4 h-4" />
            </Button>

            {/* 削除ボタン（ゴミ箱アイコン） */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
              onClick={() => onDelete(task.id)}        // 削除処理を実行
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
