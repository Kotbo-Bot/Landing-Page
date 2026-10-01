import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ProxyOptions } from 'vite';

/**
 * Proxy local vers l'API, en développement et en preview seulement.
 *
 * Depuis `localhost`, un appel direct à `api.kotbo.fr` est « cross-site », et
 * la route des chiffres publics le refuse comme une page Kotbo prise dans une
 * iframe (`routes/public/stats.ts`, contrôle `Sec-Fetch-Site`). En production,
 * kotbo.fr et api.kotbo.fr sont du même site : l'appel passe direct. Le proxy
 * rend l'appel local « same-origin », sans rien changer à la règle de l'API.
 */
const apiProxy: Record<string, ProxyOptions> = {
	'/__kotbo-api': {
		target: 'https://api.kotbo.fr',
		changeOrigin: true,
		rewrite: (path) => path.replace(/^\/__kotbo-api/, '')
	}
};

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: { proxy: apiProxy },
	preview: { proxy: apiProxy }
});
