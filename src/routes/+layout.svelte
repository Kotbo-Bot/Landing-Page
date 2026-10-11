<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { applyLocale, initLocale } from '$lib/i18n/state.svelte';
	import { localeOfPath, routePath } from '$lib/i18n/routes';

	let { children } = $props();

	const pathLocale = () => localeOfPath(routePath(page.url.pathname, base));

	// Sur une page bilingue, l'URL fixe la langue dès le prérendu : /en sort en
	// anglais dans le HTML, celui que Google indexe. Suivi aussi lors des
	// navigations internes, où le layout reste monté.
	applyLocale(pathLocale() ?? 'fr');
	$effect.pre(() => {
		const fixed = pathLocale();
		if (fixed) applyLocale(fixed);
	});

	onMount(() => initLocale(base));
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/svg+xml" />
	<!-- Repli PNG pour les clients qui ignorent le SVG, et icône d'écran d'accueil
	     iOS. Rendus par motion/ (`bun run render:og`). -->
	<link rel="icon" href="{base}/icon-512.png" type="image/png" sizes="512x512" />
	<link rel="apple-touch-icon" href="{base}/apple-touch-icon.png" />
</svelte:head>
{@render children()}
