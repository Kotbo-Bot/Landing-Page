<script lang="ts">
  /**
   * Le passage du sombre au clair, à côté de la langue.
   *
   * Le choix est posé sur `<html data-theme>` et gardé dans `localStorage` :
   * `lib/theme-boot.js` le relit avant le premier affichage de la page
   * suivante. Les jetons des deux thèmes vivent dans `routes/layout.css`.
   */
  import { onMount } from 'svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { THEME_KEY } from '$lib/theme-boot.js';

  const TEXT = {
    fr: { toLight: 'Passer en mode clair', toDark: 'Passer en mode sombre' },
    en: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode' },
  };
  const t = $derived(TEXT[getLocale()]);

  let light = $state(false);

  onMount(() => {
    light = document.documentElement.dataset.theme === 'light';
  });

  function toggle() {
    light = !light;
    if (light) document.documentElement.dataset.theme = 'light';
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem(THEME_KEY, light ? 'light' : 'dark');
    } catch {
      // Stockage refusé : le thème vaut pour cette page seulement.
    }
  }
</script>

<button
  type="button"
  onclick={toggle}
  aria-label={light ? t.toDark : t.toLight}
  title={light ? t.toDark : t.toLight}
  class="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-fog transition-colors hover:bg-night-3 hover:text-ink"
>
  {#if light}
    <!-- Lune : on repasse à la nuit -->
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" /></svg>
  {:else}
    <!-- Soleil : on passe au clair -->
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  {/if}
</button>
