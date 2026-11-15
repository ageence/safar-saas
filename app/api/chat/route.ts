import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const agencyId = session?.user?.agencyId;
    if (!agencyId) return new Response('Non autorisé', { status: 401 });

    const { messages } = await req.json();

    // Récupération rapide et sécurisée des données
    const clients = await prisma.client.count({ where: { agencyId } });
    const visas = await prisma.visaApplication.findMany({ where: { agencyId }, select: { status: true } });
    
    const pendingVisas = visas.filter(v => v.status === "EN_ATTENTE").length;

    const systemPrompt = `
      Tu es Safar AI, l'assistant expert d'une agence de voyage. 
      Tu parles en Français et Arabe. Ton ton est professionnel et rassurant.
      Tu utilises des étoiles pour mettre en gras (**texte**) et tu vas à la ligne pour structurer.
      
      DONNÉES DE L'AGENCE EN TEMPS RÉEL :
      - Clients : ${clients}
      - Dossiers Visas : ${visas.length} dont ${pendingVisas} en attente.
    `;

    const result = await streamText({
      model: openai('gpt-4o'), 
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Erreur API Chat:", error);
    return new Response(error.message || "Erreur IA", { status: 500 });
  }
}