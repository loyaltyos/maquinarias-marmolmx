import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!secretKey || !webhookSecret) {
    console.warn("Stripe webhook recibido sin STRIPE_SECRET_KEY o STRIPE_WEBHOOK_SECRET configurado.");
    return NextResponse.json({ received: true, mode: "demo" });
  }

  if (!signature) {
    return NextResponse.json({ error: "Firma de Stripe faltante." }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed":
      case "payment_intent.succeeded":
      case "payment_intent.payment_failed":
        console.log("Stripe event", event.type, event.data.object);
        // TODO: guardar/actualizar orden cuando exista base de datos.
        break;
      default:
        console.log("Stripe event no manejado", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("No fue posible verificar el webhook de Stripe", error);
    return NextResponse.json({ error: "Webhook invalido." }, { status: 400 });
  }
}
