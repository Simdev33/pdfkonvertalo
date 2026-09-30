import { create } from "zustand";
import { INTL_LOCALE } from "@/i18n/config";
import { runtimeLocale } from "@/i18n/runtime";
import type { ConvertItem, ConvertOptions } from "@/lib/convert/engine";
import type { DetectedFormat } from "@/lib/convert/formats";
import type { Dpi } from "@/lib/convert/image-info";
import type { Rotation } from "@/lib/convert/layout";
import type { OutputFile } from "@/lib/files";
import type { PageInfo } from "@/lib/pdf/pdfjs";

/* ---------------------------------- types --------------------------------- */

export interface ItemPreview {
  /** Object URL of a small rendering (images, first PDF page). */
  url?: string;
  /** Pixel size for images, point size of the first page for PDFs. */
  width: number;
  height: number;
  /** TIFF frames or PDF pages. */
  count?: number;
  dpi?: Dpi | null;
  /** First lines of text inputs. */
  lines?: string[];
}

export interface Item {
  id: string;
  file: File;
  name: string;
  size: number;
  format: DetectedFormat;
  status: "processing" | "ready" | "error";
  error?: string;
  preview?: ItemPreview;
  rotation: Rotation;
  password?: string;
}

export interface PdfDocInfo {
  id: string;
  fileName: string;
  baseName: string;
  size: number;
  pages: PageInfo[];
  protected: boolean;
}

export interface ImageExportOptions {
  format: "jpeg" | "png";
  dpi: number;
  quality: number;
  scope: "all" | "selected";
}

export interface LoadingState {
  fileName: string;
  phase: string;
  done: number;
  total: number;
}

export interface PasswordRequest {
  id: number;
  fileName: string;
  reason: "need" | "incorrect";
  resolve: (password: string | null) => void;
}

export interface JobState {
  title: string;
  done: number;
  total: number;
  label?: string;
  cancel: () => void;
}

export interface ResultState {
  title: string;
  files: OutputFile[];
  archiveName: string;
  elapsed: number;
  notes: string[];
}

/** What a "Files → PDF" result was made from, to convert it again. */
export interface ConversionSource {
  items: ConvertItem[];
  options: ConvertOptions;
  /** Inputs left out because they could not be loaded. */
  skipped: number;
}

/** A finished result waiting for payment (see components/paywall). */
export interface PaywallState {
  result: ResultState;
  /** Set when office documents are in the result only with their first page (the server's preview): converted again in full once paid. */
  source?: ConversionSource;
  /** When the result is dropped from this device (ms). */
  expiresAt: number;
  /** Shown when coming back from a failed or cancelled payment. */
  error?: string;
}

export type ToastTone = "info" | "success" | "error";

export interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

export interface AppState {
  items: Item[];
  options: ConvertOptions;

  pdfDoc: PdfDocInfo | null;
  selection: ReadonlySet<number>;
  anchor: number | null;
  imageOptions: ImageExportOptions;
  thumbSize: number;

  loading: LoadingState | null;
  passwordRequest: PasswordRequest | null;
  job: JobState | null;
  result: ResultState | null;
  paywall: PaywallState | null;
  toasts: Toast[];
}

export const DEFAULT_OPTIONS: ConvertOptions = {
  pageSize: "A4",
  orientation: "auto",
  marginMm: 0,
  fit: "contain",
  perPage: 1,
  quality: "original",
  grayscale: false,
  fontSize: 11,
  output: "merge",
  fileName: "",
};

export const useApp = create<AppState>()(() => ({
  items: [],
  options: DEFAULT_OPTIONS,
  pdfDoc: null,
  selection: new Set(),
  anchor: null,
  imageOptions: { format: "jpeg", dpi: 150, quality: 90, scope: "all" },
  thumbSize: 168,
  loading: null,
  passwordRequest: null,
  job: null,
  result: null,
  paywall: null,
  toasts: [],
}));

const set = useApp.setState;
const get = useApp.getState;

/* ------------------------------- converter -------------------------------- */

function revoke(item: Item) {
  if (item.preview?.url) URL.revokeObjectURL(item.preview.url);
}

export function appendItems(items: Item[]) {
  set({ items: [...get().items, ...items] });
}

