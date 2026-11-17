"use server";
import prisma from "@/lib/prisma";

export async function submitVisaApplication(agencyId: string, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const passport = formData.get("passport") as string;

    let client = await prisma.client.findFirst({
      where: { phone, agencyId },
    });

    if (!client) {
      client = await prisma.client.create({
        data: { firstName, lastName, phone, passport, agencyId, source: "Site Web" },
      });
    }

    await prisma.visaApplication.create({
      data: { clientId: client.id, agencyId: agencyId, status: "PENDING", country: "À définir" },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur sauvegarde Visa :", error);
    return { success: false, error: "Erreur serveur" };
  }
}