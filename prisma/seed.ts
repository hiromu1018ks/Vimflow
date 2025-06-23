import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // データベースのタスクを削除
  await prisma.task.deleteMany({});
  console.log("Cleared existing tasks.");

  // テストデータを挿入
  const task1 = await prisma.task.create({
    data: {
      task: "牛乳を買う",
    },
  });
  console.log(`Created task with id: ${task1.id}`);

  const task2 = await prisma.task.create({
    data: {
      task: "レポートを提出する",
    },
  });
  console.log(`Created task with id: ${task2.id}`);

  const task3 = await prisma.task.create({
    data: {
      task: "ジムに行く",
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
