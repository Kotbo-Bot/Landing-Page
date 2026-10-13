<script lang="ts">
  /**
   * Ce qui mène hors de l'accueil, au pied de la liste des salons : la page
   * staff, les fonctionnalités, la démo, et la langue. L'accueil n'a pas de
   * barre du haut : la colonne de salons (et son panneau sur téléphone) porte
   * toute la navigation. La démo a son point vert, c'est le seul lien qui mène
   * à quelque chose de vivant.
   */
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import { getLocale, rememberLocale } from '$lib/i18n/state.svelte';
  import { pairOf, routePath, STAFF_ROUTE } from '$lib/i18n/routes';

  interface Props {
    /** Appelé au clic d'un lien, pour fermer le panneau sur téléphone. */
    onnavigate?: () => void;
  }
  const { onnavigate }: Props = $props();

  const TEXT = {
    fr: { label: 'Plus loin', staff: 'gestion-du-staff', features: 'fonctionnalites', demo: 'Démo live', switchTo: 'English version' },
    en: { label: 'Elsewhere', staff: 'staff-management', features: 'features', demo: 'Live demo', switchTo: 'Version française' },
  };
  const t = $derived(TEXT[getLocale()]);
  const locale = $derived(getLocale());
  const next = $derived(locale === 'fr' ? 'en' : 'fr');
  const pair = $derived(pairOf(routePath(page.url.pathname, base)));
  const featuresHref = $derived(`${base}${locale === 'fr' ? '/fonctionnalites' : '/en/features'}`);
</script>

<p class="mb-1 mt-4 px-2 text-xs font-semibold uppercase tracking-wide text-fog">{t.label}</p>
<ul class="space-y-px">
  <li>
    <a href="{base}{STAFF_ROUTE[locale]}" onclick={onnavigate} class="flex min-h-9 items-center gap-1.5 rounded-md px-2 text-[15px] text-fog transition-colors hover:bg-night-3 hover:text-mist">
      <svg aria-hidden="true" viewBox="0 0 24 24" class="h-4 w-4 shrink-0"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
      <span class="truncate" translate="no">{t.staff}</span>
    </a>
  </li>
  <li>
    <a href={featuresHref} onclick={onnavigate} class="flex min-h-9 items-center gap-1.5 rounded-md px-2 text-[15px] text-fog transition-colors hover:bg-night-3 hover:text-mist">
      <svg aria-hidden="true" viewBox="0 0 24 24" class="h-4 w-4 shrink-0"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
      <span class="truncate" translate="no">{t.features}</span>
    </a>
  </li>
  <li>
    <a href="/demo/" onclick={onnavigate} class="flex min-h-9 items-center gap-2 rounded-md px-2 text-[15px] font-semibold text-white transition-colors hover:bg-night-3">
      <span class="ml-1 h-2 w-2 shrink-0 rounded-full bg-ok" aria-hidden="true"></span>
      {t.demo}
    </a>
  </li>
  {#if pair}
    <li>
      <a
        href="{base}{pair[next]}"
        hreflang={next}
        lang={next}
        onclick={() => rememberLocale(next)}
        class="flex min-h-9 items-center gap-2 rounded-md px-2 text-[15px] text-fog transition-colors hover:bg-night-3 hover:text-mist"
      >
        <span aria-hidden="true" class="rounded border border-line-2 px-1 text-[11px] font-bold uppercase leading-4">{next}</span>
        {t.switchTo}
      </a>
    </li>
  {/if}
</ul>
