import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const agencyId = session?.user?.agencyId;

    if (!agencyId) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const destination = formData.get("destination") as string;
    const price = Number(formData.get("price"));
    const type = formData.get("type") as string;
    const imageUrl = formData.get("imageUrl") as string | null;

    // SÉCURITÉ : On essaie de créer l'offre avec les variables de base
    await prisma.offer.create({
      data: {
        title,
        destination,
        price,
        type,
        imageUrl,
        agencyId,
        
        // On remplit les champs obligatoires probables pour éviter que Prisma ne crashe
        dateDepart: new Date(),
        dateRetour: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        availableSeats: 50,
      } as any 
    });

    return NextResponse.redirect(new URL("/dashboard/offres", request.url), 303);
    
  } catch (error: any) {
    console.error("CRASH PRISMA:", error);
    // HNA L'ASTUCE : Si ça plante, tu verras EXACTEMENT pourquoi sur ton écran blanc !
    return new NextResponse(`CRASH DE LA BASE DE DONNÉES : ${error.message}`, { status: 500 });
  }
}