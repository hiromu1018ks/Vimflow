import { Task } from "../types";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

function convertToTask(prismaTask: any): Task {
  return {
    ...prismaTask,
    description: prismaTask.description ?? undefined,
  };
}

// タスク一覧取得
export async function getAllTask(): Promise<Task[]> {
  const tasks = await prisma.task.findMany();
  return tasks.map(convertToTask);
}

// タスク作成
export async function createTask(task: Task): Promise<Task> {
  const newTask = await prisma.task.create({
    data: {
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      status: task.status,
      priority: task.priority,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    },
  });
  return convertToTask(newTask);
}

// タスク更新
export async function updateTask(id: string, task: Task): Promise<Task> {
  const currentTask = await getCurrentTask(id);

  if (!currentTask) {
    throw new Error("Task not found");
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      title: task.title,
      description: task.description || undefined,
      status: task.status,
      priority: task.priority,
      updatedAt: new Date(),
    },
  });

  return convertToTask(updatedTask);
}

// タスク削除
export async function deleteTask(id: string): Promise<void> {
  const currentTask = await getCurrentTask(id);

  if (!currentTask) {
    throw new Error("Task not found");
  }

  await prisma.task.delete({
    where: { id },
  });
}

// 現在のタスクを取得
async function getCurrentTask(id: string): Promise<Task | null> {
  const task = await prisma.task.findUnique({
    where: { id },
  });
  return task ? convertToTask(task) : null;
}
