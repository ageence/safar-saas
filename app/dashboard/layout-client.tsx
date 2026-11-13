"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, Users, PlaneTakeoff, FileText, Wallet, Settings, LogOut, Compass, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NotificationBell } from "@/components/notification-bell";
import { useLanguage } from "@/components/language-provider";
import { signOutAction } from "./actions";

export default function LayoutClient({ children, session }: { children: React.ReactNode, session: any }) {
  const { t, lang } = useLanguage();
  const pathname = usePathname();
  const isAr = lang === 'ar';

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const navLinks = [
    { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/20" },
    { name: t("clients"), href: "/dashboard/clients", icon: Users, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/20" },
    { name: t("voyages"), href: "/dashboard/offres", icon: PlaneTakeoff, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/20" },
    { name: t("visas"), href: "/dashboard/visas", icon: FileText, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/20" },
    { name: t("safarAI"), href: "/dashboard/ai", icon: Sparkles, color: "text-indigo-600 dark:text-indigo-300", bg: "bg-indigo-50 dark:bg-indigo-500/20" },
    { name: t("finances"), href: "/dashboard/finances", icon: Wallet, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/20" },
    { name: t("settings"), href: "/dashboard/settings", icon: Settings, color: "text-slate-500 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800" },
  ];

  return (
    <>
      <div className="bg-promax-paradise dark:bg-slate-950 dark:bg-none transition-colors duration-500 absolute inset-0 -z-10"></div>
      
      <div dir={isAr ? "rtl" : "ltr"} className="flex h-screen w-full overflow-hidden text-slate-800 dark:text-slate-100 selection:bg-cyan-100 dark:selection:bg-cyan-900/50 relative">
        
        <aside className="hidden md:flex flex-col w-[300px] h-full py-6 px-6">
          <div className="glass-promax dark:bg-slate-900 dark:border-slate-800/80 flex-1 flex flex-col relative z-20 transition-colors duration-500 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-br from-cyan-100/50 dark:from-cyan-900/20 to-transparent rounded-t-[1.75rem] pointer-events-none"></div>
            
            <div className="h-28 flex items-center px-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_15px_rgba(14,165,233,0.2)] dark:shadow-none border border-transparent dark:border-slate-700">
                  <Compass className="h-7 w-7 text-cyan-500 animate-[spin_12s_linear_infinite]" />
                </div>
                <span className="font-extrabold text-2xl tracking-tighter text-slate-800 dark:text-white">SAFAR<span className="text-cyan-500 font-light">.PRO</span></span>
              </div>
            </div>

            <nav className="flex-1 px-5 py-4 space-y-2 relative z-10 overflow-y-auto no-scrollbar">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                return (
                  <Link key={link.href} href={link.href} className={`flex items-center gap-4 px-4 py-3.5 text-[15px] font-bold rounded-2xl transition-all duration-300 group border ${isActive ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-[0_8px_20px_rgba(0,0,0,0.04)] dark:shadow-none border-white dark:border-slate-700" : "text-slate-500 dark:text-slate-300 border-transparent hover:border-white dark:hover:border-slate-700 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"}`}>
                    <div className={`p-2.5 rounded-xl ${isActive ? 'bg-cyan-500 text-white shadow-md' : link.bg} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <link.icon className={`h-5 w-5 ${isActive ? 'text-white' : link.color}`} />
                    </div>
                    {link.name}
                    {link.name === t("safarAI") && !isActive && <span className={`flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse ${isAr ? 'mr-auto' : 'ml-auto'}`}></span>}
                  </Link>
                );
              })}
            </nav>

            <div className="p-5 m-5 bg-white/60 dark:bg-slate-800/80 rounded-2xl border border-white dark:border-slate-700 shadow-sm relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-cyan-500/30 flex-shrink-0">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-extrabold text-slate-800 dark:text-white truncate">{session?.user?.name}</span>
                  <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider truncate">CEO / Admin</span>
                </div>
              </div>
              <form action={signOutAction}>
                <Button variant="ghost" type="submit" className="w-full text-rose-500 dark:text-rose-400 hover:text-white hover:bg-rose-500 dark:hover:bg-rose-600 dark:hover:text-white rounded-xl transition-all font-bold h-10 shadow-sm bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800">
                  <LogOut className={`h-4 w-4 ${isAr ? 'ml-2' : 'mr-2'}`} /> {t("logout")}
                </Button>
              </form>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          <header className="md:hidden flex h-20 items-center justify-between px-6 glass-promax dark:bg-slate-900 dark:border-slate-800 m-4 relative z-50">
            <span className="font-extrabold text-xl text-slate-800 dark:text-white flex items-center gap-2"><Compass className="h-6 w-6 text-cyan-500" /> SAFAR.PRO</span>
            <Sheet>
              <SheetTrigger className="p-2.5 bg-white dark:bg-slate-800 border border-transparent dark:border-slate-700 text-slate-800 dark:text-white rounded-xl shadow-sm"><Menu className="h-6 w-6" /></SheetTrigger>
              <SheetContent side={isAr ? "right" : "left"} className="w-[85vw] bg-white/95 dark:bg-slate-950 backdrop-blur-3xl border-none p-0 text-slate-800 dark:text-white m-2 h-[calc(100vh-16px)] rounded-3xl shadow-2xl">
                <div className="p-8"><span className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400">{t("menu")}</span></div>
                <nav className="px-4 space-y-3">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                    return (
                      <Link key={link.href} href={link.href} className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${isActive ? "bg-cyan-50 dark:bg-slate-800 text-cyan-700 dark:text-white shadow-sm border border-cyan-100 dark:border-slate-700" : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 border border-transparent dark:hover:border-slate-800"}`}>
                        <div className={`p-2 rounded-xl ${isActive ? 'bg-cyan-500 text-white' : link.bg}`}><link.icon className={`h-6 w-6 ${isActive ? 'text-white' : link.color}`}/></div>
                        {link.name}
                      </Link>
                    )
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </header>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8 w-full">
            <div className="max-w-[1600px] mx-auto w-full h-full">{children}</div>
          </div>
        </main>
        
        <NotificationBell />
      </div>
    </>
  );
}