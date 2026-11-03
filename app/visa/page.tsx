export const instant = false;

import { Globe, CheckCircle2, ArrowRight, AlertTriangle } from "lucide-react";

export default async function PublicVisaPage({ searchParams }: { searchParams: Promise<{ success?: string, error?: string }> }) {
  const sParams = await searchParams;

  // LA PAGE "MERCI" (Après validation)
  if (sParams.success === "true") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="p-10 md:p-16 w-full max-w-xl text-center shadow-2xl bg-white rounded-[2.5rem] animate-in zoom-in-95 duration-700">
          <div className="mx-auto w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-4">Demande de Visa Reçue !</h1>
          <p className="text-slate-500 text-lg font-medium mb-8">
            Notre équipe a bien reçu vos informations. Nous allons ouvrir votre dossier et vous contacter très rapidement pour la suite de la procédure.
          </p>
          <a href="/" className="inline-flex px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg">
            Fermer la page
          </a>
        </div>
      </div>
    );
  }

  // LE FORMULAIRE POUR LE CLIENT
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2000')] bg-cover bg-center" />
      
      <div className="relative z-10 w-full max-w-lg glass-promax p-10 rounded-[2.5rem] shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border border-indigo-500/30">
            <Globe className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white">Dossier Visa</h1>
          <p className="text-slate-300 font-medium mt-2">Commencez votre procédure consulaire</p>
        </div>

        {sParams.error && (
          <div className="mb-6 p-4 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-200 text-sm font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5"/> {sParams.error}
          </div>
        )}

        {/* ON POINTE SUR L'API PURE POUR QUE CE SOIT 100% FIABLE */}
        <form action="/api/visa-apply" method="POST" className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <input required name="lastName" placeholder="Votre Nom" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            <input required name="firstName" placeholder="Votre Prénom" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <input required name="phone" type="tel" placeholder="N° de Téléphone (Ex: 0555...)" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          <input name="passport" placeholder="N° Passeport (Optionnel pour l'instant)" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          
          <div className="grid grid-cols-2 gap-4">
            <select name="country" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-indigo-500">
              <option value="France">France</option>
              <option value="Espagne">Espagne</option>
              <option value="Italie">Italie</option>
              <option value="Canada">Canada</option>
              <option value="UK">Royaume-Uni</option>
              <option value="Dubai">Dubaï</option>
            </select>
            <select name="type" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-indigo-500">
              <option value="Touristique">Touristique</option>
              <option value="Études">Études</option>
              <option value="Affaires">Affaires</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg py-4 rounded-xl shadow-lg transition-all mt-4 flex justify-center items-center gap-2">
            Ouvrir mon dossier <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}