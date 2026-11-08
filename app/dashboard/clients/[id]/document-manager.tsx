"use client";

import { useState } from "react";
import { Download, Eye, X, FileText, Loader2, UploadCloud } from "lucide-react";
import { useLanguage } from "@/components/language-provider"; // 🟢 LE MOTEUR DE TRADUCTION

export function DocumentManager({ bookingId, documents, onUpload }: { bookingId: string, documents: any[], onUpload: (bookingId: string, name: string, fileData: string) => Promise<void> }) {
  const { t } = useLanguage(); // 🟢 INITIALISATION
  
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

      if (file.type.startsWith("image/")) {
        const img = new Image();
        img.src = base64;
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1500; // Augmenté pour une super qualité en plein écran
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
          
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
          await onUpload(bookingId, name, compressedBase64);
          setUploading(false);
          form.reset();
        };
      } else {
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
        <h2 className="text-2xl font-black text-slate-800">{t("clientDocuments")}</h2>
      </div>

      <div className="space-y-3 mb-6">
        {documents.length === 0 ? (
          <p className="text-slate-500 font-medium">{t("noDocUploaded")}</p>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-700">{doc.name}</span>
              <div className="flex gap-3">
                <button onClick={() => setPreview({ url: doc.fileUrl, type: doc.fileUrl.includes("pdf") ? "pdf" : "image", name: doc.name })} className="flex items-center gap-2 text-indigo-600 font-bold hover:underline">
                  <Eye className="w-4 h-4" /> {t("preview")}
                </button>
                <a href={doc.fileUrl} download={doc.name} className="flex items-center gap-2 text-cyan-600 font-bold hover:underline">
                  <Download className="w-4 h-4" /> {t("download")}
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleUpload} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col gap-4">
        <h4 className="font-bold text-slate-800">{t("addDocTitle")}</h4>
        <input required type="text" name="name" placeholder={t("docNamePlaceholder")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none" />
        <input required type="file" name="file" accept="image/*,application/pdf" className="text-slate-600" />
        <button type="submit" disabled={uploading} className="bg-slate-900 disabled:bg-slate-500 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2">
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
          {uploading ? t("compressAndSend") : t("uploadDocBtn")}
        </button>
      </form>

      {/* VRAI MODAL APERÇU EN PLEIN ÉCRAN */}
      {preview && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setPreview(null)} 
        >
          <button 
            onClick={() => setPreview(null)} 
            className="absolute top-6 right-6 md:top-10 md:right-10 p-3 md:p-4 bg-white/10 hover:bg-rose-500 text-white rounded-full transition-all z-50 cursor-pointer"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <div 
            className="relative w-full max-w-6xl h-full max-h-[85vh] flex items-center justify-center animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} 
          >
            {preview.type === "pdf" ? (
              <iframe src={preview.url} className="w-full h-full bg-white rounded-2xl shadow-2xl" />
            ) : (
              <img src={preview.url} alt={preview.name} className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]" />
            )}
          </div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 backdrop-blur-md text-white font-bold rounded-full">
            {preview.name}
          </div>
        </div>
      )}
    </div>
  );
}