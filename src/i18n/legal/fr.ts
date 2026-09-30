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
      "Le présent document définit les conditions d'utilisation du service en ligne {site} ({url}) et de l'abonnement. En utilisant le site ou en commandant l'abonnement, vous acceptez ces conditions ; si vous n'êtes pas d'accord avec elles, nous vous prions de ne pas utiliser le service.",
    sections: [
      {
        heading: "1. L'exploitant",
        blocks: ["Le service est fourni par l'exploitant suivant :", { details: "operator" }, "L'hébergeur :", { details: "hosting" }],
      },
      {
        heading: "2. Le service",
        blocks: [
          "{site} est un outil en ligne qui vous permet :",
          {
            list: [
              "de convertir en PDF des images, des fichiers texte ainsi que des fichiers Word, Excel et PowerPoint, et de fusionner des PDF ;",
              "de créer des images JPG ou PNG à partir de pages PDF.",
            ],
          },
          "Le chargement et la conversion des fichiers ainsi que l'aperçu du résultat sont gratuits. Un abonnement est nécessaire pour télécharger les fichiers créés (voir le point 3).",
          "Le traitement des images, des fichiers texte et des PDF a lieu dans votre navigateur, sur votre propre appareil ; ces fichiers ne sont pas envoyés au serveur. Afin d'assurer une conversion fidèle, les fichiers Word, Excel et PowerPoint sont convertis en PDF par le serveur (voir le point 9).",
        ],
      },
      {
        heading: "3. Abonnement et tarifs",
        blocks: [
          "L'abonnement commence par une période d'introduction de {days} jours, dont le prix est de {trial}. Pendant cette période, le service peut être utilisé pleinement, sans aucune restriction.",
          "Si vous ne résiliez pas l'abonnement avant la fin de la période d'introduction, il se transforme automatiquement, à partir du {next}e jour, en un abonnement mensuel au tarif de {monthly}, qui est renouvelé chaque mois jusqu'à sa résiliation. Le tarif mensuel est prélevé au début de chaque période sur le moyen de paiement indiqué lors de la commande.",
          "Le montant total à payer est clairement indiqué sur la page de paiement avant la commande. La commande est passée en appuyant sur le bouton entraînant une obligation de paiement (ou sur le bouton du moyen de paiement choisi).",
          "Avant la fin de la période d'introduction, nous vous envoyons un e-mail de rappel concernant le prochain prélèvement mensuel.",
          "Les abonnés sont informés par e-mail de toute modification des tarifs au moins 30 jours avant son entrée en vigueur ; si vous ne l'acceptez pas, vous pouvez résilier l'abonnement avant l'entrée en vigueur de la modification.",
        ],
      },
      {
        heading: "4. Paiement",
        blocks: [
          "Le paiement est traité par Stripe Payments Europe, Ltd. (Irlande). Moyens de paiement disponibles (selon l'appareil, le navigateur et le pays) : carte bancaire ou de crédit, Apple Pay, Google Pay, PayPal et Link. Nous ne voyons pas vos données de carte et ne les conservons pas.",
          "Stripe envoie un reçu par e-mail pour chaque paiement réussi. La facture prévue par la législation est émise par l'exploitant.",
          "Si un prélèvement mensuel échoue, Stripe le tente de nouveau dans les jours qui suivent ; en cas de nouvel échec, l'abonnement prend fin et l'accès au téléchargement cesse.",
        ],
      },
      {
        heading: "5. Résiliation",
        blocks: [
          "Vous pouvez résilier l'abonnement à tout moment, sans avoir à vous justifier, sur la page [Mon compte]({accountPath}) (connexion avec un code reçu par e-mail), en un clic, sur l'interface sécurisée de Stripe.",
          "La résiliation prend effet à la fin de la période en cours : jusque-là, vous conservez votre accès, et aucun nouveau prélèvement n'est effectué. En cas de résiliation pendant la période d'introduction, aucun tarif mensuel n'est prélevé à partir du {next}e jour.",
          "Le prix d'une période déjà commencée n'est pas remboursé, sauf en cas d'exercice du droit de rétractation et dans les cas prévus par la loi.",
        ],
      },
      {
        heading: "6. Droit de rétractation",
        blocks: [
          "Si vous commandez l'abonnement en tant que consommateur, vous pouvez vous rétracter du contrat sans avoir à motiver votre décision dans un délai de 14 jours à compter de la commande. Vous pouvez exprimer votre volonté de vous rétracter au moyen d'une déclaration dénuée d'ambiguïté adressée à l'exploitant (par exemple par e-mail : {operatorEmail}) ; vous pouvez également utiliser à cet effet le modèle de formulaire de rétractation figurant à l'annexe I, partie B, de la directive 2011/83/UE, mais ce n'est pas obligatoire.",
          "Comme vous demandez expressément, lors de la commande, que l'exécution du service commence immédiatement, vous devez, en cas de rétractation, payer un montant proportionnel à la période utilisée jusqu'à la rétractation. Le montant restant vous est remboursé dans un délai de 14 jours à compter de la communication de votre rétractation, sur le moyen de paiement utilisé lors du paiement.",
          "Le droit de rétractation n'affecte pas la possibilité de résilier l'abonnement à tout moment (voir le point 5).",
        ],
      },
      {
        heading: "7. Compte et connexion",
        blocks: [
          "Il n'y a pas d'inscription distincte avec mot de passe. Votre compte est lié à l'adresse e-mail indiquée lors du paiement : dans le navigateur avec lequel vous avez payé, vous êtes connecté automatiquement ; sur un autre appareil, vous pouvez vous connecter avec le code à 6 chiffres reçu par e-mail, valable 10 minutes.",
          "Ne communiquez votre code de connexion à personne. L'abonnement est destiné à un usage personnel ; le partage ou la revente de l'accès ne sont pas autorisés.",
        ],
      },
      {
        heading: "8. Conditions d'utilisation",
        blocks: [
          "Vous ne pouvez utiliser le service qu'à des fins licites et conformément aux présentes conditions. Il est notamment interdit :",
          {
            list: [
              "de traiter un fichier sur lequel vous ne détenez pas de droits ou qui porte atteinte aux droits d'autrui (par exemple à ses droits d'auteur, à ses droits de la personnalité ou à ses données personnelles) ;",
              "de produire ou de diffuser des contenus illicites au moyen du service ;",
              "d'utiliser le service de manière massive à l'aide d'outils automatisés, de le surcharger ou d'en entraver le fonctionnement de toute autre manière ;",
              "de contourner les dispositifs de sécurité ou de paiement du service, de pénétrer sans autorisation dans le système ou de téléverser du code malveillant.",
            ],
          },
          "Si les fichiers traités contiennent des données personnelles de tiers, vous êtes responsable de leur traitement licite.",
          "Afin de prévenir les abus, l'exploitant peut restreindre ou supprimer l'accès ; en cas de manquement contractuel grave, l'abonnement peut être résilié avec effet immédiat.",
        ],
      },
      {
        heading: "9. Traitement des fichiers Office",
        blocks: [
          "Pour la conversion des fichiers Word, Excel et PowerPoint, le fichier est envoyé au serveur via une connexion chiffrée (HTTPS). Le serveur l'utilise exclusivement pour créer le PDF, le supprime immédiatement une fois la conversion terminée et ne le conserve pas ; personne n'en consulte le contenu. Les autres fichiers ne quittent même pas votre appareil.",
          "La taille maximale d'un fichier Office pouvant être envoyé est de 4,4 MB. Le service ne convertit pas les documents protégés par mot de passe.",
          "Vous conservez les droits sur vos fichiers et sur les fichiers créés ; l'exploitant n'acquiert aucun droit sur ceux-ci.",
        ],
      },
      {
        heading: "10. Propriété intellectuelle",
        blocks: [
          "La conception du site, ses textes, ses éléments graphiques et son code source sont la propriété intellectuelle de l'exploitant ; ils ne peuvent être ni copiés ni diffusés sans l'autorisation écrite de l'exploitant.",
          "Le service utilise également des composants open source (par exemple pdf.js de Mozilla, pdf-lib, LibreOffice et Gotenberg), qui sont soumis à leurs propres conditions de licence.",
        ],
      },
      {
        heading: "11. Responsabilité",
        blocks: [
          "L'exploitant met tout en œuvre pour assurer une conversion fidèle et la disponibilité continue du service, mais ne garantit pas que le résultat soit exempt d'erreurs dans tous les cas, ni que le service soit accessible sans interruption et sans erreur.",
          "Vérifiez les fichiers créés avant de les utiliser, et conservez toujours une copie de vos fichiers originaux.",
          "Dans toute la mesure permise par la loi, l'exploitant n'est pas responsable des dommages indirects, des pertes de données ou des manques à gagner résultant de l'utilisation du service ou de l'impossibilité de l'utiliser. Cette limitation ne s'applique pas à la responsabilité pour les manquements contractuels commis intentionnellement ou par négligence grave, ni pour ceux portant atteinte à la vie, à l'intégrité physique ou à la santé, et elle n'affecte pas les droits que la loi reconnaît aux consommateurs.",
        ],
      },
      {
        heading: "12. Disponibilité et modifications",
        blocks: [
          "L'exploitant est en droit de développer et de modifier le service. Si le service est définitivement arrêté, nous mettons fin aux abonnements et remboursons au prorata le prix de la période non utilisée.",
        ],
      },
      {
        heading: "13. Protection des données",
        blocks: ["Le détail du traitement des données personnelles figure dans la [Politique de confidentialité]({privacyPath})."],
      },
      {
        heading: "14. Modification des conditions",
        blocks: [
          "L'exploitant est en droit de modifier les présentes conditions. La modification prend effet dès sa publication sur le site ; la date d'entrée en vigueur est indiquée en haut du document. Les abonnés sont informés par e-mail des modifications importantes qui leur sont défavorables au moins 30 jours à l'avance ; s'ils ne les acceptent pas, ils peuvent résilier l'abonnement avant leur entrée en vigueur.",
        ],
      },
      {
        heading: "15. Droit applicable et litiges",
        blocks: [
          "Le droit slovaque est applicable aux présentes conditions. Si vous utilisez le service en tant que consommateur, ce choix de loi ne vous prive pas de la protection que vous assurent les dispositions impératives de protection des consommateurs du pays de votre résidence.",
          "Nous nous efforçons de régler les litiges en priorité à l'amiable, par la concertation : vous pouvez adresser votre réclamation à l'adresse {operatorEmail}. Si nous rejetons votre réclamation ou si nous n'y répondons pas dans un délai de 30 jours, vous pouvez, en tant que consommateur, engager une procédure de règlement extrajudiciaire des litiges auprès de l'Inspection slovaque du commerce (Slovenská obchodná inšpekcia, https://www.soi.sk) ou d'un autre organisme de règlement des litiges figurant sur la liste du ministère slovaque de l'Économie. Vous pouvez également vous adresser à l'autorité de protection des consommateurs et au tribunal de votre lieu de résidence.",
        ],
      },
      {
        heading: "16. Contact",
        blocks: ["Pour toute question, remarque ou réclamation, vous pouvez contacter l'exploitant à l'adresse e-mail suivante : {operatorEmail}."],
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
              "Il n'y a pas d'inscription avec mot de passe. Si vous vous abonnez, nous traitons votre adresse e-mail et les données de votre abonnement.",
              "Le paiement est traité par Stripe ; nous ne voyons pas vos données de carte et ne les conservons pas.",
              "Les images, les fichiers texte et les PDF sont traités par votre navigateur et ne nous parviennent pas.",
              "Les fichiers Word, Excel et PowerPoint ne sont envoyés au serveur que le temps de la conversion, puis sont immédiatement supprimés.",
              "Nous n'utilisons aucun code de suivi analytique ou publicitaire. Nous n'utilisons des cookies que pour la connexion et le paiement.",
            ],
          },
        ],
      },
      {
        heading: "3. Abonnement et paiement",
        blocks: [
          "Si vous vous abonnez, les données saisies sur la page de paiement sont traitées par Stripe ; de notre côté, nous recevons les données nécessaires à la gestion de l'abonnement.",
          {
            list: [
              "Données traitées : adresse e-mail, identifiants client et d'abonnement attribués par Stripe, statut et périodes de l'abonnement, montant et date des paiements, type de moyen de paiement (par exemple carte, avec ses 4 derniers chiffres), ainsi que – si la page de paiement les demande – le pays et le code postal de facturation.",
              "Finalité : création et exécution de l'abonnement, encaissement des tarifs, vérification de l'accès, facturation et service client.",
              "Base juridique : l'exécution du contrat (article 6, paragraphe 1, point b) du RGPD) ; pour la conservation des pièces comptables, une obligation légale (article 6, paragraphe 1, point c) du RGPD).",
              "Durée : pendant toute la durée de l'abonnement ; après la résiliation, nous conservons les pièces comptables pendant 10 ans, conformément à l'article 35 de la loi slovaque sur la comptabilité (loi n° 431/2002). Les autres données sont supprimées à votre demande après la fin de l'abonnement.",
            ],
          },
          "Les paiements sont traités par Stripe Payments Europe, Ltd. (1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irlande), qui agit en tant que responsable du traitement indépendant pour les données de paiement et la prévention de la fraude. Pour en savoir plus sur ses traitements de données, consultez la page https://stripe.com/privacy.",
        ],
      },
      {
        heading: "4. Connexion par code envoyé par e-mail",
        blocks: [
          "Sur un autre appareil, vous pouvez vous connecter avec un code à usage unique envoyé par e-mail.",
          {
            list: [
              "Données traitées : adresse e-mail, forme chiffrée (hash) du code de connexion, sa date d'expiration et le nombre de tentatives.",
              "Finalité : la connexion et la protection du compte.",
              "Base juridique : l'exécution du contrat (article 6, paragraphe 1, point b) du RGPD).",
              "Durée : le code est valable 10 minutes ; il est supprimé immédiatement après utilisation.",
            ],
          },
          "Les e-mails de connexion sont envoyés par Resend, Inc. (https://resend.com), en qualité de sous-traitant.",
        ],
      },
      {
        heading: "5. Conversion des fichiers Office",
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
        heading: "6. Journaux techniques",
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
        heading: "7. Fichiers traités dans le navigateur",
        blocks: [
          "Les images, les fichiers texte et les PDF – y compris le mot de passe des PDF – sont traités exclusivement par votre navigateur, sur votre propre appareil. Nous n'avons pas accès à ces données et ne les traitons pas.",
          "Tant que la page de paiement est ouverte, votre navigateur conserve le fichier créé sur votre propre appareil (IndexedDB) pendant 60 minutes au maximum, afin qu'il ne soit pas perdu après un moyen de paiement qui redirige vers une autre page (par exemple PayPal). Ce fichier ne nous parvient pas non plus. Si des fichiers Word, Excel ou PowerPoint en faisaient partie, les fichiers d'origine y sont également conservés, afin que la version complète puisse être créée après le paiement (le serveur les convertit alors à nouveau, comme décrit ci-dessus).",
        ],
      },
      {
        heading: "8. Cookies et stockage local",
        blocks: [
          "Nous n'utilisons que les cookies nécessaires au fonctionnement du service ; ceux-ci ne requièrent pas de consentement :",
          {
            list: [
              "pk_session : maintien de l'état de connexion (180 jours) ;",
              "pk_signed_in : indique au site que vous êtes connecté (180 jours) ;",
              "pk_login : déroulement de la connexion par code (10 minutes) ;",
              "pk_lang : mémorise la langue choisie dans le sélecteur de langue (1 an).",
            ],
          },
          "Sur la page de paiement, Stripe utilise ses propres cookies pour assurer la sécurité du paiement et prévenir la fraude. Nous n'utilisons aucun cookie analytique ou publicitaire. Dans le stockage local du navigateur (localStorage), nous conservons uniquement l'apparence choisie (thème clair ou sombre).",
        ],
      },
      {
        heading: "9. Sous-traitants et transfert de données",
        blocks: [
          "L'hébergement du site et la capacité de calcul nécessaire à la conversion des fichiers Office sont fournis par le sous-traitant suivant :",
          { details: "hosting" },
          "Les e-mails de connexion sont envoyés par Resend, Inc. Les sièges de Vercel Inc. et de Resend, Inc. se trouvent aux États-Unis d'Amérique ; les données peuvent donc également être transférées en dehors de l'Union européenne. Ce transfert s'effectue moyennant des garanties appropriées (cadre de protection des données UE–États-Unis, ainsi que les clauses types de protection des données adoptées par la Commission européenne).",
          "Nous ne transmettons vos données à aucun autre tiers et ne les vendons pas.",
        ],
      },
      {
        heading: "10. Sécurité des données",
        blocks: [
          "Toutes les connexions entre le site et le serveur sont chiffrées (HTTPS). Les cookies de connexion sont signés et ne peuvent pas être lus par des scripts. Le service qui convertit les fichiers Office n'est pas directement accessible depuis Internet ; les fichiers ne sont pas conservés et sont supprimés immédiatement après le traitement.",
        ],
      },
      {
        heading: "11. Vos droits",
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
          "Vous pouvez envoyer votre demande à l'adresse {operatorEmail} ; nous y répondrons dans un délai d'un mois au maximum. Vous pouvez également modifier vous-même votre adresse e-mail sur la page [Mon compte]({accountPath}), dans l'interface de Stripe.",
        ],
      },
      {
        heading: "12. Voies de recours",
        blocks: [
          "Si vous estimez que le traitement de vos données personnelles enfreint la législation, vous pouvez introduire une réclamation auprès de l'autorité de contrôle slovaque, compétente pour le siège du responsable du traitement (Úrad na ochranu osobných údajov Slovenskej republiky ; Hraničná 12, 820 07 Bratislava 27 ; site web : https://dataprotection.gov.sk), ou auprès de l'autorité de protection des données de votre lieu de résidence ou de travail – en Hongrie, la Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH ; 1055 Budapest, Falk Miksa utca 9–11. ; adresse postale : 1363 Budapest, Pf. 9. ; téléphone : +36 1 391 1400 ; e-mail : ugyfelszolgalat@naih.hu ; site web : https://naih.hu).",
          "En cas de violation de vos droits, vous pouvez également saisir la justice ; vous pouvez aussi intenter l'action devant les juridictions de l'État membre de votre domicile ou de votre lieu de résidence.",
        ],
      },
      {
        heading: "13. Modification de la présente politique",
        blocks: [
          "Nous mettons à jour la présente politique lorsque le service évolue ; la date d'entrée en vigueur est indiquée en haut du document. Les conditions d'utilisation du service figurent dans les [Conditions générales d'utilisation]({termsPath}).",
        ],
      },
    ],
  },
};
