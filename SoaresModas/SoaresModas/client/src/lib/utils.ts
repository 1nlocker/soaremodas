import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(priceInCents / 100);
}

export function formatWhatsAppMessage(productName: string, price: number): string {
  const formattedPrice = formatPrice(price);
  return `Olá! Tenho interesse no produto: ${productName} por ${formattedPrice}. Poderia me passar mais informações?`;
}

export function generateWhatsAppLink(message: string): string {
  const phoneNumber = "5571994040672";
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
