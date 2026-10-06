/**
 * Datos de demo para capturar LumioLearn — SOLO en la base local lumio_capturas.
 *
 * Tenant propio (LumioLearn Academy). Nada de clientes ni de producción:
 * aborta si la base conectada no se llama lumio_capturas.
 *
 * Qué deja:
 *  - nombres creíbles (admin, alumna y compañera) en lugar de "Admin User"/"John Doe"
 *  - el video de las 4 clases del curso principal apuntando al servidor local de medios
 *  - progreso, notas y marcadores de la alumna en el capítulo 2
 *  - puntos, racha y logros (inicio del alumno y tabla de líderes)
 *  - la plantilla de certificado con fondo diseñado y los 4 marcadores
 *
 * Uso (desde el repo de LumioLearn, con lumio-env.sh cargado):
 *   CERT_FONDO=/ruta/certificado-fondo.jpg npx tsx ./.lumio-demo.tmp.ts
 */
import { readFileSync } from "node:fs";
import { PrismaClient, ProgressStatus, VideoProvider } from "@prisma/client";

const prisma = new PrismaClient();

const TENANT = "tenant-lumio-001";
const COURSE = "fea60666-2584-4290-b8bc-14d115977568"; // Transformación Digital 360°
const CAPS = [
  "455dc8f2-9e69-4968-ac86-fee9f9289c2e", // 1 Bienvenida y diagnóstico de madurez
  "3680d788-e1f0-4263-b0f9-0853b36be62c", // 2 Gobernanza y cultura organizacional
  "e671a21e-0ce8-43ab-87a7-9029c7785f7c", // 3 Tecnologías habilitadoras
  "b91322ae-09fd-4b6a-ac0a-182a21569bcb", // 4 Ejecución y escalamiento
];
const VIDEO = "http://127.0.0.1:8765/clase.webm";
const DIA = 24 * 60 * 60 * 1000;
const hace = (dias: number) => new Date(Date.now() - dias * DIA);

