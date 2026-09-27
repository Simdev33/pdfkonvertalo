"use client";

import { Archive, CircleCheck, Download, ExternalLink, FileImage, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/controls";
import { Dialog, DialogClose } from "@/components/ui/dialog";
import { createZip, downloadBlob, openBlob } from "@/lib/files";
import { setResult, toast, useApp, type ResultState } from "@/lib/store";
import { formatBytes, formatDuration } from "@/lib/utils";

export function ResultsDialog() {
  const result = useApp((state) => state.result);
  return (
    <Dialog open={result !== null} onClose={() => setResult(null)} label="Eredmény" className="max-w-xl">
      {result && <ResultsBody result={result} />}
    </Dialog>
  );
}

function ResultsBody({ result }: { result: ResultState }) {
  const [zipping, setZipping] = useState(false);
  const [zip, setZip] = useState<Blob | null>(null);
  const totalSize = result.files.reduce((sum, file) => sum + file.blob.size, 0);
  const multiple = result.files.length > 1;

  const downloadAll = async () => {
    if (!multiple) {
      downloadBlob(result.files[0].blob, result.files[0].name);
      return;
    }
    try {
      setZipping(true);
      const archive = zip ?? (await createZip(result.files));
      setZip(archive);
      downloadBlob(archive, result.archiveName);
    } catch (error) {
      console.error(error);
      toast("A ZIP-fájl elkészítése nem sikerült.", "error");
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="relative">
      <DialogClose onClick={() => setResult(null)} />
      <div className="px-6 pt-6 pb-4">
        <span className="grid size-11 place-items-center rounded-xl bg-success-soft text-success">
          <CircleCheck className="size-5" />
        </span>
        <h2 className="mt-4 text-lg font-semibold tracking-tight">{result.title}</h2>
        <p className="mt-1 text-sm text-fg-muted tabular-nums">
          {result.files.length} fájl · összesen {formatBytes(totalSize)} · {formatDuration(result.elapsed)} alatt
        </p>
        {result.notes.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-fg-muted">
            {result.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </div>

      <ul className="scrollbar-thin mx-3 max-h-[min(22rem,45dvh)] space-y-0.5 overflow-y-auto border-y border-border py-2">
        {result.files.map((file, index) => {
          const image = file.blob.type.startsWith("image/");
          return (
            <li key={`${file.name}-${index}`} className="group flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-fg-muted group-hover:bg-surface">
                {image ? <FileImage className="size-4" /> : <FileText className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" title={file.name}>
                  {file.name}
                </p>
                <p className="truncate text-xs text-fg-subtle tabular-nums">
                  {[file.detail ?? (file.pages !== undefined ? `${file.pages} oldal` : null), formatBytes(file.blob.size)].filter(Boolean).join(" · ")}
                </p>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => openBlob(file.blob)} aria-label={`${file.name} megnyitása`} title="Megnyitás új lapon">
                <ExternalLink />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => downloadBlob(file.blob, file.name)} aria-label={`${file.name} letöltése`} title="Letöltés">
                <Download />
              </Button>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col-reverse gap-2 p-5 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={() => setResult(null)}>
          Bezárás
        </Button>
        <Button variant="primary" onClick={() => void downloadAll()} disabled={zipping} autoFocus>
          {zipping ? <Spinner /> : multiple ? <Archive /> : <Download />}
          {multiple ? `Összes letöltése (ZIP)` : "Letöltés"}
        </Button>
      </div>
    </div>
  );
}
