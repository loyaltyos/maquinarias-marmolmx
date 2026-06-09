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

type PaymentMethod = "card" | "spei" | "oxxo_cash";

type CheckoutPayload = {
  customer?: CheckoutCustomer;
  items?: Array<{ id?: unknown; quantity?: unknown }>;
  total?: unknown;
  acceptedPolicies?: unknown;
  paymentMethod?: unknown;
};

type ValidatedOrder = {
  customer: Record<"name" | "email" | "phone" | "address" | "city" | "state" | "postalCode" | "preferredContact", string>;
  items: Array<{ id: number; name: string; quantity: number; unitPrice: number }>;
  total: number;
  paymentMethod: PaymentMethod;
};

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function truncate(value: string, maxLength = 500) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
}

function normalizePaymentMethod(value: unknown): PaymentMethod {
  return value === "card" || value === "spei" || value === "oxxo_cash" ? value : "oxxo_cash";
}

function validateOrder(body: CheckoutPayload): ValidatedOrder | null {
  const customer = body.customer;
  if (body.acceptedPolicies !== true || !customer || !Array.isArray(body.items) || !body.items.length) return null;

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
  if (body.total !== undefined && Number(body.total) !== total) return null;

  return {
    customer: validatedCustomer,
    items,
    total,
    paymentMethod: normalizePaymentMethod(body.paymentMethod),
  };
}

async function createConektaOrder(order: ValidatedOrder) {
  const privateKey = process.env.CONEKTA_PRIVATE_KEY;
  if (!privateKey) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maquinariasmarmol.com.mx";
  const orderSummary = order.items.map((item) => `${item.quantity} x ${item.name}`).join("; ");
  const response = await fetch("https://api.conekta.io/orders", {
    method: "POST",
    headers: {
      Accept: "application/vnd.conekta-v2.1.0+json",
      Authorization: `Bearer ${privateKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currency: "MXN",
      customer_info: {
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone,
      },
      line_items: order.items.map((item) => ({
        name: item.name,
        unit_price: item.unitPrice * 100,
        quantity: item.quantity,
        metadata: { product_id: String(item.id) },
      })),
      checkout: {
        type: "Integration",
        allowed_payment_methods: ["card", "cash", "bank_transfer"],
        success_url: `${siteUrl}/checkout/success`,
        failure_url: `${siteUrl}/checkout/cancel`,
      },
      metadata: {
        customer_name: truncate(order.customer.name),
        customer_email: truncate(order.customer.email),
        customer_phone: truncate(order.customer.phone),
        order_summary: truncate(orderSummary),
        order_total_mxn: String(order.total),
        shipping_address: truncate(`${order.customer.address}, ${order.customer.city}, ${order.customer.state}, ${order.customer.postalCode}`),
        preferred_contact: truncate(order.customer.preferredContact),
        requested_payment_method: order.paymentMethod,
      },
    }),
  });

  const payload = (await response.json().catch(() => null)) as { id?: string; checkout?: { id?: string; url?: string } } | null;
  if (!response.ok) {
    console.error("No fue posible crear la orden de Conekta", payload);
    throw new Error("No fue posible generar el pago. Intenta nuevamente.");
  }

  return payload;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CheckoutPayload | null;
  const order = body && validateOrder(body);
  if (!order) return NextResponse.json({ error: "Datos de pedido incompletos o invalidos." }, { status: 400 });

  try {
    const conektaOrder = await createConektaOrder(order);
    if (!conektaOrder) {
      return NextResponse.json({
        mode: "demo",
        status: "pending_confirmation",
        orderId: `demo-${Date.now()}`,
        message: "Pedido generado correctamente. Pago pendiente de confirmacion.",
        paymentMethods: ["card", "spei", "oxxo_cash"],
      });
    }

    return NextResponse.json({
      mode: "conekta",
      status: "pending_payment",
      orderId: conektaOrder.id,
      checkoutId: conektaOrder.checkout?.id,
      url: conektaOrder.checkout?.url,
      paymentMethods: ["card", "spei", "oxxo_cash"],
    });
  } catch (error) {
    console.error("No fue posible preparar la orden de Conekta", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "No fue posible generar el pago. Intenta nuevamente." }, { status: 502 });
  }
}
