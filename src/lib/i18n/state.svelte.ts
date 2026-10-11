/**
 * Le site est intégralement prérendu (adapter-static) : il n'y a pas de
 * serveur par requête pour lire l'en-tête Accept-Language.
 *
 * Deux cas :
 * - les pages bilingues (`routes.ts`) ont une URL par langue, et l'URL fait
 *   foi. Un visiteur dont la langue préférée diffère est envoyé vers l'autre
 *   URL ; les robots, eux, restent sur celle qu'ils ont demandée, pour que
 *   chaque version soit indexée telle quelle ;
 * - les autres pages (légales) n'ont qu'une URL : la langue s'y choisit côté
 *   client, après hydratation, d'où le bref instant en français.
 */
import { localeOfPath, pairOf, routePath } from './routes';

export type Locale = 'fr' | 'en';

const STORAGE_KEY = 'kotbo-locale';

/** Les robots ne suivent pas les préférences : chaque URL garde sa langue. */
const BOT_UA = /bot|crawl|spider|slurp|lighthouse|inspectiontool|headless|preview/i;

let locale = $state<Locale>('fr');

export function getLocale(): Locale {
	return locale;
}

/** Change la langue affichée sans la retenir comme préférence. */
export function applyLocale(next: Locale): void {
	locale = next;
	if (typeof document !== 'undefined') {
		document.documentElement.lang = next;
	}
}

export function setLocale(next: Locale): void {
	applyLocale(next);
	if (typeof localStorage !== 'undefined') {
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// Stockage indisponible (navigation privée, quota) : pas bloquant.
		}
	}
}

function preferredLocale(): Locale | null {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'fr' || stored === 'en') return stored;
	} catch {
		// Stockage indisponible : on retombe sur la langue du navigateur.
	}
	if (BOT_UA.test(navigator.userAgent)) return null;
	return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'fr';
}

/** À appeler une fois, côté client, depuis le layout racine. */
export function initLocale(base = ''): void {
	if (typeof window === 'undefined') return;

	const path = routePath(location.pathname, base);
	const fixed = localeOfPath(path);
	const wanted = preferredLocale();

	if (fixed) {
		applyLocale(fixed);
		const pair = pairOf(path);
		if (wanted && wanted !== fixed && pair) {
			location.replace(`${base}${pair[wanted]}${location.search}${location.hash}`);
		}
		return;
	}

	applyLocale(wanted ?? 'fr');
}
