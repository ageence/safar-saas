export const instant = false;

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Users, PlaneTakeoff, FileText, Wallet, Settings, LogOut, Compass, Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, color: "text-blue-500" },
    { name: "Clients", href: "/dashboard/clients", icon: Users, color: "text-emerald-500" },
    { name: "Voyages", href: "/dashboard/offres", icon: PlaneTakeoff, color: "text-orange-500" },
    { name: "Visas", href: "/dashboard/visas", icon: FileText, color: "text-purple-500" },
    { name: "Finances", href: "/dashboard/finances", icon: Wallet, color: "text-rose-500" },
    { name: "Settings", href: "/dashboard/parametres", icon: Settings, color: "text-slate-500" },
  ];

  return (
    <>
      <div className="bg-light-paradise"></div>

      <div className="flex h-screen w-full overflow-hidden text-slate-800 selection:bg-cyan-100">
        
        {/* SIDEBAR FLOTTANTE CLAIRE */}
        <aside className="hidden md:flex flex-col w-72 h-full py-6 pl-6">
          <div className="premium-glass flex-1 flex flex-col relative z-20">
            
            {/* Logo Area */}
            <div className="h-24 flex items-center px-8 border-b border-slate-100/50">
              <div className="flex items-center gap-3">
                <Compass className="h-8 w-8 text-cyan-500 animate-[spin_10s_linear_infinite]" />
                <span className="font-extrabold text-2xl tracking-tighter text-slate-800">
                  SAFAR<span className="text-cyan-500 font-light">.OS</span>
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} href={link.href} 
                  className="flex items-center gap-4 px-4 py-3.5 text-[15px] font-bold text-slate-500 rounded-xl transition-all duration-300 hover:bg-white hover:text-slate-900 hover:pl-6 hover:shadow-sm group"
                >
                  <div className={`p-2 rounded-lg bg-slate-50 group-hover:bg-${link.color.split('-')[1]}-50 transition-colors`}>
                    <link.icon className={`h-5 w-5 ${link.color} transition-transform group-hover:scale-110`} />
                  </div>
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-slate-100/50 bg-white/50">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                  {session.user.name?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-slate-800 truncate">{session.user.name}</span>
                  <span className="text-xs text-slate-500 truncate">Administrateur</span>
                </div>
              </div>
              <form action={async () => { "use server"; const { signOut } = await import("@/auth"); await signOut(); }}>
                <Button variant="ghost" type="submit" className="w-full text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all justify-start font-bold">
                  <LogOut className="mr-3 h-4 w-4" /> Déconnexion
                </Button>
              </form>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* Header Mobile */}
          <header className="md:hidden flex h-20 items-center justify-between px-6 premium-glass m-4 rounded-2xl relative z-50">
             <span className="font-extrabold text-xl text-slate-800">SAFAR<span className="text-cyan-500 font-light">.OS</span></span>
            <Sheet>
              <SheetTrigger className="p-2 text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-white/95 backdrop-blur-xl border-none p-0 text-slate-800 m-2 h-[calc(100vh-16px)] rounded-3xl shadow-2xl">
                 <div className="p-8"><span className="text-2xl font-extrabold text-gradient-ocean">Menu Principal</span></div>
                 <nav className="px-4 space-y-2">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl font-bold text-slate-600 hover:text-slate-900 transition-colors">
                        <link.icon className={`h-6 w-6 ${link.color}`}/>
                        {link.name}
                      </Link>
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