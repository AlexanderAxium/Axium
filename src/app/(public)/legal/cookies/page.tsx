export default function CookiesPage() {
  return (
    <div className="container-section py-12 md:py-16">
      <div className="content-section max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <span className="text-overline text-gray-400">Legal</span>
          <h1 className="text-heading-1 text-gray-900 mt-3 mb-2">
            Política de Cookies
          </h1>
          <p className="text-body-sm text-gray-400">
            Última actualización: 1 de marzo de 2025
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
              En el sitio web de Axium utilizamos los siguientes tipos de
              cookies:
            </p>

            <div className="space-y-5">
              <div>
                <h3 className="text-body font-semibold text-gray-800 mb-1">
                  Cookies esenciales
                </h3>
                <p className="text-body-sm text-gray-500">
                  Necesarias para el funcionamiento básico del sitio. Incluyen
                  la gestión de sesión y preferencias de idioma. No pueden
                  desactivarse sin afectar la funcionalidad del sitio.
                </p>
              </div>

              <div>
                <h3 className="text-body font-semibold text-gray-800 mb-1">
                  Cookies de analítica
                </h3>
                <p className="text-body-sm text-gray-500">
                  Utilizamos Google Analytics para entender cómo los visitantes
                  interactúan con el sitio (páginas visitadas, tiempo de
                  permanencia, origen del tráfico). La información se agrega y
                  es anónima — no se vincula a ningún usuario individual. Puede
                  optar por excluirse instalando el complemento de
                  inhabilitación de Google Analytics para navegadores.
                </p>
              </div>

              <div>
                <h3 className="text-body font-semibold text-gray-800 mb-1">
                  Cookies de preferencias
                </h3>
                <p className="text-body-sm text-gray-500">
                  Guardan sus elecciones dentro del sitio, como el idioma
                  seleccionado, para que no tenga que configurarlo en cada
                  visita.
                </p>
              </div>
            </div>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              3. Cookies de terceros
            </h2>
            <p className="text-body text-gray-500 mb-4">
              Algunos servicios integrados en nuestro sitio pueden establecer
              sus propias cookies:
            </p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-body-sm font-medium text-gray-700 min-w-[120px]">
                  Google Analytics
                </span>
                <span className="text-body-sm text-gray-500">
                  Analítica de uso anónima. Consulte la{" "}
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
                  Vercel
                </span>
                <span className="text-body-sm text-gray-500">
                  Plataforma de alojamiento web. Puede establecer cookies
                  técnicas para el enrutamiento y rendimiento del sitio.
                </span>
              </div>
            </div>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              4. Gestión de cookies
            </h2>
            <p className="text-body text-gray-500 mb-3">
              Puede controlar y eliminar las cookies desde la configuración de
              su navegador. A continuación encontrará instrucciones para los
              navegadores más comunes:
            </p>
            <ul className="space-y-2 text-body-sm text-gray-500 list-disc list-inside">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary hover:underline"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web"
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary hover:underline"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary hover:underline"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary hover:underline"
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
              Deshabilitar las cookies esenciales puede afectar el correcto
              funcionamiento del sitio, como la selección de idioma. Las cookies
              de analítica son opcionales; desactivarlas no afecta su
              experiencia de navegación.
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
                  href="mailto:privacidad@axium.com.pe"
                  className="text-secondary hover:underline"
                >
                  privacidad@axium.com.pe
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
