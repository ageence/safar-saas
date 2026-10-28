"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createVisaApplication(formData: FormData) {
  const session = await auth();
  const agencyId = session?.user?.agencyId;
  if (!agencyId) throw new Error("Non autorisé");

  const appointmentDateStr = formData.get("appointmentDate") as string;
  const appointmentDate = appointmentDateStr ? new Date(appointmentDateStr) : null;

  await prisma.visaApplication.create({
    data: {
      agencyId,
      clientId: formData.get("clientId") as string,
      country: formData.get("country") as string,
      status: formData.get("status") as string,
      missingDocs: formData.get("missingDocs") as string,
      appointmentDate,
    },
  });

  revalidatePath("/dashboard/visas");
}