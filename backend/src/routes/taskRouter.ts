import express from "express";
import {
  createTask,
  getAllTask,
  updateTask,
  deleteTask,
} from "../service/taskService";

const router = express.Router();

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
    const newTask = await createTask(req.body);
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
    const updatedTask = await updateTask(req.params.id, req.body);
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
