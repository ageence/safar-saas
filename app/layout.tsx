import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider"; // 🟢 IMPORT DU MOTEUR DE LANGUE

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Safar.Pro - CRM & Réservations", // Titre professionnel pour l'onglet
  description: "Système de gestion SaaS premium pour les agences de voyage et visas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 🟢 LE MOTEUR DE LANGUE ENGLOBE TOUTE L'APPLICATION */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}