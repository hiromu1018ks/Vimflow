import { z } from "zod";

export const createTaskSchema = z.object({
  task : z.string()
    .min(1, "タスクは必須です")
    .max(500, "タスクは500文字以内で入力してください")
    .refine(
      (val) => !/<script/i.test(val),
      "スクリプトタグは使用できません"
    )
})

export const updateTaskSchema = z.object({
  id : z.string().uuid('不正なIDです'),
  task : z.string().min(1).max(500).optional(),
  completed : z.boolean().optional()
})