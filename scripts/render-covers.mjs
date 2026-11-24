/**
 * Génère une couverture par billet du blog et par page fonctionnalité, dans
 * chaque langue : `static/blog/covers/<clé>-<fr|en>.png`, 1200 × 630.
 * Même style que les bannières de mise à jour (fond nuit, maquette sombre), la
 * maquette variant avec le sujet (`covers/scenes.mjs`). Servie en tête
 * d'article et comme image de partage.
 *
 * Usage : node scripts/render-covers.mjs [clé…]   (sans argument : tout)
 * Chrome doit être installé (CHROME_PATH pour un autre emplacement).
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { BLOG, blogSlug } from '../src/lib/articles/blog.js';
import { SCENE_OF, renderScene } from './covers/scenes.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'static/blog/covers');
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const only = new Set(process.argv.slice(2));

const FONT = (pkg, file) => pathToFileURL(join(ROOT, 'node_modules/@fontsource', pkg, 'files', file)).href;
const LOGO = pathToFileURL(join(ROOT, 'static/icon-512.png')).href;

const KICKER = {
  fr: { guide: 'GUIDE', news: 'NOUVEAUTÉ', feature: 'FONCTIONNALITÉ' },
  en: { guide: 'GUIDE', news: 'NEWS', feature: 'FEATURE' },
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Étoiles posées de façon déterministe : une couverture ne change pas d'un rendu à l'autre. */
function stars(seed) {
  let s = [...seed].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  return Array.from({ length: 46 }, () => `<i style="left:${(rnd() * 1200) | 0}px;top:${(rnd() * 630) | 0}px;opacity:${(0.25 + rnd() * 0.6).toFixed(2)}"></i>`).join('');
}

const seq = (n, f) => Array.from({ length: n }, (_, i) => f(i + 1)).join('');
const at = (base, step, k) => Math.max(0.3, base + (k - 2) * step).toFixed(2);

/**
 * Le mouvement des couvertures animées (`render-motion.mjs`), réservé au corps
 * `.motion` : la page statique reste l'état final. Les éléments se mettent en
 * place comme dans le dashboard (une ligne arrive, un interrupteur bascule, une
 * barre se remplit, un bouton est pressé), sans rebond ni halo qui pulse
 * (DESIGN.md). Durée : 5 s, la scène s'efface sur les dernières 450 ms pour
 * que la boucle reparte proprement.
 */
export const MOTION_CSS = `
@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes slide{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:none}}
@keyframes show{from{opacity:0}to{opacity:1}}
@keyframes growx{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes growy{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes draw{from{stroke-dashoffset:24}to{stroke-dashoffset:0}}
@keyframes type{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes swbg{from{background:#2a2736}to{background:#8b8cf8}}
@keyframes swknob{from{transform:translateX(-19px);background:#7c7890}to{transform:none;background:#fff}}
@keyframes press{0%,100%{transform:none;filter:none}40%{transform:scale(.94);filter:brightness(1.35)}}
@keyframes out{to{opacity:0}}
body.motion{--ease:cubic-bezier(.2,.7,.2,1)}
body.motion .stage{animation:out .45s linear 4.55s both}
body.motion .stage>.card:first-child{animation:rise .6s var(--ease) .15s both}
body.motion .card.stat{animation:rise .5s var(--ease) 2.1s both}
body.motion .row{animation:slide .45s var(--ease) both}
body.motion .sw.on{animation:swbg .25s ease-out both}
body.motion .sw.on i{animation:swknob .25s ease-out both;animation-delay:inherit}
body.motion .bar i{transform-origin:left;animation:growx .9s var(--ease) both;animation-delay:1s}
body.motion .bars i{transform-origin:bottom;animation:growy .8s var(--ease) both}
body.motion .stat.in{animation:show .5s ease-out both}
body.motion .embed{animation:show .5s ease-out .5s both}
body.motion .embed p{animation:show .45s ease-out both}
body.motion .btn,body.motion .pill{animation:show .4s ease-out 1.5s both,press .5s ease-in-out 3s both}
body.motion .btn:nth-child(2){animation:show .4s ease-out 1.65s both}
body.motion .btn:nth-child(3){animation:show .4s ease-out 1.8s both}
body.motion svg line{animation:show .6s ease-out 1.1s both}
body.motion .elabel{animation:show .5s ease-out 1.6s both}
body.motion .node{animation:rise .5s var(--ease) .5s both}
body.motion .cl{animation:type .5s steps(24) both}
body.motion .tile{animation:rise .45s var(--ease) both}
body.motion .step,body.motion .arrow{animation:show .4s ease-out both}
body.motion .flow ~ .row .chip{animation:show .4s ease-out 2.6s both}
body.motion li{animation:show .4s ease-out both}
body.motion li svg path{stroke-dasharray:24;animation:draw .45s ease-out both;animation-delay:inherit}
`
  + seq(9, (k) => `body.motion .row:nth-child(${k}){animation-delay:${at(0.55, 0.22, k)}s}body.motion .row:nth-child(${k}) .sw.on,body.motion .row:nth-child(${k}) .sw.on i{animation-delay:${at(0.9, 0.22, k)}s}body.motion .row:nth-child(${k}) .bar i{animation-delay:${at(0.8, 0.2, k)}s}`)
  + seq(6, (k) => `body.motion .sig:nth-child(${k}) .bar i{animation-delay:${(0.9 + (k - 1) * 0.2).toFixed(2)}s}body.motion .stat.in:nth-child(${k}){animation-delay:${(0.5 + (k - 1) * 0.15).toFixed(2)}s}body.motion .embed p:nth-of-type(${k}){animation-delay:${(0.8 + (k - 1) * 0.3).toFixed(2)}s}`)
  + seq(12, (k) => `body.motion .bars i:nth-child(${k}){animation-delay:${(0.5 + (k - 1) * 0.07).toFixed(2)}s}`)
  + seq(5, (k) => `body.motion .node:nth-last-child(${k}){animation-delay:${(0.5 + (5 - k) * 0.2).toFixed(2)}s}body.motion .step:nth-child(${k}),body.motion .arrow:nth-child(${k}){animation-delay:${(0.6 + (k - 1) * 0.3).toFixed(2)}s}body.motion .cl:nth-child(${k}){animation-delay:${(0.6 + (k - 1) * 0.55).toFixed(2)}s}body.motion .tile:nth-child(${k}){animation-delay:${(0.7 + (k - 1) * 0.18).toFixed(2)}s}`)
  + seq(3, (k) => `body.motion li:nth-child(${k}){animation-delay:${(1 + k * 0.25).toFixed(2)}s}`)
  + 'body.motion .row.col .bar i{animation-delay:2s}';

