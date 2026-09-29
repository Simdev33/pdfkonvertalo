"use client";

import { FileDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { parsePath, pathFor } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { addFiles } from "@/lib/converter";
import { openPdfForImages } from "@/lib/pdf-to-image";
import { toast, useApp } from "@/lib/store";

const hasFiles = (event: DragEvent) => Array.from(event.dataTransfer?.types ?? []).includes("Files");

/**
 * Lets the user drop files anywhere on the page; what happens depends on the
 * current tool. Files dropped on other pages (e.g. the Terms) go to the converter.
 */
export function DropOverlay() {
  const [active, setActive] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { locale, ui } = useI18n();
  const page = parsePath(pathname)?.page ?? "converter";
  const toImages = page === "pdfToImage";
  const latest = useRef({ page, locale, router, wrongDrop: ui.dropzone.wrongDrop });

  useEffect(() => {
    latest.current = { page, locale, router, wrongDrop: ui.dropzone.wrongDrop };
  }, [page, locale, router, ui]);

  useEffect(() => {
    let depth = 0;
    const enter = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      depth++;
      setActive(true);
    };
    const over = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    };
    const leave = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      depth = Math.max(0, depth - 1);
      if (depth === 0) setActive(false);
    };
    const drop = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      depth = 0;
      setActive(false);
      const state = useApp.getState();
      if (state.job || state.loading) return;
      const files = Array.from(event.dataTransfer?.files ?? []);
      if (!files.length) return;
      const current = latest.current;
      if (current.page === "pdfToImage") {
        const pdf = files.find((file) => file.type === "application/pdf" || /\.pdf$/i.test(file.name));
        if (pdf) void openPdfForImages(pdf);
        else toast(current.wrongDrop, "error");
        return;
      }
      if (current.page !== "converter") current.router.push(pathFor("converter", current.locale));
      void addFiles(files);
    };
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragover", over);
    window.addEventListener("dragleave", leave);
    window.addEventListener("drop", drop);
    return () => {
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragover", over);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("drop", drop);
    };
  }, []);

  if (!active) return null;
  const text = ui.dropzone;
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] grid place-items-center bg-bg/70 p-6 backdrop-blur-sm animate-fade-in">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-primary bg-surface/90 px-8 py-14 text-center shadow-2xl animate-pop-in">
        <span className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-fg">
          <FileDown className="size-6" />
        </span>
        <div>
          <p className="text-lg font-semibold">{toImages ? text.dropPdf : text.dropFiles}</p>
          <p className="mt-1 text-sm text-fg-muted">{toImages ? text.dropPdfNext : text.dropFilesNext}</p>
        </div>
      </div>
    </div>
  );
}
