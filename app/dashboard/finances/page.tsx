export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";

export default async function FinancesPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;
  if (!agencyId) return null;

  // 1. Récupérer tous les paiements (Entrées d'argent)
  const rawPayments = await prisma.payment.findMany({
    where: { agencyId },
    include: { booking: { include: { client: true, offer: true } } },
    orderBy: { createdAt: "desc" },
  });

  // 2. Récupérer toutes les dépenses (Sorties d'argent)
  const rawExpenses = await prisma.expense.findMany({
    where: { agencyId },
    orderBy: { createdAt: "desc" },
  });

  // On force le type "as any[]" pour faire taire TypeScript définitivement
  const payments = rawPayments as any[];
  const expenses = rawExpenses as any[];

  // Calcul des totaux de la caisse
  const totalIncome = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const totalExpense = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10">
      
      {/* HEADER VIP */}
      <div className="glass-promax p-8 rounded-[2rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-2xl shadow-lg shadow-teal-500/20 text-white animate-float">
            <Wallet className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tighter">Gestion <span className="text-emerald-500">Financière</span></h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Caisse, paiements des clients et dépenses.</p>
          </div>
        </div>
      </div>

      {/* CARTES STATISTIQUES (Bénéfices et Dépenses) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Revenus */}
        <div className="glass-promax p-6 rounded-[2rem] border-l-4 border-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Encaissements</p>
              <p className="text-3xl font-black text-slate-800 mt-2">{new Intl.NumberFormat("fr-DZ").format(totalIncome)} <span className="text-sm text-slate-500">DA</span></p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><TrendingUp className="w-5 h-5" /></div>
          </div>
        </div>
        
        {/* Total Dépenses */}
        <div className="glass-promax p-6 rounded-[2rem] border-l-4 border-rose-500">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Dépenses</p>
              <p className="text-3xl font-black text-slate-800 mt-2">{new Intl.NumberFormat("fr-DZ").format(totalExpense)} <span className="text-sm text-slate-500">DA</span></p>
            </div>
            <div className="p-3 bg-rose-50 text-rose-500 rounded-xl"><TrendingDown className="w-5 h-5" /></div>
          </div>
        </div>

        {/* Solde (Bénéfice Net) */}
        <div className="glass-promax p-6 rounded-[2rem] border-l-4 border-cyan-500">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bénéfice Net</p>
              <p className="text-3xl font-black text-slate-800 mt-2">{new Intl.NumberFormat("fr-DZ").format(netBalance)} <span className="text-sm text-slate-500">DA</span></p>
            </div>
            <div className="p-3 bg-cyan-50 text-cyan-500 rounded-xl"><Wallet className="w-5 h-5" /></div>
          </div>
        </div>
      </div>

      {/* TABLEAU DES PAIEMENTS CLIENTS */}
      <div className="glass-promax rounded-[2rem] p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Historique des Paiements (Clients)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-widest">
                <th className="pb-4 font-bold">Date</th>
                <th className="pb-4 font-bold">Client</th>
                <th className="pb-4 font-bold">Voyage</th>
                <th className="pb-4 font-bold text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.length === 0 ? (
                <tr><td colSpan={4} className="py-10 text-center text-slate-400 font-medium">Aucun paiement enregistré pour le moment.</td></tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-slate-500 font-medium">{new Date(payment.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td className="py-4">
                      <span className="font-extrabold text-slate-800">
                        {/* VOILÀ LE CORRECTIF : Les points d'interrogation (?) pour sécuriser TypeScript */}
                        {payment.booking?.client?.firstName || "Client"} {payment.booking?.client?.lastName || "Inconnu"}
                      </span>
                    </td>
                    <td className="py-4 text-slate-600 font-medium">
                      {payment.booking?.offer?.title || "Voyage non spécifié"}
                    </td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center gap-1 font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                        <ArrowUpRight className="w-4 h-4" /> {new Intl.NumberFormat("fr-DZ").format(payment.amount)} DA
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}