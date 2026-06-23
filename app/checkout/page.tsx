"use client";

import Link from "next/link";
import Script from "next/script";
import { FormEvent, useState } from "react";
import { CheckCircle2, ChevronLeft, CreditCard, ShieldCheck } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

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
  const [error, setError] = useState("");
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvc: "" });

  function handleConektaReady() {
    if (publicConektaKey && window.Conekta) {
      window.Conekta.setPublicKey(publicConektaKey);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        <CheckCircle2 size={70} className="mx-auto text-green-600" />
        <h1 className="mt-5 text-4xl font-black uppercase">Pago aprobado</h1>
        <p className="mt-4 font-bold text-zinc-600">{successMessage}</p>
        <p className="mt-2 text-sm text-zinc-500">No almacenamos datos de tarjeta. El cobro fue procesado mediante tokenizacion segura de Conekta.</p>
        <Link href="/catalogo" className="mt-8 inline-block bg-zinc-900 px-6 py-4 text-sm font-black uppercase text-white">Volver al catalogo</Link>
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
                    <input required name={name} type={type} className="w-full border border-zinc-300 px-3 py-3 text-sm font-bold outline-none focus:border-red-600" />
                  </label>
                ))}
                <label>
                  <span className="mb-2 block text-xs font-black uppercase text-zinc-600">Contacto preferido</span>
                  <select name="preferredContact" className="w-full border border-zinc-300 px-3 py-3 text-sm font-bold outline-none">
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
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-black uppercase text-zinc-600">Nombre en la tarjeta</span>
                  <input
                    required
                    autoComplete="cc-name"
                    value={card.name}
                    onChange={(event) => setCard((current) => ({ ...current, name: event.target.value }))}
                    className="w-full border border-zinc-300 px-3 py-3 text-sm font-bold outline-none focus:border-red-600"
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-black uppercase text-zinc-600">Numero de tarjeta</span>
                  <input
                    required
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="4242 4242 4242 4242"
                    value={card.number}
                    onChange={(event) => setCard((current) => ({ ...current, number: event.target.value.replace(/[^\d\s]/g, "").slice(0, 23) }))}
                    className="w-full border border-zinc-300 px-3 py-3 text-sm font-bold outline-none focus:border-red-600"
                  />
                </label>
                <label>
                  <span className="mb-2 block text-xs font-black uppercase text-zinc-600">Expiracion</span>
                  <input
                    required
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/AA"
                    value={card.expiry}
                    onChange={(event) => setCard((current) => ({ ...current, expiry: event.target.value.replace(/[^\d/]/g, "").slice(0, 7) }))}
                    className="w-full border border-zinc-300 px-3 py-3 text-sm font-bold outline-none focus:border-red-600"
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
                    className="w-full border border-zinc-300 px-3 py-3 text-sm font-bold outline-none focus:border-red-600"
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
            <button disabled={loading || !acceptedPolicies} className="mt-6 w-full bg-yellow-400 px-5 py-4 text-sm font-black uppercase text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Procesando pago..." : "Pagar con tarjeta"}</button>
          </aside>
        </form>
      </section>
    </>
  );
}
