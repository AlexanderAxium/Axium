"use client";

import { useAuthContext } from "@/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useUser";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function DashboardNavbar() {
  const { user, signOut } = useAuthContext();
  const { primaryRole } = useUser();
  const router = useRouter();
  const { t, locale } = useTranslation("common");

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-1 items-center justify-between">
      {/* Title */}
      <div className="hidden sm:block">
        <h1 className="text-xl font-semibold text-foreground">
          {t("dashboard")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {(() => {
            // Get welcome message based on locale
            const welcomeMessages: Record<string, string> = {
              es: `Bienvenido de vuelta, ${user?.name || t("user")}`,
              en: `Welcome back, ${user?.name || t("user")}`,
              pt: `Bem-vindo de volta, ${user?.name || t("user")}`,
            };
            return welcomeMessages[locale] || welcomeMessages.es;
          })()}
        </p>
      </div>

      {/* Right side - Language, Theme, Notifications and User Menu */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Language Selector */}
        <LanguageSelector />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs text-destructive-foreground flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {user?.image ? (
                  <AvatarImage src={user.image} alt={user?.name || "Usuario"} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "U"}
                  </AvatarFallback>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "Usuario"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ""}
                </p>
                {primaryRole && (
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {primaryRole.replace("_", " ")}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
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
    </div>
  );
}
