import { base } from '$app/paths';
import { localeOfPath } from '$lib/i18n/routes';

export const prerender = true;
export const ssr = true;

/** La langue imposée par l'URL, `null` sur les pages qui n'existent qu'en français. */
export function load({ url }) {
	const path = url.pathname.slice(base.length) || '/';
	return { pageLocale: localeOfPath(path), path };
}
