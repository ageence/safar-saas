"use client";

import { Trash2 } from "lucide-react";

export function DeleteButton() {
  return (
    <button 
      type="submit" 
      onClick={(e) => {
        if (!window.confirm("🚨 Voulez-vous VRAIMENT supprimer ce voyage ? Cette action est irréversible.")) {
          e.preventDefault(); // Annule la suppression si on dit Non
        }
      }} 
      className="p-2.5 bg-white/90 hover:bg-rose-50 text-rose-500 rounded-xl shadow-lg backdrop-blur-md transition-all hover:scale-110 border border-white"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}