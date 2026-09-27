"use client";

import { ACCEPT } from "@/lib/convert/formats";
import { addFiles, addSampleFiles } from "@/lib/converter";
import { openPdfForImages } from "@/lib/pdf-to-image";
import { Dropzone } from "./dropzone";

export function ConverterDropzone() {
  return (
    <Dropzone
      accept={ACCEPT}
      multiple
      onFiles={(files) => void addFiles(files)}
      onSample={() => void addSampleFiles()}
      title="Húzd ide a fájlokat"
      subtitle="Képek, Office- és szöveges fájlok vagy PDF-ek – akár egyszerre több száz is"
      buttonLabel="Fájlok kiválasztása"
    />
  );
}

export function PdfDropzone() {
  return (
    <Dropzone
      accept="application/pdf,.pdf"
      onFiles={(files) => void openPdfForImages(files[0])}
      title="Húzd ide a PDF-et"
      subtitle="Minden oldalából JPG vagy PNG kép készül – a fájl nem kerül feltöltésre"
      buttonLabel="PDF kiválasztása"
    />
  );
}
