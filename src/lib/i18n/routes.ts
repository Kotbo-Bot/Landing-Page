/**
 * Les pages qui existent dans les deux langues, chacune à sa propre URL.
 *
 * Ailleurs, la langue se choisit côté client sur une URL unique (voir
 * `state.svelte.ts`). Ici l'URL la fixe : Google n'indexe qu'une langue par
 * URL, et sans adresse anglaise propre, les recherches en anglais (« discord
 * automod setup », « alt account checker »...) ne trouvaient que du français.
 */
import type { Locale } from './state.svelte';
import { FEATURES } from '$lib/data/features';
import { RELEASES } from '$lib/articles/releases.js';
import { BLOG } from '$lib/articles/blog.js';

type Pair = Record<Locale, string>;

export const HOME_ROUTE: Pair = { fr: '/', en: '/en' };

/**
 * L'article « gestion du staff », écrit dans ce dépôt plutôt que dans la
 * console (`articles/staff.ts`) : il a ses propres écrans du dashboard. Il
 * garde son URL, déjà indexée, hors de `/fonctionnalites`.
 */
export const STAFF_ROUTE: Pair = { fr: '/gestion-staff-discord', en: '/en/discord-staff-management' };

/** L'index des notes de version (`pages/UpdatesHub.svelte`). */
export const UPDATES_ROUTE: Pair = { fr: '/nouveautes', en: '/en/whats-new' };

/** L'index du blog (`pages/BlogHub.svelte`). */
export const BLOG_ROUTE: Pair = { fr: '/blog', en: '/en/blog' };

/** La page qui rassemble les articles (`pages/FeaturesHub.svelte`). */
export const FEATURES_ROUTE: Pair = { fr: '/fonctionnalites', en: '/en/features' };

/** Chemins sans `base` ni barre finale, comme SvelteKit les sert. */
export const BILINGUAL: Pair[] = [
	HOME_ROUTE,
	STAFF_ROUTE,
	UPDATES_ROUTE,
	BLOG_ROUTE,
	FEATURES_ROUTE,
	...FEATURES.map((f) => ({ fr: featurePath(f.slug, 'fr'), en: featurePath(f.slug, 'en') })),
	...RELEASES.map((r) => ({ fr: releasePath(r.slug, 'fr'), en: releasePath(r.slug, 'en') })),
	...BLOG.map((b) => ({ fr: blogPath(b.slug, 'fr'), en: blogPath(b.slug, 'en') })),
];

/**
 * Le chemin de la page sans `base`. Au prérendu, `base` est relatif (« . »,
 * « .. », `paths.relative`) : il ne préfixe alors pas `url.pathname`.
 */
export function routePath(pathname: string, base: string): string {
	const stripped = base.startsWith('/') && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
	return stripped || '/';
}

function normalize(path: string): string {
	return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

/** La paire de la page, si elle existe dans les deux langues. */
export function pairOf(path: string): Pair | null {
	const p = normalize(path);
	return BILINGUAL.find((pair) => pair.fr === p || pair.en === p) ?? null;
}

/** La langue imposée par l'URL, ou `null` sur une page à URL unique. */
export function localeOfPath(path: string): Locale | null {
	const pair = pairOf(path);
	if (!pair) return null;
	return pair.en === normalize(path) ? 'en' : 'fr';
}

/** L'accueil dans une langue : les ancres de la barre du haut y renvoient. */
export function homeOf(locale: Locale): string {
	return HOME_ROUTE[locale];
}

export function featurePath(slug: Record<Locale, string>, locale: Locale): string {
	return locale === 'en' ? `/en/features/${slug.en}` : `/fonctionnalites/${slug.fr}`;
}

/** La note d'une version, même slug dans les deux langues. */
export function releasePath(slug: string, locale: Locale): string {
	return `${UPDATES_ROUTE[locale]}/${slug}`;
}

/** Un billet du blog, même slug dans les deux langues. */
export function blogPath(slug: string, locale: Locale): string {
	return `${BLOG_ROUTE[locale]}/${slug}`;
}
