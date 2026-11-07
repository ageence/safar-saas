export const instant = false;

import prisma from "@/lib/prisma";
import { CheckCircle2, Globe, Send, User, Phone, FileText } from "lucide-react";
import { redirect, notFound } from "next/navigation";

export default async function DemandeVisaPubliquePage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ success?: string }>
}) {
  const { slug } = await params;
  const { success } = await searchParams;

  const offer = await prisma.visaOffer.findUnique({ where: { slug } });
  if (!offer) return notFound();

  async function submitLeadAction(formData: FormData) {
    "use server";
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const passport = formData.get("passport") as string;
    const message = formData.get("message") as string;
    
    // Le pays final est celui de l'offre (s'il existe), sinon celui tapé par le client
    const finalCountry = offer?.country || (formData.get("country") as string);

    try {
      // Création du client + Dossier Visa (En attente) dans le CRM de l'agence
      const client = await prisma.client.create({
        data: { firstName, lastName, phone, passport: passport || "NON FOURNI", agencyId: offer!.agencyId } as any
      });

      await prisma.visaApplication.create({
        data: {
          clientId: client.id,
          agencyId: offer!.agencyId,
          country: finalCountry,
          status: "EN_ATTENTE", 
          price: 0,
          notes: `[LEAD: ${offer!.title}] - Message : ${message || "Aucun message"}`,
        } as any
      });

      redirect(`/demande-visa/${slug}?success=true`);
    } catch (error) { console.error(error); }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-promax-paradise flex items-center justify-center p-4">
        <div className="glass-promax p-10 rounded-[2.5rem] max-w-md w-full text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-4">Demande Reçue !</h1>
          <p className="text-slate-600 font-medium mb-8">
            Merci. Votre demande d'accompagnement pour <b>{offer.title}</b> a bien été enregistrée. Notre agence va vous contacter très vite pour ouvrir votre dossier.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-promax-paradise flex items-center justify-center p-4 py-12">
      <div className="glass-promax p-8 sm:p-10 rounded-[2.5rem] max-w-xl w-full animate-in fade-in duration-700">
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm rotate-3">
            <Globe className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">{offer.title}</h1>
          <p className="text-slate-500 font-medium">
            {offer.country ? `Procédure pour : ${offer.country}` : "Remplissez ce formulaire pour démarrer votre procédure de Visa."}
          </p>
        </div>

        <form action={submitLeadAction} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nom</label>
              <input required name="lastName" placeholder="Ex: Benali" className="w-full bg-white/80 border border-white focus:border-indigo-300 rounded-2xl px-5 py-4 font-bold text-slate-800 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Prénom</label>
              <input required name="firstName" placeholder="Ex: Karim" className="w-full bg-white/80 border border-white focus:border-indigo-300 rounded-2xl px-5 py-4 font-bold text-slate-800 outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Téléphone</label>
            <input required name="phone" type="tel" placeholder="0550 00 00 00" className="w-full bg-white/80 border border-white focus:border-indigo-300 rounded-2xl px-5 py-4 font-bold text-slate-800 outline-none" />
          </div>

          {!offer.country && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-2"><Globe className="w-3 h-3" /> Destination (Pays du Visa)</label>
              <input required name="country" placeholder="Ex: France, Espagne, Canada..." className="w-full bg-white/80 border border-white focus:border-indigo-300 rounded-2xl px-5 py-4 font-bold text-slate-800 outline-none" />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-2"><FileText className="w-3 h-3" /> N° Passeport (Optionnel)</label>
            <input name="passport" placeholder="Laissez vide si vous ne l'avez pas" className="w-full bg-white/80 border border-white focus:border-indigo-300 rounded-2xl px-5 py-4 font-bold text-slate-800 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Message (Optionnel)</label>
            <textarea name="message" rows={3} placeholder="Avez-vous une situation particulière ?" className="w-full bg-white/80 border border-white focus:border-indigo-300 rounded-2xl px-5 py-4 font-bold text-slate-800 outline-none resize-none" />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all flex justify-center items-center gap-2 mt-4">
            <Send className="w-5 h-5" /> Envoyer ma demande
          </button>
        </form>
      </div>
    </div>
  );
}