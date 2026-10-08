"use client";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { smoothEase } from "~/components/axium/service-shared";

/**
 * Bloques comunes a las tres páginas de servicio.
 *
 * El diagnóstico de partida era que las tres páginas tenían CERO imágenes: cuatro
 * bandas alternas de texto con iconos. Medidas las cinco referencias que pasó
 * Alexander (brandvm 53 % del alto en imagen, basicagency 57 %, viget 37 %,
 * barrelny 32 %), la corrección no es podar texto —escribimos menos palabras por
 * 1.000 px que las cinco— sino meter pieza grande y real.
 *
 * Cada bloque de aquí es uno de los recursos que usan esas referencias:
 *  · WorkBand    — la tira de trabajo real a sangre nada más entrar (barrelny)
 *  · ServiceCard — la tarjeta grande con la pieza al lado del texto (brandvm, basicagency)
 *  · ProcessSteps— los cuatro pasos, sin imagen (ver abajo)
 *  · ProofSlab   — la losa partida final, con la calle horneada en el archivo
 *
 * ⚠️ 2026-10-03, corrección de Alexander: *«estas imágenes no tienen sentido»*, sobre
 * las teselas del proceso. La causa, en una línea: **copié la FORMA de barrelny —una
 * tesela por paso— sin su contenido.** Las suyas llevan una figura gráfica; las mías
 * eran cuatro recortes del MISMO suelo vacío con un número encima, o sea campo sin
 * sujeto, y además la misma foto cuatro veces. Un campo es el suelo de una pieza,
 * nunca la pieza. Un paso de proceso es una actividad, no un entregable: no hay
 * material real que lo pruebe, así que **no lleva imagen** (viget tampoco ilustra su
 * proceso). Menos piezas y que se entiendan.
 */

