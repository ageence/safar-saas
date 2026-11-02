export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Wallet, Calendar, FileText, CheckCircle2, Save, Video, Link as LinkIcon, Printer } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

// Actions Serveur
async function updateVisaAction(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
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
}

async function addPaymentAction(formData: FormData) {
  "use server";
  const visaId = formData.get("visaId") as string;
  const amount = Number(formData.get("amount"));
  if (amount > 0) {
    await prisma.payment.create({
      data: { amount, agencyId: formData.get("agencyId") as string, clientId: formData.get("clientId") as string, visaId, method: "ESPÈCES" } as any
    });
    revalidatePath(`/dashboard/visas/${visaId}`);
  }
}

export default async function VisaDossierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.agencyId) return null;

  const rawVisa = await prisma.visaApplication.findUnique({
    where: { id }, include: { client: true, payments: true }
  });
  if (!rawVisa) return notFound();
  
  const visa = rawVisa as any;
  const totalPaid = visa.payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  const remaining = visa.price - totalPaid;
  const isPaid = visa.price > 0 && remaining <= 0;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 w-full max-w-7xl mx-auto pb-12">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-4">Dossier Visa {visa.country}</h1>
          <p className="text-slate-500 font-medium mt-2">Client : {visa.client?.firstName} {visa.client?.lastName}</p>
        </div>
        <div className="flex gap-3">
           <Link href="/dashboard/visas">
            <button className="px-5 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl shadow-sm hover:bg-slate-50 flex items-center gap-2"><ArrowLeft className="w-5 h-5" /> Retour</button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="space-y-8">
          <div className="glass-promax p-8 rounded-[2rem] bg-indigo-50 border-indigo-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-500 text-white rounded-xl"><User className="w-6 h-6" /></div>
              <h2 className="text-2xl font-black text-slate-800">Identité</h2>
            </div>
            
            <div className="w-32 h-32 mx-auto bg-white rounded-3xl shadow-lg border-4 border-white overflow-hidden mb-6 flex items-center justify-center text-slate-300">
               {visa.identityPhoto ? <img src={visa.identityPhoto} className="w-full h-full object-cover" /> : <User className="w-12 h-12" />}
            </div>
            
            <div className="space-y-4 text-center">
              <p className="text-xl font-black text-slate-900">{visa.client?.firstName} {visa.client?.lastName}</p>
              <p className="text-sm font-bold text-slate-500 bg-white py-2 rounded-xl border border-indigo-100">{visa.client?.phone}</p>
              <p className="text-sm font-bold text-slate-500 bg-white py-2 rounded-xl border border-indigo-100">Passeport: {visa.client?.passport || "Non renseigné"}</p>
            </div>
          </div>

          <div className="glass-promax p-6 rounded-[2rem]">
             <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><Video className="w-5 h-5 text-rose-500" /> Vidéo Client</h3>
             {visa.videoUrl ? (
               <a href={visa.videoUrl} target="_blank" className="block w-full text-center bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3 rounded-xl border border-rose-200 transition-all">Regarder la vidéo (Cloud)</a>
             ) : (
               <p className="text-sm text-slate-400 font-medium text-center">Aucun lien vidéo ajouté.</p>
             )}
          </div>
        </div>

        <div className="glass-promax p-8 rounded-[2rem]">
          <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
            <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><Calendar className="w-6 h-6" /></div>
            <h2 className="text-2xl font-black text-slate-800">Gestion & Rendez-vous</h2>
          </div>

          <form action={updateVisaAction} className="space-y-5">
            <input type="hidden" name="id" value={visa.id} />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Prix du Service (DA)</label>
                <input name="price" type="number" defaultValue={visa.price} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Statut</label>
                <select name="status" defaultValue={visa.status} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="EN_ATTENTE">En attente docs</option>
                  <option value="RNDV_PRIS">Rendez-vous pris</option>
                  <option value="EN_COURS">En traitement</option>
                  <option value="APPROUVE">Visa Approuvé ✅</option>
                  <option value="REFUSE">Visa Refusé ❌</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Date du Rendez-vous</label>
              <input name="appointmentDate" type="date" defaultValue={visa.appointmentDate ? new Date(visa.appointmentDate).toISOString().split('T')[0] : ""} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Lien du Rendez-vous (PDF / Site TLS)</label>
              <input name="appointmentLink" defaultValue={visa.appointmentLink || ""} placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Lien de la Vidéo (Drive/YouTube)</label>
              <input name="videoUrl" defaultValue={visa.videoUrl || ""} placeholder="Lien cloud de la vidéo..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Remarques & Notes</label>
              <textarea name="notes" rows={3} defaultValue={visa.notes || ""} placeholder="Manque attestation de travail..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2">
              <Save className="w-5 h-5" /> Sauvegarder les infos
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="glass-promax p-8 rounded-[2rem]">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><Wallet className="w-6 h-6" /></div>
              <h2 className="text-2xl font-black text-slate-800">Finances</h2>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-500">Prix Visa</span>
                <span className="font-black text-slate-900 text-lg">{new Intl.NumberFormat("fr-DZ").format(visa.price)} DA</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl text-emerald-700">
                <span className="font-bold">Déjà payé</span>
                <span className="font-black text-lg">{new Intl.NumberFormat("fr-DZ").format(totalPaid)} DA</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-rose-50 rounded-xl text-rose-700">
                <span className="font-bold">Reste</span>
                <span className="font-black text-xl">{new Intl.NumberFormat("fr-DZ").format(remaining > 0 ? remaining : 0)} DA</span>
              </div>
            </div>

            {!isPaid && (
              <form action={addPaymentAction} className="mt-6 border-t border-slate-200 pt-6">
                <input type="hidden" name="visaId" value={visa.id} />
                <input type="hidden" name="clientId" value={visa.clientId} />
                <input type="hidden" name="agencyId" value={visa.agencyId} />
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Nouveau versement</label>
                <div className="flex gap-2">
                  <input type="number" name="amount" required max={remaining > 0 ? remaining : undefined} placeholder="Ex: 10000" className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800" />
                  <button type="submit" className="bg-emerald-500 text-white p-3 rounded-xl shadow-md"><Plus className="w-6 h-6" /></button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}