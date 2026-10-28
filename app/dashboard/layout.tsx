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
  // On récupère la session utilisateur
  const session = await auth();

  // Si pas de session, sécurité supplémentaire (le middleware s'en occupe normalement)
  if (!session?.user) {
    redirect("/login");
  }

  const navLinks = [
    { name: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
    { name: "Clients (CRM)", href: "/dashboard/clients", icon: Users },
    { name: "Offres & Voyages", href: "/dashboard/offres", icon: PlaneTakeoff },
    { name: "Dossiers Visas", href: "/dashboard/visas", icon: FileText },
    { name: "Finances", href: "/dashboard/finances", icon: Wallet },
    { name: "Paramètres", href: "/dashboard/parametres", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      {/* SIDEBAR - Desktop */}
      <aside className="hidden border-r bg-card md:flex md:w-64 md:flex-col">
        <div className="flex h-14 items-center border-b px-6 text-primary">
          <PlaneTakeoff className="h-6 w-6 mr-2" />
          <span className="font-bold tracking-tight">Safar SaaS</span>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <ul className="grid gap-1 px-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t p-4">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {session.user.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{session.user.name}</span>
              <span className="text-xs text-muted-foreground">{session.user.email}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div className="flex flex-1 flex-col">
        {/* HEADER - Mobile & Desktop */}
        <header className="flex h-14 items-center justify-between border-b bg-card px-4 md:justify-end">
          
          {/* Menu Mobile */}
          <Sheet>
          <SheetTrigger className="md:hidden p-2 rounded-md hover:bg-accent text-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 sm:w-72 bg-card p-0">
              <div className="flex h-14 items-center border-b px-6 text-primary">
                <PlaneTakeoff className="h-6 w-6 mr-2" />
                <span className="font-bold tracking-tight">Safar SaaS</span>
              </div>
              <nav className="grid gap-1 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Déconnexion Rapide (Header) */}
          <form action={async () => {
            "use server";
            const { signOut } = await import("@/auth");
            await signOut();
          }}>
            <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </form>
        </header>

        {/* ZONE DE RENDU DES PAGES */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}