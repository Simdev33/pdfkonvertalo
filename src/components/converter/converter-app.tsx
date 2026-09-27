"use client";

import dynamic from "next/dynamic";
import { useEffect, type ReactNode } from "react";
import { Spinner } from "@/components/ui/controls";
import { addFiles, filesFromClipboard } from "@/lib/converter";
import { toast, useApp } from "@/lib/store";

const Workspace = dynamic(() => import("./workspace").then((mod) => mod.Workspace), {
  ssr: false,
  loading: () => (
    <div className="grid h-[calc(100dvh-3.5rem)] place-items-center">
      <Spinner className="size-6 text-primary" />
    </div>
  ),
});

/** "Files → PDF" tool: landing page until the first file arrives, then the workspace. */
export function ConverterApp({ landing }: { landing: ReactNode }) {
  const hasItems = useApp((state) => state.items.length > 0);

  // Ctrl+V pastes screenshots and copied images.
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;
      const files = filesFromClipboard(event.clipboardData);
      if (!files.length) return;
      event.preventDefault();
      toast(files.length === 1 ? "Kép beillesztve a vágólapról." : `${files.length} fájl beillesztve a vágólapról.`, "success");
      void addFiles(files);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  return hasItems ? <Workspace /> : <main>{landing}</main>;
}
