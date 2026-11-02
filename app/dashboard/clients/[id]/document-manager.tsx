"use client";

import { useState } from "react";
import { Download, Eye, X, FileText, Loader2, UploadCloud } from "lucide-react";

export function DocumentManager({ bookingId, documents, onUpload }: { bookingId: string, documents: any[], onUpload: (bookingId: string, name: string, fileData: string) => Promise<void> }) {
  const [preview, setPreview] = useState<{ url: string, type: string, name: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
        setUploading(false);
        return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;

      // COMPRESSION MAGIQUE POUR LES IMAGES (Bypass Vercel Limit) !
      if (file.type.startsWith("image/")) {
        const img = new Image();
        img.src = base64;
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200; // Taille max idéale
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); // Qualité 70%
          await onUpload(bookingId, name, compressedBase64);
          setUploading(false);
          form.reset();
        };
      } else {
        // Si c'est un PDF, pas de compression image
        await onUpload(bookingId, name, base64);
        setUploading(false);
        form.reset();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="glass-promax p-8 rounded-[2rem]">
      <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
        <div className="p-3 bg-purple-50 text-purple-500 rounded-xl"><FileText className="w-6 h-6" /></div>
        <h2 className="text-2xl font-black text-slate-800">Documents du Client</h2>
      </div>

      {/* LISTE DES DOCUMENTS */}
      <div className="space-y-3 mb-6">
        {documents.length === 0 ? (
          <p className="text-slate-500 font-medium">Aucun document uploadé.</p>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-700">{doc.name}</span>
              <div className="flex gap-3">
                <button onClick={() => setPreview({ url: doc.fileUrl, type: doc.fileUrl.includes("pdf") ? "pdf" : "image", name: doc.name })} className="flex items-center gap-2 text-indigo-600 font-bold hover:underline">
                  <Eye className="w-4 h-4" /> Aperçu
                </button>
                <a href={doc.fileUrl} download={doc.name} className="flex items-center gap-2 text-cyan-600 font-bold hover:underline">
                  <Download className="w-4 h-4" /> DL
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FORMULAIRE D'UPLOAD */}
      <form onSubmit={handleUpload} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col gap-4">
        <h4 className="font-bold text-slate-800">Ajouter un document (Image/PDF)</h4>
        <input required type="text" name="name" placeholder="Nom (Ex: Passeport...)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none" />
        <input required type="file" name="file" accept="image/*,application/pdf" className="text-slate-600" />
        <button type="submit" disabled={uploading} className="bg-slate-900 disabled:bg-slate-500 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2">
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
          {uploading ? "Compression & Envoi..." : "Uploader le document"}
        </button>
      </form>

      {/* MODAL APERÇU EN PLEIN ÉCRAN */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-5xl flex justify-between items-center mb-4">
            <h3 className="text-white text-2xl font-black">{preview.name}</h3>
            <button onClick={() => setPreview(null)} className="p-3 bg-white/10 hover:bg-rose-500 text-white rounded-full transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="w-full max-w-5xl flex-1 bg-white rounded-2xl overflow-hidden flex items-center justify-center p-2 relative min-h-[70vh]">
            {preview.type === "pdf" ? (
              <iframe src={preview.url} className="w-full h-full min-h-[70vh] rounded-xl" />
            ) : (
              <img src={preview.url} alt={preview.name} className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-lg" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}