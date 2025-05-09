import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {

  const session = await auth();
  console.log("session", session);

  if(!session){
    redirect("/login");
  }

  return <h1>This is homepage</h1>;
}