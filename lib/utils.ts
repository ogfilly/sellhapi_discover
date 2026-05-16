import { type ClassValue, clsx } from "clsx";
import { twMerge }               from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000)     return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}

export function formatPrice(price: number, currency: string): string {
  const formatters: Record<string, Intl.NumberFormat> = {
    NGN: new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }),
    USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    GBP: new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }),
  };
  return (formatters[currency] ?? formatters["NGN"]!).format(price);
}
