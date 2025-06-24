import { getAllTask } from "@/types/type";
import { useEffect, useState } from "react";

export type VimMode = "normal" | "insert";

interface UseVimModeParams {
  todos: getAllTask[];
  editingId: string | null;
  onAddTodo: () => void;
  onDeleteTodo: (id: string) => void;
  onStartEditing: (task: getAllTask) => void;
}

interface UseVimModeReturn {
  mode: VimMode;
  selectedIndex: number;
  commandBuffer: string;
  setMode: (mode: VimMode) => void;
  setSelectedIndex: (index: number) => void;
}

export const useVimMode = (params: UseVimModeParams): UseVimModeReturn => {
  const { todos, editingId, onDeleteTodo, onStartEditing } = params;

  const [mode, setMode] = useState<"normal" | "insert">("normal");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [commandBuffer, setCommandBuffer] = useState<string>("");

  // ===== vimモード設定 =====

  // ノーマルモードのキー操作を処理する関数
  const handleNormalMode = (e: KeyboardEvent) => {
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
  };

  const handleInsertMode = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setMode("normal");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 編集モード中は通常のキー操作を許可
      if (editingId) return;

      // Input要素にフォーカスがある場合はスキップ
      if (e.target instanceof HTMLInputElement) return;

      if (mode === "normal") {
        handleNormalMode(e);
      } else if (mode === "insert") {
        handleInsertMode(e);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mode, selectedIndex, todos, commandBuffer]);

  return {
    mode,
    selectedIndex,
    commandBuffer,
    setMode,
    setSelectedIndex,
  };
};
