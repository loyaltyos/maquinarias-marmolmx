import {
  BadgeCheck,
  Building2,
  FileCheck2,
  Headphones,
  MessageSquareText,
  PackageCheck,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

const metrics = [
  ["+500", "Equipos comercializados", PackageCheck],
  ["+100", "Clientes atendidos", Users],
  ["+10", "Categorías industriales", Wrench],
  ["Nacional", "Cobertura en todo México", Truck],
] as const;

const benefits = [
  ["Atención personalizada", "Te ayudamos a elegir el equipo correcto para tu operación.", Headphones],
  ["Equipos para trabajo pesado", "Maquinaria preparada para responder en obra, industria y taller.", Wrench],
  ["Cotizaciones rápidas", "Resolvemos tus dudas y preparamos una propuesta sin vueltas.", MessageSquareText],
  ["Envíos a todo México", "Coordinamos la entrega del equipo hasta tu ciudad.", Truck],
  ["Soporte antes y después", "Acompañamiento directo durante todo el proceso de compra.", BadgeCheck],
  ["Facturación disponible", "Documentación clara para empresas, contratistas y negocios.", FileCheck2],
] as const;

export function IndustrialTrust() {
  return (
    <>
      <section className="bg-yellow-400 text-zinc-950">
        <div className="mx-auto grid max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(([value, label, Icon]) => (
            <article key={label} className="flex items-center gap-4 border-b border-black/20 px-5 py-6 sm:border-r">
              <Icon size={30} strokeWidth={2.4} />
              <div>
                <p className="text-2xl font-black uppercase leading-none">{value}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-wide">{label}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="concrete text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-400">Respaldo para tu operación</p>
          <div className="mt-3 flex items-end gap-4">
            <Building2 size={42} className="hidden text-yellow-400 sm:block" />
            <h2 className="max-w-3xl text-4xl font-black uppercase sm:text-5xl">¿Por qué elegirnos?</h2>
          </div>
          <div className="mt-9 grid gap-px overflow-hidden border border-zinc-700 bg-zinc-700 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(([title, body, Icon]) => (
              <article key={title} className="group bg-zinc-900 p-6 transition hover:bg-zinc-800">
                <span className="grid size-11 place-items-center bg-yellow-400 text-black transition group-hover:bg-white">
                  <Icon size={23} strokeWidth={2.4} />
                </span>
                <h3 className="mt-5 text-lg font-black uppercase">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
