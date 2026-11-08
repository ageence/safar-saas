import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import SettingsClient from "./settings-client"; // On importe l'interface traduite

export default async function SettingsPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;

  if (!agencyId) return redirect("/login");

  const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
  const team = await prisma.user.findMany({ where: { agencyId } });
  const isAdmin = session?.user?.role === "AGENCY_ADMIN";

  // On envoie les données à notre composant Client qui gère la traduction
  return <SettingsClient agency={agency} team={team} isAdmin={isAdmin} />;
}