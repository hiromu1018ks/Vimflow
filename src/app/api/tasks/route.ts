import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const taskSchema = z.object({
  task: z.string().min(1),
});

// GET /api/tasks
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    console.log(tasks);
    return NextResponse.json({ status: "success", data: tasks });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Failed to get tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - タスク作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = taskSchema.parse(body);

    const newTask = await prisma.task.create({
      data: {
        ...validatedData,
      },
    });
    return NextResponse.json({ status: "success", data: newTask });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to create task",
      },
      { status: 500 }
    );
  }
}
