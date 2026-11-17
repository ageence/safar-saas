"use server";
import prisma from "@/lib/prisma";

export async function submitVisaApplication(agencyId: string, formData: FormData) {
  try {
    // 1. Récupération des informations personnelles
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const passport = formData.get("passport") as string;
    
    // 2. Récupération des informations de voyage
    const destination = formData.get("destination") as string;
    const visaType = formData.get("visaType") as string;
    const travelDate = formData.get("travelDate") as string;

    // 3. Récupération des fichiers (Ils sont dans le FormData, prêts à être envoyés sur S3 ou Vercel Blob)
    const photoFile = formData.get("photoFile") as File;
    const passportFile = formData.get("passportFile") as File;

    // TODO: Ici, dans le futur, tu pourras ajouter le code d'upload vers Vercel Blob ou AWS S3
    // const photoUrl = await uploadToStorage(photoFile);

    // 4. Création ou mise à jour du client
    let client = await prisma.client.findFirst({
      where: { phone, agencyId },
    });

    if (!client) {
      client = await prisma.client.create({
        data: { 
          firstName, 
          lastName, 
          phone, 
          passport, 
          agencyId, 
          source: "Plateforme Visa Premium" 
        },
      });
    }

    // 5. Création du dossier Visa complet
    await prisma.visaApplication.create({
      data: { 
        clientId: client.id, 
        agencyId: agencyId, 
        status: "PENDING", 
        country: destination || "À définir",
        // Remarque : Si tu as ajouté visaType ou travelDate dans ton schéma Prisma, décommente les lignes ci-dessous :
        // type: visaType,
        // departureDate: travelDate ? new Date(travelDate) : null,
      },
    });

    return { success: true, reference: `VISA-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}` };
  } catch (error) {
    console.error("Erreur sauvegarde Visa Premium :", error);
    return { success: false, error: "Erreur serveur lors de la soumission." };
  }
}