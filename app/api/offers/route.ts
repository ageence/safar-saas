import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const agencyId = session?.user?.agencyId;
    if (!agencyId) return new NextResponse("Non autorisé", { status: 401 });

    const formData = await request.formData();
    
    const title = formData.get("title") as string;
    const destination = formData.get("destination") as string;
    const price = Number(formData.get("price"));
    const type = formData.get("type") as string;
    const imageUrl = formData.get("imageUrl") as string | null;
    
    const totalSeats = Number(formData.get("totalSeats")) || 50;
    const dateDepartStr = formData.get("dateDepart") as string;
    const dateRetourStr = formData.get("dateRetour") as string;
    
    const startDate = dateDepartStr ? new Date(dateDepartStr) : new Date();
    const endDate = dateRetourStr ? new Date(dateRetourStr) : new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

    // SÉCURITÉ : On utilise STRICTEMENT les noms de ton fichier schema.prisma
    await prisma.offer.create({
      data: {
        title,
        destination,
        price,
        type,
        imageUrl,
        agencyId,
        startDate: startDate,
        endDate: endDate,
        totalSpots: totalSeats,
        availableSpots: totalSeats,
      }
    });

    return NextResponse.redirect(new URL("/dashboard/offres", request.url), 303);
    
  } catch (error: any) {
    console.error("CRASH PRISMA:", error);
    return new NextResponse(`CRASH DE LA BASE DE DONNÉES : ${error.message}`, { status: 500 });
  }
}