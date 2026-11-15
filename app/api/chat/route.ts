// @ts-nocheck
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export const maxDuration = 30;

// 🟢 L'ASTUCE DE PRO : On utilise le moteur OpenAI, mais on le détourne vers les serveurs 100% gratuits de GROQ !
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const agencyId = session?.user?.agencyId;
    if (!agencyId) return new Response("Non autorisé", { status: 401 });

    // 🟢 VÉRIFICATION DE LA NOUVELLE CLÉ
    if (!process.env.GROQ_API_KEY) {
      return new Response("La clé GROQ_API_KEY n'est pas configurée sur Vercel.", { status: 500 });
    }

    const { messages } = await req.json();

    // Récupération des données pour l'IA
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

    // 🟢 ON UTILISE LLaMA 3 (Gratuit, sans carte, et plus rapide que ChatGPT)
    const result = await generateText({
      model: groq('llama3-70b-8192'), 
      system: systemPrompt,
      messages,
    });

    return new Response(JSON.stringify({ text: result.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error("Erreur API Groq:", error);
    return new Response(error.message || "Erreur interne de l'API Groq.", { status: 500 });
  }
}