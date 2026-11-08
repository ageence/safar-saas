"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { unstable_noStore as noStore } from "next/cache";

export async function getUnreadNotifications(timestamp?: number) {
  noStore();
  
  try {
    const session = await auth();
    if (!session?.user?.agencyId) return [];

    return await prisma.notification.findMany({
      where: { agencyId: session.user.agencyId, isRead: false },
      orderBy: { createdAt: "desc" },
      take: 10
    });
  } catch (error) {
    // 🟢 SI LA TABLE N'EXISTE PAS ENCORE, ON NE BLOQUE PAS LE DASHBOARD
    console.error("Erreur Notifications (Vérifiez la BDD):", error);
    return [];
  }
}

export async function markAsRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}