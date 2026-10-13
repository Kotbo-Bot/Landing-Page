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
   * Le texte reste court : le film montre le produit. Les preuves tiennent sur
   * une ligne sous les boutons : les icônes des serveurs clients lues sur l'API
   * (masquées si elle ne répond pas), la note Top.gg relevée à la main, et les trois
   * réponses aux peurs d'avant l'invitation (prix, carte, droits admin).
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { publicStats } from '$lib/data/stats.svelte';
  import { TOPGG_RATING, TOPGG_URL, TRIAL_DAYS } from '$lib/product';
  import AddButton from './AddButton.svelte';
  import HeroVideo from './HeroVideo.svelte';

  const TEXT = {
    fr: {
      h1a: 'Le bot Discord qui gère ton serveur',
      h1b: 'et ton staff.',
      sub: 'Modération, tickets, niveaux et gestion du staff. Un seul bot, un vrai dashboard.',
      demo: 'Voir la démo',
      reassure: `${TRIAL_DAYS} jours offerts · sans carte · sans droits admin`,
      proof: (names: string) => `Déjà sur ${names}`,
      newTab: '(nouvel onglet)',
      rating: (n: number) => `Noté ${n}/5 sur Top.gg`,
    },
    en: {
      h1a: 'The Discord bot that runs your server',
      h1b: 'and your staff.',
      sub: 'Moderation, tickets, levels and staff management. One bot, one real dashboard.',
      demo: 'See the demo',
      reassure: `${TRIAL_DAYS} days free · no card · no admin rights`,
      proof: (names: string) => `Already on ${names}`,
      newTab: '(new tab)',
      rating: (n: number) => `Rated ${n}/5 on Top.gg`,
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const servers = $derived((publicStats.data?.servers ?? []).slice(0, 3));

  onMount(() => void publicStats.load());
</script>

<section id="bienvenue" aria-labelledby="hero-title" class="relative bg-night">
  <!-- Le film à gauche, le texte à droite : le produit se voit dès
       l'arrivée, sans défiler. Sur téléphone : titre, film, puis le reste. -->
  <div class="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:pb-24 lg:pt-12">
    <div class="grid grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:grid-rows-[auto_auto] lg:items-center xl:gap-x-16">
      <h1 id="hero-title" class="font-display text-[2.6rem] font-black leading-[0.98] tracking-[-0.03em] text-balance text-white sm:text-6xl lg:col-start-2 lg:row-start-1 lg:self-end lg:text-[2.6rem] xl:text-[3.1rem]">
        {t.h1a}
        {t.h1b}
      </h1>

      <div class="lg:col-start-1 lg:row-span-2 lg:row-start-1">
        <HeroVideo />
      </div>

      <div class="lg:col-start-2 lg:row-start-2 lg:self-start">
        <p class="max-w-md text-lg leading-relaxed text-mist text-pretty">{t.sub}</p>

        <div class="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <AddButton content="hero" size="lg" />
          <a
            href="/demo/"
            class="inline-flex min-h-14 items-center justify-center whitespace-nowrap rounded-xl px-5 text-base font-semibold text-white transition-colors hover:bg-night-3"
          >
            {t.demo} <span aria-hidden="true" class="ml-1.5 text-fog">→</span>
          </a>
        </div>

        <p class="mt-4 text-sm text-fog">{t.reassure}</p>

        <!-- La preuve tient sur une ligne : les icônes des serveurs, la note. -->
        <div class="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {#if servers.length}
            <span class="flex items-center">
              <span class="flex -space-x-2" aria-hidden="true">
                {#each servers as server (server.name)}
                  {#if server.iconUrl}
                    <img src={server.iconUrl} alt="" width="28" height="28" title={server.name} class="h-7 w-7 rounded-lg bg-night-3 object-cover ring-2 ring-night" onerror={(e) => ((e.currentTarget as HTMLImageElement).src = `${base}/favicon.svg`)} />
                  {:else}
                    <span class="grid h-7 w-7 place-items-center rounded-lg bg-night-4 text-[10px] font-bold text-mist ring-2 ring-night">{server.name.slice(0, 2)}</span>
                  {/if}
                {/each}
              </span>
              <span class="sr-only">{t.proof(servers.map((s) => s.name).join(', '))}</span>
            </span>
          {/if}
          <a href={TOPGG_URL} target="_blank" rel="noopener noreferrer" class="font-semibold text-white underline decoration-line-2 underline-offset-4 hover:decoration-white">{t.rating(TOPGG_RATING)}<span class="sr-only"> {t.newTab}</span></a>
        </div>
      </div>
    </div>
  </div>
</section>

