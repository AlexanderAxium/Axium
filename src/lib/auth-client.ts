import { createAuthClient } from "better-auth/react";

// En desarrollo, el mismo origen de la página: con el servidor en otro puerto (3111) el cliente
// preguntaba la sesión a localhost:3000, y si otro proyecto ocupaba ese puerto sin responder, el
// RoleBasedRedirect se quedaba en la pantalla de carga para siempre (2026-10-16).
// En el navegador, siempre el origen de la página (2026-10-23): en producción leía SITE_URL, que no
// llega al cliente (no es NEXT_PUBLIC_), y caía en «https://myapp.example.com» de la plantilla, así
// que cada visita pedía la sesión a un dominio que no existe
export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.SITE_URL || "https://axium.com.pe",
});
