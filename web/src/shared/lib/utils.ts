import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Утилита для объединения классов Tailwind
 * Используется в Shadcn/ui компонентах
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

