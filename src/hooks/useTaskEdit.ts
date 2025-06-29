"use client"

import { getAllTask } from "@/types/type";
import { useState } from "react";

interface UseTaskEditReturn {
  editingId : string | null;
  editingTask : string;
  setEditingTask : (task : string) => void;
  startEditing : (task : getAllTask) => void;
  cancelEditing : () => void;
  isEditing : boolean;
}

export const useTaskEdit = () : UseTaskEditReturn => {
  const [ editingId, setEditingId ] = useState<string | null>(null);
  const [ editingTask, setEditingTask ] = useState<string>("");

  const startEditing = (task : getAllTask) => {
    setEditingId(task.id);
    setEditingTask(task.task);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTask("");
  };

  const isEditing = editingId !== null;

  return {
    editingId,
    editingTask,
    setEditingTask,
    startEditing,
    cancelEditing,
    isEditing,
  };
};
