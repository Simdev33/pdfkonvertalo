"use client";

import { Check, FileImage, FileText, ImageDown, Lock, Minus, Plus, X } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Hint, Kbd, Section, Segmented } from "@/components/ui/controls";
import { closePdfForImages, runPdfToImages } from "@/lib/pdf-to-image";
import { formatPageSelection, parsePageSelection } from "@/lib/pdf/ranges";
import { clickPage, setImageOptions, setSelection, setThumbSize, useApp } from "@/lib/store";
import { cn, formatBytes, formatNumber } from "@/lib/utils";
import { Thumbnail } from "./thumbnail";

const BOX_RATIO = 1 / Math.SQRT2;

function Toolbar() {
  const doc = useApp((state) => state.pdfDoc)!;
  const selected = useApp((state) => state.selection.size);
  const thumbSize = useApp((state) => state.thumbSize);
  const count = doc.pages.length;
  const all = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="flex min-h-12 flex-wrap items-center gap-x-3 gap-y-2 border-b border-border bg-surface/85 px-3 py-2 backdrop-blur sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <FileText className="size-4 shrink-0 text-fg-subtle" />
        <span className="truncate text-[13px] font-medium" title={doc.fileName}>
          {doc.fileName}
        </span>
        {doc.protected && <Lock className="size-3 shrink-0 text-fg-subtle" aria-label="Jelszóval védett" />}
        <span className="shrink-0 text-xs text-fg-subtle tabular-nums">
          {count} oldal · {formatBytes(doc.size)}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <span className="mr-1 text-[13px] text-fg-muted tabular-nums">
          <span className="font-semibold text-fg">{selected}</span> kijelölve
        </span>
        <Button variant="ghost" size="sm" onClick={() => setSelection(all)}>
          Összes
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setSelection(all.filter((i) => i % 2 === 0))}>
          Páratlan
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setSelection(all.filter((i) => i % 2 === 1))}>
          Páros
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setSelection([])} disabled={selected === 0}>
          Egyik sem
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <span className="mr-2 hidden items-center gap-1 text-xs text-fg-subtle xl:flex">
          <Kbd>Shift</Kbd> + kattintás: tartomány
        </span>
        <Button variant="ghost" size="icon-sm" className="hidden sm:inline-flex" onClick={() => setThumbSize(Math.max(112, thumbSize - 28))} aria-label="Kicsinyítés">
          <Minus />
        </Button>
        <input
          type="range"
          min={112}
          max={336}
          step={4}
          value={thumbSize}
          onChange={(event) => setThumbSize(Number(event.target.value))}
          aria-label="Bélyegkép mérete"
          className="hidden w-24 accent-primary sm:block"
        />
        <Button variant="ghost" size="icon-sm" className="hidden sm:inline-flex" onClick={() => setThumbSize(Math.min(336, thumbSize + 28))} aria-label="Nagyítás">
          <Plus />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={closePdfForImages} aria-label="PDF bezárása" title="Bezárás">
          <X />
        </Button>
      </div>
    </div>
  );
}

const PageCard = memo(function PageCard({ index, ratio, width }: { index: number; ratio: number; width: number }) {
  const selected = useApp((state) => state.selection.has(index));
  const wide = ratio >= BOX_RATIO;
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative flex aspect-[1/1.4142] w-full items-center justify-center">
        <button
          type="button"
          onClick={(event) => clickPage(index, { range: event.shiftKey })}
          aria-pressed={selected}
          aria-label={`${index + 1}. oldal${selected ? " (kijelölve)" : ""}`}
          className={cn(
            "relative overflow-hidden rounded-[3px] bg-white shadow-page ring-offset-2 ring-offset-canvas transition-[box-shadow,transform] duration-150 outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary",
            wide ? "w-full" : "h-full",
            selected && "ring-2 ring-primary",
          )}
          style={{ aspectRatio: ratio }}
        >
          <Thumbnail pageIndex={index} width={width} />
          {selected && (
            <span className="absolute top-1.5 right-1.5 grid size-6 place-items-center rounded-full bg-primary text-white shadow-md animate-pop-in">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
          )}
        </button>
      </div>
      <span className={cn("text-xs tabular-nums", selected ? "font-semibold text-fg" : "text-fg-subtle")}>{index + 1}</span>
    </div>
  );
});

