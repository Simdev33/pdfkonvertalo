import type { LegalDocs } from "./types";

export const fr: LegalDocs = {
  labels: {
    name: "Nom",
    address: "Adresse",
    email: "E-mail",
    registration: "Numéro d'immatriculation",
    taxNumber: "Numéro fiscal",
    web: "Site web",
  },

  terms: {
    title: "Conditions générales d'utilisation",
    intro:
      "Le présent document définit les conditions d'utilisation du service en ligne {site} ({url}). En utilisant le site, vous acceptez ces conditions ; si vous n'êtes pas d'accord avec elles, nous vous prions de ne pas utiliser le service.",
    sections: [
      {
        heading: "1. L'exploitant",
        blocks: ["Le service est fourni par l'exploitant suivant :", { details: "operator" }, "L'hébergeur :", { details: "hosting" }],
      },
      {
        heading: "2. Le service",
        blocks: [
          "{site} est un outil en ligne gratuit, utilisable sans inscription, qui vous permet :",
          {
            list: [
              "de convertir en PDF des images, des fichiers texte ainsi que des fichiers Word, Excel et PowerPoint, et de fusionner des PDF ;",
              "de créer des images JPG ou PNG à partir de pages PDF.",
            ],
          },
          "Le traitement des images, des fichiers texte et des PDF a lieu dans votre navigateur, sur votre propre appareil ; ces fichiers ne sont pas envoyés au serveur. Afin d'assurer une conversion fidèle, les fichiers Word, Excel et PowerPoint sont convertis en PDF par le serveur (voir le point 4).",
          "L'utilisation du service est gratuite.",
        ],
      },
      {
        heading: "3. Conditions d'utilisation",
        blocks: [
          "Vous ne pouvez utiliser le service qu'à des fins licites et conformément aux présentes conditions. Il est notamment interdit :",
          {
            list: [
              "de traiter un fichier sur lequel vous ne détenez pas de droits ou qui porte atteinte aux droits d'autrui (par exemple à ses droits d'auteur, à ses droits de la personnalité ou à ses données personnelles) ;",
              "de produire ou de diffuser des contenus illicites au moyen du service ;",
              "d'utiliser le service de manière massive à l'aide d'outils automatisés, de le surcharger ou d'en entraver le fonctionnement de toute autre manière ;",
              "de contourner les dispositifs de sécurité du service, de pénétrer sans autorisation dans le système ou de téléverser du code malveillant.",
            ],
          },
          "Si les fichiers traités contiennent des données personnelles de tiers, vous êtes responsable de leur traitement licite.",
          "Afin de prévenir les abus, l'exploitant peut restreindre ou refuser l'accès au service.",
        ],
      },
      {
        heading: "4. Traitement des fichiers Office",
        blocks: [
          "Pour la conversion des fichiers Word, Excel et PowerPoint, le fichier est envoyé au serveur via une connexion chiffrée (HTTPS). Le serveur l'utilise exclusivement pour créer le PDF, le supprime immédiatement une fois la conversion terminée et ne le conserve pas ; personne n'en consulte le contenu. Les autres fichiers ne quittent même pas votre appareil.",
          "La taille maximale d'un fichier Office pouvant être envoyé est de 4,4 MB. Le service ne convertit pas les documents protégés par mot de passe.",
          "Vous conservez les droits sur vos fichiers et sur les PDF créés ; l'exploitant n'acquiert aucun droit sur ceux-ci.",
        ],
      },
      {
        heading: "5. Propriété intellectuelle",
        blocks: [
          "La conception du site, ses textes, ses éléments graphiques et son code source sont la propriété intellectuelle de l'exploitant ; ils ne peuvent être ni copiés ni diffusés sans l'autorisation écrite de l'exploitant.",
          "Le service utilise également des composants open source (par exemple pdf.js de Mozilla, pdf-lib, LibreOffice et Gotenberg), qui sont soumis à leurs propres conditions de licence.",
        ],
      },
      {
        heading: "6. Responsabilité",
        blocks: [
          "Le service est fourni gratuitement, « en l'état ». L'exploitant met tout en œuvre pour assurer une conversion fidèle, mais ne garantit pas que le résultat soit exempt d'erreurs dans tous les cas, ni que le service soit accessible sans interruption et sans erreur.",
          "Vérifiez les fichiers créés avant de les utiliser, et conservez toujours une copie de vos fichiers originaux.",
          "Dans toute la mesure permise par la loi, l'exploitant n'est pas responsable des dommages directs ou indirects, des pertes de données ou des manques à gagner résultant de l'utilisation du service ou de l'impossibilité de l'utiliser. Cette limitation ne s'applique pas à la responsabilité pour les manquements contractuels commis intentionnellement ou par négligence grave, ni pour ceux portant atteinte à la vie, à l'intégrité physique ou à la santé.",
        ],
      },
      {
        heading: "7. Disponibilité et modifications",
        blocks: [
          "L'exploitant est en droit de modifier, d'étendre, de suspendre ou d'arrêter le service à tout moment, y compris sans préavis.",
        ],
      },
      {
        heading: "8. Protection des données",
        blocks: ["Le détail du traitement des données personnelles figure dans la [Politique de confidentialité]({privacyPath})."],
      },
      {
        heading: "9. Modification des conditions",
        blocks: [
          "L'exploitant est en droit de modifier unilatéralement les présentes conditions. La modification prend effet dès sa publication sur le site ; la date d'entrée en vigueur est indiquée en haut du document. En continuant à utiliser le service, vous acceptez les conditions modifiées.",
        ],
      },
      {
        heading: "10. Droit applicable et litiges",
        blocks: [
          "Le droit hongrois est applicable aux présentes conditions. Si vous utilisez le service en tant que consommateur, ce choix de loi ne vous prive pas de la protection que vous assurent les dispositions impératives de protection des consommateurs du pays de votre résidence.",
          "Nous nous efforçons de régler les litiges en priorité à l'amiable, par la concertation.",
        ],
      },
      {
        heading: "11. Contact",
        blocks: ["Pour toute question ou remarque, vous pouvez contacter l'exploitant à l'adresse e-mail suivante : {operatorEmail}."],
      },
    ],
  },

  privacy: {
    title: "Politique de confidentialité",
    intro:
      "Conformément au règlement (UE) 2016/679 du Parlement européen et du Conseil (règlement général sur la protection des données, RGPD), la présente politique explique quelles données personnelles nous traitons lors de l'utilisation de {site} ({url}), dans quel but, sur quelle base juridique et pendant combien de temps, ainsi que les droits dont vous disposez.",
    sections: [
      {
        heading: "1. Le responsable du traitement",
        blocks: [{ details: "operator" }],
      },
      {
        heading: "2. En bref",
        blocks: [
          {
            list: [
              "Aucune inscription : nous ne demandons ni nom, ni adresse e-mail, ni aucune autre donnée d'identification.",
              "Les images, les fichiers texte et les PDF sont traités par votre navigateur et ne nous parviennent pas.",
              "Les fichiers Word, Excel et PowerPoint ne sont envoyés au serveur que le temps de la conversion, puis sont immédiatement supprimés.",
              "Nous n'utilisons ni cookies, ni code de suivi analytique ou publicitaire.",
            ],
          },
        ],
      },
      {
        heading: "3. Conversion des fichiers Office",
        blocks: [
          "Si vous ajoutez un fichier Word, Excel ou PowerPoint, celui-ci est envoyé via une connexion chiffrée (HTTPS) au serveur, où un logiciel de bureautique le convertit en PDF ; le PDF est ensuite renvoyé à votre navigateur.",
          {
            list: [
              "Données traitées : le nom et le contenu du fichier, y compris les éventuelles données personnelles figurant dans le document.",
              "Finalité : effectuer la conversion que vous avez demandée.",
              "Base juridique : la fourniture du service à votre demande (article 6, paragraphe 1, point b) du RGPD).",
              "Durée : uniquement le temps de la conversion, généralement quelques secondes. Le fichier et le PDF sont ensuite immédiatement supprimés ; nous ne les conservons pas, et personne n'en consulte le contenu.",
            ],
          },
        ],
      },
      {
        heading: "4. Journaux techniques",
        blocks: [
          "Lors de la diffusion du site – comme pour tout site web – les serveurs de l'hébergeur enregistrent des données techniques.",
          {
            list: [
              "Données traitées : adresse IP, date et heure de la requête, adresse de la page demandée, type et version du navigateur.",
              "Finalité : assurer le fonctionnement sûr et sans perturbation du service, détecter les erreurs et les abus.",
              "Base juridique : l'intérêt légitime de l'exploitant (article 6, paragraphe 1, point f) du RGPD).",
              "Durée : une courte période, selon les règles de conservation des données de l'hébergeur.",
            ],
          },
        ],
      },
      {
        heading: "5. Fichiers traités dans le navigateur",
        blocks: [
          "Les images, les fichiers texte et les PDF – y compris le mot de passe des PDF – sont traités exclusivement par votre navigateur, sur votre propre appareil. Nous n'avons pas accès à ces données et ne les traitons pas.",
        ],
      },
      {
        heading: "6. Cookies et stockage local",
        blocks: [
          "Le site n'utilise pas de cookies, ni de code de suivi analytique ou publicitaire. Dans le stockage local du navigateur (localStorage), nous conservons uniquement l'apparence choisie (thème clair ou sombre) ; cette information ne nous parvient pas, et vous pouvez la supprimer à tout moment dans les paramètres de votre navigateur.",
        ],
      },
      {
        heading: "7. Sous-traitant et transfert de données",
        blocks: [
          "L'hébergement du site et la capacité de calcul nécessaire à la conversion des fichiers Office sont fournis par le sous-traitant suivant :",
          { details: "hosting" },
          "Le siège de Vercel Inc. se trouve aux États-Unis d'Amérique ; les données peuvent donc également être transférées en dehors de l'Union européenne. Ce transfert s'effectue moyennant des garanties appropriées (cadre de protection des données UE–États-Unis, ainsi que les clauses types de protection des données adoptées par la Commission européenne).",
          "Nous ne transmettons vos données à aucun autre tiers et ne les vendons pas.",
        ],
      },
      {
        heading: "8. Sécurité des données",
        blocks: [
          "Toutes les connexions entre le site et le serveur sont chiffrées (HTTPS). Le service qui convertit les fichiers Office n'est pas directement accessible depuis Internet ; les fichiers ne sont pas conservés et sont supprimés immédiatement après le traitement.",
        ],
      },
      {
        heading: "9. Vos droits",
        blocks: [
          "En vertu du RGPD, vous disposez des droits suivants :",
          {
            list: [
              "droit à l'information et droit d'accès (article 15) ;",
              "droit de rectification (article 16) ;",
              "droit à l'effacement (article 17) ;",
              "droit à la limitation du traitement (article 18) ;",
              "droit à la portabilité des données (article 20) ;",
              "droit d'opposition au traitement fondé sur l'intérêt légitime (article 21).",
            ],
          },
          "Comme il n'y a pas d'inscription et que les fichiers Office sont immédiatement supprimés, nous ne disposons dans la plupart des cas d'aucune donnée permettant de vous identifier. Vous pouvez envoyer votre demande à l'adresse {operatorEmail} ; nous y répondrons dans un délai d'un mois au maximum.",
        ],
      },
      {
        heading: "10. Voies de recours",
        blocks: [
          "Si vous estimez que le traitement de vos données personnelles enfreint la législation, vous pouvez introduire une réclamation auprès de l'autorité hongroise de protection des données (Nemzeti Adatvédelmi és Információszabadság Hatóság, NAIH ; 1055 Budapest, Falk Miksa utca 9–11 ; adresse postale : 1363 Budapest, Pf. 9. ; téléphone : +36 1 391 1400 ; e-mail : ugyfelszolgalat@naih.hu ; site web : https://naih.hu), ou auprès de l'autorité de protection des données de votre lieu de résidence.",
          "En cas de violation de vos droits, vous pouvez également saisir la justice ; vous pouvez aussi intenter l'action devant le tribunal compétent de votre domicile ou de votre lieu de résidence.",
        ],
      },
      {
        heading: "11. Modification de la présente politique",
        blocks: [
          "Nous mettons à jour la présente politique lorsque le service évolue ; la date d'entrée en vigueur est indiquée en haut du document. Les conditions d'utilisation du service figurent dans les [Conditions générales d'utilisation]({termsPath}).",
        ],
      },
    ],
  },
};
