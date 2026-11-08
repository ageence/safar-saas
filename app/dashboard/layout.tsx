export const instant = false;
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LayoutClient from "./layout-client";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  
  return <LayoutClient session={session}>{children}</LayoutClient>;
}