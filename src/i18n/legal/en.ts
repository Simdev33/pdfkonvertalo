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
      "This document sets out the terms for using the {site} ({url}) web service and for the subscription. By using the site or ordering the subscription, you accept these terms; if you do not agree with them, please do not use the service.",
    sections: [
      {
        heading: "1. The operator",
        blocks: ["The service is provided by the following operator:", { details: "operator" }, "The hosting provider:", { details: "hosting" }],
      },
      {
        heading: "2. The service",
        blocks: [
          "{site} is an online tool with which you can:",
          {
            list: [
              "convert images, text files, and Word, Excel and PowerPoint files to PDF, and merge PDFs;",
              "create JPG or PNG images from PDF pages.",
            ],
          },
          "Uploading and converting files and previewing the result are free of charge. Downloading the finished files requires a subscription (see section 3).",
          "Images, text files and PDFs are processed in your browser, on your own device; they are not sent to the server. Word, Excel and PowerPoint files are converted to PDF by the server to ensure an accurate conversion (see section 9).",
        ],
      },
      {
        heading: "3. Subscription and fees",
        blocks: [
          "The subscription starts with an introductory period of {days} days, the fee for which is {trial}. During this period, the service can be used in full, without any restrictions.",
          "If you do not cancel the subscription by the end of the introductory period, from day {next} it automatically becomes a subscription with a monthly fee of {monthly}, and it renews every month until you cancel it. The monthly fee is charged at the start of each period to the payment method you provided when ordering.",
          "The total amount payable is clearly shown on the payment page before you place your order. The order is placed when you press the button indicating the obligation to pay (or the button of the selected payment method).",
          "Before the introductory period ends, we send you an e-mail reminder about the upcoming monthly charge.",
          "We notify subscribers by e-mail of any change in fees at least 30 days before the change; if you do not accept it, you can cancel your subscription before the change takes effect.",
        ],
      },
      {
        heading: "4. Payment",
        blocks: [
          "Payments are processed by Stripe Payments Europe, Ltd. (Ireland). Available payment methods (depending on your device, browser and country): debit and credit card, Apple Pay, Google Pay, PayPal and Link. We do not see or store your card details.",
          "Stripe sends you a receipt by e-mail for each successful payment. The invoice required by law is issued by the operator.",
          "If a monthly charge fails, Stripe will try again within a few days; if it still fails, the subscription ends and your download access ends.",
        ],
      },
      {
        heading: "5. Cancellation",
        blocks: [
          "You can cancel your subscription at any time, without giving a reason, on the [My account]({accountPath}) page (sign in with a code sent to you by e-mail), in one click, on Stripe's secure interface.",
          "Cancellation takes effect at the end of the current period: until then you keep your access, and no further charges are made. If you cancel during the introductory period, no monthly fee is charged from day {next}.",
          "The fee for a period that has already started is not refunded, except where you exercise your right of withdrawal and in cases required by law.",
        ],
      },
      {
        heading: "6. Right of withdrawal",
        blocks: [
          "If you order the subscription as a consumer, you may withdraw from the contract within 14 days of the order without giving any reason. You can inform the operator of your decision to withdraw by an unequivocal statement (for example by e-mail: {operatorEmail}); for this, you may use the model withdrawal form in Annex I(B) of Directive 2011/83/EU, but you are not obliged to.",
          "Since you expressly request the immediate start of the service when ordering, if you withdraw you must pay a proportionate fee for the period used up to the withdrawal. We will refund the remaining amount to the payment method used for the payment within 14 days of the date you inform us of your withdrawal.",
          "The right of withdrawal does not affect your option to cancel the subscription at any time (see section 5).",
        ],
      },
      {
        heading: "7. Account and sign-in",
        blocks: [
          "There is no separate registration with a password. Your account is linked to the e-mail address you provide when paying: in the browser where you paid, you are signed in automatically, and on other devices you can sign in with a 6-digit code sent to you by e-mail, which is valid for 10 minutes.",
          "Do not share your sign-in code with anyone. The subscription is for personal use; sharing or reselling access is not permitted.",
        ],
      },
      {
        heading: "8. Conditions of use",
        blocks: [
          "You may use the service only for lawful purposes and in accordance with these terms. In particular, it is prohibited to:",
          {
            list: [
              "process a file that you have no right to, or that infringes the rights of others (for example their copyright, personality rights or personal data);",
              "create or distribute unlawful content using the service;",
              "use the service on a mass scale with automated tools, overload it, or otherwise obstruct its operation;",
              "circumvent the service's security or payment measures, gain unauthorized access to the system, or upload malicious code.",
            ],
          },
          "If the processed files contain other people's personal data, you are responsible for handling that data lawfully.",
          "The operator may restrict or terminate access in order to prevent abuse; in the event of a serious breach of contract, the subscription may be terminated with immediate effect.",
        ],
      },
      {
        heading: "9. Processing of Office files",
        blocks: [
          "To convert Word, Excel and PowerPoint files, the file is sent to the server over an encrypted (HTTPS) connection. The server uses it solely to create the PDF, deletes it immediately after the conversion is complete, does not store it, and no one looks at its contents. Other files never leave your device.",
          "The maximum size of an Office file that can be uploaded is 4.4 MB. The service does not convert password-protected documents.",
          "You retain all rights to your files and to the finished files; the operator acquires no rights to them.",
        ],
      },
      {
        heading: "10. Intellectual property",
        blocks: [
          "The design, texts, graphic elements and source code of the site are the intellectual property of the operator; they may not be copied or distributed without the operator's written permission.",
          "The service also uses open-source components (such as Mozilla pdf.js, pdf-lib, LibreOffice and Gotenberg), which are subject to their own license terms.",
        ],
      },
      {
        heading: "11. Liability",
        blocks: [
          "The operator does its best to ensure accurate conversion and the continuous availability of the service, but does not guarantee that the result will be flawless in every case, or that the service will be available without interruption or errors.",
          "Check the finished files before use, and always keep a copy of your original files.",
          "To the maximum extent permitted by law, the operator is not liable for any indirect damage, data loss or loss of profit arising from the use of, or inability to use, the service. This limitation does not apply to liability for breach of contract caused intentionally or by gross negligence, or for breach of contract resulting in harm to life, physical integrity or health, and it does not affect the rights to which consumers are entitled by law.",
        ],
      },
      {
        heading: "12. Availability and changes",
        blocks: [
          "The operator is entitled to develop and modify the service. If the service is permanently discontinued, we will terminate the subscriptions and refund the fee for the unused period on a pro rata basis.",
        ],
      },
      {
        heading: "13. Data protection",
        blocks: ["Details of the processing of personal data are set out in the [Privacy Policy]({privacyPath})."],
      },
      {
        heading: "14. Amendment of the terms",
        blocks: [
          "The operator is entitled to amend these terms. Amendments take effect upon publication on the site; the effective date is shown at the top of the document. We notify subscribers by e-mail at least 30 days in advance of any material changes that are disadvantageous to them; if they do not accept the changes, they can cancel their subscription before the changes take effect.",
        ],
      },
      {
        heading: "15. Governing law and disputes",
        blocks: [
          "Slovak law applies to these terms. If you use the service as a consumer, this choice of law does not deprive you of the protection afforded to you by the mandatory consumer protection rules of your country of residence.",
          "We aim to settle any disputes amicably, primarily through negotiation: you can send your complaint to {operatorEmail}. If we reject your complaint or do not respond within 30 days, as a consumer you can initiate alternative dispute resolution with the Slovak Trade Inspection (Slovenská obchodná inšpekcia, https://www.soi.sk) or with another dispute resolution body on the list of the Slovak Ministry of Economy. You can also turn to the consumer protection authority and the courts of your place of residence.",
        ],
      },
      {
        heading: "16. Contact",
        blocks: ["You can contact the operator with questions, comments or complaints at the following e-mail address: {operatorEmail}."],
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
              "There is no registration with a password. If you subscribe, we process your e-mail address and your subscription details.",
              "Payments are processed by Stripe; we do not see or store your card details.",
              "Images, text files and PDFs are processed by your browser; they never reach us.",
              "Word, Excel and PowerPoint files are on the server only for the duration of the conversion, and are deleted immediately afterwards.",
              "We do not use any analytics or advertising tracking code. We only use cookies for signing in and for payment.",
            ],
          },
        ],
      },
      {
        heading: "3. Subscription and payment",
        blocks: [
          "If you subscribe, the data you enter on the payment page is processed by Stripe; what we receive is the data needed to keep a record of your subscription.",
          {
            list: [
              "Data processed: e-mail address, the customer and subscription IDs assigned by Stripe, the status and periods of the subscription, the amount and date of payments, the type of payment method (for example card, and its last 4 digits), and – if the payment page asks for them – the billing country and postal code.",
              "Purpose: creating and fulfilling the subscription, collecting fees, verifying access, invoicing and customer service.",
              "Legal basis: performance of a contract (Article 6(1)(b) GDPR); for the retention of accounting records, a legal obligation (Article 6(1)(c) GDPR).",
              "Duration: for as long as the subscription exists; after cancellation, we keep the accounting records for 10 years under section 35 of the Slovak Accounting Act (Act No. 431/2002 Coll.). We delete the other data at your request after the subscription ends.",
            ],
          },
          "Payments are processed by Stripe Payments Europe, Ltd. (1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Ireland), which is an independent controller with regard to payment data and fraud prevention. You can find information about its data processing at https://stripe.com/privacy.",
        ],
      },
      {
        heading: "4. Sign-in with an e-mail code",
        blocks: [
          "On other devices, you can sign in with a single-use code sent to you by e-mail.",
          {
            list: [
              "Data processed: e-mail address, the encrypted (hashed) form of the sign-in code, its expiry time and the number of attempts.",
              "Purpose: signing in and protecting your account.",
              "Legal basis: performance of a contract (Article 6(1)(b) GDPR).",
              "Duration: the code is valid for 10 minutes, and we delete it immediately after use.",
            ],
          },
          "Sign-in e-mails are sent by Resend, Inc. (https://resend.com) as a data processor.",
        ],
      },
      {
        heading: "5. Converting Office files",
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
        heading: "6. Technical logs",
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
        heading: "7. Files processed in the browser",
        blocks: [
          "Images, text files and PDFs – including PDF passwords – are processed exclusively by your browser, on your own device. We have no access to this data, and we do not process it.",
          "While the payment page is open, your browser stores the finished file on your own device (IndexedDB) for up to 60 minutes, so that it is not lost after a payment method that redirects you to another page (such as PayPal). This does not reach us either. If Word, Excel or PowerPoint files were among your inputs, the original files are kept there too, so that the full version can be made after payment (the server then converts them again, as described above).",
        ],
      },
      {
        heading: "8. Cookies and local storage",
        blocks: [
          "We only use cookies that are necessary for the service to work; these do not require consent:",
          {
            list: [
              "pk_session: keeps you signed in (180 days);",
              "pk_signed_in: tells the site that you are signed in (180 days);",
              "pk_login: the sign-in code process (10 minutes);",
              "pk_lang: remembers the language you picked in the language switcher (1 year).",
            ],
          },
          "On the payment page, Stripe uses its own cookies to process the payment securely and to prevent fraud. We do not use analytics or advertising cookies. In your browser's local storage (localStorage) we only keep your chosen appearance (light or dark theme).",
        ],
      },
      {
        heading: "9. Data processors and data transfers",
        blocks: [
          "The site's hosting and the computing capacity needed to convert Office files are provided by the following data processor:",
          { details: "hosting" },
          "Sign-in e-mails are sent by Resend, Inc. Vercel Inc. and Resend, Inc. are headquartered in the United States of America, so data may also be transferred outside the European Union. Such transfers take place with appropriate safeguards (the EU–US Data Privacy Framework and the standard contractual clauses adopted by the European Commission).",
          "We do not share your data with any other third party, and we do not sell it.",
        ],
      },
      {
        heading: "10. Data security",
        blocks: [
          "All connections between the site and the server are encrypted (HTTPS). Sign-in cookies are signed and cannot be read by scripts. The service that converts Office files cannot be accessed directly from the internet; the files are not stored and are deleted immediately after processing.",
        ],
      },
      {
        heading: "11. Your rights",
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
          "You can send your request to {operatorEmail}; we will respond within one month at the latest. You can also change your e-mail address yourself on the [My account]({accountPath}) page, on Stripe's interface.",
        ],
      },
      {
        heading: "12. Remedies",
        blocks: [
          "If you feel that the processing of your personal data violates the law, you can lodge a complaint with the Slovak supervisory authority of the controller's registered office (Úrad na ochranu osobných údajov Slovenskej republiky; Hraničná 12, 820 07 Bratislava 27; website: https://dataprotection.gov.sk), or with the data protection authority of your place of residence or place of work – in Hungary, the Hungarian National Authority for Data Protection and Freedom of Information (Nemzeti Adatvédelmi és Információszabadság Hatóság, NAIH; 1055 Budapest, Falk Miksa utca 9–11.; postal address: 1363 Budapest, Pf. 9.; phone: +36 1 391 1400; e-mail: ugyfelszolgalat@naih.hu; website: https://naih.hu).",
          "If your rights are violated, you can also go to court; you may also bring the action before the courts of the member state of your place of residence or place of stay.",
        ],
      },
      {
        heading: "13. Changes to this notice",
        blocks: [
          "We update this notice whenever the service changes; the effective date is shown at the top of the document. The terms of use of the service are set out in the [Terms of Service]({termsPath}).",
        ],
      },
    ],
  },
};
