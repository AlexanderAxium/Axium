"use client";

import { useAuthContext } from "@/AuthContext";
import { MegaCasos, MegaServicios } from "@/components/axium/mega-menu";
import { Grafico, SERVICIOS } from "@/components/axium/servicios-seis";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "@/components/ui/language-selector";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useUser";
import { getInitials } from "@/lib/utils/avatar";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  User,
  Workflow,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function GlobalNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sectionTone, setSectionTone] = useState<"dark" | "light" | null>(null);
  const [sectionBg, setSectionBg] = useState<string | null>(null);
  const isBlogRoute = pathname.startsWith("/blog");
  const isPortfolioRoute = pathname.startsWith("/portafolio");
  const isLegalRoute = pathname.startsWith("/legal");
  // Una sección con data-nav-theme bajo la barra manda sobre el automatismo:
  // "dark" = fondo oscuro (texto blanco), "light" = fondo claro (texto oscuro).
  const isDarkBase =
    sectionTone === "light"
      ? true
      : sectionTone === "dark"
        ? false
        : isBlogRoute || isLegalRoute || isScrolled;
  // El mega menú (2026-10-21): un panel a lo ancho por cada entrada que lo tiene
  const [mega, setMega] = useState<"servicios" | "casos" | null>(null);
  const megaTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDark = isDarkBase || mega !== null;
  const { user, isAuthenticated, signOut } = useAuthContext();
  const { primaryRole } = useUser();
  const router = useRouter();
  const { t, locale, setLocale } = useTranslation("common");

  const abrirMega = useCallback((cual: "servicios" | "casos") => {
    if (megaTimeoutRef.current) {
      clearTimeout(megaTimeoutRef.current);
      megaTimeoutRef.current = null;
    }
    setMega(cual);
  }, []);

  // Con una pausa corta, para poder cruzar del enlace al panel sin que se cierre
  const cerrarMega = useCallback(() => {
    megaTimeoutRef.current = setTimeout(() => setMega(null), 180);
  }, []);

  const cerrarMegaYa = useCallback(() => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setMega(null);
  }, []);

  // Esc lo cierra, y cambiar de página también
  useEffect(() => {
    if (!mega) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMega(null);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [mega]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: se cierra al cambiar de ruta
  useEffect(() => {
    setMega(null);
  }, [pathname]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setIsMenuOpen(false);
  }, [signOut]);

  const getDashboardUrl = useCallback(() => {
    switch (primaryRole) {
      case "admin":
      case "super_admin":
      case "user":
      case "viewer":
        return "/dashboard";
      default:
        return "/dashboard";
    }
  }, [primaryRole]);

  const userInitials = useMemo(() => getInitials(user?.name), [user?.name]);

  useEffect(() => {
    const isServicesPage = pathname.startsWith("/servicios");
    const isBlogPage = pathname.startsWith("/blog");
    const useHeroObserver = isServicesPage || isPortfolioRoute;

    // Home (y rutas sin #page-hero): efecto al pasar 100vh
    if (!useHeroObserver && !isBlogPage) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > window.innerHeight);
      };
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }

    // Portafolio (hero 40vh) / Servicios (su propia altura): efecto cuando el hero #page-hero sale del viewport
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      const hero = document.getElementById("page-hero");
      if (!hero) return false;

      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry) setIsScrolled(!entry.isIntersecting);
        },
        {
          threshold: 0,
          rootMargin: "0px 0px 0px 0px",
          root: null,
        }
      );
      observer.observe(hero);
      return true;
    };

    if (!setupObserver()) {
      const retryId = window.setInterval(() => {
        if (setupObserver()) window.clearInterval(retryId);
      }, 50);
      const timeoutId = window.setTimeout(
        () => window.clearInterval(retryId),
        3000
      );
      return () => {
        window.clearInterval(retryId);
        window.clearTimeout(timeoutId);
        observer?.disconnect();
      };
    }

    return () => {
      observer?.disconnect();
    };
  }, [pathname, isPortfolioRoute]);

  // Secciones con tono propio (data-nav-theme="dark" | "light"): mientras
  // pasan bajo la barra, la barra usa la versión legible sobre ese fondo.
  // Si hay secciones anidadas, gana la más interna. En las oscuras la barra
  // toma además el color de la sección: el texto blanco no se pierde cuando
  // pasa una captura clara por debajo.
  useEffect(() => {
    if (!pathname) return;
    let frame = 0;
    const backgroundOf = (el: HTMLElement | null) => {
      for (let node = el; node; node = node.parentElement) {
        const bg = getComputedStyle(node).backgroundColor;
        if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") return bg;
      }
      return null;
    };
    const check = () => {
      frame = 0;
      const probe = 32;
      const sections =
        document.querySelectorAll<HTMLElement>("[data-nav-theme]");
      let tone: "dark" | "light" | null = null;
      let toneSection: HTMLElement | null = null;
      for (const section of sections) {
        const { top, bottom } = section.getBoundingClientRect();
        if (top <= probe && bottom >= probe) {
          const value = section.dataset.navTheme;
          if (value === "dark" || value === "light") {
            tone = value;
            toneSection = section;
          }
        }
      }
      setSectionTone(tone);
      // data-nav-bg="none": la barra toma el tono de la sección pero se queda transparente
      // (un hero con degradado arriba, que una franja de color cortaría)
      setSectionBg(
        tone && toneSection?.dataset.navBg !== "none"
          ? backgroundOf(toneSection)
          : null
      );
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] container-section transition-all duration-300 ${
          mega
            ? "bg-white border-b border-gray-200"
            : isDark
              ? "backdrop-blur-md bg-card/10 border-b border-black/5"
              : "bg-transparent border-b border-transparent backdrop-blur-md"
        }`}
        style={
          sectionTone && sectionBg && !mega
            ? {
                backgroundColor: `color-mix(in srgb, ${sectionBg} 85%, transparent)`,
              }
            : undefined
        }
      >
        <div className="content-section">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src={isDark ? "/logo2.png" : "/logo3.png"}
                  alt="AXIUM"
                  width={112}
                  height={36}
                  // el logo es lo primero que se pinta arriba (era el LCP medido, a 2 s): sin esperar
                  priority
                  className={`h-8 w-auto md:h-9 transition-all duration-300 ${
                    isPortfolioRoute && !isDark
                      ? "brightness-0 invert opacity-90 hover:opacity-100"
                      : ""
                  }`}
                  quality={90}
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 flex-1 justify-center ml-8">
              <div
                className="relative flex h-14 items-center md:h-16"
                onMouseEnter={() => abrirMega("casos")}
                onMouseLeave={cerrarMega}
              >
                <Link
                  href="/portafolio"
                  aria-expanded={mega === "casos"}
                  aria-controls="mega-menu"
                  onFocus={() => abrirMega("casos")}
                  className={`py-3 text-sm font-medium transition-colors ${
                    isDark
                      ? "text-foreground hover:text-secondary"
                      : "text-white hover:text-white/80"
                  } ${mega === "casos" ? "text-secondary!" : ""}`}
                >
                  {t("navbar.casosDeExito")}
                </Link>
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-0.5 bg-secondary transition-opacity duration-200 ${mega === "casos" ? "opacity-100" : "opacity-0"}`}
                />
              </div>

              {/* Servicios: abre el mega menú */}
              <div
                className="relative flex h-14 items-center md:h-16"
                onMouseEnter={() => abrirMega("servicios")}
                onMouseLeave={cerrarMega}
              >
                <button
                  type="button"
                  aria-expanded={mega === "servicios"}
                  aria-controls="mega-menu"
                  onClick={() =>
                    mega === "servicios"
                      ? cerrarMegaYa()
                      : abrirMega("servicios")
                  }
                  className={`flex items-center gap-1 py-3 text-sm font-medium transition-colors ${
                    isDark
                      ? "text-foreground hover:text-secondary"
                      : "text-white hover:text-white/80"
                  } ${mega === "servicios" ? "text-secondary!" : ""}`}
                >
                  {t("navbar.servicios")}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${mega === "servicios" ? "rotate-180" : ""}`}
                  />
                </button>
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-0.5 bg-secondary transition-opacity duration-200 ${mega === "servicios" ? "opacity-100" : "opacity-0"}`}
                />
              </div>

              <Link
                href="/#como-trabajamos"
                className={`py-3 text-sm font-medium transition-colors ${
                  isDark
                    ? "text-foreground hover:text-secondary"
                    : "text-white hover:text-white/80"
                }`}
              >
                {t("navbar.comoTrabajamos")}
              </Link>

              <Link
                href="/#contacto"
                className={`py-3 text-sm font-medium transition-colors ${
                  isDark
                    ? "text-foreground hover:text-secondary"
                    : "text-white hover:text-white/80"
                }`}
              >
                {t("navbar.contacto")}
              </Link>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:block">
              <div className="ml-4 flex items-center md:ml-6 gap-4">
                <LanguageSelector isTransparent={!isDark} />
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    {/* User Name */}
                    <span
                      className={`font-medium text-sm transition-colors ${
                        isDark ? "text-foreground" : "text-white"
                      }`}
                    >
                      {user?.name || t("user")}
                    </span>

                    {/* User Avatar Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          <Avatar className="h-7 w-7 md:h-8 md:w-8">
                            {user?.image ? (
                              <AvatarImage
                                src={user.image}
                                alt={user?.name || t("user")}
                              />
                            ) : (
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {userInitials}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {user?.name || t("user")}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user?.email || ""}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => router.push(getDashboardUrl())}
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>{t("dashboard")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push("/dashboard/profile")}
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>{t("profile")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push("/dashboard/settings")}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          <span>{t("settings")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>{t("signOut")}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div aria-hidden />
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className={`inline-flex items-center justify-center p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-inset ${
                      isDark
                        ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-400"
                        : "text-white/90 hover:text-white hover:bg-white/10 focus:ring-white/50"
                    }`}
                  >
                    <span className="sr-only">{t("openMenu")}</span>
                    <Menu
                      className="block h-5 w-5 md:h-6 md:w-6"
                      aria-hidden="true"
                    />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full max-w-sm bg-white p-0 flex flex-col border-l border-gray-100"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>{t("mainMenu")}</SheetTitle>
                  </SheetHeader>

                  {/* Header */}
                  <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 flex-shrink-0">
                    <Link href="/" onClick={() => setIsMenuOpen(false)}>
                      <Image
                        src="/logo2.png"
                        alt="AXIUM"
                        width={100}
                        height={32}
                        className="h-7 w-auto"
                        quality={90}
                      />
                    </Link>
                  </div>

                  {/* Navigation */}
                  <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1">
                    <Link
                      href="/portafolio"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-secondary transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-4 w-4 text-gray-500" />
                      </span>
                      {t("navbar.casosDeExito")}
                    </Link>

                    {/* Services group */}
                    <div className="mt-2 mb-1">
                      <p className="px-3 text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        {t("navbar.servicios")}
                      </p>
                      {SERVICIOS.map((sv) => (
                        <Link
                          key={sv.id}
                          href={sv.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-secondary transition-colors"
                        >
                          <span className="grid h-10 w-9 shrink-0 place-items-center rounded-md bg-[#EEF2F7] p-1 ring-1 ring-[#060C20]/[0.05]">
                            <Grafico id={sv.id} quieto claro icono />
                          </span>
                          {t(`navbar.mega.servicios.items.${sv.id}.titulo`)}
                        </Link>
                      ))}
                    </div>

                    <Link
                      href="/#como-trabajamos"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-secondary transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Workflow className="h-4 w-4 text-gray-500" />
                      </span>
                      {t("navbar.comoTrabajamos")}
                    </Link>

                    <Link
                      href="/#contacto"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-secondary transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-4 w-4 text-gray-500" />
                      </span>
                      {t("navbar.contacto")}
                    </Link>
                  </div>

                  {/* Footer: language + auth */}
                  <div className="flex-shrink-0 border-t border-gray-100 px-4 py-5 space-y-4">
                    {/* Inline language selector */}
                    <div className="flex items-center gap-2">
                      {[
                        { code: "es", flag: "🇪🇸", label: "ES" },
                        { code: "en", flag: "🇺🇸", label: "EN" },
                        { code: "pt", flag: "🇵🇹", label: "PT" },
                      ].map(({ code, flag, label }) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => setLocale(code)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            locale === code
                              ? "bg-secondary/10 text-secondary"
                              : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                          }`}
                        >
                          <span className="text-base leading-none">{flag}</span>
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>

                    {isAuthenticated ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 mb-3">
                          <Avatar className="h-9 w-9">
                            {user?.image ? (
                              <AvatarImage
                                src={user.image}
                                alt={user?.name || t("user")}
                              />
                            ) : (
                              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                {userInitials}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-gray-900 truncate">
                              {user?.name || t("user")}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {user?.email || ""}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            router.push(getDashboardUrl());
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-gray-400" />
                          {t("dashboard")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            router.push("/dashboard/profile");
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="h-4 w-4 text-gray-400" />
                          {t("profile")}
                        </button>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          {t("signOut")}
                        </button>
                      </div>
                    ) : (
                      <div aria-hidden />
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        {/* El mega menú: a lo ancho, pegado a la barra (solo escritorio) */}
        <AnimatePresence>
          {mega && (
            <motion.div
              key="mega"
              id="mega-menu"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full hidden border-b border-gray-200 bg-white shadow-[0_28px_48px_-28px_rgba(6,12,32,.35)] lg:block"
              onMouseEnter={() => abrirMega(mega)}
              onMouseLeave={cerrarMega}
            >
              <div className="container-section">
                <div className="content-section">
                  {/* Los dos paneles en la misma celda: el menú mide lo que el más alto, así casos
                      y servicios coinciden en todos los anchos y no salta al pasar de uno a otro
                      (Alexander, 2026-10-22: «reduce su alto para que coincida con servicios») */}
                  <div className="grid">
                    {(["servicios", "casos"] as const).map((k) => (
                      <div
                        key={k}
                        aria-hidden={mega !== k}
                        inert={mega !== k}
                        className={`flex [grid-area:1/1] transition-opacity duration-200 ${
                          mega === k
                            ? "opacity-100"
                            : "pointer-events-none invisible opacity-0"
                        }`}
                      >
                        {k === "servicios" ? (
                          <MegaServicios alElegir={cerrarMegaYa} />
                        ) : (
                          <MegaCasos alElegir={cerrarMegaYa} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {mega && (
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-[90] hidden bg-[#060C20]/20 lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={cerrarMegaYa}
          />
        )}
      </AnimatePresence>
    </>
  );
}
