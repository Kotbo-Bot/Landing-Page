<script lang="ts">
  /**
   * La barre du haut de l'accueil v3.
   *
   * Sur ordinateur, les zones de la page sont dans la colonne de salons : la
   * barre ne garde que ce qui mène ailleurs (staff, fonctionnalités, démo) et
   * le bouton. La démo a son point vert, c'est le seul lien qui mène à quelque
   * chose de vivant. Sur téléphone, tout passe dans un panneau.
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
      links: [
        { href: '#qg', label: 'Le QG staff' },
        { href: '#modules', label: 'Modules' },
        { href: '#prix', label: 'Prix' },
      ],
      staff: 'Gestion du staff',
      features: 'Toutes les fonctionnalités',
      demo: 'Démo live',
      menu: 'Menu',
      close: 'Fermer',
      switchTo: 'Switch to English',
    },
    en: {
      home: 'Kotbo, home',
      nav: 'Main navigation',
      links: [
        { href: '#qg', label: 'Staff HQ' },
        { href: '#modules', label: 'Modules' },
        { href: '#prix', label: 'Pricing' },
      ],
      staff: 'Staff management',
      features: 'All features',
      demo: 'Live demo',
      menu: 'Menu',
      close: 'Close',
      switchTo: 'Passer en français',
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const locale = $derived(getLocale());
  const next = $derived(locale === 'fr' ? 'en' : 'fr');
  const pair = $derived(pairOf(routePath(page.url.pathname, base)));
  const featuresHref = $derived(`${base}${locale === 'fr' ? '/fonctionnalites' : '/en/features'}`);

  let open = $state(false);
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (open = false)} />

<header
  class="sticky top-0 z-50 border-b border-line bg-night"
>
  <div class="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
    <a href="{base}{locale === 'fr' ? '/' : '/en'}" aria-label={t.home} class="flex items-center gap-2.5 rounded-lg">
      <img src="{base}/favicon.svg" alt="" width="32" height="32" class="h-8 w-8 rounded-lg" />
      <span class="font-display text-xl font-extrabold tracking-tight text-white">Kotbo</span>
    </a>

    <nav aria-label={t.nav} class="hidden lg:block">
      <ul class="flex items-center gap-1 text-sm font-medium text-fog">
        <li><a href="{base}{STAFF_ROUTE[locale]}" class="rounded-lg px-3 py-2 transition-colors hover:bg-night-3 hover:text-white">{t.staff}</a></li>
        <li><a href={featuresHref} class="rounded-lg px-3 py-2 transition-colors hover:bg-night-3 hover:text-white">{t.features}</a></li>
        <li>
          <a href="/demo/" class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-white transition-colors hover:bg-night-3">
            <span class="h-2 w-2 rounded-full bg-ok" aria-hidden="true"></span>
            {t.demo}
          </a>
        </li>
      </ul>
    </nav>

    <div class="flex items-center gap-2">
      {#if pair}
        <a
          href="{base}{pair[next]}"
          hreflang={next}
          aria-label={t.switchTo}
          onclick={() => rememberLocale(next)}
          class="inline-flex min-h-10 items-center rounded-lg px-2.5 text-sm font-semibold uppercase text-fog transition-colors hover:bg-night-3 hover:text-white"
        >
          {next}
        </a>
      {/if}
      <AddButton content="header" size="sm" class="hidden sm:inline-flex lg:hidden" />
      <button
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
        {#each t.links as link (link.href)}
          <li><a href={link.href} onclick={() => (open = false)} class="block border-b border-line py-4">{link.label}</a></li>
        {/each}
        <li><a href="{base}{STAFF_ROUTE[locale]}" class="block border-b border-line py-4">{t.staff}</a></li>
        <li><a href={featuresHref} class="block border-b border-line py-4">{t.features}</a></li>
        <li>
          <a href="/demo/" class="flex items-center gap-2 py-4 text-ok">
            <span class="h-2 w-2 rounded-full bg-ok" aria-hidden="true"></span>{t.demo}
          </a>
        </li>
      </ul>
    </nav>
  {/if}
</header>
