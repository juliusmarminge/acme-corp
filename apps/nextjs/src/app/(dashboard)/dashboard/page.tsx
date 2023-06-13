import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

export default function RedirectPage() {
  const { userId } = auth();
  redirect(`/${userId}`);
}
