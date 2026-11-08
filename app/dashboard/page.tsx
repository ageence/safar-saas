export const instant = false;
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;
  if (!agencyId) return null;

  const clientsCount = await prisma.client.count({ where: { agencyId } });
  const visasCount = await prisma.visaApplication.count({ where: { agencyId, status: { not: "APPROUVE" } } });
  const bookingsCount = await prisma.booking.count({ where: { agencyId } });
  
  const payments = await prisma.payment.findMany({ where: { agencyId } });
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  const rawChartData = payments.map(p => ({
    date: p.createdAt.toISOString(),
    amount: p.amount
  }));

  const recentBookings = await prisma.booking.findMany({
    where: { agencyId }, include: { client: true, offer: true }, orderBy: { createdAt: "desc" }, take: 5
  });

  return <DashboardClient 
    session={session} 
    clientsCount={clientsCount} 
    visasCount={visasCount} 
    bookingsCount={bookingsCount} 
    totalRevenue={totalRevenue} 
    rawChartData={rawChartData} 
    recentBookings={recentBookings} 
  />;
}