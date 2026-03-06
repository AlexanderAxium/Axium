export default function TermsPage() {
  return (
    <div className="container-section py-12 md:py-16">
      <div className="content-section max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <span className="text-overline text-gray-400">Legal</span>
          <h1 className="text-heading-1 text-gray-900 mt-3 mb-2">
            Términos y Condiciones
          </h1>
          <p className="text-body-sm text-gray-400">
            Última actualización: 1 de marzo de 2025
          </p>
        </div>

        {/* Sections */}
        <div className="divide-y divide-gray-100">
          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              1. Aceptación de los términos
            </h2>
            <p className="text-body text-gray-500 mb-3">
              Al contratar los servicios de Axium o al acceder a este sitio web,
              usted acepta quedar vinculado a estos Términos y Condiciones. Si
              no está de acuerdo con alguna parte de los mismos, le pedimos que
              no utilice nuestros servicios.
            </p>
            <p className="text-body text-gray-500">
              Estos términos se aplican a todos los clientes, visitantes y
              personas que accedan o interactúen con Axium S.A.C., empresa
              constituida bajo las leyes de la República del Perú.
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              2. Descripción del servicio
            </h2>
            <p className="text-body text-gray-500 mb-3">
              Axium es una agencia especializada en el desarrollo de software a
              medida, diseño de identidad visual y sistemas de inteligencia
              artificial. Nuestros servicios incluyen, entre otros:
            </p>
            <ul className="space-y-2 text-body text-gray-500 list-disc list-inside">
              <li>Desarrollo de aplicaciones web y móviles</li>
              <li>Diseño de identidad de marca y branding</li>
              <li>Implementación de sistemas de IA y agentes autónomos</li>
              <li>Consultoría tecnológica y arquitectura de software</li>
              <li>Mantenimiento y soporte post-entrega</li>
            </ul>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              3. Propuesta y contratación
            </h2>
            <p className="text-body text-gray-500 mb-3">
              Cada proyecto comienza con una propuesta formal que detalla el
              alcance, los entregables, los plazos y los honorarios acordados.
              La propuesta se considera aceptada cuando el cliente la aprueba
              por escrito o realiza el pago inicial correspondiente.
            </p>
            <p className="text-body text-gray-500">
              Cualquier modificación al alcance del proyecto debe ser acordada
              por escrito entre ambas partes. Los cambios fuera del alcance
              original se cotizarán y facturarán por separado.
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              4. Pagos y facturación
            </h2>
            <p className="text-body text-gray-500 mb-3">
              Los honorarios y la estructura de pagos se establecen en la
              propuesta de cada proyecto. Como regla general:
            </p>
            <ul className="space-y-2 text-body text-gray-500 list-disc list-inside">
              <li>Se requiere un adelanto para iniciar cualquier proyecto</li>
              <li>
                Los pagos intermedios se realizan por hitos o entregas acordadas
              </li>
              <li>
                El saldo final se abona antes de la entrega de archivos
                definitivos
              </li>
              <li>
                Las facturas vencen a los 7 días de su emisión, salvo acuerdo
                distinto
              </li>
            </ul>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              5. Propiedad intelectual
            </h2>
            <p className="text-body text-gray-500 mb-3">
              Una vez realizado el pago completo del proyecto, el cliente
              adquiere los derechos de propiedad intelectual sobre los
              entregables finales acordados (diseños, código fuente,
              documentación). Axium conserva el derecho de mencionar el proyecto
              en su portafolio salvo acuerdo de confidencialidad expreso.
            </p>
            <p className="text-body text-gray-500">
              Los activos de terceros (fuentes tipográficas, librerías de código
              abierto, imágenes con licencia) se rigen por sus respectivas
              licencias, que serán informadas al cliente al momento de la
              entrega.
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              6. Confidencialidad
            </h2>
            <p className="text-body text-gray-500">
              Axium trata con reserva toda la información de negocio,
              estratégica o técnica que el cliente comparta durante el
              desarrollo del proyecto. Para proyectos que requieran un nivel de
              confidencialidad adicional, podemos firmar un Acuerdo de No
              Divulgación (NDA) antes de iniciar.
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              7. Garantías y correcciones
            </h2>
            <p className="text-body text-gray-500 mb-3">
              Axium garantiza que todos los entregables cumplen con las
              especificaciones acordadas en la propuesta. En caso de detectar
              errores o defectos imputables a Axium dentro de los 30 días
              posteriores a la entrega final, los corregimos sin costo
              adicional.
            </p>
            <p className="text-body text-gray-500">
              Esta garantía no aplica a modificaciones realizadas por el cliente
              ni a entornos de infraestructura no gestionados por Axium.
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              8. Limitación de responsabilidad
            </h2>
            <p className="text-body text-gray-500">
              La responsabilidad máxima de Axium ante cualquier reclamación
              derivada de los servicios prestados se limita al monto total
              facturado en el proyecto en cuestión. Axium no será responsable
              por lucro cesante, pérdidas indirectas o daños consecuentes que no
              sean previsibles al momento de la contratación.
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              9. Modificaciones
            </h2>
            <p className="text-body text-gray-500">
              Axium se reserva el derecho de actualizar estos Términos y
              Condiciones en cualquier momento. Los cambios se publicarán en
              este sitio con la fecha de última actualización. El uso continuado
              de nuestros servicios implica la aceptación de los términos
              vigentes.
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">
              10. Legislación aplicable
            </h2>
            <p className="text-body text-gray-500">
              Estos términos se rigen por las leyes de la República del Perú.
              Cualquier controversia que no pueda resolverse de forma amistosa
              se someterá a la jurisdicción de los tribunales de la ciudad de
              Lima.
            </p>
          </section>

          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-3">11. Contacto</h2>
            <p className="text-body text-gray-500 mb-4">
              Para consultas sobre estos términos, puede contactarnos en:
            </p>
            <div className="space-y-2 text-body text-gray-500">
              <p>
                Email:{" "}
                <a
                  href="mailto:legal@axium.com.pe"
                  className="text-secondary hover:underline"
                >
                  legal@axium.com.pe
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
