import { esquemaOrganizacion, esquemaSitio } from "@/lib/structured-data";

/**
 * Bloques JSON-LD (se renderizan en el servidor, sin JavaScript en el cliente). Uno por objeto:
 * un arreglo en un solo <script> hace fallar a los lectores que esperan datos["@context"].
 */
export function JsonLd({ datos }: { datos: object | object[] }) {
  const lista = Array.isArray(datos) ? datos : [datos];
  return (
    <>
      {lista.map((d) => (
        <script
          key={`${(d as { "@type"?: string })["@type"]}-${JSON.stringify(d).length}`}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: los datos estructurados van así
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}

/** Lo que va en todas las páginas: quién es Axium y cuál es el sitio. */
export function StructuredData() {
  return <JsonLd datos={[esquemaOrganizacion(), esquemaSitio()]} />;
}
