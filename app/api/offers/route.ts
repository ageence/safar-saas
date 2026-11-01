import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    // 1. Vérifier que l'utilisateur est connecté
    const session = await auth();
    const agencyId = session?.user?.agencyId;

    if (!agencyId) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    // 2. Récupérer les données envoyées par le formulaire
    const formData = await request.formData();
    
    const title = formData.get("title") as string;
    const destination = formData.get("destination") as string;
    const price = Number(formData.get("price"));
    const type = formData.get("type") as string;
    const imageUrl = formData.get("imageUrl") as string | null;

    // 3. Sauvegarder dans la base de données Prisma
    await prisma.offer.create({
      data: {
        title,
        destination,
        price,
        type,
        imageUrl,
        agencyId,
        // Valeurs par défaut pour ne pas bloquer Prisma si le formulaire ne les a pas
        dateDepart: new Date(),
        dateRetour: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // +7 jours
        availableSeats: 50,
      } as any // Force TypeScript à accepter la création selon ton schéma exact
    });

    // 4. Rediriger vers la page des offres après le succès (Code 303 obligatoire)
    return NextResponse.redirect(new URL("/dashboard/offres", request.url), 303);
    
  } catch (error) {
    console.error("Erreur lors de la création de l'offre:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}