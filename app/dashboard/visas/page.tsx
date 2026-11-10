export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import VisasClient from "./visas-client";

export default async function VisasPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;

  if (!agencyId) return null;

  const rawVisas = await prisma.visaApplication.findMany({
    where: { agencyId },
    include: { client: true },
    orderBy: { updatedAt: "desc" },
  });
  const visas = rawVisas as any[];

  const clients = await prisma.client.findMany({
    where: { agencyId },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { lastName: "asc" }
  });

  return <VisasClient visas={visas} clients={clients} />;
}