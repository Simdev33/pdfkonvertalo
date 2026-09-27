import { AbortedError } from "@/lib/utils";
import { renderThumbnail, type PageInfo, type PDFDocumentProxy } from "./pdfjs";

interface Job {
  key: string;
  pageIndex: number;
  bucket: number;
  refs: number;
  started: boolean;
  promise: Promise<string>;
  resolve: (url: string) => void;
  reject: (error: unknown) => void;
}

/** Width buckets keep the cache small while staying sharp at every zoom level. */
const bucketFor = (width: number) => Math.min(1536, Math.max(128, Math.ceil(width / 128) * 128));

/**
 * Renders page thumbnails on demand with bounded concurrency. The most recent
 * request is served first (what the user scrolled to), and requests for
 * thumbnails that scrolled out of view before rendering started are dropped.
 */
export class ThumbnailService {
  private readonly cache = new Map<number, Map<number, string>>();
  private readonly jobs = new Map<string, Job>();
  private queue: Job[] = [];
  private running = 0;
  private disposed = false;
  private readonly listeners = new Set<() => void>();

  constructor(
    private readonly pdf: PDFDocumentProxy,
    private readonly pages: readonly PageInfo[],
    private readonly concurrency = 3,
  ) {}

  /** Best cached thumbnail that is at least `width` device pixels wide. */
  peek(pageIndex: number, width: number): string | undefined {
    const byBucket = this.cache.get(pageIndex);
    if (!byBucket) return undefined;
    const needed = bucketFor(width);
    let best: string | undefined;
    let bestBucket = Number.POSITIVE_INFINITY;
    let fallback: string | undefined;
    let fallbackBucket = 0;
    for (const [bucket, url] of byBucket) {
      if (bucket >= needed && bucket < bestBucket) {
        best = url;
        bestBucket = bucket;
      } else if (bucket > fallbackBucket) {
        fallback = url;
        fallbackBucket = bucket;
      }
    }
    return best ?? fallback;
  }

  /** True if the cached thumbnail is sharp enough for `width`. */
  isSharp(pageIndex: number, width: number) {
    const byBucket = this.cache.get(pageIndex);
    const needed = bucketFor(width);
    return !!byBucket && [...byBucket.keys()].some((bucket) => bucket >= needed);
  }

  request(pageIndex: number, width: number): { promise: Promise<string>; cancel: () => void } {
    const bucket = bucketFor(width);
    const cached = this.cache.get(pageIndex)?.get(bucket);
    if (cached) return { promise: Promise.resolve(cached), cancel: () => {} };

    const key = `${pageIndex}:${bucket}`;
    let job = this.jobs.get(key);
    if (!job) {
      let resolve!: (url: string) => void;
      let reject!: (error: unknown) => void;
      const promise = new Promise<string>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      promise.catch(() => {});
      job = { key, pageIndex, bucket, refs: 0, started: false, promise, resolve, reject };
      this.jobs.set(key, job);
      this.queue.push(job);
      queueMicrotask(() => this.pump());
    }
    job.refs++;
    const current = job;
    let cancelled = false;
    return {
      promise: current.promise,
      cancel: () => {
        if (cancelled) return;
        cancelled = true;
        current.refs--;
        if (current.refs === 0 && !current.started) {
          this.queue = this.queue.filter((queued) => queued !== current);
          this.jobs.delete(current.key);
          current.reject(new AbortedError());
        }
      },
    };
  }

  /** Subscribe to "a thumbnail finished" notifications (used by the page strip). */
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => void this.listeners.delete(listener);
  }

  dispose() {
    this.disposed = true;
    for (const job of this.queue) job.reject(new AbortedError());
    this.queue = [];
    this.jobs.clear();
    this.listeners.clear();
    for (const byBucket of this.cache.values()) for (const url of byBucket.values()) URL.revokeObjectURL(url);
    this.cache.clear();
  }

  private pump() {
    while (!this.disposed && this.running < this.concurrency && this.queue.length) {
      const job = this.queue.pop()!; // LIFO: newest request first
      job.started = true;
      this.running++;
      renderThumbnail(this.pdf, job.pageIndex, this.pages[job.pageIndex], job.bucket)
        .then((blob) => {
          if (this.disposed) return job.reject(new AbortedError());
          const url = URL.createObjectURL(blob);
          let byBucket = this.cache.get(job.pageIndex);
          if (!byBucket) this.cache.set(job.pageIndex, (byBucket = new Map()));
          byBucket.set(job.bucket, url);
          job.resolve(url);
          for (const listener of this.listeners) listener();
        })
        .catch((error) => job.reject(error))
        .finally(() => {
          this.jobs.delete(job.key);
          this.running--;
          this.pump();
        });
    }
  }
}
