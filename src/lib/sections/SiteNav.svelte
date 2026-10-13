<script lang="ts">
  /**
   * La barre du haut.
   *
   * Les ancres suivent l'ordre de la page et ne mènent qu'à des zones qui
   * existent toujours. Les communautés n'y sont pas : la zone disparaît quand
   * l'API ne répond pas, et un lien vers rien est pire que pas de lien.
   *
   * Sur téléphone, les ancres passent dans un menu déroulant ; le bouton
   * d'invitation, lui, reste visible.
   *
   * Huit liens, un sélecteur de langue et un bouton qui reprend le nom du
   * serveur ne tiennent pas sur une ligne d'ordinateur portable. Les ancres
   * des zones jouables (`wide`) n'apparaissent dans la barre qu'à partir de
   * 1600 px. Aucun lien ne passe sur deux lignes.
   *
   * Le menu ne répète pas la barre. Sur ordinateur, « Plus » ouvre un panneau
   * accroché sous le bouton avec seulement ce que la barre ne montre pas. Sur
   * tablette et téléphone, il donne tout, rangé en deux groupes (ce qu'on
   * essaie sur la page, ce qu'on découvre ailleurs), chaque lien avec une
   * ligne qui dit ce qu'on y trouve.
   *
   * Hors de l'accueil (la page staff), les ancres renvoient aux zones de
   * l'accueil dans la même langue.
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { STAFF_ROUTE, homeOf } from '$lib/i18n/routes';
  import { ChevronDown, Menu, X } from '@lucide/svelte';
  import LanguageSwitcher from '$lib/components/ui/LanguageSwitcher.svelte';
  import InviteButton from '$lib/playground/InviteButton.svelte';

  const TEXT = {
    fr: {
      home: 'Kotbo, retour en haut',
      nav: 'Sections de la page',
      menu: 'Menu',
      more: 'Plus',
      close: 'Fermer',
      open: 'Ouvrir le menu',
      closeLabel: 'Fermer le menu',
      groups: [
        {
          title: 'Essayer sur la page',
          items: [
            { href: '#setup', label: 'Ton type de serveur', desc: 'RP, gaming, streamer ou grosse commu' },
            { href: '#nuit', label: 'La nuit du fonda', desc: 'Ton téléphone à 2 h 47, sans et avec Kotbo' },
            { href: '#qg', label: 'Le QG staff', desc: 'Les vrais écrans du dashboard' },
            { href: '#modules', label: 'Modules', desc: 'Les 51, dont la carte de rang' },
          ],
        },
        {
          title: 'Découvrir',
          items: [
            { href: '#addition', label: 'L’addition', desc: 'Ce que te coûte ta pile de bots', inBar: true },
            { href: '#prix', label: 'Tarifs', desc: 'Le prix suit la taille du serveur', inBar: true },
            { href: '/fonctionnalites', label: 'Fonctionnalités', desc: 'Chaque module, page par page', inBar: true },
            { href: STAFF_ROUTE.fr, label: 'Gestion du staff', desc: 'Absences, recrutement, évaluations' },
          ],
        },
      ],
      demo: { label: 'Démo Dashboard', desc: 'Le vrai dashboard, sans compte ni carte bancaire' },
      links: [
        { href: '#setup', label: 'Ton type de serveur', wide: true },
        { href: '#nuit', label: 'La nuit du fonda', wide: true },
        { href: '#qg', label: 'Le QG staff', wide: true },
        { href: '#modules', label: 'Modules', wide: true },
        { href: '#addition', label: 'L’addition' },
        { href: '#prix', label: 'Tarifs' },
        { href: '/fonctionnalites', label: 'Fonctionnalités' },
        { href: '/demo/', label: 'Démo Dashboard', live: true },
      ],
    },
    en: {
      home: 'Kotbo, back to top',
      nav: 'Page sections',
      menu: 'Menu',
      more: 'More',
      close: 'Close',
      open: 'Open menu',
      closeLabel: 'Close menu',
      groups: [
        {
          title: 'Try it on the page',
          items: [
            { href: '#setup', label: 'Your server type', desc: 'RP, gaming, streamer or big community' },
            { href: '#nuit', label: 'The owner’s night', desc: 'Your phone at 2:47, without and with Kotbo' },
            { href: '#qg', label: 'Staff HQ', desc: 'The real dashboard screens' },
            { href: '#modules', label: 'Modules', desc: 'All 51, rank card included' },
          ],
        },
        {
          title: 'Discover',
          items: [
            { href: '#addition', label: 'The bill', desc: 'What your bot pile costs you', inBar: true },
            { href: '#prix', label: 'Pricing', desc: 'The price follows server size', inBar: true },
            { href: '/en/features', label: 'Features', desc: 'Every module, page by page', inBar: true },
            { href: STAFF_ROUTE.en, label: 'Staff management', desc: 'Leave, recruitment, reviews' },
          ],
        },
      ],
      demo: { label: 'Dashboard Demo', desc: 'The real dashboard, no account or credit card' },
      links: [
        { href: '#setup', label: 'Your server type', wide: true },
        { href: '#nuit', label: 'The owner’s night', wide: true },
        { href: '#qg', label: 'Staff HQ', wide: true },
        { href: '#modules', label: 'Modules', wide: true },
        { href: '#addition', label: 'The bill' },
        { href: '#prix', label: 'Pricing' },
        { href: '/en/features', label: 'Features' },
        { href: '/demo/', label: 'Dashboard Demo', live: true },
      ],
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const home = $derived(homeOf(getLocale()));
  const onHome = $derived((page.url.pathname.slice(base.length) || '/') === home);

  /** Une ancre de l'accueil, préfixée par son URL quand on est ailleurs. */
  function anchor(href: string): string {
    if (onHome || !href.startsWith('#')) return href;
    return `${base}${home}${href}`;
  }

  let open = $state(false);
  let scrolled = $state(false);
  let menuButton = $state<HTMLButtonElement | null>(null);
  let menuPanel = $state<HTMLDivElement | null>(null);

  /** La zone à l'écran, pour placer l'indicateur sous le bon lien. */
  let current = $state<string | null>(null);
  let list = $state<HTMLUListElement | null>(null);
  let bar = $state<{ left: number; width: number } | null>(null);

  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  onMount(() => {
    const onScroll = () => (scrolled = window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Suivi de la zone lue : une zone est « en cours » quand elle occupe la
    // bande haute de l'écran, juste sous l'en-tête. Les zones absentes (les
    // communautés quand l'API ne répond pas) sont simplement ignorées.
    // Toutes les zones sont suivies, y compris celles absentes du menu : en
    // lisant le catalogue, aucun lien ne doit rester allumé à tort.
    const linked = new Set(TEXT.fr.links.map((link) => link.href));
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const href = `#${entry.target.id}`;
          current = linked.has(href) ? href : null;
        }
      },
      { rootMargin: '-80px 0px -65% 0px' },
    );
    sections.forEach((node) => observer.observe(node));

    const onResize = () => placeBar();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  });

  /** L'indicateur glisse sous le lien de la zone en cours. */
  function placeBar(): void {
    const link = current ? list?.querySelector<HTMLAnchorElement>(`a[href="${current}"]`) : null;
    // Un lien masqué à cette largeur (`wide`) n'a pas de boîte : pas de trait.
    if (!link || !list || link.getClientRects().length === 0) {
      bar = null;
      return;
    }
    const box = list.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    bar = { left: rect.left - box.left, width: rect.width };
  }

  $effect(() => {
    void current;
    void t;
    placeBar();
  });

  /**
   * Défilement fluide vers une ancre, puis un trait au marqueur sous le titre
   * de la zone : l'œil sait où il vient d'arriver. L'URL garde l'ancre, pour
   * qu'un lien copié mène au même endroit.
   */
  function goTo(event: MouseEvent, href: string): void {
    if (!href.startsWith('#') || !onHome) {
      open = false;
      return;
    }
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    open = false;

    const smooth = !reduceMotion();
    target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    history.replaceState(null, '', href);

    const heading = target.querySelector<HTMLElement>('h1, h2');
    if (!heading) return;
    // Le focus suit le lien, pour le clavier et les lecteurs d'écran.
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
    if (!smooth) return;

    heading.classList.remove('anchor-arrived');
    const mark = () => {
      void heading.offsetWidth;
      heading.classList.add('anchor-arrived');
      setTimeout(() => heading.classList.remove('anchor-arrived'), 1800);
    };
    // `scrollend` quand le navigateur le connaît, un délai sinon.
    if ('onscrollend' in window) window.addEventListener('scrollend', mark, { once: true });
    else setTimeout(mark, 600);
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !open) return;
    open = false;
    menuButton?.focus();
  }

  /** Un clic hors du panneau le referme, comme tout menu déroulant. */
  function onWindowClick(event: MouseEvent): void {
    if (!open) return;
    const target = event.target as Node;
    if (menuPanel?.contains(target) || menuButton?.contains(target)) return;
    open = false;
  }

  /** Un lien du menu : ancre de l'accueil ou autre page, préfixée par `base`. */
  function menuHref(href: string): string {
    return href.startsWith('#') ? anchor(href) : `${base}${href}`;
  }
