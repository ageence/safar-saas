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

    // 1. 🟢 LE FIX MAGIQUE : On demande à Groq les modèles autorisés pour TON compte !
    const modelsResponse = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
    });
    
    if (!modelsResponse.ok) {
       throw new Error("Clé Groq invalide ou compte non autorisé.");
    }
    
    const modelsData = await modelsResponse.json();
    if (!modelsData.data || modelsData.data.length === 0) {
       throw new Error("Ton compte Groq n'a accès à aucun modèle gratuit actuellement.");
    }
    
    // On sélectionne automatiquement le premier modèle disponible (ex: mixtral-8x7b-32768)
    const activeModel = modelsData.data[0].id;

    // 2. Récupération de tes données
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

    // 3. Formatage propre
    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content }))
    ];

    // 4. 🟢 REQUÊTE NATIVE AVEC LE MODÈLE DÉTECTÉ AUTOMATIQUEMENT
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: activeModel, // 👈 Utilise le modèle validé à 100%
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