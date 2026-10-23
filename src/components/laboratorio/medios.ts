// Laboratorio · estudio 2, creatividad (2026-10-16): la misma escena de la mesa en Lima (estudio de
// realismo) en cuatro medios, y una cortina de tela simulada que la brisa del mar mueve en todos.
// Técnicas de Maxime Heckel («Post-Processing Shaders as a Creative Medium», «Shades of Halftone»,
// «On Crafting Painterly Shaders») y del ejemplo oficial webgpu_compute_cloth de three r186:
//   · impresa: cuatro tintas CMYK, cada una en su retícula girada (15°, 75°, 0°, 45°) para que no
//     haya moiré; el punto se muestrea en el centro de su celda y su área sigue a la cobertura
//     (radio ∝ √cobertura); las tintas se multiplican sobre el papel (sustractivo)
//   · pintada: Kuwahara circular de 8 sectores (Papari) con pesos que bajan con el radio; se queda
//     con la media de los sectores de menor varianza, que es lo que deja pinceladas y no desenfoque
//   · en pantalla: panel LED escalonado (columnas impares corridas media celda) con tres subpíxeles
//   · la tela: Verlet en compute (muelles estructurales, de corte y de flexión), el riel arriba fijo
import {
  Fn,
  If,
  Loop,
  Return,
  attribute,
  clamp,
  convertToTexture,
  cross,
  dot,
  float,
  floor,
  fract,
  fwidth,
  instanceIndex,
  instancedArray,
  int,
  length,
  max,
  mix,
  screenSize,
  screenUV,
  select,
  smoothstep,
  sqrt,
  time,
  transformNormalToView,
  triNoise3D,
  uniform,
  vec2,
  vec3,
  vec4,
} from "three/tsl";
import * as THREE from "three/webgpu";

// biome-ignore lint/suspicious/noExplicitAny: los nodos de TSL no traen un tipo común útil
type Nodo = any;

