export const WHATSAPP_NUMBER = "52XXXXXXXXXX";
export const isWhatsAppConfigured = !WHATSAPP_NUMBER.includes("X");

export const whatsappUrl = (message: string) =>
  isWhatsAppConfigured
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    : `/contacto?canal=whatsapp&mensaje=${encodeURIComponent(message)}#formulario`;
