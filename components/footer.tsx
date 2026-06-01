import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { COMPANY } from "@/lib/company";

export function Footer() {
  return (
    <footer className="border-t-4 border-yellow-400 bg-zinc-950 text-zinc-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-[1.35fr_.6fr_.8fr_1fr] lg:px-8">
        <div>
          <BrandLogo compact />
          <p className="mt-5 max-w-md text-sm font-bold leading-6">
            Maquinarias Mármol MX es la división especializada en maquinaria industrial, construcción y equipos para trabajo pesado de Mármol MX.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-black uppercase text-yellow-400">Enlaces</p>
          <div className="grid gap-2 text-sm font-bold">
            <Link href="/catalogo">Catálogo</Link>
            <Link href="/carrito">Carrito</Link>
            <Link href="/contacto">Contacto</Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-black uppercase text-yellow-400">Políticas</p>
          <div className="grid gap-2 text-sm font-bold">
            <Link href="/aviso-de-privacidad">Aviso de Privacidad</Link>
            <Link href="/terminos-y-condiciones">Términos y Condiciones</Link>
            <Link href="/devoluciones-y-reembolsos">Devoluciones y Reembolsos</Link>
            <Link href="/envios">Política de Envíos</Link>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <p className="mb-3 font-black uppercase text-yellow-400">Información corporativa</p>
          {COMPANY.emails.map((email) => <a key={email} href={`mailto:${email}`} className="flex gap-2 break-all transition hover:text-yellow-400"><Mail size={17} className="shrink-0" /> {email}</a>)}
          <a href={COMPANY.phoneLink} className="flex gap-2 transition hover:text-yellow-400"><Phone size={17} className="shrink-0" /> {COMPANY.phoneDisplay}</a>
          <p className="flex gap-2"><MapPin size={17} /> {COMPANY.location}</p>
          <p className="flex gap-2"><MapPin size={17} /> {COMPANY.footerShippingText}</p>
          <p className="flex gap-2"><Clock size={17} /> {COMPANY.schedule}</p>
        </div>
      </div>
      <p className="border-t border-zinc-800 px-4 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Maquinarias Mármol MX. Todos los derechos reservados.
      </p>
    </footer>
  );
}
