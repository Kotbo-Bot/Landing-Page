<script lang="ts">
  /**
   * Le héros de l'accueil v3. Trois secondes pour répondre à quatre questions :
   *
   * - c'est quoi ? un bot Discord avec un dashboard (dans le H1, c'est aussi la
   *   requête que Google doit lire) ;
   * - pour qui ? les serveurs qui ont un staff à faire tourner ;
   * - pourquoi lui ? il remplace la pile de bots et le tableur, et il gère le
   *   staff, ce que les autres ne font pas ;
   * - je fais quoi ? l'ajouter, ou ouvrir le vrai dashboard en démo.
   *
   * Les preuves sont collées aux boutons : chiffres lus sur l'API (masqués si
   * elle ne répond pas), la note Top.gg relevée à la main, et les trois
   * réponses aux peurs d'avant l'invitation (prix, carte, droits admin).
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { publicStats } from '$lib/data/stats.svelte';
  import { TOPGG_RATING, TOPGG_URL, TRIAL_DAYS } from '$lib/product';
  import AddButton from './AddButton.svelte';
  import HeroVideo from './HeroVideo.svelte';
  import { ktb } from '$lib/playground/discord/theme';

  const TEXT = {
    fr: {
      h1a: 'Le bot Discord qui gère ton serveur',
      h1b: 'et ton staff.',
      sub: 'Modération, tickets, niveaux et toute la gestion de ton staff, dans un seul bot avec un vrai dashboard. Les six autres bots peuvent partir.',
      demo: 'Voir le dashboard en live',
      reassure: `${TRIAL_DAYS} jours offerts, sans carte bancaire. Kotbo ne demande pas les droits admin.`,
      proof: 'Ils tournent déjà avec Kotbo',
      newTab: '(nouvel onglet)',
      memberCount: (n: string) => `${n} membres`,
      rating: (n: number) => `Noté ${n}/5 sur Top.gg`,
    },
    en: {
      h1a: 'The Discord bot that runs your server',
      h1b: 'and your staff.',
      sub: 'Moderation, tickets, levels and your whole staff team, run by one bot with a real dashboard. The other six bots can leave.',
      demo: 'See the live dashboard',
      reassure: `${TRIAL_DAYS} days free, no credit card. Kotbo doesn’t ask for admin.`,
      proof: 'Already running on Kotbo',
      newTab: '(new tab)',
      memberCount: (n: string) => `${n} members`,
      rating: (n: number) => `Rated ${n}/5 on Top.gg`,
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const servers = $derived((publicStats.data?.servers ?? []).slice(0, 3));
  const fmt = (n: number) => n.toLocaleString(getLocale() === 'fr' ? 'fr-FR' : 'en-US').replace(/\u202f/g, '\u00a0');

  onMount(() => void publicStats.load());
</script>

<section id="bienvenue" aria-labelledby="hero-title" class="relative bg-night">
  <!-- Le film à gauche, le texte à droite : le produit se voit dès
       l'arrivée, sans défiler. Sur téléphone : titre, film, puis le reste. -->
  <div class="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:pb-24 lg:pt-12">
    <div class="grid grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:grid-rows-[auto_auto] lg:items-center xl:gap-x-16">
      <h1 id="hero-title" class="font-display text-[2.6rem] font-black leading-[0.98] tracking-[-0.03em] text-balance text-white sm:text-6xl lg:col-start-2 lg:row-start-1 lg:self-end lg:text-5xl xl:text-[3.6rem] 2xl:text-[4.2rem]">
        {t.h1a}
        {t.h1b}
      </h1>

      <div class="lg:col-start-1 lg:row-span-2 lg:row-start-1">
        <HeroVideo />
      </div>

      <div class="lg:col-start-2 lg:row-start-2 lg:self-start">
        <p class="max-w-xl text-lg leading-relaxed text-mist text-pretty">{t.sub}</p>

        <div class="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <AddButton content="hero" size="lg" />
          <a
            href="/demo/"
            class="inline-flex min-h-14 items-center justify-center whitespace-nowrap rounded-xl border border-line-2 px-6 text-base font-semibold text-white transition-colors hover:border-mist hover:bg-night-3"
          >
            {t.demo}
          </a>
        </div>

        <p class="mt-5 flex items-start gap-2 text-sm text-mist"><img src={ktb('lock')} alt="" width="16" height="16" class="mt-0.5 h-4 w-4 shrink-0" />{t.reassure}</p>
      </div>
    </div>

    <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
      <p class="shrink-0 text-sm text-fog">{t.proof}</p>
      <ul class="flex flex-wrap items-center gap-x-6 gap-y-4">
        {#each servers as server (server.name)}
          <li class="flex items-center gap-2.5">
            {#if server.iconUrl}
              <img src={server.iconUrl} alt="" width="36" height="36" class="h-9 w-9 rounded-xl bg-night-3 object-cover" onerror={(e) => ((e.currentTarget as HTMLImageElement).src = `${base}/favicon.svg`)} />
            {:else}
              <span aria-hidden="true" class="grid h-9 w-9 place-items-center rounded-xl bg-night-4 text-xs font-bold text-mist">{server.name.slice(0, 2)}</span>
            {/if}
            <span>
              <span class="line-clamp-2 block max-w-44 text-sm font-semibold text-white">{server.name}</span>
              <span class="block text-xs tabular-nums text-fog">{t.memberCount(fmt(server.memberCount))}</span>
            </span>
          </li>
        {/each}
        <li>
          <a href={TOPGG_URL} target="_blank" rel="noopener noreferrer" class="text-sm font-semibold text-white underline decoration-line-2 underline-offset-4 hover:decoration-white">{t.rating(TOPGG_RATING)}<span class="sr-only"> {t.newTab}</span></a>
        </li>
      </ul>
    </div>
  </div>
</section>

