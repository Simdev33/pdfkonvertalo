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
      "Este documento recoge las condiciones de uso del servicio web {site} ({url}) y las condiciones de la suscripción. Al usar el sitio o al contratar la suscripción, aceptas estas condiciones; si no estás de acuerdo con ellas, te rogamos que no utilices el servicio.",
    sections: [
      {
        heading: "1. El operador",
        blocks: ["El servicio lo presta el siguiente operador:", { details: "operator" }, "El proveedor de alojamiento:", { details: "hosting" }],
      },
      {
        heading: "2. El servicio",
        blocks: [
          "{site} es una herramienta en línea con la que puedes:",
          {
            list: [
              "convertir a PDF imágenes, archivos de texto y archivos de Word, Excel y PowerPoint, así como unir archivos PDF;",
              "crear imágenes JPG o PNG a partir de páginas de PDF.",
            ],
          },
          "Añadir los archivos, convertirlos y ver la vista previa del resultado es gratuito. Para descargar los archivos generados se necesita una suscripción (véase el apartado 3).",
          "Las imágenes, los archivos de texto y los PDF se procesan en tu navegador, en tu propio dispositivo; estos archivos no llegan al servidor. Para que la conversión sea precisa, los archivos de Word, Excel y PowerPoint los convierte a PDF el servidor (véase el apartado 9).",
        ],
      },
      {
        heading: "3. Suscripción y precios",
        blocks: [
          "La suscripción comienza con un periodo inicial de {days} días, cuyo precio es de {trial}. Durante este periodo, el servicio puede utilizarse en su totalidad y sin restricciones.",
          "Si no cancelas la suscripción antes de que finalice el periodo inicial, a partir del día {next} se convierte automáticamente en una suscripción mensual de {monthly} y se renueva cada mes hasta que la canceles. La cuota mensual se carga al comienzo de cada periodo en el método de pago que indicaste al realizar el pedido.",
          "La página de pago indica claramente el importe total que debes pagar antes de que realices el pedido. El pedido se formaliza al pulsar el botón que implica una obligación de pago (o el botón del método de pago elegido).",
          "Antes de que finalice el periodo inicial, te enviaremos por correo electrónico un recordatorio del próximo cargo mensual.",
          "Notificaremos a los suscriptores por correo electrónico cualquier cambio de precios con al menos 30 días de antelación; si no lo aceptas, puedes cancelar la suscripción antes de que el cambio entre en vigor.",
        ],
      },
      {
        heading: "4. Pago",
        blocks: [
          "Los pagos los procesa Stripe Payments Europe, Ltd. (Irlanda). Métodos de pago disponibles (según el dispositivo, el navegador y el país): tarjeta de débito y de crédito, Apple Pay, Google Pay, PayPal y Link. Nosotros no vemos ni almacenamos los datos de tu tarjeta.",
          "Stripe envía por correo electrónico un recibo de cada pago realizado correctamente. La factura exigida por la ley la emite el operador.",
          "Si no se puede realizar un cargo mensual, Stripe vuelve a intentarlo en pocos días; si sigue sin poder realizarse, la suscripción finaliza y se pierde el acceso a las descargas.",
        ],
      },
      {
        heading: "5. Cancelación",
        blocks: [
          "Puedes cancelar la suscripción en cualquier momento y sin necesidad de justificación en la página [Mi cuenta]({accountPath}) (iniciando sesión con el código que recibes por correo electrónico), con un solo clic, en la interfaz segura de Stripe.",
          "La cancelación surte efecto al final del periodo en curso: hasta entonces conservas el acceso y no se realiza ningún cargo más. Si cancelas durante el periodo inicial, no se cobrará ninguna cuota mensual a partir del día {next}.",
          "El precio del periodo ya iniciado no se reembolsa, salvo en caso de ejercicio del derecho de desistimiento y en los casos previstos por la ley.",
        ],
      },
      {
        heading: "6. Derecho de desistimiento",
        blocks: [
          "Si contratas la suscripción como consumidor, puedes desistir del contrato sin necesidad de justificación en un plazo de 14 días desde el pedido. Puedes comunicar tu decisión de desistir mediante una declaración inequívoca enviada al operador (por ejemplo, por correo electrónico: {operatorEmail}); para ello también puedes utilizar el modelo de formulario de desistimiento del anexo I, parte B, de la Directiva 2011/83/UE, aunque no es obligatorio.",
          "Dado que al realizar el pedido solicitas expresamente el inicio inmediato del servicio, en caso de desistimiento deberás pagar la parte proporcional del precio correspondiente al periodo utilizado hasta el desistimiento. El importe restante te lo reembolsaremos en un plazo de 14 días desde la comunicación del desistimiento, mediante el mismo método de pago que utilizaste al pagar.",
          "El derecho de desistimiento no afecta a la posibilidad de cancelar la suscripción en cualquier momento (véase el apartado 5).",
        ],
      },
      {
        heading: "7. Cuenta e inicio de sesión",
        blocks: [
          "No hay un registro independiente con contraseña. Tu cuenta está vinculada a la dirección de correo electrónico que indicaste al pagar: en el navegador con el que pagaste, tu sesión se inicia automáticamente, y en otros dispositivos puedes iniciar sesión con un código de 6 dígitos que recibes por correo electrónico y que es válido durante 10 minutos.",
          "No compartas el código de acceso con nadie. La suscripción es para uso personal; no está permitido compartir el acceso ni revenderlo.",
        ],
      },
      {
        heading: "8. Condiciones de uso",
        blocks: [
          "Solo puedes utilizar el servicio con fines lícitos y conforme a las presentes condiciones. En particular, está prohibido:",
          {
            list: [
              "procesar archivos sobre los que no tengas derechos o que vulneren derechos de terceros (por ejemplo, sus derechos de autor, sus derechos de la personalidad o sus datos personales);",
              "generar o difundir contenido ilícito por medio del servicio;",
              "utilizar el servicio de forma masiva mediante herramientas automatizadas, sobrecargarlo u obstaculizar su funcionamiento de cualquier otro modo;",
              "eludir las medidas de seguridad o los sistemas de pago del servicio, acceder sin autorización al sistema o subir código malicioso.",
            ],
          },
          "Si los archivos procesados contienen datos personales de otras personas, tú eres responsable de que su tratamiento sea lícito.",
          "Para impedir abusos, el operador puede restringir o suprimir el acceso; en caso de incumplimiento grave del contrato, la suscripción puede resolverse con efecto inmediato.",
        ],
      },
      {
        heading: "9. Procesamiento de los archivos de Office",
        blocks: [
          "Para convertir archivos de Word, Excel y PowerPoint, el archivo se envía al servidor a través de una conexión cifrada (HTTPS). El servidor lo utiliza exclusivamente para crear el PDF, lo elimina inmediatamente una vez finalizada la conversión, no lo almacena y nadie examina su contenido. Los demás archivos ni siquiera salen de tu dispositivo.",
          "El tamaño máximo de los archivos de Office que se pueden subir es de 4,4 MB. El servicio no convierte documentos protegidos con contraseña.",
          "Los derechos sobre tus archivos y sobre los archivos generados siguen siendo tuyos; el operador no adquiere ningún derecho sobre ellos.",
        ],
      },
      {
        heading: "10. Propiedad intelectual",
        blocks: [
          "El diseño, los textos, los elementos gráficos y el código fuente del sitio son propiedad intelectual del operador; no pueden copiarse ni distribuirse sin su autorización por escrito.",
          "El servicio también utiliza componentes de código abierto (por ejemplo, pdf.js de Mozilla, pdf-lib, LibreOffice y Gotenberg), que se rigen por sus propias condiciones de licencia.",
        ],
      },
      {
        heading: "11. Responsabilidad",
        blocks: [
          "El operador hace todo lo posible para que la conversión sea precisa y el servicio esté disponible de forma continuada, pero no garantiza que el resultado sea impecable en todos los casos ni que el servicio esté disponible de forma ininterrumpida y sin errores.",
          "Comprueba los archivos generados antes de utilizarlos y guarda siempre una copia de tus archivos originales.",
          "En la máxima medida permitida por la ley, el operador no responde de los daños indirectos, la pérdida de datos o el lucro cesante derivados del uso del servicio o de la imposibilidad de utilizarlo. Esta limitación no se aplica a la responsabilidad por incumplimientos contractuales cometidos de forma dolosa o por negligencia grave, ni por los que causen daños a la vida, la integridad física o la salud, y no afecta a los derechos que la ley reconoce a los consumidores.",
        ],
      },
      {
        heading: "12. Disponibilidad y cambios",
        blocks: [
          "El operador tiene derecho a desarrollar y modificar el servicio. Si el servicio deja de prestarse de forma definitiva, daremos por terminadas las suscripciones y reembolsaremos de forma proporcional el precio del periodo no utilizado.",
        ],
      },
      {
        heading: "13. Protección de datos",
        blocks: ["Los detalles sobre el tratamiento de los datos personales figuran en la [Política de privacidad]({privacyPath})."],
      },
      {
        heading: "14. Modificación de las condiciones",
        blocks: [
          "El operador tiene derecho a modificar las presentes condiciones. Las modificaciones entran en vigor con su publicación en el sitio; la fecha de entrada en vigor se indica en la parte superior del documento. Notificaremos a los suscriptores por correo electrónico, con al menos 30 días de antelación, los cambios sustanciales que les sean desfavorables; si no los aceptan, pueden cancelar la suscripción antes de su entrada en vigor.",
        ],
      },
      {
        heading: "15. Legislación aplicable y litigios",
        blocks: [
          "A las presentes condiciones se aplica la legislación eslovaca. Si utilizas el servicio como consumidor, esta elección de ley no te priva de la protección que te otorgan las normas imperativas de protección de los consumidores del país en el que resides.",
          "Procuraremos resolver las controversias, en primer lugar, de forma amistosa, mediante la negociación: puedes enviar tu reclamación a {operatorEmail}. Si rechazamos tu reclamación o no te respondemos en un plazo de 30 días, como consumidor puedes iniciar un procedimiento de resolución alternativa de litigios ante la Inspección de Comercio de Eslovaquia (Slovenská obchodná inšpekcia, https://www.soi.sk) o ante otra entidad de resolución de litigios que figure en la lista del Ministerio de Economía de Eslovaquia. También puedes acudir a la autoridad de protección de los consumidores y a los tribunales de tu lugar de residencia.",
        ],
      },
      {
        heading: "16. Contacto",
        blocks: ["Puedes dirigir tus preguntas, comentarios y reclamaciones al operador en la siguiente dirección de correo electrónico: {operatorEmail}."],
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
              "No hay registro con contraseña. Si te suscribes, tratamos tu dirección de correo electrónico y los datos de tu suscripción.",
              "Los pagos los procesa Stripe; nosotros no vemos ni almacenamos los datos de tu tarjeta.",
              "Las imágenes, los archivos de texto y los PDF los procesa tu navegador; no llegan hasta nosotros.",
              "Los archivos de Word, Excel y PowerPoint solo están en el servidor mientras dura la conversión y después se eliminan inmediatamente.",
              "No utilizamos códigos de seguimiento analíticos ni publicitarios. Solo utilizamos cookies para el inicio de sesión y el pago.",
            ],
          },
        ],
      },
      {
        heading: "3. Suscripción y pago",
        blocks: [
          "Si te suscribes, los datos que introduces en la página de pago los trata Stripe; nosotros recibimos los datos necesarios para llevar el registro de la suscripción.",
          {
            list: [
              "Datos tratados: dirección de correo electrónico, los identificadores de cliente y de suscripción asignados por Stripe, el estado y los periodos de la suscripción, el importe y la fecha de los pagos, el tipo de método de pago (por ejemplo, tarjeta, y sus 4 últimas cifras) y, si la página de pago los solicita, el país y el código postal de facturación.",
              "Finalidad: crear y ejecutar la suscripción, cobrar los importes, comprobar el acceso, la facturación y la atención al cliente.",
              "Base jurídica: la ejecución del contrato (artículo 6, apartado 1, letra b) del RGPD); en el caso de la conservación de los justificantes contables, el cumplimiento de una obligación legal (artículo 6, apartado 1, letra c) del RGPD).",
              "Plazo: mientras la suscripción esté vigente; tras la cancelación, conservamos los justificantes contables durante 10 años, conforme al artículo 35 de la Ley eslovaca de Contabilidad (Ley n.º 431/2002). El resto de los datos los suprimimos a petición tuya una vez finalizada la suscripción.",
            ],
          },
          "Los pagos los procesa Stripe Payments Europe, Ltd. (1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irlanda), que actúa como responsable independiente del tratamiento en lo que respecta a los datos de pago y a la prevención del fraude. Puedes informarte sobre su tratamiento de datos en https://stripe.com/privacy.",
        ],
      },
      {
        heading: "4. Inicio de sesión con código por correo electrónico",
        blocks: [
          "En otros dispositivos puedes iniciar sesión con un código de un solo uso que te enviamos por correo electrónico.",
          {
            list: [
              "Datos tratados: dirección de correo electrónico, el código de acceso en forma cifrada (hash), su fecha de caducidad y el número de intentos.",
              "Finalidad: el inicio de sesión y la protección de la cuenta.",
              "Base jurídica: la ejecución del contrato (artículo 6, apartado 1, letra b) del RGPD).",
              "Plazo: el código es válido durante 10 minutos y lo eliminamos inmediatamente después de usarlo.",
            ],
          },
          "Los correos de inicio de sesión los envía Resend, Inc. (https://resend.com) como encargado del tratamiento.",
        ],
      },
      {
        heading: "5. Conversión de archivos de Office",
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
        heading: "6. Registros técnicos",
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
        heading: "7. Archivos procesados en el navegador",
        blocks: [
          "Las imágenes, los archivos de texto y los PDF —incluidas las contraseñas de los PDF— los procesa exclusivamente tu navegador en tu propio dispositivo. No tenemos acceso a estos datos ni los tratamos.",
          "Mientras la página de pago está abierta, tu navegador guarda el archivo generado en tu propio dispositivo (IndexedDB) durante un máximo de 60 minutos, para que no se pierda si utilizas un método de pago que te redirige a otra página (por ejemplo, PayPal). Este archivo tampoco llega hasta nosotros. Si entre ellos había archivos de Word, Excel o PowerPoint, también se guardan allí los archivos originales, para poder crear la versión completa después del pago (el servidor los vuelve a convertir, tal y como se describe más arriba).",
        ],
      },
      {
        heading: "8. Cookies y almacenamiento local",
        blocks: [
          "Solo utilizamos las cookies necesarias para el funcionamiento del servicio, que no requieren consentimiento:",
          {
            list: [
              "pk_session: mantiene la sesión iniciada (180 días);",
              "pk_signed_in: indica al sitio que has iniciado sesión (180 días);",
              "pk_login: gestiona el proceso del código de acceso (10 minutos);",
              "pk_lang: recuerda el idioma elegido en el selector de idioma (1 año).",
            ],
          },
          "En la página de pago, Stripe utiliza sus propias cookies para tramitar el pago de forma segura y prevenir el fraude. No utilizamos cookies analíticas ni publicitarias. En el almacenamiento local del navegador (localStorage) solo guardamos la apariencia que eliges (tema claro u oscuro).",
        ],
      },
      {
        heading: "9. Encargados del tratamiento y transferencias de datos",
        blocks: [
          "El alojamiento del sitio y la capacidad de cálculo necesaria para convertir los archivos de Office los proporciona el siguiente encargado del tratamiento:",
          { details: "hosting" },
          "Los correos de inicio de sesión los envía Resend, Inc. Vercel Inc. y Resend, Inc. tienen su sede en los Estados Unidos de América, por lo que los datos también pueden llegar fuera de la Unión Europea. La transferencia se realiza con las garantías adecuadas (Marco de Privacidad de Datos UE-EE. UU. o, en su caso, cláusulas tipo de protección de datos adoptadas por la Comisión Europea).",
          "No comunicamos tus datos a ningún otro tercero ni los vendemos.",
        ],
      },
      {
        heading: "10. Seguridad de los datos",
        blocks: [
          "Todas las conexiones entre el sitio y el servidor están cifradas (HTTPS). Las cookies de inicio de sesión están firmadas y no pueden leerse mediante scripts. El servicio que convierte los archivos de Office no es accesible directamente desde internet; los archivos no se almacenan y se eliminan inmediatamente después de su procesamiento.",
        ],
      },
      {
        heading: "11. Tus derechos",
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
          "Puedes enviar tu solicitud a {operatorEmail}; te responderemos en el plazo máximo de un mes. También puedes cambiar tú mismo tu dirección de correo electrónico en la página [Mi cuenta]({accountPath}), en la interfaz de Stripe.",
        ],
      },
      {
        heading: "12. Vías de recurso",
        blocks: [
          "Si consideras que el tratamiento de tus datos personales infringe la normativa, puedes presentar una reclamación ante la autoridad de control eslovaca, correspondiente al domicilio social del responsable del tratamiento (Úrad na ochranu osobných údajov Slovenskej republiky; Hraničná 12, 820 07 Bratislava 27; sitio web: https://dataprotection.gov.sk), o ante la autoridad de protección de datos de tu lugar de residencia o de trabajo; en Hungría, ante la Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH; 1055 Budapest, Falk Miksa utca 9–11.; dirección postal: 1363 Budapest, Pf. 9.; teléfono: +36 1 391 1400; correo electrónico: ugyfelszolgalat@naih.hu; sitio web: https://naih.hu).",
          "Si se vulneran tus derechos, también puedes acudir a los tribunales; puedes interponer la demanda también ante los tribunales del Estado miembro de tu lugar de residencia o de estancia.",
        ],
      },
      {
        heading: "13. Modificación de esta política",
        blocks: [
          "Actualizamos esta política cuando cambia el servicio; la fecha de entrada en vigor se indica en la parte superior del documento. Las condiciones de uso del servicio figuran en los [Términos y condiciones]({termsPath}).",
        ],
      },
    ],
  },
};
