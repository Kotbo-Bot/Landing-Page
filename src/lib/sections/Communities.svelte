<script lang="ts">
  /**
   * Les communautés équipées : des chiffres réels, en très gros.
   *
   * Registre « chiffres » (DESIGN.md, emprunt Humanitour) : aplat encre, deux
   * nombres blancs qui tiennent la largeur, rien d'autre autour. Ils viennent
   * de `api.kotbo.fr` au chargement ; si l'API ne répond pas, la zone entière
   * disparaît plutôt que d'afficher un repli inventé. Une preuve sociale fausse
   * coûte plus cher que pas de preuve du tout.
   *
   * Les témoignages suivent la même règle : `data/proof.ts`, liste vide, bloc
   * absent.
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { reveal } from '$lib/actions/reveal';
  import { STATS_ENDPOINT } from '$lib/product';
  import { TESTIMONIALS } from '$lib/data/proof';

  interface ServerStats {
    name: string;
    iconUrl: string;
    memberCount: number;
    description: string;
  }

  interface BotStats {
    botName: string;
    botAvatarUrl: string | null;
    guildCount: number;
    userCount: number;
    isSelfHosted: boolean;
  }

  interface Stats {
    totalGuilds: number;
    totalUsers: number;
    bots: BotStats[];
    servers: ServerStats[];
  }

  const TEXT = {
    fr: {
      title: 'Ils l’ont déjà ajouté.',
      guilds: (n: number) => (n > 1 ? 'serveurs Discord équipés' : 'serveur Discord équipé'),
      members: 'membres dans ces serveurs',
      source: 'Chiffres lus en direct sur l’API de Kotbo.',
      loading: 'Chargement des chiffres…',
      serversTitle: 'Quelques-uns de ces serveurs',
      membersLabel: (n: string) => `${n} membres`,
      iconAlt: (name: string) => `Icône de ${name}`,
      fleetTitle: (n: number) => (n > 1 ? `Les ${n} instances en service` : 'L’instance en service'),
      fleetBody: 'L’instance publique, et les bots personnalisés que des serveurs font tourner sous leur propre nom.',
      selfHosted: 'auto-hébergé',
      fleetLine: (guilds: number, users: string) => `${guilds} serveur${guilds > 1 ? 's' : ''} · ${users} membres`,
      testimonialsTitle: 'Ce qu’en disent leurs admins',
    },
    en: {
      title: 'They’ve already added it.',
      guilds: (n: number) => (n > 1 ? 'Discord servers equipped' : 'Discord server equipped'),
      members: 'members across those servers',
      source: 'Figures read live from the Kotbo API.',
      loading: 'Loading the figures…',
      serversTitle: 'A few of those servers',
      membersLabel: (n: string) => `${n} members`,
      iconAlt: (name: string) => `${name} icon`,
      fleetTitle: (n: number) => (n > 1 ? `${n} instances in service` : 'The instance in service'),
      fleetBody: 'The public instance, and the custom bots that servers run under their own name.',
      selfHosted: 'self-hosted',
      fleetLine: (guilds: number, users: string) => `${guilds} server${guilds > 1 ? 's' : ''} · ${users} members`,
      testimonialsTitle: 'What their admins say',
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const locale = $derived(getLocale());
  const numberLocale = $derived(locale === 'fr' ? 'fr-FR' : 'en-US');

  let stats = $state<Stats | null>(null);
  let loading = $state(true);

  onMount(async () => {
    try {
      const res = await fetch(STATS_ENDPOINT);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      stats = {
        totalGuilds: Number(data.totalGuilds) || 0,
        totalUsers: Number(data.totalUsers) || 0,
        bots: Array.isArray(data.bots) ? data.bots : [],
        servers: Array.isArray(data.servers) ? data.servers : [],
      };
      // Des totaux à zéro ne prouvent rien : on les traite comme une absence.
      if (stats.totalGuilds === 0) stats = null;
    } catch {
      stats = null;
    } finally {
      loading = false;
    }
  });

  function format(n: number): string {
    return n.toLocaleString(numberLocale);
  }
</script>

{#if loading || stats}
  <section id="communautes" aria-labelledby="communities-title" aria-busy={loading} class="bg-gray-950 text-white">
    <div class="mx-auto max-w-360 px-4 py-20 sm:px-8 lg:py-28">
      <h2 id="communities-title" class="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl">{t.title}</h2>

      {#if loading}
        <p class="mt-10 text-gray-400">{t.loading}</p>
        <div aria-hidden="true" class="mt-6 grid gap-10 md:grid-cols-2">
          <div class="h-28 animate-pulse rounded-2xl bg-white/10"></div>
          <div class="h-28 animate-pulse rounded-2xl bg-white/10"></div>
        </div>
      {:else if stats}
        <dl use:reveal={{ direction: 'up' }} class="mt-12 grid gap-10 md:grid-cols-2">
          <div class="flex flex-col-reverse">
            <dt class="mt-2 text-lg text-gray-300">{t.guilds(stats.totalGuilds)}</dt>
            <dd class="font-headline text-7xl font-extrabold leading-none tracking-tight tabular-nums sm:text-8xl lg:text-9xl">
              {format(stats.totalGuilds)}
            </dd>
          </div>
          <div class="flex flex-col-reverse">
            <dt class="mt-2 text-lg text-gray-300">{t.members}</dt>
            <dd class="font-headline text-7xl font-extrabold leading-none tracking-tight tabular-nums text-indigo-300 sm:text-8xl lg:text-9xl">
              {format(stats.totalUsers)}
            </dd>
          </div>
        </dl>
        <p class="mt-6 text-sm text-gray-400">{t.source}</p>

        {#if stats.servers.length > 0}
          <h3 class="mt-20 font-headline text-2xl font-extrabold">{t.serversTitle}</h3>
          <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {#each stats.servers as server (server.name)}
              <li use:reveal={{ direction: 'up' }} class="rounded-2xl bg-white/[0.06] p-5">
                <div class="flex items-center gap-3">
                  {#if server.iconUrl}
                    <img
                      src={server.iconUrl}
                      alt={t.iconAlt(server.name)}
                      width="48"
                      height="48"
                      loading="lazy"
                      class="h-12 w-12 shrink-0 rounded-xl bg-white/10 object-cover"
                      onerror={(e) => ((e.currentTarget as HTMLImageElement).src = `${base}/favicon.svg`)}
                    />
                  {:else}
                    <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-500/30 font-bold">{server.name.slice(0, 2)}</span>
                  {/if}
                  <div class="min-w-0">
                    <p class="truncate font-bold">{server.name}</p>
                    <p class="text-sm tabular-nums text-gray-300">{t.membersLabel(format(server.memberCount))}</p>
                  </div>
                </div>
                {#if server.description}
                  <p class="mt-3 text-sm leading-relaxed text-gray-300">{server.description}</p>
                {/if}
              </li>
            {/each}
          </ul>
        {/if}

        {#if stats.bots.length > 0}
          <div class="mt-16">
            <h3 class="font-headline text-xl font-extrabold">{t.fleetTitle(stats.bots.length)}</h3>
            <p class="mt-1 text-sm text-gray-300">{t.fleetBody}</p>
            <ul class="mt-5 flex flex-wrap gap-3">
              {#each stats.bots as bot (bot.botName + bot.guildCount)}
                <li class="flex items-center gap-3 rounded-xl bg-white/[0.06] px-4 py-3">
                  {#if bot.botAvatarUrl}
                    <img src={bot.botAvatarUrl} alt="" width="36" height="36" loading="lazy" class="h-9 w-9 rounded-full bg-white/10" />
                  {:else}
                    <span class="grid h-9 w-9 place-items-center rounded-full bg-indigo-500/30 font-bold">{bot.botName.slice(0, 1)}</span>
                  {/if}
                  <div>
                    <p class="text-sm font-bold">
                      {bot.botName}
                      {#if bot.isSelfHosted}<span class="ml-1 text-xs font-semibold text-gray-400">· {t.selfHosted}</span>{/if}
                    </p>
                    <p class="text-xs tabular-nums text-gray-300">{t.fleetLine(bot.guildCount, format(bot.userCount))}</p>
                  </div>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      {/if}

      {#if TESTIMONIALS.length > 0}
        <div class="mt-20">
          <h3 class="font-headline text-2xl font-extrabold">{t.testimonialsTitle}</h3>
          <ul class="mt-6 grid gap-6 md:grid-cols-2">
            {#each TESTIMONIALS as item (item.author + item.server)}
              <li>
                <figure class="rounded-2xl bg-white p-6 text-gray-900">
                  <blockquote class="text-lg leading-relaxed">« {item.quote} »</blockquote>
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
