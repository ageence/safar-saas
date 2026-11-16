import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await auth();
    const agencyId = session?.user?.agencyId;
    if (!agencyId) return new Response("Non autorisé", { status: 401 });

    if (!process.env.GROQ_API_KEY) {
      return new Response("La clé GROQ_API_KEY n'est pas configurée sur Vercel.", { status: 500 });
    }

    const { messages } = await req.json();

    // 1. 🟢 DÉTECTION 100% DYNAMIQUE DU MODÈLE
    const modelsResponse = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
    });
    
    if (!modelsResponse.ok) {
       throw new Error("Clé Groq invalide ou compte non autorisé.");
    }
    
    const modelsData = await modelsResponse.json();
    const availableModels = modelsData.data.map((m: any) => m.id);
    
    // On trouve le premier modèle Llama ou Gemma actif, en excluant formellement 'orpheus'
    const activeModel = availableModels.find((id: string) => 
      (id.includes('llama') || id.includes('gemma')) && !id.includes('orpheus')
    );

    if (!activeModel) {
        throw new Error("Aucun modèle de chat compatible n'est actif sur votre compte Groq actuellement.");
    }

    // 2. Récupération des données
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

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content }))
    ];

    // 3. 🟢 REQUÊTE NATIVE VERS LE MODÈLE DÉTECTÉ DYNAMIQUEMENT
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: activeModel, 
        messages: groqMessages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || "Erreur de connexion au modèle Groq");
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error("Erreur API Native Groq:", error);
    return new Response(error.message || "Erreur interne de l'API Groq.", { status: 500 });
  }
}