"use client";

import { CircleAlert, GripVertical, RotateCcw, RotateCw, X } from "lucide-react";
import { forwardRef, memo, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { Spinner } from "@/components/ui/controls";
import { INTL_LOCALE, type Locale } from "@/i18n/config";
import { plural } from "@/i18n/format";
import { useI18n } from "@/i18n/provider";
import type { UiDict } from "@/i18n/ui/hu";
import type { ConvertOptions } from "@/lib/convert/engine";
import { cardGeometry } from "@/lib/convert/preview";
import { removeItem, rotateItem, type Item } from "@/lib/store";
import { cn, formatBytes } from "@/lib/utils";

const BOX_RATIO = 1 / Math.SQRT2;

function describe(item: Item, locale: Locale, text: UiDict["files"]) {
  const parts: string[] = [item.format.label, formatBytes(item.size, INTL_LOCALE[locale])];
  const preview = item.preview;
  if (preview && item.format.kind === "image") {
    parts.push(`${preview.width} × ${preview.height}`);
    if (preview.count && preview.count > 1) parts.push(plural(locale, text.images, preview.count));
  }
  if (preview?.count && (item.format.kind === "pdf" || item.format.kind === "office")) parts.push(plural(locale, text.pages, preview.count));
  return parts.join(" · ");
}

function PagePreview({ item, options }: { item: Item; options: ConvertOptions }) {
  const geometry = cardGeometry(item, options);
  const text = useI18n().ui.files;
  if (item.status === "error") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-md bg-danger-soft p-3 text-center text-xs text-danger ring-1 ring-danger/30">
        <CircleAlert className="size-5" />
        <span className="line-clamp-4">{item.error ?? text.error}</span>
      </div>
    );
  }
  if (!geometry || item.status === "processing") {
    return (
      <div className="flex aspect-[1/1.4142] h-full flex-col items-center justify-center gap-2 rounded-[3px] bg-surface p-2 text-center shadow-page">
        <Spinner className="size-5 text-fg-subtle" />
        {item.format.kind === "office" && <span className="text-[11px] leading-tight text-fg-subtle">{text.converting}</span>}
      </div>
    );
  }

  const wide = geometry.ratio >= BOX_RATIO;
  const preview = item.preview!;
  const rotate = item.rotation;
  const quarter = rotate === 90 || rotate === 270;

  return (
    <div
      className={cn("@container relative overflow-hidden rounded-[3px] bg-white shadow-page", wide ? "w-full" : "h-full")}
      style={{ aspectRatio: geometry.ratio }}
    >
      {item.format.kind === "image" && geometry.image && preview.url && (
        <div className="absolute overflow-hidden" style={geometry.cell}>
          <div className="absolute" style={geometry.image}>
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
            <img
              src={preview.url}
              alt=""
              draggable={false}
              className={cn("absolute top-1/2 left-1/2 max-w-none select-none", options.grayscale && "grayscale")}
              style={{
                width: quarter ? `${(preview.width / preview.height) * 100}%` : "100%",
                height: quarter ? `${(preview.height / preview.width) * 100}%` : "100%",
                transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
              }}
            />
          </div>
        </div>
      )}

      {(item.format.kind === "pdf" || item.format.kind === "office") && preview.url && (
        // eslint-disable-next-line @next/next/no-img-element -- local blob preview
        <img
          src={preview.url}
          alt=""
          draggable={false}
          className="absolute top-1/2 left-1/2 max-w-none select-none"
          style={{
            width: quarter ? `${geometry.ratio ** -1 * 100}%` : "100%",
            height: quarter ? `${geometry.ratio * 100}%` : "100%",
            transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
          }}
        />
      )}

      {item.format.kind === "text" && geometry.content && (
        <div className="absolute overflow-hidden" style={geometry.content}>
          <pre
            className={cn(
              "text-[max(3px,2.6cqw)] leading-[1.45] break-all whitespace-pre-wrap text-neutral-700",
              item.format.format === "text" || item.format.format === "markdown" ? "font-sans" : "font-mono",
            )}
          >
            {preview.lines?.join("\n")}
          </pre>
        </div>
      )}
    </div>
  );
}

export interface FileCardProps extends HTMLAttributes<HTMLDivElement> {
  item: Item;
  index: number;
  options: ConvertOptions;
  dragging?: boolean;
  overlay?: boolean;
  style?: CSSProperties;
}

export const FileCard = memo(
  forwardRef<HTMLDivElement, FileCardProps>(function FileCard({ item, index, options, dragging, overlay, className, ...props }, ref) {
    const { locale, ui } = useI18n();
    const canRotate = item.status === "ready" && item.format.kind !== "text";
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "group/card relative flex touch-manipulation flex-col gap-2.5 rounded-xl p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-primary",
          dragging && "opacity-30",
          overlay && "scale-[1.03] cursor-grabbing bg-surface/60 shadow-2xl ring-1 ring-border backdrop-blur",
          !overlay && "cursor-grab",
          className,
        )}
        onKeyDown={(event) => {
          props.onKeyDown?.(event);
          if (!event.defaultPrevented && (event.key === "Delete" || event.key === "Backspace") && event.target === event.currentTarget) {
            event.preventDefault();
            removeItem(item.id);
          }
        }}
      >
        <div className="relative flex aspect-[1/1.4142] w-full items-center justify-center">
          <PagePreview item={item} options={options} />

          <span className="absolute top-1.5 left-1.5 rounded-md bg-black/65 px-1.5 py-0.5 text-[11px] font-semibold text-white tabular-nums backdrop-blur">
            {index + 1}
          </span>
          <span className="absolute bottom-1.5 left-1.5 rounded bg-surface/90 px-1.5 py-px text-[10px] font-semibold tracking-wide text-fg-muted ring-1 ring-border backdrop-blur">
            {item.format.label}
          </span>

          {!overlay && (
            <div
              className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 transition-opacity group-focus-within/card:opacity-100 group-hover/card:opacity-100 pointer-coarse:opacity-100"
              onPointerDown={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              {canRotate && (
                <>
                  <CardButton label={ui.files.rotateLeft} onClick={() => rotateItem(item.id, -90)}>
                    <RotateCcw />
                  </CardButton>
                  <CardButton label={ui.files.rotateRight} onClick={() => rotateItem(item.id, 90)}>
                    <RotateCw />
                  </CardButton>
                </>
              )}
              <CardButton label={ui.files.remove} onClick={() => removeItem(item.id)} danger>
                <X />
              </CardButton>
            </div>
          )}
        </div>

        <div className="flex min-w-0 items-start gap-1 px-0.5">
          <GripVertical className="mt-0.5 size-3.5 shrink-0 text-fg-subtle opacity-0 transition-opacity group-hover/card:opacity-100" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium" title={item.name}>
              {item.name}
            </p>
            <p className="truncate text-[11px] text-fg-subtle tabular-nums">{describe(item, locale, ui.files)}</p>
          </div>
        </div>
      </div>
    );
  }),
);

function CardButton({ label, onClick, children, danger }: { label: string; onClick: () => void; children: ReactNode; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-7 place-items-center rounded-md bg-black/65 text-white shadow backdrop-blur transition-colors [&_svg]:size-3.5",
        danger ? "hover:bg-danger" : "hover:bg-black/85",
      )}
    >
      {children}
    </button>
  );
}
