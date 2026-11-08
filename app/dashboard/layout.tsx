export const instant = false;

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, PlaneTakeoff, FileText, Wallet, Settings, LogOut, Compass, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NotificationBell } from "@/components/notification-bell";
import { LanguageSwitcher } from "@/components/language-switcher"; // 🟢 IMPORT DU BOUTON DE LANGUE

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const navLinks = [
    { name: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Clients", href: "/dashboard/clients", icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
    { name: "Voyages", href: "/dashboard/offres", icon: PlaneTakeoff, color: "text-orange-500", bg: "bg-orange-50" },
    { name: "Visas", href: "/dashboard/visas", icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
    { name: "Safar AI", href: "/dashboard/ai", icon: Sparkles, color: "text-indigo-600", bg: "bg-indigo-50" },
    { name: "Finances", href: "/dashboard/finances", icon: Wallet, color: "text-rose-500", bg: "bg-rose-50" },
    { name: "Paramètres", href: "/dashboard/parametres", icon: Settings, color: "text-slate-500", bg: "bg-slate-100" },
  ];

  return (
    <>
      <div className="bg-promax-paradise"></div>
      <div className="flex h-screen w-full overflow-hidden text-slate-800 selection:bg-cyan-100 relative">
        
        {/* SIDEBAR PC */}
        <aside className="hidden md:flex flex-col w-[300px] h-full py-6 pl-6">
          <div className="glass-promax flex-1 flex flex-col relative z-20">
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-br from-cyan-100/50 to-transparent rounded-t-[1.75rem] pointer-events-none"></div>
            
            {/* 🟢 HEADER SIDEBAR AVEC LE BOUTON DE LANGUE */}
            <div className="h-28 flex items-center justify-between px-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-2xl shadow-[0_8px_15px_rgba(14,165,233,0.2)]">
                  <Compass className="h-7 w-7 text-cyan-500 animate-[spin_12s_linear_infinite]" />
                </div>
                <span className="font-extrabold text-2xl tracking-tighter text-slate-800">SAFAR<span className="text-cyan-500 font-light">.PRO</span></span>
              </div>
              
              {/* Le bouton de langue pour PC */}
              <LanguageSwitcher />
            </div>

            <nav className="flex-1 px-5 py-4 space-y-2 relative z-10 overflow-y-auto">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center gap-4 px-4 py-3.5 text-[15px] font-bold text-slate-500 rounded-2xl transition-all duration-300 hover:bg-white hover:text-slate-900 hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] group border border-transparent hover:border-white">
                  <div className={`p-2.5 rounded-xl ${link.bg} group-hover:scale-110 transition-transform duration-300 shadow-sm`}><link.icon className={`h-5 w-5 ${link.color}`} /></div>
                  {link.name}
                  {link.name === "Safar AI" && <span className="ml-auto flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>}
                </Link>
              ))}
            </nav>

            <div className="p-5 m-5 bg-white/60 rounded-2xl border border-white shadow-sm relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-cyan-500/30">{session.user.name?.charAt(0) || "U"}</div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-extrabold text-slate-800 truncate">{session.user.name}</span><span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider truncate">CEO / Admin</span>
                </div>
              </div>
              <form action={async () => { "use server"; const { signOut } = await import("@/auth"); await signOut(); }}>
                <Button variant="ghost" type="submit" className="w-full text-rose-500 hover:text-white hover:bg-rose-500 rounded-xl transition-all font-bold h-10 shadow-sm bg-white"><LogOut className="mr-2 h-4 w-4" /> Déconnexion</Button>
              </form>
            </div>
          </div>
        </aside>

        {/* CONTENU PRINCIPAL */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* 🟢 HEADER MOBILE AVEC LE BOUTON DE LANGUE */}
          <header className="md:hidden flex h-20 items-center justify-between px-6 glass-promax m-4 relative z-50">
            <span className="font-extrabold text-xl text-slate-800 flex items-center gap-2"><Compass className="h-6 w-6 text-cyan-500" /> SAFAR.PRO</span>
            
            {/* Wrapper pour le bouton de langue + Menu Mobile */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              
              <Sheet>
                <SheetTrigger className="p-2.5 bg-white text-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all"><Menu className="h-6 w-6" /></SheetTrigger>
                <SheetContent side="left" className="w-[85vw] bg-white/90 backdrop-blur-3xl border-none p-0 text-slate-800 m-2 h-[calc(100vh-16px)] rounded-3xl shadow-2xl">
                  <div className="p-8"><span className="text-2xl font-extrabold text-royal-ocean">Menu</span></div>
                  <nav className="px-4 space-y-3">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="flex items-center gap-4 p-4 hover:bg-white rounded-2xl font-bold text-slate-600 shadow-sm border border-transparent hover:border-slate-100 transition-all">
                        <div className={`p-2 rounded-xl ${link.bg}`}><link.icon className={`h-6 w-6 ${link.color}`}/></div>{link.name}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

          </header>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8 w-full"><div className="max-w-[1600px] mx-auto w-full h-full">{children}</div></div>
        </main>
        
        {/* 🟢 LA CLOCHE RESTE EN POSITION FLOTTANTE (En bas à droite) */}
        <NotificationBell />
      </div>
    </>
  );
}