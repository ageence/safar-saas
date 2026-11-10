"use client";

import { useState } from "react";
import { Download, Eye, X, FileText, Loader2, UploadCloud, Video, Trash2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider"; // 🟢 MOTEUR DE TRADUCTION

export function VisaDocumentManager({ 
  visaId, 
  documents, 
  onUpload,
  onDelete 
}: { 
  visaId: string, 
  documents: any[], 
  onUpload: (formData: FormData) => Promise<void>,
  onDelete: (docId: string, visaId: string) => Promise<void>
}) {
  const { t } = useLanguage(); // 🟢 INITIALISATION
  
  const [preview, setPreview] = useState<{ url: string, type: string, name: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      setUploading(false);
      return;
    }

    if (file.size > 4.5 * 1024 * 1024) {
      alert(t("alertFileTooBig")); // 🟢 TRADUIT
      setUploading(false);
      form.reset();
      return;
    }

    try {
      formData.append("visaId", visaId);
      
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = async () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 1200; 
            let width = img.width;
            let height = img.height;
            if (width > MAX_WIDTH) { height = Math.round((height * MAX_WIDTH) / width); width = MAX_WIDTH; }
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, height);
            
            formData.set("file", canvas.toDataURL("image/jpeg", 0.75)); 
            await onUpload(formData);
            setUploading(false);
            form.reset();
          };
        };
        reader.readAsDataURL(file);
      } else {
        await onUpload(formData);
        setUploading(false);
        form.reset();
      }
    } catch (error: any) {
      console.error("Upload Error: ", error);
      alert(t("errorConnection")); // 🟢 TRADUIT
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (confirm(t("confirmDeleteDoc"))) { // 🟢 TRADUIT
      setDeletingId(docId);
      await onDelete(docId, visaId);
      setDeletingId(null);
    }
  };

  const getFileType = (url: string, fileName: string) => {
    if (!url) return "image";
    const strUrl = url.substring(0, 50).toLowerCase(); 
    const strName = (fileName || "").toLowerCase();
    
    if (strUrl.includes("pdf") || strName.endsWith(".pdf") || strUrl.includes("application/pdf")) return "pdf";
    if (
      strUrl.includes("video") || 
      strUrl.includes("mp4") || 
      strName.endsWith(".mp4") || 
      strName.endsWith(".mov") || 
      strName.endsWith(".avi") ||
      strName.includes("vid") ||
      strName.includes("cam")
    ) {
      return "video";
    }
    
    return "image";
  };

  return (
    <div className="glass-promax p-8 rounded-[2rem]">
      <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
        <div className="p-3 bg-purple-50 text-purple-500 rounded-xl"><FileText className="w-6 h-6" /></div>
        <h2 className="text-2xl font-black text-slate-800">{t("documentsAndMedia")}</h2>
      </div>

      <div className="space-y-3 mb-6">
        {documents.length === 0 ? (
          <p className="text-slate-500 font-medium">{t("noDocUploaded")}</p>
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
                  <button onClick={() => setPreview({ url: doc.fileUrl, type, name: doc.name })} className="text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 flex items-center gap-1 transition-all"><Eye className="w-4 h-4" /> {t("preview")}</button>
                  <a href={doc.fileUrl} download={doc.name} className="text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-lg font-bold hover:bg-cyan-100 flex items-center gap-1 transition-all"><Download className="w-4 h-4" /> {t("download")}</a>
                  
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
        <h4 className="font-bold text-slate-800">{t("addDocVideoTitle")}</h4>
        <input required type="text" name="name" placeholder={t("docNamePlaceholder")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
        <input required type="file" name="file" accept="image/*,application/pdf,video/*" className="text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
        <button type="submit" disabled={uploading} className="bg-slate-900 disabled:bg-slate-500 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2">
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
          {uploading ? t("sendingWait") : t("uploadDocBtn")}
        </button>
      </form>

      {/* MODAL APERÇU INTACT (Avec le key={preview.url} pour fixer la vidéo) */}
      {preview && (
        <div 
          className="fixed inset-0 z-[1000] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-12" 
          onClick={() => setPreview(null)}
        >
          <button 
            onClick={() => setPreview(null)} 
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 bg-white/10 hover:bg-rose-500 text-white rounded-full transition-all z-50"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div 
            className="w-full h-full flex flex-col items-center justify-center" 
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-bold text-xl mb-4 text-center z-50">{preview.name}</h3>
            
            <div className="w-full flex-1 max-h-[80vh] flex items-center justify-center relative overflow-hidden">
              {preview.type === "pdf" && (
                 <iframe key={preview.url} src={preview.url} className="w-full h-full bg-white rounded-xl shadow-2xl" />
              )}
              {preview.type === "video" && (
                 <video 
                    key={preview.url} 
                    src={preview.url} 
                    controls 
                    playsInline 
                    autoPlay
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl bg-black" 
                 />
              )}
              {preview.type === "image" && (
                 <img 
                    key={preview.url} 
                    src={preview.url} 
                    alt={preview.name} 
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" 
                 />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}