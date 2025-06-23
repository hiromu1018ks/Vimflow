"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createTask, getAllTask } from "@/types/type";
import { useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  Circle,
  Clock,
  NotebookPen,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Home() {
  // 状態管理
  const [todos, setTodos] = useState<getAllTask[]>([
    // {
    //   id: "1",
    //   title: "Test Task 1 ",
    //   description: "Test Description 1",
    //   status: "pending",
    //   priority: "low",
    //   createdAt: new Date(),
    // },
    // {
    //   id: "2",
    //   title: "Test Task 2",
    //   description: "Test Description 2",
    //   status: "completed",
    //   priority: "medium",
    //   createdAt: new Date(),
    // },
    // {
    //   id: "3",
    //   title: "Test Task 3",
    //   description: "Test Description 3",
    //   status: "pending",
    //   priority: "high",
    //   createdAt: new Date(),
    // },
  ]);
  const [newTodo, setNewTodo] = useState<createTask>({
    task: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string>("");

  const URL = "/api";

  useEffect(() => {
    getAllTodos();
  }, []);

  const getAllTodos = async () => {
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
      console.error("Failed to fetch tasks:", error);
      // エラー時はtodosを空配列に設定するか、エラー状態を管理
    }
  };

  const addTodo = async () => {
    if (newTodo.task.trim()) {
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

        // タスクを追加後、リストを再取得
        await getAllTodos();

        setNewTodo({
          task: "",
        });
      } catch (error) {
        console.error("Failed to add task:", error);
      }
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`${URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await getAllTodos();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const saveTask = async (id: string) => {
    if (editingTask.trim()) {
      try {
        const response = await fetch(`${URL}/tasks/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task: editingTask.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await getAllTodos();
        setEditingId(null);
        setEditingTask("");
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    }
  };

  const startEditing = (task: getAllTask) => {
    setEditingId(task.id);
    setEditingTask(task.task);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTask("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Todo
          </h1>
          <p className="text-gray-400 text-lg">
            Organize your thoughts, accomplish your goals
          </p>
        </div>

        {/* Add Todo */}
        <Card className="mb-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Add New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Label htmlFor="title" className="text-gray-300">
                Title
              </Label>
              <Input
                id="title"
                placeholder="what needs to be done?"
                value={newTodo.task}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, task: e.target.value })
                }
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
              />
              <Button
                onClick={addTodo}
                className="bg-white text-black hover:bg-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Todo List */}
        <div className="space-y-3">
          <Card className="bg-gray-800/30 border-gray-700 border-dashed">
            <CardContent className="p-8 text-center">
              <Circle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              {todos.map((task, index) => (
                <Card
                  key={index}
                  className="transition-all duration-300 hover:shadow-lg hover:scale-[1.05] bg-gray-800/50 border-gray-600 backdrop-blur-sm p-2 mb-3"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2">
                      <Checkbox className="data-[state=checked]:bg-white data-[state=checked]:border-white" />
                      <div className="flex-1">
                        {editingId === task.id ? (
                          // 編集モード
                          <div className="flex gap-2">
                            <Input
                              value={editingTask}
                              onChange={(e) => setEditingTask(e.target.value)}
                              className="flex-1 bg-gray-700/50 border-gray-600 text-white"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  saveTask(task.id);
                                }
                                if (e.key === "Escape") {
                                  cancelEditing();
                                }
                              }}
                              autoFocus
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => saveTask(task.id)}
                              className="text-gray-400 hover:text-green-400 hover:bg-green-400/10 transition-all duration-200"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelEditing}
                              className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          // 表示モード
                          <div>
                            <p className="transition-all duration-200 text-white">
                              {task.task}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {task.createdAt?.toLocaleDateString("ja-JP")}
                            </p>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-200"
                        onClick={() => startEditing(task)}
                      >
                        <NotebookPen className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                        onClick={() => deleteTodo(task.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-gray-500 text-sm">Built with React & shadcn/ui</p>
        </div>
      </div>
    </div>
  );
}
