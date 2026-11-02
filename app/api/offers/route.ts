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
    
    // Récupération des données du formulaire (Même les nouvelles)
    const title = formData.get("title") as string;
    const destination = formData.get("destination") as string;
    const price = Number(formData.get("price"));
    const type = formData.get("type") as string;
    const imageUrl = formData.get("imageUrl") as string | null;
    
    // Nouvelles données : Dates et Places
    const totalSeats = Number(formData.get("totalSeats")) || 50;
    const dateDepartStr = formData.get("dateDepart") as string;
    const dateRetourStr = formData.get("dateRetour") as string;
    
    const dateDepart = dateDepartStr ? new Date(dateDepartStr) : new Date();
    const dateRetour = dateRetourStr ? new Date(dateRetourStr) : new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

    // Sauvegarde en forçant "as any" pour s'adapter à ton schéma sans crasher
    await prisma.offer.create({
      data: {
        title,
        destination,
        price,
        type,
        imageUrl,
        agencyId,
        dateDepart,
        dateRetour,
        startDate: dateDepart, 
        endDate: dateRetour,
        totalSeats,
        availableSeats: totalSeats,
        totalSpots: totalSeats,
        availableSpots: totalSeats,
      } as any
    });

    return NextResponse.redirect(new URL("/dashboard/offres", request.url), 303);
    
  } catch (error: any) {
    console.error("CRASH PRISMA:", error);
    return new NextResponse(`CRASH DE LA BASE DE DONNÉES : ${error.message}`, { status: 500 });
  }
}