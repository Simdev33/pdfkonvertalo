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
      "Dieses Dokument enthält die Bedingungen für die Nutzung des Webdienstes {site} ({url}) und für das Abonnement. Mit der Nutzung der Website bzw. mit der Bestellung des Abonnements akzeptieren Sie diese Bedingungen; wenn Sie mit ihnen nicht einverstanden sind, nutzen Sie den Dienst bitte nicht.",
    sections: [
      {
        heading: "1. Der Betreiber",
        blocks: ["Der Dienst wird von folgendem Betreiber erbracht:", { details: "operator" }, "Der Hosting-Anbieter:", { details: "hosting" }],
      },
      {
        heading: "2. Der Dienst",
        blocks: [
          "{site} ist ein Online-Werkzeug, mit dem Sie:",
          {
            list: [
              "Bilder, Textdateien sowie Word-, Excel- und PowerPoint-Dateien in PDF umwandeln bzw. PDFs zusammenfügen können;",
              "aus PDF-Seiten JPG- oder PNG-Bilder erstellen können.",
            ],
          },
          "Das Hinzufügen und Umwandeln der Dateien sowie die Vorschau des Ergebnisses sind kostenlos. Zum Herunterladen der fertigen Dateien ist ein Abonnement erforderlich (siehe Abschnitt 3).",
          "Die Verarbeitung von Bildern, Textdateien und PDFs erfolgt in Ihrem Browser, auf Ihrem eigenen Gerät; diese gelangen nicht auf den Server. Word-, Excel- und PowerPoint-Dateien werden für eine exakte Umwandlung vom Server in PDF umgewandelt (siehe Abschnitt 9).",
        ],
      },
      {
        heading: "3. Abonnement und Preise",
        blocks: [
          "Das Abonnement beginnt mit einem {days}-tägigen Einführungszeitraum, der {trial} kostet. In diesem Zeitraum kann der Dienst in vollem Umfang und ohne Einschränkungen genutzt werden.",
          "Wenn Sie das Abonnement nicht bis zum Ende des Einführungszeitraums kündigen, geht es ab dem {next}. Tag automatisch in ein Abonnement mit einer monatlichen Gebühr von {monthly} über und verlängert sich jeweils um einen Monat, bis Sie es kündigen. Die monatliche Gebühr wird zu Beginn jedes Zeitraums über die bei der Bestellung angegebene Zahlungsart abgebucht.",
          "Der zu zahlende Gesamtbetrag wird vor der Bestellung auf der Zahlungsseite deutlich angezeigt. Die Bestellung kommt durch Betätigen der Schaltfläche „Zahlungspflichtig bestellen“ (bzw. der Schaltfläche der gewählten Zahlungsart) zustande.",
          "Vor Ablauf des Einführungszeitraums senden wir Ihnen per E-Mail eine Erinnerung an die bevorstehende monatliche Abbuchung.",
          "Über Preisänderungen informieren wir die Abonnenten mindestens 30 Tage vor der Änderung per E-Mail; wenn Sie die Änderung nicht akzeptieren, können Sie das Abonnement vor ihrem Inkrafttreten kündigen.",
        ],
      },
      {
        heading: "4. Zahlung",
        blocks: [
          "Die Zahlung wird von der Stripe Payments Europe, Ltd. (Irland) abgewickelt. Verfügbare Zahlungsarten (je nach Gerät, Browser und Land): Debit- und Kreditkarte, Apple Pay, Google Pay, PayPal und Link. Ihre Kartendaten sehen und speichern wir nicht.",
          "Über erfolgreiche Zahlungen sendet Ihnen Stripe per E-Mail eine Quittung. Die gesetzlich vorgeschriebene Rechnung stellt der Betreiber aus.",
          "Schlägt eine monatliche Abbuchung fehl, versucht Stripe sie innerhalb weniger Tage erneut; gelingt sie weiterhin nicht, endet das Abonnement, und der Zugang zum Herunterladen erlischt.",
        ],
      },
      {
        heading: "5. Kündigung",
        blocks: [
          "Sie können das Abonnement jederzeit ohne Angabe von Gründen auf der Seite [Mein Konto]({accountPath}) (Anmeldung mit einem per E-Mail erhaltenen Code) mit einem Klick auf der sicheren Oberfläche von Stripe kündigen.",
          "Die Kündigung wird zum Ende des laufenden Zeitraums wirksam: Bis dahin bleibt Ihr Zugang bestehen, und es erfolgt keine weitere Abbuchung. Bei einer Kündigung während des Einführungszeitraums wird ab dem {next}. Tag keine monatliche Gebühr abgebucht.",
          "Die Gebühr für einen bereits begonnenen Zeitraum wird – außer bei Ausübung des Widerrufsrechts und in den gesetzlich vorgeschriebenen Fällen – nicht erstattet.",
        ],
      },
      {
        heading: "6. Widerrufsrecht",
        blocks: [
          "Wenn Sie das Abonnement als Verbraucher bestellen, können Sie den Vertrag binnen 14 Tagen ab der Bestellung ohne Angabe von Gründen widerrufen. Ihre Widerrufsabsicht können Sie durch eine eindeutige Erklärung gegenüber dem Betreiber (zum Beispiel per E-Mail: {operatorEmail}) mitteilen; dafür können Sie auch das Muster-Widerrufsformular nach Anhang I Teil B der Richtlinie 2011/83/EU verwenden, was jedoch nicht vorgeschrieben ist.",
          "Da Sie bei der Bestellung ausdrücklich verlangen, dass mit der Leistung sofort begonnen wird, müssen Sie im Falle eines Widerrufs für den bis zum Widerruf in Anspruch genommenen Zeitraum einen anteiligen Betrag (Wertersatz) zahlen. Den verbleibenden Betrag erstatten wir Ihnen binnen 14 Tagen ab der Mitteilung des Widerrufs über die bei der Zahlung verwendete Zahlungsart.",
          "Das Widerrufsrecht lässt die Möglichkeit unberührt, das Abonnement jederzeit zu kündigen (siehe Abschnitt 5).",
        ],
      },
      {
        heading: "7. Konto und Anmeldung",
        blocks: [
          "Eine gesonderte Registrierung mit Passwort gibt es nicht. Ihr Konto ist an die bei der Zahlung angegebene E-Mail-Adresse gebunden: In dem Browser, in dem Sie bezahlt haben, sind Sie automatisch angemeldet; auf anderen Geräten melden Sie sich mit einem 6-stelligen Code an, den Sie per E-Mail erhalten und der 10 Minuten gültig ist.",
          "Geben Sie den Anmeldecode nicht an andere weiter. Das Abonnement ist für die persönliche Nutzung bestimmt; die Weitergabe oder der Weiterverkauf des Zugangs ist nicht gestattet.",
        ],
      },
      {
        heading: "8. Nutzungsbedingungen",
        blocks: [
          "Sie dürfen den Dienst nur zu rechtmäßigen Zwecken und im Einklang mit diesen Bedingungen nutzen. Untersagt ist insbesondere:",
          {
            list: [
              "Dateien zu verarbeiten, an denen Sie keine Rechte haben oder die Rechte Dritter (beispielsweise deren Urheberrechte, Persönlichkeitsrechte oder personenbezogene Daten) verletzen;",
              "mithilfe des Dienstes rechtswidrige Inhalte zu erstellen oder zu verbreiten;",
              "den Dienst mit automatisierten Mitteln massenhaft zu nutzen, ihn zu überlasten oder seinen Betrieb auf andere Weise zu behindern;",
              "die Sicherheits- oder Zahlungsmechanismen des Dienstes zu umgehen, unbefugt in das System einzudringen oder Schadcode hochzuladen.",
            ],
          },
          "Enthalten die verarbeiteten Dateien personenbezogene Daten anderer Personen, sind Sie für deren rechtmäßige Verarbeitung verantwortlich.",
          "Der Betreiber kann den Zugang einschränken oder sperren, um Missbrauch zu verhindern; bei schwerwiegenden Vertragsverletzungen kann das Abonnement mit sofortiger Wirkung beendet werden.",
        ],
      },
      {
        heading: "9. Verarbeitung von Office-Dateien",
        blocks: [
          "Zur Umwandlung von Word-, Excel- und PowerPoint-Dateien wird die Datei über eine verschlüsselte Verbindung (HTTPS) an den Server übertragen. Der Server verwendet sie ausschließlich zur Erstellung des PDFs, löscht sie unmittelbar nach Abschluss der Umwandlung, speichert sie nicht, und niemand sieht sie ein. Alle anderen Dateien verlassen Ihr Gerät gar nicht erst.",
          "Eine hochgeladene Office-Datei darf höchstens 4,4 MB groß sein. Passwortgeschützte Dokumente wandelt der Dienst nicht um.",
          "Die Rechte an Ihren Dateien und an den erstellten Dateien verbleiben bei Ihnen; der Betreiber erwirbt daran keinerlei Rechte.",
        ],
      },
      {
        heading: "10. Geistiges Eigentum",
        blocks: [
          "Gestaltung, Texte, grafische Elemente und Quellcode der Website sind geistiges Eigentum des Betreibers; sie dürfen ohne schriftliche Genehmigung des Betreibers nicht kopiert oder verbreitet werden.",
          "Der Dienst verwendet auch Open-Source-Komponenten (zum Beispiel Mozilla pdf.js, pdf-lib, LibreOffice und Gotenberg), für die ihre jeweils eigenen Lizenzbedingungen gelten.",
        ],
      },
      {
        heading: "11. Haftung",
        blocks: [
          "Der Betreiber unternimmt alles für eine exakte Umwandlung und die ständige Verfügbarkeit des Dienstes, übernimmt jedoch keine Gewähr dafür, dass das Ergebnis in jedem Fall fehlerfrei ist und dass der Dienst ohne Unterbrechung und fehlerfrei verfügbar ist.",
          "Überprüfen Sie die erstellten Dateien vor der Verwendung, und bewahren Sie von Ihren Originaldateien stets eine Kopie auf.",
          "Der Betreiber haftet – im größtmöglichen gesetzlich zulässigen Umfang – nicht für mittelbare Schäden, Datenverlust oder entgangenen Gewinn, die aus der Nutzung oder der Nichtnutzbarkeit des Dienstes entstehen. Diese Beschränkung gilt nicht für die Haftung für vorsätzlich oder grob fahrlässig verursachte Schäden sowie für Vertragsverletzungen, die zu einer Verletzung des Lebens, des Körpers oder der Gesundheit führen, und lässt die Rechte unberührt, die Verbrauchern von Gesetzes wegen zustehen.",
        ],
      },
      {
        heading: "12. Verfügbarkeit und Änderungen",
        blocks: [
          "Der Betreiber ist berechtigt, den Dienst weiterzuentwickeln und zu ändern. Wird der Dienst endgültig eingestellt, beenden wir die Abonnements und erstatten die Gebühr für den nicht genutzten Zeitraum anteilig.",
        ],
      },
      {
        heading: "13. Datenschutz",
        blocks: ["Einzelheiten zur Verarbeitung personenbezogener Daten finden Sie in der [Datenschutzerklärung]({privacyPath})."],
      },
      {
        heading: "14. Änderung der Bedingungen",
        blocks: [
          "Der Betreiber ist berechtigt, diese Bedingungen zu ändern. Die Änderung tritt mit ihrer Veröffentlichung auf der Website in Kraft; das Datum des Inkrafttretens wird oben im Dokument angegeben. Über wesentliche, für sie nachteilige Änderungen informieren wir die Abonnenten mindestens 30 Tage im Voraus per E-Mail; wenn sie diese nicht akzeptieren, können sie das Abonnement vor dem Inkrafttreten kündigen.",
        ],
      },
      {
        heading: "15. Anwendbares Recht und Streitigkeiten",
        blocks: [
          "Für diese Bedingungen gilt slowakisches Recht. Wenn Sie den Dienst als Verbraucher nutzen, wird Ihnen durch diese Rechtswahl nicht der Schutz entzogen, der Ihnen durch die zwingenden Verbraucherschutzvorschriften des Landes Ihres Wohnsitzes gewährt wird.",
          "Streitfragen bemühen wir uns in erster Linie gütlich, im Wege der Verständigung beizulegen: Ihre Beschwerde können Sie an {operatorEmail} senden. Wenn wir Ihre Beschwerde ablehnen oder nicht innerhalb von 30 Tagen antworten, können Sie als Verbraucher ein Verfahren zur alternativen Streitbeilegung bei der Slowakischen Handelsinspektion (Slovenská obchodná inšpekcia, https://www.soi.sk) oder bei einer anderen Streitbeilegungsstelle einleiten, die in der Liste des slowakischen Wirtschaftsministeriums aufgeführt ist. Sie können sich auch an die Verbraucherschutzbehörde und an das Gericht Ihres Wohnsitzes wenden.",
        ],
      },
      {
        heading: "16. Kontakt",
        blocks: ["Mit Fragen, Anmerkungen und Beschwerden können Sie sich unter folgender E-Mail-Adresse an den Betreiber wenden: {operatorEmail}."],
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
              "Es gibt keine Registrierung mit Passwort. Wenn Sie ein Abonnement abschließen, verarbeiten wir Ihre E-Mail-Adresse und die Daten Ihres Abonnements.",
              "Die Zahlung wird von Stripe abgewickelt; Ihre Kartendaten sehen und speichern wir nicht.",
              "Bilder, Textdateien und PDFs werden von Ihrem Browser verarbeitet und gelangen nicht zu uns.",
              "Word-, Excel- und PowerPoint-Dateien gelangen nur für die Dauer der Umwandlung auf den Server und werden danach sofort gelöscht.",
              "Wir verwenden keine Analyse- oder Werbe-Trackingcodes. Cookies verwenden wir nur für die Anmeldung und die Zahlung.",
            ],
          },
        ],
      },
      {
        heading: "3. Abonnement und Zahlung",
        blocks: [
          "Wenn Sie ein Abonnement abschließen, werden die auf der Zahlungsseite eingegebenen Daten von Stripe verarbeitet; bei uns erscheinen die Daten, die für die Verwaltung des Abonnements erforderlich sind.",
          {
            list: [
              "Verarbeitete Daten: E-Mail-Adresse, die von Stripe vergebene Kunden- und Abonnement-ID, Status und Zeiträume des Abonnements, Betrag und Zeitpunkt der Zahlungen, Art der Zahlungsart (zum Beispiel Karte sowie deren letzte 4 Ziffern) und – sofern die Zahlungsseite sie abfragt – Rechnungsland und Postleitzahl.",
              "Zweck: Abschluss und Erfüllung des Abonnements, Einzug der Gebühren, Prüfung der Zugangsberechtigung, Rechnungsstellung und Kundenservice.",
              "Rechtsgrundlage: Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO); bei der Aufbewahrung von Buchhaltungsbelegen eine rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO).",
              "Dauer: für die Dauer des Abonnements; nach der Kündigung bewahren wir die Buchhaltungsbelege gemäß § 35 des slowakischen Rechnungslegungsgesetzes (Gesetz Nr. 431/2002 Slg.) 10 Jahre lang auf. Die übrigen Daten löschen wir auf Ihren Wunsch nach Beendigung des Abonnements.",
            ],
          },
          "Die Zahlungen werden von der Stripe Payments Europe, Ltd. (1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irland) abgewickelt, die hinsichtlich der Zahlungsdaten und der Betrugsprävention eigenständig Verantwortlicher ist. Informationen über ihre Datenverarbeitung finden Sie unter https://stripe.com/privacy.",
        ],
      },
      {
        heading: "4. Anmeldung mit E-Mail-Code",
        blocks: [
          "Auf anderen Geräten können Sie sich mit einem per E-Mail gesendeten Einmalcode anmelden.",
          {
            list: [
              "Verarbeitete Daten: E-Mail-Adresse, der Anmeldecode in verschlüsselter Form (Hash), seine Ablaufzeit und die Anzahl der Versuche.",
              "Zweck: Anmeldung und Schutz des Kontos.",
              "Rechtsgrundlage: Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO).",
              "Dauer: Der Code ist 10 Minuten gültig und wird nach der Verwendung sofort gelöscht.",
            ],
          },
          "Die Anmelde-E-Mails werden von der Resend, Inc. (https://resend.com) als Auftragsverarbeiter versendet.",
        ],
      },
      {
        heading: "5. Umwandlung von Office-Dateien",
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
        heading: "6. Technische Protokolle",
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
        heading: "7. Im Browser verarbeitete Dateien",
        blocks: [
          "Bilder, Textdateien und PDFs – einschließlich der Passwörter von PDFs – werden ausschließlich von Ihrem Browser auf Ihrem eigenen Gerät verarbeitet. Auf diese Daten haben wir keinen Zugriff, und wir verarbeiten sie nicht.",
          "Solange die Zahlungsseite geöffnet ist, speichert Ihr Browser die fertige Datei bis zu 60 Minuten lang auf Ihrem eigenen Gerät (IndexedDB), damit sie auch nach einer Zahlungsart, die auf eine andere Seite weiterleitet (zum Beispiel PayPal), nicht verloren geht. Auch diese Datei gelangt nicht zu uns. Waren Word-, Excel- oder PowerPoint-Dateien dabei, werden dort auch die Originaldateien aufbewahrt, damit nach der Zahlung die vollständige Fassung erstellt werden kann (der Server wandelt sie dann wie oben beschrieben erneut um).",
        ],
      },
      {
        heading: "8. Cookies und lokale Speicherung",
        blocks: [
          "Wir verwenden nur Cookies, die für den Betrieb des Dienstes erforderlich sind; dafür ist keine Einwilligung nötig:",
          {
            list: [
              "pk_session: speichert den Anmeldestatus (180 Tage);",
              "pk_signed_in: zeigt der Website an, dass Sie angemeldet sind (180 Tage);",
              "pk_login: Ablauf der Anmeldung per Code (10 Minuten);",
              "pk_lang: speichert die im Sprachwähler gewählte Sprache (1 Jahr).",
            ],
          },
          "Auf der Zahlungsseite verwendet Stripe eigene Cookies, um die Zahlung sicher abzuwickeln und Betrug zu verhindern. Analyse- oder Werbe-Cookies verwenden wir nicht. Im lokalen Speicher des Browsers (localStorage) speichern wir nur das gewählte Erscheinungsbild (helles oder dunkles Design).",
        ],
      },
      {
        heading: "9. Auftragsverarbeiter und Datenübermittlung",
        blocks: [
          "Das Hosting der Website und die für die Umwandlung der Office-Dateien erforderliche Rechenkapazität stellt folgender Auftragsverarbeiter bereit:",
          { details: "hosting" },
          "Die Anmelde-E-Mails werden von der Resend, Inc. versendet. Die Vercel Inc. und die Resend, Inc. haben ihren Sitz in den Vereinigten Staaten von Amerika, daher können Daten auch in Länder außerhalb der Europäischen Union gelangen. Die Übermittlung erfolgt auf Grundlage geeigneter Garantien (EU-US-Datenschutzrahmen bzw. von der Europäischen Kommission erlassene Standarddatenschutzklauseln).",
          "Ihre Daten geben wir an keine weiteren Dritten weiter und verkaufen sie nicht.",
        ],
      },
      {
        heading: "10. Datensicherheit",
        blocks: [
          "Alle Verbindungen zwischen der Website und dem Server sind verschlüsselt (HTTPS). Die Anmelde-Cookies sind signiert und für Skripte nicht lesbar. Der Dienst, der die Office-Dateien umwandelt, ist aus dem Internet nicht direkt erreichbar; die Dateien werden nicht gespeichert und nach der Verarbeitung sofort gelöscht.",
        ],
      },
      {
        heading: "11. Ihre Rechte",
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
          "Ihre Anfrage können Sie an {operatorEmail} senden; wir antworten spätestens innerhalb eines Monats. Ihre E-Mail-Adresse können Sie auch selbst auf der Seite [Mein Konto]({accountPath}) über die Oberfläche von Stripe ändern.",
        ],
      },
      {
        heading: "12. Rechtsbehelfe",
        blocks: [
          "Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen geltendes Recht verstößt, können Sie Beschwerde bei der slowakischen Aufsichtsbehörde am Sitz des Verantwortlichen (Úrad na ochranu osobných údajov Slovenskej republiky; Hraničná 12, 820 07 Bratislava 27; Website: https://dataprotection.gov.sk) oder bei der Datenschutzbehörde Ihres Wohnorts oder Arbeitsorts einlegen – in Ungarn bei der Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH; 1055 Budapest, Falk Miksa utca 9–11.; Postanschrift: 1363 Budapest, Pf. 9.; Telefon: +36 1 391 1400; E-Mail: ugyfelszolgalat@naih.hu; Website: https://naih.hu).",
          "Bei einer Verletzung Ihrer Rechte können Sie sich auch an ein Gericht wenden; die Klage können Sie auch vor einem Gericht des Mitgliedstaats erheben, in dem Sie Ihren Wohnsitz oder Aufenthaltsort haben.",
        ],
      },
      {
        heading: "13. Änderungen dieser Erklärung",
        blocks: [
          "Wir aktualisieren diese Erklärung, wenn sich der Dienst ändert; das Datum des Inkrafttretens wird oben im Dokument angegeben. Die Bedingungen für die Nutzung des Dienstes finden Sie in den [Allgemeinen Geschäftsbedingungen]({termsPath}).",
        ],
      },
    ],
  },
};
