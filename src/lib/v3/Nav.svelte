<script lang="ts">
  /**
   * La barre du haut de tout le site : sur l'accueil, un sommaire de la page.
   *
   * Sur l'accueil (`home`), les liens mènent aux zones (leurs `id` viennent de
   * `channels.ts`), et celui de la zone qu'on lit s'allume au défilement, comme
   * le salon ouvert dans Discord. Ailleurs, « Gestion du staff » et
   * « Fonctionnalités » mènent à leurs articles (allumés quand on y est), les
   * autres liens aux zones de l'accueil. À droite : la langue, le thème et le
   * bouton du dashboard, pour qui a déjà Kotbo ; l'invitation reste dans les
   * zones de la page et dans la barre du bas sur téléphone.
   * Sur téléphone, tout passe dans un panneau sous la barre.
   */
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import { getLocale, rememberLocale, setLocale } from '$lib/i18n/state.svelte';
  import { onMount } from 'svelte';
  import { FEATURES_ROUTE, homeOf, pairOf, routePath, STAFF_ROUTE } from '$lib/i18n/routes';
  import { DASHBOARD_URL } from '$lib/product';
  import ThemeToggle from './ThemeToggle.svelte';

  const TEXT = {
    fr: {
      home: 'Kotbo, accueil',
      nav: 'Navigation principale',
      sections: [
        { id: 'qg', label: 'Gestion du staff' },
        { id: 'addition', label: 'Comparatif' },
        { id: 'modules', label: 'Fonctionnalités' },
        { id: 'ia', label: 'Intégration IA' },
        { id: 'prix', label: 'Tarifs' },
        { id: 'faq', label: 'FAQ' },
      ],
      menu: 'Menu',
      close: 'Fermer',
      switchTo: 'EN, English version',
      dashboard: 'Aller sur le dashboard',
      dashboardShort: 'Dashboard',
    },
    en: {
      home: 'Kotbo, home',
      nav: 'Main navigation',
      sections: [
        { id: 'qg', label: 'Staff management' },
        { id: 'addition', label: 'Comparison' },
        { id: 'modules', label: 'Features' },
        { id: 'ia', label: 'AI integration' },
        { id: 'prix', label: 'Pricing' },
        { id: 'faq', label: 'FAQ' },
      ],
      menu: 'Menu',
      close: 'Close',
      switchTo: 'FR, version française',
      dashboard: 'Go to the dashboard',
      dashboardShort: 'Dashboard',
    },
  };

  const { home = false }: { home?: boolean } = $props();

  const t = $derived(TEXT[getLocale()]);
  const locale = $derived(getLocale());
  const next = $derived(locale === 'fr' ? 'en' : 'fr');
  const path = $derived(routePath(page.url.pathname, base));
  const pair = $derived(pairOf(path));

  /** Hors de l'accueil, les zones qui ont leur page y mènent. */
  const PAGES: Partial<Record<string, Record<'fr' | 'en', string>>> = { qg: STAFF_ROUTE, modules: FEATURES_ROUTE };
  function hrefOf(id: string): string {
    if (home) return `#${id}`;
    const own = PAGES[id];
    return own ? `${base}${own[locale]}` : `${base}${homeOf(locale)}#${id}`;
  }
  /** La zone lue sur l'accueil, la page (ou l'article de sa rubrique) ailleurs. */
  function isCurrent(id: string): boolean {
    if (home) return current === id;
    const own = PAGES[id];
    if (!own) return false;
    const p = path.replace(/\/$/, '');
    return p === own[locale] || (id === 'modules' && p.startsWith(`${own[locale]}/`));
  }
  /** La zone qu'on lit : la dernière dont le haut est passé sous la barre. */
  let current = $state<string | null>(null);

  onMount(() => {
    if (!home) return;
    let frame = 0;
    const spy = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let found: string | null = null;
        for (const { id } of TEXT.fr.sections) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= 120) found = id;
        }
        // Passé le bas de la FAQ (appel final, pied de page), plus rien d'allumé.
        const faq = document.getElementById('faq');
        if (faq && faq.getBoundingClientRect().bottom < 120) found = null;
        current = found;
      });
    };
    spy();
    window.addEventListener('scroll', spy, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', spy);
    };
  });

  let open = $state(false);
  let menuButton = $state<HTMLButtonElement | null>(null);
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key !== 'Escape' || !open) return;
    open = false;
    menuButton?.focus();
  }}
