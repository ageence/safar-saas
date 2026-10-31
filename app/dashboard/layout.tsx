export const instant = false;

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Users, PlaneTakeoff, FileText, Wallet, Settings, LogOut, Menu, Globe2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const navLinks = [
    { name: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard, color: "text-cyan-400" },
    { name: "Clients (CRM)", href: "/dashboard/clients", icon: Users, color: "text-emerald-400" },
    { name: "Voyages & Omra", href: "/dashboard/offres", icon: PlaneTakeoff, color: "text-orange-400" },
    { name: "Dossiers Visas", href: "/dashboard/visas", icon: FileText, color: "text-purple-400" },
    { name: "Trésorerie", href: "/dashboard/finances", icon: Wallet, color: "text-rose-400" },
    { name: "Paramètres", href: "/dashboard/parametres", icon: Settings, color: "text-slate-400" },
  ];

  return (
    <>
      {/* BACKGROUND ELEMENTS (Le WOW Effect) */}
      <div className="bg-immersive-travel"></div>
      <div className="glass-overlay"></div>

      <div className="flex h-screen w-full overflow-hidden text-white font-sans selection:bg-cyan-500/30">
        
        {/* SIDEBAR FLOTTANTE PREMIUM (Desktop) */}
        <aside className="hidden md:flex flex-col w-72 h-full p-6">
          <div className="ultra-glass flex-1 flex flex-col relative overflow-hidden group">
            
            {/* Lueur de fond animée dans la sidebar */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-500/10 to-transparent"></div>

            <div className="h-28 flex items-center px-8 relative z-10">
              <div className="bg-white/10 p-3 rounded-2xl shadow-lg border border-white/20 mr-4 backdrop-blur-md">
                <Globe2 className="h-7 w-7 text-cyan-400" />
              </div>
              <span className="font-extrabold text-2xl tracking-tighter text-white drop-shadow-lg">
                Safar<span className="text-cyan-400 font-light">SaaS</span>
              </span>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-3 relative z-10 overflow-y-auto">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} href={link.href} 
                  className="flex items-center gap-4 px-5 py-4 text-[15px] font-semibold text-slate-300 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:text-white hover:translate-x-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-transparent hover:border-white/10"
                >
                  <link.icon className={`h-5 w-5 ${link.color}`} />
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="p-5 relative z-10">
              <div className="bg-black/20 border border-white/10 p-4 rounded-3xl backdrop-blur-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg border border-white/20">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold text-white truncate">{session.user.name}</span>
                    <span className="text-xs text-cyan-300 truncate">{session.user.email}</span>
                  </div>
                </div>
                <form action={async () => { "use server"; const { signOut } = await import("@/auth"); await signOut(); }}>
                  <Button variant="ghost" type="submit" className="w-full text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded-xl h-10 font-bold transition-all">
                    <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENU PRINCIPAL */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* HEADER MOBILE (Glass) */}
          <header className="md:hidden flex h-20 items-center justify-between px-6 ultra-glass m-4 relative z-50">
            <Sheet>
              <SheetTrigger className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10">
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="left" className="w-80 ultra-glass border-r border-white/10 p-0 text-white m-2 h-[calc(100vh-16px)] rounded-3xl">
                 <div className="p-8"><span className="text-2xl font-extrabold text-gradient-premium">SafarSaaS</span></div>
                 <nav className="px-4 space-y-2">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="flex gap-4 p-4 rounded-2xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 font-medium"><link.icon className={`h-5 w-5 ${link.color}`}/>{link.name}</Link>
                    ))}
                 </nav>
              </SheetContent>
            </Sheet>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8 w-full">
            <div className="max-w-[1600px] mx-auto w-full h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}