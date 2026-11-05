import { BotonPreferenciasCookies } from "@/components/axium/consentimiento-cookies";
import { metaPagina } from "@/lib/seo";

export const metadata = metaPagina({
  titulo: "Política de cookies",
  descripcion:
    "Qué cookies usa el sitio de Axium, para qué sirven y cómo aceptarlas, rechazarlas o cambiar tu elección.",
  ruta: "/legal/cookies",
});

export default function CookiesPage() {
  return (
    <div className="container-section py-12 md:py-16">
      <div className="content-section max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <span className="text-overline text-gray-500">Legal</span>
          <h1 className="text-heading-1 text-gray-900 mt-3 mb-2">
            Política de Cookies
          </h1>
          <p className="text-body-sm text-gray-500">
            Última actualización: 4 de noviembre de 2026
          </p>
        </div>

        {/* Sections */}
        <div className="divide-y divide-gray-100">
          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              1. ¿Qué son las cookies?
            </h2>
            <p className="text-body text-gray-500">
              Las cookies son pequeños archivos de texto que un sitio web
              almacena en su dispositivo cuando lo visita. Permiten que el sitio
              recuerde sus preferencias y mejore su experiencia en visitas
              posteriores. No contienen información personal identificable por
              sí solas.
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              2. Cookies que utilizamos
            </h2>
            <p className="text-body text-gray-500 mb-5">
              Al entrar por primera vez le mostramos un aviso. Hasta que elija,
              el sitio solo usa lo necesario: no carga ningún servicio de
              terceros ni escribe cookies de analítica.
            </p>

            <div className="space-y-5">
              <div>
                <h3 className="text-body font-semibold text-gray-800 mb-1">
                  Cookies necesarias
                </h3>
                <p className="text-body-sm text-gray-500">
                  <span className="font-medium text-gray-700">
                    axium_consent
                  </span>{" "}
                  guarda su elección en el aviso de cookies durante 12 meses,
                  para no volver a preguntarle en cada visita. Si inicia sesión
                  en el panel interno de Axium, se usa además una cookie de
                  sesión para mantenerla abierta. No pueden desactivarse sin
                  afectar esas funciones.
                </p>
              </div>

              <div>
                <h3 className="text-body font-semibold text-gray-800 mb-1">
                  Cookies de analítica (solo si las acepta)
                </h3>
                <p className="text-body-sm text-gray-500">
                  Si pulsa «Aceptar», cargamos Google Analytics para entender
                  cómo se usa el sitio: páginas visitadas, tiempo de permanencia
                  y origen del tráfico. Escribe las cookies{" "}
                  <span className="font-medium text-gray-700">_ga</span> y{" "}
                  <span className="font-medium text-gray-700">
                    _ga_NZ0K01BVLF
                  </span>{" "}
                  (2 años), que guardan un identificador aleatorio para
                  distinguir visitas: no contienen su nombre ni su correo, y
                  Google Analytics no almacena su dirección IP. Conservamos
                  estos datos 14 meses y tenemos desactivadas las funciones de
                  publicidad y personalización de anuncios. Si pulsa «Solo
                  necesarias», no se carga nada de esto.
                </p>
              </div>

              <div>
                <h3 className="text-body font-semibold text-gray-800 mb-1">
                  Preferencias guardadas en su navegador
                </h3>
                <p className="text-body-sm text-gray-500">
                  El idioma y el tema (claro u oscuro) que elija se guardan en
                  el almacenamiento local de su navegador, no en cookies, y no
                  se envían a ningún servidor.
                </p>
              </div>
            </div>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              3. Cookies de terceros
            </h2>
            <p className="text-body text-gray-500 mb-4">
              El único servicio de terceros que puede establecer cookies en este
              sitio es Google Analytics, y solo si usted lo acepta:
            </p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-body-sm font-medium text-gray-700 min-w-[120px]">
                  Google Analytics
                </span>
                <span className="text-body-sm text-gray-500">
                  Medición de uso, prestada por Google LLC. Consulte la{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary hover:underline"
                  >
                    política de privacidad de Google
                  </a>
                  .
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-body-sm font-medium text-gray-700 min-w-[120px]">
                  Alojamiento
                </span>
                <span className="text-body-sm text-gray-500">
                  El sitio funciona en servidores administrados por Axium. El
                  alojamiento no establece cookies.
                </span>
              </div>
            </div>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              4. Gestión de cookies
            </h2>
            <p className="text-body text-gray-500 mb-4">
              Puede cambiar su elección cuando quiera. Si retira el permiso,
              borramos las cookies de Google Analytics de este sitio y la
              medición se detiene de inmediato.
            </p>
            <BotonPreferenciasCookies className="mb-6 inline-flex min-h-11 cursor-pointer items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground text-sm transition-opacity hover:opacity-90" />
            <p className="text-body text-gray-500 mb-3">
              También puede controlar y eliminar las cookies desde la
              configuración de su navegador. Instrucciones para los navegadores
              más comunes:
            </p>
            <ul className="space-y-2 text-body-sm text-gray-500 list-disc list-inside">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block py-1 text-secondary hover:underline"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block py-1 text-secondary hover:underline"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block py-1 text-secondary hover:underline"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block py-1 text-secondary hover:underline"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              5. Consecuencias de deshabilitar cookies
            </h2>
            <p className="text-body text-gray-500">
              Rechazar las cookies de analítica no cambia nada de su navegación:
              el sitio funciona igual. Si borra la cookie{" "}
              <span className="font-medium text-gray-700">axium_consent</span>,
              volveremos a preguntarle en su próxima visita.
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              6. Actualizaciones de esta política
            </h2>
            <p className="text-body text-gray-500">
              Podemos revisar esta Política de Cookies cuando actualicemos el
              sitio o incorporemos nuevos servicios. Le recomendamos consultarla
              periódicamente. Los cambios entran en vigor desde su publicación
              en esta página.
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">7. Contacto</h2>
            <p className="text-body text-gray-500 mb-4">
              Si tiene preguntas sobre el uso de cookies en nuestro sitio:
            </p>
            <div className="space-y-2 text-body text-gray-500">
              <p>
                Email:{" "}
                <a
                  href="mailto:contacto@axium.com.pe"
                  className="text-secondary hover:underline"
                >
                  contacto@axium.com.pe
                </a>
              </p>
              <p>
                Teléfono:{" "}
                <a
                  href="tel:+51991285679"
                  className="text-secondary hover:underline"
                >
                  +51 991 285 679
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