/>

<header class="sticky top-0 z-50 border-b border-line bg-night/90 backdrop-blur-md">
  <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
    <a href="{base}{locale === 'fr' ? '/' : '/en'}" aria-label={t.home} class="flex shrink-0 items-center gap-2.5 rounded-lg">
      <img src="{base}/favicon.svg" alt="" width="32" height="32" class="h-8 w-8 rounded-lg" />
      <span class="font-display text-xl font-extrabold tracking-tight text-ink">Kotbo</span>
    </a>

    <nav aria-label={t.nav} class="hidden lg:block">
      <ul class="flex items-center gap-1 text-sm font-medium text-fog">
        {#each t.sections as link (link.id)}
          {@const on = isCurrent(link.id)}
          <li>
            <a
              href={hrefOf(link.id)}
              aria-current={on ? (home ? 'location' : 'page') : undefined}
              class="whitespace-nowrap rounded-lg px-2.5 py-2 transition-colors hover:bg-night-3 hover:text-ink xl:px-3 {on ? 'bg-night-3 text-ink' : ''}"
            >{link.label}</a>
          </li>
        {/each}
      </ul>
    </nav>

    <div class="flex items-center gap-1 min-[360px]:gap-2">
      {#if pair}
        <a
          href="{base}{pair[next]}"
          hreflang={next}
          lang={next}
          onclick={() => rememberLocale(next)}
          class="inline-flex min-h-10 items-center rounded-lg px-2.5 text-sm font-semibold uppercase text-fog transition-colors hover:bg-night-3 hover:text-ink"
        >
          <span aria-hidden="true">{next}</span>
          <span class="sr-only">{t.switchTo}</span>
        </a>
      {:else}
        <!-- Page à URL unique (légal) : la langue se change sur place. -->
        <button
          type="button"
          lang={next}
          onclick={() => setLocale(next)}
          class="inline-flex min-h-10 items-center rounded-lg px-2.5 text-sm font-semibold uppercase text-fog transition-colors hover:bg-night-3 hover:text-ink"
        >
          <span aria-hidden="true">{next}</span>
          <span class="sr-only">{t.switchTo}</span>
        </button>
      {/if}
      <ThemeToggle />
      <!-- Sur téléphone, la barre du bas porte l'invitation. -->
      <a
        href={DASHBOARD_URL}
        class="hidden min-h-10 items-center whitespace-nowrap rounded-xl bg-[#4f46e5] px-4 text-sm font-bold text-white transition-colors hover:bg-[#4338ca] sm:inline-flex"
      >
        <span class="hidden xl:inline">{t.dashboard}</span>
        <span class="xl:hidden">{t.dashboardShort}</span>
      </a>
      <button
        bind:this={menuButton}
        type="button"
        onclick={() => (open = !open)}
        aria-expanded={open}
        aria-controls="v3-menu"
        class="inline-flex min-h-10 items-center rounded-lg border border-line-2 px-3 text-sm font-semibold text-ink lg:hidden"
      >
        {open ? t.close : t.menu}
      </button>
    </div>
  </div>

  {#if open}
    <nav id="v3-menu" aria-label={t.nav} class="border-t border-line bg-night px-4 pb-6 pt-2 lg:hidden">
      <ul class="flex flex-col text-lg font-semibold text-ink">
        {#each t.sections as link (link.id)}
          {@const on = isCurrent(link.id)}
          <li>
            <a
              href={hrefOf(link.id)}
              aria-current={on ? (home ? 'location' : 'page') : undefined}
              onclick={() => (open = false)}
              class="block border-b border-line py-4 {on ? 'text-glow' : ''}"
            >{link.label}</a>
          </li>
        {/each}
      </ul>
    </nav>
  {/if}
</header>
