"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateAgency(formData: FormData) {
  const session = await auth();
  if (!session?.user?.agencyId) throw new Error("Non autorisé");

  await prisma.agency.update({
    where: { id: session.user.agencyId },
    data: {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
    }
  });

  revalidatePath("/dashboard/parametres");
}

export async function addEmployee(formData: FormData) {
  const session = await auth();
  // Seul le gérant (AGENCY_ADMIN) peut ajouter des employés
  if (session?.user?.role !== "AGENCY_ADMIN") throw new Error("Non autorisé");

  const hashedPassword = await bcrypt.hash(formData.get("password") as string, 10);

  await prisma.user.create({
    data: {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: hashedPassword,
      role: "EMPLOYEE",
      agencyId: session.user.agencyId,
    }
  });

  revalidatePath("/dashboard/parametres");
}