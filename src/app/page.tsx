import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TodoApp from "@/components/todo/TodoApp";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return <TodoApp session={session} />;
}
