/**
 * TEMPORAL (Axium, capturas para el portafolio). Solo BD LOCAL.
 * Siembra en «Rematch Corp» (tenant propio de la plataforma, no un cliente):
 *   - un admin local para iniciar sesión,
 *   - una academia de demo (adaptada de seed-villasmash-academy),
 *   - una liga de demo con 34 jugadores FICTICIOS (no toma usuarios reales).
 * Todo lleva marcadores para borrarlo:
 *   npx tsx --env-file=.env scripts/_axium-capturas.ts           # crea (rehace)
 *   npx tsx --env-file=.env scripts/_axium-capturas.ts --borrar  # solo borra
 */
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { prisma } from "../src/lib/db";
import {
  confirmResult,
  generateFixture,
  reportResult,
} from "../src/server/league/service";

if (!/localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL ?? "")) {
  throw new Error("ABORT: DATABASE_URL no es local.");
}

const TENANT_ID = "tenant-default-001"; // Rematch Corp
const CENTER_ID = "d20bf7a7-d25f-4ef9-ae02-5a40a9dcc370"; // Club Deportivo San Isidro
const PADEL_1 = "5c342390-829c-4ae6-847b-e53bed402805";
const PADEL_2 = "ad96524e-9f1e-462f-89a5-39edaf9bd104";
const FUTSAL = "13d89e06-f817-4747-bd26-9af07219ae35";
const MARK = "demo-axium-";
const USER_PREFIX = "demoaxium_";
export const ADMIN_EMAIL = "capturas.axium@demo.local";
export const ADMIN_PASS = "CapturasAxium2026!";

const DAY = 86_400_000;
const addDays = (b: Date, n: number) => new Date(b.getTime() + n * DAY);

async function borrar() {
  const res = await prisma.reservation.findMany({ where: { tenantId: TENANT_ID, notes: "demo-axium" }, select: { id: true } });
  if (res.length) {
    await prisma.fieldOccupancy.deleteMany({ where: { reservationId: { in: res.map((r) => r.id) } } });
    await prisma.reservation.deleteMany({ where: { id: { in: res.map((r) => r.id) } } });
  }
  const leagues = await prisma.league.findMany({
    where: { tenantId: TENANT_ID, slug: { startsWith: MARK } },
    select: { id: true },
  });
  for (const l of leagues) await prisma.league.delete({ where: { id: l.id } });

  const users = await prisma.user.findMany({
    where: { username: { startsWith: USER_PREFIX } },
    select: { id: true },
  });
  const ids = users.map((u) => u.id);
  if (ids.length) {
    await prisma.attendance.deleteMany({ where: { userId: { in: ids } } });
    await prisma.payment.deleteMany({
      where: { subscription: { userId: { in: ids } } },
    });
    await prisma.subscription.deleteMany({ where: { userId: { in: ids } } });
    await prisma.enrollment.deleteMany({ where: { userId: { in: ids } } });
  }
  const academies = await prisma.academy.findMany({
    where: { tenantId: TENANT_ID, slug: { startsWith: MARK } },
    select: { id: true },
  });
  for (const a of academies) {
    const courses = await prisma.course.findMany({
      where: { academyId: a.id },
      select: { id: true },
    });
    const cIds = courses.map((c) => c.id);
    await prisma.attendance.deleteMany({
      where: { session: { courseId: { in: cIds } } },
    });
    await prisma.classSession.deleteMany({ where: { courseId: { in: cIds } } });
    await prisma.classSchedule.deleteMany({ where: { courseId: { in: cIds } } });
    await prisma.membershipPlan.deleteMany({ where: { academyId: a.id } });
    await prisma.course.deleteMany({ where: { academyId: a.id } });
    await prisma.venue.deleteMany({ where: { academyId: a.id } });
    await prisma.academy.delete({ where: { id: a.id } });
  }
  if (ids.length) {
    // hijos gestionados primero (guardianId)
    await prisma.user.deleteMany({
      where: { id: { in: ids }, guardianId: { not: null } },
    });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
  }
  await prisma.user.deleteMany({ where: { email: ADMIN_EMAIL } });
  console.log(
    `borrado: ${leagues.length} liga(s), ${academies.length} academia(s), ${ids.length} usuarios demo, admin local`
  );
}

