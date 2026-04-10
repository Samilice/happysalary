import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCHF(amount: number): string {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Clean a person's name: trim, proper case, preserve accents,
 * handle hyphenated names (Jean-Pierre) and particles (de, von, van).
 */
const LOWERCASE_PARTICLES = new Set(["de", "du", "des", "von", "van", "di", "da", "le", "la"]);

export function cleanName(name: string): string {
  if (!name) return "";
  const normalized = name.normalize("NFC").replace(/\s+/g, " ").trim();
  return normalized
    .split(" ")
    .map((word, idx) => {
      // Keep particles lowercase when not at start
      if (idx > 0 && LOWERCASE_PARTICLES.has(word.toLowerCase())) {
        return word.toLowerCase();
      }
      // Handle hyphenated names: Jean-Pierre
      return word
        .split("-")
        .map((part) => (part.length > 0 ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part))
        .join("-");
    })
    .join(" ");
}

/**
 * Filesystem-safe version of a name: lowercase, no accents, hyphens.
 */
export function cleanNameForFile(name: string): string {
  return cleanName(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/\s+/g, "-")
    .toLowerCase();
}

/**
 * Format hours with proper spacing: "9 h" instead of "9h".
 */
export function formatHours(hours: number | string): string {
  const n = typeof hours === "string" ? parseFloat(hours) : hours;
  if (isNaN(n)) return "0 h";
  return Number.isInteger(n) ? `${n} h` : `${n.toFixed(1)} h`;
}
