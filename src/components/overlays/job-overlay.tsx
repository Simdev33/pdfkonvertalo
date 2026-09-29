"use client";

import { Button } from "@/components/ui/button";
import { ProgressBar, Spinner } from "@/components/ui/controls";
import { useI18n } from "@/i18n/provider";
import { useApp } from "@/lib/store";

export function JobOverlay() {
  const job = useApp((state) => state.job);
  const { ui } = useI18n();
  if (!job) return null;
  const progress = job.total > 0 ? job.done / job.total : null;

  return (
    <div role="alertdialog" aria-modal aria-label={job.title} className="fixed inset-0 z-50 grid place-items-center bg-bg/60 p-6 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-pop-in">
        <div className="flex items-center gap-3">
          <Spinner className="size-5 text-primary" />
          <p className="font-semibold">{job.title}…</p>
          {progress !== null && <span className="ml-auto text-sm text-fg-muted tabular-nums">{Math.round(progress * 100)}%</span>}
        </div>
        <ProgressBar value={progress} className="mt-5" />
        <p className="mt-3 min-h-5 truncate text-sm text-fg-muted">{job.label ?? ui.overlays.preparing}</p>
        <div className="mt-5 flex justify-end">
          <Button variant="ghost" size="sm" onClick={job.cancel}>
            {ui.overlays.abort}
          </Button>
        </div>
      </div>
    </div>
  );
}
