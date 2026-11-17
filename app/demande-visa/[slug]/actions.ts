"use server";
import prisma from "@/lib/prisma";

export async function submitVisaApplication(agencyId: string, offerId: string, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const passport = formData.get("passport") as string;
    const country = formData.get("country") as string;

    // 1. Création ou maj du Client
    let client = await prisma.client.findFirst({ where: { phone, agencyId } });
    if (!client) {
      client = await prisma.client.create({
        data: { firstName, lastName, phone, passport, agencyId, source: "Plateforme Visa Publique" },
      });
    }

    // 2. Création du Dossier Visa
    const visa = await prisma.visaApplication.create({
      data: {
        clientId: client.id,
        agencyId: agencyId,
        status: "EN_ATTENTE",
        country: country || "Non spécifié",
        type: "Touristique/Étude", 
      },
    });

    // 3. (Simulation) Enregistrement des documents dans la base
    // Dans la réalité, tu uploaderais le fichier sur Vercel Blob ici, puis tu mettrais l'URL
    const photoName = formData.get("photoName") as string;
    const passName = formData.get("passName") as string;

    if (photoName) {
      await prisma.document.create({
        data: { name: "Photo d'identité", fileUrl: photoName, visaId: visa.id }
      });
    }
    if (passName) {
      await prisma.document.create({
        data: { name: "Passeport", fileUrl: passName, visaId: visa.id }
      });
    }

    return { success: true, ref: visa.id.slice(-6).toUpperCase() };
  } catch (error) {
    console.error("Erreur Visa:", error);
    return { success: false, error: "Erreur serveur" };
  }
}