"use client";

import { FileUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar, Spinner } from "@/components/ui/controls";
import { useFilePicker } from "@/components/use-file-picker";
import { useApp } from "@/lib/store";

export function Dropzone({
  accept,
  multiple,
  onFiles,
  title,
  subtitle,
  buttonLabel,
  onSample,
  sampleLabel = "Kipróbálom mintafájlokkal",
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  title: string;
  subtitle: string;
  buttonLabel: string;
  onSample?: () => void;
  sampleLabel?: string;
}) {
  const loading = useApp((state) => state.loading);
  const { open, input } = useFilePicker({ accept, multiple, onFiles });

  if (loading) {
    const progress = loading.total ? loading.done / loading.total : null;
    return (
      <div className="flex min-h-72 flex-col items-center justify-center gap-5 rounded-3xl border border-border bg-surface/80 px-6 py-12 text-center shadow-xl shadow-black/[0.03] backdrop-blur animate-fade-in">
        <Spinner className="size-7 text-primary" />
        <div className="space-y-1">
          <p className="max-w-[28ch] truncate font-medium">{loading.fileName}</p>
          <p className="text-sm text-fg-muted tabular-nums">
            {loading.phase}
            {loading.total > 0 && ` ${loading.done} / ${loading.total}`}
          </p>
        </div>
        <ProgressBar value={progress} className="w-56" />
      </div>
    );
  }

  return (
    <div className="group relative rounded-3xl bg-linear-to-b from-primary/25 via-border to-border p-px shadow-xl shadow-primary/[0.06]">
      <div
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            open();
          }
        }}
        className="relative flex min-h-72 flex-col items-center justify-center gap-5 overflow-hidden rounded-[calc(1.5rem-1px)] bg-surface px-6 py-12 text-center"
      >
        <div className="pointer-events-none absolute inset-3 rounded-2xl border-2 border-dashed border-border-strong/70 transition-colors group-hover:border-primary/50" />
        <span className="relative grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary transition-transform group-hover:-translate-y-0.5">
          <FileUp className="size-6" />
        </span>
        <div className="relative space-y-1.5">
          <p className="text-lg font-semibold tracking-tight">{title}</p>
          <p className="text-sm text-fg-muted">{subtitle}</p>
        </div>
        <div className="relative flex flex-wrap items-center justify-center gap-2.5" onClick={(event) => event.stopPropagation()}>
          <Button variant="primary" size="lg" onClick={open}>
            <FileUp />
            {buttonLabel}
          </Button>
          {onSample && (
            <Button variant="secondary" size="lg" onClick={onSample}>
              <Sparkles />
              {sampleLabel}
            </Button>
          )}
        </div>
      </div>
      {input}
    </div>
  );
}
