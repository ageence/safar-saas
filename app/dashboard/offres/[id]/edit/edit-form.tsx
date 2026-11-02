"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function EditOfferForm({ offer }: { offer: any }) {
  // On charge l'ancienne image s'il y en a une !
  const [preview, setPreview] = useState<string | null>(offer.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Formatage des dates pour l'input HTML (YYYY-MM-DD)
  const formatDate = (date: Date | string) => {
    if (!date) return "";
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 w-full max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900">Modifier l'Offre</h1>
          <p className="text-slate-500 font-medium mt-2">Mettez à jour les détails de ce voyage.</p>
        </div>
        <Link href="/dashboard/offres">
          <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 bg-white shadow-sm hover:bg-slate-50">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au catalogue
          </Button>
        </Link>
      </div>

      <div className="glass-promax rounded-[2rem] p-0 overflow-hidden shadow-2xl">
        <form className="p-8 md:p-10 space-y-8" action="/api/offers/update" method="POST">
          <input type="hidden" name="id" value={offer.id} />

          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nouvelle Affiche (Upload)</label>
            {preview ? (
              <div className="relative w-full h-64 rounded-[2rem] overflow-hidden border-4 border-cyan-500 shadow-lg group">
                <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <Button type="button" variant="destructive" className="rounded-xl font-bold px-6 h-12" onClick={() => setPreview(null)}>
                    <X className="mr-2 h-5 w-5" /> Retirer la photo
                  </Button>
                </div>
                <input type="hidden" name="imageUrl" value={preview} />
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} className="w-full h-64 rounded-[2rem] border-2 border-dashed border-slate-300 hover:border-cyan-500 hover:bg-cyan-50/50 transition-all flex flex-col items-center justify-center cursor-pointer group bg-slate-50/50">
                <div className="p-5 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-all mb-4">
                  <UploadCloud className="h-10 w-10 text-cyan-500" />
                </div>
                <p className="text-lg font-black text-slate-700">Mettre à jour l'image</p>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Titre du voyage</label>
              {/* Utilisation de defaultValue pour pré-remplir */}
              <input required name="title" defaultValue={offer.title} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all hover:bg-white" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Destination</label>
              <input required name="destination" defaultValue={offer.destination} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all hover:bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date Départ</label>
              <input required type="date" name="dateDepart" defaultValue={formatDate(offer.startDate)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date Retour</label>
              <input required type="date" name="dateRetour" defaultValue={formatDate(offer.endDate)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Places Dispo</label>
              <input required type="number" name="totalSeats" defaultValue={offer.totalSpots} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prix (DA)</label>
              <input required name="price" type="number" defaultValue={offer.price} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all hover:bg-white" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catégorie</label>
              <select required name="type" defaultValue={offer.type} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all hover:bg-white cursor-pointer">
                <option value="VOYAGE">Voyage Organisé</option>
                <option value="OMRA">Omra</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black h-16 rounded-2xl text-xl mt-8 shadow-[0_10px_30px_rgba(14,165,233,0.3)] hover:-translate-y-1 transition-all">
            <Save className="mr-3 h-6 w-6" /> Sauvegarder les modifications
          </Button>
        </form>
      </div>
    </div>
  );
}