"use client";

import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Siempre el mismo árbol (2026-10-23). Antes devolvía <>{children}</> hasta montar y después
// <NextThemesProvider>: al cambiar el tipo de la raíz, React desmontaba y volvía a montar el sitio
// entero justo después de hidratar (la batería: «REMONTA AL HIDRATAR» en todas las páginas), y las
// animaciones de entrada y la escena 3D arrancaban dos veces. next-themes ya cuida la hidratación
// por su cuenta (con suppressHydrationWarning en <html>, que el layout raíz tiene).
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
