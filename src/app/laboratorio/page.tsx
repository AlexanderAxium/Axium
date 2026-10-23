import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Índice del laboratorio 3D (2026-10-15): cada prueba con su técnica. Solo existe en desarrollo.
export const metadata: Metadata = {
  title: "Laboratorio 3D · Axium",
  robots: { index: false, follow: false },
};

const PRUEBAS = [
  {
    ruta: "/laboratorio/medios",
    nombre: "Cuatro medios",
    que: "La mesa del estudio de realismo, impresa en cuatro tintas, pintada y en una pantalla LED; el scroll pasa de un medio a otro y una cortina de tela simulada se mueve con la brisa en todos.",
    tecnicas: [
      "Trama CMYK con retículas giradas",
      "Kuwahara circular de 8 sectores",
      "Panel LED escalonado",
      "Tela con Verlet en compute",
    ],
  },
  {
    ruta: "/laboratorio/realismo",
    nombre: "Estudio de realismo",
    que: "El isotipo como escultura de vidrio sobre una mesa de terrazo, con la luz gris de Lima. La escena se construyó contra una foto objetivo de OpenAI; el botón las compara y el scroll lleva el foco a la ventana.",
    tecnicas: [
      "WebGPURenderer y RenderPipeline",
      "Oclusión GTAO y antialias temporal",
      "Profundidad de campo",
      "Entorno horneado de la ventana",
    ],
  },
  {
    ruta: "/laboratorio/folleto",
    nombre: "El folleto (trituradora)",
    que: "Entras al monitor, lees el folleto de Axium como una hoja impresa y al final pasa por una trituradora: las tiras se ondulan y dejan ver el contacto. A partir de shader.se.",
    tecnicas: [
      "Plano a la medida del encuadre",
      "Una sola textura de página",
      "Tiras con dorso y ondulado",
      "Solo se dibuja el tramo activo",
    ],
  },
  {
    ruta: "/laboratorio/portales",
    nombre: "Tres mundos (portales)",
    que: "Cada pieza del isotipo es una ventana a un mundo: un taller pastel (Diseño), una ciudad de noche (Software) y una red neuronal (IA). Mueve el cursor para mirar dentro; el scroll te hace cruzar cada ventana.",
    tecnicas: [
      "Portales con render targets",
      "Cruce sin corte",
      "Cortes de cine entre actos",
      "Ciudad y red procedurales",
    ],
  },
  {
    ruta: "/laboratorio/cine-vivo",
    nombre: "Cine en vivo (three.js)",
    que: "La película del cine, en tiempo real: los mismos cinco capítulos, pero el gesto cambia de destino a mitad de viaje, las piezas responden al cursor y se adapta a cualquier pantalla.",
    tecnicas: [
      "Muelle crítico interrumpible",
      "Desenfoque de movimiento",
      "Detección de inercia",
      "Transmisión a ½",
    ],
  },
  {
    ruta: "/laboratorio/obra",
    nombre: "La obra (experiencia inmersiva)",
    que: "El isotipo levantado en ladrillos sobre la nieve: saltan con el cursor, la cámara cruza el triángulo, sube entre nubes hasta los proyectos en hielo y termina en un núcleo de luz. A partir de igloo.inc.",
    tecnicas: [
      "Aparejo de ladrillos a 60°",
      "Transmisión: hielo con fotos",
      "Esquirlas instanciadas",
      "Aberración por velocidad",
    ],
  },
  {
    ruta: "/laboratorio/cine",
    nombre: "Cine pre-renderizado",
    que: "Sin WebGL: clips renderizados en Blender que se encadenan con el scroll, sin cortes visibles. La técnica de labs.sigma.software.",
    tecnicas: [
      "Blender → H.264",
      "Bucles y transiciones encadenados",
      "Precarga en blobs",
      "Sonido WebAudio",
    ],
  },
  {
    ruta: "/laboratorio/terminal",
    nombre: "La terminal (propuesta de portada)",
    que: "Un personaje 3D cuya pantalla te habla y pregunta qué quieres construir, sobre humo azul. A partir de juncastudio.com.",
    tecnicas: [
      "Pantalla con canvas + CRT",
      "Humo con deformación de dominio",
      "Mira al puntero",
    ],
  },
  {
    ruta: "/laboratorio/sala",
    nombre: "La sala",
    que: "Escena modelada en Blender con la luz horneada: el sol dibuja el isotipo en el agua.",
    tecnicas: [
      "Blender + Cycles",
      "KTX2 + Draco",
      "Rayos de pantalla",
      "Polvo en GPU",
      "Cámara por planos",
    ],
  },
  {
    ruta: "/laboratorio/lineas",
    nombre: "Líneas de luz",
    que: "37 000 partículas en un campo de flujo dejan rastros de luz; el ratón hace un remolino.",
    tecnicas: ["GPGPU", "Ruido curl", "Búfer de rastro"],
  },
  {
    ruta: "/laboratorio/terreno",
    nombre: "Terreno que se talla",
    que: "Un mapa topográfico vivo: el ratón talla valles que brillan y se curan solos.",
    tecnicas: ["Vertex shader", "Pintar en un FBO", "Curvas de nivel"],
  },
  {
    ruta: "/laboratorio/liquido",
    nombre: "Isotipo líquido",
    que: "Las tres piezas en cromo se separan, se funden como mercurio y vuelven a armarse.",
    tecnicas: ["Raymarching", "SDF + smin", "Iridiscencia"],
  },
  {
    ruta: "/laboratorio/transiciones",
    nombre: "Transiciones",
    que: "Carrusel de proyectos con cuatro transiciones; una revela el siguiente dentro del isotipo.",
    tecnicas: ["Shader de transición", "Máscara del isotipo", "Ruido"],
  },
  {
    ruta: "/laboratorio/multitud",
    nombre: "Multitud",
    que: "40 000 piezas en una sola llamada de dibujo, ondeando con el ratón.",
    tecnicas: ["InstancedMesh", "Animación en el shader"],
  },
  {
    ruta: "/laboratorio/galeria",
    nombre: "Galería",
    que: "Planos WebGL pegados a la rejilla HTML: se enrollan arriba y se revelan con una mancha.",
    tecnicas: ["DOM → WebGL", "Enrollado", "Revelado pintado"],
  },
  {
    ruta: "/laboratorio/capitulos",
    nombre: "Capítulos",
    que: "Cuatro capítulos con scroll: cromo, río de partículas, isotipo de partículas y paneles.",
    tecnicas: ["Reflector", "Morph en GPU", "Postproceso"],
  },
];

