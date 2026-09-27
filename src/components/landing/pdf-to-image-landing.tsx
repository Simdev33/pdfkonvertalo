import { Gauge, KeyRound, ListChecks, Printer } from "lucide-react";
import { Backdrop, FeatureGrid, Faq, Footer, Hero, Privacy } from "./sections";
import { PdfDropzone } from "./tool-dropzones";

const FEATURES = [
  { icon: <ListChecks />, title: "Oldalválasztás", text: "Az összes oldalt vagy csak a kijelölteket alakítsd képpé – kattintással, Shift-tel vagy oldalszámokkal." },
  { icon: <Printer />, title: "Nyomdai felbontás", text: "72-től 600 DPI-ig. A képekbe a felbontás is bekerül, így nyomtatáskor valós méretűek lesznek." },
  { icon: <KeyRound />, title: "Védett PDF-ek", text: "A jogosultságokkal védett PDF-ekkel is működik, a jelszavasoknál pedig helyben elkéri a jelszót." },
  { icon: <Gauge />, title: "Gyors és helyi", text: "A Mozilla pdf.js motorja rajzolja az oldalakat, közvetlenül a böngésződben – feltöltés nélkül." },
];

const FAQ = [
  {
    q: "JPG-t vagy PNG-t válasszak?",
    a: "Fotókat és vegyes tartalmat tartalmazó oldalakhoz a JPG kisebb fájlt ad. Szöveghez, ábrákhoz, képernyőképekhez a PNG élesebb, mert veszteségmentes.",
  },
  {
    q: "Mekkora felbontás kell?",
    a: "Képernyőre és weboldalra 72–150 DPI elég. Nyomtatáshoz 300 DPI az ajánlott, különösen apró betűs vagy részletes oldalaknál pedig 600 DPI.",
  },
  {
    q: "Feltöltődik a PDF valahová?",
    a: "Nem. Az oldalak megjelenítése és a képek elkészítése is a böngésződben történik.",
  },
];

export function PdfToImageLanding() {
  return (
    <div className="relative overflow-x-clip">
      <Backdrop />
      <Hero
        title="PDF-ből kép:"
        accent="JPG vagy PNG, egy kattintással."
        text="Minden oldalból éles kép, 72–600 DPI felbontásban, akár csak a kiválasztott oldalakból. A PDF végig a gépeden marad."
      >
        <PdfDropzone />
      </Hero>
      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <FeatureGrid features={FEATURES} />
      </section>
      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <Privacy />
      </section>
      <section className="relative mx-auto max-w-3xl px-5 py-16">
        <Faq items={FAQ} />
      </section>
      <Footer />
    </div>
  );
}
