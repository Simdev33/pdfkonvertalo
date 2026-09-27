import {
  Combine,
  FileCheck2,
  FileText,
  Images,
  LayoutGrid,
  MousePointerClick,
  RotateCw,
  Shrink,
  Upload,
} from "lucide-react";
import { Backdrop, FeatureGrid, Faq, Footer, Hero, Privacy, SectionHeading, Steps } from "./sections";
import { ConverterDropzone } from "./tool-dropzones";

const FORMATS = ["JPG", "PNG", "HEIC", "WebP", "TIFF", "GIF", "BMP", "AVIF", "SVG", "Word", "Excel", "PowerPoint", "TXT", "CSV", "Markdown", "JSON", "PDF"];

const FEATURES = [
  {
    icon: <Images />,
    title: "Minden képformátum",
    text: "JPG, PNG, iPhone-os HEIC, WebP, AVIF, többoldalas TIFF, SVG és a többiek. A JPG és PNG képek bájtra pontosan, minőségromlás nélkül kerülnek a PDF-be.",
  },
  {
    icon: <RotateCw />,
    title: "Mindig jó tájolás",
    text: "A telefonos fotók beépített forgatási adatait automatikusan figyelembe veszi, és bármelyik képet egy kattintással el is forgathatod.",
  },
  {
    icon: <FileText />,
    title: "Office és szöveges fájlok",
    text: "A Word-, Excel- és PowerPoint-fájlok pontosan úgy kerülnek PDF-be, ahogy az Office-ban kinéznek. TXT, Markdown, CSV és JSON fájlokból tördelt, kereshető PDF lesz.",
  },
  {
    icon: <Combine />,
    title: "PDF-ek összefűzése",
    text: "Meglévő PDF-eket – akár jelszóval védetteket is – a képekkel együtt egyetlen dokumentumba fűzhetsz, tetszőleges sorrendben.",
  },
  {
    icon: <LayoutGrid />,
    title: "Rugalmas elrendezés",
    text: "A4, A3, A5, Letter vagy a képhez igazított oldal, állítható margó, kitöltés, és akár 9 kép egy oldalon – élő előnézettel.",
  },
  {
    icon: <Shrink />,
    title: "Tökéletes vagy kicsi",
    text: "Maradhat az eredeti minőség, vagy tömörítheted a képeket e-mailben küldhető méretre, akár fekete-fehérben is.",
  },
];

const STEPS = [
  { icon: <Upload />, title: "Húzd be a fájlokat", text: "Képeket, Office- és szöveges fájlokat, PDF-eket – akár vegyesen. Képernyőképet a Ctrl+V is beilleszt." },
  { icon: <MousePointerClick />, title: "Rendezd és állítsd be", text: "Húzással rendezheted a sorrendet, forgathatsz, és kiválaszthatod az oldalméretet, margót, minőséget." },
  { icon: <FileCheck2 />, title: "Töltsd le a PDF-et", text: "Egyetlen összefűzött PDF vagy fájlonként külön PDF-ek ZIP-ben – vízjel és regisztráció nélkül." },
];

const FAQ = [
  {
    q: "Tényleg nem töltődnek fel a fájljaim?",
    a: "A képek, szöveges fájlok és PDF-ek nem: ezeket teljes egészében a böngésződ alakítja át, egyetlen bájtjuk sem kerül szerverre. Ezt a böngésző fejlesztői eszközeinek Hálózat fülén te magad is ellenőrizheted. Kivételt a Word-, Excel- és PowerPoint-fájlok jelentenek: a pontos átalakításukhoz irodai program kell, ezért ezeket a szerverünk alakítja PDF-fé, és az átalakítás után azonnal törli.",
  },
  {
    q: "Milyen fájlokat tudok PDF-be alakítani?",
    a: "Képeket (JPG, PNG, HEIC/HEIF, WebP, AVIF, GIF, BMP, TIFF – többoldalasat is –, SVG, ICO), Word-dokumentumokat (DOCX, DOC, ODT, RTF), Excel-munkafüzeteket (XLSX, XLS, ODS), PowerPoint-bemutatókat (PPTX, PPT, PPSX, PPS, ODP), szöveges fájlokat (TXT, Markdown, CSV/TSV, JSON, naplófájlok, forráskód) és meglévő PDF-eket. Az Excel-munkafüzet minden látható munkalapja bekerül, a saját oldalbeállításaival.",
  },
  {
    q: "Romlik a képek minősége?",
    a: "„Eredeti” minőségben nem: a JPG és PNG képek változtatás nélkül kerülnek a PDF-be, a többi formátumot pedig veszteségmentesen vagy nagyon jó minőségben alakítjuk át. Ha kisebb fájl kell, válassz tömörítést.",
  },
  {
    q: "Működik az iPhone-os HEIC fotókkal?",
    a: "Igen. A HEIC/HEIF képeket a böngésződben alakítjuk át, a tájolásuk is helyes marad. Az első HEIC fájlnál a dekódoló betöltése néhány másodpercig tarthat.",
  },
  {
    q: "Hogyan állíthatom be a sorrendet?",
    a: "Egérrel vagy ujjal húzd a kártyákat a kívánt helyre, vagy rendezd őket név vagy méret szerint. Billentyűzettel: fókuszálj egy kártyára, szóköz, majd nyilak, végül ismét szóköz.",
  },
  {
    q: "Van méret- vagy darabkorlát?",
    a: "Nincs mesterséges korlát, a géped memóriája szab határt. Több száz fotó vagy több száz oldalas PDF is gond nélkül feldolgozható. A Word-, Excel- és PowerPoint-fájlok egyenként legfeljebb 50 MB-osak lehetnek.",
  },
];

export function ConverterLanding() {
  return (
    <div className="relative overflow-x-clip">
      <Backdrop />
      <Hero
        title="Képekből és fájlokból"
        accent="profi PDF, pillanatok alatt."
        text="Húzd be a fotóidat, szkenneléseidet, Word-, Excel- és PowerPoint-fájljaidat vagy PDF-jeidet, rendezd sorba, és egy kattintással kész a PDF. Nincs regisztráció, nincs vízjel."
        badge="Képek és PDF-ek feltöltés nélkül, a böngésződben"
      >
        <ConverterDropzone />
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-1.5" aria-label="Támogatott formátumok">
          {FORMATS.map((format) => (
            <li key={format} className="rounded-full border border-border bg-surface/80 px-2.5 py-0.5 text-xs font-medium text-fg-muted">
              {format}
            </li>
          ))}
        </ul>
      </Hero>

      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <SectionHeading eyebrow="Funkciók" title="Minden, ami egy profi konvertálóhoz kell" text="Élő előnézettel dolgozik, így pontosan azt kapod, amit a képernyőn látsz." />
        <FeatureGrid features={FEATURES} />
      </section>

      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <SectionHeading eyebrow="Így működik" title="Három lépés, és kész" />
        <Steps steps={STEPS} />
      </section>

      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <Privacy />
      </section>

      <section id="gyik" className="relative mx-auto max-w-3xl scroll-mt-20 px-5 py-16">
        <Faq items={FAQ} />
      </section>

      <Footer />
    </div>
  );
}