</script>

<svelte:window onkeydown={onKeydown} onclick={onWindowClick} />

<header class="sticky top-0 z-50 border-b transition-colors {scrolled || open ? 'border-gray-200 bg-[#f8f9fa]' : 'border-transparent'}">
  <div class="mx-auto flex max-w-[1720px] items-center justify-between gap-4 px-4 py-3 sm:px-8">
    <a href={anchor('#top')} aria-label={t.home} class="flex shrink-0 items-center gap-2.5 rounded-lg">
      <img src="{base}/favicon.svg" alt="" width="36" height="36" class="h-9 w-9 rounded-xl" />
      <span class="font-headline text-xl font-extrabold text-gray-900">Kotbo</span>
    </a>

    <nav aria-label={t.nav} class="hidden xl:block">
      <ul bind:this={list} class="relative flex gap-5 whitespace-nowrap text-sm font-semibold text-gray-700">
        {#each t.links as link (link.href)}
          <li class={'wide' in link ? 'hidden min-[1600px]:block' : ''}>
            {#if link.href.startsWith('#')}
              <a
                href={anchor(link.href)}
                onclick={(e) => goTo(e, link.href)}
                aria-current={current === link.href ? 'location' : undefined}
                class="inline-flex min-h-10 items-center transition-colors hover:text-gray-900 {current === link.href ? 'text-gray-900' : ''}"
              >
                {link.label}
              </a>
            {:else if !('live' in link)}
              <a href="{base}{link.href}" class="inline-flex min-h-10 items-center transition-colors hover:text-gray-900">
                {link.label}
              </a>
            {:else}
              <a
                href={link.href}
                class="inline-flex min-h-10 items-center gap-1.5 font-bold text-indigo-600 transition-colors hover:text-indigo-800"
              >
                <span>{link.label}</span>
                <span class="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">Live</span>
              </a>
            {/if}
          </li>
        {/each}
        {#if bar}
          <li
            aria-hidden="true"
            class="nav-bar pointer-events-none absolute -bottom-0.5 h-0.75 rounded-full bg-indigo-600"
            style="left: {bar.left}px; width: {bar.width}px"
          ></li>
        {/if}
      </ul>
    </nav>

    <div class="flex shrink-0 items-center gap-3">
      <LanguageSwitcher />
      <div class="hidden sm:block"><InviteButton content="header" tone="ink" class="max-w-72" /></div>
      <button
        bind:this={menuButton}
        type="button"
        onclick={() => (open = !open)}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? t.closeLabel : t.open}
        class="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-gray-900 px-3.5 text-sm font-bold text-gray-900 transition-colors hover:bg-white min-[1600px]:hidden {open ? 'bg-white' : ''}"
      >
        <span class="xl:hidden" aria-hidden="true">
          {#if open}<X class="h-4 w-4" strokeWidth={3} />{:else}<Menu class="h-4 w-4" strokeWidth={3} />{/if}
        </span>
        <span class="xl:hidden">{open ? t.close : t.menu}</span>
        <span class="hidden xl:inline">{t.more}</span>
        <ChevronDown class="hidden h-4 w-4 transition-transform xl:block {open ? 'rotate-180' : ''}" strokeWidth={3} aria-hidden="true" />
      </button>
    </div>
  </div>

  {#if open}
    <!-- Téléphone et tablette : tout le menu, sous la barre, sur la largeur.
         Ordinateur : un panneau accroché sous « Plus », avec seulement ce
         que la barre ne montre pas (`inBar` y est masqué). -->
    <div
      bind:this={menuPanel}
      id="site-menu"
      class="absolute inset-x-0 top-full max-h-[calc(100svh-4.5rem)] overflow-y-auto border-b border-gray-200 bg-[#f8f9fa] shadow-[0_24px_48px_-24px_rgba(17,24,39,0.35)] xl:inset-x-auto xl:right-8 xl:mt-2 xl:w-[24rem] xl:rounded-2xl xl:border xl:bg-white min-[1600px]:hidden"
    >
      <nav aria-label={t.nav} class="mx-auto max-w-[1720px] px-4 py-5 sm:px-8 xl:p-2">
        <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-1 xl:gap-1">
          {#each t.groups as group (group.title)}
            <section>
              <p class="px-3 pb-1 text-sm font-bold text-gray-500 xl:pt-2">{group.title}</p>
              <ul>
                {#each group.items as item (item.href)}
                  <li class={'inBar' in item ? 'xl:hidden' : ''}>
                    <a
                      href={menuHref(item.href)}
                      onclick={(e) => goTo(e, item.href)}
                      aria-current={current === item.href ? 'location' : undefined}
                      class="flex min-h-14 flex-col justify-center rounded-xl px-3 py-2 transition-colors hover:bg-white xl:hover:bg-gray-100 {current === item.href ? 'bg-white xl:bg-gray-100' : ''}"
                    >
                      <span class="font-bold text-gray-900">{item.label}</span>
                      <span class="text-sm text-gray-600">{item.desc}</span>
                    </a>
                  </li>
                {/each}
              </ul>
            </section>
          {/each}
        </div>

        <a
          href="/demo/"
          onclick={() => (open = false)}
          class="mt-6 flex items-center justify-between gap-4 rounded-2xl border-2 border-indigo-600 bg-white px-4 py-3.5 transition-colors hover:bg-indigo-50 xl:hidden"
        >
          <span class="flex flex-col">
            <span class="font-bold text-indigo-700">{t.demo.label}</span>
            <span class="text-sm text-gray-600">{t.demo.desc}</span>
          </span>
          <span class="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wider text-indigo-700">Live</span>
        </a>

        <div class="mt-4 sm:hidden"><InviteButton content="menu" class="w-full" /></div>
      </nav>
    </div>
  {/if}
</header>
