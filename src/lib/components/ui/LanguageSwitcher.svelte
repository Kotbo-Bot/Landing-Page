<script lang="ts">
  /**
   * FR / EN.
   *
   * Sur une page qui existe dans les deux langues, c'est un vrai lien vers
   * l'autre URL : les moteurs le suivent, et le choix est retenu pour les
   * visites suivantes. Sur une page seulement française, la bascule se fait
   * sur place.
   */
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import { getLocale, rememberLocale, setLocale } from '$lib/i18n/state.svelte';
  import { alternatesOf } from '$lib/i18n/routes';

  interface Props {
    class?: string;
  }

  const { class: className = '' }: Props = $props();

  const next = $derived(getLocale() === 'fr' ? 'en' : 'fr');
  const route = $derived(alternatesOf(page.url.pathname.slice(base.length) || '/'));
  const label = $derived(getLocale() === 'fr' ? 'Switch to English' : 'Passer en français');
  const classes = $derived(
    `inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-black uppercase tracking-widest text-gray-500 hover:border-gray-300 hover:text-gray-800 transition-colors cursor-pointer ${className}`,
  );
</script>

{#snippet labels()}
  <span class={getLocale() === 'fr' ? 'text-indigo-600' : ''}>FR</span>
  <span class="text-gray-300">/</span>
  <span class={getLocale() === 'en' ? 'text-indigo-600' : ''}>EN</span>
{/snippet}

{#if route}
  <a
    href="{base}{route[next]}"
    hreflang={next}
    aria-label={label}
    onclick={() => rememberLocale(next)}
    class={classes}
  >
    {@render labels()}
  </a>
{:else}
  <button type="button" onclick={() => setLocale(next)} aria-label={label} class={classes}>
    {@render labels()}
  </button>
{/if}