export default function IndiceLaboratorio() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="min-h-screen bg-[#05070d] px-5 pb-24 pt-16 text-white lg:px-10">
      <div className="mx-auto max-w-[1240px]">
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/50">
          Axium · laboratorio 3D · solo en desarrollo
        </p>
        <h1 className="mt-4 max-w-[18ch] text-[40px] leading-[1.02] tracking-[-0.03em] lg:text-[64px]">
          Pruebas de three.js
        </h1>
        <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-white/65">
          Cada prueba aprende una técnica de las referencias (Active Theory,
          Hubtown, Unseen, Overworld) con nuestros materiales. Lo aprendido
          queda en la skill creator, TRES-D.md.
        </p>
        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {PRUEBAS.map((p) => (
            <li key={p.ruta}>
              <Link
                href={p.ruta}
                className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/30"
              >
                {/* la miniatura es una captura de la propia prueba */}
                <img
                  src={`/laboratorio/miniaturas/${p.ruta.split("/").pop()}.jpg`}
                  alt={`Captura de ${p.nombre}`}
                  className="aspect-[16/10] w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                />
                <div className="p-5">
                  <h2 className="text-[20px] tracking-[-0.01em]">{p.nombre}</h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/65">
                    {p.que}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.tecnicas.map((t) => (
                      <li
                        key={t}
                        className="rounded-md bg-white/[0.06] px-2 py-1 font-mono text-[11px] text-white/60"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
