/**
 * Le site est intégralement prérendu (adapter-static) : il n'y a pas de
 * serveur par requête pour lire l'en-tête Accept-Language.
 *
 * Deux cas (voir `routes.ts`) :
 *
 * - une page qui existe dans les deux langues est prérendue dans la langue de
 *   son URL, et la garde. Un visiteur qui avait choisi l'autre langue est
 *   renvoyé vers l'autre URL ;
 * - une page qui n'existe qu'en français (les pages légales) bascule dans le
 *   navigateur, après hydratation, d'après le choix enregistré ou la langue
 *   du navigateur. D'où le bref instant en français avant l'anglais.
 */
export type Locale = 'fr' | 'en';

const STORAGE_KEY = 'kotbo-locale';

let locale = $state<Locale>('fr');

export function getLocale(): Locale {
	return locale;
}

/**
 * Pose la langue d'affichage sans rien enregistrer. Le layout l'appelle à
 * chaque rendu : au prérendu, toutes les pages partagent ce module, et une
 * page légale rendue après `/en` sortirait sinon en anglais.
 */
export function applyLocale(next: Locale): void {
	locale = next;
	if (typeof document !== 'undefined') {
		document.documentElement.lang = next;
	}
}

/** Enregistre un choix explicite du visiteur, pour ses visites suivantes. */
export function rememberLocale(next: Locale): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, next);
	} catch {
		// Stockage indisponible (navigation privée, quota) : pas bloquant.
	}
}

export function setLocale(next: Locale): void {
	applyLocale(next);
	rememberLocale(next);
}

function storedLocale(): Locale | null {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored === 'fr' || stored === 'en' ? stored : null;
	} catch {
		// Stockage indisponible : aucun choix connu.
		return null;
	}
}

/**
 * À appeler une fois, côté client, depuis le layout racine.
 *
 * Renvoie la langue que le visiteur a choisie quand elle diffère de celle de
 * la page bilingue où il arrive : au layout de l'emmener à l'autre URL. Sur
 * ces pages, la langue du navigateur ne compte pas, seul un choix explicite :
 * c'est ce qui garde Googlebot (`en-US`) sur la version française.
 */
export function initLocale(pageLocale: Locale | null): Locale | null {
	if (typeof window === 'undefined') return null;
	const stored = storedLocale();

	if (pageLocale) {
		return stored && stored !== pageLocale ? stored : null;
	}

	if (stored) {
		applyLocale(stored);
		return null;
	}
	const browserLang = navigator.language?.toLowerCase() ?? '';
	applyLocale(browserLang.startsWith('en') ? 'en' : 'fr');
	return null;
}
