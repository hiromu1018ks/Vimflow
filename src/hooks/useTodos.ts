import { createTask, getAllTask } from "@/types/type";
import { useEffect, useState } from "react";

interface UseTodosReturn {
  todos: getAllTask[];
  newTodo: createTask;
  setNewTodo: (todo: createTask) => void;
  addTodo: () => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  getAllTodos: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<getAllTask[]>([]);
  const [newTodo, setNewTodo] = useState<createTask>({
    task: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllTodos();
  }, []);

  const URL = "/api";

  // タスク一覧を取得
  const getAllTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL}/tasks`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const tasks = result.data.map((task: getAllTask) => ({
        ...task,
        createdAt: task.createdAt ? new Date(task.createdAt) : undefined,
      }));
      setTodos(tasks);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // タスクを追加
  const addTodo = async () => {
    if (!newTodo.task.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: newTodo.task.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNewTodo({
        task: "",
      });

      // タスクを追加後、リストを再取得
      await getAllTodos();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);
      console.error("Failed to add task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // タスク削除
  const deleteTodo = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL}/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await getAllTodos();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Failed to delete task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // エラークリア
  const clearError = () => {
    setError(null);
  };

  // const saveTask = async (id: string) => {
  //   if (editingTask.trim()) {
  //     try {
  //       const response = await fetch(`${URL}/tasks/${id}`, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           task: editingTask.trim(),
  //         }),
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       await getAllTodos();
  //       setEditingId(null);
  //       setEditingTask("");
  //     } catch (error) {
  //       console.error("Failed to update task:", error);
  //     }
  //   }
  // };
  // 戻り値
  return {
    todos,
    newTodo,
    setNewTodo,
    addTodo,
    deleteTodo,
    getAllTodos,
    isLoading,
    error,
    clearError,
  };
};
