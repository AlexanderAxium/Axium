"use client";

import { Calendar, Clock, Globe, Monitor } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

const smoothEase = [0.4, 0, 0.2, 1] as const;

interface CaseProjectAboutProps {
  children: ReactNode;
}

/** Contenedor de la sección "Sobre el proyecto" con estilo consistente. Usa los subcomponentes para armar el contenido. */
export function CaseProjectAbout({ children }: CaseProjectAboutProps) {
  return (
    <section className="bg-[#f8fafb] py-14 sm:py-18 lg:py-24">
      <div className="container-section">
        <div className="content-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: smoothEase }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Bloque: descripción principal */
export function CaseProjectAboutDescription({ content }: { content: string }) {
  return (
    <p className="text-body-lg leading-relaxed text-[#4a5568]">{content}</p>
  );
}

/** Bloque: chips de metadata (plataforma, duración, cliente) */
export function CaseProjectAboutMetadataChips({
  platform,
  duration,
  client,
  platformLabel = "Plataforma",
  durationLabel = "Duración",
  clientLabel = "Cliente",
}: {
  platform?: string;
  duration?: string;
  client?: string;
  platformLabel?: string;
  durationLabel?: string;
  clientLabel?: string;
}) {
  const items = [
    platform ? { icon: Monitor, label: platformLabel, value: platform } : null,
    duration ? { icon: Clock, label: durationLabel, value: duration } : null,
    client ? { icon: Globe, label: clientLabel, value: client } : null,
  ].filter(Boolean) as { icon: typeof Monitor; label: string; value: string }[];

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="inline-flex items-center gap-2 rounded-full border border-[#E5EAF3] bg-white px-3.5 py-1.5"
        >
          <Icon className="h-3.5 w-3.5 text-[#0072CF]" />
          <span className="text-pill text-[#8a919e]">{label}:</span>
          <span className="text-pill font-semibold text-[#060C20]">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Bloque: fecha de publicación */
export function CaseProjectAboutPublishedDate({ date }: { date: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-[#8a919e]">
      <Calendar className="h-3.5 w-3.5" />
      <span>{date}</span>
    </div>
  );
}

/** Bloque: texto con título opcional */
export function CaseProjectAboutText({
  title,
  content,
}: { title?: string; content: string }) {
  return (
    <div>
      {title && (
        <h3 className="text-body mb-2 font-semibold text-[#060C20]">{title}</h3>
      )}
      <p className="text-body-sm leading-relaxed text-[#4a5568]">{content}</p>
    </div>
  );
}

/** Bloque: lista de items */
export function CaseProjectAboutList({
  title,
  items,
}: {
  title?: string;
  items: string[];
}) {
  return (
    <div>
      {title && (
        <h3 className="text-body mb-3 font-semibold text-[#060C20]">{title}</h3>
      )}
      <ul className="list-inside list-disc space-y-2 text-body-sm text-[#4a5568]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/** Bloque: sidebar de datos clave (key-value) */
export function CaseProjectAboutQuickFacts({
  title = "Datos clave",
  items,
}: {
  title?: string;
  items: { label: string; value: string }[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="shrink-0 lg:w-[340px]">
      <div className="rounded-2xl border border-[#E5EAF3] bg-white p-6">
        <p className="text-overline mb-5 text-[#8a919e]">{title}</p>
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between border-b border-[#E5EAF3] pb-3 last:border-0 last:pb-0"
            >
              <span className="text-body-sm text-[#8a919e]">{item.label}</span>
              <span className="text-body font-semibold text-[#060C20]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Contenedor de la columna principal (izquierda). `label` defaults to "Sobre el proyecto"; pass `null` to hide. */
export function CaseProjectAboutMain({
  children,
  label = "Sobre el proyecto",
}: {
  children: ReactNode;
  label?: string | null;
}) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      {label && <p className="text-overline text-[#0072CF]">{label}</p>}
      {children}
    </div>
  );
}

/** Contenedor del layout de dos columnas */
export function CaseProjectAboutTwoColumn({
  children,
}: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">{children}</div>
  );
}

// Compound component API (fallback)
CaseProjectAbout.Description = CaseProjectAboutDescription;
CaseProjectAbout.MetadataChips = CaseProjectAboutMetadataChips;
CaseProjectAbout.PublishedDate = CaseProjectAboutPublishedDate;
CaseProjectAbout.Text = CaseProjectAboutText;
CaseProjectAbout.List = CaseProjectAboutList;
CaseProjectAbout.QuickFacts = CaseProjectAboutQuickFacts;
CaseProjectAbout.Main = CaseProjectAboutMain;
CaseProjectAbout.TwoColumn = CaseProjectAboutTwoColumn;
