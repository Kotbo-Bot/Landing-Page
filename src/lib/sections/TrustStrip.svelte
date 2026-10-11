<script lang="ts">
  /**
   * « Ils nous font confiance », en bandeau, juste sous le héros.
   *
   * La section complète vit plus bas, après le comparatif. Ce bandeau en donne
   * le résumé là où le visiteur se demande encore si le bot est utilisé pour
   * de vrai : les deux totaux et les serveurs mis en avant, tous lus sur l'API.
   * Il renvoie à la section complète plutôt que de la répéter.
   *
   * Les chiffres ne sont jamais écrits en dur : si l'API ne répond pas, ils
   * disparaissent (voir `data/stats.svelte.ts`). Seule la note Top.gg reste,
   * relevée à la main dans `product.ts` et liée à sa source.
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { publicStats } from '$lib/data/stats.svelte';
  import { TOPGG_RATING, TOPGG_URL } from '$lib/product';

  const TEXT = {
    fr: {
      title: 'Ils nous font confiance',
      totals: (guilds: string, members: string) => `${guilds} serveurs Discord · ${members} membres`,
      loading: 'Chargement des communautés…',
      serversLabel: 'Serveurs qui utilisent Kotbo',
      members: (n: string) => `${n} membres`,
      rating: (n: number) => `Noté ${n}/5 sur Top.gg`,
      ratingLabel: (n: number) => `Noté ${n} sur 5 sur Top.gg, voir les avis (nouvel onglet)`,
    },
    en: {
      title: 'They trust us',
      totals: (guilds: string, members: string) => `${guilds} Discord servers · ${members} members`,
      loading: 'Loading communities…',
      serversLabel: 'Servers using Kotbo',
      members: (n: string) => `${n} members`,
      rating: (n: number) => `Rated ${n}/5 on Top.gg`,
      ratingLabel: (n: number) => `Rated ${n} out of 5 on Top.gg, read the reviews (new tab)`,
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const stats = $derived(publicStats.data);
  const loading = $derived(publicStats.status === 'loading');
  const numberLocale = $derived(getLocale() === 'fr' ? 'fr-FR' : 'en-US');
  /** Six serveurs au plus : au-delà, le bandeau devient une liste. */
  const servers = $derived((stats?.servers ?? []).slice(0, 6));

  onMount(() => void publicStats.load());

  function format(n: number): string {
    return n.toLocaleString(numberLocale);
  }
</script>

<section aria-labelledby="trust-strip-title" aria-busy={loading} class="border-y-2 border-gray-200 bg-white">
    <div class="mx-auto flex max-w-360 flex-col gap-5 px-4 py-7 sm:px-8 lg:flex-row lg:items-center lg:gap-10">
      <div class="shrink-0">
        <h2 id="trust-strip-title" class="font-headline text-xl font-extrabold text-gray-900">{t.title}</h2>
        {#if stats}
          <p class="mt-0.5 text-sm font-semibold text-gray-700 tabular-nums">
            {t.totals(format(stats.totalGuilds), format(stats.totalUsers))}
          </p>
        {:else if loading}
          <p class="mt-0.5 text-sm text-gray-600">{t.loading}</p>
        {/if}
        <a
          href={TOPGG_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.ratingLabel(TOPGG_RATING)}
          class="mt-2 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-gray-700 underline-offset-2 hover:text-gray-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <img src="{base}/ktb/ktb_star.png" alt="" width="16" height="16" class="h-4 w-4" />
          {t.rating(TOPGG_RATING)}
        </a>
      </div>

      {#if loading}
        <div aria-hidden="true" class="flex gap-5 overflow-hidden">
          {#each [0, 1, 2, 3] as i (i)}
            <div class="flex shrink-0 items-center gap-3">
              <div class="h-10 w-10 animate-pulse rounded-xl bg-gray-200"></div>
              <div class="h-3 w-24 animate-pulse rounded bg-gray-200"></div>
            </div>
          {/each}
        </div>
      {:else if servers.length > 0}
        <ul aria-label={t.serversLabel} class="flex min-w-0 flex-1 gap-6 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
          {#each servers as server (server.name)}
            <li class="flex shrink-0 items-center gap-3">
              {#if server.iconUrl}
                <img
                  src={server.iconUrl}
                  alt=""
                  width="40"
                  height="40"
                  loading="lazy"
                  class="h-10 w-10 rounded-xl bg-gray-100 object-cover"
                  onerror={(e) => ((e.currentTarget as HTMLImageElement).src = `${base}/favicon.svg`)}
                />
              {:else}
                <span aria-hidden="true" class="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-sm font-extrabold text-indigo-700">
                  {server.name.slice(0, 2)}
                </span>
              {/if}
              <span>
                <span class="block max-w-44 truncate text-sm font-bold text-gray-900">{server.name}</span>
                <span class="block text-xs text-gray-600 tabular-nums">{t.members(format(server.memberCount))}</span>
              </span>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </section>
