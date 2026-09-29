import type { SiteDict } from "./hu";

export const fr: SiteDict = {
  meta: {
    tagline: "Images, fichiers Office et texte en PDF",
    description:
      "Convertisseur PDF gratuit et professionnel : convertissez en PDF des images JPG, PNG, HEIC, WebP, TIFF et SVG, des fichiers Word, Excel et PowerPoint ainsi que des fichiers TXT, CSV, Markdown et JSON, fusionnez des PDF et transformez des PDF en images. Les images, les textes et les PDF restent dans votre navigateur.",
    keywords: [
      "convertisseur PDF",
      "image en PDF",
      "JPG en PDF",
      "PNG en PDF",
      "HEIC en PDF",
      "Word en PDF",
      "Excel en PDF",
      "PowerPoint en PDF",
      "fusionner des images en PDF",
      "PDF en JPG",
      "fusionner des PDF",
    ],
    pdfToImageTitle: "PDF en image – JPG et PNG sans envoi de fichier",
    pdfToImageDescription:
      "Convertissez les pages d'un PDF en images JPG ou PNG, de 72 à 600 DPI, y compris pour les seules pages sélectionnées. Gratuit, rapide, et le PDF reste sur votre ordinateur du début à la fin.",
    termsTitle: "Conditions générales d'utilisation",
    termsDescription: "Les conditions d'utilisation de PDF Konvertáló.",
    privacyTitle: "Politique de confidentialité",
    privacyDescription: "Quelles données PDF Konvertáló traite, dans quel but, pendant combien de temps, et quels sont vos droits.",
    ogBadge: "sans inscription ni filigrane",
    ogTitle: "De vos images et fichiers",
    ogAccent: "un PDF pro en un instant.",
  },

  converter: {
    badge: "Images et PDF sans envoi de fichier, dans votre navigateur",
    title: "De vos images et fichiers",
    accent: "un PDF pro en un instant.",
    text: "Déposez vos photos, numérisations, fichiers Word, Excel et PowerPoint ou vos PDF, classez-les, et votre PDF est prêt en un clic. Sans inscription, sans filigrane.",
    formatsLabel: "Formats pris en charge",
    featuresEyebrow: "Fonctionnalités",
    featuresTitle: "Tout ce qu'il faut à un convertisseur professionnel",
    featuresText: "Grâce à l'aperçu en direct, vous obtenez exactement ce que vous voyez à l'écran.",
    features: [
      {
        title: "Tous les formats d'image",
        text: "JPG, PNG, HEIC de l'iPhone, WebP, AVIF, TIFF multipage, SVG et bien d'autres. Les images JPG et PNG sont intégrées au PDF à l'octet près, sans perte de qualité.",
      },
      {
        title: "Toujours la bonne orientation",
        text: "Les données de rotation intégrées aux photos prises avec un téléphone sont prises en compte automatiquement, et vous pouvez faire pivoter n'importe quelle image d'un simple clic.",
      },
      {
        title: "Fichiers Office et texte",
        text: "Les fichiers Word, Excel et PowerPoint sont convertis en PDF exactement tels qu'ils apparaissent dans Office. Les fichiers TXT, Markdown, CSV et JSON deviennent des PDF mis en page, dans lesquels vous pouvez rechercher du texte.",
      },
      {
        title: "Fusion de PDF",
        text: "Fusionnez des PDF existants – même protégés par mot de passe – avec vos images en un seul document, dans l'ordre de votre choix.",
      },
      {
        title: "Mise en page flexible",
        text: "A4, A3, A5, Letter ou page adaptée à l'image, marge réglable, remplissage, et jusqu'à 9 images par page – avec aperçu en direct.",
      },
      {
        title: "Parfait ou léger",
        text: "Conservez la qualité d'origine, ou compressez les images à une taille adaptée à l'envoi par e-mail, même en noir et blanc.",
      },
    ],
    stepsEyebrow: "Comment ça marche",
    stepsTitle: "Trois étapes, c'est tout",
    steps: [
      { title: "Déposez vos fichiers", text: "Images, fichiers Office et texte, PDF – même mélangés. Ctrl+V colle aussi une capture d'écran." },
      { title: "Classez et réglez", text: "Faites glisser les fichiers pour modifier l'ordre, faites-les pivoter, et choisissez le format de page, la marge et la qualité." },
      { title: "Téléchargez le PDF", text: "Un seul PDF fusionné ou un PDF par fichier dans un ZIP – sans filigrane ni inscription." },
    ],
    faq: [
      {
        q: "Mes fichiers ne sont-ils vraiment pas envoyés sur un serveur ?",
        a: "Les images, les fichiers texte et les PDF, non : ils sont entièrement convertis par votre navigateur, et pas un seul octet n'est envoyé à un serveur. Vous pouvez le vérifier vous-même dans l'onglet Réseau des outils de développement de votre navigateur. Les fichiers Word, Excel et PowerPoint font exception : leur conversion fidèle nécessite un logiciel de bureautique, c'est pourquoi notre serveur les convertit en PDF, puis les supprime immédiatement après la conversion.",
      },
      {
        q: "Quels fichiers puis-je convertir en PDF ?",
        a: "Des images (JPG, PNG, HEIC/HEIF, WebP, AVIF, GIF, BMP, TIFF – y compris multipage –, SVG, ICO), des documents Word (DOCX, DOC, ODT, RTF), des classeurs Excel (XLSX, XLS, ODS), des présentations PowerPoint (PPTX, PPT, PPSX, PPS, ODP), des fichiers texte (TXT, Markdown, CSV/TSV, JSON, fichiers journaux, code source) et des PDF existants. Toutes les feuilles visibles d'un classeur Excel sont incluses, avec leur propre mise en page.",
      },
      {
        q: "La qualité des images se dégrade-t-elle ?",
        a: "Pas en qualité « Originale » : les images JPG et PNG sont intégrées au PDF sans aucune modification, et les autres formats sont convertis sans perte ou en très haute qualité. Si vous avez besoin d'un fichier plus léger, choisissez une compression.",
      },
      {
        q: "Est-ce que cela fonctionne avec les photos HEIC de l'iPhone ?",
        a: "Oui. Les images HEIC/HEIF sont converties dans votre navigateur, et leur orientation reste correcte. Pour le premier fichier HEIC, le chargement du décodeur peut prendre quelques secondes.",
      },
      {
        q: "Comment modifier l'ordre ?",
        a: "Faites glisser les cartes à la souris ou du doigt jusqu'à l'emplacement voulu, ou triez-les par nom ou par taille. Au clavier : placez le focus sur une carte, appuyez sur Espace, utilisez les flèches, puis appuyez de nouveau sur Espace.",
      },
      {
        q: "Y a-t-il une limite de taille ou de nombre de fichiers ?",
        a: "Il n'y a aucune limite artificielle : seule la mémoire de votre ordinateur en fixe une. Des centaines de photos ou des PDF de plusieurs centaines de pages sont traités sans problème. Les fichiers Word, Excel et PowerPoint peuvent peser au maximum 4,4 MB chacun.",
      },
    ],
  },

  pdfToImage: {
    title: "PDF en image :",
    accent: "JPG ou PNG, en un clic.",
    text: "Une image nette pour chaque page, de 72 à 600 DPI, y compris pour les seules pages sélectionnées. Le PDF reste sur votre ordinateur du début à la fin.",
    features: [
      { title: "Sélection des pages", text: "Convertissez en images toutes les pages ou seulement celles sélectionnées – par clic, avec Shift ou par numéros de page." },
      { title: "Résolution d'impression", text: "De 72 à 600 DPI. La résolution est enregistrée dans les images : elles s'impriment ainsi à leur taille réelle." },
      { title: "PDF protégés", text: "Fonctionne aussi avec les PDF protégés par des restrictions d'autorisations ; pour les PDF protégés par mot de passe, celui-ci est demandé localement." },
      { title: "Rapide et local", text: "Le moteur pdf.js de Mozilla affiche les pages directement dans votre navigateur – sans envoi de fichier." },
    ],
    faq: [
      {
        q: "JPG ou PNG : que choisir ?",
        a: "Pour les pages contenant des photos ou un contenu mixte, le JPG donne un fichier plus léger. Pour le texte, les schémas et les captures d'écran, le PNG est plus net, car il est sans perte.",
      },
      {
        q: "Quelle résolution faut-il ?",
        a: "Pour l'écran et le web, 72 à 150 DPI suffisent. Pour l'impression, 300 DPI sont recommandés, et 600 DPI pour les pages à petits caractères ou très détaillées.",
      },
      {
        q: "Le PDF est-il envoyé quelque part ?",
        a: "Non. L'affichage des pages comme la création des images ont lieu dans votre navigateur.",
      },
    ],
  },

  sections: {
    badge: "Sans envoi de fichier · 100 % dans votre navigateur",
    privacyTitle: "Vos fichiers restent chez vous",
    privacyText:
      "Carte d'identité, fiche de paie, contrat, photos de famille : ces documents n'ont rien à faire sur des serveurs inconnus. {site} convertit les images, les fichiers texte et les PDF sur votre propre appareil ; il est donc rapide, et sûr même lorsque vous travaillez sur des documents confidentiels. Seuls les fichiers Word, Excel et PowerPoint nécessitent le serveur : un logiciel de bureautique les convertit en PDF, puis ils sont immédiatement supprimés.",
    stats: [
      { value: "0 octet", label: "envoyé pour les images et les PDF" },
      { value: "Immédiate", label: "suppression des fichiers Office du serveur" },
      { value: "Sans", label: "inscription ni filigrane" },
      { value: "pdf.js", label: "le moteur de rendu de Mozilla" },
    ],
    faqTitle: "Questions fréquentes",
    footerNote: "À l'exception des fichiers Office, tout s'exécute dans votre navigateur.",
    terms: "CGU",
    privacy: "Confidentialité",
    languages: "Langues",
  },

  legal: {
    effective: "Date d'entrée en vigueur : {date}",
    operatorMissing: "[à compléter]",
    related: "Document associé :",
  },

  server: {
    tooLarge: "Le fichier ne doit pas dépasser {limit}.",
    noFile: "Aucun fichier reçu.",
    notOffice: "Ce n'est pas un fichier Word, Excel ou PowerPoint.",
    password: "Le fichier est protégé par mot de passe. Ouvrez-le, supprimez le mot de passe, puis réessayez.",
    failed: "Impossible de convertir le fichier en PDF. Il est peut-être endommagé ou vide.",
    busy: "De nombreuses conversions sont en cours en ce moment. Réessayez dans une minute.",
    timeout: "La conversion du fichier a pris trop de temps.",
    unavailable: "Le service de conversion de documents est actuellement indisponible.",
    noEngine: "Aucun convertisseur n'est disponible sur ce serveur pour ce fichier (LibreOffice, Gotenberg ou Microsoft {app}).",
    unexpected: "Une erreur inattendue s'est produite pendant la conversion.",
  },
};
