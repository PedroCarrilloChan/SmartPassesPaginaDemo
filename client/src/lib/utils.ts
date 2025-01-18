import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function detectDevice(): 'ios' | 'android' | 'desktop' {
  const userAgent = navigator.userAgent.toLowerCase();

  // Detectar iOS
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  }

  // Detectar Android
  if (/android/.test(userAgent)) {
    return 'android';
  }

  // Si no es móvil, asumimos que es desktop
  return 'desktop';
}