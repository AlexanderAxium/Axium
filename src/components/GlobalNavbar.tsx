"use client";

import { useAuthContext } from "@/AuthContext";
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
  Brain,
  ChevronDown,
  Code,
  Grid,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
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

const NAVBAR_SERVICES = [
  {
    icon: Search,
    key: "servicesDiscovery",
    href: "/servicios/design-branding",
  },
  {
    icon: Code,
    key: "servicesSoftware",
    href: "/servicios/software-development",
  },
  { icon: Brain, key: "servicesAI", href: "/servicios/ai-agentic-systems" },
] as const;

export default function GlobalNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isBlogRoute = pathname.startsWith("/blog");
  const isPortfolioRoute = pathname.startsWith("/portafolio");
  const isLegalRoute = pathname.startsWith("/legal");
  const isDark = isBlogRoute || isLegalRoute || isScrolled;
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user, isAuthenticated, signOut } = useAuthContext();
  const { primaryRole } = useUser();
  const router = useRouter();
  const { t, locale, setLocale } = useTranslation("common");

  const handleServicesMouseEnter = useCallback(() => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current);
      servicesTimeoutRef.current = null;
    }
    setIsServicesOpen(true);
  }, []);

  const handleServicesMouseLeave = useCallback(() => {
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 200);
  }, []);

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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] container-section transition-all duration-300 ${
          isDark
            ? "backdrop-blur-md bg-card/10 border-b border-black/5"
            : "bg-transparent border-b border-transparent backdrop-blur-md"
        }`}
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
              <Link
                href="/portafolio"
                className={`text-sm font-medium transition-colors ${
                  isDark
                    ? "text-foreground hover:text-secondary"
                    : "text-white hover:text-white/80"
                }`}
              >
                {t("navbar.casosDeExito")}
              </Link>

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    isDark
                      ? "text-foreground hover:text-secondary"
                      : "text-white hover:text-white/80"
                  }`}
                >
                  {t("navbar.servicios")}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isServicesOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Services Mega Menu */}
                <AnimatePresence>
                  {isServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[700px] bg-white rounded-lg shadow-2xl border border-gray-200 p-6 z-[60]"
                      onMouseEnter={handleServicesMouseEnter}
                      onMouseLeave={handleServicesMouseLeave}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Grid className="h-5 w-5 text-secondary" />
                        <h3 className="font-semibold text-gray-900">
                          {t("navbar.servicios")}
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {NAVBAR_SERVICES.map(({ icon: Icon, key, href }) => (
                          <Link
                            key={key}
                            href={href}
                            className="block group hover:bg-gray-50 p-3 rounded-lg transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                                <Icon className="w-4 h-4 text-secondary" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-secondary transition-colors">
                                  {t(`navbar.${key}.title`)}
                                </h4>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  {t(`navbar.${key}.description`)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/#como-trabajamos"
                className={`text-sm font-medium transition-colors ${
                  isDark
                    ? "text-foreground hover:text-secondary"
                    : "text-white hover:text-white/80"
                }`}
              >
                {t("navbar.comoTrabajamos")}
              </Link>

              <Link
                href="/#contacto"
                className={`text-sm font-medium transition-colors ${
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
                      {NAVBAR_SERVICES.map(({ icon: Icon, key, href }) => (
                        <Link
                          key={key}
                          href={href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-secondary transition-colors"
                        >
                          <span className="w-8 h-8 rounded-lg bg-secondary/8 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-4 w-4 text-secondary" />
                          </span>
                          {t(`navbar.${key}.title`)}
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
      </nav>
    </>
  );
}
