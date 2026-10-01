import fs from 'node:fs';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin, type ProxyOptions } from 'vite';

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

/**
 * Permet de servir la SPA autonome du dashboard (/demo/) en local dans Vite
 * (aussi bien sous `bun dev` que `bun run preview`).
 * Toute requête vers /demo ou /demo/* (sans extension de fichier) renvoie index.html.
 */
function demoSpaPlugin(): Plugin {
	const handleDemoRequest = (req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse, next: () => void) => {
		const rawUrl = req.url || '';
		const [pathname] = rawUrl.split('?');
		if (pathname === '/demo' || pathname.startsWith('/demo/')) {
			const ext = path.extname(pathname);
			if (!ext || ext === '.html') {
				const indexPath = path.resolve('static/demo/index.html');
				if (fs.existsSync(indexPath)) {
					res.setHeader('Content-Type', 'text/html; charset=utf-8');
					res.statusCode = 200;
					fs.createReadStream(indexPath).pipe(res);
					return;
				}
			}
		}
		next();
	};

	return {
		name: 'demo-spa-plugin',
		configureServer(server) {
			server.middlewares.use(handleDemoRequest);
		},
		configurePreviewServer(server) {
			server.middlewares.use(handleDemoRequest);
		}
	};
}

export default defineConfig({
	plugins: [demoSpaPlugin(), tailwindcss(), sveltekit()],
	server: { proxy: apiProxy },
	preview: { proxy: apiProxy }
});
