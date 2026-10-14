import type { Handle } from '@sveltejs/kit';
import { localeOfPath } from '$lib/i18n/routes';
import { THEME_BOOT } from '$lib/theme-boot.js';

/**
 * La langue du document au prérendu : `en` sur les pages anglaises (`/en`...),
 * `fr` partout ailleurs. Google lit cet attribut avant d'exécuter le moindre
 * script. Le thème choisi est posé au même endroit, avant le premier affichage
 * (`lib/theme-boot.js`).
 */
export const handle: Handle = ({ event, resolve }) => {
	const lang = localeOfPath(event.url.pathname) ?? 'fr';
	return resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', lang).replace('%theme.boot%', THEME_BOOT) });
};
