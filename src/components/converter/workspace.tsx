"use client";

import { FileDown } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Kbd, Spinner } from "@/components/ui/controls";
import { fmt, plural } from "@/i18n/format";
import { useI18n } from "@/i18n/provider";
import { runConversion } from "@/lib/converter";
import { useApp } from "@/lib/store";
import { FileGrid } from "./file-grid";
import { OptionsPanel } from "./options-panel";

function ActionBar() {
  const counts = useApp((state) => {
    let ready = 0;
    let processing = 0;
    let failed = 0;
    for (const item of state.items) {
      if (item.status === "ready") ready++;
      else if (item.status === "processing") processing++;
      else failed++;
    }
    return `${ready}:${processing}:${failed}`;
  });
  const output = useApp((state) => state.options.output);
  const [ready, processing, failed] = counts.split(":").map(Number);
  const { locale, ui } = useI18n();
  const text = ui.convert;

  const summary = processing
    ? plural(locale, text.loading, processing)
    : fmt(text.summary, { files: plural(locale, ui.files.count, ready), pdfs: plural(locale, text.pdfCount, output === "merge" ? 1 : ready) }) +
      (failed ? plural(locale, text.failedCount, failed) : "");

  return (
    <div className="sticky bottom-0 z-20 border-t border-border bg-surface/95 p-4 backdrop-blur">
      <div className="mb-2.5 flex items-center justify-between text-xs text-fg-muted">
        <span className="flex items-center gap-1.5 tabular-nums">
          {processing > 0 && <Spinner className="size-3" />}
          {summary}
        </span>
        <span className="hidden items-center gap-1 lg:flex">
          <Kbd>Ctrl</Kbd>+<Kbd>S</Kbd>
        </span>
      </div>
      <Button variant="primary" size="lg" className="w-full" disabled={ready === 0 || processing > 0} onClick={() => void runConversion()}>
        <FileDown />
        {output === "merge" ? text.createOne : text.createMany}
      </Button>
    </div>
  );
}

export function Workspace() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const state = useApp.getState();
      if (state.job || state.result || state.passwordRequest) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void runConversion();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="lg:flex lg:h-[calc(100dvh-3.5rem)]">
      <section className="flex min-h-[60dvh] min-w-0 flex-1 flex-col bg-canvas lg:min-h-0">
        <FileGrid />
      </section>
      <aside className="flex flex-col border-t border-border bg-surface lg:w-[380px] lg:border-t-0 lg:border-l">
        <div className="scrollbar-thin flex-1 overflow-y-auto">
          <OptionsPanel />
        </div>
        <ActionBar />
      </aside>
    </div>
  );
}
