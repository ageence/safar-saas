"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createPayment(formData: FormData) {
  const session = await auth();
  const agencyId = session?.user?.agencyId;
  if (!agencyId) throw new Error("Non autorisé");

  await prisma.payment.create({
    data: {
      agencyId,
      bookingId: formData.get("bookingId") as string,
      amount: parseFloat(formData.get("amount") as string),
      method: formData.get("method") as string,
      reference: formData.get("reference") as string,
    },
  });

  revalidatePath("/dashboard/finances");
}
export async function createExpense(formData: FormData) {
  const session = await auth();
  const agencyId = session?.user?.agencyId;
  if (!agencyId) throw new Error("Non autorisé");

  await prisma.expense.create({
    data: {
      agencyId,
      amount: parseFloat(formData.get("amount") as string),
      category: formData.get("category") as string,
      description: formData.get("description") as string,
    },
  });

  revalidatePath("/dashboard/finances");
}