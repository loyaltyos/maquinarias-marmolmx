import { whatsappUrl } from "@/lib/whatsapp";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl("Hola, quiero cotizar maquinaria de Maquinarias Mármol MX.")}
      aria-label="Cotizar por WhatsApp"
      className="whatsapp-pulse fixed bottom-4 right-4 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105 hover:bg-[#20bd5a] sm:bottom-5 sm:right-5"
    >
      <svg viewBox="0 0 32 32" className="size-8 fill-current" aria-hidden="true">
        <path d="M19.11 17.38c-.27-.14-1.58-.78-1.83-.87-.24-.09-.42-.14-.6.14-.18.27-.69.87-.85 1.05-.16.18-.31.2-.58.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.42.12-.55.12-.12.27-.31.4-.47.14-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.14-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46h-.51c-.18 0-.47.07-.71.34-.24.27-.93.91-.93 2.21s.95 2.56 1.08 2.74c.14.18 1.87 2.85 4.52 4 .63.27 1.12.43 1.51.55.64.2 1.21.17 1.67.1.51-.08 1.58-.65 1.8-1.27.22-.62.22-1.16.16-1.27-.07-.11-.25-.18-.52-.31z" />
        <path d="M16.03 3.2A12.71 12.71 0 0 0 5.1 22.38L3.2 28.8l6.58-1.84a12.76 12.76 0 1 0 6.25-23.76zm0 23.2c-2 0-3.95-.57-5.63-1.65l-.4-.24-3.9 1.09 1.11-3.8-.26-.41a10.38 10.38 0 1 1 9.08 5.01z" />
      </svg>
    </a>
  );
}
