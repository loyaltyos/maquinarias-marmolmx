"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CheckCircle2, ChevronLeft, CreditCard, Landmark, Store } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

const fields = [
  ["name", "Nombre completo", "text"],
  ["email", "Email", "email"],
  ["phone", "Teléfono", "tel"],
  ["address", "Dirección", "text"],
  ["city", "Ciudad", "text"],
  ["state", "Estado", "text"],
  ["postalCode", "Código postal", "text"],
] as const;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const customer = Object.fromEntries(formData.entries());
    /*
     * TARJETA EN PRODUCCIÓN:
     * Tokeniza los datos de tarjeta con Conekta.js y NEXT_PUBLIC_CONEKTA_PUBLIC_KEY.
     * Envía aquí únicamente cardToken. Nunca envíes números de tarjeta al servidor.
     */
    const cardToken = undefined;
    try {
      const response = await fetch("/api/conekta/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items, total: subtotal, paymentMethod, cardToken }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "No fue posible generar el pedido.");
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
        <p className="mt-4 font-bold text-zinc-600">Pago pendiente de confirmación.</p>
        <p className="mt-2 text-sm text-zinc-500">Nuestro equipo se pondrá en contacto contigo para dar seguimiento.</p>
        <Link href="/catalogo" className="mt-8 inline-block bg-zinc-900 px-6 py-4 text-sm font-black uppercase text-white">Volver al catálogo</Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto min-h-[65vh] max-w-3xl px-4 py-20">
        <h1 className="text-4xl font-black uppercase">Checkout</h1>
        <p className="mt-4 font-bold text-zinc-600">Agrega al menos un equipo antes de continuar.</p>
        <Link href="/catalogo" className="mt-6 inline-block bg-zinc-900 px-5 py-3 text-xs font-black uppercase text-white">Ver catálogo</Link>
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
            <h2 className="mb-5 text-xl font-black uppercase">Método de pago</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["card", "Tarjeta", CreditCard],
                ["oxxo", "OXXO", Store],
                ["spei", "SPEI", Landmark],
              ].map(([value, label, Icon]) => (
                <button type="button" key={value as string} onClick={() => setPaymentMethod(value as string)} className={`flex items-center gap-2 border-2 p-4 text-left text-sm font-black uppercase ${paymentMethod === value ? "border-red-600 bg-red-50 text-red-700" : "border-zinc-200"}`}>
                  <Icon size={19} /> {label as string}
                </button>
              ))}
            </div>
            <p className="mt-4 border-l-4 border-yellow-400 bg-yellow-50 p-3 text-xs font-bold leading-5 text-zinc-700">El pedido se validará antes de generar la referencia de pago. Mientras Conekta no tenga llaves configuradas, el checkout continuará funcionando en modo demo.</p>
            {error && <p className="mt-3 border-l-4 border-red-600 bg-red-50 p-3 text-xs font-bold leading-5 text-red-700">{error}</p>}
          </div>
        </div>
        <aside className="h-fit border-t-4 border-yellow-400 bg-zinc-900 p-6 text-white">
          <h2 className="text-xl font-black uppercase">Resumen del pedido</h2>
          <div className="my-5 space-y-3 border-y border-zinc-700 py-5">
            {items.map((item) => <div key={item.id} className="flex justify-between gap-3 text-xs"><span>{item.quantity} × {item.name}</span><strong>{formatPrice(item.price * item.quantity)}</strong></div>)}
          </div>
          <div className="flex justify-between text-lg font-black"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
          <button disabled={loading} className="mt-6 w-full bg-yellow-400 px-5 py-4 text-sm font-black uppercase text-black transition hover:bg-yellow-300 disabled:opacity-60">{loading ? "Generando pedido..." : "Generar pedido"}</button>
        </aside>
      </form>
    </section>
  );
}
