<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { initLocale } from '$lib/i18n/state.svelte';

	let { children } = $props();

	onMount(initLocale);
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/svg+xml" />
	<!-- Repli PNG pour les clients qui ignorent le SVG, et icône d'écran d'accueil
	     iOS. Rendus par motion/ (`bun run render:og`). -->
	<link rel="icon" href="{base}/icon-512.png" type="image/png" sizes="512x512" />
	<link rel="apple-touch-icon" href="{base}/apple-touch-icon.png" />
</svelte:head>
{@render children()}
