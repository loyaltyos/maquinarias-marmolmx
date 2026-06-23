import Link from "next/link";
import { XCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";

export default function CheckoutCancelPage() {
  return (
    <section className="mx-auto min-h-[65vh] max-w-3xl px-4 py-20 text-center">
      <XCircle size={70} className="mx-auto text-red-600" />
      <h1 className="mt-5 text-4xl font-black uppercase">Pago no completado</h1>
      <p className="mt-4 font-bold text-zinc-600">
        El checkout de Conekta quedo pendiente, fue cancelado o no pudo completarse. No se realizo ningun cobro confirmado desde esta pantalla.
      </p>
      <p className="mt-2 text-sm text-zinc-500">Puedes volver al carrito e intentarlo de nuevo con tarjeta, OXXO Pay o SPEI.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/carrito" className="inline-block bg-zinc-900 px-6 py-4 text-sm font-black uppercase text-white">Volver al carrito</Link>
        <a href={whatsappUrl("Hola, quiero cotizar mi pedido de Maquinarias Marmol MX.")} target="_blank" className="inline-block bg-green-600 px-6 py-4 text-sm font-black uppercase text-white">Cotizar por WhatsApp</a>
      </div>
    </section>
  );
}
