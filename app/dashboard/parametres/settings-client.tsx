"use client";

import { Settings, Users, MessageSquare, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { updateAgency, addEmployee } from "./actions";
import { useLanguage } from "@/components/language-provider";
import { Language } from "@/lib/i18n/dictionaries";

export default function SettingsClient({ agency, team, isAdmin }: any) {
  const { lang, setLang, t } = useLanguage();

  const languages = [
    { code: "fr", name: "Français", flag: "🇫🇷", region: "Europe / Maghreb" },
    { code: "en", name: "English", flag: "🇬🇧", region: "International" },
    { code: "ar", name: "العربية", flag: "🇩🇿", region: "MENA" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("settingsTitle")}</h1>
        <p className="text-muted-foreground">{t("settingsDesc")}</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        {/* 🟢 ON PASSE À 4 COLONNES POUR INCLURE LA LANGUE */}
        <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-muted/50">
          <TabsTrigger value="general">{t("tabGeneral")}</TabsTrigger>
          <TabsTrigger value="langue">{t("tabLang")}</TabsTrigger>
          <TabsTrigger value="equipe">{t("tabTeam")}</TabsTrigger>
          <TabsTrigger value="automatisations">{t("tabAuto")}</TabsTrigger>
        </TabsList>
        
        {/* ONGLET 1 : GÉNÉRAL */}
        <TabsContent value="general" className="mt-6">
          <Card className="bg-card max-w-2xl">
            <form action={updateAgency}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" /> {t("agencyProfile")}
                </CardTitle>
                <CardDescription>{t("agencyDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("agencyName")}</Label>
                  <Input name="name" defaultValue={agency?.name} className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>{t("phoneMain")}</Label>
                  <Input name="phone" defaultValue={agency?.phone || ""} placeholder="0555..." className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>{t("address")}</Label>
                  <Input name="address" defaultValue={agency?.address || ""} placeholder="Alger..." className="bg-muted/50" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="font-semibold text-primary-foreground">{t("update")}</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* 🟢 ONGLET NOUVEAU : LANGUES */}
        <TabsContent value="langue" className="mt-6">
          <Card className="bg-card max-w-3xl border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-500" /> {t("languageTitle")}
              </CardTitle>
              <CardDescription>{t("languageDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {languages.map((l) => {
                  const isActive = lang === l.code;
                  return (
                    <button 
                      key={l.code}
                      onClick={() => setLang(l.code as Language)}
                      className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center gap-3 active:scale-95 ${
                        isActive ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-slate-100 bg-white hover:border-indigo-300"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute -top-3 -right-3 bg-indigo-600 text-white p-1 rounded-full shadow-md">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                      <span className="text-4xl">{l.flag}</span>
                      <div>
                        <h3 className={`font-black text-lg ${isActive ? "text-indigo-900" : "text-slate-800"}`}>{l.name}</h3>
                        <p className={`text-xs font-bold mt-1 ${isActive ? "text-indigo-600" : "text-slate-400"}`}>{l.region}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ONGLET 3 : ÉQUIPE */}
        <TabsContent value="equipe" className="mt-6 space-y-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> {t("teamMembers")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("colName")}</TableHead>
                    <TableHead>{t("colEmail")}</TableHead>
                    <TableHead>{t("colRole")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.map((member: any) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant={member.role === "AGENCY_ADMIN" ? "default" : "secondary"}>
                          {member.role === "AGENCY_ADMIN" ? t("roleAdmin") : t("roleEmp")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card className="bg-card max-w-2xl">
              <form action={addEmployee}>
                <CardHeader>
                  <CardTitle>{t("addEmp")}</CardTitle>
                  <CardDescription>{t("addEmpDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("fullName")}</Label>
                      <Input name="name" required className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("colEmail")}</Label>
                      <Input name="email" type="email" required className="bg-muted/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("tempPass")}</Label>
                    <Input name="password" type="password" required className="bg-muted/50" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="font-semibold text-primary-foreground">{t("createAccount")}</Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </TabsContent>

        {/* ONGLET 4 : AUTOMATISATIONS */}
        <TabsContent value="automatisations" className="mt-6">
          <Card className="bg-card max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-500" /> {t("waIntegration")}
              </CardTitle>
              <CardDescription>{t("waDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-md border text-sm space-y-2">
                <p><span className="font-semibold text-primary">{t("waUrl")} :</span> https://ton-domaine.com/api/webhooks/whatsapp</p>
                <p><span className="font-semibold text-primary">{t("waToken")} :</span> safar_saas_secure_token</p>
              </div>
              <p className="text-sm text-muted-foreground">{t("waInfo")}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}