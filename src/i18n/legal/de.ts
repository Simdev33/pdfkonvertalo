import type { LegalDocs } from "./types";

export const de: LegalDocs = {
  labels: {
    name: "Name",
    address: "Anschrift",
    email: "E-Mail",
    registration: "Registernummer",
    taxNumber: "Steuernummer",
    web: "Website",
  },

  terms: {
    title: "Allgemeine Geschäftsbedingungen",
    intro:
      "Dieses Dokument enthält die Bedingungen für die Nutzung des Webdienstes {site} ({url}). Mit der Nutzung der Website akzeptieren Sie diese Bedingungen; wenn Sie mit ihnen nicht einverstanden sind, nutzen Sie den Dienst bitte nicht.",
    sections: [
      {
        heading: "1. Der Betreiber",
        blocks: ["Der Dienst wird von folgendem Betreiber erbracht:", { details: "operator" }, "Der Hosting-Anbieter:", { details: "hosting" }],
      },
      {
        heading: "2. Der Dienst",
        blocks: [
          "{site} ist ein kostenloses Online-Werkzeug, das ohne Registrierung genutzt werden kann und mit dem Sie:",
          {
            list: [
              "Bilder, Textdateien sowie Word-, Excel- und PowerPoint-Dateien in PDF umwandeln bzw. PDFs zusammenfügen können;",
              "aus PDF-Seiten JPG- oder PNG-Bilder erstellen können.",
            ],
          },
          "Die Verarbeitung von Bildern, Textdateien und PDFs erfolgt in Ihrem Browser, auf Ihrem eigenen Gerät; diese gelangen nicht auf den Server. Word-, Excel- und PowerPoint-Dateien werden für eine exakte Umwandlung vom Server in PDF umgewandelt (siehe Abschnitt 4).",
          "Die Nutzung des Dienstes ist kostenlos.",
        ],
      },
      {
        heading: "3. Nutzungsbedingungen",
        blocks: [
          "Sie dürfen den Dienst nur zu rechtmäßigen Zwecken und im Einklang mit diesen Bedingungen nutzen. Untersagt ist insbesondere:",
          {
            list: [
              "Dateien zu verarbeiten, an denen Sie keine Rechte haben oder die Rechte Dritter (beispielsweise deren Urheberrechte, Persönlichkeitsrechte oder personenbezogene Daten) verletzen;",
              "mithilfe des Dienstes rechtswidrige Inhalte zu erstellen oder zu verbreiten;",
              "den Dienst mit automatisierten Mitteln massenhaft zu nutzen, ihn zu überlasten oder seinen Betrieb auf andere Weise zu behindern;",
              "die Sicherheitsvorkehrungen des Dienstes zu umgehen, unbefugt in das System einzudringen oder Schadcode hochzuladen.",
            ],
          },
          "Enthalten die verarbeiteten Dateien personenbezogene Daten anderer Personen, sind Sie für deren rechtmäßige Verarbeitung verantwortlich.",
          "Der Betreiber kann den Zugang zum Dienst einschränken oder verweigern, um Missbrauch zu verhindern.",
        ],
      },
      {
        heading: "4. Verarbeitung von Office-Dateien",
        blocks: [
          "Zur Umwandlung von Word-, Excel- und PowerPoint-Dateien wird die Datei über eine verschlüsselte Verbindung (HTTPS) an den Server übertragen. Der Server verwendet sie ausschließlich zur Erstellung des PDFs, löscht sie unmittelbar nach Abschluss der Umwandlung, speichert sie nicht, und niemand sieht sie ein. Alle anderen Dateien verlassen Ihr Gerät gar nicht erst.",
          "Eine hochgeladene Office-Datei darf höchstens 4,4 MB groß sein. Passwortgeschützte Dokumente wandelt der Dienst nicht um.",
          "Die Rechte an Ihren Dateien und an den erstellten PDFs verbleiben bei Ihnen; der Betreiber erwirbt daran keinerlei Rechte.",
        ],
      },
      {
        heading: "5. Geistiges Eigentum",
        blocks: [
          "Gestaltung, Texte, grafische Elemente und Quellcode der Website sind geistiges Eigentum des Betreibers; sie dürfen ohne schriftliche Genehmigung des Betreibers nicht kopiert oder verbreitet werden.",
          "Der Dienst verwendet auch Open-Source-Komponenten (zum Beispiel Mozilla pdf.js, pdf-lib, LibreOffice und Gotenberg), für die ihre jeweils eigenen Lizenzbedingungen gelten.",
        ],
      },
      {
        heading: "6. Haftung",
        blocks: [
          "Der Dienst wird kostenlos und „wie besehen“ bereitgestellt. Der Betreiber unternimmt alles für eine exakte Umwandlung, übernimmt jedoch keine Gewähr dafür, dass das Ergebnis in jedem Fall fehlerfrei ist und dass der Dienst ohne Unterbrechung und fehlerfrei verfügbar ist.",
          "Überprüfen Sie die erstellten Dateien vor der Verwendung, und bewahren Sie von Ihren Originaldateien stets eine Kopie auf.",
          "Der Betreiber haftet – im größtmöglichen gesetzlich zulässigen Umfang – nicht für unmittelbare oder mittelbare Schäden, Datenverlust oder entgangenen Gewinn, die aus der Nutzung oder der Nichtnutzbarkeit des Dienstes entstehen. Diese Beschränkung gilt nicht für die Haftung für vorsätzlich oder grob fahrlässig verursachte Schäden sowie für Vertragsverletzungen, die zu einer Verletzung des Lebens, des Körpers oder der Gesundheit führen.",
        ],
      },
      {
        heading: "7. Verfügbarkeit und Änderungen",
        blocks: [
          "Der Betreiber ist berechtigt, den Dienst jederzeit – auch ohne vorherige Ankündigung – zu ändern, zu erweitern, auszusetzen oder einzustellen.",
        ],
      },
      {
        heading: "8. Datenschutz",
        blocks: ["Einzelheiten zur Verarbeitung personenbezogener Daten finden Sie in der [Datenschutzerklärung]({privacyPath})."],
      },
      {
        heading: "9. Änderung der Bedingungen",
        blocks: [
          "Der Betreiber ist berechtigt, diese Bedingungen einseitig zu ändern. Die Änderung tritt mit ihrer Veröffentlichung auf der Website in Kraft; das Datum des Inkrafttretens wird oben im Dokument angegeben. Durch die weitere Nutzung des Dienstes akzeptieren Sie die geänderten Bedingungen.",
        ],
      },
      {
        heading: "10. Anwendbares Recht und Streitigkeiten",
        blocks: [
          "Für diese Bedingungen gilt ungarisches Recht. Wenn Sie den Dienst als Verbraucher nutzen, wird Ihnen durch diese Rechtswahl nicht der Schutz entzogen, der Ihnen durch die zwingenden Verbraucherschutzvorschriften des Landes Ihres Wohnsitzes gewährt wird.",
          "Streitfragen bemühen wir uns in erster Linie gütlich, im Wege der Verständigung beizulegen.",
        ],
      },
      {
        heading: "11. Kontakt",
        blocks: ["Mit Fragen und Anmerkungen können Sie sich unter folgender E-Mail-Adresse an den Betreiber wenden: {operatorEmail}."],
      },
    ],
  },

  privacy: {
    title: "Datenschutzerklärung",
    intro:
      "Diese Erklärung legt auf Grundlage der Verordnung (EU) 2016/679 des Europäischen Parlaments und des Rates (Datenschutz-Grundverordnung, DSGVO) dar, welche personenbezogenen Daten wir bei der Nutzung von {site} ({url}) verarbeiten, zu welchem Zweck, auf welcher Rechtsgrundlage und wie lange, und welche Rechte Ihnen zustehen.",
    sections: [
      {
        heading: "1. Der Verantwortliche",
        blocks: [{ details: "operator" }],
      },
      {
        heading: "2. Kurz gefasst",
        blocks: [
          {
            list: [
              "Es gibt keine Registrierung: Wir fragen weder Namen noch E-Mail-Adresse oder andere identifizierende Daten ab.",
              "Bilder, Textdateien und PDFs werden von Ihrem Browser verarbeitet und gelangen nicht zu uns.",
              "Word-, Excel- und PowerPoint-Dateien gelangen nur für die Dauer der Umwandlung auf den Server und werden danach sofort gelöscht.",
              "Wir verwenden keine Cookies und keine Analyse- oder Werbe-Trackingcodes.",
            ],
          },
        ],
      },
      {
        heading: "3. Umwandlung von Office-Dateien",
        blocks: [
          "Wenn Sie eine Word-, Excel- oder PowerPoint-Datei hinzufügen, wird die Datei über eine verschlüsselte Verbindung (HTTPS) an den Server übertragen, wo ein Office-Programm sie in PDF umwandelt; anschließend wird das PDF an Ihren Browser zurückgesendet.",
          {
            list: [
              "Verarbeitete Daten: Name und Inhalt der Datei, einschließlich etwaiger im Dokument enthaltener personenbezogener Daten.",
              "Zweck: Durchführung der von Ihnen angeforderten Umwandlung.",
              "Rechtsgrundlage: Erbringung des Dienstes auf Ihre Anfrage (Art. 6 Abs. 1 lit. b DSGVO).",
              "Dauer: nur für die Dauer der Umwandlung, in der Regel einige Sekunden. Die Datei und das PDF werden danach sofort gelöscht; wir speichern sie nicht, und niemand sieht sie ein.",
            ],
          },
        ],
      },
      {
        heading: "4. Technische Protokolle",
        blocks: [
          "Bei der Auslieferung der Website erfassen – wie bei jeder Website – die Server des Hosting-Anbieters technische Daten.",
          {
            list: [
              "Verarbeitete Daten: IP-Adresse, Zeitpunkt der Anfrage, Adresse der aufgerufenen Seite, Typ und Version des Browsers.",
              "Zweck: sicherer und störungsfreier Betrieb des Dienstes, Erkennung von Fehlern und Missbrauch.",
              "Rechtsgrundlage: berechtigtes Interesse des Betreibers (Art. 6 Abs. 1 lit. f DSGVO).",
              "Dauer: kurzzeitig, gemäß den Aufbewahrungsregeln des Hosting-Anbieters.",
            ],
          },
        ],
      },
      {
        heading: "5. Im Browser verarbeitete Dateien",
        blocks: [
          "Bilder, Textdateien und PDFs – einschließlich der Passwörter von PDFs – werden ausschließlich von Ihrem Browser auf Ihrem eigenen Gerät verarbeitet. Auf diese Daten haben wir keinen Zugriff, und wir verarbeiten sie nicht.",
        ],
      },
      {
        heading: "6. Cookies und lokale Speicherung",
        blocks: [
          "Die Website verwendet keine Cookies und keine Analyse- oder Werbe-Trackingcodes. Im lokalen Speicher des Browsers (localStorage) speichern wir nur das gewählte Erscheinungsbild (helles oder dunkles Design); diese Angabe gelangt nicht zu uns, und Sie können sie jederzeit in den Browsereinstellungen löschen.",
        ],
      },
      {
        heading: "7. Auftragsverarbeiter und Datenübermittlung",
        blocks: [
          "Das Hosting der Website und die für die Umwandlung der Office-Dateien erforderliche Rechenkapazität stellt folgender Auftragsverarbeiter bereit:",
          { details: "hosting" },
          "Die Vercel Inc. hat ihren Sitz in den Vereinigten Staaten von Amerika, daher können Daten auch in Länder außerhalb der Europäischen Union gelangen. Die Übermittlung erfolgt auf Grundlage geeigneter Garantien (EU-US-Datenschutzrahmen bzw. von der Europäischen Kommission erlassene Standarddatenschutzklauseln).",
          "Ihre Daten geben wir an keine weiteren Dritten weiter und verkaufen sie nicht.",
        ],
      },
      {
        heading: "8. Datensicherheit",
        blocks: [
          "Alle Verbindungen zwischen der Website und dem Server sind verschlüsselt (HTTPS). Der Dienst, der die Office-Dateien umwandelt, ist aus dem Internet nicht direkt erreichbar; die Dateien werden nicht gespeichert und nach der Verarbeitung sofort gelöscht.",
        ],
      },
      {
        heading: "9. Ihre Rechte",
        blocks: [
          "Nach der DSGVO stehen Ihnen folgende Rechte zu:",
          {
            list: [
              "Recht auf Information und Auskunft (Art. 15 DSGVO);",
              "Recht auf Berichtigung (Art. 16 DSGVO);",
              "Recht auf Löschung (Art. 17 DSGVO);",
              "Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO);",
              "Recht auf Datenübertragbarkeit (Art. 20 DSGVO);",
              "Recht auf Widerspruch gegen eine auf berechtigtem Interesse beruhende Verarbeitung (Art. 21 DSGVO).",
            ],
          },
          "Da es keine Registrierung gibt und wir Office-Dateien sofort löschen, verfügen wir in den meisten Fällen über keine Daten, anhand derer wir Sie identifizieren könnten. Ihre Anfrage können Sie an {operatorEmail} senden; wir antworten spätestens innerhalb eines Monats.",
        ],
      },
      {
        heading: "10. Rechtsbehelfe",
        blocks: [
          "Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen geltendes Recht verstößt, können Sie Beschwerde bei der ungarischen Datenschutzbehörde (Nemzeti Adatvédelmi és Információszabadság Hatóság, NAIH; 1055 Budapest, Falk Miksa utca 9–11.; Postanschrift: 1363 Budapest, Pf. 9.; Telefon: +36 1 391 1400; E-Mail: ugyfelszolgalat@naih.hu; Website: https://naih.hu) oder bei der für Ihren Wohnort zuständigen Datenschutzbehörde einlegen.",
          "Bei einer Verletzung Ihrer Rechte können Sie sich auch an ein Gericht wenden; die Klage können Sie auch bei dem Gericht erheben, das für Ihren Wohnsitz oder Ihren Aufenthaltsort zuständig ist.",
        ],
      },
      {
        heading: "11. Änderungen dieser Erklärung",
        blocks: [
          "Wir aktualisieren diese Erklärung, wenn sich der Dienst ändert; das Datum des Inkrafttretens wird oben im Dokument angegeben. Die Bedingungen für die Nutzung des Dienstes finden Sie in den [Allgemeinen Geschäftsbedingungen]({termsPath}).",
        ],
      },
    ],
  },
};
