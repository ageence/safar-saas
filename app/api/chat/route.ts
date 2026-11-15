// @ts-nocheck
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await auth();
    const agencyId = session?.user?.agencyId;
    if (!agencyId) return new Response("Non autorisé", { status: 401 });

    if (!process.env.OPENAI_API_KEY) {
      return new Response("Clé OPENAI_API_KEY manquante sur Vercel.", { status: 500 });
    }

    const { messages } = await req.json();

    // 🟢 STATISTIQUES SÉCURISÉES POUR L'IA
    const clientsCount = await prisma.client.count({ where: { agencyId } });
    const visasCount = await prisma.visaApplication.count({ where: { agencyId } });
    const payments = await prisma.payment.findMany({ where: { agencyId }, select: { amount: true } });
    const revenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const systemPrompt = `
      Tu es Safar AI, l'assistant expert d'une agence de voyage algérienne.
      Tu parles en Français et Arabe. Ton ton est professionnel et stratégique.
      Utilise des étoiles (**) pour mettre en gras.
      
      DONNÉES EN TEMPS RÉEL DE L'AGENCE :
      - Total Clients : ${clientsCount}
      - Total Dossiers Visas : ${visasCount}
      - Chiffre d'affaires généré : ${new Intl.NumberFormat("fr-DZ").format(revenue)} DA
    `;

    const result = await streamText({
      model: openai('gpt-4o'), 
      system: systemPrompt,
      messages,
    });

    // 🟢 ON ENVOIE UN STREAM DE TEXTE BRUT (Plus robuste)
    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Erreur API Chat:", error);
    return new Response(error.message || "Erreur interne du serveur OpenAI", { status: 500 });
  }
}