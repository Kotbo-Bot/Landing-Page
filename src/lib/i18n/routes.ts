/**
 * Les pages qui existent dans les deux langues, chacune à sa propre URL.
 *
 * Sur ces pages, c'est l'URL qui décide de la langue, pas le navigateur :
 * Googlebot exécute le JavaScript avec un navigateur réglé en `en-US`, et
 * l'ancienne bascule automatique lui faisait indexer l'accueil français en
 * anglais. Chaque version est prérendue dans sa langue, et les deux se citent
 * en `hreflang` (`Seo.svelte`, `static/sitemap.xml`).
 *
 * Les pages absentes d'ici (les pages légales) n'existent qu'en français et
 * gardent la bascule dans le navigateur.
 */
import type { Locale } from './state.svelte';

// `/en/` avec sa barre finale : voir `routes/en/+page.ts`.
export const HOME_ROUTE = { fr: '/', en: '/en/' } as const;
export const STAFF_ROUTE = { fr: '/gestion-staff-discord', en: '/en/discord-staff-management' } as const;

export const LOCALIZED_ROUTES: ReadonlyArray<Readonly<Record<Locale, string>>> = [HOME_ROUTE, STAFF_ROUTE];

function normalize(path: string): string {
	return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

/** Les deux versions de la page, ou `null` si elle n'existe qu'en français. */
export function alternatesOf(path: string): Readonly<Record<Locale, string>> | null {
	const clean = normalize(path);
	return LOCALIZED_ROUTES.find((route) => normalize(route.fr) === clean || normalize(route.en) === clean) ?? null;
}

/** La langue imposée par l'URL, ou `null` pour une page sans version anglaise. */
export function localeOfPath(path: string): Locale | null {
	const route = alternatesOf(path);
	if (!route) return null;
	return normalize(route.en) === normalize(path) ? 'en' : 'fr';
}

/** L'accueil dans une langue : les ancres de la barre du haut y renvoient. */
export function homeOf(locale: Locale): string {
	return HOME_ROUTE[locale];
}
