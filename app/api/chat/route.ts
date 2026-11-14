import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await auth();
    const agencyId = session?.user?.agencyId;
    
    if (!agencyId) return new Response('Non autorisé', { status: 401 });

    const { messages } = await req.json();

    // L'IA lit tes données en direct
    const clients = await prisma.client.count({ where: { agencyId } });
    const visas = await prisma.visaApplication.findMany({ where: { agencyId } });
    const payments = await prisma.payment.findMany({ where: { agencyId } });
    
    const pendingVisas = visas.filter(v => v.status === "EN_ATTENTE").length;
    const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const systemPrompt = `
      Tu es Safar AI, l'assistant virtuel ultra-intelligent et professionnel d'une agence de voyage algérienne.
      Tu parles parfaitement Français et Arabe. Ton ton est expert, rassurant, et stratégique.
      Tu utilises le Markdown pour formuler tes réponses (tableaux, listes, gras).
      
      DONNÉES DE L'AGENCE EN TEMPS RÉEL :
      - Clients : ${clients}
      - Chiffre d'affaires : ${new Intl.NumberFormat("fr-DZ").format(totalRevenue)} DA
      - Dossiers Visas : ${visas.length} dont ${pendingVisas} en attente.
    `;

    // Connexion à OpenAI
    const result = await streamText({
      model: openai('gpt-4o'), 
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Erreur API Chat:", error);
    return new Response(error.message || "Erreur de connexion", { status: 500 });
  }
}