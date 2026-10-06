// Extractor de estilo para pegar en browser_evaluate (Playwright MCP).
// Devuelve: paleta, tipografía, hero, CTAs, imágenes grandes, señales de animación, conteo de proyectos.
// Uso: copiar el cuerpo de la función como `function` en mcp__playwright__browser_evaluate.
async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const H = () => document.documentElement.scrollHeight;
  for (let y = 0; y < Math.min(H(), 30000); y += 700) { window.scrollTo(0, y); await sleep(120); }
  window.scrollTo(0, 0); await sleep(400);
  const cs = (e) => getComputedStyle(e);
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const area = (e) => { const r = e.getBoundingClientRect(); return r.width * r.height; };
  const all = [...document.querySelectorAll('body *')].filter(vis).slice(0, 4000);
  // paleta por área
  const bg = {}, fg = {};
  for (const e of all) { const s = cs(e); const b = s.backgroundColor; if (b && !/rgba\(0, 0, 0, 0\)|transparent/.test(b)) bg[b] = (bg[b] || 0) + area(e); if (e.children.length === 0 && e.textContent.trim()) fg[s.color] = (fg[s.color] || 0) + e.textContent.trim().length; }
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k);
  // tipografía
  const fam = {};
  for (const e of all) { if (e.children.length === 0 && e.textContent.trim().length > 2) { const s = cs(e); const f = s.fontFamily.split(',')[0].replace(/["']/g, '').trim(); const key = f; fam[key] = fam[key] || { chars: 0, roles: {}, weights: new Set(), sizes: new Set() }; fam[key].chars += e.textContent.trim().length; const role = /^H[1-3]$/.test(e.tagName) ? e.tagName : (e.closest('a,button') ? 'link/btn' : 'body'); fam[key].roles[role] = (fam[key].roles[role] || 0) + 1; fam[key].weights.add(s.fontWeight); fam[key].sizes.add(Math.round(parseFloat(s.fontSize))); } }
  const fonts = Object.entries(fam).sort((a, b) => b[1].chars - a[1].chars).slice(0, 5).map(([f, v]) => ({ family: f, chars: v.chars, roles: v.roles, weights: [...v.weights].sort(), sizes: [...v.sizes].sort((a, b) => b - a).slice(0, 8) }));
  const heads = ['h1', 'h2', 'h3'].map(t => { const e = document.querySelector(t); if (!e) return null; const s = cs(e); return { tag: t, txt: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 90), size: s.fontSize, weight: s.fontWeight, family: s.fontFamily.split(',')[0].replace(/["']/g, ''), lh: s.lineHeight, ls: s.letterSpacing, tt: s.textTransform, color: s.color, italic: s.fontStyle }; }).filter(Boolean);
  // hero: primer bloque >= 60vh
  const hero = [...document.querySelectorAll('section, header, main > div, body > div > div')].filter(vis).find(e => { const r = e.getBoundingClientRect(); return r.top < 200 && r.height > innerHeight * 0.5; });
  const heroInfo = hero ? (() => { const s = cs(hero); const r = hero.getBoundingClientRect(); return { h: Math.round(r.height), bg: s.backgroundColor, bgImg: s.backgroundImage.slice(0, 60), hasVideo: !!hero.querySelector('video'), hasCanvas: !!hero.querySelector('canvas'), imgs: hero.querySelectorAll('img').length, text: hero.innerText.trim().replace(/\s+/g, ' ').slice(0, 220) }; })() : null;
  // CTAs
  const ctas = [...document.querySelectorAll('a, button')].filter(vis).map(e => { const s = cs(e); return { e, s, b: s.backgroundColor, border: s.borderTopWidth !== '0px' }; }).filter(x => (!/rgba\(0, 0, 0, 0\)|transparent/.test(x.b) || x.border) && x.e.textContent.trim().length > 1 && x.e.textContent.trim().length < 40).slice(0, 40);
  const ctaMap = {}; for (const { e, s } of ctas) { const k = `${e.textContent.trim()}|${s.backgroundColor}`; if (!ctaMap[k]) ctaMap[k] = { txt: e.textContent.trim(), bg: s.backgroundColor, color: s.color, radius: s.borderRadius, pad: s.padding, font: s.fontFamily.split(',')[0].replace(/["']/g, ''), size: s.fontSize, weight: s.fontWeight, border: s.border.slice(0, 40), tt: s.textTransform, hasArrow: /→|↗|›|>|arrow/i.test(e.innerHTML) }; }
  // imágenes
  const imgs = [...document.querySelectorAll('img, video')].filter(e => vis(e) && e.getBoundingClientRect().width > 250).slice(0, 40).map(e => { const r = e.getBoundingClientRect(); const s = cs(e); const p = e.parentElement; return { tag: e.tagName, src: (e.currentSrc || e.src || (e.querySelector && e.querySelector('source')?.src) || '').slice(-70), w: Math.round(r.width), h: Math.round(r.height), ratio: (r.width / r.height).toFixed(2), nat: e.naturalWidth ? e.naturalWidth + 'x' + e.naturalHeight : '', radius: s.borderRadius, pRadius: cs(p).borderRadius, pBg: cs(p).backgroundColor, fit: s.objectFit }; });
  const ratios = {}; for (const i of imgs) ratios[i.ratio] = (ratios[i.ratio] || 0) + 1;
  // animación
  const scripts = [...document.scripts].map(s => s.src).filter(Boolean).join(' ');
  const anim = { gsap: !!window.gsap, lenis: !!(window.Lenis || /lenis/i.test(scripts)), locomotive: /locomotive/i.test(scripts), framer: /framer/i.test(scripts), webflow: /webflow/i.test(scripts), splitText: !!(window.SplitText || /split-?text/i.test(scripts)), threejs: !!(window.THREE || /three/i.test(scripts)), videos: document.querySelectorAll('video').length, canvases: document.querySelectorAll('canvas').length, opacity0: all.filter(e => cs(e).opacity === '0').length, customCursor: !!document.querySelector('[class*=cursor]') };
  const projLinks = [...new Set([...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => /\/(work|project|projects|case|cases|case-stud|portfolio|our-work)[s]?\//i.test(h)))];
  return { url: location.href, title: document.title, scrollH: H(), bodyBg: cs(document.body).backgroundColor, paletteBg: top(bg, 8), paletteFg: top(fg, 5), fonts, heads, hero: heroInfo, ctas: Object.values(ctaMap).slice(0, 8), imgCount: imgs.length, imgRatios: ratios, imgSample: imgs.slice(0, 6), anim, projLinks: projLinks.length, projSample: projLinks.slice(0, 6) };
}
