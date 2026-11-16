"use server";

import prisma from "@/lib/prisma";

export async function submitVisaApplication(agencyId: string, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const passport = formData.get("passport") as string;

    // 1. On cherche si le client existe déjà avec ce numéro de téléphone pour cette agence
    let client = await prisma.client.findFirst({
      where: { phone, agencyId },
    });

    // 2. S'il n'existe pas, on le crée avec les champs obligatoires manquants
    if (!client) {
      client = await prisma.client.create({
        data: {
          firstName,
          lastName,
          phone,
          passport,
          agencyId,
          source: "Site Web", // 🟢 FIX 1 : On indique que le client vient du formulaire public
        },
      });
    }

    // 3. On crée le nouveau dossier de demande de Visa pour ce client
    await prisma.visaApplication.create({
      data: {
        clientId: client.id,
        agencyId: agencyId,
        status: "PENDING", 
        country: "À définir", // 🟢 FIX 2 : Le client choisira le pays plus tard avec l'agence
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la sauvegarde :", error);
    return { success: false, error: "Erreur serveur" };
  }
}