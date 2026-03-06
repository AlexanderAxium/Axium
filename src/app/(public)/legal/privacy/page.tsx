export default function PrivacyPage() {
  return (
    <div className="container-section py-12 md:py-16">
      <div className="content-section max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <span className="text-overline text-gray-400">Legal</span>
          <h1 className="text-heading-1 text-gray-900 mt-3 mb-2">
            Política de Privacidad
          </h1>
          <p className="text-body-sm text-gray-400">
            Última actualización: 1 de marzo de 2025
          </p>
        </div>

        {/* Sections */}
        <div className="divide-y divide-gray-100">
          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              1. Responsable del tratamiento
            </h2>
            <p className="text-body text-gray-500">
              Axium S.A.C. es el responsable del tratamiento de los datos
              personales que usted nos proporciona a través de este sitio web o
              mediante cualquier canal de comunicación. Operamos conforme a la
              Ley N.° 29733, Ley de Protección de Datos Personales del Perú, y
              su reglamento.
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              2. Información que recopilamos
            </h2>
            <p className="text-body text-gray-500 mb-3">
              Recopilamos únicamente la información que usted nos facilita de
              forma voluntaria a través de nuestros formularios de contacto:
            </p>
            <ul className="space-y-2 text-body text-gray-500 list-disc list-inside mb-3">
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Mensaje o descripción del proyecto</li>
              <li>Adjuntos que usted decida incluir voluntariamente</li>
            </ul>
            <p className="text-body text-gray-500">
              Adicionalmente, nuestro sitio puede recopilar de forma automática
              datos de navegación (dirección IP, tipo de navegador, páginas
              visitadas) a través de herramientas de analítica, con el único
              propósito de mejorar la experiencia del usuario.
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              3. Finalidad del tratamiento
            </h2>
            <p className="text-body text-gray-500 mb-3">
              Los datos que nos proporciona se utilizan exclusivamente para:
            </p>
            <ul className="space-y-2 text-body text-gray-500 list-disc list-inside">
              <li>Responder a su consulta o solicitud de servicio</li>
              <li>Elaborar propuestas y presupuestos personalizados</li>
              <li>Gestionar la relación contractual si decide contratarnos</li>
              <li>
                Enviar información relevante sobre nuestros servicios, previa
                aceptación
              </li>
            </ul>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              4. Compartición de datos
            </h2>
            <p className="text-body text-gray-500 mb-3">
              Axium no vende, alquila ni comparte sus datos personales con
              terceros con fines comerciales. Podemos compartir información
              únicamente en los siguientes casos:
            </p>
            <ul className="space-y-2 text-body text-gray-500 list-disc list-inside">
              <li>
                Con proveedores de servicios que nos asisten operativamente (ej.
                plataformas de email, análisis web), quienes están obligados a
                tratar los datos con la misma confidencialidad
              </li>
              <li>
                Cuando sea requerido por autoridades competentes en cumplimiento
                de la ley peruana
              </li>
            </ul>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              5. Seguridad de los datos
            </h2>
            <p className="text-body text-gray-500">
              Implementamos medidas técnicas y organizativas razonables para
              proteger sus datos personales frente a accesos no autorizados,
              pérdida o divulgación indebida. Toda comunicación entre su
              navegador y nuestro sitio se realiza mediante conexión cifrada
              (HTTPS).
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              6. Sus derechos
            </h2>
            <p className="text-body text-gray-500 mb-3">
              De conformidad con la Ley N.° 29733, usted tiene derecho a:
            </p>
            <ul className="space-y-2 text-body text-gray-500 list-disc list-inside mb-3">
              <li>
                <span className="font-medium text-gray-700">Acceso:</span>{" "}
                conocer qué datos suyos tenemos almacenados
              </li>
              <li>
                <span className="font-medium text-gray-700">
                  Rectificación:
                </span>{" "}
                solicitar la corrección de datos inexactos
              </li>
              <li>
                <span className="font-medium text-gray-700">Cancelación:</span>{" "}
                pedir la eliminación de sus datos cuando ya no sean necesarios
              </li>
              <li>
                <span className="font-medium text-gray-700">Oposición:</span>{" "}
                oponerse al tratamiento en determinadas circunstancias
              </li>
            </ul>
            <p className="text-body text-gray-500">
              Para ejercer cualquiera de estos derechos, escríbanos a{" "}
              <a
                href="mailto:privacidad@axium.com.pe"
                className="text-secondary hover:underline"
              >
                privacidad@axium.com.pe
              </a>
              .
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              7. Retención de datos
            </h2>
            <p className="text-body text-gray-500">
              Conservamos sus datos personales durante el tiempo necesario para
              cumplir con la finalidad por la que fueron recabados, y en todo
              caso por el periodo mínimo que exige la legislación tributaria y
              mercantil peruana. Una vez cumplido dicho periodo, los datos se
              eliminan de forma segura.
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">8. Cookies</h2>
            <p className="text-body text-gray-500">
              Nuestro sitio web utiliza cookies propias y de terceros para
              mejorar la experiencia de navegación y analizar el tráfico. Puede
              consultar nuestra{" "}
              <a
                href="/legal/cookies"
                className="text-secondary hover:underline"
              >
                Política de Cookies
              </a>{" "}
              para más información.
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              9. Cambios a esta política
            </h2>
            <p className="text-body text-gray-500">
              Podemos actualizar esta Política de Privacidad cuando sea
              necesario. Le informaremos de cambios relevantes publicando la
              versión actualizada en esta página con la nueva fecha de
              efectividad.
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">10. Contacto</h2>
            <p className="text-body text-gray-500 mb-4">
              Para cualquier consulta relacionada con el tratamiento de sus
              datos personales:
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
              <p>Dirección: Lima, Perú</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
