export const WHATSAPP_NUMBER = "52XXXXXXXXXX";

export const whatsappUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
