"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

const fields = [
  ["name", "Nombre", "text"],
  ["email", "Email", "email"],
  ["phone", "Teléfono", "tel"],
] as const;

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  }

  if (sent) {
    return (
      <div className="border-l-4 border-green-600 bg-green-50 p-6">
        <CheckCircle2 className="text-green-700" size={35} />
        <p className="mt-3 font-black uppercase text-green-900">Mensaje recibido</p>
        <p className="mt-1 text-sm font-bold text-green-800">Nuestro equipo se pondrá en contacto contigo.</p>
        <button onClick={() => setSent(false)} className="mt-5 text-xs font-black uppercase text-green-900 underline">Enviar otro mensaje</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border-t-4 border-yellow-400 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-xl font-black uppercase">Envíanos un mensaje</h2>
      <p className="mt-2 text-sm font-bold text-zinc-500">Cuéntanos qué equipo necesitas y te contactaremos.</p>
      <div className="mt-6 grid gap-4">
        {fields.map(([name, label, type]) => (
          <label key={name}>
            <span className="mb-2 block text-xs font-black uppercase text-zinc-600">{label}</span>
            <input required name={name} type={type} className="w-full border border-zinc-300 px-3 py-3 text-sm font-bold outline-none focus:border-red-600" />
          </label>
        ))}
        <label>
          <span className="mb-2 block text-xs font-black uppercase text-zinc-600">Mensaje</span>
          <textarea required name="message" rows={5} className="w-full resize-y border border-zinc-300 px-3 py-3 text-sm font-bold outline-none focus:border-red-600" />
        </label>
      </div>
      <button className="mt-5 flex items-center justify-center gap-2 bg-yellow-400 px-6 py-4 text-sm font-black uppercase text-black transition hover:bg-yellow-300">
        <Send size={17} /> Enviar mensaje
      </button>
    </form>
  );
}
