<!--
  En-tête et corps d'une page de module du dashboard : titre, description,
  actions à droite, menu « ... » de la page.

  Recopie du balisage de `Kotbo/apps/dashboard/src/lib/components/ModulePage.svelte`
  (branche `recette`). Le dashboard calcule lui-même ce qui dépend du serveur
  (module éteint, hors offre, page en bêta) en lisant ses stores et son API ;
  le site n'a ni l'un ni l'autre, l'écran le passe donc en props :
  - `beta` affiche la pastille « Bêta » à côté du titre ;
  - `menuItems` remplit le menu « ... » (absent si la liste est vide). Le
    dashboard y met « Signaler un problème » (pages en bêta) et « Désactiver
    le module » (modules qu'on peut éteindre). Un écran ne passe que des
    entrées qui font quelque chose dans l'aperçu.
  Le titre est un `h2` par défaut (`heading`) et le corps un `div` plutôt
  qu'un `<main>` : la page du site porte déjà son `h1` et son `<main>`.
  `icon` reste accepté et ignoré, comme dans le dashboard : le menu latéral
  montre déjà l'icône de la page.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import Menu, { type MenuItem } from './Menu.svelte';

  const TEXT = {
    fr: { beta: 'Bêta', pageMenu: (page: string) => `Options de la page ${page}` },
    en: { beta: 'Beta', pageMenu: (page: string) => `${page} page options` },
  };

  const {
    title = '',
    description = '',
    icon: _icon = 'Grid',
    beta = false,
    heading = 'h2',
    menuItems = [],
    children,
    actions = undefined,
  }: {
    title?: string;
    description?: string;
    icon?: string;
    beta?: boolean;
    /** Niveau du titre. `h1` dans le dashboard ; `h2` ici, la page du site ayant déjà le sien. */
    heading?: 'h1' | 'h2' | 'h3';
    menuItems?: MenuItem[];
    children: Snippet;
    actions?: Snippet;
  } = $props();

  const t = $derived(TEXT[getLocale()]);
</script>

<div class="module-page flex flex-col gap-6">
  <header class="module-page__header flex flex-col md:flex-row md:items-end justify-between gap-x-6 gap-y-3">
    <div class="module-page__identity min-w-0">
      <div class="flex items-center gap-2 min-w-0">
        <svelte:element this={heading} class="text-2xl font-semibold tracking-tight text-on-surface font-headline leading-tight truncate">{title}</svelte:element>
        {#if beta}
          <span class="shrink-0 px-1.5 py-0.5 rounded-md text-2xs font-medium bg-primary/10 text-primary">{t.beta}</span>
        {/if}
      </div>
      {#if description}
        <p class="mt-1 max-w-prose text-sm text-on-surface-variant">{description}</p>
      {/if}
    </div>

    <div class="module-page__actions flex items-center flex-wrap md:justify-end gap-2 shrink-0">
      {#if actions}
        {@render actions()}
      {/if}

      {#if menuItems.length > 0}
        <Menu items={menuItems} label={t.pageMenu(title)} />
      {/if}
    </div>
  </header>

  <!-- `<main>` dans le dashboard. Sur le site, l'écran vit déjà dans le
       `<main>` de la page, et un second serait invalide : même rendu, en `div`. -->
  <div class="module-page__body flex-1 space-y-8">
    {@render children()}
  </div>
</div>
