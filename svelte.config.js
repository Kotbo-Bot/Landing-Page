import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

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
		}
	}
};

export default config;
