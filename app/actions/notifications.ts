"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { unstable_noStore as noStore } from "next/cache";

// Le paramètre timestamp empêche le cache de Next.js !
export async function getUnreadNotifications(timestamp?: number) {
  noStore(); // 🟢 DÉSACTIVE LE CACHE OBLIGATOIREMENT
  
  const session = await auth();
  if (!session?.user?.agencyId) return [];

  return await prisma.notification.findMany({
    where: { agencyId: session.user.agencyId, isRead: false },
    orderBy: { createdAt: "desc" },
    take: 10
  });
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