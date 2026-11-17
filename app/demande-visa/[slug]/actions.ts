"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitVisaApplication(agencyId: string, offerId: string, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const passport = formData.get("passport") as string;
    const country = formData.get("country") as string;
    
    // Les nouveaux champs pro :
    const occupation = formData.get("occupation") as string;
    const visaHistory = formData.get("visaHistory") as string;
    const userNotes = formData.get("notes") as string; 
    
    // On compile tout ça dans le champ "notes" pour ne pas casser ton schéma Prisma !
    const finalNotes = `Profession: ${occupation}\nHistorique: ${visaHistory}\nRemarques: ${userNotes || "Aucune"}`;

    let client = await prisma.client.findFirst({ where: { phone, agencyId } });
    if (!client) {
      client = await prisma.client.create({
        data: { firstName, lastName, phone, passport, agencyId, source: "Plateforme Visa" },
      });
    }

    const visa = await prisma.visaApplication.create({
      data: {
        clientId: client.id, agencyId: agencyId, status: "EN_ATTENTE", country: country || "Non spécifié", type: "Touristique/Étude",
        notes: finalNotes, // 🟢 Les nouvelles options sont sauvegardées ici !
      },
    });

    await prisma.notification.create({
      data: {
        title: "✈️ Nouveau Dossier Visa",
        message: `${firstName} ${lastName} a soumis un dossier. (${visaHistory})`,
        type: "VISA", agencyId: agencyId, link: `/dashboard/visas/${visa.id}`
      }
    });

    // 🟢 LE FIX DU SON ADMIN :
    revalidatePath("/dashboard", "layout");

    return { success: true, ref: visa.id.slice(-6).toUpperCase() };
  } catch (error) {
    return { success: false, error: "Erreur serveur" };
  }
}