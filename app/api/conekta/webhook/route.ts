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

export async function POST(request: Request) {
  const event = (await request.json().catch(() => null)) as ConektaEvent | null;
  if (!event || typeof event.type !== "string") {
    return NextResponse.json({ error: "Evento invalido." }, { status: 400 });
  }

  if (handledEvents.has(event.type)) {
    console.log("Conekta event", { type: event.type });
    // TODO: Guardar y actualizar ordenes cuando se agregue base de datos.
  } else {
    console.log("Conekta event no manejado", { type: event.type });
  }

  return NextResponse.json({ received: true });
}
