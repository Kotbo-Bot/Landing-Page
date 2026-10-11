<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { onMount, untrack } from 'svelte';
	import { applyLocale, initLocale } from '$lib/i18n/state.svelte';
	import { alternatesOf } from '$lib/i18n/routes';

	let { children, data } = $props();

	// Au prérendu comme à l'hydratation, la page se rend dans la langue de son
	// URL. Une page seulement française repart du français : le module de
	// langue est partagé par toutes les pages prérendues.
	applyLocale(untrack(() => data.pageLocale) ?? 'fr');

	// Navigation interne entre `/` et `/en` : la langue suit l'URL.
	$effect.pre(() => {
		if (data.pageLocale) applyLocale(data.pageLocale);
	});

	onMount(() => {
		const wanted = initLocale(data.pageLocale);
		const route = alternatesOf(data.path);
		if (wanted && route) {
			goto(`${base}${route[wanted]}${location.hash}`, { replaceState: true });
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/svg+xml" />
	<!-- Repli PNG pour les clients qui ignorent le SVG, et icône d'écran d'accueil
	     iOS. Rendus par motion/ (`bun run render:og`). -->
	<link rel="icon" href="{base}/icon-512.png" type="image/png" sizes="512x512" />
	<link rel="apple-touch-icon" href="{base}/apple-touch-icon.png" />
</svelte:head>
{@render children()}
