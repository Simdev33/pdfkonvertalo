# PDF Konvertáló

Profi, magyar nyelvű PDF konvertáló Next.js-ben. A képek, szöveges fájlok és PDF-ek feldolgozása **a böngészőben** történik – ezek nem kerülnek szerverre. Egyedül a Word-, Excel- és PowerPoint-fájlokat alakítja át a szerver (lásd lent).

## Funkciók

**PDF-be konvertálás** (`/`)

- **Képek:** JPG, PNG, HEIC/HEIF (iPhone), WebP, AVIF, GIF, BMP, TIFF (többoldalas is), SVG, ICO
  - a JPG és PNG képek bájtra pontosan, minőségromlás nélkül kerülnek a PDF-be
  - EXIF-tájolás (telefonos fotók) helyes kezelése, kézi forgatás
  - beolvasott képeknél a valós DPI-méret megtartása („A kép méretéhez igazítva”)
- **Szöveges fájlok:** TXT, Markdown, CSV/TSV, JSON, naplófájlok, forráskód
  - beágyazott Noto betűtípus (ékezetes, görög, cirill), kereshető szöveg
  - Markdown: címsorok, kiemelések, listák, idézetek, kódblokkok, táblázatok, kattintható linkek
  - CSV: táblázat ismétlődő fejléccel, jobbra igazított számokkal, széles tábláknál fekvő oldal
  - Windows-1250 kódolású (régi magyar) fájlok automatikus felismerése
- **Office-fájlok:** Word (DOCX, DOC, ODT, RTF), Excel (XLSX, XLS, ODS – minden látható munkalap), PowerPoint (PPTX, PPT, PPSX, PPS, ODP) – szerveroldali irodai programmal, pixelpontosan
- **PDF-ek összefűzése** a többi fájllal – jelszóval védett PDF-ek is (helyben kéri a jelszót)
- Húzd-és-rendezd sorrend, rendezés név/méret szerint, Ctrl+V beillesztés, élő (WYSIWYG) előnézet
- Oldalméret (A4, A3, A5, Letter, Legal, képhez igazított), tájolás, margó, kitöltés, 1–9 kép/oldal
- Képminőség (eredeti / nagy / közepes / kicsi), fekete-fehér mód
- Egy összefűzött PDF vagy fájlonként külön PDF (ZIP)

**PDF-ből kép** (`/pdf-bol-kep`)

- Oldalak JPG vagy PNG képpé, 72–600 DPI-n, akár csak a kijelölt oldalakból
- A képekbe a felbontás is bekerül (JFIF / pHYs), így nyomtatáskor valós méretűek

## Technológia

