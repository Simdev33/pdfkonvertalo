"use client";

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDownAZ, ArrowUpDown, ArrowUpZA, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useFilePicker } from "@/components/use-file-picker";
import { ACCEPT } from "@/lib/convert/formats";
import { addFiles } from "@/lib/converter";
import { clearItems, moveItem, sortItems, useApp, type Item } from "@/lib/store";
import { formatBytes } from "@/lib/utils";
import { FileCard } from "./file-card";

const nameOf = (items: Item[], id: string | number) => items.find((item) => item.id === id)?.name ?? "fájl";
const positionOf = (items: Item[], id: string | number) => items.findIndex((item) => item.id === id) + 1;

export function FileGrid() {
  const items = useApp((state) => state.items);
  const options = useApp((state) => state.options);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { open, input } = useFilePicker({ accept: ACCEPT, multiple: true, onFiles: (files) => void addFiles(files) });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const announcements: Announcements = {
    onDragStart: ({ active }) => `${nameOf(items, active.id)} felvéve, jelenleg a(z) ${positionOf(items, active.id)}. helyen.`,
    onDragOver: ({ active, over }) => (over ? `${nameOf(items, active.id)} a(z) ${positionOf(items, over.id)}. helyre kerül.` : undefined),
    onDragEnd: ({ active, over }) => (over ? `${nameOf(items, active.id)} letéve a(z) ${positionOf(items, over.id)}. helyen.` : "Áthelyezés megszakítva."),
    onDragCancel: ({ active }) => `${nameOf(items, active.id)} áthelyezése megszakítva.`,
  };

  const onDragStart = (event: DragStartEvent) => setActiveId(String(event.active.id));
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (over && active.id !== over.id) moveItem(String(active.id), String(over.id));
  };
  const active = activeId ? items.find((item) => item.id === activeId) : undefined;
  const totalSize = items.reduce((sum, item) => sum + item.size, 0);

  return (
    <>
      <div className="flex min-h-12 flex-wrap items-center gap-x-2 gap-y-2 border-b border-border bg-surface/85 px-3 py-2 backdrop-blur sm:px-4">
        <p className="mr-auto text-[13px] text-fg-muted tabular-nums">
          <span className="font-semibold text-fg">{items.length}</span> fájl · {formatBytes(totalSize)}
          <span className="ml-2 hidden text-xs text-fg-subtle md:inline">Húzással rendezheted a sorrendet.</span>
        </p>
        <SortMenu />
        <Button variant="ghost" size="sm" onClick={() => window.confirm("Biztosan eltávolítod az összes fájlt?") && clearItems()}>
          <Trash2 />
          <span className="hidden sm:inline">Összes törlése</span>
        </Button>
        <Button variant="soft" size="sm" onClick={open}>
          <Plus />
          Hozzáadás
        </Button>
        {input}
      </div>

      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveId(null)}
          accessibility={{
            announcements,
            screenReaderInstructions: {
              draggable: "A fájl felvételéhez nyomd meg a szóközt. Húzás közben a nyilakkal mozgathatod, a szóközzel leteheted, az Escape-pel megszakíthatod.",
            },
          }}
        >
          <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
            <div className="grid gap-x-4 gap-y-5 p-5 sm:p-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(172px, 100%), 1fr))" }}>
              {items.map((item, index) => (
                <SortableCard key={item.id} item={item} index={index} options={options} />
              ))}
              <AddCard onClick={open} />
            </div>
          </SortableContext>
          <DragOverlay dropAnimation={{ duration: 180, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }}>
            {active ? <FileCard item={active} index={items.indexOf(active)} options={options} overlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}

function SortableCard({ item, index, options }: { item: Item; index: number; options: ReturnType<typeof useApp.getState>["options"] }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (
    <FileCard
      ref={setNodeRef}
      item={item}
      index={index}
      options={options}
      dragging={isDragging}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      aria-label={`${index + 1}. ${item.name}`}
      {...attributes}
      {...listeners}
    />
  );
}

function AddCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-2.5 rounded-xl p-1.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <span className="flex aspect-[1/1.4142] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border-strong text-fg-muted transition-colors group-hover:border-primary/60 group-hover:text-primary">
        <span className="grid size-10 place-items-center rounded-full bg-surface-2 transition-colors group-hover:bg-primary-soft">
          <Plus className="size-5" />
        </span>
        <span className="text-[13px] font-medium">Fájlok hozzáadása</span>
        <span className="px-3 text-center text-[11px] text-fg-subtle">vagy húzd ide, illeszd be (Ctrl+V)</span>
      </span>
    </button>
  );
}

function SortMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const choose = (by: Parameters<typeof sortItems>[0]) => {
    sortItems(by);
    if (ref.current) ref.current.open = false;
  };
  return (
    <details ref={ref} className="relative [&_summary::-webkit-details-marker]:hidden">
      <summary className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-fg-muted hover:bg-surface-2 hover:text-fg [&_svg]:size-4">
        <ArrowUpDown />
        <span className="hidden sm:inline">Rendezés</span>
      </summary>
      <div className="absolute right-0 z-30 mt-1 w-52 rounded-xl border border-border bg-surface p-1 shadow-xl animate-pop-in">
        {(
          [
            ["name-asc", "Név szerint (A–Z)", <ArrowDownAZ key="a" />],
            ["name-desc", "Név szerint (Z–A)", <ArrowUpZA key="z" />],
            ["size-asc", "Méret szerint (növekvő)", <ArrowUpDown key="s" />],
            ["size-desc", "Méret szerint (csökkenő)", <ArrowUpDown key="d" />],
          ] as const
        ).map(([by, label, icon]) => (
          <button
            key={by}
            type="button"
            onClick={() => choose(by)}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] hover:bg-surface-2 [&_svg]:size-4 [&_svg]:text-fg-subtle"
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </details>
  );
}
