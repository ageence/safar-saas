import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Wallet, TrendingDown, CreditCard } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AddPaymentDialog } from "./add-payment-dialog";
import { AddExpenseDialog } from "./add-expense-dialog";

export default async function FinancesPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;

  if (!agencyId) return null;

  // 1. Récupération des données
  const payments = await prisma.payment.findMany({
    where: { agencyId },
    include: { booking: { include: { client: true, offer: true } } },
    orderBy: { createdAt: "desc" },
  });

  const expenses = await prisma.expense.findMany({
    where: { agencyId },
    orderBy: { createdAt: "desc" },
  });

  const bookings = await prisma.booking.findMany({
    where: { agencyId },
    include: { client: true, offer: true },
    orderBy: { createdAt: "desc" }
  });

  // 2. Calculs comptables
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion Financière</h1>
          <p className="text-muted-foreground">Suivez vos encaissements et vos dépenses.</p>
        </div>
        <div className="flex gap-2">
          <AddExpenseDialog />
          <AddPaymentDialog bookings={bookings} />
        </div>
      </div>

      {/* Cartes de statistiques mises à jour */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Encaissements</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {new Intl.NumberFormat("fr-DZ").format(totalRevenue)} DA
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dépenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {new Intl.NumberFormat("fr-DZ").format(totalExpenses)} DA
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bénéfice Net</CardTitle>
            <CreditCard className={`h-4 w-4 ${netProfit >= 0 ? 'text-green-500' : 'text-destructive'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-destructive'}`}>
              {netProfit > 0 ? "+" : ""}{new Intl.NumberFormat("fr-DZ").format(netProfit)} DA
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets pour séparer Entrées et Sorties */}
      <Tabs defaultValue="payments" className="w-full mt-8">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-muted/50">
          <TabsTrigger value="payments">Encaissements</TabsTrigger>
          <TabsTrigger value="expenses">Dépenses</TabsTrigger>
        </TabsList>
        
        {/* Tableau des Paiements */}
        <TabsContent value="payments" className="mt-4">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client & Réservation</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Aucun paiement enregistré.</TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium text-sm">{payment.createdAt.toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <div className="font-medium">{payment.booking.client.lastName} {payment.booking.client.firstName}</div>
                        <div className="text-xs text-muted-foreground">{payment.booking.offer.title}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.method}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        +{new Intl.NumberFormat("fr-DZ").format(payment.amount)} DA
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tableau des Dépenses */}
        <TabsContent value="expenses" className="mt-4">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Aucune dépense enregistrée.</TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium text-sm">{expense.createdAt.toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{expense.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{expense.description}</TableCell>
                      <TableCell className="text-right font-bold text-destructive">
                        -{new Intl.NumberFormat("fr-DZ").format(expense.amount)} DA
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}