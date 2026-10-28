import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Settings, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { updateAgency, addEmployee } from "./actions";

export default async function SettingsPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;

  if (!agencyId) return null;

  const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
  const team = await prisma.user.findMany({ where: { agencyId } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Gérez votre agence, votre équipe et vos intégrations.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/50">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="equipe">Équipe</TabsTrigger>
          <TabsTrigger value="automatisations">Automatisations</TabsTrigger>
        </TabsList>
        
        {/* ONGLET 1 : GÉNÉRAL */}
        <TabsContent value="general" className="mt-6">
          <Card className="bg-card max-w-2xl">
            <form action={updateAgency}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" /> Profil de l'agence
                </CardTitle>
                <CardDescription>Les informations publiques de votre agence de voyages.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom de l'agence</Label>
                  <Input name="name" defaultValue={agency?.name} className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone Principal</Label>
                  <Input name="phone" defaultValue={agency?.phone || ""} placeholder="0555..." className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Adresse physique</Label>
                  <Input name="address" defaultValue={agency?.address || ""} placeholder="Alger, Algérie" className="bg-muted/50" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="font-semibold text-primary-foreground">Mettre à jour</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* ONGLET 2 : ÉQUIPE */}
        <TabsContent value="equipe" className="mt-6 space-y-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Membres de l'équipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant={member.role === "AGENCY_ADMIN" ? "default" : "secondary"}>
                          {member.role === "AGENCY_ADMIN" ? "Gérant" : "Employé"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {session?.user?.role === "AGENCY_ADMIN" && (
            <Card className="bg-card max-w-2xl">
              <form action={addEmployee}>
                <CardHeader>
                  <CardTitle>Ajouter un employé</CardTitle>
                  <CardDescription>Créez un accès pour un nouveau membre de votre équipe.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom complet</Label>
                      <Input name="name" required className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input name="email" type="email" required className="bg-muted/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Mot de passe provisoire</Label>
                    <Input name="password" type="password" required className="bg-muted/50" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="font-semibold text-primary-foreground">Créer le compte</Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </TabsContent>

        {/* ONGLET 3 : AUTOMATISATIONS (Webhooks WhatsApp) */}
        <TabsContent value="automatisations" className="mt-6">
          <Card className="bg-card max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-500" /> Intégration WhatsApp Business
              </CardTitle>
              <CardDescription>Configuration du Webhook pour recevoir les messages clients directement dans le CRM.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-md border text-sm space-y-2">
                <p><span className="font-semibold text-primary">URL du Webhook :</span> https://ton-domaine.com/api/webhooks/whatsapp</p>
                <p><span className="font-semibold text-primary">Jeton de vérification (Token) :</span> safar_saas_secure_token</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Ces informations doivent être collées dans votre tableau de bord Meta for Developers (API WhatsApp Cloud).
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}