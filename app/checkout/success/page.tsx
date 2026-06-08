import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <section className="mx-auto min-h-[65vh] max-w-3xl px-4 py-20 text-center">
      <CheckCircle2 size={70} className="mx-auto text-green-600" />
      <h1 className="mt-5 text-4xl font-black uppercase">Pago recibido correctamente</h1>
      <p className="mt-4 font-bold text-zinc-600">
        Pago recibido correctamente. Gracias por tu compra. Nuestro equipo se comunicara contigo para coordinar entrega y seguimiento.
      </p>
      <Link href="/catalogo" className="mt-8 inline-block bg-zinc-900 px-6 py-4 text-sm font-black uppercase text-white">Volver al catalogo</Link>
    </section>
  );
}
