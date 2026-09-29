/**
 * Texts of the interactive parts (client components, toasts, errors). Only
 * the active language is sent to the browser. Other languages must match
 * this shape (UiDict); "{name}" placeholders and { one, other } plural forms
 * are filled by fmt() / plural() in ../format.
 */
export const hu = {
  common: {
    close: "Bezárás",
    cancel: "Mégse",
    unexpected: "Váratlan hiba történt.",
    seconds: "mp",
    decrease: "Csökkentés",
    increase: "Növelés",
  },

  nav: {
    home: "Kezdőlap",
    tools: "Eszközök",
    converter: "PDF-be konvertálás",
    converterShort: "PDF-be",
    pdfToImage: "PDF-ből kép",
    pdfToImageShort: "PDF → kép",
    confirmHome: "Visszatérsz a főoldalra? A megnyitott fájlok bezáródnak.",
    theme: "Világos / sötét téma",
    language: "Nyelv",
    confirmLanguage: "Nyelvet váltasz? A megnyitott fájlok bezáródnak.",
  },

  dropzone: {
    sample: "Kipróbálom mintafájlokkal",
    filesTitle: "Húzd ide a fájlokat",
    filesSubtitle: "Képek, Office- és szöveges fájlok vagy PDF-ek – akár egyszerre több száz is",
    filesButton: "Fájlok kiválasztása",
    pdfTitle: "Húzd ide a PDF-et",
    pdfSubtitle: "Minden oldalából JPG vagy PNG kép készül – a fájl nem kerül feltöltésre",
    pdfButton: "PDF kiválasztása",
    dropFiles: "Engedd el a fájlokat",
    dropFilesNext: "és már készül is belőlük a PDF.",
    dropPdf: "Engedd el a PDF-et",
    dropPdfNext: "és minden oldalából kép készül.",
    wrongDrop: "Ide PDF-fájlt húzz – képeket a „PDF-be konvertálás” oldalon alakíthatsz PDF-fé.",
    pasted: { one: "Kép beillesztve a vágólapról.", other: "{count} fájl beillesztve a vágólapról." },
    pastedName: "beillesztett",
  },

  files: {
    count: { one: "{count} fájl", other: "{count} fájl" },
    reorderHint: "Húzással rendezheted a sorrendet.",
    confirmClear: "Biztosan eltávolítod az összes fájlt?",
    clearAll: "Összes törlése",
    add: "Hozzáadás",
    addTitle: "Fájlok hozzáadása",
    addHint: "vagy húzd ide, illeszd be (Ctrl+V)",
    sort: "Rendezés",
    sortNameAsc: "Név szerint (A–Z)",
    sortNameDesc: "Név szerint (Z–A)",
    sortSizeAsc: "Méret szerint (növekvő)",
    sortSizeDesc: "Méret szerint (csökkenő)",
    fallbackName: "fájl",
    cardLabel: "{position}. {name}",
    dndPickedUp: "{name} felvéve, jelenleg a(z) {position}. helyen.",
    dndOver: "{name} a(z) {position}. helyre kerül.",
    dndDropped: "{name} letéve a(z) {position}. helyen.",
    dndCancelled: "Áthelyezés megszakítva.",
    dndCancelledItem: "{name} áthelyezése megszakítva.",
    dndInstructions:
      "A fájl felvételéhez nyomd meg a szóközt. Húzás közben a nyilakkal mozgathatod, a szóközzel leteheted, az Escape-pel megszakíthatod.",
    images: { one: "{count} kép", other: "{count} kép" },
    pages: { one: "{count} oldal", other: "{count} oldal" },
    error: "Hiba",
    converting: "Átalakítás a szerveren…",
    rotateLeft: "Forgatás balra",
    rotateRight: "Forgatás jobbra",
    remove: "Eltávolítás",
  },

  options: {
    page: "Oldal",
    pageSize: "Oldalméret",
    fitToImage: "A kép méretéhez igazítva",
    orientation: "Tájolás",
    orientationAuto: "Automatikus",
    orientationAutoTitle: "A kép alakjához igazodik",
    portrait: "Álló",
    landscape: "Fekvő",
    margin: "Margó",
    marginNone: "Nincs",
    marginSmall: "Kicsi",
    marginMedium: "Közepes",
    marginLarge: "Nagy",
    placement: "Kép elhelyezése",
    contain: "Teljes kép",
    containTitle: "A teljes kép látszik",
    cover: "Kitöltés",
    coverTitle: "Kitölti a helyet, a széleket levágja",
    perPage: "Képek oldalanként",
    fitHint: "Minden oldal pontosan akkora lesz, mint a kép. Beolvasott dokumentumoknál a valós méretet is megőrzi.",
    quality: "Képminőség",
    qualityOriginal: "Eredeti",
    qualityHigh: "Nagy",
    qualityMedium: "Közepes",
    qualityLow: "Kicsi",
    qualityOriginalHint: "Veszteségmentes: a JPG és PNG képek bájtra pontosan kerülnek át, a többi a lehető legjobb minőségben.",
    qualityHighHint: "Legfeljebb 3200 px, 85%-os JPG – nyomtatáshoz is bőven elég, jóval kisebb fájl.",
    qualityMediumHint: "Legfeljebb 2000 px, 75%-os JPG – ideális e-mailhez, ügyintézéshez.",
    qualityLowHint: "Legfeljebb 1400 px, 60%-os JPG – a lehető legkisebb fájl, képernyőre.",
    grayscale: "Fekete-fehér",
    grayscaleHint: "Szürkeárnyalatos képek – beolvasott iratokhoz ideális, kisebb fájl.",
    text: "Szöveges fájlok",
    fontSize: "Betűméret",
    fontSizeHint:
      "Noto Sans betűtípus ékezetes, görög és cirill betűkkel. A kód, a JSON és a naplófájlok fix szélességű betűvel készülnek, a CSV-ből táblázat lesz.",
    output: "Kimenet",
    merge: "Egy PDF-be",
    separate: "Fájlonként",
    fileName: "Fájlnév",
    zipName: "ZIP-fájl neve",
    separateHint: "Minden bemenetből külön PDF készül, a nevük megegyezik az eredeti fájlokéval.",
  },

  convert: {
    loading: { one: "{count} fájl betöltése…", other: "{count} fájl betöltése…" },
    summary: "{files} → {pdfs}",
    pdfCount: { one: "{count} PDF", other: "{count} PDF" },
    failedCount: { one: " · {count} hibás kimarad", other: " · {count} hibás kimarad" },
    createOne: "PDF létrehozása",
    createMany: "PDF-ek létrehozása",
    rejected: "{list}: nem támogatott vagy üres fájl.",
    passwordSkipped: "„{name}” kihagyva – jelszó nélkül nem nyitható meg.",
    stillLoading: "Egy pillanat, még töltődnek a fájlok.",
    nothing: "Nincs konvertálható fájl.",
    jobTitle: "Konvertálás PDF-be",
    mergedNote: { one: "{files}ból {count} oldalas PDF készült.", other: "{files}ból {count} oldalas PDF készült." },
    skippedNote: { one: "{count} hibás fájl kimaradt.", other: "{count} hibás fájl kimaradt." },
    resultOne: "Elkészült a PDF",
    resultMany: { one: "{count} PDF elkészült", other: "{count} PDF elkészült" },
    cancelled: "A konvertálást megszakítottad.",
    defaultName: "konvertalt",
    itemFailed: "„{name}” nem konvertálható: {reason}",
    saving: "PDF mentése…",
    imagePlaceholder: "[kép]",
    invalidSvg: "Érvénytelen SVG-fájl.",
    emptyTiff: "A TIFF-fájl nem tartalmaz képet.",
    fontFailed: "A betűtípus nem tölthető be. Ellenőrizd az internetkapcsolatot.",
    invalidPdf: "A fájl sérült, vagy nem érvényes PDF.",
    encodeFailed: "A kép kódolása nem sikerült.",
    network: "Nem érhető el a szerver, ellenőrizd az internetkapcsolatot.",
    tooLarge: "A fájl túl nagy ahhoz, hogy a szerver átalakítsa.",
    serverStatus: "A szerver hibát jelzett ({status}).",
  },

  pdfTool: {
    notPdf: "„{name}” nem PDF-fájl.",
    reading: "Fájl beolvasása…",
    opening: "Dokumentum megnyitása…",
    readingPages: "Oldalak beolvasása…",
    closed: "A PDF már nincs megnyitva – nyisd meg újra.",
    selectOne: "Jelölj ki legalább egy oldalt.",
    jobTitle: "Képek készítése",
    page: "{page}. oldal",
    detail: "{page}. oldal · {width} × {height} px",
    resultOne: "Elkészült a kép",
    resultMany: { one: "{count} kép elkészült", other: "{count} kép elkészült" },
    archiveSuffix: "kepek",
    note: "{format}, {dpi} DPI felbontással.",
    cancelled: "A műveletet megszakítottad.",
    protected: "Jelszóval védett",
    pages: { one: "{count} oldal", other: "{count} oldal" },
    selected: "kijelölve",
    all: "Összes",
    odd: "Páratlan",
    even: "Páros",
    none: "Egyik sem",
    rangeClick: "+ kattintás: tartomány",
    zoomOut: "Kicsinyítés",
    zoomIn: "Nagyítás",
    thumbSize: "Bélyegkép mérete",
    closePdf: "PDF bezárása",
    pageSelected: "{page}. oldal (kijelölve)",
    format: "Formátum",
    jpegHint: "Kisebb fájl – fotókhoz és vegyes tartalomhoz.",
    pngHint: "Veszteségmentes – szöveghez, ábrákhoz, képernyőképekhez.",
    quality: "Minőség: {value}%",
    qualityLabel: "JPG minőség",
    resolution: "Felbontás",
    firstPage: "Az 1. oldal mérete: {width} × {height} képpont",
    pagesTitle: "Oldalak",
    scopeAll: "Mind ({count})",
    scopeSelected: "Kijelöltek ({count})",
    rangePlaceholder: "pl. 1-3, 7, 10-",
    rangeLabel: "Kijelölt oldalak",
    rangeHint: "Kattints az oldalakra, vagy írd be a számukat.",
    rangeUnparsable: "Nem értelmezhető: „{token}”",
    rangeZero: "Az oldalszámozás 1-től indul.",
    rangeBeyond: { one: "Nincs {page}. oldal – a dokumentum {count} oldalas.", other: "Nincs {page}. oldal – a dokumentum {count} oldalas." },
    dpiHint: "A képekbe a felbontás is bekerül, így nyomtatáskor valós méretűek lesznek.",
    summary: { one: "{count} oldal → {count} {format}", other: "{count} oldal → {count} {format}" },
    zip: " (ZIP)",
    saveOne: "Kép mentése",
    saveMany: "Képek mentése",
  },

  overlays: {
    preparing: "Előkészítés…",
    abort: "Megszakítás",
    passwordLabel: "Jelszó megadása",
    passwordTitle: "Jelszóval védett PDF",
    passwordBody: "A(z) {name} megnyitásához jelszó szükséges. A jelszó csak a böngésződben használódik fel.",
    password: "Jelszó",
    showPassword: "Jelszó megjelenítése",
    hidePassword: "Jelszó elrejtése",
    wrongPassword: "Hibás jelszó, próbáld újra.",
    open: "Megnyitás",
    resultLabel: "Eredmény",
    resultSummary: "{files} · összesen {size} · {duration} alatt",
    openNewTab: "Megnyitás új lapon",
    openFile: "{name} megnyitása",
    downloadFile: "{name} letöltése",
    download: "Letöltés",
    downloadAll: "Összes letöltése (ZIP)",
    zipFailed: "A ZIP-fájl elkészítése nem sikerült.",
  },

  errorPage: {
    title: "Valami elromlott",
    text: "Váratlan hiba történt. A fájljaid nem kerültek sehova – próbáld újra.",
    retry: "Újrapróbálom",
  },

  notFound: {
    title: "Ez az oldal nem található",
    text: "Lehet, hogy elírás van a címben, vagy az oldal már nem létezik.",
    back: "Vissza a konvertálóhoz",
  },

  samples: {
    photoName: "naplemente.jpg",
    photoCaption: "Balaton, naplemente",
    chartName: "grafikon-atlatszo.png",
    chartTitle: "Negyedéves bevétel",
    flowerName: "virag",
    markdownName: "projektjegyzet.md",
    markdown: `# Projektjegyzet

Ez a fájl **Markdown** formátumú. A PDF Konvertáló megtartja a címsorokat, a *kiemeléseket*, a \`kódot\` és a [hivatkozásokat](https://example.com).

## Teendők

- Árajánlat összeállítása
- Szerződés véglegesítése
  - jogi átnézés
  - aláírás
- Számla kiküldése

> A legjobb PDF az, amit nem kell kétszer elkészíteni.

## Költségek

| Tétel | Mennyiség | Ár |
|---|---:|---:|
| Tervezés | 12 óra | 180 000 Ft |
| Fejlesztés | 40 óra | 600 000 Ft |
| Tesztelés | 8 óra | 96 000 Ft |

\`\`\`json
{ "projekt": "PDF Konvertáló", "állapot": "kész" }
\`\`\`
`,
    csvName: "arlista.csv",
    csvHeader: "Cikkszám;Megnevezés;Mennyiség;Egységár;Összesen",
    csvProducts: ["Nyomtatópapír A4", "Tűzőgép", "Golyóstoll (kék)", "Iratrendező", "Post-it jegyzettömb", "Radír", "Vonalzó 30 cm", "Füzet A5"],
    csvQuantity: "{count} db",
    csvPrice: "{value} Ft",
  },
};

export type UiDict = typeof hu;
