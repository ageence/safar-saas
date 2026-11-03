export const instant = false;

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PrintButton } from "@/app/dashboard/clients/[id]/recu/print-button";

export const metadata = { title: "Reçu Visa - SAFAR PRO" };

export default async function VisaReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const rawVisa = await prisma.visaApplication.findUnique({
    where: { id }, include: { client: true, agency: true, payments: true }
  });
  if (!rawVisa) return notFound();
  
  const visa = rawVisa as any;
  const totalPaid = visa.payments.reduce((acc: number, p: any) => acc + (p.amount || 0), 0);
  const totalPrice = visa.price || 0;
  const remaining = totalPrice - totalPaid;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 0; size: auto; }
          body { margin: 1cm; background-color: white !important; }
          body * { visibility: hidden; }
          #zone-impression, #zone-impression * { visibility: visible; }
          #zone-impression { position: absolute; left: 0; top: 0; width: 100%; padding: 0 !important; box-shadow: none !important; }
          .boutons-action { display: none !important; }
        }
      `}} />

      <div className="min-h-screen bg-slate-100 py-10 text-slate-800 font-sans">
        <div className="boutons-action max-w-[800px] mx-auto mb-6 flex justify-between items-center">
          <Link href={`/dashboard/visas/${id}`}>
            <button className="px-5 py-2.5 bg-white border border-slate-200 font-bold rounded-xl shadow-sm hover:bg-slate-50 flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Retour</button>
          </Link>
          <PrintButton />
        </div>

        <div id="zone-impression" className="max-w-[800px] mx-auto bg-white p-12 md:p-16 shadow-2xl">
          <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
            <div>
              <h1 className="text-4xl font-black text-indigo-600 tracking-tighter">{visa.agency?.name || "AGENCE"}</h1>
              <p className="text-slate-500 font-medium mt-1">Agence de Tourisme et de Voyages</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-black text-slate-800 uppercase tracking-widest">Reçu Visa</h2>
              <p className="text-slate-500 font-bold mt-1">Réf: #{id.slice(-6).toUpperCase()}</p>
              <p className="text-slate-500 font-bold">Date: {new Date().toLocaleDateString("fr-FR")}</p>
            </div>
          </div>

          <div className="flex justify-between mb-12">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Reçu de :</p>
              <p className="text-xl font-black text-slate-800">{visa.client?.firstName} {visa.client?.lastName}</p>
              <p className="text-slate-600 font-medium">{visa.client?.phone} / Passeport: {visa.client?.passport || "N/A"}</p>
            </div>
            <div className="text-right bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Détails de la demande :</p>
              <p className="text-lg font-black text-slate-800">Dossier Visa - {visa.country}</p>
              <p className="text-slate-600 font-medium">Type : {visa.type || "Touristique"}</p>
            </div>
          </div>

          <div className="mb-12">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-slate-800 text-slate-800 text-sm uppercase tracking-widest">
                  <th className="py-3 font-black">Description</th>
                  <th className="py-3 font-black text-right">Montant Payé</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-5">
                    <p className="font-bold text-slate-800">Frais de traitement Visa</p>
                    <p className="text-sm text-slate-500">Montant total du service : {new Intl.NumberFormat("fr-DZ").format(totalPrice)} DA</p>
                  </td>
                  <td className="py-5 text-right font-black text-xl text-slate-800">{new Intl.NumberFormat("fr-DZ").format(totalPaid)} DA</td>
                </tr>
              </tbody>
            </table>
            <div className="text-right mt-4">
              <p className="text-sm font-bold text-slate-500">Reste à payer : <span className="text-rose-500">{new Intl.NumberFormat("fr-DZ").format(remaining > 0 ? remaining : 0)} DA</span></p>
            </div>
          </div>

          <div className="mt-20 flex justify-between items-end">
            <div className="text-center"><p className="font-bold text-slate-500 mb-16">Signature du Client</p><div className="w-40 border-b border-slate-300 mx-auto"></div></div>
            <div className="text-center"><p className="font-bold text-slate-500 mb-16">Cachet et Signature de l'Agence</p><div className="w-48 border-b border-slate-300 mx-auto"></div></div>
          </div>
        </div>
      </div>
    </>
  );
}