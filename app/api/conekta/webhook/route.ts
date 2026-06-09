import { NextResponse } from "next/server";

type ConektaEvent = {
  type?: unknown;
  data?: unknown;
};

const handledEvents = new Set([
  "order.paid",
  "order.pending_payment",
  "order.payment_failed",
  "order.canceled",
  "charge.paid",
  "charge.pending_payment",
  "charge.payment_failed",
  "charge.canceled",
]);

function hasValidSecret(request: Request) {
  const webhookSecret = process.env.CONEKTA_WEBHOOK_SECRET;
  if (!webhookSecret) return true;

  const headerSecret = request.headers.get("x-conekta-webhook-secret");
  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return headerSecret === webhookSecret || bearerToken === webhookSecret;
}

export async function POST(request: Request) {
  if (!hasValidSecret(request)) {
    return NextResponse.json({ error: "Webhook no autorizado." }, { status: 401 });
  }

  const event = (await request.json().catch(() => null)) as ConektaEvent | null;
  if (!event || typeof event.type !== "string") {
    return NextResponse.json({ error: "Evento invalido." }, { status: 400 });
  }

  if (handledEvents.has(event.type)) {
    console.log("Conekta event", event.type, event.data);
    // TODO: Guardar y actualizar ordenes cuando se agregue base de datos.
  } else {
    console.log("Conekta event no manejado", event.type, event.data);
  }

  return NextResponse.json({ received: true });
}
