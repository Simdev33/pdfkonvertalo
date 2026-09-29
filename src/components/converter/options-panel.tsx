"use client";

import { Contrast, FileStack, Files, Maximize, Minimize, PenLine } from "lucide-react";
import { Field, Hint, NumberInput, Section, Segmented, Select, Switch } from "@/components/ui/controls";
import { INTL_LOCALE } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import type { ConvertOptions } from "@/lib/convert/engine";
import type { ImageQuality } from "@/lib/convert/images";
import { PAGE_SIZES, type PageSizeId } from "@/lib/convert/layout";
import { defaultOutputName } from "@/lib/converter";
import { setOptions, useApp } from "@/lib/store";

export function OptionsPanel() {
  const options = useApp((state) => state.options);
  const hasImages = useApp((state) => state.items.some((item) => item.format.kind === "image"));
  const hasText = useApp((state) => state.items.some((item) => item.format.kind === "text"));
  const items = useApp((state) => state.items);
  const { locale, ui } = useI18n();
  const text = ui.options;
  const fitPage = options.pageSize === "fit";
  const single = options.perPage <= 1;

  const mm = (value: number) => value.toLocaleString(INTL_LOCALE[locale]);
  const pageSizeOptions: { value: PageSizeId; label: string }[] = [
    ...Object.entries(PAGE_SIZES).map(([id, size]) => ({ value: id as PageSizeId, label: `${size.label} (${mm(size.width)} × ${mm(size.height)} mm)` })),
    { value: "fit", label: text.fitToImage },
  ];
  const qualityHints: Record<ImageQuality, string> = {
    original: text.qualityOriginalHint,
    high: text.qualityHighHint,
    medium: text.qualityMediumHint,
    low: text.qualityLowHint,
  };

  return (
    <>
      <Section title={text.page}>
        <Field label={text.pageSize}>
          <Select<PageSizeId> label={text.pageSize} value={options.pageSize} options={pageSizeOptions} onChange={(pageSize) => setOptions({ pageSize })} />
        </Field>
        <Field label={text.orientation}>
          <Segmented<ConvertOptions["orientation"]>
            size="sm"
            label={text.orientation}
            value={options.orientation}
            onChange={(orientation) => setOptions({ orientation })}
            options={[
              { value: "auto", label: text.orientationAuto, title: text.orientationAutoTitle },
              { value: "portrait", label: text.portrait },
              { value: "landscape", label: text.landscape },
            ]}
          />
        </Field>
        <Field label={text.margin}>
          <Segmented<string>
            size="sm"
            label={text.margin}
            value={String(options.marginMm)}
            onChange={(value) => setOptions({ marginMm: Number(value) })}
            options={[
              { value: "0", label: text.marginNone },
              { value: "5", label: text.marginSmall },
              { value: "10", label: text.marginMedium },
              { value: "20", label: text.marginLarge },
            ]}
          />
        </Field>
        {hasImages && (
          <>
            <Field label={text.placement}>
              <Segmented<ConvertOptions["fit"]>
                size="sm"
                label={text.placement}
                value={options.fit}
                onChange={(fit) => setOptions({ fit })}
                options={[
                  { value: "contain", label: text.contain, icon: <Minimize />, title: text.containTitle },
                  { value: "cover", label: text.cover, icon: <Maximize />, title: text.coverTitle },
                ]}
              />
            </Field>
            <Field label={text.perPage}>
              <Segmented<string>
                size="sm"
                label={text.perPage}
                value={String(options.perPage)}
                onChange={(value) => setOptions({ perPage: Number(value) })}
                options={["1", "2", "4", "6", "9"].map((value) => ({ value, label: value }))}
              />
            </Field>
            {fitPage && single && <p className="text-xs leading-relaxed text-fg-subtle">{text.fitHint}</p>}
          </>
        )}
      </Section>

      {hasImages && (
        <Section title={text.quality}>
          <Segmented<ImageQuality>
            size="sm"
            label={text.quality}
            value={options.quality}
            onChange={(quality) => setOptions({ quality })}
            options={[
              { value: "original", label: text.qualityOriginal },
              { value: "high", label: text.qualityHigh },
              { value: "medium", label: text.qualityMedium },
              { value: "low", label: text.qualityLow },
            ]}
          />
          <p className="text-xs leading-relaxed text-fg-subtle">{qualityHints[options.quality]}</p>
          <Switch
            checked={options.grayscale}
            onChange={(grayscale) => setOptions({ grayscale })}
            label={
              <span className="inline-flex items-center gap-1.5">
                <Contrast className="size-3.5" /> {text.grayscale}
              </span>
            }
            description={text.grayscaleHint}
          />
        </Section>
      )}

      {hasText && (
        <Section title={text.text}>
          <Field label={text.fontSize} hint={text.fontSizeHint}>
            <NumberInput value={options.fontSize} onChange={(fontSize) => setOptions({ fontSize })} min={7} max={18} step={0.5} unit="pt" stepper label={text.fontSize} className="w-40" />
          </Field>
        </Section>
      )}

      <Section title={text.output}>
        <Segmented<ConvertOptions["output"]>
          label={text.output}
          value={options.output}
          onChange={(output) => setOptions({ output })}
          options={[
            { value: "merge", label: text.merge, icon: <FileStack /> },
            { value: "separate", label: text.separate, icon: <Files /> },
          ]}
        />
        <Field label={options.output === "merge" ? text.fileName : text.zipName}>
          <div className="flex h-9 items-center rounded-lg bg-surface ring-1 ring-border-strong/70 ring-inset focus-within:ring-2 focus-within:ring-primary">
            <PenLine className="ml-3 size-3.5 shrink-0 text-fg-subtle" />
            <input
              value={options.fileName}
              onChange={(event) => setOptions({ fileName: event.target.value })}
              placeholder={defaultOutputName(items, ui.convert.defaultName)}
              aria-label={text.fileName}
              className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
            />
            <span className="pr-3 text-xs text-fg-subtle">{options.output === "merge" ? ".pdf" : ".zip"}</span>
          </div>
        </Field>
        {options.output === "separate" && <Hint>{text.separateHint}</Hint>}
      </Section>
    </>
  );
}
