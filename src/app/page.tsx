import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TodoApp from "@/components/todo/TodoApp";


export default async function Home() {
  const session = await auth();
  
  console.log("=== HOME PAGE DEBUG ===");
  console.log("Session:", session);
  console.log("Session user:", session?.user);
  console.log("Session expires:", session?.expires);
  console.log("======================");

  if ( !session ) {
    console.log("No session found, redirecting to signin");
    redirect("/auth/signin")
  }

  console.log("Session found, rendering TodoApp");
  return (
    <TodoApp session={ session }/>
  );
}
