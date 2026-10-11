import type { Handle } from '@sveltejs/kit';
import { base } from '$app/paths';
import { localeOfPath } from '$lib/i18n/routes';

/**
 * L'attribut `lang` de `<html>` suit l'URL dès le HTML prérendu : c'est lui
 * que lisent les moteurs et les lecteurs d'écran, avant tout JavaScript.
 */
export const handle: Handle = ({ event, resolve }) => {
	const path = event.url.pathname.slice(base.length) || '/';
	const lang = localeOfPath(path) ?? 'fr';
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang),
	});
};
