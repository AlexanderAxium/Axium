// Homografía del rectángulo del vídeo (w×h desde 0,0) a las cuatro esquinas de la pantalla, como matrix3d de CSS
const adj = (m) => [m[4]*m[8]-m[5]*m[7], m[2]*m[7]-m[1]*m[8], m[1]*m[5]-m[2]*m[4], m[5]*m[6]-m[3]*m[8], m[0]*m[8]-m[2]*m[6], m[2]*m[3]-m[0]*m[5], m[3]*m[7]-m[4]*m[6], m[1]*m[6]-m[0]*m[7], m[0]*m[4]-m[1]*m[3]];
const mm = (a, b) => { const c = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { let s = 0; for (let k = 0; k < 3; k++) s += a[3*i+k]*b[3*k+j]; c[3*i+j] = s; } return c; };
const mv = (m, v) => [m[0]*v[0]+m[1]*v[1]+m[2]*v[2], m[3]*v[0]+m[4]*v[1]+m[5]*v[2], m[6]*v[0]+m[7]*v[1]+m[8]*v[2]];
const base = ([a, b, c, d]) => { const m = [a[0], b[0], c[0], a[1], b[1], c[1], 1, 1, 1]; const v = mv(adj(m), [d[0], d[1], 1]); return mm(m, [v[0],0,0, 0,v[1],0, 0,0,v[2]]); };
const [w, h] = [1280, 720];
const e = 1.5; // hacia fuera, para tapar el borde suavizado de la clave
const q = [[1879.3 - e, 297.8 - e], [2723.8 + e, 214.4 - e], [2695.4 + e, 851.9 + e], [1853.6 - e, 809.0 + e]];
const m = mm(base(q), adj(base([[0,0],[w,0],[w,h],[0,h]])));
const k = m.map((x) => x / m[8]);
const css = [k[0], k[3], 0, k[6], k[1], k[4], 0, k[7], 0, 0, 1, 0, k[2], k[5], 0, k[8]].map((x) => Number(x.toPrecision(9)));
// comprobar: las esquinas del vídeo caen en las de la pantalla
const p = (x, y) => { const X = k[0]*x + k[1]*y + k[2], Y = k[3]*x + k[4]*y + k[5], W = k[6]*x + k[7]*y + k[8]; return [+(X/W).toFixed(2), +(Y/W).toFixed(2)]; };
console.log(JSON.stringify([p(0,0), p(w,0), p(w,h), p(0,h)]), "vs", JSON.stringify(q));
console.log(`matrix3d(${css.join(",")})`);