async function admin() {
  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      username: `${USER_PREFIX}admin`,
      name: "Equipo Axium",
      type: "TENANT_ADMIN",
      tenantId: TENANT_ID,
      emailVerified: true,
      accounts: {
        create: {
          accountId: ADMIN_EMAIL,
          providerId: "credential",
          password: await hashPassword(ADMIN_PASS),
        },
      },
    },
  });
}

async function academia() {
  const now = new Date();
  const escuela = await prisma.academy.create({
    data: {
      tenantId: TENANT_ID,
      slug: `${MARK}escuela-padel`,
      name: "Escuela de Pádel",
      description: "Formación por niveles para niños y adultos.",
    },
  });
  const futbol = await prisma.academy.create({
    data: {
      tenantId: TENANT_ID,
      slug: `${MARK}academia-futbol`,
      name: "Academia de Fútbol",
      description: "Futsal formativo para categorías menores.",
    },
  });
  const sede = (academyId: string) =>
    prisma.venue.create({
      data: {
        academyId,
        kind: "OWN_CENTER",
        sportCenterId: CENTER_ID,
        name: "Club Deportivo San Isidro",
      },
      select: { id: true },
    });
  const sedeEscuela = await sede(escuela.id);
  const sedeFutbol = await sede(futbol.id);

  const cIni = await prisma.course.create({
    data: {
      academyId: escuela.id,
      venueId: sedeEscuela.id,
      sport: "PADEL",
      name: "Iniciación Lun/Mié 6pm",
      level: "Principiante",
      capacity: 8,
    },
  });
  const cInt = await prisma.course.create({
    data: {
      academyId: escuela.id,
      venueId: sedeEscuela.id,
      sport: "PADEL",
      name: "Intermedio Mar/Jue 7pm",
      level: "Intermedio",
      capacity: 8,
    },
  });
  const cFut = await prisma.course.create({
    data: {
      academyId: futbol.id,
      venueId: sedeFutbol.id,
      sport: "FUTSAL",
      name: "Futsal Sub-12 Sáb 9am",
      level: "Formativo",
      capacity: 16,
    },
  });

  // La forma del plan se deriva de classCredits + validityDays (src/lib/academy/plan.ts).
  const pack8 = await prisma.membershipPlan.create({
    data: {
      academyId: escuela.id,
      name: "Pack 8 clases",
      price: 280,
      classCredits: 8,
      validityDays: 60,
    },
  });
  await prisma.membershipPlan.create({
    data: {
      academyId: escuela.id,
      name: "Mensual",
      price: 240,
      classCredits: null,
      validityDays: 30,
      autoRenew: true,
    },
  });
  await prisma.membershipPlan.create({
    data: {
      academyId: escuela.id,
      name: "Clase suelta",
      price: 45,
      classCredits: 1,
      validityDays: 1,
    },
  });
  const futMensual = await prisma.membershipPlan.create({
    data: {
      academyId: futbol.id,
      name: "Mensual Futsal",
      price: 150,
      classCredits: null,
      validityDays: 30,
      weeklyClasses: 1,
      autoRenew: true,
    },
  });

  async function alumno(
    name: string,
    opts: { dni?: string; managed?: boolean; guardianId?: string } = {}
  ) {
    return prisma.user.create({
      data: {
        name,
        email: `demoaxium-${randomUUID()}@no-reply.rematch.local`,
        emailVerified: true,
        username: `${USER_PREFIX}${randomUUID().slice(0, 10)}`,
        type: "CLIENT",
        isManaged: opts.managed ?? false,
        dni: opts.dni,
        guardianId: opts.guardianId,
      },
      select: { id: true },
    });
  }
  const madre = await alumno("Carla Mendoza", { dni: "99110099" });
  const h1 = await alumno("Bruno Mendoza", { managed: true, guardianId: madre.id });
  const h2 = await alumno("Sofía Mendoza", { managed: true, guardianId: madre.id });
  const otros = await Promise.all(
    [
      "Andrés Paredes",
      "Lucía Navarro",
      "Gonzalo Benites",
      "Renata Cáceres",
      "Íñigo Salazar",
      "Daniela Cuadros",
      "Tomás Villena",
      "Paula Espinoza",
      "Martín Oré",
      "Ximena Tello",
      "Nicolás Arce",
      "Ariana Gutiérrez",
    ].map((n, i) => alumno(n, { dni: `9911${(1000 + i).toString()}` }))
  );
  const todos = [h1, h2, ...otros];
  const courseIds = [cIni.id, cInt.id, cFut.id];
  const cursoDe = (i: number) => courseIds[i % courseIds.length] ?? cIni.id;
  await prisma.enrollment.createMany({
    data: todos.map((s, i) => ({ userId: s.id, courseId: cursoDe(i) })),
  });
  for (const [i, s] of todos.entries()) {
    const plan = cursoDe(i) === cFut.id ? futMensual : pack8;
    await prisma.subscription.create({
      data: {
        userId: s.id,
        planId: plan.id,
        startDate: addDays(now, -12),
        endDate: addDays(now, plan.validityDays - 12),
        creditsTotal: plan.classCredits,
        creditsUsed: 0,
        status: "ACTIVE",
      },
    });
  }
  await prisma.classSchedule.create({
    data: {
      courseId: cIni.id,
      day: "MONDAY",
      startHour: "18:00",
      endHour: "19:30",
      fields: { create: [{ fieldId: PADEL_1 }] },
    },
  });
  await prisma.classSchedule.create({
    data: {
      courseId: cIni.id,
      day: "WEDNESDAY",
      startHour: "18:00",
      endHour: "19:30",
      fields: { create: [{ fieldId: PADEL_1 }] },
    },
  });
  await prisma.classSchedule.create({
    data: {
      courseId: cInt.id,
      day: "TUESDAY",
      startHour: "19:00",
      endHour: "20:30",
      fields: { create: [{ fieldId: PADEL_2 }] },
    },
  });
  await prisma.classSchedule.create({
    data: {
      courseId: cFut.id,
      day: "SATURDAY",
      startHour: "09:00",
      endHour: "11:00",
      fields: { create: [{ fieldId: FUTSAL }] },
    },
  });
  const sesiones = [];
  for (const offset of [-9, -7, -2, 0, 2, 5, 7]) {
    const d = addDays(now, offset);
    const start = new Date(d);
    start.setHours(18, 0, 0, 0);
    const end = new Date(d);
    end.setHours(19, 30, 0, 0);
    const s = await prisma.classSession.create({
      data: {
        courseId: cIni.id,
        startDate: start,
        endDate: end,
        status: start < now ? "HELD" : "SCHEDULED",
        fields: { create: [{ fieldId: PADEL_1 }] },
      },
      select: { id: true, startDate: true },
    });
    sesiones.push(s);
  }
  const iniAlumnos = todos.filter((_s, i) => cursoDe(i) === cIni.id);
  for (const ses of sesiones.filter((x) => x.startDate < now)) {
    for (const [j, st] of iniAlumnos.entries()) {
      const sub = await prisma.subscription.findFirst({
        where: { userId: st.id, status: "ACTIVE" },
        select: { id: true, creditsTotal: true },
      });
      const presente = (j + ses.startDate.getDate()) % 5 !== 0;
      await prisma.attendance.create({
        data: {
          sessionId: ses.id,
          userId: st.id,
          status: presente ? "PRESENT" : "ABSENT",
          consumedSubscriptionId: presente ? (sub?.id ?? null) : null,
        },
      });
      if (presente && sub?.creditsTotal != null) {
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { creditsUsed: { increment: 1 } },
        });
      }
    }
  }
  console.log(`academia: 2 academias · 3 cursos · ${todos.length} alumnos`);
}

