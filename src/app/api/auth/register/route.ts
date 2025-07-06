import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const registerShema = z.object({
  name: z
    .string()
    .min(1, "名前は必須です")
    .max(50, "名前は50文字以下である必要があります。"),
  email: z
    .string()
    .email("有効なメールアドレスを入力してください")
    .toLowerCase(),
  password: z
    .string()
    .min(8, "パスワードは8文字以上である必要があります")
    .max(100, "パスワードは100文字以下である必要があります")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "パスワードには小文字、大文字、数字を含む必要があります",
    ),
});

export async function POST(request: NextRequest) {
  try {
    console.log("ユーザー登録API開始");

    const body = await request.json();
    console.log("受信データ:", { ...body, password: "[HIDDEN]" });

    const validatedData = registerShema.parse(body);
    console.log("バリデーション成功");

    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    });

    if (existingUser) {
      console.log("登録失敗: メールアドレスが既に使用されています");
      return NextResponse.json(
        {
          error: "このメールアドレスは既に登録されています",
        },
        { status: 400 },
      );
    }

    console.log("パスワードハッシュ化中...");
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(
      validatedData.password,
      saltRounds,
    );
    console.log("パスワードハッシュ化完了");

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    console.log("ユーザー作成成功:", user.email);

    return NextResponse.json(
      {
        message: "ユーザー登録が完了しました",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("バリデーションエラー:", error.errors);
      return NextResponse.json(
        {
          error: error.errors[0].message,
          field: error.errors[0].path[0],
        },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      console.log("重複エラー:", error.message);
      return NextResponse.json(
        {
          error: "このメールアドレスは既に登録されています",
        },
        { status: 400 },
      );
    }
    // その他のエラー
    console.error("予期しないエラー:", error);
    return NextResponse.json(
      {
        error: "サーバーエラーが発生しました。しばらく後で再試行してください。",
      },
      { status: 500 },
    );
  }
}

// 🚫 他のHTTPメソッドは許可しない
export async function GET() {
  return NextResponse.json(
    { error: "このエンドポイントではGETメソッドは許可されていません" },
    { status: 405 },
  );
}
