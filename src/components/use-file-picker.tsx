"use client";

import { useRef } from "react";

/** Hidden file input + a function that opens the OS file dialog. */
export function useFilePicker({ accept, multiple, onFiles }: { accept: string; multiple?: boolean; onFiles: (files: File[]) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const input = (
    <input
      ref={ref}
      type="file"
      accept={accept}
      multiple={multiple}
      className="hidden"
      tabIndex={-1}
      aria-hidden
      onChange={(event) => {
        const files = Array.from(event.target.files ?? []);
        event.target.value = "";
        if (files.length) onFiles(files);
      }}
    />
  );
  return { open: () => ref.current?.click(), input };
}
