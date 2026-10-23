"use client";

import Image from "next/image";
import Link from "next/link";
import { PiezaIsotipo } from "~/components/axium/portada-blog";
import { useTranslation } from "~/hooks/useTranslation";

/**
 * El CTA del taller (2026-10-23). Alexander: «haz un CTA con un fondo corporativo de personas
 * reales, como estos estilos y colores» (las portadas del blog de operaciones y de facturación), y
 * después: «Servicios en versión light con fondo gris claro, luego el CTA ancho completo, un poco
 * menos alto, con transición degradada, y luego la sección de proceso».
 *
 * El sistema es el de esas portadas: una foto oscura en navy y azul con el bloque de estilo del
 * blog (OpenAI, taller-inicio/2026-10/cta-taller.txt), las caras suavizadas por el movimiento, el
 * titular blanco en la letra de la marca y una estela de piezas del isotipo. La escena es la
 * primera fase del proceso, el taller con el equipo, y el titular invita justo a eso.
 *
 * A ancho completo y de bordes rectos entre dos láminas claras. El degradado va de lo oscuro a la
 * imagen, de izquierda a derecha (Alexander: «me refería a un degradado para transicionar de
 * oscuro a la imagen, no arriba y abajo»): el texto va sobre navy liso y la foto, a la derecha,
 * aparece con curva suave (un degradado lineal deja una raya donde arranca). La foto va recortada
 * sin su pared oscura: a ancho completo, la esquina de esa pared marcaba una línea vertical que
 * ningún velo borraba sin oscurecer también a la gente. En el celular, la foto arriba y se funde
 * hacia abajo en el navy del texto.
 */

const WHATSAPP = "51991285679";
const NAVY = "6,12,32"; // #060C20

/**
 * Un fundido de navy a transparente hacia `hacia`, con curva suave (smoothstep): liso hasta
 * `desde` y transparente desde `hasta` (en %).
 */
function fundido(hacia: "right" | "top", desde = 0, hasta = 100) {
  const paradas = Array.from({ length: 11 }, (_, i) => {
    const p = i / 10;
    const a = 1 - p * p * (3 - 2 * p);
    return `rgba(${NAVY},${a.toFixed(3)}) ${(desde + p * (hasta - desde)).toFixed(1)}%`;
  });
  return `linear-gradient(to ${hacia}, ${paradas.join(", ")})`;
}

export function CtaProceso() {
  const { t } = useTranslation("landing");
  const { t: tc } = useTranslation("common");
  const K = "home.procesoFases.cta";
  const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(tc("whatsappFlotante.mensaje"))}`;

  return (
    <section
      aria-labelledby="cta-taller"
      data-nav-theme="dark"
      className="relative overflow-hidden bg-[#060C20] text-white"
    >
      {/* la foto, recortada sin su pared oscura, ocupa la derecha y sale del navy del texto */}
      <div className="relative aspect-[4/3] md:absolute md:inset-y-0 md:right-0 md:aspect-auto md:w-[62%]">
        <Image
          src="/images/inicio/cta-taller-recorte.jpg"
          alt=""
          fill
          sizes="(min-width: 768px) 62vw, 100vw"
          quality={85}
          className="object-cover object-[60%_50%] md:object-[center_55%]"
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{ background: fundido("right", 0, 34) }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/3 md:hidden"
          style={{ background: fundido("top") }}
        />
        {/* la estela del isotipo, sobre la pared de los pliegos */}
        <div className="absolute top-[14%] right-[3.5%] hidden aspect-square w-[7vw] md:block">
          <PiezaIsotipo nombre="abajo" x={0} y={66} lado={15} alto={100} />
          <PiezaIsotipo nombre="izquierda" x={30} y={36} lado={22} alto={100} />
          <PiezaIsotipo nombre="arriba" x={65} y={0} lado={31} alto={100} />
        </div>
      </div>

      <div className="container-section relative">
        <div className="content-section pt-4 pb-10 md:flex md:h-[clamp(420px,32vw,520px)] md:items-center md:py-0">
          <div className="aparecer md:max-w-[46%]">
            <h2
              id="cta-taller"
              className="max-w-[16ch] text-[32px] leading-[1.04] tracking-[-0.03em] sm:text-[38px] md:text-[clamp(34px,3.4vw,50px)]"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              {t(`${K}.titulo`)}
            </h2>
            <p className="mt-5 max-w-[38ch] text-[16px] leading-[1.55] text-white/75 md:text-[17px]">
              {t(`${K}.texto`)}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#contacto"
                className="inline-flex h-12 items-center rounded-full bg-white px-6 text-[15px] font-medium text-[#060C20] transition-colors hover:bg-white/85"
              >
                {t(`${K}.reunion`)}
              </Link>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-full border border-white/30 px-6 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
              >
                {t(`${K}.whatsapp`)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
