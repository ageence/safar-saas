import { NextResponse } from "next/server";

// 1. Meta (WhatsApp) utilise une requête GET pour vérifier que ton serveur existe
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Remplace ce token par celui que tu définiras dans Meta
  const VERIFY_TOKEN = "safar_saas_secure_token";

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Interdit", { status: 403 });
}

// 2. Meta utilise POST pour t'envoyer les nouveaux messages des clients
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Vérifier si c'est bien un événement WhatsApp
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value.messages) {
            const message = change.value.messages[0];
            const clientPhone = message.from; // Numéro du client
            const textContent = message.text?.body; // Contenu du message
            
            // ICI : Tu pourras utiliser Prisma pour chercher ce numéro,
            // et enregistrer le message dans ton CRM ou créer un nouveau prospect.
            console.log(`Nouveau message WhatsApp de ${clientPhone} : ${textContent}`);
          }
        }
      }
    }

    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  } catch (error) {
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}