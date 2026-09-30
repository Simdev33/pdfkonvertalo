/**
 * Server-side texts: metadata, landing pages, footer and API messages. Never
 * imported by client code, so its size does not matter for the bundle.
 * Other languages must match this shape (SiteDict).
 */
export const hu = {
  meta: {
    tagline: "Képek, Office- és szöveges fájlok PDF-be",
    description:
      "Profi PDF konvertáló: JPG, PNG, HEIC, WebP, TIFF, SVG képek, Word-, Excel- és PowerPoint-fájlok, TXT, CSV, Markdown és JSON fájlok PDF-be alakítása, PDF-ek összefűzése és PDF-ből kép készítése. A képek, szövegek és PDF-ek a böngésződben maradnak. {days} napos teljes hozzáférés {trial}.",
    keywords: [
      "PDF konvertáló",
      "kép PDF-be",
      "JPG PDF-be",
      "PNG PDF-be",
      "HEIC PDF-be",
      "Word PDF-be",
      "Excel PDF-be",
      "PowerPoint PDF-be",
      "képek egyesítése PDF-be",
      "PDF-ből JPG",
      "PDF összefűzés",
    ],
    pdfToImageTitle: "PDF-ből kép – JPG és PNG feltöltés nélkül",
    pdfToImageDescription:
      "PDF oldalak átalakítása JPG vagy PNG képpé 72–600 DPI felbontásban, akár csak a kiválasztott oldalakból. Gyors, és a PDF végig a gépeden marad.",
    termsTitle: "Általános szerződési feltételek",
    termsDescription: "A PDF Konvertáló használatának feltételei.",
    privacyTitle: "Adatkezelési tájékoztató",
    privacyDescription: "Milyen adatokat kezel a PDF Konvertáló, mire, meddig, és milyen jogaid vannak.",
    accountTitle: "Fiókom",
    accountDescription: "Belépés e-mailes kóddal és az előfizetés kezelése.",
    ogBadge: "vízjel nélkül · {days} nap {trial}",
    ogTitle: "Képekből és fájlokból",
    ogAccent: "profi PDF, pillanatok alatt.",
  },

  converter: {
    badge: "Képek és PDF-ek feltöltés nélkül, a böngésződben",
    title: "Képekből és fájlokból",
    accent: "profi PDF, pillanatok alatt.",
    text: "Húzd be a fotóidat, szkenneléseidet, Word-, Excel- és PowerPoint-fájljaidat vagy PDF-jeidet, rendezd sorba, és egy kattintással kész a PDF, vízjel nélkül.",
    formatsLabel: "Támogatott formátumok",
    featuresEyebrow: "Funkciók",
    featuresTitle: "Minden, ami egy profi konvertálóhoz kell",
    featuresText: "Élő előnézettel dolgozik, így pontosan azt kapod, amit a képernyőn látsz.",
    features: [
      {
        title: "Minden képformátum",
        text: "JPG, PNG, iPhone-os HEIC, WebP, AVIF, többoldalas TIFF, SVG és a többiek. A JPG és PNG képek bájtra pontosan, minőségromlás nélkül kerülnek a PDF-be.",
      },
      {
        title: "Mindig jó tájolás",
        text: "A telefonos fotók beépített forgatási adatait automatikusan figyelembe veszi, és bármelyik képet egy kattintással el is forgathatod.",
      },
      {
        title: "Office és szöveges fájlok",
        text: "A Word-, Excel- és PowerPoint-fájlok pontosan úgy kerülnek PDF-be, ahogy az Office-ban kinéznek. TXT, Markdown, CSV és JSON fájlokból tördelt, kereshető PDF lesz.",
      },
      {
        title: "PDF-ek összefűzése",
        text: "Meglévő PDF-eket – akár jelszóval védetteket is – a képekkel együtt egyetlen dokumentumba fűzhetsz, tetszőleges sorrendben.",
      },
      {
        title: "Rugalmas elrendezés",
        text: "A4, A3, A5, Letter vagy a képhez igazított oldal, állítható margó, kitöltés, és akár 9 kép egy oldalon – élő előnézettel.",
      },
      {
        title: "Tökéletes vagy kicsi",
        text: "Maradhat az eredeti minőség, vagy tömörítheted a képeket e-mailben küldhető méretre, akár fekete-fehérben is.",
      },
    ],
    stepsEyebrow: "Így működik",
    stepsTitle: "Három lépés, és kész",
    steps: [
      { title: "Húzd be a fájlokat", text: "Képeket, Office- és szöveges fájlokat, PDF-eket – akár vegyesen. Képernyőképet a Ctrl+V is beilleszt." },
      { title: "Rendezd és állítsd be", text: "Húzással rendezheted a sorrendet, forgathatsz, és kiválaszthatod az oldalméretet, margót, minőséget." },
      { title: "Töltsd le a PDF-et", text: "Egyetlen összefűzött PDF vagy fájlonként külön PDF-ek ZIP-ben, vízjel nélkül. Az első {days} nap {trial}." },
    ],
    pricingEyebrow: "Ár",
    pricingTitle: "Egyetlen, egyszerű előfizetés",
    pricingText: "A konvertálás és az előnézet díjmentes, előfizetés csak a kész fájlok letöltéséhez kell.",
    pricingTrial: "{days} napos teljes hozzáférés",
    pricingThen: "utána {monthly} havonta, amíg le nem mondod",
    pricingPoints: [
      "Korlátlan konvertálás és letöltés",
      "Minden formátum: képek, Office-fájlok, szöveg, PDF",
      "Vízjel nélkül, jelszó és regisztráció nélkül",
      "Bármikor lemondható, egy kattintással",
    ],
    pricingCta: "Kezdd el most",
    faq: [
      {
        q: "Tényleg nem töltődnek fel a fájljaim?",
        a: "A képek, szöveges fájlok és PDF-ek nem: ezeket teljes egészében a böngésződ alakítja át, egyetlen bájtjuk sem kerül szerverre. Ezt a böngésző fejlesztői eszközeinek Hálózat fülén te magad is ellenőrizheted. Kivételt a Word-, Excel- és PowerPoint-fájlok jelentenek: a pontos átalakításukhoz irodai program kell, ezért ezeket a szerverünk alakítja PDF-fé, és az átalakítás után azonnal törli.",
      },
      {
        q: "Mennyibe kerül?",
        a: "A konvertálás és az előnézet díjmentes, a kész fájlok letöltéséhez előfizetés kell. Az első {days} nap {trial}, utána {monthly} havonta, amíg le nem mondod. Lemondani bármikor lehet a Fiókom oldalon, egy kattintással; a hozzáférés a már kifizetett időszak végéig megmarad.",
      },
      {
        q: "Kell regisztrálnom?",
        a: "Jelszó nem kell. A fizetéskor megadott e-mail-címeddel lépsz be: másik eszközön a Belépés gombbal kérsz egy 6 jegyű kódot e-mailben, és azzal már használhatod is.",
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
        a: "Nincs mesterséges korlát, a géped memóriája szab határt. Több száz fotó vagy több száz oldalas PDF is gond nélkül feldolgozható. A Word-, Excel- és PowerPoint-fájlok egyenként legfeljebb 4,4 MB-osak lehetnek.",
      },
    ],
  },

  pdfToImage: {
    title: "PDF-ből kép:",
    accent: "JPG vagy PNG, egy kattintással.",
    text: "Minden oldalból éles kép, 72–600 DPI felbontásban, akár csak a kiválasztott oldalakból. A PDF végig a gépeden marad.",
    features: [
      { title: "Oldalválasztás", text: "Az összes oldalt vagy csak a kijelölteket alakítsd képpé – kattintással, Shift-tel vagy oldalszámokkal." },
      { title: "Nyomdai felbontás", text: "72-től 600 DPI-ig. A képekbe a felbontás is bekerül, így nyomtatáskor valós méretűek lesznek." },
      { title: "Védett PDF-ek", text: "A jogosultságokkal védett PDF-ekkel is működik, a jelszavasoknál pedig helyben elkéri a jelszót." },
      { title: "Gyors és helyi", text: "A Mozilla pdf.js motorja rajzolja az oldalakat, közvetlenül a böngésződben – feltöltés nélkül." },
    ],
    faq: [
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
    ],
  },

  sections: {
    badge: "Feltöltés nélkül · 100%-ban a böngésződben",
    privacyTitle: "A fájljaid nálad maradnak",
    privacyText:
      "Személyi igazolvány, bérpapír, szerződés, családi fotók: ezeket nem kellene idegen szerverekre feltölteni. A {site} a képeket, szöveges fájlokat és PDF-eket a saját eszközödön alakítja át, ezért gyors, és akkor is biztonságos, ha bizalmas anyaggal dolgozol. Egyedül a Word-, Excel- és PowerPoint-fájlokhoz kell a szerver: azokat egy irodai program alakítja PDF-fé, majd azonnal törlődnek.",
    stats: [
      { value: "0 bájt", label: "feltöltés képeknél és PDF-eknél" },
      { value: "Azonnal", label: "törlődik az Office-fájl a szerverről" },
      { value: "Nincs", label: "vízjel és jelszavas regisztráció" },
      { value: "pdf.js", label: "a Mozilla megjelenítőmotorja" },
    ],
    faqTitle: "Gyakori kérdések",
    footerNote: "Az Office-fájlok kivételével minden a böngésződben fut.",
    terms: "ÁSZF",
    privacy: "Adatvédelem",
    languages: "Nyelvek",
  },

  legal: {
    effective: "Hatályos: {date}",
    operatorMissing: "[kitöltendő]",
    related: "Kapcsolódó dokumentum:",
  },

  server: {
    tooLarge: "A fájl legfeljebb {limit} lehet.",
    noFile: "Nem érkezett fájl.",
    notOffice: "Ez nem Word-, Excel- vagy PowerPoint-fájl.",
    password: "A fájl jelszóval védett. Nyisd meg, vedd le róla a jelszót, és próbáld újra.",
    failed: "Nem sikerült PDF-fé alakítani a fájlt. Lehet, hogy sérült vagy üres.",
    busy: "Most sokan konvertálnak egyszerre. Próbáld újra egy perc múlva.",
    timeout: "Túl sokáig tartott a fájl átalakítása.",
    unavailable: "A dokumentum-átalakító szolgáltatás most nem érhető el.",
    noEngine: "Ezen a szerveren nincs átalakító ehhez a fájlhoz (LibreOffice, Gotenberg vagy Microsoft {app}).",
    unexpected: "Váratlan hiba történt az átalakítás közben.",
    invalidEmail: "Adj meg egy érvényes e-mail-címet.",
    rateLimited: "Túl sok próbálkozás. Várj néhány percet, és próbáld újra.",
    billingUnavailable: "A fizetési szolgáltatás most nem érhető el. Próbáld újra később.",
    checkoutFailed: "Nem sikerült elindítani a fizetést. Próbáld újra.",
    alreadySubscribed: "Ehhez az e-mail-címhez már tartozik aktív előfizetés. Lépj be a kóddal, amelyet e-mailben küldünk.",
    paymentIncomplete: "A fizetés nem fejeződött be.",
    notSignedIn: "Ehhez be kell lépned.",
    codeInvalid: "Hibás kód. Ellenőrizd, és próbáld újra.",
    codeExpired: "A kód lejárt. Kérj újat.",
    codeLocked: "Túl sok hibás próbálkozás. Kérj új kódot.",
    emailFailed: "Nem sikerült elküldeni az e-mailt. Próbáld újra később.",
  },

  email: {
    subject: "{code} – belépési kódod ({site})",
    intro: "Ezzel a kóddal léphetsz be a(z) {site} oldalon:",
    validity: "A kód {minutes} percig érvényes.",
    ignore: "Ha nem te kérted, nyugodtan hagyd figyelmen kívül ezt a levelet.",
  },
};

export type SiteDict = typeof hu;
