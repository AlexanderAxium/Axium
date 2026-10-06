"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { CaseContactCTA } from "~/components/axium/case-contact-cta";
import {
  ProcessSteps,
  ProofSlab,
  ServiceCard,
  ServiceWorkBand,
  TalkBand,
} from "~/components/axium/service-blocks";
import { ServiceFaqSection } from "~/components/axium/service-faq-section";
import { ServiceHero } from "~/components/axium/service-hero";
import { smoothEase } from "~/components/axium/service-shared";
import { SERVICES, type ServicePageData } from "~/data/services-data";
import { useTranslation } from "~/hooks/useTranslation";

const raw = SERVICES["ai-agentic-systems"];
if (!raw) throw new Error("Missing service data for ai-agentic-systems");
const data: ServicePageData = raw;
const ACCENT = "#7ECFC3";
const K = "ai-agentic-systems";

const IMG = "/images/servicios/";
const CARD_IMAGES = [
  `${IMG}ai-tarjeta-datos.jpg`,
  `${IMG}ai-tarjeta-stack.jpg`,
  `${IMG}ai-tarjeta-agentes.jpg`,
];
const WORK = [
  {
    slug: "feniz",
    cover: "/images/proyects/feniz/fz-portada-cifras-v2.jpg",
    pos: "58% center",
  },
  {
    slug: "ambientalpe",
    cover: "/images/proyects/ambientalpe/ambientalpe-hero.png",
  },
  {
    slug: "firstautomation",
    cover: "/images/proyects/firstautomation/firstautomation-home.jpg",
  },
  {
    // El hero de este caso ya aparece dentro de la losa final: aquí va su otra
    // vista, el tablero de pantallas, para que ninguna pieza repita sujeto.
    slug: "feedback-management",
    cover: "/images/proyects/feedback-management/feedback-management-desc.jpg",
    pos: "50% 28%",
  },
];

