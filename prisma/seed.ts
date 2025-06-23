import { PrismaClient } from "../backend/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // データベースのタスクを削除
  await prisma.task.deleteMany({});
  console.log("Cleared existing tasks.");

  // テストデータを挿入
  const task1 = await prisma.task.create({
    data: {
      title: "牛乳を買う",
      description: "スーパーで低脂肪牛乳を買う",
      status: "pending",
      priority: "high",
    },
  });
  console.log(`Created task with id: ${task1.id}`);

  const task2 = await prisma.task.create({
    data: {
      title: "レポートを提出する",
      description: "月次レポートを上司に提出",
      status: "completed",
      priority: "high",
    },
  });
  console.log(`Created task with id: ${task2.id}`);

  const task3 = await prisma.task.create({
    data: {
      title: "ジムに行く",
      description: "週3回の運動目標を達成する",
      status: "pending",
      priority: "medium",
    },
  });
  console.log(`Created task with id: ${task3.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
