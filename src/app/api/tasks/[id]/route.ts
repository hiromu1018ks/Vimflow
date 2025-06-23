import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.task.delete({
      where: { id: params.id },
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
