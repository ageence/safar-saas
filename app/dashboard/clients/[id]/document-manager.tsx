"use client";

import { useState } from "react";
import { FolderOpen, UploadCloud, File as FileIcon, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider"; // 🟢 LE MOTEUR DE LANGUES

// Compression d'image (Intact)
import imageCompression from "browser-image-compression";

export function DocumentManager({ bookingId, documents, onUpload }: { bookingId: string, documents: any[], onUpload: any }) {
  const { t } = useLanguage(); // 🟢 INITIALISATION
  
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  // Fonction de compression (Intacte)
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);

    try {
      let finalFileUrl = "";

      if (file.type.startsWith("image/")) {
        const options = { maxSizeMB: 0.1, maxWidthOrHeight: 1200, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        finalFileUrl = await fileToDataUrl(compressedFile);
      } else if (file.type === "application/pdf") {
        if (file.size > 2 * 1024 * 1024) {
          alert("Le PDF est trop volumineux (Max 2Mo)");
          setIsUploading(false);
          return;
        }
        finalFileUrl = await fileToDataUrl(file);
      } else {
        alert("Format non supporté (Images ou PDF uniquement)");
        setIsUploading(false);
        return;
      }

      await onUpload(bookingId, file.name, finalFileUrl);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <div className="glass-promax p-8 rounded-[2rem]">
        <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
          <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl"><FolderOpen className="w-6 h-6" /></div>
          {/* 🟢 TRADUCTION DU TITRE */}
          <h2 className="text-2xl font-black text-slate-800">{t("clientDocuments")}</h2>
        </div>

        {/* 🟢 ZONE DE DRAG & DROP TRADUITE */}
        <div 
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all relative overflow-hidden mb-6 ${dragActive ? 'border-cyan-500 bg-cyan-50 scale-[1.02]' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]); }}
        >
          <input type="file" accept="image/*,application/pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); }} />
          <UploadCloud className={`w-10 h-10 mx-auto mb-3 transition-colors ${dragActive ? 'text-cyan-500' : 'text-slate-400'}`} />
          <p className="text-sm font-bold text-slate-600">
            {isUploading ? (
              <span className="text-cyan-500 flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500"></span> 
                {/* Traduction implicite pour le chargement, mais on peut laisser "Upload..." ou utiliser {t("uploadFile")} */}
                Uploading...
              </span>
            ) : dragActive ? t("dragToUpload") : t("dropFileHere")}
          </p>
          <p className="text-xs text-slate-400 font-medium mt-1">{t("fileLimit")}</p>
        </div>

        {/* 🟢 LISTE DES DOCUMENTS TRADUITE */}
        <div className="space-y-3">
          {documents.length === 0 ? (
            <p className="text-sm font-bold text-slate-400 text-center py-4">{t("noDocuments")}</p>
          ) : (
            documents.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-cyan-300 transition-all">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><FileIcon className="w-5 h-5" /></div>
                  <span className="text-sm font-bold text-slate-700 truncate">{doc.name}</span>
                </div>
                <button onClick={() => setPreviewDoc(doc.fileUrl)} className="text-xs font-black uppercase text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-lg hover:bg-cyan-100 transition-colors">
                  {t("openFile")}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* LIGHTBOX / APERÇU (Ne nécessite pas de traduction particulière) */}
      {previewDoc && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300">
          <button onClick={() => setPreviewDoc(null)} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-rose-500 text-white rounded-full transition-all backdrop-blur-md">
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative w-full max-w-4xl max-h-full rounded-2xl overflow-hidden bg-slate-900 shadow-2xl flex items-center justify-center">
            {previewDoc.startsWith("data:application/pdf") ? (
              <iframe src={previewDoc} className="w-full h-[85vh] bg-white rounded-xl" title="Aperçu PDF" />
            ) : (
              <img src={previewDoc} alt="Aperçu" className="max-w-full max-h-[85vh] object-contain rounded-xl" />
            )}
          </div>
        </div>
      )}
    </>
  );
}