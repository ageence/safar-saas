import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// Permet une réponse en streaming fluide (Effet ChatGPT)
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await auth();
    const agencyId = session?.user?.agencyId;
    
    if (!agencyId) {
      return new Response('Non autorisé', { status: 401 });
    }

    const { messages } = await req.json();

    // 🟢 1. RÉCUPÉRATION DES DONNÉES EN TEMPS RÉEL (RAG)
    // L'IA aura toujours les chiffres à la seconde près
    const clients = await prisma.client.count({ where: { agencyId } });
    const visas = await prisma.visaApplication.findMany({ where: { agencyId } });
    const payments = await prisma.payment.findMany({ where: { agencyId } });
    
    const totalVisas = visas.length;
    const pendingVisas = visas.filter(v => v.status === "EN_ATTENTE").length;
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // 🟢 2. LE PROMPT SYSTÈME (Le cerveau et le rôle de l'IA)
    const systemPrompt = `
      Tu es Safar AI, l'assistant virtuel ultra-intelligent et professionnel d'une agence de voyage algérienne.
      Tu parles parfaitement Français et Arabe (selon la langue de l'utilisateur). Ton ton est expert, rassurant, et stratégique.
      Tu utilises le Markdown pour formuler tes réponses (mets en gras, utilise des listes à puces, crée des tableaux si on te demande des rapports).
      
      VOICI LES DONNÉES STRICTES ET RÉELLES DE L'AGENCE À L'INSTANT T (Ne les invente pas) :
      - Nombre total de clients : ${clients}
      - Chiffre d'affaires total généré : ${new Intl.NumberFormat("fr-DZ").format(totalRevenue)} DA
      - Nombre de dossiers Visas : ${totalVisas} dont ${pendingVisas} en attente de traitement.
      
      Règles : 
      1. Si l'utilisateur te demande un résumé ou un rapport, utilise ces données exactes pour lui faire une belle analyse.
      2. Si l'utilisateur demande un conseil marketing, propose des stratégies concrètes basées sur le tourisme et les visas.
      3. Si tu ne connais pas une information précise sur un client spécifique, dis que tu n'y as pas accès actuellement au lieu d'inventer.
      4. Sois concis mais très professionnel.
    `;

    // 🟢 3. CONNEXION AU MODÈLE IA ET STREAMING
    const result = await streamText({
      model: openai('gpt-4o'), // Le modèle le plus puissant (Tu peux mettre gpt-4o-mini pour moins de frais)
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Erreur IA:", error);
    return new Response('Erreur Serveur', { status: 500 });
  }
}