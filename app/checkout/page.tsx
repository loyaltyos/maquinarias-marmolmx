"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CheckCircle2, ChevronLeft, ShieldCheck } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

const fields = [
  ["name", "Nombre completo", "text"],
  ["email", "Email", "email"],
  ["phone", "Telefono", "tel"],
  ["address", "Direccion", "text"],
  ["city", "Ciudad", "text"],
  ["state", "Estado", "text"],
  ["postalCode", "Codigo postal", "text"],
] as const;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!acceptedPolicies) {
      setError("Debes aceptar las politicas antes de continuar.");
      return;
    }

    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const customer = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items, total: subtotal, acceptedPolicies }),
      });
      const result = (await response.json()) as { error?: string; mode?: "demo" | "stripe"; url?: string };
      if (!response.ok) throw new Error(result.error || "No fue posible generar el pedido.");

      if (result.url) {
        window.location.assign(result.url);
        return;
      }

      clearCart();
      setSuccess(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No fue posible generar el pedido.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="mx-auto min-h-[65vh] max-w-3xl px-4 py-20 text-center">
        <CheckCircle2 size={70} className="mx-auto text-green-600" />
        <h1 className="mt-5 text-4xl font-black uppercase">Pedido generado correctamente</h1>
        <p className="mt-4 font-bold text-zinc-600">Pago pendiente de confirmacion.</p>
        <p className="mt-2 text-sm text-zinc-500">Nuestro equipo se pondra en contacto contigo para dar seguimiento.</p>
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
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <Link href="/carrito" className="mb-5 flex items-center gap-1 text-xs font-black uppercase text-zinc-600"><ChevronLeft size={17} /> Volver al carrito</Link>
      <h1 className="text-4xl font-black uppercase">Finalizar compra</h1>
      <p className="mt-2 text-sm font-bold text-zinc-500">Completa tus datos para generar el pedido.</p>
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
            <h2 className="mb-5 text-xl font-black uppercase">Pago seguro</h2>
            <div className="flex items-start gap-3 border-2 border-zinc-200 p-4 text-sm font-bold text-zinc-700">
              <ShieldCheck size={22} className="mt-0.5 shrink-0 text-green-600" />
              <p>Al continuar, te enviaremos a Stripe Checkout para completar el pago de forma segura.</p>
            </div>
            <p className="mt-4 border-l-4 border-yellow-400 bg-yellow-50 p-3 text-xs font-bold leading-5 text-zinc-700">Validaremos tu pedido y te confirmaremos el seguimiento del pago. Tus datos se procesan de forma segura.</p>
            {error && <p className="mt-3 border-l-4 border-red-600 bg-red-50 p-3 text-xs font-bold leading-5 text-red-700">{error}</p>}
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
          <button disabled={loading || !acceptedPolicies} className="mt-6 w-full bg-yellow-400 px-5 py-4 text-sm font-black uppercase text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Redirigiendo..." : "Pagar ahora"}</button>
        </aside>
      </form>
    </section>
  );
}
