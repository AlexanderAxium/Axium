/**
 * Home de demo de LumioLearn Academy para capturar el sitio y el constructor.
 * SOLO base local lumio_capturas (aborta si no).
 *
 * Formato v1 (sections → CONTAINER → columns → widgets), el mismo de los diseños
 * por defecto de la app (src/lib/cms/default-designs.ts). En el repo actual el
 * renderer del paquete site-builder-core solo reconoce `CONTAINER` (v1) y la
 * migración al leer entrega v2 → "Sección sin render: container". Para capturar
 * se corre Lumio con CMS_SCHEMA_MIGRATE_ONREAD=false (interruptor documentado en
 * src/lib/cms/schema/on-read.ts), sin tocar el código.
 *
 * Uso (desde el repo de LumioLearn, con lumio-env.sh cargado):
 *   npx tsx ./.lumio-home.tmp.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const TENANT = "tenant-lumio-001";
const VIOLETA = "#6F54BF";
const MEDIOS = "http://127.0.0.1:8765";

let n = 0;
type Widget = { id: string; type: string; data: Record<string, unknown> };
const w = (type: string, data: Record<string, unknown>): Widget => ({
  id: `w-demo-${type}-${n++}`,
  type,
  data,
});
const col = (span: number, children: Widget[]) => ({
  id: `col-demo-${n++}`,
  span,
  children,
});
const container = (
  label: string,
  order: number,
  columns: ReturnType<typeof col>[],
  extra: Record<string, unknown> = {}
) => ({
  id: `sec-${label}-${order}`,
  type: "CONTAINER",
  label,
  order,
  data: {
    layout: "flex",
    gap: "lg",
    width: "boxed",
    paddingY: "lg",
    columns,
    ...extra,
  },
});

const caja = (name: string, title: string, text: string) =>
  w("iconBox", {
    name,
    size: 28,
    title,
    text,
    align: "left",
    color: VIOLETA,
    iconBg: "#F1EDFB",
    layout: "stacked",
    iconShape: "circle",
    iconPad: 12,
  });

const home = {
  seo: {},
  sections: [
    container(
      "portada",
      0,
      [
        col(6, [
          w("text", {
            html: `<p style="letter-spacing:.18em;text-transform:uppercase;font-size:13px;font-weight:600;color:${VIOLETA}">LumioLearn Academy</p>`,
          }),
          // El tenant no tiene estilos globales: el tamaño va en el HTML del widget Texto
          w("text", {
            html: '<h1 style="font-size:clamp(34px,5.2vw,54px);line-height:1.06;font-weight:600;letter-spacing:-0.02em;color:#19315D;margin:6px 0 14px">Aprende a liderar la transformación digital</h1>',
          }),
          w("text", {
            html: "<p>Cursos en video con evaluaciones, un tutor que responde con el contexto de cada clase y certificado al terminar.</p>",
          }),
          w("spacer", { height: 8 }),
          w("button", {
            text: "Ver cursos",
            link: "/courses",
            variant: "primary",
            align: "left",
            size: "lg",
          }),
        ]),
        col(6, [
          w("image", {
            src: `${MEDIOS}/clase.jpg`,
            alt: "Clase en video de la academia",
            align: "center",
            rounded: true,
            objectFit: "cover",
            radius: 20,
          }),
        ]),
      ],
      {
        width: "full",
        paddingY: "xl",
        verticalAlign: "center",
        background: "#FAF8FF",
        background2: "#EEF0FF",
        gradientAngle: "160",
      }
    ),
    container("ventajas", 1, [
      col(4, [
        caja(
          "Video",
          "Clases en video",
          "Capítulos cortos con transcripción, marcadores y notas propias."
        ),
      ]),
      col(4, [
        caja(
          "Sparkles",
          "Un tutor que conoce la clase",
          "Lumen responde las dudas con el contenido del capítulo que estás viendo."
        ),
      ]),
      col(4, [
        caja(
          "Award",
          "Certificado al terminar",
          "Se emite al aprobar el curso, con un código único."
        ),
      ]),
    ]),
    container("cursos", 2, [
      col(12, [
        w("text", {
          html: '<h2 style="font-size:34px;line-height:1.15;font-weight:600;letter-spacing:-0.01em;color:#19315D;margin:0 0 8px">Cursos destacados</h2>',
        }),
        w("courses", {
          limit: 6,
          categoryId: "",
          level: "",
          sort: "recent",
          preset: "classic",
          mode: "carousel",
          cardMinWidth: 300,
          gap: 24,
          radius: 16,
          imageAspect: "16/9",
          showThumbnail: true,
          showLevel: true,
          showDuration: true,
          showSummary: true,
          showTeacher: true,
          showPrice: true,
          showCta: true,
          showArrows: true,
          ctaText: "Ver curso",
        }),
      ]),
    ]),
    container(
      "cierre",
      3,
      [
        col(12, [
          w("text", {
            html: '<h2 style="text-align:center;font-size:38px;line-height:1.15;font-weight:600;letter-spacing:-0.01em;color:#19315D;margin:0">Tu próximo curso empieza hoy</h2>',
          }),
          w("spacer", { height: 8 }),
          w("button", {
            text: "Crear mi cuenta",
            link: "/signup",
            variant: "primary",
            align: "center",
            size: "lg",
          }),
        ]),
      ],
      {
        width: "full",
        paddingY: "xl",
        background: "#F5F3FF",
        background2: "#FAF8FF",
        gradientAngle: "180",
      }
    ),
  ],
};

async function main() {
  const [{ db }] = await prisma.$queryRawUnsafe<{ db: string }[]>(
    "select current_database() as db"
  );
  if (db !== "lumio_capturas") throw new Error(`ABORTA: la base es ${db}`);

  const pagina = await prisma.cmsPage.findFirstOrThrow({
    where: { tenantId: TENANT, kind: "SITE", slug: "home", language: "ES" },
  });
  await prisma.cmsPage.update({
    where: { id: pagina.id },
    data: { content: home, isPublished: true },
  });
  console.log(
    `home de demo (v1) publicada en ${db} (${home.sections.length} secciones)`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
