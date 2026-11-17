export const instant = false;
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LayoutClient from "./layout-client";
import { NotificationBell } from "@/components/notification-bell"; // 🟢 1. ON IMPORTE TA CLOCHE ICI

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  
  return (
    <LayoutClient session={session}>
      {children}
      {/* 🟢 2. TA CLOCHE EST DE RETOUR ICI ! (Sécurisée uniquement pour l'admin) */}
      <NotificationBell />
    </LayoutClient>
  );
}