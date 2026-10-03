/**
 * Rend le film en FR et en EN, plus son image d'affiche, dans `../static/media/`.
 *
 *   bun run render            → kotbo-film-<fr|en>.mp4 + -poster.jpg
 *   bun run render -- --stills 120,400   → images de contrôle dans out/
 *
 * H.264 seul : à qualité égale, il pesait 40 % de moins que le VP9 sur ce film
 * (aplats, texte), et tous les navigateurs le lisent.
 *
 * La musique est posée si `public/music.mp3` existe (piste libre de droits,
 * fournie à part). Sans elle, le film est muet et le site masque le bouton son.
 */
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const media = fileURLToPath(new URL('../../static/media/', import.meta.url));
const out = fileURLToPath(new URL('../out/', import.meta.url));
const stillsArg = process.argv.indexOf('--stills');
const stills = stillsArg > -1 ? process.argv[stillsArg + 1].split(',').map(Number) : null;
const locales = process.argv.includes('--en') ? ['en'] : process.argv.includes('--fr') ? ['fr'] : ['fr', 'en'];
const music = existsSync(`${root}/public/music.mp3`);

mkdirSync(media, { recursive: true });
mkdirSync(out, { recursive: true });

const serveUrl = await bundle({ entryPoint: `${root}/src/index.ts` });

for (const locale of locales) {
  const inputProps = { locale, music };
  const composition = await selectComposition({ serveUrl, id: `kotbo-${locale}`, inputProps });

  if (stills) {
    for (const frame of stills) {
      await renderStill({ serveUrl, composition, inputProps, frame, output: `${out}/${locale}-${frame}.png` });
      console.log('still', locale, frame);
    }
    continue;
  }

  // L'affiche : le mur des modules avec le titre final, aussi l'image fixe du mouvement réduit.
  await renderStill({ serveUrl, composition, inputProps, frame: 1760, imageFormat: 'jpeg', jpegQuality: 86, output: `${media}/kotbo-film-${locale}-poster.jpg` });

  await renderMedia({
    serveUrl,
    composition,
    inputProps,
    codec: 'h264',
    crf: 26,
    muted: !music,
    audioCodec: music ? 'aac' : undefined,
    outputLocation: `${media}/kotbo-film-${locale}.mp4`,
    onProgress: ({ progress }) => process.stdout.write(`\r${locale} mp4 ${Math.round(progress * 100)} %`),
  });
  console.log();
}
