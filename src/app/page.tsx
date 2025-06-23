"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Task } from "@/types/type";
import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Clock, Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Home() {
  // 状態管理
  const [todos, setTodos] = useState<Task[]>([
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
  const [newTodo, setNewTodo] = useState<Task>({
    title: "",
    status: "pending",
    priority: "medium",
    description: "",
  });
  const [filter, setFilter] = useState("all");

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
      const tasks = result.data.map((task: Task) => ({
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
    if (newTodo.title.trim()) {
      try {
        const response = await fetch(`${URL}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newTodo.title.trim(),
            status: "pending",
            priority: newTodo.priority,
            description: newTodo.description || "",
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // タスクを追加後、リストを再取得
        await getAllTodos();

        setNewTodo({
          title: "",
          status: "pending",
          priority: "medium",
          description: "",
        });
      } catch (error) {
        console.error("Failed to add task:", error);
      }
    }
  };

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status: "pending" | "in_progress" | "completed") => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "in_progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "pending":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: "pending" | "in_progress" | "completed") => {
    switch (status) {
      case "completed":
        return CheckCircle2;
      case "in_progress":
        return Clock;
      case "pending":
        return Circle;
      default:
        return Circle;
    }
  };

  const completedCount = todos.filter(
    (todo) => todo.status == "completed"
  ).length;
  const inProgressCount = todos.filter(
    (todo) => todo.status == "in_progress"
  ).length;
  const pendingCount = todos.filter((todo) => todo.status == "pending").length;
  const totalCount = todos.length;

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
        {/* Status Card */}
        <Card className="mb-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {totalCount}
                  </div>
                  <div className="text-sm text-gray-400">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {completedCount}
                  </div>
                  <div className="text-sm text-gray-400">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {inProgressCount}
                  </div>
                  <div className="text-sm text-gray-400">inProgress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {pendingCount}
                  </div>
                  <div className="text-sm text-gray-400">Pending</div>
                </div>
              </div>
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                <Circle className="w-8 h-8 text-gray-300" />
              </div>
            </div>
          </CardContent>
        </Card>

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
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
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
                  className="transition-all duration-300 hover:shadow-lg hover:scale-[1.01] bg-gray-800/50 border-gray-600 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Checkbox className="data-[state=checked]:bg-white data-[state=checked]:border-white" />
                      <div className="flex-1">
                        <p className=" transition-all duration-200 text-white">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {task.createdAt?.toLocaleDateString("ja-JP")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
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
