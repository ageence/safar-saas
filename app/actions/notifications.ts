"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getUnreadNotifications() {
  const session = await auth();
  if (!session?.user?.agencyId) return [];

  return await prisma.notification.findMany({
    where: { agencyId: session.user.agencyId, isRead: false },
    orderBy: { createdAt: "desc" },
    take: 10 // On ramène les 10 dernières pour pas surcharger
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