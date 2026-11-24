/**
 * Les couvertures animées : `static/blog/covers/<clé>-<fr|en>.mp4`, 1200 × 630,
 * 5 s, 24 images par seconde, sans son. Même page que la couverture fixe
 * (`render-covers.mjs`) avec le mouvement de `MOTION_CSS`.
 *
 * Les animations CSS sont pilotées à la main : à chaque image, on fixe
 * `currentTime` de toutes les animations de la page (Web Animations), puis on
 * photographie. Le rendu est donc identique d'une exécution à l'autre, sans
 * dépendre de la vitesse de la machine.
 *
 * Usage : node scripts/render-motion.mjs [clé…]   (sans argument : tout)
 * Demande Chrome (CHROME_PATH) et ffmpeg dans le PATH ; playwright-core vient
 * de `motion/node_modules`.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { SCENE_OF, renderScene } from './covers/scenes.mjs';
import { html, targets } from './render-covers.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'static/blog/covers');
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const { chromium } = createRequire(join(ROOT, 'motion/package.json'))('playwright-core');

const FPS = 24;
const SECONDS = 5;
const only = new Set(process.argv.slice(2));

function encode(output) {
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((ok, fail) => {
    ff.on('close', (code) => (code === 0 ? ok() : fail(new Error(`ffmpeg a échoué (${code}) pour ${output}`))));
    ff.on('error', fail);
  });
  return { ff, done };
}

mkdirSync(OUT, { recursive: true });
const work = join(tmpdir(), 'kotbo-motion');
mkdirSync(work, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
let done = 0;

try {
  for (const { key, byLoc } of targets()) {
    if (only.size && !only.has(key)) continue;
    const scene = SCENE_OF[key];
    if (!scene) continue;
    for (const loc of ['fr', 'en']) {
      const file = join(work, `${key}-${loc}.html`);
      writeFileSync(file, html({ key, ...byLoc[loc], scene: renderScene(scene, loc), motion: true }), 'utf8');
      await page.goto(pathToFileURL(file).href);
      await page.evaluate(() => document.fonts.ready);

      const { ff, done: encoded } = encode(join(OUT, `${key}-${loc}.mp4`));
      for (let i = 0; i < FPS * SECONDS; i++) {
        const ms = (i / FPS) * 1000;
        await page.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), ms);
        ff.stdin.write(await page.screenshot({ type: 'jpeg', quality: 92 }));
      }
      ff.stdin.end();
      await encoded;
      done += 1;
    }
  }
} finally {
  await browser.close();
  rmSync(work, { recursive: true, force: true });
}
console.log(`${done} animations dans static/blog/covers`);
