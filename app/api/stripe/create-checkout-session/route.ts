import { NextResponse } from "next/server";
import Stripe from "stripe";
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
};

type ValidatedOrder = {
  customer: Record<"name" | "email" | "phone" | "address" | "city" | "state" | "postalCode" | "preferredContact", string>;
  items: Array<{ id: number; name: string; quantity: number; unitPrice: number }>;
  total: number;
};

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function truncate(value: string, maxLength = 500) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
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

  return { customer: validatedCustomer, items, total };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CheckoutPayload | null;
  const order = body && validateOrder(body);
  if (!order) return NextResponse.json({ error: "Datos de pedido incompletos o invalidos." }, { status: 400 });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({
      mode: "demo",
      status: "pending_confirmation",
      orderId: `demo-${Date.now()}`,
      message: "Pedido generado correctamente. Pago pendiente de confirmacion.",
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maquinariasmarmol.com.mx";
  const orderSummary = order.items.map((item) => `${item.quantity} x ${item.name}`).join("; ");
  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "mxn",
      customer_email: order.customer.email,
      line_items: order.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "mxn",
          product_data: {
            name: item.name,
            metadata: { product_id: String(item.id) },
          },
          unit_amount: item.unitPrice * 100,
        },
      })),
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      metadata: {
        customer_name: truncate(order.customer.name),
        customer_email: truncate(order.customer.email),
        customer_phone: truncate(order.customer.phone),
        order_summary: truncate(orderSummary),
        order_total_mxn: String(order.total),
        shipping_address: truncate(`${order.customer.address}, ${order.customer.city}, ${order.customer.state}, ${order.customer.postalCode}`),
        preferred_contact: truncate(order.customer.preferredContact),
      },
      payment_intent_data: {
        metadata: {
          customer_name: truncate(order.customer.name),
          customer_email: truncate(order.customer.email),
          customer_phone: truncate(order.customer.phone),
          order_summary: truncate(orderSummary),
          order_total_mxn: String(order.total),
        },
      },
    });

    return NextResponse.json({ mode: "stripe", sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("No fue posible crear la sesion de Stripe Checkout", error);
    return NextResponse.json({ error: "No fue posible generar el pago. Intenta nuevamente." }, { status: 502 });
  }
}
