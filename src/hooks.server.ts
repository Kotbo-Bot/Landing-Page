import type { Handle } from '@sveltejs/kit';
import { localeOfPath } from '$lib/i18n/routes';

/**
 * La langue du document au prérendu : `en` sur les pages anglaises (`/en`...),
 * `fr` partout ailleurs. Google lit cet attribut avant d'exécuter le moindre
 * script.
 */
export const handle: Handle = ({ event, resolve }) => {
	const lang = localeOfPath(event.url.pathname) ?? 'fr';
	return resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', lang) });
};
