import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Data de publicacao em pt-BR. A data vem do CMS como "AAAA-MM-DD" e e lida
 * como data local — passar por `new Date()` puxaria o fuso e exibiria o dia
 * anterior para quem esta a oeste de Greenwich.
 */
export function formatPublishDate(value?: string | Date | null): string {
  if (!value) return "";

  const raw = typeof value === "string" ? value : value.toISOString();
  const [date] = raw.split("T");
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) return "";

  return `${day}/${month}/${year}`;
}

/** Ano de publicacao, usado nas opcoes do filtro por ano. */
export function getPublishYear(value?: string | Date | null): number | null {
  const formatted = formatPublishDate(value);
  if (!formatted) return null;

  return Number(formatted.split("/")[2]);
}
