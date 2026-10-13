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

  const TEXT = {
    fr: {
      tag: 'Bot Discord + dashboard · 100 % français',
      h1a: 'Le bot Discord qui gère ton serveur',
      h1b: 'et ton staff.',
      sub: 'Modération, anti-raid, tickets, niveaux, recrutement, absences, sanctions avec preuves. Un seul bot, un vrai dashboard, et tu peux kick les six autres.',
      demo: 'Voir le dashboard en live',
      reassure: [`${TRIAL_DAYS} jours offerts`, 'Sans carte bancaire', 'Pas de droits admin demandés'],
      servers: 'serveurs',
      members: 'membres gérés',
      rating: (n: number) => `${n}/5 sur Top.gg`,
    },
    en: {
      tag: 'Discord bot + dashboard · made in France',
      h1a: 'The Discord bot that runs your server',
      h1b: 'and your staff.',
      sub: 'Moderation, anti-raid, tickets, levels, recruitment, time off, sanctions with proof. One bot, a real dashboard, and you get to kick the other six.',
      demo: 'See the live dashboard',
      reassure: [`${TRIAL_DAYS} days free`, 'No credit card', 'No admin permission asked'],
      servers: 'servers',
      members: 'members managed',
      rating: (n: number) => `${n}/5 on Top.gg`,
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const stats = $derived(publicStats.data);
  const fmt = (n: number) => n.toLocaleString(getLocale() === 'fr' ? 'fr-FR' : 'en-US').replace(/\u202f/g, '\u00a0');

  onMount(() => void publicStats.load());
</script>

<section aria-labelledby="hero-title" class="v3-grid relative overflow-hidden">
  <!-- Une seule lumière, derrière la liste des bots : le regard va là. -->
  <div aria-hidden="true" class="pointer-events-none absolute -right-40 top-10 h-[36rem] w-[36rem] rounded-full bg-[#4f46e5]/25 blur-[140px]"></div>

  <div class="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:pb-28 lg:pt-16">
    <div>
      <p class="hero-in inline-flex items-center gap-2 rounded-full border border-line-2 bg-night-2 px-3 py-1.5 font-mono text-xs text-mist">
        <span class="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true"></span>{t.tag}
      </p>

      <h1 id="hero-title" class="hero-in mt-6 font-display text-[2.75rem] font-black leading-[0.98] tracking-[-0.03em] text-white sm:text-6xl xl:text-[5.25rem]" style="--d: 80ms">
        {t.h1a}
        <span class="text-glow">{t.h1b}</span>
      </h1>

      <p class="hero-in mt-6 max-w-xl text-lg leading-relaxed text-mist sm:text-xl" style="--d: 160ms">{t.sub}</p>

      <div class="hero-in mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style="--d: 240ms">
        <AddButton content="hero" size="lg" />
        <a
          href="/demo/"
          class="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-xl border border-line-2 px-6 text-base font-semibold text-white transition-colors hover:border-glow hover:bg-night-3"
        >
          <span class="relative flex h-2 w-2" aria-hidden="true">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-ok"></span>
          </span>
          {t.demo}
        </a>
      </div>

      <ul class="hero-in mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-fog" style="--d: 300ms">
        {#each t.reassure as item (item)}
          <li class="flex items-center gap-1.5">
            <svg aria-hidden="true" viewBox="0 0 16 16" class="h-4 w-4 text-ok"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="m3.5 8.5 3 3 6-7" /></svg>
            {item}
          </li>
        {/each}
      </ul>

      <div class="hero-in mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6 text-sm" style="--d: 360ms">
        {#if stats}
          <p class="font-semibold text-white"><span class="font-display text-2xl font-extrabold tabular-nums">{fmt(stats.totalGuilds)}</span> <span class="text-fog">{t.servers}</span></p>
          <p class="font-semibold text-white"><span class="font-display text-2xl font-extrabold tabular-nums">{fmt(stats.totalUsers)}</span> <span class="text-fog">{t.members}</span></p>
        {/if}
        <a href={TOPGG_URL} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 font-semibold text-white hover:underline">
          <span class="text-amber" aria-hidden="true">★★★★★</span>
          {t.rating(TOPGG_RATING)}
        </a>
      </div>
    </div>

    <div class="hero-in mx-auto w-full max-w-md lg:max-w-none" style="--d: 200ms">
      <BotPurge />
    </div>
  </div>
</section>

<style>
  .hero-in {
    animation: hero-in 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
    animation-delay: var(--d, 0ms);
  }
  @keyframes hero-in {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
  }
</style>
