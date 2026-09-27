"use client";

import { Contrast, FileStack, Files, Maximize, Minimize, PenLine } from "lucide-react";
import { Field, Hint, NumberInput, Section, Segmented, Select, Switch } from "@/components/ui/controls";
import type { ConvertOptions } from "@/lib/convert/engine";
import type { ImageQuality } from "@/lib/convert/images";
import { PAGE_SIZES, type PageSizeId } from "@/lib/convert/layout";
import { defaultOutputName } from "@/lib/converter";
import { setOptions, useApp } from "@/lib/store";

const PAGE_SIZE_OPTIONS: { value: PageSizeId; label: string }[] = [
  ...Object.entries(PAGE_SIZES).map(([id, size]) => ({
    value: id as PageSizeId,
    label: `${size.label} (${size.width.toLocaleString("hu-HU")} × ${size.height.toLocaleString("hu-HU")} mm)`,
  })),
  { value: "fit", label: "A kép méretéhez igazítva" },
];

const QUALITY_HINTS: Record<ImageQuality, string> = {
  original: "Veszteségmentes: a JPG és PNG képek bájtra pontosan kerülnek át, a többi a lehető legjobb minőségben.",
  high: "Legfeljebb 3200 px, 85%-os JPG – nyomtatáshoz is bőven elég, jóval kisebb fájl.",
  medium: "Legfeljebb 2000 px, 75%-os JPG – ideális e-mailhez, ügyintézéshez.",
  low: "Legfeljebb 1400 px, 60%-os JPG – a lehető legkisebb fájl, képernyőre.",
};

export function OptionsPanel() {
  const options = useApp((state) => state.options);
  const hasImages = useApp((state) => state.items.some((item) => item.format.kind === "image"));
  const hasText = useApp((state) => state.items.some((item) => item.format.kind === "text"));
  const items = useApp((state) => state.items);
  const fitPage = options.pageSize === "fit";
  const single = options.perPage <= 1;

  return (
    <>
      <Section title="Oldal">
        <Field label="Oldalméret">
          <Select<PageSizeId> label="Oldalméret" value={options.pageSize} options={PAGE_SIZE_OPTIONS} onChange={(pageSize) => setOptions({ pageSize })} />
        </Field>
        <Field label="Tájolás">
          <Segmented<ConvertOptions["orientation"]>
            size="sm"
            label="Tájolás"
            value={options.orientation}
            onChange={(orientation) => setOptions({ orientation })}
            options={[
              { value: "auto", label: "Automatikus", title: "A kép alakjához igazodik" },
              { value: "portrait", label: "Álló" },
              { value: "landscape", label: "Fekvő" },
            ]}
          />
        </Field>
        <Field label="Margó">
          <Segmented<string>
            size="sm"
            label="Margó"
            value={String(options.marginMm)}
            onChange={(value) => setOptions({ marginMm: Number(value) })}
            options={[
              { value: "0", label: "Nincs" },
              { value: "5", label: "Kicsi" },
              { value: "10", label: "Közepes" },
              { value: "20", label: "Nagy" },
            ]}
          />
        </Field>
        {hasImages && (
          <>
            <Field label="Kép elhelyezése">
              <Segmented<ConvertOptions["fit"]>
                size="sm"
                label="Kép elhelyezése"
                value={options.fit}
                onChange={(fit) => setOptions({ fit })}
                options={[
                  { value: "contain", label: "Teljes kép", icon: <Minimize />, title: "A teljes kép látszik" },
                  { value: "cover", label: "Kitöltés", icon: <Maximize />, title: "Kitölti a helyet, a széleket levágja" },
                ]}
              />
            </Field>
            <Field label="Képek oldalanként">
              <Segmented<string>
                size="sm"
                label="Képek oldalanként"
                value={String(options.perPage)}
                onChange={(value) => setOptions({ perPage: Number(value) })}
                options={["1", "2", "4", "6", "9"].map((value) => ({ value, label: value }))}
              />
            </Field>
            {fitPage && single && (
              <p className="text-xs leading-relaxed text-fg-subtle">
                Minden oldal pontosan akkora lesz, mint a kép. Beolvasott dokumentumoknál a valós méretet is megőrzi.
              </p>
            )}
          </>
        )}
      </Section>

      {hasImages && (
        <Section title="Képminőség">
          <Segmented<ImageQuality>
            size="sm"
            label="Képminőség"
            value={options.quality}
            onChange={(quality) => setOptions({ quality })}
            options={[
              { value: "original", label: "Eredeti" },
              { value: "high", label: "Nagy" },
              { value: "medium", label: "Közepes" },
              { value: "low", label: "Kicsi" },
            ]}
          />
          <p className="text-xs leading-relaxed text-fg-subtle">{QUALITY_HINTS[options.quality]}</p>
          <Switch
            checked={options.grayscale}
            onChange={(grayscale) => setOptions({ grayscale })}
            label={
              <span className="inline-flex items-center gap-1.5">
                <Contrast className="size-3.5" /> Fekete-fehér
              </span>
            }
            description="Szürkeárnyalatos képek – beolvasott iratokhoz ideális, kisebb fájl."
          />
        </Section>
      )}

      {hasText && (
        <Section title="Szöveges fájlok">
          <Field label="Betűméret" hint="Noto Sans betűtípus ékezetes, görög és cirill betűkkel. A kód, a JSON és a naplófájlok fix szélességű betűvel készülnek, a CSV-ből táblázat lesz.">
            <NumberInput value={options.fontSize} onChange={(fontSize) => setOptions({ fontSize })} min={7} max={18} step={0.5} unit="pt" stepper label="Betűméret" className="w-40" />
          </Field>
        </Section>
      )}

      <Section title="Kimenet">
        <Segmented<ConvertOptions["output"]>
          label="Kimenet"
          value={options.output}
          onChange={(output) => setOptions({ output })}
          options={[
            { value: "merge", label: "Egy PDF-be", icon: <FileStack /> },
            { value: "separate", label: "Fájlonként", icon: <Files /> },
          ]}
        />
        <Field label={options.output === "merge" ? "Fájlnév" : "ZIP-fájl neve"}>
          <div className="flex h-9 items-center rounded-lg bg-surface ring-1 ring-border-strong/70 ring-inset focus-within:ring-2 focus-within:ring-primary">
            <PenLine className="ml-3 size-3.5 shrink-0 text-fg-subtle" />
            <input
              value={options.fileName}
              onChange={(event) => setOptions({ fileName: event.target.value })}
              placeholder={defaultOutputName(items)}
              aria-label="Fájlnév"
              className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
            />
            <span className="pr-3 text-xs text-fg-subtle">{options.output === "merge" ? ".pdf" : ".zip"}</span>
          </div>
        </Field>
        {options.output === "separate" && <Hint>Minden bemenetből külön PDF készül, a nevük megegyezik az eredeti fájlokéval.</Hint>}
      </Section>
    </>
  );
}
