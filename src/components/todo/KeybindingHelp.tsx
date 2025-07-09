import React from "react";

type Keybinding = {
  key: string;
  description: string;
  mode: "normal" | "insert" | "edit";
};

// キーバインドのデータ定義
const keybindings: Keybinding[] = [
  // Normal Mode
  { key: "j", description: "下のタスクに移動", mode: "normal" },
  { key: "k", description: "上のタスクに移動", mode: "normal" },
  { key: "gg", description: "最初のタスクに移動", mode: "normal" },
  { key: "G", description: "最後のタスクに移動", mode: "normal" },
  { key: "o", description: "新規タスク追加", mode: "normal" },
  { key: "i", description: "新規タスク追加", mode: "normal" },
  { key: "Enter", description: "完了状態切り替え", mode: "normal" },
  { key: "e", description: "タスクを編集", mode: "normal" },
  { key: "dd", description: "タスクを削除", mode: "normal" },
  { key: "Escape", description: "コマンドバッファクリア", mode: "normal" },

  // Insert Mode
  { key: "Escape", description: "ノーマルモードに戻る", mode: "insert" },
  { key: "Ctrl+C", description: "ノーマルモードに戻る", mode: "insert" },

  // Edit Mode
  { key: "Enter", description: "編集内容を保存", mode: "edit" },
  { key: "Escape", description: "編集をキャンセル", mode: "edit" },
];

export const KeybindingHelp: React.FC = () => {
  const normalModeKeys = keybindings.filter((kb) => kb.mode === "normal");
  const insertModeKeys = keybindings.filter((kb) => kb.mode === "insert");
  const editModeKeys = keybindings.filter((kb) => kb.mode === "edit");

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Vim Keybindings</h3>
      {/* Normal Mode */}
      <div>
        <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">
          Normal Mode
        </h4>
        <div className="space-y-1">
          {normalModeKeys.map((kb, index) => (
            <div key={index} className="flex items-center space-x-3">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                {kb.key}
              </kbd>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {kb.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Insert Mode */}
      <div>
        <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">
          Insert Mode
        </h4>
        <div className="space-y-1">
          {insertModeKeys.map((kb, index) => (
            <div key={index} className="flex items-center space-x-3">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                {kb.key}
              </kbd>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {kb.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Mode */}
      <div>
        <h4 className="font-medium text-purple-600 dark:text-purple-400 mb-2">
          Edit Mode
        </h4>
        <div className="space-y-1">
          {editModeKeys.map((kb, index) => (
            <div key={index} className="flex items-center space-x-3">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                {kb.key}
              </kbd>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {kb.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
