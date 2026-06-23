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
type ConektaPaymentMethod = "card" | "cash" | "bank_transfer";

type CheckoutPayload = {
  customer?: CheckoutCustomer;
  items?: Array<{ id?: unknown; quantity?: unknown }>;
  total?: unknown;
  acceptedPolicies?: unknown;
  paymentMethod?: unknown;
};

type ValidatedOrder = {
  customer: Record<"name" | "email" | "phone" | "address" | "city" | "state" | "postalCode" | "preferredContact", string>;
  items: Array<{ id: number; slug: string; name: string; quantity: number; unitPrice: number; description: string }>;
  total: number;
  paymentMethod: PaymentMethod;
};

type ConektaOrderResponse = {
  id?: string;
  object?: string;
  livemode?: boolean;
  amount?: number;
  currency?: string;
  payment_status?: string;
  checkout?: {
    id?: string;
    url?: string;
    object?: string;
    livemode?: boolean;
  };
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeSiteUrl(value: string | undefined) {
  return (value || "https://www.maquinariasmarmol.com.mx").replace(/\/+$/, "");
}

function getConektaMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") return "Conekta no devolvio detalle del error.";

  const errorPayload = payload as {
    message?: unknown;
    details?: Array<{ message?: unknown; debug_message?: unknown }>;
  };
  const details = errorPayload.details
    ?.map((detail) => text(detail.message) || text(detail.debug_message))
    .filter(Boolean);

  return details?.length ? details.join(" | ") : text(errorPayload.message) || "Conekta no devolvio detalle del error.";
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

  return {
    customer: validatedCustomer,
    items,
    total,
    paymentMethod: normalizePaymentMethod(body.paymentMethod),
  };
}

async function createConektaOrder(order: ValidatedOrder) {
  const privateKey = process.env.CONEKTA_PRIVATE_KEY;
  if (!privateKey) {
    console.error("Conekta order blocked: CONEKTA_PRIVATE_KEY is not configured.");
    throw new Error("La pasarela de pago no esta configurada. Intenta nuevamente mas tarde.");
  }

  const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const orderSummary = order.items.map((item) => `${item.quantity} x ${item.name}`).join("; ");
  const allowedPaymentMethods: ConektaPaymentMethod[] = ["card", "cash", "bank_transfer"];
  const requestPayload = {
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
    checkout: {
      type: "HostedPayment",
      name: "Maquinarias Marmol MX",
      allowed_payment_methods: allowedPaymentMethods,
      success_url: `${siteUrl}/checkout/success`,
      failure_url: `${siteUrl}/checkout/cancel`,
      redirection_time: 3,
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
      enabled_payment_methods: allowedPaymentMethods.join(","),
    },
  };

  console.log("Creating Conekta TEST order", {
    totalMxn: order.total,
    itemCount: order.items.length,
    allowedPaymentMethods,
    checkoutType: requestPayload.checkout.type,
    siteUrl,
    publicKeyConfigured: Boolean(process.env.NEXT_PUBLIC_CONEKTA_PUBLIC_KEY),
    siteUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
  });

  const response = await fetch("https://api.conekta.io/orders", {
    method: "POST",
    headers: {
      Accept: "application/vnd.conekta-v2.2.0+json",
      "Accept-Language": "es",
      Authorization: `Bearer ${privateKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestPayload),
  });

  const payload = (await response.json().catch(() => null)) as ConektaOrderResponse | null;
  console.log("Conekta order response", {
    ok: response.ok,
    status: response.status,
    orderId: payload?.id,
    checkoutId: payload?.checkout?.id,
    hasCheckoutUrl: Boolean(payload?.checkout?.url),
    paymentStatus: payload?.payment_status,
    livemode: payload?.livemode,
  });

  if (!response.ok) {
    console.error("Conekta order creation failed", {
      status: response.status,
      message: getConektaMessage(payload),
      payload,
    });
    throw new Error("No fue posible generar el pago. Intenta nuevamente.");
  }

  if (!payload?.checkout?.url) {
    console.error("Conekta order missing checkout URL", payload);
    throw new Error("Conekta no devolvio una URL de checkout. Intenta nuevamente.");
  }

  return payload;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CheckoutPayload | null;
  const order = body && validateOrder(body);
  if (!order) return NextResponse.json({ error: "Datos de pedido incompletos o invalidos." }, { status: 400 });

  try {
    const conektaOrder = await createConektaOrder(order);

    return NextResponse.json({
      mode: "conekta",
      status: "pending_payment",
      orderId: conektaOrder.id,
      checkoutId: conektaOrder.checkout?.id,
      url: conektaOrder.checkout?.url,
      message: "Orden creada correctamente. Te redirigiremos al checkout seguro de Conekta.",
      paymentMethods: ["card", "spei", "oxxo_cash"],
    });
  } catch (error) {
    console.error("No fue posible preparar la orden de Conekta", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "No fue posible generar el pago. Intenta nuevamente." }, { status: 502 });
  }
}
