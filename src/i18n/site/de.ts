import type { SiteDict } from "./hu";

export const de: SiteDict = {
  meta: {
    tagline: "Bilder, Office- und Textdateien in PDF",
    description:
      "Kostenloser, professioneller PDF-Konverter: JPG-, PNG-, HEIC-, WebP-, TIFF- und SVG-Bilder, Word-, Excel- und PowerPoint-Dateien sowie TXT-, CSV-, Markdown- und JSON-Dateien in PDF umwandeln, PDFs zusammenfügen und aus PDFs Bilder erstellen. Bilder, Texte und PDFs bleiben in Ihrem Browser.",
    keywords: [
      "PDF Konverter",
      "Bild in PDF",
      "JPG in PDF",
      "PNG in PDF",
      "HEIC in PDF",
      "Word in PDF",
      "Excel in PDF",
      "PowerPoint in PDF",
      "Bilder zu PDF zusammenfügen",
      "PDF in JPG",
      "PDF zusammenfügen",
    ],
    pdfToImageTitle: "PDF in Bild – JPG und PNG ohne Upload",
    pdfToImageDescription:
      "PDF-Seiten in JPG- oder PNG-Bilder umwandeln, mit 72–600 DPI Auflösung, auf Wunsch nur die ausgewählten Seiten. Kostenlos, schnell, und das PDF bleibt die ganze Zeit auf Ihrem Gerät.",
    termsTitle: "Allgemeine Geschäftsbedingungen",
    termsDescription: "Die Bedingungen für die Nutzung von PDF Konvertáló.",
    privacyTitle: "Datenschutzerklärung",
    privacyDescription: "Welche Daten PDF Konvertáló verarbeitet, wozu und wie lange, und welche Rechte Sie haben.",
    ogBadge: "ohne Registrierung und Wasserzeichen",
    ogTitle: "Aus Bildern und Dateien",
    ogAccent: "im Handumdrehen ein Profi-PDF.",
  },

  converter: {
    badge: "Bilder und PDFs ohne Upload, direkt in Ihrem Browser",
    title: "Aus Bildern und Dateien",
    accent: "im Handumdrehen ein Profi-PDF.",
    text: "Ziehen Sie Ihre Fotos, Scans, Word-, Excel- und PowerPoint-Dateien oder PDFs hinein, bringen Sie sie in die gewünschte Reihenfolge, und mit einem Klick ist das PDF fertig. Keine Registrierung, kein Wasserzeichen.",
    formatsLabel: "Unterstützte Formate",
    featuresEyebrow: "Funktionen",
    featuresTitle: "Alles, was ein professioneller Konverter braucht",
    featuresText: "Mit Live-Vorschau – so erhalten Sie genau das, was Sie auf dem Bildschirm sehen.",
    features: [
      {
        title: "Jedes Bildformat",
        text: "JPG, PNG, HEIC vom iPhone, WebP, AVIF, mehrseitiges TIFF, SVG und viele mehr. JPG- und PNG-Bilder gelangen bytegenau und ohne Qualitätsverlust ins PDF.",
      },
      {
        title: "Immer richtig ausgerichtet",
        text: "Die eingebetteten Drehinformationen von Handyfotos werden automatisch berücksichtigt, und jedes Bild können Sie zusätzlich mit einem Klick drehen.",
      },
      {
        title: "Office- und Textdateien",
        text: "Word-, Excel- und PowerPoint-Dateien landen genau so im PDF, wie sie in Office aussehen. Aus TXT-, Markdown-, CSV- und JSON-Dateien wird ein sauber gesetztes, durchsuchbares PDF.",
      },
      {
        title: "PDFs zusammenfügen",
        text: "Vorhandene PDFs – auch passwortgeschützte – können Sie zusammen mit Bildern in beliebiger Reihenfolge zu einem einzigen Dokument zusammenfügen.",
      },
      {
        title: "Flexibles Layout",
        text: "A4, A3, A5, Letter oder eine an das Bild angepasste Seite, einstellbarer Rand, Ausfüllen und bis zu 9 Bilder pro Seite – mit Live-Vorschau.",
      },
      {
        title: "Perfekt oder kompakt",
        text: "Behalten Sie die Originalqualität, oder komprimieren Sie die Bilder auf eine Größe, die sich per E-Mail versenden lässt – auf Wunsch auch in Schwarz-Weiß.",
      },
    ],
    stepsEyebrow: "So funktioniert es",
    stepsTitle: "Drei Schritte, fertig",
    steps: [
      { title: "Dateien hineinziehen", text: "Bilder, Office- und Textdateien, PDFs – auch gemischt. Screenshots fügen Sie einfach mit Ctrl+V ein." },
      { title: "Sortieren und einstellen", text: "Ändern Sie die Reihenfolge per Drag & Drop, drehen Sie Bilder, und wählen Sie Seitengröße, Rand und Qualität." },
      { title: "PDF herunterladen", text: "Ein einziges zusammengefügtes PDF oder pro Datei ein eigenes PDF im ZIP – ohne Wasserzeichen und Registrierung." },
    ],
    faq: [
      {
        q: "Werden meine Dateien wirklich nicht hochgeladen?",
        a: "Bilder, Textdateien und PDFs nicht: Diese wandelt Ihr Browser vollständig selbst um, kein einziges Byte davon gelangt auf einen Server. Das können Sie selbst im Tab „Netzwerk“ der Entwicklertools Ihres Browsers überprüfen. Eine Ausnahme bilden Word-, Excel- und PowerPoint-Dateien: Für ihre exakte Umwandlung ist ein Office-Programm nötig, daher wandelt unser Server sie in PDF um und löscht sie unmittelbar nach der Umwandlung.",
      },
      {
        q: "Welche Dateien kann ich in PDF umwandeln?",
        a: "Bilder (JPG, PNG, HEIC/HEIF, WebP, AVIF, GIF, BMP, TIFF – auch mehrseitig –, SVG, ICO), Word-Dokumente (DOCX, DOC, ODT, RTF), Excel-Arbeitsmappen (XLSX, XLS, ODS), PowerPoint-Präsentationen (PPTX, PPT, PPSX, PPS, ODP), Textdateien (TXT, Markdown, CSV/TSV, JSON, Logdateien, Quellcode) und vorhandene PDFs. Aus einer Excel-Arbeitsmappe wird jedes sichtbare Tabellenblatt übernommen, jeweils mit seinen eigenen Seiteneinstellungen.",
      },
      {
        q: "Verschlechtert sich die Bildqualität?",
        a: "In der Qualität „Original“ nicht: JPG- und PNG-Bilder werden unverändert ins PDF übernommen, die übrigen Formate wandeln wir verlustfrei oder in sehr hoher Qualität um. Wenn Sie eine kleinere Datei brauchen, wählen Sie eine Komprimierung.",
      },
      {
        q: "Funktioniert es mit HEIC-Fotos vom iPhone?",
        a: "Ja. HEIC/HEIF-Bilder wandeln wir in Ihrem Browser um, und auch ihre Ausrichtung bleibt korrekt. Bei der ersten HEIC-Datei kann das Laden des Decoders einige Sekunden dauern.",
      },
      {
        q: "Wie lege ich die Reihenfolge fest?",
        a: "Ziehen Sie die Karten mit der Maus oder dem Finger an die gewünschte Stelle, oder sortieren Sie sie nach Name oder Größe. Mit der Tastatur: Karte fokussieren, Leertaste, dann Pfeiltasten und zum Schluss wieder Leertaste.",
      },
      {
        q: "Gibt es eine Größen- oder Mengenbeschränkung?",
        a: "Es gibt keine künstliche Beschränkung, die Grenze setzt der Arbeitsspeicher Ihres Geräts. Auch Hunderte Fotos oder PDFs mit Hunderten Seiten lassen sich problemlos verarbeiten. Word-, Excel- und PowerPoint-Dateien dürfen jeweils höchstens 4,4 MB groß sein.",
      },
    ],
  },

  pdfToImage: {
    title: "PDF in Bild:",
    accent: "JPG oder PNG mit einem Klick.",
    text: "Aus jeder Seite ein scharfes Bild, mit 72–600 DPI Auflösung, auf Wunsch nur aus den ausgewählten Seiten. Das PDF bleibt die ganze Zeit auf Ihrem Gerät.",
    features: [
      { title: "Seitenauswahl", text: "Wandeln Sie alle Seiten oder nur die ausgewählten in Bilder um – per Klick, mit Shift oder über Seitenzahlen." },
      { title: "Druckauflösung", text: "Von 72 bis 600 DPI. Die Auflösung wird in die Bilder geschrieben, sodass sie beim Drucken in Originalgröße erscheinen." },
      { title: "Geschützte PDFs", text: "Funktioniert auch mit berechtigungsgeschützten PDFs, und bei passwortgeschützten wird das Passwort lokal abgefragt." },
      { title: "Schnell und lokal", text: "Die pdf.js-Engine von Mozilla rendert die Seiten direkt in Ihrem Browser – ohne Upload." },
    ],
    faq: [
      {
        q: "Soll ich JPG oder PNG wählen?",
        a: "Für Seiten mit Fotos und gemischten Inhalten ergibt JPG eine kleinere Datei. Für Text, Grafiken und Screenshots ist PNG schärfer, weil es verlustfrei ist.",
      },
      {
        q: "Welche Auflösung brauche ich?",
        a: "Für Bildschirm und Websites genügen 72–150 DPI. Zum Drucken werden 300 DPI empfohlen, bei besonders kleiner Schrift oder detailreichen Seiten 600 DPI.",
      },
      {
        q: "Wird das PDF irgendwohin hochgeladen?",
        a: "Nein. Sowohl die Anzeige der Seiten als auch die Erstellung der Bilder erfolgen in Ihrem Browser.",
      },
    ],
  },

  sections: {
    badge: "Ohne Upload · 100 % in Ihrem Browser",
    privacyTitle: "Ihre Dateien bleiben bei Ihnen",
    privacyText:
      "Personalausweis, Gehaltsabrechnung, Vertrag, Familienfotos: So etwas sollte man nicht auf fremde Server hochladen. {site} wandelt Bilder, Textdateien und PDFs auf Ihrem eigenen Gerät um – deshalb ist es schnell und auch dann sicher, wenn Sie mit vertraulichen Unterlagen arbeiten. Nur für Word-, Excel- und PowerPoint-Dateien wird der Server benötigt: Diese wandelt ein Office-Programm in PDF um, danach werden sie sofort gelöscht.",
    stats: [
      { value: "0 Byte", label: "Upload bei Bildern und PDFs" },
      { value: "Sofort", label: "wird die Office-Datei vom Server gelöscht" },
      { value: "Ohne", label: "Registrierung und Wasserzeichen" },
      { value: "pdf.js", label: "die Rendering-Engine von Mozilla" },
    ],
    faqTitle: "Häufige Fragen",
    footerNote: "Mit Ausnahme der Office-Dateien läuft alles in Ihrem Browser.",
    terms: "AGB",
    privacy: "Datenschutz",
    languages: "Sprachen",
  },

  legal: {
    effective: "Gültig ab: {date}",
    operatorMissing: "[auszufüllen]",
    related: "Zugehöriges Dokument:",
  },

  server: {
    tooLarge: "Die Datei darf höchstens {limit} groß sein.",
    noFile: "Es wurde keine Datei empfangen.",
    notOffice: "Dies ist keine Word-, Excel- oder PowerPoint-Datei.",
    password: "Die Datei ist passwortgeschützt. Öffnen Sie sie, entfernen Sie das Passwort, und versuchen Sie es erneut.",
    failed: "Die Datei konnte nicht in PDF umgewandelt werden. Möglicherweise ist sie beschädigt oder leer.",
    busy: "Gerade wandeln sehr viele Nutzer gleichzeitig um. Bitte versuchen Sie es in einer Minute erneut.",
    timeout: "Die Umwandlung der Datei hat zu lange gedauert.",
    unavailable: "Der Dienst zur Dokumentumwandlung ist derzeit nicht erreichbar.",
    noEngine: "Auf diesem Server steht für diese Datei kein Konverter zur Verfügung (LibreOffice, Gotenberg oder Microsoft {app}).",
    unexpected: "Bei der Umwandlung ist ein unerwarteter Fehler aufgetreten.",
  },
};
