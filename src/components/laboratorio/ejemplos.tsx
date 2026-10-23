"use client";

// Los cinco ejemplos nuevos del laboratorio (2026-10-15), cada uno con su escena en un import() propio
// (three y cada shader viajan en su chunk). Los cargadores van fuera de los componentes para que la
// referencia sea estable y el efecto de PaginaLab no se vuelva a montar en cada render.
import { PaginaLab } from "~/components/laboratorio/pagina-lab";

const lineas = () =>
  import("~/components/laboratorio/escena-lineas").then((m) => m.crear);
const terreno = () =>
  import("~/components/laboratorio/escena-terreno").then((m) => m.crear);
const liquido = () =>
  import("~/components/laboratorio/escena-liquido").then((m) => m.crear);
const transiciones = () =>
  import("~/components/laboratorio/escena-transiciones").then((m) => m.crear);
const multitud = () =>
  import("~/components/laboratorio/escena-multitud").then((m) => m.crear);

export function Lineas() {
  return (
    <PaginaLab
      titulo="Líneas de luz"
      cargar={lineas}
      tecnica={[
        "36 864 partículas simuladas en la GPU por un campo de flujo (rotacional de un ruido: no se amontonan).",
        "Cada cuadro se pintan sobre el anterior apenas apagado: el rastro dibuja las líneas.",
        "Es la técnica de las líneas de Hubtown y del capítulo 2 de Unseen.",
      ]}
      interaccion="Mueve el ratón: remolino · mantén apretado: empuja"
    />
  );
}

export function Terreno() {
  return (
    <PaginaLab
      titulo="Terreno que se talla"
      cargar={terreno}
      tecnica={[
        "Un plano de 65 000 vértices deformado en el vertex shader con ruido de crestas.",
        "El puntero pinta en un render target que el terreno lee para hundirse; se cura solo.",
        "Curvas de nivel con fwidth (ancho constante en pantalla) y bloom en las líneas.",
      ]}
      interaccion="Pasa el ratón para tallar · aprieta para tallar más hondo"
    />
  );
}

export function Liquido() {
  return (
    <PaginaLab
      titulo="Isotipo líquido"
      cargar={liquido}
      tecnica={[
        "Raymarching de campos de distancia: no hay mallas, todo sale de un solo shader.",
        "Las tres piezas se funden con un mínimo suave (smin): armado → separadas → gota → armado.",
        "Cromo con película iridiscente sobre un entorno procedural de tiras de luz.",
      ]}
      interaccion="Acerca el ratón: es otra gota que se pega a las piezas"
    />
  );
}

export function Transiciones() {
  return (
    <PaginaLab
      titulo="Transiciones"
      cargar={transiciones}
      acciones={[
        ["Isotipo", "isotipo"],
        ["Disolver", "disolver"],
        ["Líquido", "liquido"],
        ["Píxeles", "pixeles"],
      ]}
      tecnica={[
        "Un shader, dos texturas y un progreso con curva de entrada y salida.",
        "Isotipo: la siguiente imagen aparece dentro del logo, que crece con un halo de luz.",
        "Disolver (ruido con filo), líquido (desplazamiento opuesto) y píxeles (la celda crece y baja).",
      ]}
      interaccion="Clic, rueda o flechas para pasar de proyecto"
    />
  );
}

export function Multitud() {
  return (
    <PaginaLab
      titulo="Multitud"
      cargar={multitud}
      tecnica={[
        "40 000 piezas en UNA llamada de dibujo (InstancedMesh).",
        "Nada se mueve en la CPU: altura, giro y escala salen del vertex shader por instancia.",
        "Ola de ruido + marea + la onda que deja el puntero; color por altura.",
      ]}
      interaccion="Pasa el ratón: deja ondas · aprieta: onda fuerte"
    />
  );
}
