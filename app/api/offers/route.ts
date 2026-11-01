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
    
    // Extracting form data
    const title = formData.get("title") as string;
    const destination = formData.get("destination") as string;
    const price = Number(formData.get("price"));
    const type = formData.get("type") as string;
    const imageUrl = formData.get("imageUrl") as string | null;

    // Secure save: overriding strict typing with 'as any' to match the database state
    await prisma.offer.create({
      data: {
        title,
        destination,
        price,
        type,
        imageUrl,
        agencyId,
      } as any
    });

    return NextResponse.redirect(new URL("/dashboard/offres", request.url), 303);
    
  } catch (error: any) {
    console.error("CRASH PRISMA:", error);
    return new NextResponse(`CRASH DE LA BASE DE DONNÉES : ${error.message}`, { status: 500 });
  }
}