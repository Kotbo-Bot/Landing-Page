/**
 * Rend le clip de l'offre gratuite en FR et en EN dans `../static/media/`.
 *
 *   bun run render:freemium                      → kotbo-gratuit-<fr|en>.mp4 + -poster.jpg
 *   bun run render:freemium -- --stills 60,200   → images de contrôle dans out/
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
const locales = process.argv.includes('--en') ? ['en'] : process.argv.includes('--fr') ? ['fr'] : ['fr', 'en'];

mkdirSync(media, { recursive: true });
mkdirSync(out, { recursive: true });

const serveUrl = await bundle({ entryPoint: `${root}/src/index.ts` });

for (const locale of locales) {
  const composition = await selectComposition({ serveUrl, id: `freemium-${locale}`, inputProps: { locale } });

  if (stills) {
    for (const frame of stills) {
      await renderStill({ serveUrl, composition, frame, scale: 0.5, output: `${out}/freemium-${locale}-${frame}.png` });
      console.log('still', locale, frame);
    }
    continue;
  }

  // L'affiche : les deux colonnes remplies.
  await renderStill({ serveUrl, composition, frame: 235, imageFormat: 'jpeg', jpegQuality: 86, output: `${media}/kotbo-gratuit-${locale}-poster.jpg` });
  await renderMedia({
    serveUrl,
    composition,
    codec: 'h264',
    crf: 24,
    muted: true,
    outputLocation: `${media}/kotbo-gratuit-${locale}.mp4`,
    onProgress: ({ progress }) => process.stdout.write(`\r${locale} ${Math.round(progress * 100)} %`),
  });
  console.log();
}
