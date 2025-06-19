import express from "express";
import {
  createTask,
  getAllTask,
  updateTask,
  deleteTask,
} from "../service/taskService";
import { z } from "zod";

const router = express.Router();

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// タスク一覧取得
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await getAllTask();
    res.status(200).json({
      status: "success",
      data: tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Failed to get tasks",
    });
  }
});

// タスク作成
router.post("/tasks", async (req, res) => {
  try {
    const validatedData = taskSchema.parse(req.body);
    const newTask = await createTask(validatedData);
    res.status(201).json({
      status: "success",
      data: newTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Failed to create task",
    });
  }
});

// タスク更新
router.put("/tasks/:id", async (req, res) => {
  try {
    const validatedData = taskSchema.parse(req.body);
    const updatedTask = await updateTask(req.params.id, validatedData);
    res.status(200).json({
      status: "success",
      data: updatedTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Failed to update task",
    });
  }
});

// タスク削除
router.delete("/tasks/:id", async (req, res) => {
  try {
    await deleteTask(req.params.id);
    res.status(204).json({
      status: "success",
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Failed to delete task",
    });
  }
});

export default router;
