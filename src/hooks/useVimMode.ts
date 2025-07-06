"use client";

import { getAllTask } from "@/types/type";
import { useCallback, useEffect, useState } from "react";

export type VimMode = "normal" | "insert";

interface UseVimModeParams {
  todos: getAllTask[];
  editingId: string | null;
  onAddTodo: () => void;
  onDeleteTodo: (id: string) => void;
  onStartEditing: (task: getAllTask) => void;
  onToggleComplete: (id: string) => void;
}

interface UseVimModeReturn {
  mode: VimMode;
  selectedIndex: number;
  commandBuffer: string;
  setMode: (mode: VimMode) => void;
  setSelectedIndex: (index: number) => void;
}

export const useVimMode = (params: UseVimModeParams): UseVimModeReturn => {
  const { todos, editingId, onDeleteTodo, onStartEditing, onToggleComplete } =
    params;

  const [mode, setMode] = useState<"normal" | "insert">("normal");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [commandBuffer, setCommandBuffer] = useState<string>("");

  // ===== vimモード設定 =====

  // ノーマルモードのキー操作を処理する関数
  const handleNormalMode = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault(); // ブラウザのデフォルト動作を無効化

      switch (e.key) {
        // 下に移動：jキーで次のタスクに移動
        case "j":
          setSelectedIndex((prev) => Math.min(prev + 1, todos.length - 1));
          break;
        // 上に移動：kキーで前のタスクに移動
        case "k":
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        // ggコマンド：最初のタスクに移動
        case "g":
          if (commandBuffer === "g") {
            setSelectedIndex(0); // 最初のタスクに移動
            setCommandBuffer(""); // コマンドバッファをクリア
          } else {
            setCommandBuffer("g"); // 最初のgをバッファに保存
          }
          break;
        // Gコマンド：最後のタスクに移動
        case "G":
          setSelectedIndex(todos.length - 1);
          break;
        // oコマンド：新しいタスクを追加してインサートモードに移行
        case "o":
          setMode("insert"); // モードをインサートに変更
          // 新規タスク入力フィールドにフォーカスを当てる
          setTimeout(() => {
            document.getElementById("new-task-input")?.focus();
          }, 0);
          break;
        case "i":
          // インサートモードに移行
          setMode("insert");
          setTimeout(() => {
            document.getElementById("new-task-input")?.focus();
          }, 0);
          break;
        case "Enter":
          // 選択されたタスクの完了状態を切り替え
          if (todos[selectedIndex]) {
            onToggleComplete(todos[selectedIndex].id);
          }
          break;
        case "e":
          // 選択されたタスクを編集
          if (todos[selectedIndex]) {
            onStartEditing(todos[selectedIndex]);
          }
          break;
        case "d":
          if (commandBuffer === "d") {
            // ddコマンド：選択されたタスクを削除
            if (todos[selectedIndex]) {
              onDeleteTodo(todos[selectedIndex].id);
              // インデックスを調整
              if (selectedIndex >= todos.length - 1) {
                setSelectedIndex(Math.max(0, todos.length - 2));
              }
            }
            setCommandBuffer("");
          } else {
            setCommandBuffer("d");
          }
          break;
        case "Escape":
          // コマンドバッファをクリア
          setCommandBuffer("");
          break;
        default:
          // 無効なキーの場合はコマンドバッファをクリア
          setCommandBuffer("");
          break;
      }
    },
    [
      todos,
      selectedIndex,
      commandBuffer,
      onStartEditing,
      onDeleteTodo,
      onToggleComplete,
    ],
  );

  const handleInsertMode = useCallback((e: KeyboardEvent) => {
    // Escapeキーでノーマルモードに戻る
    if (e.key === "Escape") {
      e.preventDefault();
      setMode("normal");
      return;
    }

    // Ctrl+Cでノーマルモードに戻る（Vimの標準動作）
    if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      setMode("normal");
      // フォーカスを外してインサートモードを終了
      if (e.target instanceof HTMLInputElement) {
        e.target.blur();
      }
      return;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 編集モード中は通常のキー操作を許可
      if (editingId) return;

      if (mode === "normal") {
        // Input要素にフォーカスがある場合はスキップ（ノーマルモード時のみ）
        if (e.target instanceof HTMLInputElement) return;
        handleNormalMode(e);
      } else if (mode === "insert") {
        // インサートモード時は、Escape や Ctrl+C は処理する
        handleInsertMode(e);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mode, editingId, handleNormalMode, handleInsertMode]);

  return {
    mode,
    selectedIndex,
    commandBuffer,
    setMode,
    setSelectedIndex,
  };
};
