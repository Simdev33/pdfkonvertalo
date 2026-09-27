import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** PDF user space unit (1/72 inch) per millimetre. */
export const PT_PER_MM = 72 / 25.4;
export const mmToPt = (mm: number) => mm * PT_PER_MM;
export const ptToMm = (pt: number) => pt / PT_PER_MM;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function formatNumber(value: number, maximumFractionDigits = 1) {
  return value.toLocaleString("hu-HU", { maximumFractionDigits });
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${formatNumber(value, value < 10 ? 1 : 0)} ${units[unit]}`;
}

export function formatDuration(ms: number) {
  if (ms < 1000) return `${Math.max(1, Math.round(ms))} ms`;
  return `${formatNumber(ms / 1000, 1)} mp`;
}

/** Parses user input like "12,5" or "12.5". Returns NaN when invalid. */
export function parseDecimal(input: string) {
  const normalized = input.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^-?\d*\.?\d+$|^-?\d+\.$/.test(normalized)) return Number.NaN;
  return Number.parseFloat(normalized);
}

/** Gives the event loop a chance to paint (progress bars, spinners). */
export function yieldToBrowser() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

export class AbortedError extends Error {
  constructor() {
    super("A műveletet megszakítottad.");
    this.name = "AbortError";
  }
}

export function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new AbortedError();
}

export function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}
