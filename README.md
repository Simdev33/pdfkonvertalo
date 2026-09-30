# ConvertPDFNow (convertpdfnow.com)

Profi PDF konvertáló Next.js-ben, öt nyelven (fő nyelv az angol, továbbá magyar, német, francia, spanyol). A képek, szöveges fájlok és PDF-ek feldolgozása **a böngészőben** történik – ezek nem kerülnek szerverre. Egyedül a Word-, Excel- és PowerPoint-fájlokat alakítja át a szerver (lásd lent).

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

**PDF-ből kép** (`/pdf-to-image`)

- Oldalak JPG vagy PNG képpé, 72–600 DPI-n, akár csak a kijelölt oldalakból
- A képekbe a felbontás is bekerül (JFIF / pHYs), így nyomtatáskor valós méretűek

**Előfizetés:** a konvertálás és az előnézet díjmentes, az elkészült fájlok letöltéséhez előfizetés kell: 7 nap teljes hozzáférés 1,00 €, utána 9,90 €/hó, bármikor lemondható (Stripe). Jelszó nincs: a fizetéskor megadott e-mail-címmel, e-mailben kapott kóddal lehet belépni; a Fiókom oldalon (`/account`) a Stripe ügyfélportálján mondható le.

**Jogi oldalak:** Általános szerződési feltételek (`/terms`) és adatkezelési tájékoztató (`/privacy`), minden nyelven; az üzemeltető a TourCierge s. r. o. (Pozsony).

## Nyelvek

| Oldal | angol | magyar | német | francia | spanyol |
| --- | --- | --- | --- | --- | --- |
| Konvertáló | `/` | `/hu` | `/de` | `/fr` | `/es` |
| PDF-ből kép | `/pdf-to-image` | `/hu/pdf-bol-kep` | `/de/pdf-in-bild` | `/fr/pdf-en-image` | `/es/pdf-a-imagen` |
| ÁSZF | `/terms` | `/hu/aszf` | `/de/agb` | `/fr/conditions` | `/es/terminos` |
| Adatvédelem | `/privacy` | `/hu/adatvedelem` | `/de/datenschutz` | `/fr/confidentialite` | `/es/privacidad` |
| Fiókom | `/account` | `/hu/fiok` | `/de/konto` | `/fr/compte` | `/es/cuenta` |

- Az angol (fő nyelv) a gyökérben van (`app/(en)`), a többi nyelv közös, előtagos útvonalon fut (`app/[lang]`); mind statikusan generált. A két gyökér-layout miatt a 404-et az `app/global-not-found.tsx` adja (`experimental.globalNotFound`).
- **Automatikus nyelvválasztás** (`src/proxy.ts`): aki először nyitja meg a `/` címet, azt a böngészője nyelve (`Accept-Language`) szerint átirányítja a saját nyelvére (pl. magyar böngésző → `/hu`); ha a böngésző nyelvét nem ismerjük, angol marad. A nyelvváltóban (fejléc, lábléc) választott nyelvet a `pk_lang` süti egy évig megjegyzi, onnantól nincs átirányítás. A kereső-robotok (nyelv nélkül) az angol gyökeret látják. A kézzel beírt `/en/…` a `/…` címre visz.
- A régi magyar címek (`/pdf-bol-kep`, `/aszf`, `/adatvedelem`, `/fiok`) végleges átirányítással a `/hu/…` alá mutatnak (`next.config.ts`).
- Címek és nyelvek: `src/i18n/config.ts` (`DEFAULT_LOCALE`, `SLUGS`, `pathFor`). Az angol mappanevek a `SLUGS.en` értékei – ha egyiket átnevezed, a mappát is.
- Szövegek: `src/i18n/ui/*` (a felület, csak az aktív nyelv kerül a böngészőbe), `src/i18n/site/*` (nyitóoldalak, metaadatok, API-hibák), `src/i18n/legal/*` (jogi szövegek). A forrás a magyar; a `src/i18n/i18n.test.ts` ellenőrzi, hogy minden fordításban ugyanazok a kulcsok, `{helykitöltők}` és linkek szerepelnek.
- Nyelvváltó a fejlécben, `hreflang` alternatívák az oldalakon és a `sitemap.xml`-ben, nyelvenkénti OG-kép.

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

Az ikon forrása a `src/app/icon.svg` (ez a favicon is); ha módosítod, az `npm run icons` újragenerálja belőle a `favicon.ico`-t, az `apple-icon.png`-t és a manifest ikonjait (`public/icon-192.png`, `public/icon-512.png`). A fejléc logója (`src/components/brand.tsx`) és a megosztási kép (`src/components/og-image.tsx`) ugyanezt a rajzot használja.

Élesítéskor állítsd be a `NEXT_PUBLIC_SITE_URL` környezeti változót (`https://convertpdfnow.com`) a helyes canonical-, `hreflang`-, sitemap- és Open Graph-linkekhez. Ha nincs megadva, Vercelen a projekt éles domainje (`VERCEL_PROJECT_PRODUCTION_URL`) lesz az alapcím.

