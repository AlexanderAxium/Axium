/**
 * Encabezado y pie del sitio de LumioLearn Academy (tenant propio) para las
 * capturas: logo en el header y nombre real en el footer, en vez del
 * placeholder "Tu Academia". SOLO base local lumio_capturas (aborta si no).
 *
 * Uso (desde el repo de LumioLearn, con lumio-env.sh cargado):
 *   npx tsx ./.lumio-marca.tmp.ts
 */
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();
const TENANT = "tenant-lumio-001";
const LOGO = "http://127.0.0.1:8765/lockup.png";
const ACADEMIA = "LumioLearn Academy";

type Nodo = { id?: string; type?: string; data?: Record<string, unknown>; children?: Nodo[]; columns?: Nodo[] };

/** Recorre secciones → columnas → widgets y aplica `fn` a cada widget. */
function cadaWidget(secciones: Nodo[], fn: (w: Nodo) => void) {
  for (const s of secciones) {
    const columnas = (s.data?.columns as Nodo[] | undefined) ?? [];
    for (const c of columnas) for (const w of c.children ?? []) fn(w);
  }
}

async function main() {
  const [{ db }] = await prisma.$queryRawUnsafe<{ db: string }[]>(
    "select current_database() as db"
  );
  if (db !== "lumio_capturas") throw new Error(`ABORTA: la base es ${db}`);

  const plantillas = await prisma.sectionTemplate.findMany({
    where: { tenantId: TENANT, kind: { in: ["HEADER", "FOOTER"] } },
  });

  for (const p of plantillas) {
    const secciones = structuredClone(p.content) as unknown as Nodo[];
    cadaWidget(secciones, (w) => {
      if (!w.data) return;
      if (p.kind === "HEADER" && w.type === "image") {
        w.data.src = LOGO;
        w.data.alt = ACADEMIA;
        w.data.height = "34px";
      }
      if (p.kind === "FOOTER" && w.type === "heading") w.data.text = ACADEMIA;
      if (p.kind === "FOOTER" && w.type === "text") {
        w.data.html = `<p style="opacity:.7">© 2026 ${ACADEMIA}. Todos los derechos reservados.</p>`;
      }
    });
    await prisma.sectionTemplate.update({
      where: { id: p.id },
      data: { content: secciones as unknown as Prisma.InputJsonValue },
    });
  }
  console.log(`marca aplicada en ${db}: ${plantillas.map((p) => p.kind).join(" + ")}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
