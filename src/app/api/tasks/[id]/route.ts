import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

const updateTaskSchema = z.object({
  task : z.string().min(1).optional(),
  completed: z.boolean().optional(),
});

export async function PUT(
  request : NextRequest,
  { params } : { params : Promise<{ id : string }> }
) {
  try {
    const session = await auth();
    if ( !session?.user?.id ) {
      return NextResponse.json({ error : "Unauthorized" }, { status : 401 })
    }

    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);
    const { id } = await params;

    const task = await prisma.task.findFirst({
      where : { id, userId : session.user.id }
    });

    if ( !task ) {
      return NextResponse.json({ error : "Task not found" }, { status : 404 });
    }

    const updateData: { task?: string; completed?: boolean } = {};
    if (validatedData.task !== undefined) {
      updateData.task = validatedData.task;
    }
    if (validatedData.completed !== undefined) {
      updateData.completed = validatedData.completed;
    }

    await prisma.task.update({
      where : { id },
      data : updateData,
    });

    return NextResponse.json({
      status : "success",
      message : "Task updated successfully",
    });
  } catch ( error ) {
    console.error(error);
    return NextResponse.json(
      {
        status : "error",
        message : "Failed to update task",
      },
      { status : 500 }
    );
  }
}

export async function DELETE(
  request : NextRequest,
  { params } : { params : Promise<{ id : string }> }
) {
  try {
    // ✅ 認証チェック追加
    const session = await auth();
    if ( !session?.user?.id ) {
      return NextResponse.json({ error : "Unauthorized" }, { status : 401 });
    }

    const { id } = await params;

    // ✅ 所有者チェック追加
    const task = await prisma.task.findFirst({
      where : { id, userId : session.user.id }
    });

    if ( !task ) {
      return NextResponse.json({ error : "Task not found" }, { status : 404 });
    }

    await prisma.task.delete({
      where : { id },
    });

    return NextResponse.json({
      status : "success",
      message : "Task deleted successfully",
    });
  } catch ( error ) {
    console.error(error);
    return NextResponse.json(
      {
        status : "error",
        message : "Failed to delete task",
      },
      { status : 500 }
    );
  }
}
