export const instant = false;

import prisma from "@/lib/prisma";
import { CheckCircle2, Globe, Send, Phone, Briefcase, FileText, ShieldCheck, Clock, MapPin, Plane } from "lucide-react";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function DemandeVisaPremiumPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ success?: string, error?: string }> }) {
  const { slug } = await params;
  const sParams = await searchParams;

  const offer = await prisma.visaOffer.findUnique({ where: { slug } });
  if (!offer) return notFound();

  // 🟢 LA PAGE DE SUCCÈS
  if (sParams.success === "true") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[3rem] max-w-lg w-full text-center border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-emerald-100"><CheckCircle2 className="w-14 h-14" /></div>
          <h1 className="text-4xl font-black text-slate-800 mb-4">Dossier Reçu !</h1>
          <p className="text-slate-500 font-medium mb-8 text-lg">Merci. Votre demande a été enregistrée avec succès. Un expert va analyser votre profil et vous appeler très rapidement.</p>
          <div className="inline-flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-xl"><Clock className="w-5 h-5" /> Réponse sous 24h/48h</div>
        </div>
      </div>
    );
  }

  async function submitLeadAction(formData: FormData) {
    "use server";
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const passport = formData.get("passport") as string;
    const situation = formData.get("situation") as string;
    const history = formData.get("history") as string;
    const message = formData.get("message") as string;
    
    const finalCountry = offer?.country || (formData.get("country") as string) || "Non Spécifié";
    let isSuccess = false;

    // 1. CRÉATION DU DOSSIER (Isolée pour ne pas crasher)
    try {
      const client = await prisma.client.create({
        data: { 
          firstName, lastName, phone, email: "",
          passport: passport || "NON FOURNI", 
          agencyId: offer!.agencyId,
          source: "Site Web", 
          status: "EN_ATTENTE"
        } as any
      });

      const notesPro = `[NOUVELLE DEMANDE : ${offer!.title}]\n📌 Situation : ${situation}\n✈️ Historique : ${history}\n💬 Message : ${message || "-"}`;

      await prisma.visaApplication.create({
        data: {
          clientId: client.id, agencyId: offer!.agencyId, country: finalCountry,
          status: "EN_ATTENTE", price: 0, notes: notesPro,
        } as any
      });

      isSuccess = true;
    } catch (error) { 
      console.error("Erreur Création Visa:", error); 
    }

    // 2. CRÉATION NOTIFICATION (Séparée : si elle crash, le Visa passe quand même !)
    if (isSuccess) {
      try {
        await prisma.notification.create({
          data: {
            title: "Nouveau Lead Visa 🌍",
            message: `${firstName} ${lastName} a fait une demande.`,
            type: "VISA", link: "/dashboard/visas", agencyId: offer!.agencyId,
          } as any
        });
      } catch (e) { console.error("Erreur Notification (Ignorée):", e); }
    }

    // 3. REDIRECTION GARANTIE
    if (isSuccess) {
      revalidatePath("/dashboard/visas");
      redirect(`/demande-visa/${slug}?success=true`);
    } else {
      redirect(`/demande-visa/${slug}?error=true`);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <div className="absolute top-0 w-full p-6 text-center z-0"><div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200 font-black text-slate-800 tracking-tight"><Globe className="w-5 h-5 text-indigo-600" /> Service Visa Premium</div></div>

      <div className="max-w-6xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen relative z-10">
        <div className="space-y-8 hidden lg:block">
          <h1 className="text-5xl font-black text-slate-900 leading-tight">Votre <span className="text-indigo-600">Visa</span> n'a jamais été aussi simple.</h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-md">Remplissez ce formulaire pour démarrer votre procédure <b>{offer.title}</b>.</p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-slate-100 w-full relative z-20">
          {sParams.error && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 font-bold rounded-xl text-sm text-center">Une erreur est survenue, veuillez réessayer.</div>
          )}
          <form action={submitLeadAction} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-400 uppercase">Nom</label><input required name="lastName" className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3.5 font-bold text-slate-800 outline-none" /></div>
              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-400 uppercase">Prénom</label><input required name="firstName" className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3.5 font-bold text-slate-800 outline-none" /></div>
            </div>
            <div className="space-y-1.5"><label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Téléphone</label><input required name="phone" type="tel" className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3.5 font-bold text-slate-800 outline-none" /></div>
            
            {!offer.country && (
              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Pays de destination</label><input required name="country" className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3.5 font-bold text-slate-800 outline-none" /></div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Situation</label>
                <select required name="situation" className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3.5 font-bold text-slate-800 outline-none appearance-none">
                  <option value="Salarié">Salarié(e)</option><option value="Commerçant">Commerçant / Gérant</option><option value="Étudiant">Étudiant(e)</option><option value="Retraité">Retraité(e)</option><option value="Sans profession">Sans profession</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2"><Plane className="w-3.5 h-3.5" /> Historique Visa</label>
                <select required name="history" className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3.5 font-bold text-slate-800 outline-none appearance-none">
                  <option value="Jamais voyagé">Jamais voyagé</option><option value="Déjà eu un visa">J'ai déjà eu un visa</option><option value="Refus récent">J'ai eu un refus récent</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg py-5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-3 mt-4">
              Soumettre mon dossier <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}