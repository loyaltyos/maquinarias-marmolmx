import { NextResponse } from "next/server";
import { products } from "@/data/products";

type PaymentMethod = "card" | "oxxo" | "spei";

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
  paymentMethod?: unknown;
  cardToken?: unknown;
};

type ValidatedOrder = {
  customer: Record<"name" | "email" | "phone" | "address" | "city" | "state" | "postalCode" | "preferredContact", string>;
  items: Array<{ id: number; name: string; quantity: number; unitPrice: number }>;
  total: number;
  paymentMethod: PaymentMethod;
  cardToken?: string;
};

const paymentMethods: PaymentMethod[] = ["card", "oxxo", "spei"];

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validateOrder(body: CheckoutPayload): ValidatedOrder | null {
  const customer = body.customer;
  const paymentMethod = text(body.paymentMethod) as PaymentMethod;
  if (!customer || !paymentMethods.includes(paymentMethod) || !Array.isArray(body.items) || !body.items.length) return null;

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

  const validatedItems = body.items.map((item) => {
    const id = Number(item.id);
    const quantity = Number(item.quantity);
    const product = products.find((entry) => entry.id === id);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) return null;
    return { id: product.id, name: product.name, quantity, unitPrice: product.price };
  });
  if (validatedItems.some((item) => !item)) return null;

  const items = validatedItems as ValidatedOrder["items"];
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  if (Number(body.total) !== total) return null;

  const cardToken = text(body.cardToken);
  return { customer: validatedCustomer, items, total, paymentMethod, cardToken: cardToken || undefined };
}

function paymentMethodForConekta(order: ValidatedOrder) {
  if (order.paymentMethod === "card") {
    if (!order.cardToken) throw new Error("CARD_TOKEN_REQUIRED");
    return { type: "card", token_id: order.cardToken };
  }
  if (order.paymentMethod === "oxxo") {
    return { type: "cash", expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 };
  }
  return { type: "spei" };
}

function conektaPayload(order: ValidatedOrder) {
  return {
    currency: "MXN",
    customer_info: {
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
    },
    line_items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice * 100,
      sku: String(item.id),
    })),
    shipping_contact: {
      receiver: order.customer.name,
      phone: order.customer.phone,
      address: {
        street1: order.customer.address,
        city: order.customer.city,
        state: order.customer.state,
        postal_code: order.customer.postalCode,
        country: "MX",
      },
    },
    charges: [{ payment_method: paymentMethodForConekta(order) }],
    metadata: { preferred_contact: order.customer.preferredContact },
  };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CheckoutPayload | null;
  const order = body && validateOrder(body);
  if (!order) return NextResponse.json({ error: "Datos de pedido incompletos o inválidos." }, { status: 400 });

  /*
   * DEMO -> PRODUCCIÓN:
   * Configura CONEKTA_PRIVATE_KEY únicamente en el entorno privado del servidor.
   * Mientras no exista, esta ruta valida todo el pedido pero no llama a Conekta.
   */
  const privateKey = process.env.CONEKTA_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json({
      mode: "demo",
      status: "pending_confirmation",
      orderId: `demo-${Date.now()}`,
      message: "Pedido generado correctamente. Pago pendiente de confirmación.",
    });
  }

  if (order.paymentMethod === "card" && !order.cardToken) {
    return NextResponse.json({ error: "Falta el token seguro de la tarjeta." }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.conekta.io/orders", {
      method: "POST",
      headers: {
        Accept: "application/vnd.conekta-v2.2.0+json",
        "Accept-Language": "es",
        Authorization: `Bearer ${privateKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conektaPayload(order)),
    });
    const conektaOrder = (await response.json()) as {
      id?: string;
      payment_status?: string;
      charges?: { data?: Array<{ payment_method?: { type?: string; reference?: string; clabe?: string } }> };
      details?: Array<{ message?: string }>;
    };
    if (!response.ok) {
      console.error("Conekta rechazó la orden", response.status, conektaOrder.details);
      return NextResponse.json({ error: "No fue posible generar el pago. Revisa tus datos e intenta nuevamente." }, { status: 502 });
    }
    const payment = conektaOrder.charges?.data?.[0]?.payment_method;
    return NextResponse.json({
      mode: "conekta",
      status: conektaOrder.payment_status ?? "pending_payment",
      orderId: conektaOrder.id,
      paymentMethod: payment?.type ?? order.paymentMethod,
      paymentReference: payment?.reference,
      clabe: payment?.clabe,
      message: "Pedido generado correctamente. Pago pendiente de confirmación.",
    });
  } catch (error) {
    console.error("No fue posible conectar con Conekta", error);
    return NextResponse.json({ error: "No fue posible conectar con el servicio de pago." }, { status: 502 });
  }
}
