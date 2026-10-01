<script lang="ts">
  /**
   * « Ils nous font confiance » : la section de la v1, reprise telle quelle.
   *
   * Même composition qu'avant (les deux totaux en cartes, les serveurs mis en
   * avant scotchés sur le tableau, puis la flotte des instances), sortie de
   * l'ancienne page d'accueil pour vivre dans son propre fichier. Seuls les
   * pictogrammes changent : ceux du bot plutôt qu'une bibliothèque générique
   * (DESIGN.md).
   *
   * Tout vient de `api.kotbo.fr` au chargement. Si l'API ne répond pas, la
   * section disparaît au lieu d'afficher des totaux inventés : une preuve
   * sociale fausse coûte plus cher que pas de preuve du tout.
   *
   * Les témoignages suivent la même règle : `data/proof.ts`, liste vide, bloc
   * absent.
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { reveal } from '$lib/actions/reveal';
  import { publicStats } from '$lib/data/stats.svelte';
  import { TESTIMONIALS } from '$lib/data/proof';
  import { ktb } from '$lib/playground/discord/theme';
  import MarkerCircle from '$lib/components/ui/MarkerCircle.svelte';

  const TEXT = {
    fr: {
      kicker: 'Des chiffres qui parlent d’eux-mêmes',
      titleStart: 'Ils nous font',
      titleHighlight: 'confiance',
      titleEnd: 'au quotidien',
      subtitle: 'Kotbo tient la modération et l’organisation de ces communautés Discord, tous les jours.',
      guildsLabel: 'Communautés gérées',
      membersLabel: 'Membres',
      loading: 'Chargement des chiffres…',
      serversHeading: 'Quelques communautés équipées',
      serversSubtitle: 'Des serveurs Discord de toutes tailles qui font confiance à Kotbo.',
      iconAlt: (name: string) => `Icône de ${name}`,
      serverMembers: 'Membres',
      fleetSingle: 'L’instance en service',
      fleetPlural: (n: number) => `Les ${n} instances en service`,
      fleetBody: 'L’instance publique et les bots personnalisés que les serveurs font tourner sous leur propre nom.',
      selfHosted: 'auto-hébergé',
      fleetLine: (guilds: number, users: string) => `${guilds} serveur${guilds > 1 ? 's' : ''} · ${users} membres`,
      testimonialsTitle: 'Ce qu’en disent leurs admins',
    },
    en: {
      kicker: 'Numbers that speak for themselves',
      titleStart: 'They',
      titleHighlight: 'trust',
      titleEnd: 'us every day',
      subtitle: 'Kotbo runs moderation and organisation for these Discord communities, every day.',
      guildsLabel: 'Communities managed',
      membersLabel: 'Members',
      loading: 'Loading the figures…',
      serversHeading: 'A few communities on board',
      serversSubtitle: 'Discord servers of every size trust Kotbo.',
      iconAlt: (name: string) => `${name} icon`,
      serverMembers: 'Members',
      fleetSingle: 'The instance in service',
      fleetPlural: (n: number) => `${n} instances in service`,
      fleetBody: 'The public instance and the custom bots that servers run under their own name.',
      selfHosted: 'self-hosted',
      fleetLine: (guilds: number, users: string) => `${guilds} server${guilds > 1 ? 's' : ''} · ${users} members`,
      testimonialsTitle: 'What their admins say',
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const locale = $derived(getLocale());

  const stats = $derived(publicStats.data);
  const loading = $derived(publicStats.status === 'loading');

  /** Les cartes scotchées gardent l'inclinaison de la v1, une par position. */
  const TILTS = [-1.2, 0.8, -0.6, 1.4];

  function formatCompact(n: number): string {
    if (n >= 1000) {
      const k = n / 1000;
      return `+${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
    }
    return `+${n}`;
  }

  onMount(() => void publicStats.load());
</script>

{#if loading || stats}
  <section id="communautes" aria-labelledby="trust-title" aria-busy={loading} class="relative overflow-hidden border-y border-gray-200 bg-gray-50 py-24">
    <div class="relative z-10 mx-auto max-w-340 px-4 sm:px-8">
      <div use:reveal={{ direction: 'up' }} class="mb-14 text-center">
        <p class="mb-6 inline-block rounded-2xl border-2 border-indigo-600 bg-white px-6 py-2 text-sm font-bold text-indigo-700">
          {t.kicker}
        </p>
        <h2 id="trust-title" class="mb-6 font-headline text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
          {t.titleStart} <MarkerCircle color="blue" class="text-indigo-600" animated>{t.titleHighlight}</MarkerCircle> {t.titleEnd}
        </h2>
        <p class="mx-auto max-w-xl text-lg font-semibold text-gray-600">{t.subtitle}</p>
      </div>

      {#if loading}
        <p class="sr-only">{t.loading}</p>
      {/if}

      <!-- Les deux totaux. -->
      <div class="mx-auto mb-14 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        {#each [{ label: t.guildsLabel, icon: 'stats', tint: 'bg-indigo-50', value: stats ? String(stats.totalGuilds) : '' }, { label: t.membersLabel, icon: 'profile', tint: 'bg-emerald-50', value: stats ? formatCompact(stats.totalUsers) : '' }] as card, i (card.label)}
          <div
            use:reveal={{ direction: i === 0 ? 'left' : 'right', delay: 100 }}
            class="rounded-3xl border border-gray-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div class="flex items-center gap-6">
              <div class="grid h-16 w-16 shrink-0 place-items-center rounded-2xl {card.tint}">
                <img src={ktb(card.icon)} alt="" width="32" height="32" class="h-8 w-8" />
              </div>
              <div>
                <p class="text-sm font-bold text-gray-600">{card.label}</p>
                {#if loading}
                  <div class="mt-1 h-10 w-28 animate-pulse rounded-lg bg-gray-200"></div>
                {:else}
                  <p class="mt-1 font-headline text-3xl font-extrabold tracking-tight text-gray-900 tabular-nums md:text-4xl">{card.value}</p>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>

      <div use:reveal={{ direction: 'up', delay: 150 }} class="mb-12 text-center">
        <h3 class="font-headline text-xl font-extrabold text-gray-900">{t.serversHeading}</h3>
        <p class="mt-1 text-sm font-semibold text-gray-600">{t.serversSubtitle}</p>
      </div>

      <!-- Les serveurs mis en avant, scotchés sur le tableau. -->
      <div class="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        {#if loading}
          {#each [0, 1, 2, 3] as i (i)}
            <div class="flex flex-col justify-between gap-6 rounded-3xl border border-gray-200/60 bg-white p-6 shadow-sm">
              <div class="flex items-start gap-4">
                <div class="h-14 w-14 shrink-0 animate-pulse rounded-2xl bg-gray-200"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
                  <div class="h-3 w-1/3 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          {/each}
        {:else if stats}
          {#each stats.servers as server, idx (server.name)}
            <div
              use:reveal={{ direction: 'up', delay: 80 * idx }}
              class="group relative flex min-h-70 flex-col justify-between rounded-3xl border-2 border-gray-200/60 bg-[#fefdfa] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] md:p-8"
              style="transform: rotate({TILTS[idx % TILTS.length]}deg);"
            >
              <!-- Le scotch qui tient la carte au tableau. -->
              <div aria-hidden="true" class="pointer-events-none absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 border-x border-black/5 bg-amber-50/80"></div>

              <div>
                <div class="relative z-10 flex items-center gap-4">
                  {#if server.iconUrl}
                    <img
                      src={server.iconUrl}
                      alt={t.iconAlt(server.name)}
                      width="56"
                      height="56"
                      loading="lazy"
                      class="h-14 w-14 shrink-0 rounded-2xl border-2 border-white bg-gray-50 object-cover shadow-md"
                      onerror={(e) => ((e.currentTarget as HTMLImageElement).src = `${base}/favicon.svg`)}
                    />
                  {:else}
                    <div class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-2 border-white bg-indigo-50 text-lg font-extrabold uppercase text-indigo-600 shadow-md">
                      {server.name.substring(0, 2)}
                    </div>
                  {/if}
                  <h4 class="min-w-0 flex-1 text-lg font-extrabold leading-tight text-gray-900 transition-colors group-hover:text-indigo-700">{server.name}</h4>
                </div>
                {#if server.description}
                  <p class="mt-4 text-sm font-medium leading-relaxed text-gray-600">{server.description}</p>
                {/if}
              </div>

              <div class="relative z-10 mt-6 flex items-center justify-between border-t border-dashed border-gray-200/80 pt-4">
                <span class="text-sm font-bold text-gray-600">{t.serverMembers}</span>
                <span class="rounded-xl border border-gray-200/50 bg-gray-100/80 px-3 py-1 text-sm font-extrabold text-gray-800 tabular-nums">
                  {server.memberCount.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}
                </span>
              </div>
            </div>
          {/each}
        {/if}
      </div>

      <!-- La flotte : les instances dont la somme fait les totaux ci-dessus. -->
      {#if !loading && stats && stats.bots.length > 0}
        <div use:reveal={{ direction: 'up', delay: 150 }} class="mx-auto mt-16 max-w-4xl">
          <div class="mb-8 text-center">
            <h3 class="font-headline text-xl font-extrabold text-gray-900">
              {stats.bots.length === 1 ? t.fleetSingle : t.fleetPlural(stats.bots.length)}
            </h3>
            <p class="mt-1 text-sm font-semibold text-gray-600">{t.fleetBody}</p>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {#each stats.bots as bot (bot.botName + bot.guildCount)}
              <div class="flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-white px-4 py-3.5 shadow-sm">
                {#if bot.botAvatarUrl}
                  <img src={bot.botAvatarUrl} alt="" width="40" height="40" loading="lazy" class="h-10 w-10 shrink-0 rounded-full bg-gray-100" />
                {:else}
                  <div class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-50 font-extrabold text-indigo-600">
                    {bot.botName.slice(0, 1).toUpperCase()}
                  </div>
                {/if}
                <div class="min-w-0">
                  <p class="flex items-center gap-1.5 truncate text-sm font-extrabold text-gray-900">
                    {bot.botName}
                    {#if bot.isSelfHosted}
                      <span class="shrink-0 rounded border border-gray-200 px-1 text-xs font-semibold text-gray-600">{t.selfHosted}</span>
                    {/if}
                  </p>
                  <p class="text-xs font-semibold text-gray-600 tabular-nums">
                    {t.fleetLine(bot.guildCount, formatCompact(bot.userCount).replace('+', ''))}
                  </p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      {#if TESTIMONIALS.length > 0}
        <div class="mx-auto mt-20 max-w-4xl">
          <h3 class="text-center font-headline text-xl font-extrabold text-gray-900">{t.testimonialsTitle}</h3>
          <ul class="mt-6 grid gap-6 md:grid-cols-2">
            {#each TESTIMONIALS as item (item.author + item.server)}
              <li>
                <figure class="rounded-2xl border border-gray-200 bg-white p-6">
                  <blockquote class="text-lg leading-relaxed text-gray-900">« {item.quote} »</blockquote>
                  <figcaption class="mt-4 text-sm text-gray-700">
                    <span class="font-bold text-gray-900">{item.author}</span>, {item.role[locale]} · {item.server}
                  </figcaption>
                </figure>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </section>
{/if}
