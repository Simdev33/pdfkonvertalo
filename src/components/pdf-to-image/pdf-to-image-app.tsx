"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { Spinner } from "@/components/ui/controls";
import { useApp } from "@/lib/store";

const Workspace = dynamic(() => import("./workspace").then((mod) => mod.PdfToImageWorkspace), {
  ssr: false,
  loading: () => (
    <div className="grid h-[calc(100dvh-3.5rem)] place-items-center">
      <Spinner className="size-6 text-primary" />
    </div>
  ),
});

/** "PDF → image" tool: landing page until a PDF is opened, then the page grid. */
export function PdfToImageApp({ landing }: { landing: ReactNode }) {
  const hasDocument = useApp((state) => state.pdfDoc !== null);
  return hasDocument ? <Workspace /> : <main>{landing}</main>;
}
