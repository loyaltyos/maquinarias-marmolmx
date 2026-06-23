"use client";

import Link from "next/link";
import Script from "next/script";
import { FormEvent, useState } from "react";
import { Check, CheckCircle2, ChevronLeft, CreditCard, LockKeyhole, MessageCircle, ShieldCheck } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";

declare global {
  interface Window {
    Conekta?: {
      setPublicKey: (key: string) => void;
      Token: {
        create: (
          data: {
            card: {
              name: string;
              number: string;
              exp_month: string;
              exp_year: string;
              cvc: string;
            };
          },
          success: (token: { id: string }) => void,
          error: (error: { message_to_purchaser?: string; message?: string }) => void,
        ) => void;
      };
    };
  }
}

const fields = [
  ["name", "Nombre completo", "text"],
  ["email", "Email", "email"],
  ["phone", "Telefono", "tel"],
  ["address", "Direccion", "text"],
  ["city", "Ciudad", "text"],
  ["state", "Estado", "text"],
  ["postalCode", "Codigo postal", "text"],
] as const;

type CheckoutResponse = {
  error?: string;
  status?: string;
  orderId?: string;
  chargeId?: string;
  message?: string;
};

const publicConektaKey = process.env.NEXT_PUBLIC_CONEKTA_PUBLIC_KEY || "";
const inputClassName =
  "w-full border-2 border-zinc-300 bg-white px-4 py-4 text-base font-black text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-yellow-400 focus:shadow-[0_0_0_3px_rgba(250,204,21,0.28)]";

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .slice(0, 19);
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function detectCardType(value: string) {
  const digits = value.replace(/\D/g, "");
  if (/^3[47]/.test(digits)) return "amex";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
  if (/^4/.test(digits)) return "visa";
  return "unknown";
}

function CardBrand({ type }: { type: string }) {
  const label = type === "visa" ? "VISA" : type === "mastercard" ? "MC" : type === "amex" ? "AMEX" : "CARD";
  const className =
    type === "visa"
      ? "border-blue-700 bg-blue-700 text-white"
      : type === "mastercard"
        ? "border-red-600 bg-zinc-950 text-yellow-400"
        : type === "amex"
          ? "border-sky-600 bg-sky-600 text-white"
          : "border-zinc-400 bg-zinc-100 text-zinc-600";

  return (
    <span className={`min-w-14 border px-2 py-1 text-center text-[10px] font-black tracking-wide ${className}`}>
      {label}
    </span>
  );
}

function SecurityBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 border border-zinc-300 bg-zinc-50 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-zinc-700">
      <ShieldCheck size={14} className="text-green-600" />
      {label}
    </span>
  );
}

