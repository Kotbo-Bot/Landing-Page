<script lang="ts">
  /**
   * Le châssis des pages hors accueil (articles, légal) : la barre du haut et
   * le pied de page de l'accueil, sur la même nuit. On reste sur le même site.
   *
   * Chaque page est une entrée du tunnel au même titre que l'accueil : on y
   * arrive depuis un moteur de recherche. La barre d'invitation du bas, sur
   * téléphone, se cache sur l'élément `#final-title` de la page s'il existe ;
   * les pages légales s'en passent (`invite={false}`).
   */
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import { track } from '$lib/funnel';
  import { getLocale } from '$lib/i18n/state.svelte';
  import Nav from './Nav.svelte';
  import Footer from './Footer.svelte';
  import MobileBar from './MobileBar.svelte';

  const { children, invite = true }: { children: Snippet; invite?: boolean } = $props();

  const TEXT = {
    fr: { skip: 'Aller au contenu' },
    en: { skip: 'Skip to content' },
  };
  const t = $derived(TEXT[getLocale()]);

  onMount(() => track('site_visit', { path: location.pathname }));
</script>

<svelte:head><meta name="theme-color" content="#09090b" /></svelte:head>

<div id="top" class="relative min-h-screen bg-night font-sans text-ink antialiased">
  <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-night">{t.skip}</a>
  <Nav />
  <main id="main">
    {@render children()}
  </main>
  <Footer />
  {#if invite}<MobileBar />{/if}
</div>