/** Botón de WhatsApp con el mensaje propio del servicio. 44 px de alto mínimo. */
export function WhatsAppButton({
  label,
  message,
  tone = "claro",
  className = "",
}: {
  label: string;
  message: string;
  tone?: "claro" | "oscuro" | "solido";
  className?: string;
}) {
  const estilo =
    tone === "solido"
      ? "bg-gray-900 text-white hover:bg-gray-800"
      : tone === "oscuro"
        ? "border border-white/20 bg-white/10 text-white hover:bg-white/20"
        : "border border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:bg-gray-50";
  return (
    <a
      href={`https://wa.me/51991285679?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noreferrer"
      className={`text-body-sm inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 font-semibold transition-colors ${estilo} ${className}`}
    >
      <MessageCircle className="h-4 w-4 flex-shrink-0" />
      {label}
    </a>
  );
}

/** Enlace al formulario de contacto del pie de la página. */
export function ContactButton({
  label,
  tone = "claro",
}: {
  label: string;
  tone?: "claro" | "oscuro";
}) {
  const estilo =
    tone === "oscuro"
      ? "border border-white/15 text-white/80 hover:text-white"
      : "border border-gray-300 text-gray-700 hover:text-gray-900";
  return (
    <a
      href="#contacto"
      className={`text-body-sm inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 font-medium transition-colors ${estilo}`}
    >
      {label}
      <ArrowUpRight className="h-4 w-4 flex-shrink-0" />
    </a>
  );
}

/**
 * Un vídeo en bucle con su póster: solo corre mientras está en pantalla y, con movimiento
 * reducido, se queda en el póster. Para piezas que son la interfaz o el sistema HACIENDO
 * algo (2026-10-07, AI & Agentic Systems: «en vez de poner imágenes y capturas sin sentido…
 * haz animaciones»).
 */
export function VideoBucle({
  src,
  poster,
  alt,
  className = "",
}: {
  src: string;
  poster: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className={`absolute inset-0 size-full object-cover ${className}`}
      src={src}
      poster={poster}
      aria-label={alt}
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

export interface WorkItem {
  slug: string;
  cover: string;
  client: string;
  line: string;
  /** object-position del recorte, cuando el centro corta algo que debe leerse. */
  pos?: string;
}

/** Tira de cuatro portadas reales, a sangre, sin hueco entre ellas. */
export function ServiceWorkBand({
  overline,
  title,
  lead,
  items,
  accent,
  cta,
  waLabel,
  waMessage,
}: {
  overline: string;
  title: string;
  lead: string;
  items: WorkItem[];
  accent: string;
  cta: string;
  waLabel: string;
  waMessage: string;
}) {
  return (
    <section className="bg-[#0A1020] pt-14 md:pt-20">
      <div className="container-section">
        <div className="content-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, ease: smoothEase }}
            className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="h-0.5 w-7 rounded-full"
                  style={{ background: accent }}
                />
                <span className="text-overline text-white/45">{overline}</span>
              </div>
              <h2 className="text-heading-1 max-w-xl text-white">{title}</h2>
            </div>
            <p className="text-body-sm max-w-sm text-white/55">{lead}</p>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.slug}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: smoothEase }}
            className="group relative"
          >
            <Link href={`/casos-de-exito/${it.slug}`} className="block">
              <div className="relative aspect-[4/5] overflow-hidden lg:aspect-[5/4]">
                <Image
                  src={it.cover}
                  alt={it.client}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  quality={90}
                  style={{ objectPosition: it.pos ?? "center" }}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(10,16,32,0) 38%, rgba(10,16,32,0.55) 70%, rgba(10,16,32,0.92) 100%)",
                  }}
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="text-body-sm font-semibold text-white">
                    {it.client}
                  </p>
                  <p className="mt-1 text-[12px] leading-snug text-white/65">
                    {it.line}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="container-section">
        <div className="content-section">
          <div className="flex flex-col items-center justify-center gap-3 py-7 sm:flex-row md:py-9">
            <Link
              href="/portafolio"
              className="text-body-sm inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              {cta}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <WhatsAppButton
              label={waLabel}
              message={waMessage}
              tone="oscuro"
              className="w-full justify-center sm:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export interface WorkShowcaseItem {
  slug: string;
  cover: string;
  /** object-position del recorte, cuando el centro corta algo que debe leerse. */
  pos?: string;
  /** Lo que podemos construir: «Plataformas SaaS», «Tiendas online a medida»… */
  title: string;
  text: string;
  /** El ejemplo real y un dato suyo sacado de la ficha (nunca inventado). */
  client: string;
  fact: string;
}

/**
 * Qué construimos, con un ejemplo real por tipo (Software Development, 2026-10-07).
 * Alexander, en tres vueltas: «mejora esta presentación», «no exageres, la forma horizontal
 * estaba bien» y «enfócate en lo que podemos hacer con ejemplos reales; busca referencias de
 * empresas grandes». BairesDev y Netguru ordenan el servicio por LO QUE CONSTRUYEN (web, SaaS,
 * e-commerce, sistemas internos, integraciones) y prueban cada cosa con cliente + un dato
 * («OLX: 21 % más conversión»). Aquí: una fila de cuatro tipos, cada uno con la portada de su
 * ejemplo entera a 4:3, el tipo como título y abajo «Ejemplo: Cliente — dato». En móvil, la fila
 * se desliza en horizontal en vez de apilarse.
 */
export function ServiceWorkShowcase({
  overline,
  title,
  lead,
  items,
  accent,
  exampleLabel,
  cta,
  waLabel,
  waMessage,
}: {
  overline: string;
  title: string;
  lead: string;
  items: WorkShowcaseItem[];
  accent: string;
  exampleLabel: string;
  cta: string;
  waLabel: string;
  waMessage: string;
}) {
  return (
    <section className="bg-[#0A1020] py-16 md:py-20">
      <div className="container-section">
        <div className="content-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, ease: smoothEase }}
            className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="h-0.5 w-7 rounded-full"
                  style={{ background: accent }}
                />
                <span className="text-overline text-white/45">{overline}</span>
              </div>
              <h2 className="text-heading-1 max-w-xl text-white">{title}</h2>
            </div>
            <p className="text-body-sm max-w-sm text-white/55">{lead}</p>
          </motion.div>

          <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-x-5 md:gap-y-10 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
            {items.map((it, i) => (
              <motion.div
                key={it.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.07,
                  ease: smoothEase,
                }}
                className="w-[78%] shrink-0 snap-start sm:w-[46%] md:w-auto"
              >
                <Link
                  href={`/casos-de-exito/${it.slug}`}
                  className="group flex h-full flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08]">
                    <Image
                      src={it.cover}
                      alt={`${it.title} — ${it.client}`}
                      fill
                      sizes="(max-width: 768px) 78vw, (max-width: 1024px) 50vw, 25vw"
                      quality={88}
                      style={{ objectPosition: it.pos ?? "center" }}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="text-heading-3 mt-5 text-white">{it.title}</h3>
                  <p className="text-body-sm mt-2 mb-5 text-white/55">
                    {it.text}
                  </p>
                  <p className="mt-auto flex items-start gap-2 border-t border-white/10 pt-4 text-[13px] leading-snug text-white/45">
                    <span className="min-h-[2lh] min-w-0 flex-1">
                      {exampleLabel}{" "}
                      <span className="font-medium text-white/85 transition-colors group-hover:text-white">
                        {it.client}
                      </span>{" "}
                      — {it.fact}
                    </span>
                    <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/50 transition-colors group-hover:text-white" />
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-3 pt-10 sm:flex-row md:pt-14">
            <Link
              href="/portafolio"
              className="text-body-sm inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              {cta}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <WhatsAppButton
              label={waLabel}
              message={waMessage}
              tone="oscuro"
              className="w-full justify-center sm:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Tarjeta grande: la pieza a un lado, el texto y dos filas de servicio al otro. */
export function ServiceCard({
  index,
  image,
  video,
  alt,
  kicker,
  title,
  text,
  rows,
  accent,
  flip,
  waLabel,
  waMessage,
}: {
  index: number;
  image: string;
  /** Si va, la pieza es este vídeo y `image` es su póster. */
  video?: string;
  alt: string;
  kicker: string;
  title: string;
  text: string;
  rows: { tag: string; title: string; desc: string }[];
  accent: string;
  flip: boolean;
  waLabel: string;
  waMessage: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: smoothEase }}
      className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14"
    >
      <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <div className="relative aspect-[10/7] w-full overflow-hidden rounded-2xl">
          {video ? (
            <VideoBucle src={video} poster={image} alt={alt} />
          ) : (
            <Image
              src={image}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              quality={92}
              className="object-cover"
            />
          )}
        </div>
      </div>

      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <div className="mb-4 flex items-center gap-3">
          <span
            className="h-0.5 w-7 rounded-full"
            style={{ background: accent }}
          />
          <span className="text-overline text-gray-500">{kicker}</span>
          <span className="text-overline text-gray-300">
            {String(index).padStart(2, "0")}
          </span>
        </div>
        <h3 className="text-heading-2 mb-4 text-gray-900">{title}</h3>
        <p className="text-body text-gray-500">{text}</p>

        <div className="mt-7 divide-y divide-gray-200 border-y border-gray-200">
          {rows.map((r) => (
            <div key={r.title} className="py-4">
              <div className="mb-1 flex items-baseline gap-3">
                <span
                  className="text-overline flex-shrink-0"
                  style={{ color: accent }}
                >
                  {r.tag}
                </span>
                <p className="text-body font-medium text-gray-900">{r.title}</p>
              </div>
              <p className="text-body-sm leading-relaxed text-gray-500">
                {r.desc}
              </p>
            </div>
          ))}
        </div>

        <WhatsAppButton
          label={waLabel}
          message={waMessage}
          tone="solido"
          className="mt-6"
        />
      </div>
    </motion.article>
  );
}

/**
 * Los cuatro pasos. SIN imagen, y a propósito: un paso de proceso es una actividad,
 * no un entregable, así que no hay material real que lo pruebe. Lo que había antes
 * —una tesela de suelo vacío con el número encima— era campo sin sujeto y las cuatro
 * se leían como la misma foto repetida. Aquí el peso lo lleva el número y la retícula.
 */
export function ProcessSteps({
  steps,
  accent,
}: {
  steps: { title: string; bullets: string[] }[];
  accent: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <motion.div
          key={s.title}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: i * 0.08, ease: smoothEase }}
          className="flex flex-col border-t-2 pt-5"
          style={{ borderTopColor: accent }}
        >
          <p className="mb-4 text-5xl font-light leading-none text-gray-200 sm:text-6xl">
            {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="text-heading-3 mb-3 text-gray-900">{s.title}</h3>
          <ul className="space-y-1.5">
            {s.bullets.map((b) => (
              <li
                key={b}
                className="text-body-sm flex items-start gap-2 text-gray-500"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ background: accent }}
                />
                {b}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

/** Cierre de la sección oscura: la frase y los dos botones donde se decide. */
export function TalkBand({
  lead,
  waLabel,
  waMessage,
  contactLabel,
}: {
  lead: string;
  waLabel: string;
  waMessage: string;
  contactLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: 0.12, ease: smoothEase }}
      className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between"
    >
      <p className="text-body max-w-md text-white/70">{lead}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <WhatsAppButton
          label={waLabel}
          message={waMessage}
          tone="oscuro"
          className="justify-center"
        />
        <ContactButton label={contactLabel} tone="oscuro" />
      </div>
    </motion.div>
  );
}

/** La losa partida final: dos mitades a sangre con la calle horneada en el archivo. */
export function ProofSlab({
  overline,
  title,
  text,
  image,
  video,
  alt,
  accent,
}: {
  overline: string;
  title: string;
  text: string;
  image: string;
  /** Si va, la losa es este vídeo y `image` es su póster. */
  video?: string;
  alt: string;
  accent: string;
}) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-section">
        <div className="content-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, ease: smoothEase }}
            className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="h-0.5 w-7 rounded-full"
                  style={{ background: accent }}
                />
                <span className="text-overline text-gray-500">{overline}</span>
              </div>
              <h2 className="text-heading-1 max-w-xl text-gray-900">{title}</h2>
            </div>
            <p className="text-body-sm max-w-sm text-gray-500">{text}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08, ease: smoothEase }}
            className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl"
          >
            {video ? (
              <VideoBucle src={video} poster={image} alt={alt} />
            ) : (
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(max-width: 1280px) 100vw, 1200px"
                quality={92}
                className="object-cover"
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
