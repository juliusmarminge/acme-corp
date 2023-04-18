import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/app-beta";

export default function HomePage() {
  const { sessionId } = auth();
  redirect(sessionId ? "/dashboard" : "/signin");
}
