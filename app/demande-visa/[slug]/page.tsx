export const instant = false;

import prisma from "@/lib/prisma";
import { CheckCircle2, Globe, Send, User, Phone, Briefcase, FileText, ShieldCheck, Clock, MapPin, Plane } from "lucide-react";
import { redirect, notFound } from "next/navigation";

export default async function DemandeVisaPremiumPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ success?: string }>
}) {
  const { slug } = await params;
  const { success } = await searchParams;

  // 🟢 CORRECTION : On a enlevé le "include: { agency: true }" pour éviter l'erreur TypeScript
  const offer = await prisma.visaOffer.findUnique({ where: { slug } });
  if (!offer) return notFound();

  async function submitLeadAction(formData: FormData) {
    "use server";
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const passport = formData.get("passport") as string;
    
    const situation = formData.get("situation") as string;
    const history = formData.get("history") as string;
    const message = formData.get("message") as string;
    
    const finalCountry = offer?.country || (formData.get("country") as string);

    try {
      const client = await prisma.client.create({
        data: { firstName, lastName, phone, passport: passport || "NON FOURNI", agencyId: offer!.agencyId } as any
      });

      const notesPro = `[NOUVELLE DEMANDE EN LIGNE : ${offer!.title}]
      📌 Situation : ${situation}
      ✈️ Historique de voyage : ${history}
      💬 Message : ${message || "Aucun message particulier."}`;

      await prisma.visaApplication.create({
        data: {
          clientId: client.id,
          agencyId: offer!.agencyId,
          country: finalCountry,
          status: "EN_ATTENTE", 
          price: 0,
          notes: notesPro,
        } as any
      });

      redirect(`/demande-visa/${slug}?success=true`);
    } catch (error) { console.error(error); }
  }

  // ÉCRAN DE SUCCÈS
  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[3rem] max-w-lg w-full text-center border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-emerald-100">
            <CheckCircle2 className="w-14 h-14" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-4">Dossier Reçu !</h1>
          <p className="text-slate-500 font-medium mb-8 text-lg">
            Merci. Votre demande a été enregistrée avec succès. Un expert de <b>notre agence</b> va analyser votre profil et vous appeler très rapidement.
          </p>
          <div className="inline-flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-xl">
            <Clock className="w-5 h-5" /> Réponse sous 24h/48h
          </div>
        </div>
      </div>
    );
  }

  // ÉCRAN DU FORMULAIRE PREMIUM
  return (
    <div className="min-h-screen bg-slate-50 relative">
      <div className="absolute top-0 w-full p-6 text-center z-0">
        <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200 font-black text-slate-800 tracking-tight">
          <Globe className="w-5 h-5 text-indigo-600" /> Service Visa Premium
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen relative z-10">
        
        <div className="space-y-8 hidden lg:block">
          <h1 className="text-5xl font-black text-slate-900 leading-tight">
            Votre <span className="text-indigo-600">Visa</span> n'a jamais été aussi simple.
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-md">
            Remplissez ce formulaire pour démarrer votre procédure <b>{offer.title}</b>. Notre équipe s'occupe de tout le reste.
          </p>

          <div className="space-y-6 mt-12">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white shadow-md rounded-2xl text-emerald-500"><ShieldCheck className="w-7 h-7" /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Analyse Gratuite</h3>
                <p className="text-slate-500">Nous étudions vos chances de réussite avant de commencer.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white shadow-md rounded-2xl text-indigo-500"><FileText className="w-7 h-7" /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Dossier Blindé</h3>
                <p className="text-slate-500">Accompagnement complet pour une demande solide.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-slate-100 w-full relative z-20">
          <div className="mb-8 lg:hidden text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-2">{offer.title}</h2>
            <p className="text-slate-500 font-medium">L'étude de votre profil est rapide et sécurisée.</p>
          </div>

          <form action={submitLeadAction} className="space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nom</label>
                <input required name="lastName" placeholder="Ex: Benali" className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3.5 font-bold text-slate-800 outline-none transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prénom</label>
                <input required name="firstName" placeholder="Ex: Amine" className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3.5 font-bold text-slate-800 outline-none transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Téléphone</label>
              <input required name="phone" type="tel" placeholder="0555 00 00 00" className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3.5 font-bold text-slate-800 outline-none transition-colors" />
            </div>

            {!offer.country && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Pays de destination</label>
                <input required name="country" placeholder="Ex: France, Espagne..." className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3.5 font-bold text-slate-800 outline-none transition-colors" />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Situation</label>
                <select required name="situation" className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3.5 font-bold text-slate-800 outline-none transition-colors appearance-none">
                  <option value="Salarié">Salarié(e)</option>
                  <option value="Commerçant / Gérant">Commerçant / Gérant</option>
                  <option value="Étudiant">Étudiant(e)</option>
                  <option value="Retraité">Retraité(e)</option>
                  <option value="Sans profession">Sans profession</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Plane className="w-3.5 h-3.5" /> Historique Visa</label>
                <select required name="history" className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3.5 font-bold text-slate-800 outline-none transition-colors appearance-none">
                  <option value="Jamais voyagé">Jamais voyagé</option>
                  <option value="Déjà eu un visa">J'ai déjà eu un visa</option>
                  <option value="Refus récent">J'ai eu un refus récent</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Informations supplémentaires (Optionnel)</label>
              <textarea name="message" rows={2} placeholder="Précisez votre situation..." className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3.5 font-bold text-slate-800 outline-none transition-colors resize-none" />
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg py-5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex justify-center items-center gap-3 mt-4 hover:-translate-y-1">
              Soumettre mon dossier <Send className="w-5 h-5" />
            </button>
            
            <p className="text-center text-xs text-slate-400 font-bold mt-4 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Vos données sont sécurisées.
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}