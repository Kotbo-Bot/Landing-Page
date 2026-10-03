import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Empreinte du JSON-LD de l'accueil, injecté en ligne (src/routes/+page.svelte).
// Calculée sur le même `JSON.stringify` que la page : un texte modifié reste
// autorisé, une ligne ajoutée à la main ailleurs ne l'est pas.
const homeJsonLd = JSON.stringify(JSON.parse(readFileSync('src/lib/seo/home-jsonld.json', 'utf8')));
const homeJsonLdHash = `sha256-${createHash('sha256').update(homeJsonLd).digest('base64')}`;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		// Force runes mode for the project
		runes: true
	},
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		prerender: {
			handleHttpError: ({ path, message }) => {
				// /demo/ est une SPA autonome servie depuis static/demo/index.html
				if (path.startsWith('/demo')) {
					return;
				}
				throw new Error(message);
			}
		},
		paths: {
			base: process.env.BASE_PATH ?? ''
		},
		// La promesse « aucun script tiers » (lib/funnel.ts, page /cookies),
		// tenue par le navigateur et plus seulement par la relecture. En mode
		// hash, chaque page pré-rendue reçoit une balise <meta> qui autorise son
		// script de démarrage et rien d'autre. `frame-ancestors` ne vaut pas en
		// <meta> : il reste dans static/_headers. /demo, servie telle quelle
		// depuis static/, n'est pas concernée.
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', homeJsonLdHash],
				// Les transitions de Svelte posent des <style> en ligne.
				'style-src': ['self', 'unsafe-inline'],
				// data: et blob: : l'image du serveur monté et la photo de la carte
				// de rang restent dans le navigateur. L'API sert les icônes des
				// communautés.
				'img-src': ['self', 'data:', 'blob:', 'https://api.kotbo.fr'],
				'font-src': ['self'],
				'media-src': ['self'],
				'connect-src': ['self', 'https://api.kotbo.fr'],
				'object-src': ['none'],
				'base-uri': ['self'],
				'form-action': ['self']
			}
		}
	}
};

export default config;
