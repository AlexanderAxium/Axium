"use client";

import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Aviso de cookies y lo único que depende de él: Google Analytics (2026-11-04).
 *
 * Antes, GA se cargaba a todos apenas existía `GOOGLE_ANALYTICS_ID`, sin preguntar. Ahora se carga
 * SOLO con «Aceptar» (consentimiento previo y expreso, Ley 29733 + DS 016-2024-JUS): sin elección
 * o con «Solo necesarias» no se pide ningún script de Google ni se escribe ninguna cookie `_ga`.
 *
 * - La elección vive en la cookie `axium_consent` («todas» | «necesarias», 12 meses).
 * - Se reabre desde el pie o desde /legal/cookies: `abrirPreferenciasCookies()` dispara
 *   `axium:abrir-cookies`.
 * - Si alguien acepta y después rechaza, se borran las cookies `_ga*` y se recarga: es la única
 *   forma honesta de dejar de medir en esa pestaña, porque gtag ya está cargado.
 * - Mientras el aviso está abierto publica su alto en `--aviso-cookies` (y lo reserva al final del
 *   body), para que el botón de WhatsApp suba y el pie no quede tapado.
 *
 * Portado del aviso de Rematch (`REMATCH/src/components/ConsentimientoCookies.tsx`), que ya está
 * probado en producción; acá cambian el nombre de la cookie, los textos (es/en/pt) y la reserva.
 */
const COOKIE = "axium_consent";
const DOCE_MESES = 60 * 60 * 24 * 365;
const EVENTO = "axium:abrir-cookies";

type Eleccion = "todas" | "necesarias";

function leer(): Eleccion | null {
  const m = document.cookie.match(/(?:^|;\s*)axium_consent=(todas|necesarias)/);
  return (m?.[1] as Eleccion | undefined) ?? null;
}

function guardar(v: Eleccion) {
  const seguro = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${v}; Max-Age=${DOCE_MESES}; Path=/; SameSite=Lax${seguro}`;
}

/**
 * Borra `_ga` y `_ga_<ID>` en el host y en el dominio padre (GA las escribe en `.axium.com.pe`).
 * Antes le dice a gtag que el permiso quedó negado: si sigue cargado en la pestaña, reescribe
 * `_ga_<ID>` en cuanto hay actividad (medido en local: sin esto la cookie volvía antes de recargar).
 */
function borrarCookiesDeAnalitica() {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("consent", "update", { analytics_storage: "denied" });
  const host = location.hostname;
  const dominios = ["", host, `.${host.replace(/^www\./, "")}`];
  for (const par of document.cookie.split(";")) {
    const nombre = par.split("=")[0]?.trim();
    if (!nombre?.startsWith("_ga")) continue;
    for (const d of dominios) {
      document.cookie = `${nombre}=; Max-Age=0; Path=/${d ? `; Domain=${d}` : ""}`;
    }
  }
}

/** Reabre el aviso (pie, página de cookies). */
export function abrirPreferenciasCookies() {
  window.dispatchEvent(new Event(EVENTO));
}

/** Botón para cambiar la elección; se usa en el pie y en /legal/cookies. */
export function BotonPreferenciasCookies({
  className,
}: { className?: string }) {
  const { t } = useTranslation("common");
  return (
    <button
      type="button"
      onClick={abrirPreferenciasCookies}
      className={className}
    >
      {t("avisoCookies.configurar")}
    </button>
  );
}

export function ConsentimientoCookies({ gaId }: { gaId?: string }) {
  const { t } = useTranslation("common");
  const [eleccion, setEleccion] = useState<Eleccion | null>(null);
  const [abierto, setAbierto] = useState(false);
  const aviso = useRef<HTMLElement>(null);

  useEffect(() => {
    const e = leer();
    // Con «Solo necesarias», limpiar en cada carga lo que haya quedado de una aceptación anterior
    if (e === "necesarias") borrarCookiesDeAnalitica();
    setEleccion(e);
    setAbierto(e === null);
    const abrir = () => setAbierto(true);
    window.addEventListener(EVENTO, abrir);
    return () => window.removeEventListener(EVENTO, abrir);
  }, []);

  // El alto real del aviso (cambia con el idioma y el ancho): lo usan WhatsApp y el final del body
  useLayoutEffect(() => {
    const raiz = document.documentElement;
    const el = aviso.current;
    if (!abierto || !el) {
      raiz.style.removeProperty("--aviso-cookies");
      document.body.style.removeProperty("padding-bottom");
      return;
    }
    const medir = () => {
      const alto = `${Math.ceil(el.getBoundingClientRect().height)}px`;
      raiz.style.setProperty("--aviso-cookies", alto);
      document.body.style.paddingBottom = alto;
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => {
      ro.disconnect();
      raiz.style.removeProperty("--aviso-cookies");
      document.body.style.removeProperty("padding-bottom");
    };
  }, [abierto]);

  const elegir = (v: Eleccion) => {
    guardar(v);
    if (v === "necesarias") borrarCookiesDeAnalitica();
    if (eleccion === "todas" && v === "necesarias") {
      location.reload();
      return;
    }
    setEleccion(v);
    setAbierto(false);
  };

  return (
    <>
      {gaId && eleccion === "todas" ? (
        <GoogleAnalytics gaTrackingId={gaId} />
      ) : null}
      {abierto ? (
        // Barra delgada pegada al borde de abajo, a todo el ancho: avisa sin tapar el contenido.
        // Colores fijos (no los tokens del tema): en modo oscuro el primario baja a ~3:1 con blanco.
        <section
          ref={aviso}
          aria-label={t("avisoCookies.etiqueta")}
          className="fixed inset-x-0 bottom-0 z-[90] border-[#e3e7ee] border-t bg-white text-[#060c20] shadow-[0_-8px_24px_-16px_rgba(6,12,32,0.28)]"
        >
          <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-10 py-2.5 max-md:px-4 max-sm:gap-2 max-sm:py-2">
            <p className="min-w-0 flex-1 text-[#3a4458] text-[13px] leading-[1.4] max-sm:text-[12px]">
              <span className="max-sm:hidden">{t("avisoCookies.texto")} </span>
              <span className="sm:hidden">{t("avisoCookies.textoCorto")} </span>
              <Link
                href="/legal/cookies"
                className="font-medium text-[#060c20] underline decoration-[#b9c3d3] underline-offset-4 hover:decoration-[#060c20]"
              >
                <span className="max-sm:hidden">
                  {t("avisoCookies.politica")}
                </span>
                <span className="sm:hidden">
                  {t("avisoCookies.politicaCorta")}
                </span>
              </Link>
            </p>
            <div className="flex shrink-0 gap-2 max-sm:gap-1.5">
              <button
                type="button"
                onClick={() => elegir("necesarias")}
                className="inline-flex h-9 items-center justify-center rounded-lg px-3 font-semibold text-[#060c20] text-[13px] ring-1 ring-[#b9c3d3] transition-colors hover:ring-[#060c20] max-sm:h-8 max-sm:px-2.5 max-sm:text-[12px]"
              >
                <span className="max-sm:hidden">
                  {t("avisoCookies.rechazar")}
                </span>
                <span className="sm:hidden">
                  {t("avisoCookies.rechazarCorto")}
                </span>
              </button>
              <button
                type="button"
                onClick={() => elegir("todas")}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-[#060c20] px-3 font-semibold text-[13px] text-white transition-colors hover:bg-[#1a2540] max-sm:h-8 max-sm:px-2.5 max-sm:text-[12px]"
              >
                {t("avisoCookies.aceptar")}
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