function tokenizeCard(card: { name: string; number: string; expiry: string; cvc: string }) {
  return new Promise<string>((resolve, reject) => {
    const [month = "", year = ""] = card.expiry.split("/");
    const expYear = year.trim().length === 2 ? `20${year.trim()}` : year.trim();

    if (!window.Conekta) {
      reject(new Error("No fue posible cargar Conekta.js. Intenta nuevamente."));
      return;
    }

    window.Conekta.Token.create(
      {
        card: {
          name: card.name.trim(),
          number: card.number.replace(/\s+/g, ""),
          exp_month: month.trim(),
          exp_year: expYear,
          cvc: card.cvc.trim(),
        },
      },
      (token) => resolve(token.id),
      (tokenError) => reject(new Error(tokenError.message_to_purchaser || tokenError.message || "Los datos de la tarjeta no son validos.")),
    );
  });
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [error, setError] = useState("");
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvc: "" });
  const cardType = detectCardType(card.number);

  function handleConektaReady() {
    if (publicConektaKey && window.Conekta) {
      window.Conekta.setPublicKey(publicConektaKey);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    if (!acceptedPolicies) {
      setError("Debes aceptar las politicas antes de continuar.");
      return;
    }

    if (!publicConektaKey) {
      setError("La llave publica de Conekta no esta configurada.");
      return;
    }

    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const customer = Object.fromEntries(formData.entries());

    try {
      const tokenId = await tokenizeCard(card);
      const response = await fetch("/api/conekta/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items, total: subtotal, acceptedPolicies, tokenId }),
      });
      const result = (await response.json()) as CheckoutResponse;
      if (!response.ok) throw new Error(result.error || "No fue posible procesar el pago.");

      clearCart();
      setCard({ name: "", number: "", expiry: "", cvc: "" });
      setSuccessMessage(result.message || "Pago procesado correctamente. Nuestro equipo validara tu pedido.");
      setPaymentReference(result.orderId || result.chargeId || `MMX-${Date.now().toString().slice(-6)}`);
      setSuccess(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No pudimos conectar con Conekta. Revisa tus datos e intenta nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="mx-auto min-h-[65vh] max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto flex size-20 animate-[success-pop_.45s_ease-out] items-center justify-center rounded-full border-4 border-green-600 bg-green-50 text-green-700">
          <CheckCircle2 size={52} />
        </div>
        <h1 className="mt-5 text-4xl font-black uppercase">Pago aprobado</h1>
        <p className="mt-4 font-bold text-zinc-600">{successMessage}</p>
        <div className="mx-auto mt-6 max-w-sm border-2 border-zinc-300 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">Referencia</p>
          <p className="mt-1 break-all text-lg font-black text-zinc-900">{paymentReference}</p>
        </div>
        <p className="mt-5 text-sm font-bold text-zinc-600">Nuestro equipo te contactara para coordinar entrega y seguimiento.</p>
        <p className="mt-2 text-xs text-zinc-500">No almacenamos datos de tarjeta. El cobro fue procesado mediante tokenizacion segura de Conekta.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={whatsappUrl(`Hola, realice un pago en Maquinarias Marmol MX. Referencia: ${paymentReference}`)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-green-600 px-6 py-4 text-sm font-black uppercase text-white transition hover:bg-green-700">
            <MessageCircle size={18} /> Contactar por WhatsApp
          </a>
          <Link href="/catalogo" className="inline-flex items-center justify-center bg-zinc-900 px-6 py-4 text-sm font-black uppercase text-white">Volver al catalogo</Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto min-h-[65vh] max-w-3xl px-4 py-20">
        <h1 className="text-4xl font-black uppercase">Checkout</h1>
        <p className="mt-4 font-bold text-zinc-600">Agrega al menos un equipo antes de continuar.</p>
        <Link href="/catalogo" className="mt-6 inline-block bg-zinc-900 px-5 py-3 text-xs font-black uppercase text-white">Ver catalogo</Link>
      </section>
    );
  }

  return (
    <>
      <Script src="https://cdn.conekta.io/js/latest/conekta.js" strategy="afterInteractive" onLoad={handleConektaReady} />
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <Link href="/carrito" className="mb-5 flex items-center gap-1 text-xs font-black uppercase text-zinc-600"><ChevronLeft size={17} /> Volver al carrito</Link>
        <h1 className="text-4xl font-black uppercase">Finalizar compra</h1>
        <p className="mt-2 text-sm font-bold text-zinc-500">Completa tus datos y paga con tarjeta de forma segura.</p>
        <form onSubmit={submit} className="mt-8 grid gap-7 lg:grid-cols-[1fr_360px]">
          <div className="space-y-7">
            <div className="border border-zinc-300 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-xl font-black uppercase">Datos de contacto y entrega</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map(([name, label, type]) => (
                  <label key={name} className={name === "address" ? "sm:col-span-2" : ""}>
                    <span className="mb-2 block text-xs font-black uppercase text-zinc-600">{label}</span>
                    <input required name={name} type={type} className={inputClassName} />
                  </label>
                ))}
                <label>
                  <span className="mb-2 block text-xs font-black uppercase text-zinc-600">Contacto preferido</span>
                  <select name="preferredContact" className={inputClassName}>
                    <option>WhatsApp</option><option>Llamada</option><option>Email</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="border border-zinc-300 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <CreditCard size={22} className="text-red-600" />
                <h2 className="text-xl font-black uppercase">Pago con tarjeta</h2>
              </div>
              <div className="flex items-start gap-3 border-2 border-zinc-200 p-4 text-sm font-bold text-zinc-700">
                <ShieldCheck size={22} className="mt-0.5 shrink-0 text-green-600" />
                <p>La tarjeta se tokeniza en tu navegador con Conekta.js. Maquinarias Marmol MX nunca recibe ni guarda los datos de tu tarjeta.</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <SecurityBadge label="Pago seguro" />
                <SecurityBadge label="Tokenizacion Conekta" />
                <SecurityBadge label="SSL seguro" />
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-black uppercase text-zinc-600">Nombre en la tarjeta</span>
                  <input
                    required
                    autoComplete="cc-name"
                    value={card.name}
                    onChange={(event) => setCard((current) => ({ ...current, name: event.target.value }))}
                    className={inputClassName}
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-black uppercase text-zinc-600">Numero de tarjeta</span>
                  <div className="flex items-center gap-3 border-2 border-zinc-300 bg-white px-4 py-3 shadow-sm transition focus-within:border-yellow-400 focus-within:shadow-[0_0_0_3px_rgba(250,204,21,0.28)]">
                    <input
                      required
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="4242 4242 4242 4242"
                      value={card.number}
                      onChange={(event) => setCard((current) => ({ ...current, number: formatCardNumber(event.target.value) }))}
                      className="min-w-0 flex-1 bg-transparent py-1 text-base font-black text-zinc-900 outline-none placeholder:text-zinc-400"
                    />
                    <CardBrand type={cardType} />
                  </div>
                </label>
                <label>
                  <span className="mb-2 block text-xs font-black uppercase text-zinc-600">Expiracion</span>
                  <input
                    required
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/AA"
                    value={card.expiry}
                    onChange={(event) => setCard((current) => ({ ...current, expiry: formatExpiry(event.target.value) }))}
                    className={inputClassName}
                  />
                </label>
                <label>
                  <span className="mb-2 block text-xs font-black uppercase text-zinc-600">CVV</span>
                  <input
                    required
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    value={card.cvc}
                    onChange={(event) => setCard((current) => ({ ...current, cvc: event.target.value.replace(/\D/g, "").slice(0, 4) }))}
                    className={inputClassName}
                  />
                </label>
              </div>
              {error && <p className="mt-4 border-l-4 border-red-600 bg-red-50 p-3 text-xs font-bold leading-5 text-red-700">{error}</p>}
            </div>

            <label className="flex items-start gap-3 border border-zinc-300 bg-white p-4 text-xs font-bold leading-5 text-zinc-700 shadow-sm">
              <input required type="checkbox" checked={acceptedPolicies} onChange={(event) => setAcceptedPolicies(event.target.checked)} className="mt-1 size-4 shrink-0 accent-red-600" />
              <span>
                He leido y acepto los <Link href="/terminos-y-condiciones" target="_blank" className="text-red-700 underline">Terminos y Condiciones</Link>, <Link href="/aviso-de-privacidad" target="_blank" className="text-red-700 underline">Aviso de Privacidad</Link>, <Link href="/envios" target="_blank" className="text-red-700 underline">Politica de Envios</Link> y <Link href="/devoluciones-y-reembolsos" target="_blank" className="text-red-700 underline">Politica de Devoluciones</Link>.
              </span>
            </label>
          </div>
          <aside className="h-fit border-t-4 border-yellow-400 bg-zinc-900 p-6 text-white">
            <h2 className="text-xl font-black uppercase">Resumen del pedido</h2>
            <div className="my-5 space-y-3 border-y border-zinc-700 py-5">
              {items.map((item) => <div key={item.id} className="flex justify-between gap-3 text-xs"><span>{item.quantity} x {item.name}</span><strong>{formatPrice(item.price * item.quantity)}</strong></div>)}
            </div>
            <div className="flex justify-between text-lg font-black"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
            <button disabled={loading || !acceptedPolicies} className="mt-6 flex w-full items-center justify-center gap-2 bg-yellow-400 px-5 py-4 text-sm font-black uppercase text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50">
              {loading && <span className="size-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />}
              {loading ? "Procesando pago seguro..." : "Pagar con tarjeta"}
            </button>
            <div className="mt-4 grid gap-2 text-xs font-bold text-zinc-300">
              <p className="flex items-center gap-2"><LockKeyhole size={15} className="text-yellow-400" /> Pago seguro con Conekta</p>
              <p className="flex items-center gap-2"><Check size={15} className="text-yellow-400" /> Tokenizacion sin almacenar tarjeta</p>
            </div>
          </aside>
        </form>
      </section>
      <style jsx global>{`
        @keyframes success-pop {
          0% {
            opacity: 0;
            transform: scale(0.72);
          }
          70% {
            opacity: 1;
            transform: scale(1.08);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
