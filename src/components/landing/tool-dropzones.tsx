"use client";

import { useI18n } from "@/i18n/provider";
import { ACCEPT } from "@/lib/convert/formats";
import { addFiles, addSampleFiles } from "@/lib/converter";
import { openPdfForImages } from "@/lib/pdf-to-image";
import { Dropzone } from "./dropzone";

export function ConverterDropzone() {
  const text = useI18n().ui.dropzone;
  return (
    <Dropzone
      accept={ACCEPT}
      multiple
      onFiles={(files) => void addFiles(files)}
      onSample={() => void addSampleFiles()}
      title={text.filesTitle}
      subtitle={text.filesSubtitle}
      buttonLabel={text.filesButton}
    />
  );
}

export function PdfDropzone() {
  const text = useI18n().ui.dropzone;
  return (
    <Dropzone
      accept="application/pdf,.pdf"
      onFiles={(files) => void openPdfForImages(files[0])}
      title={text.pdfTitle}
      subtitle={text.pdfSubtitle}
      buttonLabel={text.pdfButton}
    />
  );
}
