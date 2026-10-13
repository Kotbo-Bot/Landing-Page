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
   * Le texte reste court et parle comme la cible (des admins de serveur, jeunes,
   * qui vivent sur Discord) : le film montre le produit. Sous le film et
   * le texte, sur toute la largeur, les serveurs clients nommés, lus sur l'API
   * (masqués si elle ne répond pas), et la note Top.gg relevée à la main ;
   * près des boutons, les trois
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
      h1b: 'pendant que tu dors',
      sub: 'Modo, tickets, niveaux et ton staff, tout au même endroit. Avec 51 modules, ce que tu cherches est sûrement déjà dedans.',
      demo: 'Tester le dashboard',
      reassure: `${TRIAL_DAYS} jours offerts · pas de CB · pas de droits admin`,
      proof: 'Ils sont déjà dessus',
      members: (n: string) => `${n} membres`,
      newTab: '(nouvel onglet)',
      rating: (n: number) => `Noté ${n}/5 sur Top.gg`,
    },
    en: {
      h1a: 'The Discord bot that runs your server',
      h1b: 'while you sleep',
      sub: 'Mod, tickets, levels and your staff, all in one place. With 51 modules, whatever you need is probably already in there.',
      demo: 'Try the dashboard',
      reassure: `${TRIAL_DAYS} days free · no card · no admin perms`,
      proof: 'Already running it',
      members: (n: string) => `${n} members`,
      newTab: '(new tab)',
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
      </div>
    </div>

    <!-- La preuve sur toute la largeur, sous le film et le texte : les
         serveurs qui tournent déjà avec Kotbo, nommés, avec leurs membres
         (lus sur l'API, masqués si elle se tait), et la note Top.gg. -->
    <div class="mt-12 flex flex-col gap-5 lg:mt-14 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
      {#if servers.length}
        <p class="shrink-0 text-xs font-semibold uppercase tracking-wide text-fog">{t.proof}</p>
        <ul class="grid gap-4 sm:grid-cols-3 lg:flex lg:flex-1 lg:justify-around lg:gap-6">
          {#each servers as server (server.name)}
            <li class="flex min-w-0 items-center gap-3">
              {#if server.iconUrl}
                <img src={server.iconUrl} alt="" width="44" height="44" class="h-11 w-11 shrink-0 rounded-xl bg-night-3 object-cover" onerror={(e) => ((e.currentTarget as HTMLImageElement).src = `${base}/favicon.svg`)} />
              {:else}
                <span aria-hidden="true" class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-night-4 text-sm font-bold text-mist">{server.name.slice(0, 2)}</span>
              {/if}
              <span class="min-w-0">
                <span class="block truncate font-semibold text-white">{server.name}</span>
                <span class="block text-sm tabular-nums text-fog">{t.members(fmt(server.memberCount))}</span>
              </span>
            </li>
          {/each}
        </ul>
      {/if}
      <a href={TOPGG_URL} target="_blank" rel="noopener noreferrer" class="shrink-0 text-sm font-semibold text-white underline decoration-line-2 underline-offset-4 hover:decoration-white">{t.rating(TOPGG_RATING)}<span class="sr-only"> {t.newTab}</span></a>
    </div>
  </div>
</section>

