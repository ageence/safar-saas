export const instant = false;
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LayoutClient from "./layout-client";
import { NotificationBell } from "@/components/notification-bell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  
  return (
    <LayoutClient session={session}>
      {children}
      {/* 🟢 LA CLOCHE EST ICI, SÉCURISÉE DANS LE DASHBOARD */}
      <NotificationBell />
    </LayoutClient>
  );
}