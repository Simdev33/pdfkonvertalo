import type { LegalDocs } from "./types";

export const hu: LegalDocs = {
  labels: {
    name: "Név",
    address: "Cím",
    email: "E-mail",
    registration: "Nyilvántartási szám",
    taxNumber: "Adószám",
    web: "Honlap",
  },

  terms: {
    title: "Általános szerződési feltételek",
    intro:
      "Ez a dokumentum a {site} ({url}) webes szolgáltatás használatának feltételeit tartalmazza. Az oldal használatával elfogadod ezeket a feltételeket; ha nem értesz egyet velük, kérjük, ne használd a szolgáltatást.",
    sections: [
      {
        heading: "1. Az üzemeltető",
        blocks: ["A szolgáltatást az alábbi üzemeltető nyújtja:", { details: "operator" }, "A tárhelyszolgáltató:", { details: "hosting" }],
      },
      {
        heading: "2. A szolgáltatás",
        blocks: [
          "A {site} ingyenes, regisztráció nélkül használható online eszköz, amellyel:",
          {
            list: [
              "képeket, szöveges fájlokat, Word-, Excel- és PowerPoint-fájlokat alakíthatsz PDF-be, illetve PDF-eket fűzhetsz össze;",
              "PDF-oldalakból JPG vagy PNG képeket készíthetsz.",
            ],
          },
          "A képek, szöveges fájlok és PDF-ek feldolgozása a böngésződben, a saját eszközödön történik; ezek nem kerülnek a szerverre. A Word-, Excel- és PowerPoint-fájlokat a pontos átalakítás érdekében a szerver alakítja PDF-fé (lásd a 4. pontot).",
          "A szolgáltatás használata díjmentes.",
        ],
      },
      {
        heading: "3. A használat feltételei",
        blocks: [
          "A szolgáltatást csak jogszerű célra, a jelen feltételeknek megfelelően használhatod. Tilos különösen:",
          {
            list: [
              "olyan fájlt feldolgozni, amelyhez nincs jogod, vagy amely mások jogait (például szerzői jogát, személyiségi jogát vagy személyes adatait) sérti;",
              "jogellenes tartalmat előállítani vagy terjeszteni a szolgáltatás segítségével;",
              "a szolgáltatást automatizált eszközökkel tömegesen használni, túlterhelni, vagy a működését más módon akadályozni;",
              "a szolgáltatás biztonsági megoldásait megkerülni, a rendszerbe jogosulatlanul behatolni vagy kártékony kódot feltölteni.",
            ],
          },
          "Ha a feldolgozott fájlok mások személyes adatait tartalmazzák, ezek jogszerű kezeléséért te felelsz.",
          "Az üzemeltető a visszaélések megakadályozása érdekében korlátozhatja vagy megtagadhatja a szolgáltatáshoz való hozzáférést.",
        ],
      },
      {
        heading: "4. Az Office-fájlok feldolgozása",
        blocks: [
          "A Word-, Excel- és PowerPoint-fájlok átalakításához a fájl titkosított (HTTPS) kapcsolaton keresztül a szerverre kerül. A szerver kizárólag a PDF elkészítésére használja, az átalakítás befejezése után azonnal törli, nem tárolja, és senki nem tekint bele. A többi fájl el sem hagyja az eszközödet.",
          "A feltölthető Office-fájl mérete legfeljebb 4,4 MB. Jelszóval védett dokumentumot a szolgáltatás nem alakít át.",
          "A fájljaidon és az elkészült PDF-eken fennálló jogok nálad maradnak; az üzemeltető semmilyen jogot nem szerez rájuk.",
        ],
      },
      {
        heading: "5. Szellemi tulajdon",
        blocks: [
          "Az oldal kialakítása, szövegei, grafikai elemei és forráskódja az üzemeltető szellemi tulajdonát képezik; ezeket az üzemeltető írásos engedélye nélkül nem lehet másolni vagy terjeszteni.",
          "A szolgáltatás nyílt forráskódú összetevőket is használ (például a Mozilla pdf.js-t, a pdf-libet, a LibreOffice-t és a Gotenberget), amelyekre a saját licencfeltételeik vonatkoznak.",
        ],
      },
      {
        heading: "6. Felelősség",
        blocks: [
          "A szolgáltatást díjmentesen, „ahogy van” alapon nyújtjuk. Az üzemeltető mindent megtesz a pontos átalakításért, de nem vállal garanciát arra, hogy az eredmény minden esetben hibátlan, és hogy a szolgáltatás megszakítás nélkül, hibamentesen elérhető.",
          "Az elkészült fájlokat használat előtt ellenőrizd, és az eredeti fájljaidról mindig őrizz meg másolatot.",
          "Az üzemeltető – a jogszabályok által megengedett legnagyobb mértékben – nem felel a szolgáltatás használatából vagy használhatatlanságából eredő közvetlen vagy közvetett károkért, adatvesztésért vagy elmaradt haszonért. Ez a korlátozás nem vonatkozik a szándékosan vagy súlyos gondatlansággal okozott, továbbá az életet, testi épséget vagy egészséget megkárosító szerződésszegésért való felelősségre.",
        ],
      },
      {
        heading: "7. Rendelkezésre állás és változtatások",
        blocks: [
          "Az üzemeltető jogosult a szolgáltatást bármikor módosítani, bővíteni, szüneteltetni vagy megszüntetni, előzetes értesítés nélkül is.",
        ],
      },
      {
        heading: "8. Adatvédelem",
        blocks: ["A személyes adatok kezelésének részleteit az [Adatkezelési tájékoztató]({privacyPath}) tartalmazza."],
      },
      {
        heading: "9. A feltételek módosítása",
        blocks: [
          "Az üzemeltető jogosult a jelen feltételeket egyoldalúan módosítani. A módosítás az oldalon való közzététellel lép hatályba; a hatálybalépés napját a dokumentum tetején tüntetjük fel. A szolgáltatás további használatával elfogadod a módosított feltételeket.",
        ],
      },
      {
        heading: "10. Irányadó jog és jogviták",
        blocks: [
          "A jelen feltételekre a magyar jog irányadó. Ha fogyasztóként használod a szolgáltatást, ez a jogválasztás nem foszt meg a lakóhelyed szerinti ország kötelezően alkalmazandó fogyasztóvédelmi szabályai által biztosított védelemtől.",
          "A vitás kérdéseket elsősorban békés úton, egyeztetéssel igyekszünk rendezni.",
        ],
      },
      {
        heading: "11. Kapcsolat",
        blocks: ["Kérdéseiddel, észrevételeiddel az üzemeltetőhöz fordulhatsz a következő e-mail-címen: {operatorEmail}."],
      },
    ],
  },

  privacy: {
    title: "Adatkezelési tájékoztató",
    intro:
      "Ez a tájékoztató az Európai Parlament és a Tanács (EU) 2016/679 rendelete (általános adatvédelmi rendelet, GDPR) alapján bemutatja, hogy a {site} ({url}) használata során milyen személyes adatokat kezelünk, milyen célból, milyen jogalapon és mennyi ideig, valamint azt, hogy milyen jogok illetnek meg.",
    sections: [
      {
        heading: "1. Az adatkezelő",
        blocks: [{ details: "operator" }],
      },
      {
        heading: "2. Röviden",
        blocks: [
          {
            list: [
              "Regisztráció nincs: nem kérünk nevet, e-mail-címet vagy más azonosító adatot.",
              "A képeket, szöveges fájlokat és PDF-eket a böngésződ dolgozza fel, ezek nem jutnak el hozzánk.",
              "A Word-, Excel- és PowerPoint-fájlok csak az átalakítás idejére kerülnek a szerverre, utána azonnal törlődnek.",
              "Nem használunk sütiket, sem analitikai vagy hirdetési követőkódot.",
            ],
          },
        ],
      },
      {
        heading: "3. Office-fájlok átalakítása",
        blocks: [
          "Ha Word-, Excel- vagy PowerPoint-fájlt adsz hozzá, a fájl titkosított (HTTPS) kapcsolaton keresztül a szerverre kerül, ahol egy irodai program PDF-fé alakítja, majd a PDF visszakerül a böngésződbe.",
          {
            list: [
              "Kezelt adat: a fájl neve és tartalma, beleértve a dokumentumban esetleg szereplő személyes adatokat.",
              "Cél: az általad kért átalakítás elvégzése.",
              "Jogalap: a szolgáltatás nyújtása a kérésedre (GDPR 6. cikk (1) bekezdés b) pont).",
              "Időtartam: csak az átalakítás idejére, jellemzően néhány másodpercig. A fájl és a PDF ezután azonnal törlődik; nem tároljuk őket, és senki nem tekint beléjük.",
            ],
          },
        ],
      },
      {
        heading: "4. Technikai naplók",
        blocks: [
          "Az oldal kiszolgálásakor – mint minden weboldal esetében – a tárhelyszolgáltató szerverei technikai adatokat rögzítenek.",
          {
            list: [
              "Kezelt adat: IP-cím, a kérés időpontja, a lekért oldal címe, a böngésző típusa és verziója.",
              "Cél: a szolgáltatás biztonságos, zavartalan működtetése, a hibák és a visszaélések felderítése.",
              "Jogalap: az üzemeltető jogos érdeke (GDPR 6. cikk (1) bekezdés f) pont).",
              "Időtartam: rövid ideig, a tárhelyszolgáltató adatmegőrzési szabályai szerint.",
            ],
          },
        ],
      },
      {
        heading: "5. A böngészőben feldolgozott fájlok",
        blocks: [
          "A képeket, szöveges fájlokat és PDF-eket – a PDF-ek jelszavát is beleértve – kizárólag a böngésződ dolgozza fel a saját eszközödön. Ezekhez az adatokhoz nem férünk hozzá, és nem kezeljük őket.",
        ],
      },
      {
        heading: "6. Sütik és helyi tárolás",
        blocks: [
          "Az oldal nem használ sütiket (cookie-kat), sem analitikai vagy hirdetési követőkódot. A böngésző helyi tárolójában (localStorage) csak a választott megjelenést (világos vagy sötét téma) őrizzük meg; ez nem jut el hozzánk, és a böngésző beállításaiban bármikor törölheted.",
        ],
      },
      {
        heading: "7. Adatfeldolgozó és adattovábbítás",
        blocks: [
          "Az oldal tárhelyét és az Office-fájlok átalakításához szükséges számítási kapacitást a következő adatfeldolgozó biztosítja:",
          { details: "hosting" },
          "A Vercel Inc. székhelye az Amerikai Egyesült Államokban van, ezért az adatok az Európai Unión kívülre is eljuthatnak. A továbbítás megfelelő garanciák mellett történik (EU–USA adatvédelmi keretrendszer, illetve az Európai Bizottság által elfogadott általános adatvédelmi kikötések).",
          "Adataidat más harmadik félnek nem adjuk át, és nem értékesítjük.",
        ],
      },
      {
        heading: "8. Adatbiztonság",
        blocks: [
          "Az oldal és a szerver közötti minden kapcsolat titkosított (HTTPS). Az Office-fájlokat átalakító szolgáltatás közvetlenül nem érhető el az internetről, a fájlokat nem tároljuk, és a feldolgozás után azonnal töröljük.",
        ],
      },
      {
        heading: "9. Jogaid",
        blocks: [
          "A GDPR alapján a következő jogok illetnek meg:",
          {
            list: [
              "tájékoztatáshoz és hozzáféréshez való jog (15. cikk);",
              "helyesbítéshez való jog (16. cikk);",
              "törléshez való jog (17. cikk);",
              "az adatkezelés korlátozásához való jog (18. cikk);",
              "adathordozhatósághoz való jog (20. cikk);",
              "tiltakozáshoz való jog a jogos érdeken alapuló adatkezeléssel szemben (21. cikk).",
            ],
          },
          "Mivel regisztráció nincs, és az Office-fájlokat azonnal töröljük, a legtöbb esetben nincs olyan adatunk, amely alapján azonosítani tudnánk téged. Kérésedet a(z) {operatorEmail} címre küldheted; legfeljebb egy hónapon belül válaszolunk.",
        ],
      },
      {
        heading: "10. Jogorvoslat",
        blocks: [
          "Ha úgy érzed, hogy a személyes adataid kezelése sérti a jogszabályokat, panaszt tehetsz a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH; 1055 Budapest, Falk Miksa utca 9–11.; postacím: 1363 Budapest, Pf. 9.; telefon: +36 1 391 1400; e-mail: ugyfelszolgalat@naih.hu; honlap: https://naih.hu), vagy a lakóhelyed szerinti adatvédelmi hatóságnál.",
          "Jogaid megsértése esetén bírósághoz is fordulhatsz; a pert a lakóhelyed vagy a tartózkodási helyed szerint illetékes törvényszék előtt is megindíthatod.",
        ],
      },
      {
        heading: "11. A tájékoztató módosítása",
        blocks: [
          "Ezt a tájékoztatót a szolgáltatás változásakor frissítjük; a hatálybalépés napját a dokumentum tetején tüntetjük fel. A szolgáltatás használatára vonatkozó feltételeket az [Általános szerződési feltételek]({termsPath}) tartalmazzák.",
        ],
      },
    ],
  },
};
