"use client";

import { BotonPreferenciasCookies } from "@/components/axium/consentimiento-cookies";
import { SERVICIOS } from "@/components/axium/servicios-seis";
import { EMPRESA, REDES } from "@/data/empresa";
import { useTranslation } from "@/hooks/useTranslation";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Footer links will be translated via useTranslation hook

export function Footer() {
  const { t } = useTranslation("common");
  // Los títulos de los servicios viven en `landing`, no en `common`.
  const { t: tl } = useTranslation("landing");

  const footerLinks = {
    legal: [
      {
        name: t("termsAndConditions") || "Términos y Condiciones",
        href: "/legal/terms",
      },
      {
        name: t("privacyPolicy") || "Política de Privacidad",
        href: "/legal/privacy",
      },
      {
        name: t("cookiePolicy") || "Política de Cookies",
        href: "/legal/cookies",
      },
      {
        name: t("complaintsBook") || "Libro de Reclamaciones",
        href: "/legal/complaints",
      },
    ],
    support: [
      { name: t("helpCenter") || "Centro de Ayuda", href: "/help" },
      { name: t("documentation") || "Documentación", href: "/docs" },
      { name: t("api") || "API", href: "/api-docs" },
    ],
  };

  return (
    <footer
      data-nav-theme="dark"
      className="bg-gray-900 border-t border-gray-800"
    >
      <div className="container-section py-12">
        <div className="content-section">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/logo3.png"
                  alt="AXIUM"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  quality={90}
                />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                {t("footer.description")}
              </p>

              {/* Contact Info */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <a
                    href="mailto:contacto@axium.com.pe"
                    className="inline-flex min-h-6 items-center hover:text-blue-400 transition-colors"
                  >
                    contacto@axium.com.pe
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <a
                    href="tel:+51991285679"
                    className="inline-flex min-h-6 items-center hover:text-blue-400 transition-colors"
                  >
                    +51 991 285 679
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span>{t("footer.location")}</span>
                </div>
              </div>

              {/* Las redes: salen de REDES (src/data/empresa.ts), que también llena el `sameAs` del
                  Organization. Hoy está vacío (no hay perfiles confirmados), así que no se pinta */}
              {REDES.length > 0 && (
                <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
                  {REDES.map((r) => (
                    <li key={r.url}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className="inline-flex min-h-6 items-center text-sm text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        {r.red}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-white">
                {t("navbar.servicios")}
              </h2>
              <ul className="space-y-2">
                {SERVICIOS.map((sv) => (
                  <li key={sv.id}>
                    <Link
                      href={sv.href}
                      className="inline-flex min-h-6 items-center text-sm text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {tl(`home.serviciosSeis.items.${sv.id}.titulo`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-white">
                {t("legal")}
              </h2>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-6 items-center text-sm text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-10 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* razón social, RUC y domicilio fiscal: obligatorios en la web (2026-10-23) */}
              <p className="text-center text-sm text-gray-400 md:text-left">
                © {new Date().getFullYear()}{" "}
                <span className="text-white font-medium">
                  {EMPRESA.razonSocial}
                </span>{" "}
                · <span className="whitespace-nowrap">RUC {EMPRESA.ruc}</span> ·{" "}
                <span className="whitespace-nowrap">{EMPRESA.domicilio}.</span>{" "}
                {t("allRightsReserved")}
              </p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
                <Link
                  href="/legal/terms"
                  className="inline-flex min-h-6 items-center hover:text-blue-400 transition-colors"
                >
                  {t("terms")}
                </Link>
                <Link
                  href="/legal/privacy"
                  className="inline-flex min-h-6 items-center hover:text-blue-400 transition-colors"
                >
                  {t("privacy")}
                </Link>
                <Link
                  href="/legal/cookies"
                  className="inline-flex min-h-6 items-center hover:text-blue-400 transition-colors"
                >
                  {t("cookies")}
                </Link>
                {/* reabre el aviso para cambiar la elección (2026-11-04) */}
                <BotonPreferenciasCookies className="inline-flex min-h-6 cursor-pointer items-center hover:text-blue-400 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
