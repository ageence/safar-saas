export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Globe, Plus, Link as LinkIcon, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

async function createOfferAction(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.agencyId) return;

  const title = formData.get("title") as string;
  const country = formData.get("country") as string;
  
  // Générer un lien unique et beau (Slug) avec le nom de l'agence
  const agencyName = (session.user.name || "agence").toLowerCase().replace(/[^a-z0-9]/g, '-');
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const slug = `${agencyName}-${cleanTitle}-${Math.floor(Math.random() * 1000)}`;

  await prisma.visaOffer.create({
    data: {
      title,
      country: country || null, // Si vide, ça devient null
      slug,
      agencyId: session.user.agencyId
    } as any
  });
  revalidatePath("/dashboard/offres");
}

async function deleteOfferAction(id: string) {
  "use server";
  await prisma.visaOffer.delete({ where: { id } });
  revalidatePath("/dashboard/offres");
}

export default async function OffresPage() {
  const session = await auth();
  if (!session?.user?.agencyId) return null;

  const offres = await prisma.visaOffer.findMany({
    where: { agencyId: session.user.agencyId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 w-full max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-4">Offres & Liens Publics</h1>
        <p className="text-slate-500 font-medium mt-2">Créez des pages spécifiques pour vos campagnes sur les réseaux sociaux.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire de création */}
        <div className="glass-promax p-8 rounded-[2rem] h-fit">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl"><Plus className="w-6 h-6" /></div>
            <h2 className="text-2xl font-black text-slate-800">Nouvelle Offre</h2>
          </div>
          
          <form action={createOfferAction} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Titre de l'offre (Ex: Visa Étude)</label>
              <input required name="title" placeholder="Visa Touristique, Visa Étude..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Pays Cible (Optionnel)</label>
              <input name="country" placeholder="Ex: France (Laissez vide pour choix libre)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 outline-none" />
              <p className="text-xs text-slate-400 mt-1">Si vide, le client choisira lui-même le pays.</p>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all mt-4 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Créer l'offre
            </button>
          </form>
        </div>

        {/* Liste des offres */}
        <div className="lg:col-span-2 space-y-4">
          {offres.map((offre: any) => (
            <div key={offre.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-all">
              <div>
                <h3 className="font-black text-xl text-slate-800">{offre.title}</h3>
                <p className="text-slate-500 font-medium">Pays : {offre.country ? <span className="text-indigo-600 font-bold">{offre.country}</span> : "Choix libre par le client"}</p>
                <div className="mt-3 bg-slate-100 p-2 rounded-lg text-sm text-slate-600 font-mono select-all overflow-hidden break-all flex items-center gap-2 border border-slate-200">
                  <Globe className="w-4 h-4 flex-shrink-0" /> https://safar-saas.vercel.app/offre/{offre.slug}
                </div>
              </div>
              <form action={deleteOfferAction.bind(null, offre.id)}>
                <button type="submit" className="p-3 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all font-bold">
                  <Trash2 className="w-5 h-5" />
                </button>
              </form>
            </div>
          ))}
          {offres.length === 0 && (
            <div className="p-12 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-2xl">
              Aucune offre créée. Créez votre premier lien public !
            </div>
          )}
        </div>
      </div>
    </div>
  );
}