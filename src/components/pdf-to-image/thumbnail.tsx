"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { getSession } from "@/lib/pdf/session";
import { cn } from "@/lib/utils";

const devicePixelRatio = () => (typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, 2));

/**
 * Lazily rendered PDF page image. Rendering starts when the element nears the
 * viewport of the closest `[data-scroll-root]` and is cancelled if it leaves
 * again before its turn came.
 */
export function Thumbnail({ pageIndex, width, className }: { pageIndex: number; width: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [, refresh] = useReducer((count: number) => count + 1, 0);
  const session = getSession();
  const target = Math.round(width * devicePixelRatio());
  const url = session?.thumbnails.peek(pageIndex, target);
  const sharp = session?.thumbnails.isSharp(pageIndex, target) ?? false;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const root = element.closest<HTMLElement>("[data-scroll-root]");
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { root, rootMargin: "400px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !session || sharp) return;
    const request = session.thumbnails.request(pageIndex, target);
    request.promise.then(refresh, () => {});
    return request.cancel;
  }, [visible, session, pageIndex, target, sharp]);

  return (
    <div ref={ref} className={cn("absolute inset-0", className)}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- blob: URLs rendered on the client
        <img src={url} alt="" draggable={false} className="h-full w-full object-fill select-none" />
      ) : (
        <div className="h-full w-full animate-pulse bg-surface-2" />
      )}
    </div>
  );
}
