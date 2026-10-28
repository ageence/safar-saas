export const instant = false;

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Users, PlaneTakeoff, FileText, Wallet, Settings, LogOut, Menu, Map
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Clients (CRM)", href: "/dashboard/clients", icon: Users },
    { name: "Voyages & Omra", href: "/dashboard/offres", icon: PlaneTakeoff },
    { name: "Dossiers Visas", href: "/dashboard/visas", icon: FileText },
    { name: "Trésorerie", href: "/dashboard/finances", icon: Wallet },
    { name: "Paramètres", href: "/dashboard/parametres", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-paradise overflow-hidden font-sans">
      
      {/* SIDEBAR - PREMIUM FLOTTANTE */}
      <aside className="hidden md:flex flex-col w-72 h-full p-4">
        <div className="flex-1 bg-gradient-to-br from-slate-900 via-[#0a192f] to-indigo-950 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col relative border border-white/10">
          
          {/* Décoration fond sidebar */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>

          <div className="h-24 flex items-center px-8 relative z-10">
            <div className="bg-gradient-to-tr from-cyan-400 to-blue-500 p-2.5 rounded-2xl shadow-lg shadow-cyan-500/30 mr-4">
              <Map className="h-6 w-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Safar<span className="text-cyan-400 font-light">SaaS</span>
            </span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 relative z-10 overflow-y-auto">
            {navLinks.map((link) => (
              <Link 
                key={link.href} href={link.href} 
                className="flex items-center gap-4 px-5 py-3.5 text-[15px] font-medium text-slate-300 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:text-white hover:translate-x-2 hover:shadow-lg group"
              >
                <link.icon className="h-5 w-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 relative z-10">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold shadow-md">
                  {session.user.name?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-white truncate">{session.user.name}</span>
                  <span className="text-xs text-slate-400 truncate">{session.user.email}</span>
                </div>
              </div>
              <form action={async () => { "use server"; const { signOut } = await import("@/auth"); await signOut(); }}>
                <Button variant="ghost" type="submit" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl">
                  <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                </Button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL (Étiré et parfaitement aligné) */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* HEADER MOBILE */}
        <header className="md:hidden flex h-20 items-center justify-between px-6 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 relative z-20">
          <Sheet>
            <SheetTrigger className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            {/* Contenu mobile gardé simple pour la concision */}
            <SheetContent side="left" className="w-80 bg-slate-900 border-r-0 p-0 text-white">
               <div className="p-8"><span className="text-2xl font-bold">SafarSaaS</span></div>
               <nav className="px-4 space-y-2">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="flex gap-4 p-4 rounded-xl hover:bg-white/10"><link.icon className="h-5 w-5"/>{link.name}</Link>
                  ))}
               </nav>
            </SheetContent>
          </Sheet>
        </header>

        {/* ZONE SCROLLABLE POUR TOUTES LES PAGES (Remplissage total, pas de vide) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 xl:p-10 w-full">
          <div className="max-w-[1600px] mx-auto w-full h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}