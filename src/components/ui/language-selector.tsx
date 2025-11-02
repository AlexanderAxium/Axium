"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronDown } from "lucide-react";

const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
];

export function LanguageSelector() {
  const { locale, setLocale } = useTranslation("common");

  const currentLanguage = languages.find((lang) => lang.code === locale) ??
    languages[0] ?? { code: "es", name: "Español", flag: "🇪🇸" };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 px-2 hover:bg-accent/50 text-foreground/70 hover:text-foreground transition-colors gap-1.5"
        >
          <span className="text-base leading-none">{currentLanguage.flag}</span>
          <span className="text-xs font-medium hidden sm:inline-block">
            {currentLanguage.name}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          <span className="sr-only">Seleccionar idioma</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setLocale(language.code)}
            className={`cursor-pointer ${
              locale === language.code
                ? "bg-accent/50 font-semibold text-primary"
                : ""
            }`}
          >
            <span className="mr-2 text-lg">{language.flag}</span>
            <span>{language.name}</span>
            {locale === language.code && (
              <span className="ml-auto text-xs text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
