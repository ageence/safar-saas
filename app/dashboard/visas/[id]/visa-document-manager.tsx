"use client";

import { useState } from "react";
import { Download, Eye, X, FileText, Loader2, UploadCloud, Video, Trash2 } from "lucide-react";

export function VisaDocumentManager({ 
  visaId, 
  documents, 
  onUpload,
  onDelete 
}: { 
  visaId: string, 
  documents: any[], 
  onUpload: (visaId: string, name: string, fileData: string) => Promise<void>,
  onDelete: (docId: string, visaId: string) => Promise<void>
}) {
  const [preview, setPreview] = useState<{ url: string, type: string, name: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
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

    // 🟢 LA SÉCURITÉ ANTI-CRASH VERCEL (Limite stricte à 2.5 Mo)
    if (file.type.startsWith("video/")) {
      if (file.size > 2.5 * 1024 * 1024) {
        alert("⚠️ VIDÉO TROP LOURDE ! \n\nPour éviter que le serveur ne plante (Erreur 500), la vidéo doit faire moins de 2.5 Mo. Veuillez la compresser sur internet (ex: compresser video mp4) ou faire une vidéo plus courte !");
        setUploading(false);
        form.reset();
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        if (file.type.startsWith("image/")) {
          const img = new Image();
          img.src = base64;
          img.onload = async () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 1500;
            let width = img.width;
            let height = img.height;
            if (width > MAX_WIDTH) { height = Math.round((height * MAX_WIDTH) / width); width = MAX_WIDTH; }
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, height);
            
            await onUpload(visaId, name, canvas.toDataURL("image/jpeg", 0.75));
            setUploading(false); form.reset();
          };
        } else {
          await onUpload(visaId, name, base64);
          setUploading(false); form.reset();
        }
      } catch (error) {
        console.error(error);
        alert("Une erreur est survenue lors de l'envoi.");
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (docId: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce fichier définitivement ?")) {
      setDeletingId(docId);
      await onDelete(docId, visaId);
      setDeletingId(null);
    }
  };

  return (
    <div className="glass-promax p-8 rounded-[2rem]">
      <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
        <div className="p-3 bg-purple-50 text-purple-500 rounded-xl"><FileText className="w-6 h-6" /></div>
        <h2 className="text-2xl font-black text-slate-800">Documents & Médias</h2>
      </div>

      <div className="space-y-3 mb-6">
        {documents.length === 0 ? (
          <p className="text-slate-500 font-medium">Aucun document uploadé.</p>
        ) : (
          documents.map((doc) => {
            const isPdf = doc.fileUrl?.includes("pdf");
            const isVideo = doc.fileUrl?.includes("video");
            const type = isPdf ? "pdf" : isVideo ? "video" : "image";
            
            return (
              <div key={doc.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-700 flex items-center gap-2">
                  {isVideo ? <Video className="w-4 h-4 text-rose-500" /> : <FileText className="w-4 h-4 text-indigo-500" />} {doc.name}
                </span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setPreview({ url: doc.fileUrl, type, name: doc.name })} className="text-indigo-600 font-bold hover:underline hidden sm:flex items-center gap-1"><Eye className="w-4 h-4" /> Aperçu</button>
                  <a href={doc.fileUrl} download={doc.name} className="text-cyan-600 font-bold hover:underline flex items-center gap-1"><Download className="w-4 h-4" /> DL</a>
                  
                  <button onClick={() => handleDelete(doc.id)} disabled={deletingId === doc.id} className="text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 ml-2 transition-all">
                    {deletingId === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleUpload} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col gap-4">
        <h4 className="font-bold text-slate-800">Ajouter (Image / PDF / Vidéo -2.5Mo)</h4>
        <input required type="text" name="name" placeholder="Nom (Ex: Vidéo présentation, Scan...)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
        <input required type="file" name="file" accept="image/*,application/pdf,video/*" className="text-slate-600" />
        <button type="submit" disabled={uploading} className="bg-slate-900 disabled:bg-slate-500 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2">
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
          {uploading ? "Upload en cours..." : "Uploader le fichier"}
        </button>
      </form>

      {/* MODAL APERÇU */}
      {preview && (
        <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8" onClick={() => setPreview(null)}>
          <button onClick={() => setPreview(null)} className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-rose-500 text-white rounded-full transition-all"><X className="w-8 h-8" /></button>
          <div className="relative w-full max-w-6xl h-full max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {preview.type === "pdf" ? (
               <iframe src={preview.url} className="w-full h-full bg-white rounded-2xl shadow-2xl" />
            ) : preview.type === "video" ? (
               <video src={preview.url} controls autoPlay className="max-w-full max-h-full rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]" />
            ) : (
               <img src={preview.url} alt={preview.name} className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}