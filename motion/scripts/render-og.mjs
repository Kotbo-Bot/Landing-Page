/**
 * Rend l'image des aperçus de lien et les icônes dans `../static/`.
 *
 *   bun run render:og   → og-image.png, icon-512.png, apple-touch-icon.png
 *
 * Les balises qui les annoncent vivent dans `src/lib/seo/Seo.svelte` (taille de
 * l'image comprise) : changer le format ici, c'est le changer là-bas.
 */
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const site = fileURLToPath(new URL('../../static/', import.meta.url));
// Doit rester aligné sur BANNER_FRAME (src/Banner.tsx).
const FRAME = 90;

const serveUrl = await bundle({ entryPoint: `${root}/src/index.ts` });

async function still(id, output, scale = 1) {
  const composition = await selectComposition({ serveUrl, id });
  await renderStill({ serveUrl, composition, frame: FRAME, scale, imageFormat: 'png', output: `${site}/${output}` });
  console.log(output);
}

await still('og-fr', 'og-image.png');
await still('icon', 'icon-512.png');
// 180 px : la taille que demande iOS, sans coins transparents.
await still('icon-bleed', 'apple-touch-icon.png', 180 / 512);