- [Next.js 16](https://nextjs.org) (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4
- [pdf.js](https://mozilla.github.io/pdf.js/) – megjelenítés, bélyegképek, PDF → kép
- [@cantoo/pdf-lib](https://github.com/cantoo-scribe/pdf-lib) – PDF-előállítás, titkosított PDF-ek visszafejtése
- [@cantoo/fontkit](https://www.npmjs.com/package/@cantoo/fontkit) + Noto Sans / Noto Sans Mono – szövegszedés
- [utif2](https://github.com/photopea/UTIF.js) (TIFF), [heic-to](https://github.com/hoppergee/heic-to) (HEIC), [fflate](https://github.com/101arrowz/fflate) (ZIP), [dnd-kit](https://dndkit.com) (rendezés), [zustand](https://zustand.docs.pmnd.rs)

A nehéz könyvtárak (pdf.js, pdf-lib, fontkit, HEIC-dekódoló) csak akkor töltődnek be, amikor szükség van rájuk.

## Fejlesztés

Node.js 22.13+ szükséges.

```bash
npm install
npm run dev
```

Majd nyisd meg: http://localhost:3000

| Parancs | Leírás |
| --- | --- |
| `npm run dev` | fejlesztői szerver |
| `npm run build` / `npm start` | production build és futtatás |
| `npm test` | unit tesztek (Vitest) |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript ellenőrzés |

A `scripts/copy-assets.mjs` (automatikusan fut `install`, `dev` és `build` előtt) a pdf.js workerét és adatfájljait a `public/pdfjs/<verzió>/`, a Noto betűket a `public/fonts/` mappába másolja.

Élesítéskor állítsd be a `NEXT_PUBLIC_SITE_URL` környezeti változót (pl. `https://pdfkonvertalo.hu`) a helyes megosztási (Open Graph) linkekhez.

### Office → PDF (szerveroldal)

A `POST /api/office-to-pdf` végpont (`src/app/api/office-to-pdf/route.ts`, motor: `src/lib/server/office.ts`) egy `file` mezőben kapott Word-, Excel- vagy PowerPoint-fájlt ad vissza PDF-ként. Az átalakító sorrendje:

| Motor | Mikor | Megjegyzés |
| --- | --- | --- |
| [Gotenberg](https://gotenberg.dev) | ha be van állítva a `GOTENBERG_URL` (Vercelen automatikusan, lásd lent) | saját szerveren: `docker run -p 3000:3000 gotenberg/gotenberg:8-libreoffice` + `GOTENBERG_URL=http://localhost:3000` |
| LibreOffice | ha a `soffice` elérhető (`SOFFICE_PATH`, vagy a szokásos telepítési helyek) | pl. Docker-képbe: `apt-get install libreoffice-writer libreoffice-calc libreoffice-impress` |
| Microsoft Word / Excel / PowerPoint | Windowson, ha telepítve van (alkalmazásonként) | fejlesztéshez; COM-automatizálás PowerShellből, makrók tiltva. A PowerPointból csak egy példány fut: ha a felhasználónak nyitva van, a konverzió nem zárja be |

- Legfeljebb 50 MB-os fájl (Vercelen 4,4 MB), 120 s időkorlát; a helyi (LibreOffice/Office) átalakítások sorban futnak, 8-nál több várakozónál a szerver 503-at ad.
- A feltöltött fájl csak egy ideiglenes mappában él, amíg a PDF el nem készül, utána törlődik.
- Jelszóval védett dokumentumot nem alakít át (érthető hibaüzenetet ad).

### Vercel: Gotenberg belső szolgáltatásként

A Vercel függvényeiben nincs irodai program, ezért a `vercel.json` [Vercel Services](https://vercel.com/docs/services)-szel (béta) két szolgáltatást futtat egy projektben:

- `web` – a Next.js-alkalmazás (a repó gyökere), minden nyilvános kérés ide megy;
- `gotenberg` – a `gotenberg/Dockerfile.vercel` konténere (`gotenberg/gotenberg:8.37-libreoffice`, Chromium nélkül). **Nincs nyilvános útvonala**, csak a `web` éri el belső kapcsolaton (binding): a Vercel a címét futásidőben a `GOTENBERG_URL` változóba teszi, így semmit nem kell kézzel beállítani.

Tudnivalók:

- A Services és a konténeres függvények (Container Images) bétában vannak; ha a projektben/csapatban nincsenek bekapcsolva, a deploy hibát ad – ilyenkor a Vercel kezelőfelületén kell hozzáférést kérni.
- A Vercel-függvények kérése legfeljebb 4,5 MB lehet, ezért a feltölthető Office-fájl 4,4 MB. A PDF-et a végpont streamelve adja vissza, arra ez a korlát nem vonatkozik.
- 5 perc tétlenség után a konténer leáll; az első konvertálás utána lassabb (hidegindítás, néhány másodperc).
- A LibreOffice a Calibri/Cambria helyett méretazonos betűket (Carlito/Caladea) használ, így a tördelés megegyezik a Wordével.

## Projektstruktúra

```
vercel.json               Vercel Services: Next.js + belső Gotenberg
gotenberg/                a Gotenberg-szolgáltatás konténere (Dockerfile.vercel)
src/
  app/                    oldalak (/, /pdf-bol-kep), layout, favicon, OG-kép
    api/office-to-pdf/    Office → PDF végpont
  components/
    converter/            PDF-be konvertálás munkafelülete (kártyák, beállítások)
    pdf-to-image/         PDF-ből kép munkafelülete
    landing/              nyitóoldalak
    overlays/             közös rétegek (jelszó, folyamat, eredmény, értesítések, drag & drop)
    ui/                   alap UI-elemek
  lib/
    convert/              konvertáló motor: formátumfelismerés, képfeldolgozás, oldalelrendezés, szövegszedés
    pdf/                  pdf.js és pdf-lib réteg
    server/               szerveroldali Office-átalakító (Gotenberg / LibreOffice / MS Office)
    converter.ts          fájlok importálása, konvertálás indítása
    pdf-to-image.ts       PDF → kép export
    store.ts              állapot (zustand)
```

## Megjegyzések

- A makrós Office-formátumok (DOCM, XLSM, PPTM) nincsenek a támogatott listában.
- A HEIC-dekódoló (`heic-to`, libheif) LGPL-3.0 licencű; külön, igény szerint betöltött fájlként kerül a böngészőbe.
