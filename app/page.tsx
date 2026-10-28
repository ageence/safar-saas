import { Plane } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="flex items-center gap-4 mb-8">
        <Plane className="w-12 h-12 text-primary" />
        <h1 className="text-4xl font-bold text-foreground">Safar SaaS</h1>
      </div>
      <p className="text-muted-foreground text-lg mb-8">
        Plateforme de gestion pour agences de voyages en Algérie
      </p>
      <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:opacity-90 transition">
        Connexion Agence
      </button>
    </main>
  );
}