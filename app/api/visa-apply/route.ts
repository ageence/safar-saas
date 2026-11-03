import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  
  // ⚠️ ATTENTION : METS TON VRAI AGENCY ID ICI SI C'EST DIFFÉRENT
  const agencyId = "cmvs6wjv80000tp0w9rlf3uaa"; 

  try {
    const client = await prisma.client.create({
      data: {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        phone: formData.get("phone") as string,
        passport: formData.get("passport") as string,
        source: "LIEN RESEAUX SOCIAUX",
        agencyId,
      } as any
    });

    await prisma.visaApplication.create({
      data: {
        clientId: client.id,
        country: formData.get("country") as string,
        type: formData.get("type") as string,
        agencyId,
      } as any
    });

    return NextResponse.redirect(new URL(`/visa?success=true`, request.url), 303);
  } catch (error: any) {
    return NextResponse.redirect(new URL(`/visa?error=${encodeURIComponent(error.message)}`, request.url), 303);
  }
}