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
      "Ez a dokumentum a {site} ({url}) webes szolgáltatás használatának és az előfizetésnek a feltételeit tartalmazza. Az oldal használatával, illetve az előfizetés megrendelésével elfogadod ezeket a feltételeket; ha nem értesz egyet velük, kérjük, ne használd a szolgáltatást.",
    sections: [
      {
        heading: "1. Az üzemeltető",
        blocks: ["A szolgáltatást az alábbi üzemeltető nyújtja:", { details: "operator" }, "A tárhelyszolgáltató:", { details: "hosting" }],
      },
      {
        heading: "2. A szolgáltatás",
        blocks: [
          "A {site} online eszköz, amellyel:",
          {
            list: [
              "képeket, szöveges fájlokat, Word-, Excel- és PowerPoint-fájlokat alakíthatsz PDF-be, illetve PDF-eket fűzhetsz össze;",
              "PDF-oldalakból JPG vagy PNG képeket készíthetsz.",
            ],
          },
          "A fájlok feltöltése, átalakítása és az eredmény előnézete díjmentes. Az elkészült fájlok letöltéséhez előfizetés szükséges (lásd a 3. pontot).",
          "A képek, szöveges fájlok és PDF-ek feldolgozása a böngésződben, a saját eszközödön történik; ezek nem kerülnek a szerverre. A Word-, Excel- és PowerPoint-fájlokat a pontos átalakítás érdekében a szerver alakítja PDF-fé (lásd a 9. pontot).",
        ],
      },
      {
        heading: "3. Előfizetés és díjak",
        blocks: [
          "Az előfizetés egy {days} napos bevezető időszakkal indul, amelynek díja {trial}. Ez alatt a szolgáltatás teljes körűen, korlátozás nélkül használható.",
          "Ha az előfizetést a bevezető időszak végéig nem mondod le, az a {next}. naptól automatikusan havi {monthly} díjú előfizetéssé alakul, és havonta megújul, amíg le nem mondod. A havi díjat minden időszak elején a megrendeléskor megadott fizetési módra terheljük.",
          "A fizetendő végösszeget a megrendelés előtt a fizetési oldal egyértelműen feltünteti. A megrendelés a fizetési kötelezettséggel járó gomb (vagy a kiválasztott fizetési mód gombja) megnyomásával jön létre.",
          "A bevezető időszak lejárta előtt e-mailben emlékeztetőt küldünk a közelgő havi terhelésről.",
          "A díjak megváltoztatásáról az előfizetőket legalább 30 nappal a változás előtt e-mailben értesítjük; ha nem fogadod el, a változás hatálybalépése előtt lemondhatod az előfizetést.",
        ],
      },
      {
        heading: "4. Fizetés",
        blocks: [
          "A fizetést a Stripe Payments Europe, Ltd. (Írország) dolgozza fel. Elérhető fizetési módok (eszköztől, böngészőtől és országtól függően): bank- és hitelkártya, Apple Pay, Google Pay, PayPal és Link. A kártyaadataidat mi nem látjuk és nem tároljuk.",
          "A sikeres fizetésekről a Stripe e-mailben nyugtát küld. A jogszabályok szerinti számlát az üzemeltető állítja ki.",
          "Ha egy havi terhelés nem sikerül, a Stripe néhány napon belül újra megkísérli; ha továbbra sem sikerül, az előfizetés megszűnik, és a letöltési hozzáférés megszűnik.",
        ],
      },
      {
        heading: "5. Lemondás",
        blocks: [
          "Az előfizetést bármikor, indoklás nélkül lemondhatod a [Fiókom]({accountPath}) oldalon (belépés e-mailben kapott kóddal), egy kattintással, a Stripe biztonságos felületén.",
          "A lemondás a folyamatban lévő időszak végén lép hatályba: addig a hozzáférésed megmarad, újabb terhelés pedig nem történik. A bevezető időszak alatti lemondás esetén a {next}. naptól nem terhelünk havi díjat.",
          "A már megkezdett időszak díját – az elállási jog gyakorlásának esetét és a jogszabályban előírt eseteket kivéve – nem térítjük vissza.",
        ],
      },
      {
        heading: "6. Elállási jog",
        blocks: [
          "Ha fogyasztóként rendeled meg az előfizetést, a megrendeléstől számított 14 napon belül indoklás nélkül elállhatsz a szerződéstől. Az elállási szándékodat az üzemeltetőnek küldött egyértelmű nyilatkozattal (például e-mailben: {operatorEmail}) jelezheted; ehhez felhasználhatod a 2011/83/EU irányelv I. mellékletének B. része szerinti elállási nyilatkozatmintát is, de nem kötelező.",
          "Mivel a megrendeléskor kifejezetten kéred a szolgáltatás azonnali megkezdését, elállás esetén az elállásig igénybe vett időszakra eső arányos díjat meg kell fizetned. A fennmaradó összeget az elállás közlésétől számított 14 napon belül, a fizetéskor használt fizetési módra visszatérítjük.",
          "Az elállási jog nem érinti az előfizetés bármikori lemondásának lehetőségét (lásd az 5. pontot).",
        ],
      },
      {
        heading: "7. Fiók és belépés",
        blocks: [
          "Külön, jelszavas regisztráció nincs. A fiókod a fizetéskor megadott e-mail-címedhez kötődik: abban a böngészőben, ahol fizettél, automatikusan be vagy lépve, más eszközön pedig az e-mailben kapott 6 jegyű, 10 percig érvényes kóddal léphetsz be.",
          "A belépési kódot ne add ki másnak. Az előfizetés személyes használatra szól; a hozzáférés megosztása vagy továbbértékesítése nem megengedett.",
        ],
      },
      {
        heading: "8. A használat feltételei",
        blocks: [
          "A szolgáltatást csak jogszerű célra, a jelen feltételeknek megfelelően használhatod. Tilos különösen:",
          {
            list: [
              "olyan fájlt feldolgozni, amelyhez nincs jogod, vagy amely mások jogait (például szerzői jogát, személyiségi jogát vagy személyes adatait) sérti;",
              "jogellenes tartalmat előállítani vagy terjeszteni a szolgáltatás segítségével;",
              "a szolgáltatást automatizált eszközökkel tömegesen használni, túlterhelni, vagy a működését más módon akadályozni;",
              "a szolgáltatás biztonsági vagy fizetési megoldásait megkerülni, a rendszerbe jogosulatlanul behatolni vagy kártékony kódot feltölteni.",
            ],
          },
          "Ha a feldolgozott fájlok mások személyes adatait tartalmazzák, ezek jogszerű kezeléséért te felelsz.",
          "Az üzemeltető a visszaélések megakadályozása érdekében korlátozhatja vagy megszüntetheti a hozzáférést; súlyos szerződésszegés esetén az előfizetés azonnali hatállyal megszüntethető.",
        ],
      },
      {
        heading: "9. Az Office-fájlok feldolgozása",
        blocks: [
          "A Word-, Excel- és PowerPoint-fájlok átalakításához a fájl titkosított (HTTPS) kapcsolaton keresztül a szerverre kerül. A szerver kizárólag a PDF elkészítésére használja, az átalakítás befejezése után azonnal törli, nem tárolja, és senki nem tekint bele. A többi fájl el sem hagyja az eszközödet.",
          "A feltölthető Office-fájl mérete legfeljebb 4,4 MB. Jelszóval védett dokumentumot a szolgáltatás nem alakít át.",
          "A fájljaidon és az elkészült fájlokon fennálló jogok nálad maradnak; az üzemeltető semmilyen jogot nem szerez rájuk.",
        ],
      },
      {
        heading: "10. Szellemi tulajdon",
        blocks: [
          "Az oldal kialakítása, szövegei, grafikai elemei és forráskódja az üzemeltető szellemi tulajdonát képezik; ezeket az üzemeltető írásos engedélye nélkül nem lehet másolni vagy terjeszteni.",
          "A szolgáltatás nyílt forráskódú összetevőket is használ (például a Mozilla pdf.js-t, a pdf-libet, a LibreOffice-t és a Gotenberget), amelyekre a saját licencfeltételeik vonatkoznak.",
        ],
      },
      {
        heading: "11. Felelősség",
        blocks: [
          "Az üzemeltető mindent megtesz a pontos átalakításért és a szolgáltatás folyamatos elérhetőségéért, de nem vállal garanciát arra, hogy az eredmény minden esetben hibátlan, és hogy a szolgáltatás megszakítás nélkül, hibamentesen elérhető.",
          "Az elkészült fájlokat használat előtt ellenőrizd, és az eredeti fájljaidról mindig őrizz meg másolatot.",
          "Az üzemeltető – a jogszabályok által megengedett legnagyobb mértékben – nem felel a szolgáltatás használatából vagy használhatatlanságából eredő közvetett károkért, adatvesztésért vagy elmaradt haszonért. Ez a korlátozás nem vonatkozik a szándékosan vagy súlyos gondatlansággal okozott, továbbá az életet, testi épséget vagy egészséget megkárosító szerződésszegésért való felelősségre, és nem érinti a fogyasztókat jogszabály alapján megillető jogokat.",
        ],
      },
      {
        heading: "12. Rendelkezésre állás és változtatások",
        blocks: [
          "Az üzemeltető jogosult a szolgáltatást fejleszteni és módosítani. Ha a szolgáltatás véglegesen megszűnik, az előfizetéseket megszüntetjük, és a ki nem használt időszak díját arányosan visszatérítjük.",
        ],
      },
      {
        heading: "13. Adatvédelem",
        blocks: ["A személyes adatok kezelésének részleteit az [Adatkezelési tájékoztató]({privacyPath}) tartalmazza."],
      },
      {
        heading: "14. A feltételek módosítása",
        blocks: [
          "Az üzemeltető jogosult a jelen feltételeket módosítani. A módosítás az oldalon való közzététellel lép hatályba; a hatálybalépés napját a dokumentum tetején tüntetjük fel. Az előfizetőket a lényeges, számukra hátrányos változásokról legalább 30 nappal korábban e-mailben értesítjük; ha nem fogadják el, a hatálybalépés előtt lemondhatják az előfizetést.",
        ],
      },
      {
        heading: "15. Irányadó jog és jogviták",
        blocks: [
          "A jelen feltételekre a szlovák jog irányadó. Ha fogyasztóként használod a szolgáltatást, ez a jogválasztás nem foszt meg a lakóhelyed szerinti ország kötelezően alkalmazandó fogyasztóvédelmi szabályai által biztosított védelemtől.",
          "A vitás kérdéseket elsősorban békés úton, egyeztetéssel igyekszünk rendezni: panaszodat a(z) {operatorEmail} címre küldheted. Ha a panaszodat elutasítjuk, vagy 30 napon belül nem válaszolunk, fogyasztóként alternatív vitarendezést kezdeményezhetsz a Szlovák Kereskedelmi Felügyeletnél (Slovenská obchodná inšpekcia, https://www.soi.sk) vagy más, a szlovák gazdasági minisztérium listáján szereplő vitarendezési szervnél. A lakóhelyed szerinti fogyasztóvédelmi hatósághoz és bírósághoz is fordulhatsz.",
        ],
      },
      {
        heading: "16. Kapcsolat",
        blocks: ["Kérdéseiddel, észrevételeiddel, panaszaiddal az üzemeltetőhöz fordulhatsz a következő e-mail-címen: {operatorEmail}."],
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
              "Jelszavas regisztráció nincs. Ha előfizetsz, az e-mail-címedet és az előfizetésed adatait kezeljük.",
              "A fizetést a Stripe dolgozza fel; a kártyaadataidat mi nem látjuk és nem tároljuk.",
              "A képeket, szöveges fájlokat és PDF-eket a böngésződ dolgozza fel, ezek nem jutnak el hozzánk.",
              "A Word-, Excel- és PowerPoint-fájlok csak az átalakítás idejére kerülnek a szerverre, utána azonnal törlődnek.",
              "Nem használunk analitikai vagy hirdetési követőkódot. Sütiket csak a belépéshez és a fizetéshez használunk.",
            ],
          },
        ],
      },
      {
        heading: "3. Előfizetés és fizetés",
        blocks: [
          "Ha előfizetsz, a fizetési oldalon megadott adatokat a Stripe kezeli; nálunk az előfizetés nyilvántartásához szükséges adatok jelennek meg.",
          {
            list: [
              "Kezelt adat: e-mail-cím, a Stripe által adott ügyfél- és előfizetés-azonosító, az előfizetés állapota és időszakai, a fizetések összege és időpontja, a fizetési mód típusa (például kártya, és annak utolsó 4 számjegye), valamint – ha a fizetési oldal bekéri – a számlázási ország és irányítószám.",
              "Cél: az előfizetés létrehozása és teljesítése, a díjak beszedése, a hozzáférés ellenőrzése, a számlázás és az ügyfélszolgálat.",
              "Jogalap: a szerződés teljesítése (GDPR 6. cikk (1) bekezdés b) pont); a számviteli bizonylatok megőrzése esetén jogi kötelezettség (GDPR 6. cikk (1) bekezdés c) pont).",
              "Időtartam: az előfizetés fennállása alatt, majd a lemondás után a számviteli bizonylatokat a szlovák számviteli törvény (431/2002. sz. törvény) 35. §-a szerint 10 évig őrizzük. A többi adatot kérésedre az előfizetés megszűnése után töröljük.",
            ],
          },
          "A fizetések feldolgozását a Stripe Payments Europe, Ltd. (1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Írország) végzi, amely a fizetési adatok és a csalásmegelőzés tekintetében önálló adatkezelő. Az adatkezeléséről a https://stripe.com/privacy oldalon tájékozódhatsz.",
        ],
      },
      {
        heading: "4. Belépés e-mailes kóddal",
        blocks: [
          "Más eszközön egy e-mailben küldött, egyszer használható kóddal léphetsz be.",
          {
            list: [
              "Kezelt adat: e-mail-cím, a belépési kód titkosított (hash) formája, lejárati ideje és a próbálkozások száma.",
              "Cél: a belépés és a fiók védelme.",
              "Jogalap: a szerződés teljesítése (GDPR 6. cikk (1) bekezdés b) pont).",
              "Időtartam: a kód 10 percig érvényes, felhasználás után azonnal töröljük.",
            ],
          },
          "A belépési e-maileket a Resend, Inc. (https://resend.com) küldi ki adatfeldolgozóként.",
        ],
      },
      {
        heading: "5. Office-fájlok átalakítása",
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
        heading: "6. Technikai naplók",
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
        heading: "7. A böngészőben feldolgozott fájlok",
        blocks: [
          "A képeket, szöveges fájlokat és PDF-eket – a PDF-ek jelszavát is beleértve – kizárólag a böngésződ dolgozza fel a saját eszközödön. Ezekhez az adatokhoz nem férünk hozzá, és nem kezeljük őket.",
          "Amíg a fizetési oldal nyitva van, az elkészült fájlt a böngésződ legfeljebb 60 percig a saját eszközödön (IndexedDB) tárolja, hogy egy másik oldalra átirányító fizetési mód (például PayPal) után se vesszen el. Ez sem jut el hozzánk. Ha Word-, Excel- vagy PowerPoint-fájl is volt köztük, az eredeti fájlokat is ott őrzi, hogy fizetés után elkészülhessen a teljes változat (ezeket a szerver ekkor a fent leírt módon újra átalakítja).",
        ],
      },
      {
        heading: "8. Sütik és helyi tárolás",
        blocks: [
          "Csak a szolgáltatás működéséhez szükséges sütiket használunk, ezekhez nem kell hozzájárulás:",
          {
            list: [
              "pk_session: a belépett állapot megőrzése (180 nap);",
              "pk_signed_in: jelzi az oldalnak, hogy be vagy lépve (180 nap);",
              "pk_login: a belépési kód folyamata (10 perc);",
              "pk_lang: a nyelvváltóban választott nyelv megjegyzése (1 év).",
            ],
          },
          "A fizetési oldalon a Stripe saját sütiket használ a fizetés biztonságos lebonyolításához és a csalások megelőzéséhez. Analitikai vagy hirdetési sütit nem használunk. A böngésző helyi tárolójában (localStorage) csak a választott megjelenést (világos vagy sötét téma) őrizzük meg.",
        ],
      },
      {
        heading: "9. Adatfeldolgozók és adattovábbítás",
        blocks: [
          "Az oldal tárhelyét és az Office-fájlok átalakításához szükséges számítási kapacitást a következő adatfeldolgozó biztosítja:",
          { details: "hosting" },
          "A belépési e-maileket a Resend, Inc. küldi ki. A Vercel Inc. és a Resend, Inc. székhelye az Amerikai Egyesült Államokban van, ezért az adatok az Európai Unión kívülre is eljuthatnak. A továbbítás megfelelő garanciák mellett történik (EU–USA adatvédelmi keretrendszer, illetve az Európai Bizottság által elfogadott általános adatvédelmi kikötések).",
          "Adataidat más harmadik félnek nem adjuk át, és nem értékesítjük.",
        ],
      },
      {
        heading: "10. Adatbiztonság",
        blocks: [
          "Az oldal és a szerver közötti minden kapcsolat titkosított (HTTPS). A belépési sütik aláírtak, és szkriptből nem olvashatók. Az Office-fájlokat átalakító szolgáltatás közvetlenül nem érhető el az internetről, a fájlokat nem tároljuk, és a feldolgozás után azonnal töröljük.",
        ],
      },
      {
        heading: "11. Jogaid",
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
          "Kérésedet a(z) {operatorEmail} címre küldheted; legfeljebb egy hónapon belül válaszolunk. Az e-mail-címedet a [Fiókom]({accountPath}) oldalon, a Stripe felületén magad is módosíthatod.",
        ],
      },
      {
        heading: "12. Jogorvoslat",
        blocks: [
          "Ha úgy érzed, hogy a személyes adataid kezelése sérti a jogszabályokat, panaszt tehetsz az adatkezelő székhelye szerinti szlovák felügyeleti hatóságnál (Úrad na ochranu osobných údajov Slovenskej republiky; Hraničná 12, 820 07 Bratislava 27; honlap: https://dataprotection.gov.sk), vagy a lakóhelyed, munkahelyed szerinti adatvédelmi hatóságnál – Magyarországon a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH; 1055 Budapest, Falk Miksa utca 9–11.; postacím: 1363 Budapest, Pf. 9.; telefon: +36 1 391 1400; e-mail: ugyfelszolgalat@naih.hu; honlap: https://naih.hu).",
          "Jogaid megsértése esetén bírósághoz is fordulhatsz; a pert a lakóhelyed vagy a tartózkodási helyed szerinti tagállam bírósága előtt is megindíthatod.",
        ],
      },
      {
        heading: "13. A tájékoztató módosítása",
        blocks: [
          "Ezt a tájékoztatót a szolgáltatás változásakor frissítjük; a hatálybalépés napját a dokumentum tetején tüntetjük fel. A szolgáltatás használatára vonatkozó feltételeket az [Általános szerződési feltételek]({termsPath}) tartalmazzák.",
        ],
      },
    ],
  },
};
