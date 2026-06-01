import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const webhookSecret = process.env.CONEKTA_WEBHOOK_SECRET;

  /*
   * WEBHOOK CONEKTA:
   * 1. Registra esta URL pública en el panel de Conekta:
   *    https://tu-dominio.com/api/conekta/webhook
   * 2. Configura CONEKTA_WEBHOOK_SECRET únicamente en el servidor.
   * 3. Antes de activar producción, implementa aquí la verificación criptográfica
   *    exacta indicada por Conekta para tu cuenta y procesa solo eventos verificados.
   * 4. Usa los eventos confirmados para actualizar el estado interno del pedido.
   */
  if (!webhookSecret) return NextResponse.json({ error: "Webhook no configurado." }, { status: 503 });
  await request.text();
  return NextResponse.json({ error: "Verificación de webhook pendiente de activar." }, { status: 501 });
}