function PageGrid() {
  const doc = useApp((state) => state.pdfDoc)!;
  const thumbSize = useApp((state) => state.thumbSize);
  return (
    <div data-scroll-root className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
      <div className="grid gap-x-6 gap-y-7 p-6" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(${thumbSize}px, 100%), 1fr))` }}>
        {doc.pages.map((info, index) => (
          <PageCard key={`${doc.id}-${index}`} index={index} ratio={info.width / info.height} width={thumbSize} />
        ))}
      </div>
    </div>
  );
}

function Options() {
  const doc = useApp((state) => state.pdfDoc)!;
  const options = useApp((state) => state.imageOptions);
  const selection = useApp((state) => state.selection);
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const first = doc.pages[0];
  const px = (pt: number) => Math.round((pt * options.dpi) / 72);

  return (
    <>
      <Section title="Formátum">
        <Segmented<"jpeg" | "png">
          label="Formátum"
          value={options.format}
          onChange={(format) => setImageOptions({ format })}
          options={[
            { value: "jpeg", label: "JPG", icon: <FileImage /> },
            { value: "png", label: "PNG", icon: <FileImage /> },
          ]}
        />
        <p className="text-xs leading-relaxed text-fg-subtle">
          {options.format === "jpeg" ? "Kisebb fájl – fotókhoz és vegyes tartalomhoz." : "Veszteségmentes – szöveghez, ábrákhoz, képernyőképekhez."}
        </p>
        {options.format === "jpeg" && (
          <Field label={`Minőség: ${options.quality}%`}>
            <input
              type="range"
              min={50}
              max={100}
              step={5}
              value={options.quality}
              onChange={(event) => setImageOptions({ quality: Number(event.target.value) })}
              aria-label="JPG minőség"
              className="w-full accent-primary"
            />
          </Field>
        )}
      </Section>

      <Section title="Felbontás">
        <Segmented<string>
          size="sm"
          label="Felbontás"
          value={String(options.dpi)}
          onChange={(value) => setImageOptions({ dpi: Number(value) })}
          options={["72", "150", "300", "600"].map((value) => ({ value, label: `${value} DPI` }))}
        />
        <p className="text-xs text-fg-subtle tabular-nums">
          Az 1. oldal mérete: {formatNumber(px(first.width), 0)} × {formatNumber(px(first.height), 0)} képpont
        </p>
      </Section>

      <Section title="Oldalak">
        <Segmented<"all" | "selected">
          size="sm"
          label="Oldalak"
          value={options.scope}
          onChange={(scope) => setImageOptions({ scope })}
          options={[
            { value: "all", label: `Mind (${doc.pages.length})` },
            { value: "selected", label: `Kijelöltek (${selection.size})` },
          ]}
        />
        {options.scope === "selected" && (
          <div className="space-y-1.5">
            <input
              value={draft ?? formatPageSelection(selection)}
              onChange={(event) => {
                setDraft(event.target.value);
                const parsed = parsePageSelection(event.target.value, doc.pages.length);
                if (parsed.ok) {
                  setSelection(parsed.pages);
                  setError(null);
                } else setError(parsed.error);
              }}
              onBlur={() => {
                setDraft(null);
                setError(null);
              }}
              placeholder="pl. 1-3, 7, 10-"
              aria-label="Kijelölt oldalak"
              className={cn(
                "h-9 w-full rounded-lg bg-surface px-3 font-mono text-[13px] ring-1 ring-inset outline-none focus:ring-2 focus:ring-primary",
                error ? "ring-danger" : "ring-border-strong/70",
              )}
            />
            <p className={cn("text-xs", error ? "text-danger" : "text-fg-subtle")}>{error ?? "Kattints az oldalakra, vagy írd be a számukat."}</p>
          </div>
        )}
        <Hint>A képekbe a felbontás is bekerül, így nyomtatáskor valós méretűek lesznek.</Hint>
      </Section>
    </>
  );
}

function ActionBar() {
  const count = useApp((state) => (state.imageOptions.scope === "selected" ? state.selection.size : (state.pdfDoc?.pages.length ?? 0)));
  const format = useApp((state) => state.imageOptions.format);
  return (
    <div className="sticky bottom-0 z-20 border-t border-border bg-surface/95 p-4 backdrop-blur">
      <div className="mb-2.5 flex items-center justify-between text-xs text-fg-muted">
        <span className="tabular-nums">
          {count} oldal → {count} {format === "jpeg" ? "JPG" : "PNG"}
          {count > 1 ? " (ZIP)" : ""}
        </span>
        <span className="hidden items-center gap-1 lg:flex">
          <Kbd>Ctrl</Kbd>+<Kbd>S</Kbd>
        </span>
      </div>
      <Button variant="primary" size="lg" className="w-full" disabled={count === 0} onClick={() => void runPdfToImages()}>
        <ImageDown />
        {count === 1 ? "Kép mentése" : "Képek mentése"}
      </Button>
    </div>
  );
}

export function PdfToImageWorkspace() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const state = useApp.getState();
      if (state.job || state.result || state.passwordRequest) return;
      const typing = (event.target as HTMLElement | null)?.closest("input, textarea, select");
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void runPdfToImages();
      } else if (!typing && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
        event.preventDefault();
        setSelection(state.pdfDoc?.pages.map((_, i) => i) ?? []);
      } else if (!typing && event.key === "Escape") {
        setSelection([]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="lg:flex lg:h-[calc(100dvh-3.5rem)]">
      <section className="flex h-[64dvh] min-w-0 flex-1 flex-col bg-canvas lg:h-auto">
        <Toolbar />
        <PageGrid />
      </section>
      <aside className="flex flex-col border-t border-border bg-surface lg:w-[360px] lg:border-t-0 lg:border-l">
        <div className="scrollbar-thin flex-1 overflow-y-auto">
          <Options />
        </div>
        <ActionBar />
      </aside>
    </div>
  );
}

