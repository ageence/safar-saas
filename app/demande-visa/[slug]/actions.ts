"use server";
import prisma from "@/lib/prisma";

export async function submitVisaApplication(agencyId: string, offerId: string, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const passport = formData.get("passport") as string;
    const country = formData.get("country") as string;
    const notes = formData.get("notes") as string; // 🟢 RESTAURATION DES NOTES

    let client = await prisma.client.findFirst({ where: { phone, agencyId } });
    if (!client) {
      client = await prisma.client.create({
        data: { firstName, lastName, phone, passport, agencyId, source: "Plateforme Visa Publique" },
      });
    }

    const visa = await prisma.visaApplication.create({
      data: {
        clientId: client.id,
        agencyId: agencyId,
        status: "EN_ATTENTE",
        country: country || "Non spécifié",
        type: "Touristique/Étude",
        notes: notes, // 🟢 SAUVEGARDE DES NOTES
      },
    });

    // Sauvegarde simulée des documents
    const photoName = formData.get("photoName") as string;
    const passName = formData.get("passName") as string;
    if (photoName) await prisma.document.create({ data: { name: "Photo d'identité", fileUrl: photoName, visaId: visa.id }});
    if (passName) await prisma.document.create({ data: { name: "Passeport", fileUrl: passName, visaId: visa.id }});

    // 🟢 RESTAURATION DES NOTIFICATIONS POUR L'ADMIN
    await prisma.notification.create({
      data: {
        title: "Nouveau Dossier Visa",
        message: `${firstName} ${lastName} a soumis un dossier visa. Remarques: ${notes || "Aucune"}`,
        type: "VISA",
        agencyId: agencyId,
        link: `/dashboard/visas/${visa.id}`
      }
    });

    return { success: true, ref: visa.id.slice(-6).toUpperCase() };
  } catch (error) {
    console.error("Erreur Visa:", error);
    return { success: false, error: "Erreur serveur" };
  }
}