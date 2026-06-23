import { NextResponse } from "next/server";
import { products } from "@/data/products";

type CheckoutCustomer = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  address?: unknown;
  city?: unknown;
  state?: unknown;
  postalCode?: unknown;
  preferredContact?: unknown;
};

type CheckoutPayload = {
  customer?: CheckoutCustomer;
  items?: Array<{ id?: unknown; quantity?: unknown }>;
  total?: unknown;
  acceptedPolicies?: unknown;
  tokenId?: unknown;
};

type ValidatedOrder = {
  customer: Record<"name" | "email" | "phone" | "address" | "city" | "state" | "postalCode" | "preferredContact", string>;
  items: Array<{ id: number; slug: string; name: string; quantity: number; unitPrice: number; description: string }>;
  total: number;
  tokenId: string;
};

type ConektaErrorPayload = {
  message?: unknown;
  details?: Array<{ message?: unknown; debug_message?: unknown }>;
};

type ConektaOrderResponse = {
  id?: string;
  amount?: number;
  currency?: string;
  payment_status?: string;
  charges?: {
    data?: Array<{
      id?: string;
      status?: string;
      failure_code?: string;
      failure_message?: string;
    }>;
  };
};

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function truncate(value: string, maxLength = 500) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getConektaMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") return "Conekta no devolvio detalle del error.";

  const errorPayload = payload as ConektaErrorPayload;
  const details = errorPayload.details
    ?.map((detail) => text(detail.message) || text(detail.debug_message))
    .filter(Boolean);

  return details?.length ? details.join(" | ") : text(errorPayload.message) || "Conekta no devolvio detalle del error.";
}

function validateOrder(body: CheckoutPayload): ValidatedOrder | null {
  const customer = body.customer;
  const tokenId = text(body.tokenId);
  if (body.acceptedPolicies !== true || !customer || !Array.isArray(body.items) || !body.items.length || !tokenId) return null;

  const validatedCustomer = {
    name: text(customer.name),
    email: text(customer.email),
    phone: text(customer.phone),
    address: text(customer.address),
    city: text(customer.city),
    state: text(customer.state),
    postalCode: text(customer.postalCode),
    preferredContact: text(customer.preferredContact) || "WhatsApp",
  };
  if (Object.values(validatedCustomer).some((value) => !value)) return null;
  if (!isValidEmail(validatedCustomer.email)) return null;

  const validatedItems = body.items.map((item) => {
    const id = Number(item.id);
    const quantity = Number(item.quantity);
    const product = products.find((entry) => entry.id === id);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) return null;
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      quantity,
      unitPrice: product.price,
      description: product.description,
    };
  });
  if (validatedItems.some((item) => !item)) return null;

  const items = validatedItems as ValidatedOrder["items"];
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  if (body.total !== undefined && Number(body.total) !== total) return null;

  return { customer: validatedCustomer, items, total, tokenId };
}

async function createCardOrder(order: ValidatedOrder) {
  const privateKey = process.env.CONEKTA_PRIVATE_KEY;
  if (!privateKey) {
    console.error("Conekta card charge blocked: CONEKTA_PRIVATE_KEY is not configured.");
    throw new Error("La pasarela de pago no esta configurada. Intenta nuevamente mas tarde.");
  }

  const orderSummary = order.items.map((item) => `${item.quantity} x ${item.name}`).join("; ");
  const payload = {
    currency: "MXN",
    customer_info: {
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
    },
    line_items: order.items.map((item) => ({
      name: item.name,
      description: truncate(item.description, 250),
      unit_price: item.unitPrice * 100,
      quantity: item.quantity,
      metadata: {
        product_id: String(item.id),
        product_slug: item.slug,
      },
    })),
    charges: [
      {
        payment_method: {
          type: "card",
          token_id: order.tokenId,
        },
      },
    ],
    metadata: {
      order_summary: truncate(orderSummary),
      order_total_mxn: String(order.total),
      shipping_address: truncate(`${order.customer.address}, ${order.customer.city}, ${order.customer.state}, ${order.customer.postalCode}`),
      preferred_contact: truncate(order.customer.preferredContact),
      integration_flow: "simple_card_token",
    },
  };

  console.log("Creating simple Conekta card order", {
    totalMxn: order.total,
    itemCount: order.items.length,
    tokenReceived: Boolean(order.tokenId),
  });

  const response = await fetch("https://api.conekta.io/orders", {
    method: "POST",
    headers: {
      Accept: "application/vnd.conekta-v2.2.0+json",
      "Accept-Language": "es",
      Authorization: `Bearer ${privateKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responsePayload = (await response.json().catch(() => null)) as ConektaOrderResponse | ConektaErrorPayload | null;
  console.log("Simple Conekta card response", {
    ok: response.ok,
    status: response.status,
    orderId: "id" in (responsePayload || {}) ? (responsePayload as ConektaOrderResponse).id : undefined,
    paymentStatus: "payment_status" in (responsePayload || {}) ? (responsePayload as ConektaOrderResponse).payment_status : undefined,
  });

  if (!response.ok) {
    console.error("Simple Conekta card charge failed", {
      status: response.status,
      message: getConektaMessage(responsePayload),
      payload: responsePayload,
    });

    return {
      ok: false as const,
      status: response.status === 402 ? 402 : 400,
      message: response.status === 402 ? "El pago fue rechazado. Verifica los datos de tu tarjeta o intenta con otra." : "No fue posible procesar el pago. Revisa tus datos e intenta nuevamente.",
    };
  }

  return { ok: true as const, payload: responsePayload as ConektaOrderResponse };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CheckoutPayload | null;
  const order = body && validateOrder(body);
  if (!order) return NextResponse.json({ error: "Datos de pedido incompletos o invalidos." }, { status: 400 });

  try {
    const result = await createCardOrder(order);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });

    const charge = result.payload.charges?.data?.[0];
    return NextResponse.json({
      status: result.payload.payment_status || charge?.status || "paid",
      orderId: result.payload.id,
      chargeId: charge?.id,
      message: "Pago procesado correctamente. Nuestro equipo validara tu pedido y coordinara el seguimiento.",
    });
  } catch (error) {
    console.error("No fue posible procesar el pago con Conekta", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "No fue posible procesar el pago. Intenta nuevamente." }, { status: 500 });
  }
}
