"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  ANCLA_SERVICIO,
  SERVICIOS_DEL_CASO,
  type SlugCaso,
} from "~/data/servicios-del-caso";
import { rutaServicio } from "~/data/servicios-paginas";
import { useTranslation } from "~/hooks/useTranslation";
import { type TextoPorIdioma, textoEn } from "~/lib/alt";

const TITULO: TextoPorIdioma = {
  es: "Servicios de este proyecto",
  en: "Services in this project",
  pt: "Serviços deste projeto",
};

/**
 * «Servicios de este proyecto»: el puente de cada caso de éxito a la página de los servicios que
 * se usaron (SEO-78). Va justo antes del formulario de contacto, en todas las fichas; los servicios
 * salen de SERVICIOS_DEL_CASO.
 */
export function ServiciosDelCaso({ caso }: { caso: SlugCaso }) {
  const { locale } = useTranslation("landing");
  const servicios = SERVICIOS_DEL_CASO[caso];
  const id = `servicios-del-caso-${caso}`;

  return (
    <section
      aria-labelledby={id}
      data-nav-theme="light"
      className="w-full bg-white"
    >
      <div className="container-section">
        <div className="content-section border-t border-[#e2e8f0] pt-10 md:pt-14">
          <h2 id={id} className="text-overline mb-4 text-[#0072CF]">
            {textoEn(TITULO, locale)}
          </h2>
          <ul className="flex flex-wrap gap-3">
            {servicios.map((s) => (
              <li key={s}>
                <Link
                  href={rutaServicio(s)}
                  className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-[#e2e8f0] bg-[#f1f5f9] px-4 py-2 text-[15px] font-medium text-[#0f172a] transition-colors hover:border-[#0072CF] hover:text-[#0072CF]"
                >
                  {textoEn(ANCLA_SERVICIO[s], locale)}
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
