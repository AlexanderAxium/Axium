/**
 * Titular corto de cada caso para la tarjeta del portafolio (modelo Phenomenon/Umano, 2026-11-18): el nombre de la
 * empresa va arriba en versalitas y debajo una frase que dice qué se hizo. Cada frase sale de la descripción del caso
 * en `locales/<idioma>/cases.json`; si un caso nuevo no tiene titular, la tarjeta muestra su nombre.
 */
type Titular = { es: string; en: string; pt: string };

export const TITULARES_PORTAFOLIO: Record<string, Titular> = {
  rematch: {
    es: "Reservas, ligas y torneos de un club en un solo sistema",
    en: "Bookings, leagues and tournaments in one system",
    pt: "Reservas, ligas e torneios de um clube em um só sistema",
  },
  lumiolearn: {
    es: "Una academia online con marca propia y sin comisiones",
    en: "An online academy with its own brand and no fees",
    pt: "Uma academia online com marca própria e sem comissões",
  },
  bookit: {
    es: "Reservas en la web de cada negocio, sin comisiones",
    en: "Bookings on each business's own site, with no fees",
    pt: "Reservas no site de cada negócio, sem comissões",
  },
  vendiq: {
    es: "Tienda online, local y comprobantes SUNAT con el mismo stock",
    en: "Online store, shop counter and invoicing on one stock",
    pt: "Loja online, balcão e notas fiscais com o mesmo estoque",
  },
  maintech: {
    es: "Una marca entera y el sitio donde vive",
    en: "A whole brand and the site where it lives",
    pt: "Uma marca inteira e o site onde ela vive",
  },
  vitalchain: {
    es: "Un sorteo verificable en blockchain y guías en diez idiomas",
    en: "A blockchain-verifiable raffle and guides in ten languages",
    pt: "Um sorteio verificável em blockchain e guias em dez idiomas",
  },
  fenalsa: {
    es: "La web de una empresa de alimentación y limpieza",
    en: "The website of a catering and cleaning company",
    pt: "O site de uma empresa de alimentação e limpeza",
  },
  feniz: {
    es: "Una plataforma completa para traders de cuentas de fondeo",
    en: "A complete platform for funded-account traders",
    pt: "Uma plataforma completa para traders de contas financiadas",
  },
  innersoulbright: {
    es: "Acompañamiento espiritual contado en cinco idiomas",
    en: "Spiritual guidance told in five languages",
    pt: "Acompanhamento espiritual contado em cinco idiomas",
  },
  clefast: {
    es: "Una tienda industrial de 205 presentaciones sobre Vendiq",
    en: "An industrial store with 205 product sizes on Vendiq",
    pt: "Uma loja industrial com 205 apresentações sobre o Vendiq",
  },
  happyart: {
    es: "Marca y tienda para regalos personalizados",
    en: "Brand and store for personalised gifts",
    pt: "Marca e loja para presentes personalizados",
  },
  redesvip: {
    es: "Planes de fibra óptica que se eligen de un vistazo",
    en: "Fibre-optic plans you can pick at a glance",
    pt: "Planos de fibra óptica escolhidos num relance",
  },
  sportt: {
    es: "149 productos de tenis de mesa, ordenados por juego",
    en: "149 table tennis products, sorted by playing style",
    pt: "149 produtos de tênis de mesa, organizados por estilo",
  },
  ventanasantiruido: {
    es: "El catálogo de ventanas antiruido de PVC en Lima",
    en: "A catalogue of soundproof PVC windows in Lima",
    pt: "O catálogo de janelas antirruído de PVC em Lima",
  },
  antiruidopvc: {
    es: "Ventanas y mamparas antirruido para todo el Perú",
    en: "Soundproof windows and doors for all of Peru",
    pt: "Janelas e portas antirruído para todo o Peru",
  },
  transportesrumi: {
    es: "Brochure y web para transporte de carga minera",
    en: "Brochure and website for mining freight transport",
    pt: "Brochure e site para transporte de carga mineral",
  },
  villacer: {
    es: "Marca y web para alquiler de equipos de construcción",
    en: "Brand and website for construction equipment rental",
    pt: "Marca e site para aluguel de equipamentos de obra",
  },
  daesurmotors: {
    es: "Un taller y sus repuestos, a un clic",
    en: "A car workshop and its spare parts, one click away",
    pt: "Uma oficina e suas peças, a um clique",
  },
  firstautomation: {
    es: "La web de un partner AVEVA que digitaliza plantas",
    en: "The website of an AVEVA partner digitising plants",
    pt: "O site de um parceiro AVEVA que digitaliza plantas",
  },
  toliveagain: {
    es: "Una fundación bilingüe con la donación en primera línea",
    en: "A bilingual foundation with giving up front",
    pt: "Uma fundação bilíngue com a doação em primeiro plano",
  },
  podologiemtk: {
    es: "Un consultorio de podología en Alemania, en línea",
    en: "A podiatry practice in Germany, online",
    pt: "Um consultório de podologia na Alemanha, online",
  },
  enrafmedica: {
    es: "Equipos médicos desde 1998, en un catálogo claro",
    en: "Medical equipment since 1998, in a clear catalogue",
    pt: "Equipamentos médicos desde 1998, num catálogo claro",
  },
  huarmis: {
    es: "Educación STEM que transforma futuros en el Perú",
    en: "STEM education changing futures in Peru",
    pt: "Educação STEM que transforma futuros no Peru",
  },
  favorygracia: {
    es: "La casa digital de una comunidad cristiana",
    en: "The digital home of a Christian community",
    pt: "A casa digital de uma comunidade cristã",
  },
  hotelesparaiso: {
    es: "Tres sedes de hotel en el norte del Perú, en una web",
    en: "Three hotels in northern Peru, on one website",
    pt: "Três hotéis no norte do Peru, em um só site",
  },
  jcpingenieros: {
    es: "Equipamiento hospitalario y consultoría de alta tecnología",
    en: "Hospital equipment and high-tech consulting",
    pt: "Equipamento hospitalar e consultoria de alta tecnologia",
  },
  lifetoursfl: {
    es: "Vuelos, promociones y pagos para una agencia de viajes",
    en: "Flights, deals and payments for a travel agency",
    pt: "Voos, promoções e pagamentos para uma agência de viagens",
  },
  comunicarte: {
    es: "Una editorial con tienda, imprenta y distribución",
    en: "A publisher with a store, printing and distribution",
    pt: "Uma editora com loja, gráfica e distribuição",
  },
  ghiperu: {
    es: "Asesoría hotelera con estándares de calidad",
    en: "Hotel consulting built on quality standards",
    pt: "Consultoria hoteleira com padrões de qualidade",
  },
  anjsports: {
    es: "251 productos con stock en vivo sobre Vendiq",
    en: "251 products with live stock on Vendiq",
    pt: "251 produtos com estoque ao vivo sobre o Vendiq",
  },
  ambientalpe: {
    es: "Web, redes y sistema para el monitoreo ambiental",
    en: "Website, social media and system for environmental monitoring",
    pt: "Site, redes e sistema para monitoramento ambiental",
  },
  siclo: {
    es: "Clases, pagos e instructores en un solo panel",
    en: "Classes, payments and instructors in one panel",
    pt: "Aulas, pagamentos e instrutores em um só painel",
  },
  "web-scraping-ai": {
    es: "Datos de la web estructurados con IA",
    en: "Web data structured with AI",
    pt: "Dados da web estruturados com IA",
  },
  fintrace: {
    es: "Contabilidad que empieza donde termina el facturador",
    en: "Accounting that starts where invoicing ends",
    pt: "Contabilidade que começa onde termina o faturador",
  },
  "feedback-management": {
    es: "El feedback de los clientes, medido y ordenado",
    en: "Customer feedback, measured and organised",
    pt: "O feedback dos clientes, medido e organizado",
  },
  aurore: {
    es: "Marca y tienda para 278 fragancias",
    en: "Brand and store for 278 fragrances",
    pt: "Marca e loja para 278 fragrâncias",
  },
  alyer: {
    es: "La marca de una flota, del símbolo al camión",
    en: "A fleet's brand, from the symbol to the truck",
    pt: "A marca de uma frota, do símbolo ao caminhão",
  },
  blendet: {
    es: "Uñas, pestañas y cejas con la cita que se cierra sola",
    en: "Nails, lashes and brows with self-booking appointments",
    pt: "Unhas, cílios e sobrancelhas com agendamento automático",
  },
  jarumi: {
    es: "Un estudio de belleza con reserva en línea",
    en: "A beauty studio with online booking",
    pt: "Um estúdio de beleza com reserva online",
  },
  volveravivir: {
    es: "La fundación contra el abuso doméstico, ahora en el Perú",
    en: "The foundation against domestic abuse, now in Peru",
    pt: "A fundação contra o abuso doméstico, agora no Peru",
  },
  moviflex: {
    es: "Terapia física en tres sedes, con cita desde la web",
    en: "Physiotherapy at three locations, booked online",
    pt: "Fisioterapia em três unidades, com agendamento no site",
  },
  qintitec: {
    es: "Una fintech con dos puertas: personas y empresas",
    en: "A fintech with two doors: people and companies",
    pt: "Uma fintech com duas portas: pessoas e empresas",
  },
  capptura: {
    es: "Un estudio de fotografía con reserva en tres pasos",
    en: "A photo studio with booking in three steps",
    pt: "Um estúdio de fotografia com reserva em três passos",
  },
  cesaracosta: {
    es: "Una academia de tenis conectada a Rematch",
    en: "A tennis academy connected to Rematch",
    pt: "Uma academia de tênis conectada ao Rematch",
  },
};

export function titularDe(slug: string, locale: string, respaldo: string) {
  const t = TITULARES_PORTAFOLIO[slug];
  if (!t) return respaldo;
  return t[(locale as keyof Titular) in t ? (locale as keyof Titular) : "es"];
}
