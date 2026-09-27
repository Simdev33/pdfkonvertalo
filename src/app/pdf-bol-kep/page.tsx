import type { Metadata } from "next";
import { PdfToImageLanding } from "@/components/landing/pdf-to-image-landing";
import { PdfToImageApp } from "@/components/pdf-to-image/pdf-to-image-app";

export const metadata: Metadata = {
  title: "PDF-ből kép – JPG és PNG feltöltés nélkül",
  description:
    "PDF oldalak átalakítása JPG vagy PNG képpé 72–600 DPI felbontásban, akár csak a kiválasztott oldalakból. Ingyenes, gyors, és a PDF végig a gépeden marad.",
  alternates: { canonical: "/pdf-bol-kep" },
};

export default function PdfToImagePage() {
  return <PdfToImageApp landing={<PdfToImageLanding />} />;
}
