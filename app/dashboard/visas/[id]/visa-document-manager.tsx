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

    // 🟢 LA VRAIE SÉCURITÉ VERCEL (1.8 Mo MAX pour les vidéos)
    // Au-delà, le Base64 va dépasser les 4.5Mo autorisés par Vercel et couper le serveur.
    if (file.type.startsWith("video/")) {
      const MAX_VIDEO_SIZE = 1.8 * 1024 * 1024; // 1.8 Mo
      if (file.size > MAX_VIDEO_SIZE) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        alert(`⚠️ VIDÉO TROP LOURDE ! (${sizeMb} Mo)\n\nVercel bloque strictement les gros fichiers (Erreur connexion).\nLa vidéo doit faire moins de 1.8 Mo. \n👉 Compressez-la sur internet ou prenez une vidéo plus courte.`);
        setUploading(false);
        form.reset();
        return;
      }
    } else {
      // Pour PDF et Images
      if (file.size > 4 * 1024 * 1024) {
        alert("⚠️ Le fichier est trop lourd (Max 4 Mo).");
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
            const MAX_WIDTH = 1200;
            let width = img.width;
            let height = img.height;
            if (width > MAX_WIDTH) { height = Math.round((height * MAX_WIDTH) / width); width = MAX_WIDTH; }
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, height);
            
            await onUpload(visaId, name, canvas.toDataURL("image/jpeg", 0.70));
            setUploading(false); form.reset();
          };
        } else {
          await onUpload(visaId, name, base64);
          setUploading(false); form.reset();
        }
      } catch (error) {
        console.error("Upload Error: ", error);
        alert("❌ Erreur : Le fichier n'a pas pu être envoyé. Vérifiez votre connexion.");
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

  // 🔴 CORRECTION DE L'APERÇU : On vérifie aussi l'extension du nom !
  const getFileType = (url: string, fileName: string) => {
    if (!url) return "image";
    const lowerUrl = url.toLowerCase();
    const lowerName = (fileName || "").toLowerCase();
    
    if (lowerUrl.includes("pdf") || lowerName.endsWith(".pdf")) return "pdf";
    if (lowerUrl.includes("video") || lowerName.endsWith(".mp4") || lowerName.endsWith(".mov") || lowerName.endsWith(".avi") || lowerName.endsWith(".webm")) return "video";
    
    return "image";
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
            const type = getFileType(doc.fileUrl, doc.name);
            
            return (
              <div key={doc.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 rounded-xl border border-slate-100 gap-3 hover:bg-slate-100 transition-colors">
                <span className="font-bold text-slate-700 flex items-center gap-2 truncate max-w-full">
                  {type === "video" ? <Video className="w-5 h-5 text-rose-500 flex-shrink-0" /> : <FileText className="w-5 h-5 text-indigo-500 flex-shrink-0" />} 
                  <span className="truncate">{doc.name}</span>
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button onClick={() => setPreview({ url: doc.fileUrl, type, name: doc.name })} className="text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 flex items-center gap-1 transition-all"><Eye className="w-4 h-4" /> Aperçu</button>
                  <a href={doc.fileUrl} download={doc.name} className="text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-lg font-bold hover:bg-cyan-100 flex items-center gap-1 transition-all"><Download className="w-4 h-4" /> DL</a>
                  
                  <button onClick={() => handleDelete(doc.id)} disabled={deletingId === doc.id} className="text-rose-500 bg-rose-50 p-2 rounded-lg hover:bg-rose-100 font-bold flex items-center transition-all ml-1">
                    {deletingId === doc.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleUpload} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col gap-4">
        <h4 className="font-bold text-slate-800">Ajouter (Image / PDF / Vidéo max 1.8 Mo)</h4>
        <input required type="text" name="name" placeholder="Nom du fichier (Ex: Passeport, Vidéo...)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
        <input required type="file" name="file" accept="image/*,application/pdf,video/*" className="text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
        <button type="submit" disabled={uploading} className="bg-slate-900 disabled:bg-slate-500 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2">
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
          {uploading ? "Envoi en cours..." : "Uploader le fichier"}
        </button>
      </form>

      {/* MODAL APERÇU SÉCURISÉ */}
      {preview && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8" onClick={() => setPreview(null)}>
          <button onClick={() => setPreview(null)} className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-white/10 hover:bg-rose-500 text-white rounded-full transition-all"><X className="w-6 h-6 md:w-8 md:h-8" /></button>
          
          <div className="relative w-full max-w-5xl h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white font-bold text-xl mb-4 truncate w-full text-center">{preview.name}</h3>
            
            <div className="w-full h-full max-h-[80vh] flex items-center justify-center bg-black/40 rounded-3xl p-2 md:p-4 overflow-hidden border border-white/10 shadow-2xl">
              {preview.type === "pdf" ? (
                 <iframe src={preview.url} className="w-full h-full bg-white rounded-2xl" />
              ) : preview.type === "video" ? (
                 <video 
                    src={preview.url} 
                    controls 
                    playsInline 
                    autoPlay 
                    className="w-full h-full max-h-[75vh] object-contain rounded-2xl bg-black" 
                 />
              ) : (
                 <img 
                    src={preview.url} 
                    alt={preview.name} 
                    className="max-w-full max-h-[75vh] object-contain rounded-2xl" 
                 />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}