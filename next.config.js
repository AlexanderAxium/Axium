/** @type {import("next").NextConfig} */
const config = {
  // no anunciar «Next.js» en cada respuesta (la auditoría de creator, 2026-10-23)
  poweredByHeader: false,
  // Cabeceras de seguridad que no rompen nada (2026-10-23). HSTS sin includeSubDomains: el correo y
  // el webmail de axium.com.pe viven en cPanel y no hay que arriesgarlos. La CSP queda pendiente:
  // con Analytics, three.js, los vídeos y los scripts en línea hay que probarla en Report-Only
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  images: {
    // Calidad por defecto alta para no pixelar; heroes/banners usan quality={95}
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // AVIF primero (2026-10-23): pesa un tercio menos que WebP en las fotos de las fichas. Y un
    // día de caché en vez de los 60 s por defecto; no más, porque las portadas se reemplazan
    // con el mismo nombre de archivo
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com", pathname: "/**" },
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/**" },
    ],
  },
};

export default config;