const JUGADORES = [
  "Álvaro Castañeda", "Bianca Herrera", "Carlos Mestanza", "Diana Olivos",
  "Esteban Ruiz", "Fiorella Campos", "Gabriel Lozano", "Hilda Quintana",
  "Iván Zegarra", "Julia Bustamante", "Kevin Palomino", "Lorena Aguirre",
  "Manuel Cárdenas", "Nadia Pinedo", "Óscar Villanueva", "Patricia Sotelo",
  "Rafael Montoya", "Silvana Uceda", "Tadeo Arroyo", "Úrsula Medina",
  "Víctor Galarza", "Wendy Carrillo", "Yahir Del Castillo", "Zoe Llanos",
  "Adrián Portocarrero", "Belén Saavedra", "César Talavera", "Denisse Rivas",
  "Emilio Chirinos", "Florencia Mujica", "Gerardo Tapia", "Heidi Roncal",
  "Ignacio Barrenechea", "Jimena Olaechea",
];

async function liga() {
  const ids: string[] = [];
  for (const [n, name] of JUGADORES.entries()) {
    const u = await prisma.user.create({
      data: {
        email: `demoaxium-liga-${n}@demo.local`,
        username: `${USER_PREFIX}liga_${n}`,
        name,
        type: "CLIENT",
        emailVerified: true,
      },
      select: { id: true },
    });
    ids.push(u.id);
  }
  const league = await prisma.league.create({
    data: {
      tenantId: TENANT_ID,
      name: "Liga Sabatina de Tenis de Mesa",
      slug: `${MARK}liga-sabatina`,
      description:
        "Liga por divisiones: los partidos se coordinan entre jugadores y cada ronda suben y bajan dos.",
      seasons: {
        create: {
          name: "Ronda 3",
          number: 3,
          startDate: new Date(),
          endDate: new Date(Date.now() + 42 * DAY),
          status: "DRAFT",
          divisions: {
            create: Array.from({ length: 6 }, (_, i) => ({
              level: i + 1,
              name: `División ${i + 1}`,
            })),
          },
        },
      },
    },
    select: {
      id: true,
      seasons: {
        select: {
          id: true,
          divisions: { orderBy: { level: "asc" }, select: { id: true } },
        },
      },
    },
  });
  const season = league.seasons[0];
  if (!season) throw new Error("sin temporada");
  const sizes = [6, 6, 6, 6, 5, 5];
  let k = 0;
  for (const [i, d] of season.divisions.entries()) {
    const members = ids.slice(k, k + (sizes[i] ?? 5));
    k += sizes[i] ?? 5;
    await prisma.leagueEntry.createMany({
      data: members.map((userId, j) => ({
        divisionId: d.id,
        userId,
        movement: j % 5 === 0 ? "PROMOTED" : j % 4 === 0 ? "RELEGATED" : "STAYED",
        availability:
          j % 2 === 0
            ? {
                note: "",
                slots: [
                  { day: "TUESDAY", startHour: "18:00", endHour: "20:00" },
                  { day: "SATURDAY", startHour: "09:00", endHour: "13:00" },
                ],
              }
            : undefined,
      })),
    });
  }
  const partidos = await generateFixture(season.id);
  await prisma.leagueSeason.update({
    where: { id: season.id },
    data: { status: "ACTIVE", activeRound: 1 },
  });
  // Resultados cargados por el organizador (quedan JUGADOS) en las tres
  // primeras divisiones, para que la tabla tenga puntos y movimientos.
  const staff = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL }, select: { id: true } });
  if (!staff) throw new Error("falta el admin local");
  for (const div of season.divisions.slice(0, 3)) {
    const ms = await prisma.leagueMatch.findMany({
      where: { divisionId: div.id },
      select: { id: true },
      orderBy: { id: "asc" },
      take: 6,
    });
    for (const [x, m] of ms.entries()) {
      const sets =
        x % 3 === 0
          ? [{ home: 11, away: 7 }, { home: 9, away: 11 }, { home: 11, away: 8 }, { home: 11, away: 6 }]
          : x % 3 === 1
            ? [{ home: 8, away: 11 }, { home: 11, away: 13 }, { home: 11, away: 9 }, { home: 7, away: 11 }]
            : [{ home: 11, away: 5 }, { home: 11, away: 9 }, { home: 12, away: 10 }];
      await reportResult({ matchId: m.id, userId: staff.id, asStaff: true, result: { sets } });
    }
  }
  void confirmResult;
  console.log(`liga: 6 divisiones · 34 jugadores ficticios · ${partidos} partidos`);
}

