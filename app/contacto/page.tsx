import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { COMPANY } from "@/lib/company";
import { whatsappUrl } from "@/lib/whatsapp";

export default function ContactPage() {
  return (
    <>
      <section className="concrete border-b-4 border-yellow-400 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-400">Atención directa</p>
          <h1 className="mt-3 text-5xl font-black uppercase">Contacto</h1>
          <p className="mt-4 max-w-2xl font-bold text-zinc-300">{COMPANY.shippingText}</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
        <aside className="h-fit bg-zinc-900 p-6 text-white sm:p-7">
          <h2 className="text-2xl font-black uppercase">{COMPANY.name}</h2>
          <div className="mt-7 grid gap-4 text-sm font-bold text-zinc-300">
            {COMPANY.emails.map((email) => <a key={email} href={`mailto:${email}`} className="flex gap-3 transition hover:text-yellow-400"><Mail size={19} className="shrink-0 text-yellow-400" /> {email}</a>)}
            <p className="flex gap-3"><MapPin size={19} className="shrink-0 text-yellow-400" /> {COMPANY.location}</p>
            <p className="flex gap-3"><Clock size={19} className="shrink-0 text-yellow-400" /> {COMPANY.schedule}</p>
            <a href={COMPANY.phoneLink} className="flex gap-3 transition hover:text-yellow-400"><MessageCircle size={19} className="shrink-0 text-yellow-400" /> {COMPANY.phoneDisplay}</a>
          </div>
          <a href={whatsappUrl("Hola, quiero recibir información sobre maquinaria de Maquinarias Mármol MX.")} target="_blank" rel="noreferrer" className="mt-7 flex items-center justify-center gap-2 bg-[#25D366] px-5 py-4 text-sm font-black uppercase text-white transition hover:bg-[#20bd5a]">
            <MessageCircle size={18} /> Escribir por WhatsApp
          </a>
        </aside>
        <div id="formulario"><ContactForm /></div>
      </section>
    </>
  );
}