export function updateItem(id: string, patch: Partial<Item>) {
  set({ items: get().items.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
}

export function removeItem(id: string) {
  const item = get().items.find((candidate) => candidate.id === id);
  if (item) revoke(item);
  set({ items: get().items.filter((candidate) => candidate.id !== id) });
}

export function clearItems() {
  get().items.forEach(revoke);
  set({ items: [], options: { ...get().options, fileName: "" } });
}

export function moveItem(activeId: string, overId: string) {
  const items = [...get().items];
  const from = items.findIndex((item) => item.id === activeId);
  const to = items.findIndex((item) => item.id === overId);
  if (from < 0 || to < 0 || from === to) return;
  const [moved] = items.splice(from, 1);
  items.splice(to, 0, moved);
  set({ items });
}

export function rotateItem(id: string, delta: 90 | -90) {
  set({
    items: get().items.map((item) =>
      item.id === id ? { ...item, rotation: ((((item.rotation + delta) % 360) + 360) % 360) as Rotation } : item,
    ),
  });
}

export function sortItems(by: "name-asc" | "name-desc" | "size-asc" | "size-desc") {
  const collator = new Intl.Collator(INTL_LOCALE[runtimeLocale()], { numeric: true, sensitivity: "base" });
  const items = [...get().items];
  items.sort((a, b) => {
    switch (by) {
      case "name-desc":
        return collator.compare(b.name, a.name);
      case "size-asc":
        return a.size - b.size;
      case "size-desc":
        return b.size - a.size;
      default:
        return collator.compare(a.name, b.name);
    }
  });
  set({ items });
}

export function setOptions(patch: Partial<ConvertOptions>) {
  set({ options: { ...get().options, ...patch } });
}

/* ------------------------------ PDF → images ------------------------------ */

export function setPdfDoc(pdfDoc: PdfDocInfo | null) {
  set({ pdfDoc, selection: new Set(), anchor: null });
}

export function clickPage(index: number, { range }: { range: boolean }) {
  const { selection, anchor } = get();
  const next = new Set(selection);
  if (range && anchor !== null) {
    const [from, to] = anchor < index ? [anchor, index] : [index, anchor];
    for (let i = from; i <= to; i++) next.add(i);
    set({ selection: next });
    return;
  }
  if (next.has(index)) next.delete(index);
  else next.add(index);
  set({ selection: next, anchor: index });
}

export function setSelection(pages: Iterable<number>) {
  set({ selection: new Set(pages), anchor: null });
}

export function setImageOptions(patch: Partial<ImageExportOptions>) {
  set({ imageOptions: { ...get().imageOptions, ...patch } });
}

export function setThumbSize(thumbSize: number) {
  set({ thumbSize });
}

/* ------------------------------ jobs & results ----------------------------- */

export function startJob(title: string, cancel: () => void) {
  set({ job: { title, done: 0, total: 0, cancel } });
}

export function updateJob(done: number, total: number, label?: string) {
  const { job } = get();
  if (job) set({ job: { ...job, done, total, label: label ?? job.label } });
}

export function endJob() {
  set({ job: null });
}

export function setResult(result: ResultState | null) {
  set({ result });
}

export function setPaywall(paywall: PaywallState | null) {
  set({ paywall });
}

export function setLoading(loading: LoadingState | null) {
  set({ loading });
}

let passwordRequestId = 0;
let passwordQueue: Promise<unknown> = Promise.resolve();

/** Asks for a PDF password. Requests are queued, so parallel imports never clash. */
export function requestPassword(fileName: string, reason: PasswordRequest["reason"]) {
  const ask = () =>
    new Promise<string | null>((resolve) => {
      set({
        passwordRequest: {
          id: ++passwordRequestId,
          fileName,
          reason,
          resolve: (password) => {
            set({ passwordRequest: null });
            resolve(password);
          },
        },
      });
    });
  const request = passwordQueue.then(ask, ask);
  passwordQueue = request;
  return request;
}

/* --------------------------------- toasts --------------------------------- */

let toastId = 0;

export function toast(message: string, tone: ToastTone = "info") {
  const id = ++toastId;
  set({ toasts: [...get().toasts, { id, tone, message }].slice(-4) });
  setTimeout(() => dismissToast(id), tone === "error" ? 7000 : 4000);
}

export function dismissToast(id: number) {
  set({ toasts: get().toasts.filter((item) => item.id !== id) });
}
