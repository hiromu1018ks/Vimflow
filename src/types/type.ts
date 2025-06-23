export interface Task {
  // id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  createdAt?: Date;
  updatedAt?: Date; // 追加
}
