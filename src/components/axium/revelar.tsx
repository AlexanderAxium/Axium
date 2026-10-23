"use client";

import { useEffect } from "react";

/**
 * Las entradas al aparecer de todo el sitio público (2026-10-23, Alexander: «asegúrate de que todo
 * esté con sus animaciones de entrada»). Un solo IntersectionObserver para la página: cualquier
 * elemento con la clase `aparecer` sube 20 px y aparece una sola vez al entrar en pantalla (el
 * estilo está en globals.css; `--aparecer-retraso` escalona los de una misma fila). Con
 * movimiento reducido, o sin JavaScript, todo se ve quieto desde el principio. Lo visto se marca
 * con `data-visto` y no con una clase: React reescribe `className` cuando cambia y se la llevaría.
 *
 * No se usa en lo que se ve al entrar (el hero): eso tiene que pintarse con la primera pintura.
 */
export function Revelar() {
  useEffect(() => {
    // lo que ya está a la vista al hidratar se queda como está (ocultarlo para volver a mostrarlo
    // sería un parpadeo); recién después se activa el estilo que esconde lo que falta ver
    for (const el of document.querySelectorAll(".aparecer:not([data-visto])")) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0)
        el.setAttribute("data-visto", "");
    }
    document.documentElement.classList.add("con-aparecer");
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-visto", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    const observar = (raiz: ParentNode) => {
      for (const el of raiz.querySelectorAll(".aparecer:not([data-visto])"))
        io.observe(el);
    };
    observar(document);
    // las secciones que llegan después (las que se cargan bajo demanda, las de otra ruta)
    const mo = new MutationObserver((cambios) => {
      for (const c of cambios)
        for (const n of c.addedNodes) {
          if (!(n instanceof HTMLElement)) continue;
          if (n.matches(".aparecer:not([data-visto])")) io.observe(n);
          observar(n);
        }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
