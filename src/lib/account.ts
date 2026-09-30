/**
 * The visitor's account as the browser sees it: who is signed in and whether
 * they may download. The server decides (see /api/account); this only caches
 * the answer for the UI.
 */
import { create } from "zustand";
import type { Locale } from "@/i18n/config";

export interface AccessInfo {
  active: boolean;
  status: string;
  trialEnd: number | null;
  periodEnd: number | null;
  cancelAtPeriodEnd: boolean;
}

export interface AccountState {
  loaded: boolean;
  signedIn: boolean;
  email: string | null;
  access: AccessInfo | null;
  /** Stripe is configured on the server. */
  billing: boolean;
}

export const useAccount = create<AccountState>()(() => ({ loaded: false, signedIn: false, email: null, access: null, billing: true }));

export class ApiError extends Error {
  constructor(
    message: string,
    readonly code: string | undefined,
    readonly status: number,
  ) {
    super(message);
  }
}

export async function api<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const response = await fetch(path, {
    method: init?.method ?? (init?.body ? "POST" : "GET"),
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string; code?: string };
  if (!response.ok) throw new ApiError(data.error ?? `HTTP ${response.status}`, data.code, response.status);
  return data;
}

/** Whether the non-httpOnly marker cookie says someone might be signed in. */
export const maybeSignedIn = () => typeof document !== "undefined" && document.cookie.split("; ").some((cookie) => cookie.startsWith("pk_signed_in="));

export async function loadAccount(): Promise<AccountState> {
  const data = await api<Omit<AccountState, "loaded">>("/api/account");
  const state: AccountState = {
    loaded: true,
    signedIn: data.signedIn,
    email: data.email ?? null,
    access: data.access ?? null,
    billing: data.billing,
  };
  useAccount.setState(state);
  return state;
}

export async function signOut() {
  await api("/api/account", { method: "DELETE" });
  useAccount.setState({ loaded: true, signedIn: false, email: null, access: null });
}

export const requestLoginCode = (email: string, locale: Locale) => api<{ sent: boolean }>("/api/auth/request", { body: { email, locale } });

export async function verifyLoginCode(code: string, locale: Locale) {
  await api("/api/auth/verify", { body: { code, locale } });
  return loadAccount();
}

export async function openBillingPortal(locale: Locale, returnPath: string) {
  const { url } = await api<{ url: string }>("/api/account/portal", { body: { locale, returnPath } });
  window.location.assign(url);
}
