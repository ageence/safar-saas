import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.agencyId) return new NextResponse("Non autorisé", { status: 401 });

    const formData = await request.formData();
    const id = formData.get("id") as string; // L'ID du voyage à modifier
    const title = formData.get("title") as string;
    const destination = formData.get("destination") as string;
    const price = Number(formData.get("price"));
    const type = formData.get("type") as string;
    const imageUrl = formData.get("imageUrl") as string | null;
    
    const totalSeats = Number(formData.get("totalSeats"));
    const dateDepartStr = formData.get("dateDepart") as string;
    const dateRetourStr = formData.get("dateRetour") as string;
    
    const startDate = dateDepartStr ? new Date(dateDepartStr) : new Date();
    const endDate = dateRetourStr ? new Date(dateRetourStr) : new Date();

    await prisma.offer.update({
      where: { id },
      data: {
        title, destination, price, type, imageUrl,
        startDate, endDate,
        totalSpots: totalSeats, availableSpots: totalSeats,
      }
    });

    return NextResponse.redirect(new URL("/dashboard/offres", request.url), 303);
  } catch (error: any) {
    return new NextResponse(`CRASH UPDATE : ${error.message}`, { status: 500 });
  }
}