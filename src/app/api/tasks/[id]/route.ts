import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const updateTaskSchema = z.object({
  task: z.string().min(1),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);
    const { id } = await params;
    await prisma.task.update({
      where: { id },
      data: {
        task: validatedData.task,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to update task",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({
      status: "success",
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to delete task",
      },
      { status: 500 }
    );
  }
}
