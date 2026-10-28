import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const isLoginRoute = req.nextUrl.pathname === "/login";

  // Rediriger vers le login si on essaie d'accéder au dashboard sans être connecté
  if (isDashboardRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // Rediriger vers le dashboard si on est déjà connecté et qu'on visite la page login
  if (isLoginRoute && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }
})

// Ce middleware ne s'applique qu'aux routes spécifiques (optimisation)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}