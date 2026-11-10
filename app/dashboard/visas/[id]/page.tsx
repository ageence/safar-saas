export const instant = false;
export const maxDuration = 60; 

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { VisaDossierClient } from "./visa-dossier-client"; // COMPOSANT CLIENT

async function editClientAction(formData: FormData) {
  "use server";
  const clientId = formData.get("clientId") as string;
  const visaId = formData.get("visaId") as string;
  
  try {
    await prisma.client.update({
      where: { id: clientId },
      data: {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        phone: formData.get("phone") as string,
        passport: formData.get("passport") as string,
      } as any
    });
    revalidatePath(`/dashboard/visas/${visaId}`);
  } catch (error) { console.error(error); }
}

async function updateVisaAction(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  try {
    await prisma.visaApplication.update({
      where: { id },
      data: {
        price: Number(formData.get("price")),
        status: formData.get("status") as string,
        appointmentDate: formData.get("appointmentDate") ? new Date(formData.get("appointmentDate") as string) : null,
        appointmentLink: formData.get("appointmentLink") as string,
        videoUrl: formData.get("videoUrl") as string,
        notes: formData.get("notes") as string,
      } as any
    });
    revalidatePath(`/dashboard/visas/${id}`);
  } catch (error) { console.error(error); }
}

async function addPaymentAction(formData: FormData) {
  "use server";
  const visaId = formData.get("visaId") as string;
  const amount = Number(formData.get("amount"));
  if (amount > 0) {
    try {
      await prisma.payment.create({
        data: { amount, agencyId: formData.get("agencyId") as string, clientId: formData.get("clientId") as string, visaId, method: "ESPÈCES" } as any
      });
      revalidatePath(`/dashboard/visas/${visaId}`);
    } catch (error) { console.error(error); }
  }
}

async function addDocumentAction(formData: FormData) {
  "use server";
  try {
    const visaId = formData.get("visaId") as string;
    const name = formData.get("name") as string;
    const rawFile = formData.get("file");
    
    let fileData = "";
    
    if (typeof rawFile === "string" && rawFile.startsWith("data:")) {
      fileData = rawFile;
    } 
    else if (rawFile instanceof File) {
      const buffer = await rawFile.arrayBuffer();
      const base64String = Buffer.from(buffer).toString("base64");
      
      let mimeType = rawFile.type;
      if (!mimeType || mimeType === "application/octet-stream") {
        const lowName = name.toLowerCase();
        if (lowName.endsWith(".mp4") || lowName.includes("vid") || lowName.endsWith(".mov")) {
          mimeType = "video/mp4";
        } else if (lowName.endsWith(".pdf")) {
          mimeType = "application/pdf";
        } else {
          mimeType = "video/mp4"; 
        }
      }

      fileData = `data:${mimeType};base64,${base64String}`;
    }

    if (!fileData) return;

    await prisma.document.create({ data: { name, fileUrl: fileData, visaId } as any });
    revalidatePath(`/dashboard/visas/${visaId}`);
  } catch (error) { 
    console.error(error); 
    throw new Error("Erreur serveur lors de l'enregistrement");
  }
}

async function deleteDocumentAction(docId: string, visaId: string) {
  "use server";
  try {
    await prisma.document.delete({ where: { id: docId } });
    revalidatePath(`/dashboard/visas/${visaId}`);
  } catch (error) { console.error(error); }
}

export default async function VisaDossierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.agencyId) return null;

  const rawVisa = await prisma.visaApplication.findUnique({
    where: { id }, include: { client: true, payments: true, documents: true }
  });
  if (!rawVisa) return notFound();
  
  const visa = rawVisa as any;
  const totalPaid = visa.payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  const remaining = visa.price - totalPaid;
  const isPaid = visa.price > 0 && remaining <= 0;

  return (
    <VisaDossierClient 
      visa={visa}
      totalPaid={totalPaid}
      remaining={remaining}
      isPaid={isPaid}
      editClientAction={editClientAction}
      updateVisaAction={updateVisaAction}
      addPaymentAction={addPaymentAction}
      addDocumentAction={addDocumentAction}
      deleteDocumentAction={deleteDocumentAction}
    />
  );
}