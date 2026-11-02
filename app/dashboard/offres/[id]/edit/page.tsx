import prisma from "@/lib/prisma";
import { EditOfferForm } from "./edit-form";
import { notFound } from "next/navigation";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // On récupère l'ancienne offre avec toutes ses infos
  const offerData = await prisma.offer.findUnique({ where: { id } });
  
  if (!offerData) return notFound();

  // On passe les données au formulaire (as any pour éviter les erreurs TS de Prisma)
  return <EditOfferForm offer={offerData as any} />;
}