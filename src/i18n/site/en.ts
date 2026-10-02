import type { SiteDict } from "./hu";

export const en: SiteDict = {
  meta: {
    tagline: "Images, Office and text files to PDF",
    description:
      "Professional PDF converter: convert JPG, PNG, HEIC, WebP, TIFF and SVG images, Word, Excel and PowerPoint files, and TXT, CSV, Markdown and JSON files to PDF, merge PDFs and turn PDFs into images. Your images, texts and PDFs stay in your browser. {days}-day full access for {trial}.",
    keywords: [
      "PDF converter",
      "image to PDF",
      "JPG to PDF",
      "PNG to PDF",
      "HEIC to PDF",
      "Word to PDF",
      "Excel to PDF",
      "PowerPoint to PDF",
      "combine images into PDF",
      "PDF to JPG",
      "merge PDF",
    ],
    pdfToImageTitle: "PDF to image – JPG and PNG without uploading",
    pdfToImageDescription:
      "Convert PDF pages to JPG or PNG images at 72–600 DPI, even just the pages you select. Fast, and the PDF never leaves your computer.",
    termsTitle: "Terms of Service",
    termsDescription: "The terms of use of ConvertPDFNow.",
    privacyTitle: "Privacy Policy",
    privacyDescription: "What data ConvertPDFNow processes, why and for how long, and what rights you have.",
    accountTitle: "My account",
    accountDescription: "Sign in with an e-mail code and manage your subscription.",
    ogBadge: "no watermark · {days} days for {trial}",
    ogTitle: "Images and files into",
    ogAccent: "professional PDFs in seconds.",
  },

  converter: {
    badge: "Images and PDFs without uploading, right in your browser",
    title: "Images and files into",
    accent: "professional PDFs in seconds.",
    text: "Drop in your photos, scans, Word, Excel and PowerPoint files or PDFs, put them in order, and your PDF is ready in one click, with no watermark.",
    formatsLabel: "Supported formats",
    featuresEyebrow: "Features",
    featuresTitle: "Everything a professional converter needs",
    featuresText: "It works with a live preview, so you get exactly what you see on screen.",
    features: [
      {
        title: "Every image format",
        text: "JPG, PNG, iPhone HEIC, WebP, AVIF, multi-page TIFF, SVG and more. JPG and PNG images go into the PDF byte for byte, with no loss of quality.",
      },
      {
        title: "Always the right way up",
        text: "The built-in rotation data of phone photos is taken into account automatically, and you can rotate any image with a single click.",
      },
      {
        title: "Office and text files",
        text: "Word, Excel and PowerPoint files end up in the PDF exactly as they look in Office. TXT, Markdown, CSV and JSON files become neatly laid-out, searchable PDFs.",
      },
      {
        title: "Merge PDFs",
        text: "Combine existing PDFs – even password-protected ones – with your images into a single document, in any order you like.",
      },
      {
        title: "Flexible layout",
        text: "A4, A3, A5, Letter or a page that fits the image, adjustable margins, fill, and up to 9 images per page – with a live preview.",
      },
      {
        title: "Perfect or compact",
        text: "Keep the original quality, or compress your images to a size you can send by e-mail – even in black and white.",
      },
    ],
    stepsEyebrow: "How it works",
    stepsTitle: "Three steps and you're done",
    steps: [
      { title: "Drop in your files", text: "Images, Office and text files, PDFs – even mixed together. Ctrl+V pastes screenshots too." },
      { title: "Arrange and adjust", text: "Drag to change the order, rotate, and choose the page size, margins and quality." },
      { title: "Download your PDF", text: "A single merged PDF, or a separate PDF for each file in a ZIP, with no watermark. The first {days} days cost {trial}." },
    ],
    pricingEyebrow: "Price",
    pricingTitle: "One simple subscription",
    pricingText: "Converting and previewing are free of charge; you only need a subscription to download the finished files.",
    pricingTrial: "{days}-day full access",
    pricingThen: "then {monthly} per month until you cancel",
    pricingPoints: [
      "Unlimited conversions and downloads",
      "Every format: images, Office files, text, PDF",
      "No watermark, no password, no sign-up",
      "Cancel anytime, in one click",
    ],
    pricingCta: "Get started now",
    faq: [
      {
        q: "Are my files really not uploaded?",
        a: "Images, text files and PDFs are not: your browser converts them entirely on its own, and not a single byte of them reaches a server. You can check this yourself on the Network tab of your browser's developer tools. The exception is Word, Excel and PowerPoint files: converting them accurately requires an office application, so our server converts them to PDF and deletes them immediately after the conversion.",
      },
      {
        q: "How much does it cost?",
        a: "Converting and previewing are free of charge; you need a subscription to download the finished files. The first {days} days cost {trial}, then {monthly} per month until you cancel. You can cancel at any time on the My account page, in one click; you keep access until the end of the period you have already paid for.",
      },
      {
        q: "Do I need to sign up?",
        a: "No password is needed. You sign in with the e-mail address you enter when paying: on another device, use the Sign in button to request a 6-digit code by e-mail, and you can start using it right away.",
      },
      {
        q: "What files can I convert to PDF?",
        a: "Images (JPG, PNG, HEIC/HEIF, WebP, AVIF, GIF, BMP, TIFF – including multi-page ones –, SVG, ICO), Word documents (DOCX, DOC, ODT, RTF), Excel workbooks (XLSX, XLS, ODS), PowerPoint presentations (PPTX, PPT, PPSX, PPS, ODP), text files (TXT, Markdown, CSV/TSV, JSON, log files, source code) and existing PDFs. Every visible worksheet of an Excel workbook is included, with its own page setup.",
      },
      {
        q: "Does the image quality suffer?",
        a: "Not at “Original” quality: JPG and PNG images go into the PDF unchanged, and all other formats are converted losslessly or in very high quality. If you need a smaller file, choose compression.",
      },
      {
        q: "Does it work with iPhone HEIC photos?",
        a: "Yes. HEIC/HEIF images are converted in your browser, and their orientation stays correct. With the first HEIC file, loading the decoder may take a few seconds.",
      },
      {
        q: "How do I set the order?",
        a: "Drag the cards to where you want them with your mouse or finger, or sort them by name or size. With the keyboard: focus a card, press Space, then the arrow keys, and finally Space again.",
      },
      {
        q: "Is there a size or file count limit?",
        a: "There is no artificial limit; only your computer's memory sets the bounds. Hundreds of photos or PDFs with hundreds of pages can be processed without a problem. Word, Excel and PowerPoint files can be at most 4.4 MB each.",
      },
    ],
  },

  pdfToImage: {
    title: "PDF to image:",
    accent: "JPG or PNG in one click.",
    text: "A sharp image from every page, at 72–600 DPI, even just from the pages you select. The PDF never leaves your computer.",
    features: [
      { title: "Page selection", text: "Turn all pages or only the selected ones into images – by clicking, with Shift or by page numbers." },
      { title: "Print resolution", text: "From 72 to 600 DPI. The resolution is stored in the images as well, so they print at their real size." },
      { title: "Protected PDFs", text: "It works with permission-protected PDFs too, and for password-protected ones it asks for the password locally." },
      { title: "Fast and local", text: "Mozilla's pdf.js engine renders the pages directly in your browser – without uploading." },
    ],
    faq: [
      {
        q: "Should I choose JPG or PNG?",
        a: "For pages with photos and mixed content, JPG gives a smaller file. For text, diagrams and screenshots, PNG is sharper because it is lossless.",
      },
      {
        q: "What resolution do I need?",
        a: "For screens and websites, 72–150 DPI is enough. For printing, 300 DPI is recommended, and 600 DPI for pages with especially small print or fine detail.",
      },
      {
        q: "Is the PDF uploaded anywhere?",
        a: "No. Both displaying the pages and creating the images happen in your browser.",
      },
    ],
  },

  sections: {
    badge: "No uploads · 100% in your browser",
    trust: [
      "256-bit Encryption",
      "Files automatically deleted after 1 hour",
      "100% Private",
      "GDPR Compliant",
    ],
    privacyTitle: "Your files stay with you",
    privacyText:
      "ID cards, payslips, contracts, family photos: these shouldn't have to be uploaded to someone else's server. {site} converts images, text files and PDFs on your own device, so it is fast, and safe even when you work with confidential material. Only Word, Excel and PowerPoint files need the server: an office application converts them to PDF, and they are deleted immediately afterwards.",
    stats: [
      { value: "0 bytes", label: "uploaded for images and PDFs" },
      { value: "Instantly", label: "Office files are deleted from the server" },
      { value: "No", label: "watermark or password sign-up" },
      { value: "pdf.js", label: "Mozilla's rendering engine" },
    ],
    faqTitle: "Frequently asked questions",
    footerNote: "Everything runs in your browser, except Office files.",
    terms: "Terms",
    privacy: "Privacy",
    languages: "Languages",
  },

  legal: {
    effective: "Effective: {date}",
    operatorMissing: "[to be completed]",
    related: "Related document:",
  },

  server: {
    tooLarge: "The file can be at most {limit}.",
    noFile: "No file was received.",
    notOffice: "This is not a Word, Excel or PowerPoint file.",
    password: "The file is password protected. Open it, remove the password and try again.",
    failed: "The file could not be converted to PDF. It may be damaged or empty.",
    busy: "Lots of people are converting right now. Try again in a minute.",
    timeout: "Converting the file took too long.",
    unavailable: "The document conversion service is currently unavailable.",
    noEngine: "This server has no converter for this file (LibreOffice, Gotenberg or Microsoft {app}).",
    unexpected: "An unexpected error occurred during the conversion.",
    invalidEmail: "Enter a valid e-mail address.",
    rateLimited: "Too many attempts. Wait a few minutes and try again.",
    billingUnavailable: "The payment service is currently unavailable. Try again later.",
    checkoutFailed: "The payment could not be started. Try again.",
    alreadySubscribed: "This e-mail address already has an active subscription. Sign in with the code we send you by e-mail.",
    paymentIncomplete: "The payment was not completed.",
    notSignedIn: "You need to sign in to do this.",
    codeInvalid: "Wrong code. Check it and try again.",
    codeExpired: "The code has expired. Request a new one.",
    codeLocked: "Too many wrong attempts. Request a new code.",
    emailFailed: "The e-mail could not be sent. Try again later.",
  },

  email: {
    subject: "{code} – your sign-in code ({site})",
    intro: "Use this code to sign in to {site}:",
    validity: "The code is valid for {minutes} minutes.",
    ignore: "If you didn't request this, you can safely ignore this e-mail.",
  },
};