/** la cortina: una tela de voile colgada de un riel, delante del vidrio de la ventana */
export function crearCortina(
  renderer: THREE.WebGPURenderer,
  escena: THREE.Scene,
  o: { x0: number; ancho: number; arriba: number; alto: number; z: number }
) {
  const NX = 22;
  const NY = 40;
  type V = { id: number; p: THREE.Vector3; fijo: boolean; muelles: number[] };
  const vertices: V[] = [];
  const columnas: V[][] = [];
  const muelles: { a: V; b: V }[] = [];
  for (let x = 0; x <= NX; x++) {
    const col: V[] = [];
    for (let y = 0; y <= NY; y++) {
      // pliegues de origen: la tela fruncida en el riel ondula en z
      const fx = x / NX;
      const p = new THREE.Vector3(
        o.x0 + fx * o.ancho,
        o.arriba - (y / NY) * o.alto,
        o.z + Math.sin(fx * Math.PI * 7) * 0.035
      );
      const v: V = { id: vertices.length, p, fijo: y === 0, muelles: [] };
      vertices.push(v);
      col.push(v);
    }
    columnas.push(col);
  }
  const unir = (a: V, b: V) => {
    const id = muelles.length;
    muelles.push({ a, b });
    a.muelles.push(id);
    b.muelles.push(id);
  };
  for (let x = 0; x <= NX; x++) {
    for (let y = 0; y <= NY; y++) {
      const v = columnas[x]?.[y] as V;
      if (x > 0) unir(v, columnas[x - 1]?.[y] as V);
      if (y > 0) unir(v, columnas[x]?.[y - 1] as V);
      if (x > 0 && y > 0) unir(v, columnas[x - 1]?.[y - 1] as V);
      if (x > 0 && y < NY) unir(v, columnas[x - 1]?.[y + 1] as V);
      // flexión: la tela no se arruga como papel de seda
      if (x > 1) unir(v, columnas[x - 2]?.[y] as V);
      if (y > 1) unir(v, columnas[x]?.[y - 2] as V);
    }
  }

  const nV = vertices.length;
  const nM = muelles.length;
  const listaMuelles: number[] = [];
  const posiciones = new Float32Array(nV * 3);
  const params = new Uint32Array(nV * 3);
  for (const v of vertices) {
    posiciones.set([v.p.x, v.p.y, v.p.z], v.id * 3);
    params[v.id * 3] = v.fijo ? 1 : 0;
    if (!v.fijo) {
      params[v.id * 3 + 1] = v.muelles.length;
      params[v.id * 3 + 2] = listaMuelles.length;
      listaMuelles.push(...v.muelles);
    }
  }
  const bPos = instancedArray(posiciones, "vec3").setPBO(true);
  const bFuerza = instancedArray(nV, "vec3");
  const bParams = instancedArray(params, "uvec3");
  const bLista = instancedArray(new Uint32Array(listaMuelles), "uint").setPBO(
    true
  );
  const ids = new Uint32Array(nM * 2);
  const reposo = new Float32Array(nM);
  muelles.forEach((m, i) => {
    ids[i * 2] = m.a.id;
    ids[i * 2 + 1] = m.b.id;
    reposo[i] = m.a.p.distanceTo(m.b.p);
  });
  const bIds = instancedArray(ids, "uvec2").setPBO(true);
  const bReposo = instancedArray(reposo, "float");
  const bFuerzaMuelle = instancedArray(nM, "vec3").setPBO(true);

  const rigidez = uniform(0.22);
  const amortiguacion = uniform(0.985);
  const viento = uniform(1);
  const zVidrio = uniform(o.z - 0.06);

  const fuerzasMuelles = Fn(() => {
    const par = bIds.element(instanceIndex);
    const largo = bReposo.element(instanceIndex);
    const a = bPos.element(par.x);
    const b = bPos.element(par.y);
    const d = b.sub(a).toVar();
    const dist = d.length().max(0.000001).toVar();
    bFuerzaMuelle
      .element(instanceIndex)
      .assign(dist.sub(largo).mul(rigidez).mul(d).mul(0.5).div(dist));
  })().compute(nM);

  const fuerzasVertices = Fn(() => {
    const p = bParams.element(instanceIndex).toVar();
    If(p.x, () => {
      Return();
    });
    const pos = bPos.element(instanceIndex).toVar();
    const f = bFuerza.element(instanceIndex).toVar();
    f.mulAssign(amortiguacion);
    const desde = p.z.toVar();
    const hasta = desde.add(p.y).toVar();
    Loop(
      { start: desde, end: hasta, type: "uint", condition: "<" },
      ({ i }) => {
        const id = bLista.element(i).toVar();
        const fm = bFuerzaMuelle.element(id);
        const par = bIds.element(id);
        f.addAssign(fm.mul(select(par.x.equal(instanceIndex), 1.0, -1.0)));
      }
    );
    // gravedad y la brisa del mar, que entra por la ventana hacia la sala (+z) en ráfagas suaves.
    // Sin asignar componentes sueltos (f.y.subAssign…): Tint de WebGPU falla al compilar algunos
    // («swizzle view instruction still has usages after lowering»); se suma un vector entero
    const rafaga = triNoise3D(pos.mul(0.7), 0.4, time.mul(0.35)).sub(0.15);
    const pulso = time.mul(0.5).sin().mul(0.5).add(0.7);
    f.addAssign(
      vec3(
        rafaga.mul(0.00003).mul(viento),
        -0.00004,
        rafaga.mul(0.00011).mul(pulso).mul(viento)
      )
    );
    const libre = pos.add(f);
    // el vidrio: la tela no lo atraviesa
    const nueva = vec3(libre.x, libre.y, max(libre.z, zVidrio)).toVar();
    bFuerza.element(instanceIndex).assign(nueva.sub(pos));
    bPos.element(instanceIndex).assign(nueva);
  })().compute(nV);

  // la malla: cada vértice es el centro de 4 vértices de Verlet (de ahí también su normal)
  const nGeo = NX * NY;
  const idsGeo = new Uint32Array(nGeo * 4);
  const indices: number[] = [];
  const indice = (x: number, y: number) => y * NX + x;
  for (let x = 0; x < NX; x++) {
    for (let y = 0; y < NY; y++) {
      const k = indice(x, y);
      idsGeo[k * 4] = (columnas[x]?.[y] as V).id;
      idsGeo[k * 4 + 1] = (columnas[x + 1]?.[y] as V).id;
      idsGeo[k * 4 + 2] = (columnas[x]?.[y + 1] as V).id;
      idsGeo[k * 4 + 3] = (columnas[x + 1]?.[y + 1] as V).id;
      if (x > 0 && y > 0) {
        indices.push(indice(x, y), indice(x - 1, y), indice(x - 1, y - 1));
        indices.push(indice(x, y), indice(x - 1, y - 1), indice(x, y - 1));
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(nGeo * 3), 3)
  );
  geo.setAttribute("vertexIds", new THREE.BufferAttribute(idsGeo, 4));
  geo.setIndex(indices);
  const mat = new THREE.MeshPhysicalNodeMaterial({
    color: "#F3F4F3",
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.62,
    roughness: 0.92,
    sheen: 0.7,
    sheenRoughness: 0.8,
    sheenColor: new THREE.Color("#FFFFFF"),
  });
  mat.positionNode = Fn(({ material }: { material: Nodo }) => {
    const v: Nodo = attribute("vertexIds", "uvec4");
    const a = bPos.element(v.x).toVar();
    const b = bPos.element(v.y).toVar();
    const c = bPos.element(v.z).toVar();
    const d = bPos.element(v.w).toVar();
    const t = b.add(d).sub(a.add(c)).normalize();
    const bt = c.add(d).sub(a.add(b)).normalize();
    material.normalNode = transformNormalToView(cross(t, bt)).toVarying();
    return a.add(b).add(c).add(d).mul(0.25);
  })();
  const malla = new THREE.Mesh(geo, mat);
  malla.frustumCulled = false;
  escena.add(malla);

  // el mismo número de pasos por segundo en cualquier pantalla
  const PASO = 1 / 360;
  let acumulado = 0;
  return {
    paso: (dt: number) => {
      acumulado += Math.min(dt, 1 / 30);
      let n = 0;
      while (acumulado >= PASO && n < 12) {
        renderer.compute(fuerzasMuelles);
        renderer.compute(fuerzasVertices);
        acumulado -= PASO;
        n++;
      }
    },
    viento,
    liberar: () => {
      geo.dispose();
      mat.dispose();
    },
  };
}

const LUMA = vec3(0.2126, 0.7152, 0.0722);
const girar = (v: Nodo, grados: number) => {
  const r = THREE.MathUtils.degToRad(grados);
  const c = Math.cos(r);
  const s = Math.sin(r);
  return vec2(v.x.mul(c).sub(v.y.mul(s)), v.x.mul(s).add(v.y.mul(c)));
};

/** los cuatro medios sobre la salida de la foto. medioA y medioB son 0 foto · 1 impresa ·
 *  2 pintada · 3 en pantalla; «mezcla» barre de abajo arriba de A a B */
export function cadenaMedios(foto: Nodo, dpr: number) {
  const tex = convertToTexture(foto);
  const px = uniform(dpr);
  const medioA = uniform(0, "int");
  const medioB = uniform(0, "int");
  const mezcla = uniform(0);
  const muestra = (uv: Nodo) => tex.sample(uv).rgb;

  // ── impresa: CMYK en cuatro retículas giradas ──
  const PAPEL = vec3(0.952, 0.95, 0.935);
  // ángulo, canal, color de la tinta y cuánto pesa (el amarillo puro calentaba los grises)
  const TINTAS: [number, number, Nodo, number][] = [
    [15, 0, vec3(0.0, 0.58, 0.86), 0.92], // cian
    [75, 1, vec3(0.86, 0.1, 0.48), 0.86], // magenta
    [0, 2, vec3(1.0, 0.9, 0.0), 0.7], // amarillo
    [45, 3, vec3(0.14, 0.14, 0.16), 0.92], // negro
  ];
  const impresa = Fn(() => {
    const res = screenSize;
    const tam = float(6.5).mul(px);
    const col = PAPEL.toVar();
    for (const [angulo, canal, tinta, peso] of TINTAS) {
      const g = girar(screenUV.mul(res), angulo).div(tam);
      const centro = floor(g).add(0.5);
      const uvCentro = girar(centro.mul(tam), -angulo).div(res);
      // a una variable: los componentes de una muestra de textura usados varias veces rompían
      // la compilación en Tint («swizzle view instruction still has usages after lowering»)
      const c = muestra(uvCentro).toVar();
      // el negro solo entra en los tonos oscuros: los grises claros salen de las tres tintas de color
      // (como hace una imprenta); con el negro completo, el papel se llenaba de puntos negros
      const k = float(1)
        .sub(max(c.r, max(c.g, c.b)))
        .sub(0.32)
        .max(0)
        .div(0.68);
      const inv = max(float(1).sub(k), 0.0001);
      const cobertura = [
        float(1).sub(c.r).sub(k).div(inv),
        float(1).sub(c.g).sub(k).div(inv),
        float(1).sub(c.b).sub(k).div(inv),
        k,
      ][canal] as Nodo;
      const d = length(fract(g).sub(0.5));
      const r = sqrt(clamp(cobertura, 0, 1)).mul(0.62);
      const aa = fwidth(d);
      const punto = float(1).sub(smoothstep(r.sub(aa), r.add(aa), d));
      col.mulAssign(mix(vec3(1), tinta, punto.mul(peso)));
    }
    return col;
  });

  // ── pintada: Kuwahara circular de 8 sectores ──
  const pintada = Fn(() => {
    const res = screenSize;
    const radio = 6;
    const separacion = float(2.2).mul(px);
    const medias: Nodo[] = [];
    const varianzas: Nodo[] = [];
    for (let s = 0; s < 8; s++) {
      const base = (s * Math.PI * 2) / 8;
      const suma = vec3(0).toVar();
      const suma2 = vec3(0).toVar();
      const peso = float(0).toVar();
      for (let r = 1; r <= radio; r++) {
        for (const da of [-0.3, 0.3]) {
          const a = base + da;
          const w = (1 - r / (radio + 1)) ** 2 + 0.1;
          const off = vec2(Math.cos(a) * r, Math.sin(a) * r)
            .mul(separacion)
            .div(res);
          const c = muestra(screenUV.add(off));
          suma.addAssign(c.mul(w));
          suma2.addAssign(c.mul(c).mul(w));
          peso.addAssign(w);
        }
      }
      const m = suma.div(peso);
      medias.push(m);
      varianzas.push(dot(suma2.div(peso).sub(m.mul(m)), LUMA).abs());
    }
    // se queda con los sectores más parejos (el pincel sigue la forma, no la borra)
    const total = vec3(0).toVar();
    const pesos = float(0).toVar();
    medias.forEach((m, i) => {
      const w = float(1).div(varianzas[i].add(0.0004).pow(2));
      total.addAssign(m.mul(w));
      pesos.addAssign(w);
    });
    const c = total.div(pesos).toVar();
    // un poco más de color, como el óleo, y la trama de la tela del lienzo
    const l = dot(c, LUMA);
    c.assign(mix(vec3(l), c, 1.18));
    const tela = screenUV.mul(res).div(px).mul(vec2(0.9, 1.1)).sin().mul(0.012);
    return c.add(tela.x.add(tela.y));
  });

  // ── en pantalla: panel LED escalonado con tres subpíxeles ──
  const pantalla = Fn(() => {
    const res = screenSize;
    const celda = float(10).mul(px);
    const p0 = screenUV.mul(res).div(celda);
    const columna = floor(p0.x);
    const corrimiento = columna.mod(2).mul(0.5);
    const p = vec2(p0.x, p0.y.add(corrimiento)).toVar();
    const celdaP = floor(p).add(0.5);
    const centro = vec2(celdaP.x, celdaP.y.sub(corrimiento));
    const c = muestra(centro.mul(celda).div(res));
    const local = fract(p);
    const sub = floor(local.x.mul(3));
    const sx = fract(local.x.mul(3)).mul(2).sub(1);
    const sy = local.y.mul(2).sub(1);
    const forma = smoothstep(
      0.0,
      0.9,
      float(1).sub(sx.mul(sx).mul(0.85)).sub(sy.mul(sy).mul(0.55))
    );
    const canal = vec3(
      select(sub.equal(0), 1, 0),
      select(sub.equal(1), 1, 0),
      select(sub.equal(2), 1, 0)
    );
    // cada subpíxel solo da un tercio de la luz: se compensa, y la luz que sangra entre LED
    // (la imagen muy tenue debajo) evita que el panel se vea negro desde lejos
    return c.mul(canal).mul(forma).mul(3.6).add(c.mul(0.12)).add(0.004);
  });

  const medio = (i: Nodo) => {
    const r = vec3(0).toVar();
    If(i.equal(int(1)), () => {
      r.assign(impresa());
    })
      .ElseIf(i.equal(int(2)), () => {
        r.assign(pintada());
      })
      .ElseIf(i.equal(int(3)), () => {
        r.assign(pantalla());
      })
      .Else(() => {
        r.assign(muestra(screenUV));
      });
    return r;
  };

  const salida = Fn(() => {
    const a = medio(medioA).toVar();
    const res = vec3(0).toVar();
    // el borde del barrido es un poco irregular, como el canto de una hoja
    const desdeAbajo = float(1).sub(screenUV.y);
    const borde = mezcla
      .mul(1.12)
      .sub(0.06)
      .add(screenUV.x.mul(13).sin().mul(0.006));
    const cuanto = smoothstep(borde.add(0.012), borde.sub(0.012), desdeAbajo);
    If(mezcla.greaterThan(0.0001), () => {
      res.assign(mix(a, medio(medioB), cuanto));
    }).Else(() => {
      res.assign(a);
    });
    return vec4(res, 1);
  })();

  return { salida, medioA, medioB, mezcla, px };
}
