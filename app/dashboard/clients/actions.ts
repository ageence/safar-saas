"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createClient(formData: FormData) {
  // 1. On vérifie qui fait la demande
  const session = await auth();
  const agencyId = session?.user?.agencyId;

  if (!agencyId) {
    throw new Error("Non autorisé");
  }

  // 2. On enregistre le client dans la base de données
  await prisma.client.create({
    data: {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phone: formData.get("phone") as string,
      source: formData.get("source") as string,
      agencyId: agencyId, // On le lie à la bonne agence
    },
  });

  // 3. On rafraîchit la page instantanément pour afficher le nouveau client
  revalidatePath("/dashboard/clients");
}