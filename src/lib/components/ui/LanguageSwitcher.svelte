<script lang="ts">
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import { getLocale, setLocale } from '$lib/i18n/state.svelte';
  import { pairOf, routePath } from '$lib/i18n/routes';

  interface Props {
    class?: string;
  }

  const { class: className = '' }: Props = $props();

  /** Sur une page bilingue, changer de langue, c'est changer d'URL. */
  function toggle() {
    const next = getLocale() === 'fr' ? 'en' : 'fr';
    setLocale(next);
    const pair = pairOf(routePath(page.url.pathname, base));
    if (pair) location.assign(`${base}${pair[next]}${location.search}${location.hash}`);
  }
</script>

<button
  type="button"
  onclick={toggle}
  aria-label={getLocale() === 'fr' ? 'Switch to English' : 'Passer en français'}
  class="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-black uppercase tracking-widest text-gray-500 hover:border-gray-300 hover:text-gray-800 transition-colors cursor-pointer {className}"
>
  <span class={getLocale() === 'fr' ? 'text-indigo-600' : ''}>FR</span>
  <span class="text-gray-300">/</span>
  <span class={getLocale() === 'en' ? 'text-indigo-600' : ''}>EN</span>
</button>
