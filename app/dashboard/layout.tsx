export const instant = false;

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Users, PlaneTakeoff, FileText, Wallet, Settings, LogOut, Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Clients", href: "/dashboard/clients", icon: Users },
    { name: "Voyages", href: "/dashboard/offres", icon: PlaneTakeoff },
    { name: "Visas", href: "/dashboard/visas", icon: FileText },
    { name: "Finances", href: "/dashboard/finances", icon: Wallet },
    { name: "Settings", href: "/dashboard/parametres", icon: Settings },
  ];

  return (
    <>
      <div className="aurora-bg"></div>
      <div className="noise-overlay"></div>

      <div className="flex h-screen w-full overflow-hidden text-slate-200 selection:bg-cyan-500/30">
        
        {/* SIDEBAR FLOTTANTE (Premium Capsule) */}
        <aside className="hidden md:flex flex-col w-72 h-full py-6 pl-6">
          <div className="bento-card flex-1 flex flex-col relative z-20">
            
            {/* Logo Area */}
            <div className="h-24 flex items-center px-8 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Compass className="h-8 w-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-pulse" />
                <span className="font-extrabold text-2xl tracking-tighter text-white">
                  SAFAR<span className="text-cyan-400 font-light">.OS</span>
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} href={link.href} 
                  className="flex items-center gap-4 px-4 py-3 text-[15px] font-medium text-slate-400 rounded-xl transition-all duration-300 hover:bg-white/5 hover:text-white hover:pl-6 group"
                >
                  <link.icon className="h-5 w-5 group-hover:text-cyan-400 transition-colors" />
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                  {session.user.name?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-white truncate">{session.user.name}</span>
                  <span className="text-xs text-slate-500 truncate">Admin</span>
                </div>
              </div>
              <form action={async () => { "use server"; const { signOut } = await import("@/auth"); await signOut(); }}>
                <Button variant="ghost" type="submit" className="w-full text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all justify-start">
                  <LogOut className="mr-3 h-4 w-4" /> Déconnexion
                </Button>
              </form>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* Header Mobile */}
          <header className="md:hidden flex h-20 items-center justify-between px-6 bento-card m-4 rounded-2xl relative z-50">
             <span className="font-extrabold text-xl text-white">SAFAR.OS</span>
            <Sheet>
              <SheetTrigger className="p-2 text-white">
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bento-card border-none p-0 text-white m-2 h-[calc(100vh-16px)]">
                 <div className="p-8"><span className="text-2xl font-extrabold text-cyan-400">Menu</span></div>
                 <nav className="px-4 space-y-2">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="flex gap-4 p-4 hover:bg-white/5 rounded-xl"><link.icon className="h-5 w-5"/>{link.name}</Link>
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