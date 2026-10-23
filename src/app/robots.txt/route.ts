import { NextResponse } from "next/server";
import { SITIO } from "~/lib/seo";

// El robots.txt (2026-10-23): en producción apuntaba el mapa a https://example.com/sitemap.xml
// porque leía SITE_URL sin el mismo valor por defecto que el resto del sitio. El acceso, el
// panel, la API y el laboratorio no van a Google
export function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /signin
Disallow: /signup
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /confirm-email
Disallow: /laboratorio

Sitemap: ${SITIO}/sitemap.xml
`;
  return new NextResponse(robots, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
