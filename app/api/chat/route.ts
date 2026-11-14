import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await auth();
    const agencyId = session?.user?.agencyId;
    
    if (!agencyId) {
      return new Response(JSON.stringify({ error: "Non autorisé. Connectez-vous." }), { status: 401 });
    }

    // 🟢 VÉRIFICATION DE LA CLÉ API
    if (!process.env.OPENAI_API_KEY) {
      return new Response("Clé API OpenAI manquante. Veuillez l'ajouter dans les variables d'environnement Vercel.", { status: 500 });
    }

    const { messages } = await req.json();

    const clients = await prisma.client.count({ where: { agencyId } });
    const visas = await prisma.visaApplication.findMany({ where: { agencyId } });
    const payments = await prisma.payment.findMany({ where: { agencyId } });
    
    const totalVisas = visas.length;
    const pendingVisas = visas.filter(v => v.status === "EN_ATTENTE").length;
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const systemPrompt = `
      Tu es Safar AI, l'assistant virtuel ultra-intelligent et professionnel d'une agence de voyage algérienne.
      Tu parles parfaitement Français et Arabe. Ton ton est expert, rassurant, et stratégique.
      Tu utilises le Markdown pour formuler tes réponses (tableaux, listes, gras).
      
      DONNÉES DE L'AGENCE EN TEMPS RÉEL :
      - Clients : ${clients}
      - Chiffre d'affaires : ${new Intl.NumberFormat("fr-DZ").format(totalRevenue)} DA
      - Dossiers Visas : ${totalVisas} dont ${pendingVisas} en attente.
    `;

    const result = await streamText({
      model: openai('gpt-4o'), 
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Erreur API Chat:", error);
    // On renvoie l'erreur exacte pour que le frontend l'affiche sans se bloquer
    return new Response(error.message || "Erreur de connexion au modèle IA", { status: 500 });
  }
}