async function main() {
  const [{ db }] = await prisma.$queryRawUnsafe<{ db: string }[]>(
    "select current_database() as db"
  );
  if (db !== "lumio_capturas") throw new Error(`ABORTA: la base es ${db}`);

  // 1. Nombres
  const nombres: Record<string, string> = {
    "admin@lumio.com": "Equipo Lumio",
    "user@lumio.com": "Lucía Paredes",
    "maria@lumio.com": "Andrea Salas",
  };
  for (const [email, name] of Object.entries(nombres)) {
    await prisma.user.update({ where: { email }, data: { name } });
  }

  // 2. Video de las clases (sin YouTube)
  for (const chapterId of CAPS) {
    await prisma.chapterVideo.upsert({
      where: { chapterId },
      create: {
        chapterId,
        provider: VideoProvider.EXTERNAL,
        playbackUrl: VIDEO,
        durationSeconds: 1420,
      },
      update: {
        provider: VideoProvider.EXTERNAL,
        playbackUrl: VIDEO,
        thumbnailUrl: null,
        externalId: null,
      },
    });
  }

  // 3. Progreso de la alumna: capítulo 1 completo, capítulo 2 en curso
  const lucia = await prisma.user.findUniqueOrThrow({
    where: { email: "user@lumio.com" },
  });
  const andrea = await prisma.user.findUniqueOrThrow({
    where: { email: "maria@lumio.com" },
  });
  const matricula = await prisma.userCourseEnrollment.findFirstOrThrow({
    where: { userId: lucia.id, courseId: COURSE },
  });
  const progreso = [
    {
      chapterId: CAPS[0],
      status: ProgressStatus.COMPLETED,
      startedAt: hace(6),
      completedAt: hace(5),
      lastViewedAt: hace(5),
      lastVideoPositionSeconds: 212,
      quizScore: 90,
      quizPassed: true,
    },
    {
      chapterId: CAPS[1],
      status: ProgressStatus.IN_PROGRESS,
      startedAt: hace(1),
      completedAt: null,
      lastViewedAt: hace(0),
      lastVideoPositionSeconds: 9,
      quizScore: null,
      quizPassed: null,
    },
  ];
  for (const p of progreso) {
    const data = { ...p, enrollmentId: matricula.id, userId: lucia.id };
    await prisma.userChapterProgress.upsert({
      where: {
        enrollmentId_chapterId: {
          enrollmentId: matricula.id,
          chapterId: p.chapterId,
        },
      },
      create: data,
      update: data,
    });
  }

  // 4. Notas y marcadores de la alumna en el capítulo 2
  const nota = [
    "Gobernanza = quién decide, con qué información y cada cuánto.",
    "",
    "• Sin patrocinio ejecutivo, la transformación se queda en pilotos.",
    "• Comité mensual: prioriza iniciativas y corta las que no mueven indicadores.",
    "• Para la próxima clase: armar la matriz RACI de mi área.",
  ].join("\n");
  await prisma.userChapterNote.upsert({
    where: { userId_chapterId: { userId: lucia.id, chapterId: CAPS[1] } },
    create: {
      tenantId: TENANT,
      userId: lucia.id,
      courseId: COURSE,
      chapterId: CAPS[1],
      content: nota,
    },
    update: { content: nota },
  });
  await prisma.userChapterMarker.deleteMany({
    where: { userId: lucia.id, chapterId: CAPS[1] },
  });
  await prisma.userChapterMarker.createMany({
    data: [
      [125, "Qué es gobernanza"],
      [512, "Ejemplo: comité de transformación"],
      [1034, "Matriz RACI, repasar"],
    ].map(([timestampSeconds, note]) => ({
      tenantId: TENANT,
      userId: lucia.id,
      courseId: COURSE,
      chapterId: CAPS[1],
      timestampSeconds: Number(timestampSeconds),
      note: String(note),
    })),
  });

  // 5. Puntos, racha y logros
  const juego = [
    { userId: lucia.id, points: 340, currentStreak: 4, longestStreak: 6 },
    { userId: andrea.id, points: 210, currentStreak: 2, longestStreak: 3 },
  ];
  for (const g of juego) {
    const data = { ...g, tenantId: TENANT, lastActivityOn: hace(0) };
    await prisma.userGamification.upsert({
      where: { userId_tenantId: { userId: g.userId, tenantId: TENANT } },
      create: data,
      update: data,
    });
  }
  for (const [code, dias] of [
    ["FIRST_STEP", 5],
    ["STREAK_3", 1],
  ] as const) {
    await prisma.userAchievement.upsert({
      where: { userId_code: { userId: lucia.id, code } },
      create: { tenantId: TENANT, userId: lucia.id, code, earnedAt: hace(dias) },
      update: { earnedAt: hace(dias) },
    });
  }

  // 6. Plantilla de certificado (fondo diseñado + marcadores reales del editor)
  const ruta = process.env.CERT_FONDO;
  if (!ruta) throw new Error("Falta CERT_FONDO");
  const tipo = ruta.endsWith(".png") ? "png" : "jpeg";
  const backgroundImage = `data:image/${tipo};base64,${readFileSync(ruta).toString("base64")}`;
  const estilo = { underline: false, align: "center" as const };
  const config = {
    version: 2,
    canvas_width: 1200,
    canvas_height: 850,
    elements: [
      { key: "student_name", left: 200, top: 366, boxWidth: 800, fontSize: 50, fill: "#19315D", fontWeight: "normal", zIndex: 1, ...estilo },
      { key: "course_title", left: 200, top: 512, boxWidth: 800, fontSize: 30, fill: "#6F54BF", fontWeight: "bold", zIndex: 2, ...estilo },
      { key: "issue_date", left: 150, top: 640, boxWidth: 260, fontSize: 18, fill: "#19315D", fontWeight: "normal", zIndex: 3, ...estilo },
      { key: "teacher_name", left: 790, top: 640, boxWidth: 260, fontSize: 18, fill: "#19315D", fontWeight: "normal", zIndex: 4, ...estilo },
    ],
    textElements: [],
    imageElements: [],
  };
  await prisma.certificateTemplate.upsert({
    where: { courseId: COURSE },
    create: { courseId: COURSE, backgroundImage, config },
    update: { backgroundImage, config },
  });

  console.log(
    `demo lista en ${db}: nombres, videos, progreso, nota + 3 marcadores, puntos/logros, plantilla de certificado (${Math.round(backgroundImage.length / 1024)} KB)`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