Az ÁSZF és az adatkezelési tájékoztató üzemeltetői adatai (név, cím, e-mail, nyilvántartási szám, adószám) a `src/lib/site.ts` `operator` mezőjében vannak; ami üres, az a jogi oldalakon kiemelt „kitöltendő” jelöléssel látszik. Ugyanitt van a hatálybalépés dátuma (`legalEffective`).

### Előfizetés és fizetés (Stripe)

A környezeti változók listája a `.env.example`-ben van (helyben: `.env.local`, Vercelen: Project → Settings → Environment Variables).

| Változó | Mire kell |
| --- | --- |
| `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe-kulcsok (tesztre `sk_test_…` / `pk_test_…`) |
| `SESSION_SECRET` | a belépési sütik aláírása (hosszú véletlen szöveg) |
| `RESEND_API_KEY`, `EMAIL_FROM` | belépési kódok e-mailben ([Resend](https://resend.com)); kulcs nélkül fejlesztéskor a kód a szervernaplóba kerül |
| `STRIPE_PRICE_TRIAL`, `STRIPE_PRICE_MONTHLY` | nem kötelező: meglévő Stripe-árak; üresen az app első használatkor létrehozza a „ConvertPDFNow” terméket és a két árat (1,00 € egyszeri, 9,90 €/hó) |

Működés:

- Adatbázis nincs: az előfizetés állapotát mindig a Stripe-tól kérdezi (`src/lib/server/billing.ts`), a belépett ügyfelet aláírt, `httpOnly` süti azonosítja (`src/lib/server/session.ts`). A belépési kód hash-e, lejárata és a próbálkozások száma (max. 5) a Stripe-ügyfél metaadataiban van (`src/lib/server/login.ts`).
- Fizetés: Checkout Sessions API, `ui_mode: "elements"` – saját fizetési oldal expressz gombokkal (Apple Pay, Google Pay, PayPal, Link) és kártyaűrlappal (`src/components/paywall/`). Az előfizetés 7 napos próbaidő, az első számlán 1,00 € egyszeri díjjal. Ha egy e-mail-címhez már van aktív előfizetés, nem enged újat, hanem belépést kér.
- A konvertálás a böngészőben marad; a letöltés előtt a böngésző kérdezi meg a szervert, van-e hozzáférés (`src/lib/deliver.ts`). Átirányító fizetési módnál (PayPal) az elkészült fájl legfeljebb 60 percig az eszközön, IndexedDB-ben vár (`src/lib/pending-result.ts`).
- Az Office-fájlokat a szerver alakítja át, ezért ott a szerver dönt: előfizetés nélkül csak az **első oldalt** adja vissza előnézetnek (`X-Preview: 1`, a teljes hosszt az `X-Page-Count` fejléc mondja meg), és IP-címenként 10 percenként legfeljebb 60 ilyen kérést fogad. Ha az eredményben ilyen előnézet van, fizetés (vagy belépés) után az oldal a teljes dokumentumokkal automatikusan újra lefuttatja a konvertálást, és elindítja a letöltést; átirányító fizetésnél ehhez a bemeneti fájlok is az IndexedDB-ben várnak.
- Végpontok: `POST /api/checkout`, `POST /api/checkout/complete`, `GET|DELETE /api/account`, `POST /api/account/portal`, `POST /api/auth/request`, `POST /api/auth/verify`.

A Stripe felületén élesítés előtt:

- **Settings → Payment methods:** kapcsold be a kívánt módokat (kártya, Apple Pay, Google Pay, PayPal, Link).
- **Settings → Payment method domains:** add hozzá az oldal domainjét (Apple Pay / Google Pay / PayPal csak regisztrált, HTTPS-es domainen jelenik meg).
- **Settings → Billing → Subscriptions and emails:** kapcsold be a próbaidő lejárta előtti emlékeztető e-mailt és a nyugtákat (a kártyatársaságok előírják).
- **Settings → Public details:** cégnév, támogatási e-mail, ÁSZF- és adatvédelmi URL.

### Office → PDF (szerveroldal)

A `POST /api/office-to-pdf` végpont (`src/app/api/office-to-pdf/route.ts`, motor: `src/lib/server/office.ts`) egy `file` mezőben kapott Word-, Excel- vagy PowerPoint-fájlt ad vissza PDF-ként – előfizetőnek a teljeset, mindenki másnak csak az első oldalát (lásd fent). Az átalakító sorrendje:

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
  app/
    (en)/                 angol oldalak a gyökérben (/, /pdf-to-image, /terms, /privacy, /account) + gyökér-layout
    [lang]/               magyar, német, francia, spanyol oldalak lefordított címekkel + gyökér-layout
    api/                  Office → PDF, fizetés, belépés, fiók
  proxy.ts                első látogatáskor a böngésző nyelvére irányít
    global-not-found.tsx, sitemap.ts, robots.ts, icon.svg
  i18n/                   nyelvek, címek, szótárak (ui / site / legal), fordítási segédek
  components/
    site-shell.tsx        közös <html>-váz (betűk, téma, nyelv, fejléc)
    pages.tsx             oldaltartalom és metaadatok oldalazonosító szerint
    legal-page.tsx        ÁSZF / adatvédelem megjelenítése
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
