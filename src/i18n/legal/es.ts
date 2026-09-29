import type { LegalDocs } from "./types";

export const es: LegalDocs = {
  labels: {
    name: "Nombre",
    address: "Dirección",
    email: "Correo electrónico",
    registration: "Número de registro",
    taxNumber: "Número de identificación fiscal",
    web: "Sitio web",
  },

  terms: {
    title: "Términos y condiciones",
    intro:
      "Este documento recoge las condiciones de uso del servicio web {site} ({url}). Al usar el sitio, aceptas estas condiciones; si no estás de acuerdo con ellas, te rogamos que no utilices el servicio.",
    sections: [
      {
        heading: "1. El operador",
        blocks: ["El servicio lo presta el siguiente operador:", { details: "operator" }, "El proveedor de alojamiento:", { details: "hosting" }],
      },
      {
        heading: "2. El servicio",
        blocks: [
          "{site} es una herramienta en línea gratuita que se puede usar sin registro y con la que puedes:",
          {
            list: [
              "convertir a PDF imágenes, archivos de texto y archivos de Word, Excel y PowerPoint, así como unir archivos PDF;",
              "crear imágenes JPG o PNG a partir de páginas de PDF.",
            ],
          },
          "Las imágenes, los archivos de texto y los PDF se procesan en tu navegador, en tu propio dispositivo; estos archivos no llegan al servidor. Para que la conversión sea precisa, los archivos de Word, Excel y PowerPoint los convierte a PDF el servidor (véase el apartado 4).",
          "El uso del servicio es gratuito.",
        ],
      },
      {
        heading: "3. Condiciones de uso",
        blocks: [
          "Solo puedes utilizar el servicio con fines lícitos y conforme a las presentes condiciones. En particular, está prohibido:",
          {
            list: [
              "procesar archivos sobre los que no tengas derechos o que vulneren derechos de terceros (por ejemplo, sus derechos de autor, sus derechos de la personalidad o sus datos personales);",
              "generar o difundir contenido ilícito por medio del servicio;",
              "utilizar el servicio de forma masiva mediante herramientas automatizadas, sobrecargarlo u obstaculizar su funcionamiento de cualquier otro modo;",
              "eludir las medidas de seguridad del servicio, acceder sin autorización al sistema o subir código malicioso.",
            ],
          },
          "Si los archivos procesados contienen datos personales de otras personas, tú eres responsable de que su tratamiento sea lícito.",
          "Para impedir abusos, el operador puede restringir o denegar el acceso al servicio.",
        ],
      },
      {
        heading: "4. Procesamiento de los archivos de Office",
        blocks: [
          "Para convertir archivos de Word, Excel y PowerPoint, el archivo se envía al servidor a través de una conexión cifrada (HTTPS). El servidor lo utiliza exclusivamente para crear el PDF, lo elimina inmediatamente una vez finalizada la conversión, no lo almacena y nadie examina su contenido. Los demás archivos ni siquiera salen de tu dispositivo.",
          "El tamaño máximo de los archivos de Office que se pueden subir es de 4,4 MB. El servicio no convierte documentos protegidos con contraseña.",
          "Los derechos sobre tus archivos y sobre los PDF generados siguen siendo tuyos; el operador no adquiere ningún derecho sobre ellos.",
        ],
      },
      {
        heading: "5. Propiedad intelectual",
        blocks: [
          "El diseño, los textos, los elementos gráficos y el código fuente del sitio son propiedad intelectual del operador; no pueden copiarse ni distribuirse sin su autorización por escrito.",
          "El servicio también utiliza componentes de código abierto (por ejemplo, pdf.js de Mozilla, pdf-lib, LibreOffice y Gotenberg), que se rigen por sus propias condiciones de licencia.",
        ],
      },
      {
        heading: "6. Responsabilidad",
        blocks: [
          "El servicio se presta de forma gratuita, «tal cual». El operador hace todo lo posible para que la conversión sea precisa, pero no garantiza que el resultado sea impecable en todos los casos ni que el servicio esté disponible de forma ininterrumpida y sin errores.",
          "Comprueba los archivos generados antes de utilizarlos y guarda siempre una copia de tus archivos originales.",
          "En la máxima medida permitida por la ley, el operador no responde de los daños directos o indirectos, la pérdida de datos o el lucro cesante derivados del uso del servicio o de la imposibilidad de utilizarlo. Esta limitación no se aplica a la responsabilidad por incumplimientos contractuales cometidos de forma dolosa o por negligencia grave, ni por los que causen daños a la vida, la integridad física o la salud.",
        ],
      },
      {
        heading: "7. Disponibilidad y cambios",
        blocks: [
          "El operador tiene derecho a modificar, ampliar, suspender o dar por terminado el servicio en cualquier momento, incluso sin previo aviso.",
        ],
      },
      {
        heading: "8. Protección de datos",
        blocks: ["Los detalles sobre el tratamiento de los datos personales figuran en la [Política de privacidad]({privacyPath})."],
      },
      {
        heading: "9. Modificación de las condiciones",
        blocks: [
          "El operador tiene derecho a modificar unilateralmente las presentes condiciones. Las modificaciones entran en vigor con su publicación en el sitio; la fecha de entrada en vigor se indica en la parte superior del documento. Si sigues utilizando el servicio, aceptas las condiciones modificadas.",
        ],
      },
      {
        heading: "10. Legislación aplicable y litigios",
        blocks: [
          "A las presentes condiciones se aplica la legislación húngara. Si utilizas el servicio como consumidor, esta elección de ley no te priva de la protección que te otorgan las normas imperativas de protección de los consumidores del país en el que resides.",
          "Procuraremos resolver las controversias, en primer lugar, de forma amistosa, mediante la negociación.",
        ],
      },
      {
        heading: "11. Contacto",
        blocks: ["Puedes dirigir tus preguntas y comentarios al operador en la siguiente dirección de correo electrónico: {operatorEmail}."],
      },
    ],
  },

  privacy: {
    title: "Política de privacidad",
    intro:
      "Esta política, basada en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (Reglamento General de Protección de Datos, RGPD), explica qué datos personales tratamos cuando utilizas {site} ({url}), con qué finalidad, sobre qué base jurídica y durante cuánto tiempo, así como qué derechos te asisten.",
    sections: [
      {
        heading: "1. El responsable del tratamiento",
        blocks: [{ details: "operator" }],
      },
      {
        heading: "2. En resumen",
        blocks: [
          {
            list: [
              "No hay registro: no pedimos nombre, dirección de correo electrónico ni ningún otro dato identificativo.",
              "Las imágenes, los archivos de texto y los PDF los procesa tu navegador; no llegan hasta nosotros.",
              "Los archivos de Word, Excel y PowerPoint solo están en el servidor mientras dura la conversión y después se eliminan inmediatamente.",
              "No utilizamos cookies ni códigos de seguimiento analíticos o publicitarios.",
            ],
          },
        ],
      },
      {
        heading: "3. Conversión de archivos de Office",
        blocks: [
          "Si añades un archivo de Word, Excel o PowerPoint, el archivo se envía a través de una conexión cifrada (HTTPS) al servidor, donde un programa ofimático lo convierte a PDF; después, el PDF vuelve a tu navegador.",
          {
            list: [
              "Datos tratados: el nombre y el contenido del archivo, incluidos los datos personales que pueda contener el documento.",
              "Finalidad: realizar la conversión que has solicitado.",
              "Base jurídica: la prestación del servicio a petición tuya (artículo 6, apartado 1, letra b) del RGPD).",
              "Plazo: solo mientras dura la conversión, normalmente unos segundos. Después, el archivo y el PDF se eliminan inmediatamente; no los almacenamos y nadie examina su contenido.",
            ],
          },
        ],
      },
      {
        heading: "4. Registros técnicos",
        blocks: [
          "Al servir el sitio, como ocurre con cualquier sitio web, los servidores del proveedor de alojamiento registran datos técnicos.",
          {
            list: [
              "Datos tratados: dirección IP, fecha y hora de la solicitud, dirección de la página solicitada, tipo y versión del navegador.",
              "Finalidad: garantizar el funcionamiento seguro e ininterrumpido del servicio y detectar errores y abusos.",
              "Base jurídica: el interés legítimo del operador (artículo 6, apartado 1, letra f) del RGPD).",
              "Plazo: durante un periodo breve, conforme a las normas de conservación de datos del proveedor de alojamiento.",
            ],
          },
        ],
      },
      {
        heading: "5. Archivos procesados en el navegador",
        blocks: [
          "Las imágenes, los archivos de texto y los PDF —incluidas las contraseñas de los PDF— los procesa exclusivamente tu navegador en tu propio dispositivo. No tenemos acceso a estos datos ni los tratamos.",
        ],
      },
      {
        heading: "6. Cookies y almacenamiento local",
        blocks: [
          "El sitio no utiliza cookies ni códigos de seguimiento analíticos o publicitarios. En el almacenamiento local del navegador (localStorage) solo guardamos la apariencia que eliges (tema claro u oscuro); este dato no llega hasta nosotros y puedes borrarlo en cualquier momento desde la configuración del navegador.",
        ],
      },
      {
        heading: "7. Encargado del tratamiento y transferencias de datos",
        blocks: [
          "El alojamiento del sitio y la capacidad de cálculo necesaria para convertir los archivos de Office los proporciona el siguiente encargado del tratamiento:",
          { details: "hosting" },
          "Vercel Inc. tiene su sede en los Estados Unidos de América, por lo que los datos también pueden llegar fuera de la Unión Europea. La transferencia se realiza con las garantías adecuadas (Marco de Privacidad de Datos UE-EE. UU. o, en su caso, cláusulas tipo de protección de datos adoptadas por la Comisión Europea).",
          "No comunicamos tus datos a ningún otro tercero ni los vendemos.",
        ],
      },
      {
        heading: "8. Seguridad de los datos",
        blocks: [
          "Todas las conexiones entre el sitio y el servidor están cifradas (HTTPS). El servicio que convierte los archivos de Office no es accesible directamente desde internet; los archivos no se almacenan y se eliminan inmediatamente después de su procesamiento.",
        ],
      },
      {
        heading: "9. Tus derechos",
        blocks: [
          "De acuerdo con el RGPD, tienes los siguientes derechos:",
          {
            list: [
              "derecho de información y de acceso (artículo 15);",
              "derecho de rectificación (artículo 16);",
              "derecho de supresión (artículo 17);",
              "derecho a la limitación del tratamiento (artículo 18);",
              "derecho a la portabilidad de los datos (artículo 20);",
              "derecho de oposición al tratamiento basado en el interés legítimo (artículo 21).",
            ],
          },
          "Como no hay registro y los archivos de Office se eliminan inmediatamente, en la mayoría de los casos no disponemos de ningún dato que nos permita identificarte. Puedes enviar tu solicitud a {operatorEmail}; te responderemos en el plazo máximo de un mes.",
        ],
      },
      {
        heading: "10. Vías de recurso",
        blocks: [
          "Si consideras que el tratamiento de tus datos personales infringe la normativa, puedes presentar una reclamación ante la autoridad húngara de protección de datos (Nemzeti Adatvédelmi és Információszabadság Hatóság, NAIH; 1055 Budapest, Falk Miksa utca 9–11.; dirección postal: 1363 Budapest, Pf. 9.; teléfono: +36 1 391 1400; correo electrónico: ugyfelszolgalat@naih.hu; sitio web: https://naih.hu) o ante la autoridad de protección de datos de tu lugar de residencia.",
          "Si se vulneran tus derechos, también puedes acudir a los tribunales; puedes interponer la demanda ante el tribunal competente de tu lugar de residencia o de tu lugar de estancia.",
        ],
      },
      {
        heading: "11. Modificación de esta política",
        blocks: [
          "Actualizamos esta política cuando cambia el servicio; la fecha de entrada en vigor se indica en la parte superior del documento. Las condiciones de uso del servicio figuran en los [Términos y condiciones]({termsPath}).",
        ],
      },
    ],
  },
};