const RES_MARK = "demo-axium";
const LIMA_OFFSET_H = 5; // America/Lima = UTC-5, sin horario de verano

/** Instante UTC de una hora civil de Lima en el día (offset en días desde hoy en Lima). */
function limaInstant(dayOffset: number, hour: number, minute = 0) {
  const nowLima = new Date(Date.now() - LIMA_OFFSET_H * 3600_000);
  return new Date(
    Date.UTC(
      nowLima.getUTCFullYear(),
      nowLima.getUTCMonth(),
      nowLima.getUTCDate() + dayOffset,
      hour + LIMA_OFFSET_H,
      minute
    )
  );
}

/**
 * Reservas de demo en todas las canchas de Rematch Corp: hoy y los últimos 25
 * días (para que el calendario, el inicio y los reportes tengan vida), con los
 * jugadores ficticios de la liga como clientes. Cada reserva lleva su
 * FieldOccupancy (la única fuente de verdad de la disponibilidad), y las clases
 * de demo de la academia también ocupan su cancha.
 */
async function reservas() {
  const prev = await prisma.reservation.findMany({ where: { tenantId: TENANT_ID, notes: RES_MARK }, select: { id: true } });
  const prevIds = prev.map((r) => r.id);
  if (prevIds.length) {
    await prisma.fieldOccupancy.deleteMany({ where: { reservationId: { in: prevIds } } });
    await prisma.reservation.deleteMany({ where: { id: { in: prevIds } } });
  }
  const fields = await prisma.field.findMany({
    where: { tenantId: TENANT_ID },
    select: { id: true, price: true },
    orderBy: { name: "asc" },
  });
  const players = await prisma.user.findMany({
    where: { username: { startsWith: `${USER_PREFIX}liga_` } },
    select: { id: true },
  });
  const now = Date.now();
  // [hora, minuto, duración en minutos] — sin solapes dentro de una cancha
  const SLOTS: [number, number, number][] = [[8, 0, 60], [10, 0, 90], [16, 0, 60], [18, 0, 90], [20, 0, 60]];
  let n = 0;
  for (let day = -25; day <= 1; day++) {
    for (const [fi, f] of fields.entries()) {
      for (const [si, [h, m, dur]] of SLOTS.entries()) {
        // densidad: hoy y mañana más llenos; días pasados, uno de cada tres
        const seed = (fi * 7 + si * 3 + (day + 30) * 5) % 10;
        const take = day >= 0 ? seed < 6 : seed < 3;
        if (!take) continue;
        if (f.id === PADEL_1 && h >= 17 && h <= 19) continue; // clases de la academia
        const start = limaInstant(day, h, m);
        const end = new Date(start.getTime() + dur * 60_000);
        const player = players.length ? players[(fi + si + day + 40) % players.length] : undefined;
        const status =
          end.getTime() < now ? (seed === 0 ? "NO_SHOW" : "COMPLETED") : seed === 5 ? "PENDING" : "CONFIRMED";
        const amount = Number(f.price ?? 60) * (dur / 60);
        const r = await prisma.reservation.create({
          data: {
            tenantId: TENANT_ID,
            fieldId: f.id,
            startDate: start,
            endDate: end,
            amount,
            status,
            notes: RES_MARK,
            ...(player && si !== 2 ? { userId: player.id } : { guestName: "Cliente de mostrador" }),
          },
          select: { id: true },
        });
        if (status !== "CANCELLED" && status !== "NO_SHOW") {
          await prisma.fieldOccupancy.create({
            data: { fieldId: f.id, startsAt: start, endsAt: end, sourceType: "RESERVATION", reservationId: r.id },
          });
        }
        n++;
      }
    }
  }
  // Las clases de demo también ocupan su cancha.
  const sesiones = await prisma.classSession.findMany({
    where: { course: { academy: { tenantId: TENANT_ID, slug: { startsWith: MARK } } } },
    select: { id: true, startDate: true, endDate: true, fields: { select: { fieldId: true } } },
  });
  let occ = 0;
  for (const s of sesiones) {
    for (const sf of s.fields) {
      const exists = await prisma.fieldOccupancy.findFirst({ where: { classSessionId: s.id, fieldId: sf.fieldId } });
      if (exists) continue;
      await prisma.fieldOccupancy
        .create({ data: { fieldId: sf.fieldId, startsAt: s.startDate, endsAt: s.endDate, sourceType: "CLASS_SESSION", classSessionId: s.id } })
        .then(() => occ++)
        .catch(() => {});
    }
  }
  console.log(`reservas: ${n} en ${fields.length} canchas · ${occ} ocupaciones de clases`);
}

async function main() {
  if (process.argv.includes("--reservas")) {
    await reservas();
    return;
  }
  // --liga: rehace solo la liga (conserva admin y academia)
  if (process.argv.includes("--liga")) {
    const ls = await prisma.league.findMany({ where: { tenantId: TENANT_ID, slug: { startsWith: MARK } }, select: { id: true } });
    for (const l of ls) await prisma.league.delete({ where: { id: l.id } });
    await prisma.user.deleteMany({ where: { username: { startsWith: `${USER_PREFIX}liga_` } } });
    await liga();
    return;
  }
  await borrar();
  if (process.argv.includes("--borrar")) return;
  await admin();
  await academia();
  await liga();
  console.log(`admin local: ${ADMIN_EMAIL}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
