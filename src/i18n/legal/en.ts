import type { LegalDocs } from "./types";

export const en: LegalDocs = {
  labels: {
    name: "Name",
    address: "Address",
    email: "E-mail",
    registration: "Registration number",
    taxNumber: "Tax number",
    web: "Website",
  },

  terms: {
    title: "Terms of Service",
    intro:
      "This document sets out the terms of use of the {site} ({url}) web service. By using the site, you accept these terms; if you do not agree with them, please do not use the service.",
    sections: [
      {
        heading: "1. The operator",
        blocks: ["The service is provided by the following operator:", { details: "operator" }, "The hosting provider:", { details: "hosting" }],
      },
      {
        heading: "2. The service",
        blocks: [
          "{site} is a free online tool that can be used without registration, with which you can:",
          {
            list: [
              "convert images, text files, and Word, Excel and PowerPoint files to PDF, and merge PDFs;",
              "create JPG or PNG images from PDF pages.",
            ],
          },
          "Images, text files and PDFs are processed in your browser, on your own device; they are not sent to the server. Word, Excel and PowerPoint files are converted to PDF by the server to ensure an accurate conversion (see section 4).",
          "Use of the service is free of charge.",
        ],
      },
      {
        heading: "3. Conditions of use",
        blocks: [
          "You may use the service only for lawful purposes and in accordance with these terms. In particular, it is prohibited to:",
          {
            list: [
              "process a file that you have no right to, or that infringes the rights of others (for example their copyright, personality rights or personal data);",
              "create or distribute unlawful content using the service;",
              "use the service on a mass scale with automated tools, overload it, or otherwise obstruct its operation;",
              "circumvent the service's security measures, gain unauthorized access to the system, or upload malicious code.",
            ],
          },
          "If the processed files contain other people's personal data, you are responsible for handling that data lawfully.",
          "The operator may restrict or deny access to the service in order to prevent abuse.",
        ],
      },
      {
        heading: "4. Processing of Office files",
        blocks: [
          "To convert Word, Excel and PowerPoint files, the file is sent to the server over an encrypted (HTTPS) connection. The server uses it solely to create the PDF, deletes it immediately after the conversion is complete, does not store it, and no one looks at its contents. Other files never leave your device.",
          "The maximum size of an Office file that can be uploaded is 4.4 MB. The service does not convert password-protected documents.",
          "You retain all rights to your files and to the resulting PDFs; the operator acquires no rights to them.",
        ],
      },
      {
        heading: "5. Intellectual property",
        blocks: [
          "The design, texts, graphic elements and source code of the site are the intellectual property of the operator; they may not be copied or distributed without the operator's written permission.",
          "The service also uses open-source components (such as Mozilla pdf.js, pdf-lib, LibreOffice and Gotenberg), which are subject to their own license terms.",
        ],
      },
      {
        heading: "6. Liability",
        blocks: [
          "The service is provided free of charge on an “as is” basis. The operator does its best to ensure accurate conversion, but does not guarantee that the result will be flawless in every case, or that the service will be available without interruption or errors.",
          "Check the resulting files before use, and always keep a copy of your original files.",
          "To the maximum extent permitted by law, the operator is not liable for any direct or indirect damage, data loss or loss of profit arising from the use of, or inability to use, the service. This limitation does not apply to liability for breach of contract caused intentionally or by gross negligence, or for breach of contract resulting in harm to life, physical integrity or health.",
        ],
      },
      {
        heading: "7. Availability and changes",
        blocks: [
          "The operator is entitled to modify, extend, suspend or discontinue the service at any time, even without prior notice.",
        ],
      },
      {
        heading: "8. Data protection",
        blocks: ["Details of the processing of personal data are set out in the [Privacy Policy]({privacyPath})."],
      },
      {
        heading: "9. Amendment of the terms",
        blocks: [
          "The operator is entitled to amend these terms unilaterally. Amendments take effect upon publication on the site; the effective date is shown at the top of the document. By continuing to use the service, you accept the amended terms.",
        ],
      },
      {
        heading: "10. Governing law and disputes",
        blocks: [
          "Hungarian law applies to these terms. If you use the service as a consumer, this choice of law does not deprive you of the protection afforded to you by the mandatory consumer protection rules of your country of residence.",
          "We aim to settle any disputes amicably, primarily through negotiation.",
        ],
      },
      {
        heading: "11. Contact",
        blocks: ["You can contact the operator with questions or comments at the following e-mail address: {operatorEmail}."],
      },
    ],
  },

  privacy: {
    title: "Privacy Policy",
    intro:
      "In accordance with Regulation (EU) 2016/679 of the European Parliament and of the Council (General Data Protection Regulation, GDPR), this notice explains what personal data we process when you use {site} ({url}), for what purpose, on what legal basis and for how long, as well as what rights you have.",
    sections: [
      {
        heading: "1. The data controller",
        blocks: [{ details: "operator" }],
      },
      {
        heading: "2. In brief",
        blocks: [
          {
            list: [
              "There is no registration: we do not ask for your name, e-mail address or any other identifying data.",
              "Images, text files and PDFs are processed by your browser; they never reach us.",
              "Word, Excel and PowerPoint files are on the server only for the duration of the conversion, and are deleted immediately afterwards.",
              "We do not use cookies, or any analytics or advertising tracking code.",
            ],
          },
        ],
      },
      {
        heading: "3. Converting Office files",
        blocks: [
          "If you add a Word, Excel or PowerPoint file, the file is sent over an encrypted (HTTPS) connection to the server, where an office application converts it to PDF, and the PDF is then returned to your browser.",
          {
            list: [
              "Data processed: the name and content of the file, including any personal data the document may contain.",
              "Purpose: performing the conversion you requested.",
              "Legal basis: providing the service at your request (Article 6(1)(b) GDPR).",
              "Duration: only for the duration of the conversion, typically a few seconds. The file and the PDF are then deleted immediately; we do not store them, and no one looks at their contents.",
            ],
          },
        ],
      },
      {
        heading: "4. Technical logs",
        blocks: [
          "When the site is served – as with any website – the hosting provider's servers record technical data.",
          {
            list: [
              "Data processed: IP address, time of the request, address of the requested page, browser type and version.",
              "Purpose: the secure and uninterrupted operation of the service, and the detection of errors and abuse.",
              "Legal basis: the operator's legitimate interest (Article 6(1)(f) GDPR).",
              "Duration: for a short time, in accordance with the hosting provider's data retention rules.",
            ],
          },
        ],
      },
      {
        heading: "5. Files processed in the browser",
        blocks: [
          "Images, text files and PDFs – including PDF passwords – are processed exclusively by your browser, on your own device. We have no access to this data, and we do not process it.",
        ],
      },
      {
        heading: "6. Cookies and local storage",
        blocks: [
          "The site does not use cookies, or any analytics or advertising tracking code. In your browser's local storage (localStorage) we only keep your chosen appearance (light or dark theme); this never reaches us, and you can delete it at any time in your browser settings.",
        ],
      },
      {
        heading: "7. Data processor and data transfers",
        blocks: [
          "The site's hosting and the computing capacity needed to convert Office files are provided by the following data processor:",
          { details: "hosting" },
          "Vercel Inc. is headquartered in the United States of America, so data may also be transferred outside the European Union. Such transfers take place with appropriate safeguards (the EU–US Data Privacy Framework and the standard contractual clauses adopted by the European Commission).",
          "We do not share your data with any other third party, and we do not sell it.",
        ],
      },
      {
        heading: "8. Data security",
        blocks: [
          "All connections between the site and the server are encrypted (HTTPS). The service that converts Office files cannot be accessed directly from the internet; the files are not stored and are deleted immediately after processing.",
        ],
      },
      {
        heading: "9. Your rights",
        blocks: [
          "Under the GDPR, you have the following rights:",
          {
            list: [
              "right to information and access (Article 15);",
              "right to rectification (Article 16);",
              "right to erasure (Article 17);",
              "right to restriction of processing (Article 18);",
              "right to data portability (Article 20);",
              "right to object to processing based on legitimate interest (Article 21).",
            ],
          },
          "As there is no registration and Office files are deleted immediately, in most cases we hold no data that would allow us to identify you. You can send your request to {operatorEmail}; we will respond within one month at the latest.",
        ],
      },
      {
        heading: "10. Remedies",
        blocks: [
          "If you feel that the processing of your personal data violates the law, you can lodge a complaint with the Hungarian National Authority for Data Protection and Freedom of Information (Nemzeti Adatvédelmi és Információszabadság Hatóság, NAIH; 1055 Budapest, Falk Miksa utca 9–11.; postal address: 1363 Budapest, Pf. 9.; phone: +36 1 391 1400; e-mail: ugyfelszolgalat@naih.hu; website: https://naih.hu), or with the data protection authority of your place of residence.",
          "If your rights are violated, you can also go to court; you may also bring the action before the regional court competent for your place of residence or place of stay.",
        ],
      },
      {
        heading: "11. Changes to this notice",
        blocks: [
          "We update this notice whenever the service changes; the effective date is shown at the top of the document. The terms of use of the service are set out in the [Terms of Service]({termsPath}).",
        ],
      },
    ],
  },
};
