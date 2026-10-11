<script lang="ts">
  /**
   * Le châssis des pages fonctionnalités et de leur page d'ensemble : la barre
   * et le pied de page de l'accueil, le contenu à même le tableau. On reste
   * sur le même site, avec les mêmes objets (fiches, post-its, marqueur).
   *
   * Ces pages sont écrites pour la recherche : un titre qui reprend la
   * requête, un texte qui dit ce que le bot fait, une FAQ qui répond aux
   * questions telles qu'on les tape.
   */
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import { track } from '$lib/funnel';
  import Seo from '$lib/seo/Seo.svelte';
  import SiteNav from '$lib/sections/SiteNav.svelte';
  import SiteFooter from '$lib/sections/SiteFooter.svelte';

  interface Props {
    title: string;
    description: string;
    path: string;
    children: Snippet;
  }

  const { title, description, path, children }: Props = $props();

  onMount(() => track('site_visit', { path: location.pathname }));
</script>

<Seo {title} {description} {path} />

<div id="top" class="relative min-h-screen text-gray-900">
  <SiteNav />
  <main>
    {@render children()}
  </main>
  <SiteFooter />
</div>
