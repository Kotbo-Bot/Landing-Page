<script lang="ts">
  /**
   * La barre du haut de l'accueil v3 : toute la navigation de la page.
   *
   * Deux pages (staff, fonctionnalités), deux zones de l'accueil (prix, FAQ),
   * la démo, la langue et le bouton. La démo a son point vert, c'est le seul
   * lien qui mène à quelque chose de vivant. Sur téléphone, tout passe dans
   * un panneau sous la barre.
   */
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import { getLocale, rememberLocale } from '$lib/i18n/state.svelte';
  import { pairOf, routePath, STAFF_ROUTE } from '$lib/i18n/routes';
  import AddButton from './AddButton.svelte';

  const TEXT = {
    fr: {
      home: 'Kotbo, accueil',
      nav: 'Navigation principale',
      staff: 'Gestion du staff',
      features: 'Fonctionnalités',
      anchors: [
        { href: '#prix', label: 'Prix' },
        { href: '#faq', label: 'FAQ' },
      ],
      demo: 'Démo live',
      menu: 'Menu',
      close: 'Fermer',
      switchTo: 'EN, English version',
    },
    en: {
      home: 'Kotbo, home',
      nav: 'Main navigation',
      staff: 'Staff management',
      features: 'Features',
      anchors: [
        { href: '#prix', label: 'Pricing' },
        { href: '#faq', label: 'FAQ' },
      ],
      demo: 'Live demo',
      menu: 'Menu',
      close: 'Close',
      switchTo: 'FR, version française',
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const locale = $derived(getLocale());
  const next = $derived(locale === 'fr' ? 'en' : 'fr');
  const pair = $derived(pairOf(routePath(page.url.pathname, base)));
  const featuresHref = $derived(`${base}${locale === 'fr' ? '/fonctionnalites' : '/en/features'}`);
  const links = $derived([
    { href: `${base}${STAFF_ROUTE[locale]}`, label: t.staff },
    { href: featuresHref, label: t.features },
    ...t.anchors,
  ]);

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
      <span class="font-display text-xl font-extrabold tracking-tight text-white">Kotbo</span>
    </a>

    <nav aria-label={t.nav} class="hidden lg:block">
      <ul class="flex items-center gap-1 text-sm font-medium text-fog">
        {#each links as link (link.href)}
          <li><a href={link.href} class="rounded-lg px-3 py-2 transition-colors hover:bg-night-3 hover:text-white">{link.label}</a></li>
        {/each}
        <li>
          <a href="/demo/" class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-white transition-colors hover:bg-night-3">
            <span class="h-2 w-2 rounded-full bg-ok" aria-hidden="true"></span>
            {t.demo}
          </a>
        </li>
      </ul>
    </nav>

    <div class="flex items-center gap-1 min-[360px]:gap-2">
      {#if pair}
        <a
          href="{base}{pair[next]}"
          hreflang={next}
          lang={next}
          onclick={() => rememberLocale(next)}
          class="inline-flex min-h-10 items-center rounded-lg px-2.5 text-sm font-semibold uppercase text-fog transition-colors hover:bg-night-3 hover:text-white"
        >
          <span aria-hidden="true">{next}</span>
          <span class="sr-only">{t.switchTo}</span>
        </a>
      {/if}
      <!-- Sur téléphone, la barre du bas porte le bouton. -->
      <div class="hidden sm:block"><AddButton content="header" size="sm" /></div>
      <button
        bind:this={menuButton}
        type="button"
        onclick={() => (open = !open)}
        aria-expanded={open}
        aria-controls="v3-menu"
        class="inline-flex min-h-10 items-center rounded-lg border border-line-2 px-3 text-sm font-semibold text-white lg:hidden"
      >
        {open ? t.close : t.menu}
      </button>
    </div>
  </div>

  {#if open}
    <nav id="v3-menu" aria-label={t.nav} class="border-t border-line bg-night px-4 pb-6 pt-2 lg:hidden">
      <ul class="flex flex-col text-lg font-semibold text-white">
        {#each links as link (link.href)}
          <li><a href={link.href} onclick={() => (open = false)} class="block border-b border-line py-4">{link.label}</a></li>
        {/each}
        <li>
          <a href="/demo/" class="flex items-center gap-2 py-4 text-ok">
            <span class="h-2 w-2 rounded-full bg-ok" aria-hidden="true"></span>{t.demo}
          </a>
        </li>
      </ul>
    </nav>
  {/if}
</header>
