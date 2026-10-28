export const instant = false;

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  PlaneTakeoff, 
  FileText, 
  Wallet, 
  Settings, 
  LogOut, 
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const navLinks = [
    { name: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
    { name: "Clients (CRM)", href: "/dashboard/clients", icon: Users },
    { name: "Offres & Voyages", href: "/dashboard/offres", icon: PlaneTakeoff },
    { name: "Dossiers Visas", href: "/dashboard/visas", icon: FileText },
    { name: "Finances", href: "/dashboard/finances", icon: Wallet },
    { name: "Paramètres", href: "/dashboard/parametres", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen w-full bg-transparent">
      
      {/* SIDEBAR - Desktop (Premium Océan) */}
      <aside className="hidden md:flex w-64 flex-col flex-shrink-0 bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl relative z-20">
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-cyan-400 to-blue-500 p-2 rounded-xl shadow-lg">
              <PlaneTakeoff className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 to-white">
              Safar<span className="font-light">SaaS</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-blue-100/70 rounded-xl transition-all duration-300 hover:bg-white/10 hover:text-white hover:translate-x-1 hover:shadow-lg"
            >
              <link.icon className="h-5 w-5" />
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 m-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
              {session.user.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate text-white">{session.user.name}</span>
              <span className="text-xs text-blue-200 truncate">{session.user.email}</span>
            </div>
          </div>
          <form action={async () => {
            "use server";
            const { signOut } = await import("@/auth");
            await signOut();
          }}>
            <Button variant="ghost" type="submit" className="w-full justify-start text-red-300 hover:text-red-100 hover:bg-red-500/20 transition-all rounded-xl">
              <LogOut className="mr-2 h-4 w-4" /> Déconnexion
            </Button>
          </form>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL & HEADER MOBILE */}
      <div className="flex flex-1 flex-col relative z-10">
        
        {/* HEADER - Mobile (Affiché uniquement sur petits écrans) */}
        <header className="flex md:hidden h-16 items-center justify-between border-b bg-white/70 backdrop-blur-md px-4 shadow-sm relative z-30">
          <Sheet>
            <SheetTrigger className="p-2 rounded-md hover:bg-blue-50 text-blue-900 transition-colors">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 p-0 border-r-white/10">
              <div className="flex h-20 items-center px-6 border-b border-white/10 text-white">
                <div className="bg-gradient-to-tr from-cyan-400 to-blue-500 p-2 rounded-xl shadow-lg mr-3">
                  <PlaneTakeoff className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 to-white">
                  Safar<span className="font-light">SaaS</span>
                </span>
              </div>
              <nav className="grid gap-2 p-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-blue-100/70 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <link.icon className="h-5 w-5" />
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <form action={async () => {
            "use server";
            const { signOut } = await import("@/auth");
            await signOut();
          }}>
            <Button variant="ghost" size="icon" type="submit" className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl">
              <LogOut className="h-5 w-5" />
            </Button>
          </form>
        </header>

        {/* ZONE DE RENDU DES PAGES (Avec le fond aquarelle) */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-100/40 via-amber-50/30 to-rose-100/40">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}