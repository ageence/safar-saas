export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import DossierClient from "./dossier-client"; // L'interface traduite

// ACTION SERVEUR : Ajouter un paiement
async function addPaymentAction(formData: FormData) {
  "use server";
  const bookingId = formData.get("bookingId") as string;
  const amount = Number(formData.get("amount"));

  if (amount > 0) {
    try {
      await prisma.payment.create({
        data: {
          amount,
          agencyId: formData.get("agencyId") as string,
          clientId: formData.get("clientId") as string,
          bookingId: bookingId, 
          method: "ESPÈCES" 
        } as any 
      });
      revalidatePath(`/dashboard/clients/${bookingId}`);
    } catch (e) { console.error("Erreur Paiement", e); }
  }
}

// ACTION SERVEUR : Ajouter un document
async function addDocumentAction(bookingId: string, name: string, fileData: string) {
  "use server";
  try {
    await prisma.document.create({
      data: { name, fileUrl: fileData, bookingId } as any
    });
    revalidatePath(`/dashboard/clients/${bookingId}`);
  } catch (e) { console.error("Erreur Document", e); }
}

export default async function ClientDossierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.agencyId) return null;

  const rawBooking = await prisma.booking.findUnique({
    where: { id },
    include: { client: true, offer: true }
  });
  if (!rawBooking) return notFound();
  const booking = rawBooking as any;

  const payments = await prisma.payment.findMany({ where: { bookingId: booking.id } }) as any[];
  const documents = await prisma.document.findMany({ where: { bookingId: booking.id } }).catch(()=>[]) as any[];

  const totalPrice = booking.offer?.price || 0;
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const remaining = totalPrice - totalPaid;
  const isPaid = totalPrice > 0 && remaining <= 0;

  // ON PASSE TOUT AU COMPOSANT CLIENT
  return (
    <DossierClient 
      booking={booking} 
      payments={payments} 
      documents={documents} 
      totalPrice={totalPrice} 
      totalPaid={totalPaid} 
      remaining={remaining} 
      isPaid={isPaid}
      addPaymentAction={addPaymentAction}
      addDocumentAction={addDocumentAction}
    />
  );
}