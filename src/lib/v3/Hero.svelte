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
  import { getLocale } from '$lib/i18n/state.svelte';
  import { publicStats } from '$lib/data/stats.svelte';
  import { TOPGG_RATING, TOPGG_URL, TRIAL_DAYS } from '$lib/product';
  import AddButton from './AddButton.svelte';
  import BotPurge from './BotPurge.svelte';
  import ChannelHeader from './ChannelHeader.svelte';

  const TEXT = {
    fr: {
      h1a: 'Le bot Discord qui gère ton serveur',
      h1b: 'et ton staff.',
      sub: 'Modération, tickets, niveaux et toute la gestion de ton staff, dans un seul bot avec un vrai dashboard. Les six autres bots peuvent partir.',
      demo: 'Voir le dashboard en live',
      reassure: `${TRIAL_DAYS} jours offerts, sans carte bancaire. Kotbo ne demande pas les droits admin.`,
      servers: 'Serveurs',
      members: 'Membres gérés',
      rating: (n: number) => `${n}/5`,
    },
    en: {
      h1a: 'The Discord bot that runs your server',
      h1b: 'and your staff.',
      sub: 'Moderation, tickets, levels and your whole staff team, run by one bot with a real dashboard. The other six bots can leave.',
      demo: 'See the live dashboard',
      reassure: `${TRIAL_DAYS} days free, no credit card. Kotbo doesn’t ask for admin.`,
      servers: 'Servers',
      members: 'Members managed',
      rating: (n: number) => `${n}/5`,
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const stats = $derived(publicStats.data);
  const fmt = (n: number) => n.toLocaleString(getLocale() === 'fr' ? 'fr-FR' : 'en-US').replace(/\u202f/g, '\u00a0');

  onMount(() => void publicStats.load());
</script>

<section id="bienvenue" aria-labelledby="hero-title" class="relative bg-night">
  <div class="sticky top-16 z-20 bg-night/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="bienvenue" /></div>
  </div>

  <div class="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 lg:pb-28 lg:pt-16 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] xl:gap-14">
    <div>
      <h1 id="hero-title" class="font-display text-[2.6rem] font-black leading-[0.98] tracking-[-0.03em] text-balance text-white sm:text-6xl 2xl:text-[5rem]">
        {t.h1a}
        {t.h1b}
      </h1>

      <p class="mt-6 max-w-xl text-lg leading-relaxed text-mist text-pretty sm:text-xl">{t.sub}</p>

      <div class="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
        <AddButton content="hero" size="lg" />
        <a
          href="/demo/"
          class="inline-flex min-h-14 items-center justify-center rounded-xl border border-line-2 px-6 text-base font-semibold text-white transition-colors hover:border-mist hover:bg-night-3"
        >
          {t.demo}
        </a>
      </div>

      <p class="mt-5 text-sm text-fog">{t.reassure}</p>

      <dl class="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
        {#if stats}
          <div>
            <dt class="text-sm text-fog">{t.servers}</dt>
            <dd class="font-display text-3xl font-extrabold tabular-nums text-white">{fmt(stats.totalGuilds)}</dd>
          </div>
          <div>
            <dt class="text-sm text-fog">{t.members}</dt>
            <dd class="font-display text-3xl font-extrabold tabular-nums text-white">{fmt(stats.totalUsers)}</dd>
          </div>
        {/if}
        <div>
          <dt class="text-sm text-fog">Top.gg</dt>
          <dd><a href={TOPGG_URL} target="_blank" rel="noopener noreferrer" class="font-display text-3xl font-extrabold text-white underline decoration-line-2 underline-offset-4 hover:decoration-white">{t.rating(TOPGG_RATING)}</a></dd>
        </div>
      </dl>
    </div>

    <div class="mx-auto w-full max-w-md xl:max-w-none">
      <BotPurge />
    </div>
  </div>
</section>

