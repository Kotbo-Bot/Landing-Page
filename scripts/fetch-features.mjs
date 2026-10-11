/**
 * Avant chaque build : récupère les pages fonctionnalités publiées depuis la
 * console admin du dashboard (dash.kotbo.fr, `/admin/feature-pages`) et les
 * écrit dans `src/lib/data/feature-pages.json`, que le site prérend.
 *
 * Le build ne dépend jamais de l'API. Si elle ne répond pas, répond mal ou ne
 * renvoie aucune page, le fichier du dépôt reste tel quel et le site sort
 * avec les pages du dernier build réussi. Une liste vide est traitée comme
 * une panne : sur une base fraîchement migrée, avant l'import, elle viderait
 * le site de toutes ses pages.
 *
 * `FEATURE_PAGES_URL` remplace l'adresse de l'API (préproduction, tests).
 * `FEATURE_PAGES_OFFLINE=1` saute l'appel.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const URL_DEFAULT = 'https://api.kotbo.fr/api/public/feature-pages';
const TARGET = fileURLToPath(new URL('../src/lib/data/feature-pages.json', import.meta.url));
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TEXT_FIELDS = ['name', 'title', 'description', 'h1', 'lead'];

const isString = (value) => typeof value === 'string' && value.trim().length > 0;

function validText(text) {
	if (!text || typeof text !== 'object') return false;
	if (!TEXT_FIELDS.every((field) => isString(text[field]))) return false;
	if (!Array.isArray(text.sections) || text.sections.length === 0) return false;
	if (!text.sections.every((s) => isString(s?.h2) && isString(s?.body) && (s.points === undefined || (Array.isArray(s.points) && s.points.every(isString))))) return false;
	return Array.isArray(text.faq) && text.faq.every((f) => isString(f?.q) && isString(f?.a));
}

function validPage(page) {
	return (
		isString(page?.key) &&
		SLUG.test(page?.slug?.fr ?? '') &&
		SLUG.test(page?.slug?.en ?? '') &&
		Array.isArray(page.modules) &&
		page.modules.every(isString) &&
		validText(page.text?.fr) &&
		validText(page.text?.en)
	);
}

function keep(reason) {
	const current = JSON.parse(readFileSync(TARGET, 'utf8'));
	console.warn(`[fetch-features] ${reason} : on garde les ${current.pages.length} pages du dépôt.`);
}

async function main() {
	if (process.env.FEATURE_PAGES_OFFLINE === '1') return keep('appel désactivé (FEATURE_PAGES_OFFLINE)');

	const url = process.env.FEATURE_PAGES_URL || URL_DEFAULT;
	let body;
	try {
		const response = await fetch(url, { signal: AbortSignal.timeout(15_000), headers: { Accept: 'application/json' } });
		if (!response.ok) return keep(`l'API répond ${response.status}`);
		body = await response.json();
	} catch (err) {
		return keep(`API injoignable (${err instanceof Error ? err.message : err})`);
	}

	const pages = Array.isArray(body?.pages) ? body.pages : null;
	if (!pages) return keep('réponse inattendue');

	// Une page invalide est écartée, pas le build : les autres restent en ligne.
	const valid = pages.filter((page) => {
		const ok = validPage(page);
		if (!ok) console.warn(`[fetch-features] page « ${page?.key ?? '?'} » incomplète, écartée.`);
		return ok;
	});

	// Deux pages sur la même adresse : la première l'emporte.
	const seen = new Set();
	const unique = valid.filter((page) => {
		const ids = [`fr:${page.slug.fr}`, `en:${page.slug.en}`, `key:${page.key}`];
		if (ids.some((id) => seen.has(id))) {
			console.warn(`[fetch-features] page « ${page.key} » en double, écartée.`);
			return false;
		}
		ids.forEach((id) => seen.add(id));
		return true;
	});

	if (unique.length === 0) return keep('aucune page publiée');

	const data = {
		source: url,
		pages: unique.map(({ key, slug, modules, text }) => ({ key, slug, modules, text })),
	};
	writeFileSync(TARGET, `${JSON.stringify(data, null, 2)}\n`);
	console.log(`[fetch-features] ${unique.length} pages écrites depuis ${url}.`);
}

await main();
