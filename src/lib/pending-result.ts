/**
 * Finished files wait on this device (IndexedDB, never uploaded) while the
 * visitor pays: some payment methods (PayPal) leave the page and come back,
 * which would otherwise lose the in-memory result. They expire after an hour.
 * When office documents are in the result only as a preview, their inputs
 * wait too (with the passwords given for PDFs), so they can be converted in full.
 */
import type { PaywallState } from "@/lib/store";

const DB_NAME = "pdf-konvertalo";
const STORE = "pending";
const KEY = "result";
export const PENDING_MINUTES = 60;

type Pending = Pick<PaywallState, "result" | "source" | "expiresAt">;

function open() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>) {
  const db = await open();
  try {
    return await new Promise<T>((resolve, reject) => {
      const request = action(db.transaction(STORE, mode).objectStore(STORE));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

/** Keeps the result; returns when it expires. */
export async function savePending({ result, source }: Omit<Pending, "expiresAt">) {
  const expiresAt = Date.now() + PENDING_MINUTES * 60_000;
  try {
    await run("readwrite", (store) => store.put({ result, source, expiresAt } satisfies Pending, KEY));
  } catch (error) {
    console.warn("[pending] could not store the result", error);
  }
  return expiresAt;
}

export async function loadPending(): Promise<Pending | null> {
  try {
    const pending = await run<Pending | undefined>("readonly", (store) => store.get(KEY));
    if (!pending) return null;
    if (pending.expiresAt < Date.now()) {
      await clearPending();
      return null;
    }
    return pending;
  } catch {
    return null;
  }
}

export async function clearPending() {
  try {
    await run("readwrite", (store) => store.delete(KEY));
  } catch {
    // Nothing stored (or storage blocked).
  }
}
