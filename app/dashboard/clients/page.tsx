export const instant = false;
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ClientsClient from "./clients-client"; // On importe notre nouvelle interface

export default async function ClientsPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;
  
  if (!agencyId) return redirect("/login");

  // On récupère tous les clients de l'agence depuis la Base de Données
  const clients = await prisma.client.findMany({
    where: { agencyId },
    orderBy: { createdAt: "desc" }
  });

  // On les envoie au composant Client pour la traduction
  return <ClientsClient clients={clients} />;
}