"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all">
      <Printer className="w-5 h-5" /> Imprimer / PDF
    </button>
  );
}