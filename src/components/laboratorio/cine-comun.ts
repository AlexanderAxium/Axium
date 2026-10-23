// Lo que comparten las dos versiones del «cine» del laboratorio (2026-10-16): la de vídeo
// pre-renderizado (cine.tsx) y la de tiempo real (cine-vivo.tsx). Los capítulos y el sonido
// sintetizado viven aquí para que las dos cuenten lo mismo y suenen igual.

export const ESTADOS = 5;
export const CAPITULOS: {
  marca: string;
  titulo: string;
  texto?: string;
}[] = [
  {
    marca: "Axium · Lima",
    titulo: "Diseño, software e IA para empresas que quieren crecer.",
  },
  {
    marca: "01 — Diseño",
    titulo: "Interfaces que se entienden a la primera.",
    texto: "Marca, web y producto con un mismo criterio visual.",
  },
  {
    marca: "02 — Software",
    titulo: "Sistemas a medida que aguantan el día a día.",
    texto: "Paneles, reservas, pagos e integraciones, de la idea a producción.",
  },
  {
    marca: "03 — IA",
    titulo: "Inteligencia artificial dentro de tu operación.",
    texto:
      "Asistentes, automatizaciones y extracción de datos que ahorran horas.",
  },
  {
    marca: "04 — Hablemos",
    titulo: "Un solo equipo, de la primera idea a producción.",
  },
];
export const NOMBRES = ["Portada", "Diseño", "Software", "IA", "Hablemos"];

// ── sonido: todo sintetizado, sin archivos ──
export class Sonido {
  ctx: AudioContext;
  master: GainNode;
  ruido: AudioBuffer;
  constructor() {
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
    // ruido marrón (más grave que el blanco): base del ambiente y de las ráfagas
    const n = this.ctx.sampleRate * 2;
    this.ruido = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const d = this.ruido.getChannelData(0);
    let u = 0;
    for (let i = 0; i < n; i++) {
      u = (u + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      d[i] = u * 3.5;
    }
    this.ambiente();
  }
  ambiente() {
    const c = this.ctx;
    const pad = c.createGain();
    pad.gain.value = 0.22;
    pad.connect(this.master);
    for (const [f, g] of [
      [55, 0.5],
      [82.4, 0.32],
      [110.3, 0.12],
    ] as const) {
      const o = c.createOscillator();
      o.frequency.value = f;
      const og = c.createGain();
      og.gain.value = g;
      o.connect(og).connect(pad);
      o.start();
    }
    const r = c.createBufferSource();
    r.buffer = this.ruido;
    r.loop = true;
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 420;
    const lfo = c.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoG = c.createGain();
    lfoG.gain.value = 260;
    lfo.connect(lfoG).connect(lp.frequency);
    const rg = c.createGain();
    rg.gain.value = 0.35;
    r.connect(lp).connect(rg).connect(pad);
    r.start();
    lfo.start();
  }
  activar(si: boolean) {
    const t = this.ctx.currentTime;
    if (si) this.ctx.resume();
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(si ? 0.5 : 0, t, 0.4);
  }
  /** ráfaga que acompaña la transición: el pico cae en el medio, donde el vídeo va más rápido */
  rafaga(dur: number) {
    const c = this.ctx;
    const t = c.currentTime;
    const r = c.createBufferSource();
    r.buffer = this.ruido;
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(260, t);
    bp.frequency.exponentialRampToValueAtTime(2400, t + dur * 0.5);
    bp.frequency.exponentialRampToValueAtTime(320, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.9, t + dur * 0.5);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    r.connect(bp).connect(g).connect(this.master);
    r.start(t, Math.random());
    r.stop(t + dur + 0.05);
  }
  clic(f = 1600) {
    const c = this.ctx;
    const t = c.currentTime;
    const o = c.createOscillator();
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 0.6, t + 0.06);
    const g = c.createGain();
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.1);
  }
}