export function AiAgenticSystemsPage() {
  const { t } = useTranslation("services");
  const idx = [0, 1, 2];
  const four = [0, 1, 2, 3];
  const six = [0, 1, 2, 3, 4, 5];
  const wa = t(`${K}.whatsappMessage`);

  return (
    <>
      {/* ── S1: Hero (intacto) ─────────────────────────────────────────────── */}
      <ServiceHero data={data} slug={K} />

      {/* ── S2: Qué es — texto + pieza alta ────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-section">
          <div className="content-section">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_440px] lg:gap-20">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: smoothEase }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-0.5 w-7 rounded-full bg-accent" />
                  <span className="text-overline text-gray-500">
                    {t(`${K}.intro.overline`)}
                  </span>
                </div>
                <h2 className="text-heading-1 mb-6 text-gray-900">
                  {t(`${K}.intro.title`)}
                </h2>
                <p className="text-body mb-4 text-gray-500">
                  {t(`${K}.intro.p1`)}
                </p>
                <p className="text-body text-gray-500">{t(`${K}.intro.p2`)}</p>

                <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <p className="mb-2 text-5xl font-light leading-none text-gray-900">
                      2–4
                    </p>
                    <p className="text-body-sm text-gray-600">
                      {t(`${K}.intro.statA`)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <p className="mb-2 text-5xl font-light leading-none text-gray-900">
                      100<span className="text-accent">%</span>
                    </p>
                    <p className="text-body-sm text-gray-600">
                      {t(`${K}.intro.statB`)}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.figure
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
                className="m-0"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={`${IMG}ai-tres-sistemas.jpg`}
                    alt={t(`${K}.intro.caption`)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 440px"
                    quality={92}
                    priority
                    className="object-cover"
                  />
                </div>
                <figcaption className="text-body-sm mt-3 text-gray-400">
                  {t(`${K}.intro.caption`)}
                </figcaption>
              </motion.figure>
            </div>
          </div>
        </div>
      </section>

      {/* ── S3: Trabajo real ───────────────────────────────────────────────── */}
      <ServiceWorkBand
        overline={t(`${K}.work.overline`)}
        title={t(`${K}.work.title`)}
        lead={t(`${K}.work.lead`)}
        accent={ACCENT}
        cta={t("common.allCases")}
        waLabel={t("common.whatsapp")}
        waMessage={wa}
        items={WORK.map((w, i) => ({
          ...w,
          client: t(`${K}.workItems.${i}.client`),
          line: t(`${K}.workItems.${i}.line`),
        }))}
      />

      {/* ── S4: Servicios incluidos ────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container-section">
          <div className="content-section">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: smoothEase }}
              className="mb-12"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="h-0.5 w-7 rounded-full bg-accent" />
                <span className="text-overline text-gray-500">
                  {t(`${K}.offer.overline`)}
                </span>
              </div>
              <h2 className="text-heading-1 max-w-xl text-gray-900">
                {t(`${K}.offer.title`)}
              </h2>
            </motion.div>

            <div className="flex flex-col gap-16 md:gap-20">
              {idx.map((i) => (
                <ServiceCard
                  key={CARD_IMAGES[i]}
                  index={i + 1}
                  image={CARD_IMAGES[i] ?? ""}
                  alt={t(`${K}.cards.${i}.title`)}
                  kicker={t(`${K}.cards.${i}.kicker`)}
                  title={t(`${K}.cards.${i}.title`)}
                  text={t(`${K}.cards.${i}.text`)}
                  accent={ACCENT}
                  flip={i % 2 === 1}
                  waLabel={t("common.quote")}
                  waMessage={wa}
                  rows={[0, 1].map((j) => ({
                    tag: t(`${K}.cardRows.${i}.${j}.tag`),
                    title: t(`${K}.cardRows.${i}.${j}.title`),
                    desc: t(`${K}.cardRows.${i}.${j}.desc`),
                  }))}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── S5: Proceso ────────────────────────────────────────────────────── */}
      <section className="overflow-hidden bg-white py-16 md:py-24">
        <div className="container-section">
          <div className="content-section">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: smoothEase }}
              className="mb-12"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="h-0.5 w-7 rounded-full bg-accent" />
                <span className="text-overline text-gray-500">
                  {t(`${K}.process.overline`)}
                </span>
              </div>
              <h2 className="text-heading-1 max-w-xl text-gray-900">
                {t(`${K}.process.title`)}
              </h2>
            </motion.div>

            <ProcessSteps
              accent={ACCENT}
              steps={four.map((i) => ({
                title: t(`${K}.steps.${i}.title`),
                bullets: four.map((j) => t(`${K}.steps.${i}.bullets.${j}`)),
              }))}
            />
          </div>
        </div>
      </section>

      {/* ── S6: ¿Para quién es? — sobre la plancha honda ───────────────────── */}
      <section className="relative overflow-hidden bg-[#060C20] py-16 md:py-24">
        <Image
          src={`${IMG}ai-fondo-oscuro.jpg`}
          alt=""
          fill
          sizes="100vw"
          quality={86}
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,12,32,0.90) 0%, rgba(6,12,32,0.74) 46%, rgba(6,12,32,0.86) 100%)",
          }}
          aria-hidden
        />
        <div className="container-section relative z-10">
          <div className="content-section">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: smoothEase }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-0.5 w-7 rounded-full bg-accent" />
                  <span className="text-overline text-white/45">
                    {t(`${K}.who.overline`)}
                  </span>
                </div>
                <h2 className="text-heading-1 mb-6 text-white">
                  {t(`${K}.who.title`)}
                </h2>
                <p className="text-body text-white/55">{t(`${K}.who.lead`)}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {four.map((i) => (
                  <div
                    key={t(`${K}.whoCards.${i}.title`)}
                    className="rounded-xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-white/20"
                  >
                    <h3 className="text-heading-3 mb-2 text-white">
                      {t(`${K}.whoCards.${i}.title`)}
                    </h3>
                    <p className="text-body-sm text-white/55">
                      {t(`${K}.whoCards.${i}.description`)}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            <TalkBand
              lead={t("common.talkLead")}
              waLabel={t("common.whatsapp")}
              waMessage={wa}
              contactLabel={t("common.contactForm")}
            />
          </div>
        </div>
      </section>

      {/* ── S7: Capacidades técnicas ───────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-section">
          <div className="content-section">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: smoothEase }}
              className="mb-10"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="h-0.5 w-7 rounded-full bg-accent" />
                <span className="text-overline text-gray-500">
                  {t(`${K}.capabilities.overline`)}
                </span>
              </div>
              <h2 className="text-heading-1 max-w-xl text-gray-900">
                {t(`${K}.capabilities.title`)}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
              {six.map((i) => (
                <motion.div
                  key={t(`${K}.capabilityItems.${i}.title`)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.05,
                    ease: smoothEase,
                  }}
                  className="border-t border-gray-200 pt-5"
                >
                  <h3 className="text-heading-3 mb-2 text-gray-900">
                    {t(`${K}.capabilityItems.${i}.title`)}
                  </h3>
                  <p className="text-body-sm leading-relaxed text-gray-500">
                    {t(`${K}.capabilityItems.${i}.description`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── S8: La prueba ──────────────────────────────────────────────────── */}
      <ProofSlab
        overline={t(`${K}.proof.overline`)}
        title={t(`${K}.proof.title`)}
        text={t(`${K}.proof.text`)}
        image={`${IMG}ai-losa-operacion.jpg`}
        alt={t(`${K}.proof.title`)}
        accent={ACCENT}
      />

      {/* ── S9: FAQ ────────────────────────────────────────────────────────── */}
      <ServiceFaqSection
        faqs={six.map((i) => ({
          q: t(`${K}.faqs.${i}.q`),
          a: t(`${K}.faqs.${i}.a`),
        }))}
        accentColor={ACCENT}
        heading={t("common.faqHeading")}
        sectionLabel={t(`${K}.faqOverline`)}
        ctaTitle={t(`${K}.ctaTitle`)}
        ctaSubtitle={t(`${K}.ctaSubtitle`)}
        bg="bg-gray-50"
        whatsappMessage={wa}
        waLabel={t("common.whatsapp")}
      />

      {/* ── S10: CTA ───────────────────────────────────────────────────────── */}
      <CaseContactCTA />
    </>
  );
}