export function html({ key, kicker, title, bullets, scene, motion = false }) {
  const size = title.length <= 40 ? 50 : title.length <= 70 ? 42 : 35;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Inter;font-weight:400;src:url("${FONT('inter', 'inter-latin-400-normal.woff2')}")}
@font-face{font-family:Inter;font-weight:600;src:url("${FONT('inter', 'inter-latin-600-normal.woff2')}")}
@font-face{font-family:Outfit;font-weight:800;src:url("${FONT('outfit', 'outfit-latin-800-normal.woff2')}")}
@font-face{font-family:Outfit;font-weight:900;src:url("${FONT('outfit', 'outfit-latin-900-normal.woff2')}")}
@font-face{font-family:JB;font-weight:500;src:url("${FONT('jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff2')}")}
*{box-sizing:border-box;margin:0;padding:0}
:root{--ink:#f4f2fb;--muted:#a7a1c8;--accent:#8b8cf8;--card:#17141f;--line:rgba(255,255,255,.08)}
html,body{width:1200px;height:630px;overflow:hidden}
body{position:relative;font-family:Inter,system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;
background:radial-gradient(760px 460px at 20% 118%,rgba(122,64,214,.55),transparent 70%),radial-gradient(620px 360px at 72% 122%,rgba(88,52,170,.35),transparent 70%),linear-gradient(180deg,#0b0a1c 0%,#140d2e 55%,#231245 100%)}
#stars i{position:absolute;width:2px;height:2px;border-radius:50%;background:#fff}
.mono{font-family:JB,monospace;text-transform:uppercase;letter-spacing:.3em;color:#b9b3d6}
.brand{position:absolute;left:56px;top:44px;display:flex;align-items:center;gap:14px}
.brand img{width:36px;height:36px;border-radius:9px}
.brand b{font:800 26px Outfit;letter-spacing:-.01em}
.brand .mono{font-size:11px;margin-left:8px}
h1{position:absolute;left:56px;top:122px;width:500px;font:900 ${size}px/1.06 Outfit;letter-spacing:-.025em;display:-webkit-box;-webkit-line-clamp:6;-webkit-box-orient:vertical;overflow:hidden}
ul{position:absolute;left:56px;bottom:52px;width:490px;list-style:none;display:grid;gap:15px}
li{display:flex;align-items:center;gap:14px;font-size:18px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
li svg{flex:none;width:20px;height:20px;stroke:var(--accent);fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
li span{overflow:hidden;text-overflow:ellipsis}
.stage{position:absolute;left:590px;top:62px;width:600px;height:500px;display:flex;align-items:center}
.stage>.card:first-child{position:relative;left:0!important;top:0!important}
.card.stat{left:auto!important;top:auto!important;right:-2px;bottom:-8px;box-shadow:0 20px 50px rgba(0,0,0,.6)}
.card{position:absolute;background:var(--card);border:1px solid var(--line);border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,.55);overflow:hidden}
.hd{display:flex;align-items:center;gap:10px;padding:16px 20px;border-bottom:1px solid var(--line);font-size:16px}
.hd .dot{width:9px;height:9px;border-radius:50%;background:var(--accent)}
.hd .r{margin-left:auto;font-size:11px;letter-spacing:.18em}
.row{display:flex;align-items:center;gap:14px;padding:15px 20px;border-bottom:1px solid var(--line)}
.row:last-child{border-bottom:0}.row.col{flex-direction:column;align-items:stretch;gap:10px}
.tx{flex:1;min-width:0}.tx b{display:block;font-size:16px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tx small,.row.col small{display:block;margin-top:3px;font-size:13px;color:#9a96ad;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.row.col small{margin:0;font-size:14px}
.av{width:38px;height:38px;border-radius:50%;flex:none;display:grid;place-items:center;font:600 16px Inter;color:#0b0a1c;font-style:normal}
.chip{padding:5px 11px;border-radius:8px;font-size:13px;font-weight:600;white-space:nowrap}
.sw{width:44px;height:25px;border-radius:13px;background:#2a2736;position:relative;flex:none}
.sw i{position:absolute;left:3px;top:3px;width:19px;height:19px;border-radius:50%;background:#7c7890}
.sw.on{background:#8b8cf8}.sw.on i{left:22px;background:#fff}
.bar{display:block;height:8px;border-radius:5px;background:#2a2736;overflow:hidden;margin-top:6px;flex:1}
.bar i{display:block;height:100%;border-radius:5px}
.stat{padding:14px 18px;border-radius:12px;width:200px}
.stat small{display:block;font-size:12px;color:#9a96ad;margin-bottom:5px}.stat strong{font-size:24px;font-weight:600}
.stat.in{position:static;box-shadow:none;border:1px solid var(--line);border-radius:10px;width:auto;flex:1;background:transparent;padding:12px 14px}
.chat .msg{display:flex;gap:14px;padding:20px}
.chat .who{display:flex;align-items:center;gap:8px;margin-bottom:8px}.who b{font-size:16px}.who small{color:#9a96ad;font-size:12px}
.tag{background:#5865f2;color:#fff;font-size:10px;font-weight:700;padding:2px 5px;border-radius:4px}
.embed{background:#1f1c2b;border-left:4px solid;border-radius:6px;padding:14px 16px;max-width:430px}
.embed h4{font:600 17px Inter;margin-bottom:8px}.embed p{font-size:14px;color:#cfcbe0;line-height:1.45;margin-top:4px}
.btns{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap}.btns.pad{padding:6px 20px 20px}
.btn{padding:9px 16px;border-radius:8px;font-size:14px;font-weight:600}
.pills{display:flex;flex-wrap:wrap;gap:12px;padding:0 18px 22px}
.pill{display:flex;gap:10px;align-items:center;border:1px solid;border-radius:10px;padding:10px 14px;font-size:15px}.pill em{font-style:normal;font-size:13px;font-weight:600}
.kpis{display:flex;gap:12px;padding:18px 20px 6px}
.bars{display:flex;align-items:flex-end;gap:10px;height:210px;padding:12px 20px 22px}
.bars i{flex:1;border-radius:6px 6px 2px 2px;background:linear-gradient(180deg,#8b8cf8,#5b4fd6)}
.rank{width:20px;font:600 15px JB;color:#9a96ad;text-align:center}
.val{text-align:right}.val b{font-size:15px;font-weight:600}.val small{display:block;font-size:12px;color:#9a96ad}
.row .tx .bar{margin-top:7px}
.sigs{padding:6px 20px 8px;display:grid;gap:13px}
.sig{display:flex;align-items:center;gap:12px;font-size:14px;color:#cfcbe0}.sig span{width:200px;flex:none}.sig em{font:600 13px JB;font-style:normal;color:#9a96ad;width:28px;text-align:right}.sig .bar{margin:0}
.node{position:absolute;width:140px;min-height:48px;padding:11px 12px;border:1px solid;border-radius:12px;background:#1f1c2b;display:flex;gap:9px;align-items:center;font-size:13px;line-height:1.2}
.node i{width:10px;height:10px;border-radius:50%;flex:none}
.elabel{position:absolute;transform:translate(-50%,-50%);background:#0f0d18;border:1px solid var(--line);border-radius:8px;padding:4px 9px;font-size:12px;color:#cfcbe0;white-space:nowrap}
.code{padding:16px 20px 20px;font:500 14px/1.5 JB,monospace;display:grid;gap:10px}
.cl span{display:inline-block;min-width:34px;color:#9a96ad}.cl.tool{color:#8b8cf8}.cl.ok{color:#4ade80}.cl.you{color:#f4f2fb}
.url{display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid var(--line)}
.url span{width:10px;height:10px;border-radius:50%;background:#2a2736}.url em{margin-left:12px;font:500 13px JB;font-style:normal;color:#9a96ad;background:#0f0d18;border-radius:8px;padding:6px 12px;flex:1}
.page{padding:28px}.page h4{font:800 28px Outfit;margin-bottom:22px}.tiles{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.tile{display:flex;gap:10px;align-items:center;border:1px solid;border-radius:12px;padding:20px 16px;font-size:15px;background:#1f1c2b}.tile i{width:10px;height:10px;border-radius:50%}
.flow{padding:18px 20px 6px;display:grid;gap:6px}.step{border:1px solid;border-radius:12px;padding:12px 16px;background:#1f1c2b}.step em{display:block;font:500 11px JB;font-style:normal;letter-spacing:.2em;text-transform:uppercase;margin-bottom:4px}.step b{font-size:15px;font-weight:600}
.arrow{text-align:center;color:#6b6780;font-size:18px;line-height:1}
${motion ? MOTION_CSS : ''}
</style></head><body${motion ? ' class="motion"' : ''}>
<div id="stars">${stars(key)}</div>
<div class="brand"><img src="${LOGO}" alt=""><b>Kotbo</b><span class="mono">${esc(kicker)}</span></div>
<h1>${esc(title)}</h1>
<ul>${bullets.map((b) => `<li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>${esc(b)}</span></li>`).join('')}</ul>
<div class="stage">${scene}</div>
</body></html>`;
}

/** Tout ce qu'il y a à couvrir : { key, loc → { kicker, title, bullets } }. */
export function targets() {
  const out = [];
  for (const post of BLOG) {
    const key = blogSlug(post, 'fr');
    const isNews = !post.modules?.length || /^kotbo-|^organigramme|^automatisations|^roles-a-boutons|^documentation|^aegisai/.test(key);
    const byLoc = {};
    for (const loc of ['fr', 'en']) {
      const x = post.text[loc];
      byLoc[loc] = { kicker: KICKER[loc][isNews ? 'news' : 'guide'], title: x.teaser ?? x.title ?? x.h1, bullets: x.sections.slice(0, 3).map((s) => s.h2) };
    }
    out.push({ key, byLoc });
  }
  const pages = JSON.parse(readFileSync(join(ROOT, 'src/lib/data/feature-pages.json'), 'utf8')).pages;
  for (const page of pages) {
    const byLoc = {};
    for (const loc of ['fr', 'en']) {
      const x = page.text[loc];
      byLoc[loc] = { kicker: KICKER[loc].feature, title: x.title.replace(/ · Kotbo$/, ''), bullets: x.sections.slice(0, 3).map((s) => s.h2) };
    }
    out.push({ key: `feature-${page.key}`, byLoc });
  }
  return out;
}

function main() {
mkdirSync(OUT, { recursive: true });
const work = join(tmpdir(), 'kotbo-covers');
mkdirSync(work, { recursive: true });
let done = 0;
const skipped = [];

for (const { key, byLoc } of targets()) {
  if (only.size && !only.has(key)) continue;
  const scene = SCENE_OF[key];
  if (!scene) {
    skipped.push(key);
    continue;
  }
  for (const loc of ['fr', 'en']) {
    const file = join(work, `${key}-${loc}.html`);
    writeFileSync(file, html({ key, ...byLoc[loc], scene: renderScene(scene, loc) }), 'utf8');
    const png = join(OUT, `${key}-${loc}.png`);
    execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--force-device-scale-factor=1', '--window-size=1200,630', '--virtual-time-budget=3000', `--screenshot=${png}`, pathToFileURL(file).href], { stdio: 'ignore' });
    if (!existsSync(png)) throw new Error(`Chrome n'a rien rendu pour ${key}-${loc}`);
    done += 1;
  }
}
rmSync(work, { recursive: true, force: true });
console.log(`${done} couvertures dans static/blog/covers`);
if (skipped.length) console.warn(`Sans scène (ignorées) : ${skipped.join(', ')}`);
}

// Importé par render-motion.mjs : ne rend rien dans ce cas.
if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
