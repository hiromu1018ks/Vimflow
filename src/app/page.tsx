"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Circle, NotebookPen, Plus, Trash2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTodos } from "@/hooks/useTodos";
import { useTaskEdit } from "@/hooks/useTaskEdit";
import { useVimMode } from "@/hooks/useVimMode";

export default function Home() {
  const todoHooks = useTodos();
  const editHooks = useTaskEdit();
  const vimHooks = useVimMode({
    todos: todoHooks.todos,
    editingId: editHooks.editingId,
    onAddTodo: todoHooks.addTodo,
    onDeleteTodo: todoHooks.deleteTodo,
    onStartEditing: editHooks.startEditing,
  });

  // saveTask関数（一時実装）
  const saveTask = async (id: string) => {
    if (!editHooks.editingTask.trim()) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: editHooks.editingTask.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await todoHooks.getAllTodos();
      editHooks.cancelEditing();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
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
                id="new-task-input"
                placeholder="what needs to be done?"
                value={todoHooks.newTodo.task}
                onChange={(e) =>
                  todoHooks.setNewTodo({
                    ...todoHooks.newTodo,
                    task: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    todoHooks.addTodo();
                    vimHooks.setMode("normal");
                  } else if (e.key === "Escape") {
                    vimHooks.setMode("normal");
                    todoHooks.setNewTodo({ task: "" });
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
              />
              <Button
                onClick={todoHooks.addTodo}
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
              {todoHooks.todos.map((task, index) => (
                <Card
                  key={index}
                  className={`transition-all duration-300 hover:shadow-lg hover:scale-[1.05] backdrop-blur-sm p-2 mb-3 ${
                    vimHooks.selectedIndex === index &&
                    vimHooks.mode === "normal"
                      ? "bg-blue-500/20 border-blue-400 shadow-lg ring-2 ring-blue-400/50"
                      : "bg-gray-800/50 border-gray-600"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2">
                      <Checkbox className="data-[state=checked]:bg-white data-[state=checked]:border-white" />
                      <div className="flex-1">
                        {editHooks.editingId === task.id ? (
                          // 編集モード
                          <div className="flex gap-2">
                            <Input
                              value={editHooks.editingTask}
                              placeholder="Edit task"
                              onChange={(e) =>
                                editHooks.setEditingTask(e.target.value)
                              }
                              className="flex-1 bg-gray-700/50 border-gray-600 text-white"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  saveTask(task.id);
                                }
                                if (e.key === "Escape") {
                                  editHooks.cancelEditing();
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
                              onClick={editHooks.cancelEditing}
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
                        onClick={() => editHooks.startEditing(task)}
                      >
                        <NotebookPen className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                        onClick={() => todoHooks.deleteTodo(task.id)}
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
