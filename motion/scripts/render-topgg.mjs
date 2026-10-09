/**
 * Rend la boucle de la fiche top.gg dans `../static/media/`.
 *
 *   bun run render:topgg                      → topgg-incident.gif + .mp4 + -poster.jpg
 *   bun run render:topgg -- --stills 60,250   → images de contrôle dans out/
 *
 * top.gg n'accepte qu'une <img> dans la description : le GIF est la version
 * affichée. Le MP4 sert au site ou aux réseaux.
 */
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const media = fileURLToPath(new URL('../../static/media/', import.meta.url));
const out = fileURLToPath(new URL('../out/', import.meta.url));
const stillsArg = process.argv.indexOf('--stills');
const stills = stillsArg > -1 ? process.argv[stillsArg + 1].split(',').map(Number) : null;
const only = process.argv.includes('--gif') ? 'gif' : process.argv.includes('--mp4') ? 'mp4' : null;

mkdirSync(media, { recursive: true });
mkdirSync(out, { recursive: true });

const serveUrl = await bundle({ entryPoint: `${root}/src/index.ts` });
const composition = await selectComposition({ serveUrl, id: 'topgg-incident' });

if (stills) {
  for (const frame of stills) {
    await renderStill({ serveUrl, composition, frame, scale: 0.5, output: `${out}/topgg-${frame}.png` });
    console.log('still', frame);
  }
  process.exit(0);
}

// L'affiche : la fiche membre complète, avertissement compris.
await renderStill({ serveUrl, composition, frame: 395, imageFormat: 'jpeg', jpegQuality: 86, output: `${media}/topgg-incident-poster.jpg` });

if (only !== 'mp4') {
  // 15 images/s et 960 px de large : assez pour la colonne de top.gg (~840 px), poids raisonnable.
  await renderMedia({
    serveUrl,
    composition,
    codec: 'gif',
    everyNthFrame: 2,
    numberOfGifLoops: null,
    scale: 0.6,
    outputLocation: `${media}/topgg-incident.gif`,
    onProgress: ({ progress }) => process.stdout.write(`\rgif ${Math.round(progress * 100)} %`),
  });
  console.log();
}

if (only !== 'gif') {
  await renderMedia({
    serveUrl,
    composition,
    codec: 'h264',
    crf: 24,
    muted: true,
    outputLocation: `${media}/topgg-incident.mp4`,
    onProgress: ({ progress }) => process.stdout.write(`\rmp4 ${Math.round(progress * 100)} %`),
  });
  console.log();
}
