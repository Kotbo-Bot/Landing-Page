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
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import LanguageSwitcher from '$lib/components/ui/LanguageSwitcher.svelte';
  import InviteButton from '$lib/playground/InviteButton.svelte';

  const TEXT = {
    fr: {
      home: 'Kotbo, retour en haut',
      nav: 'Sections de la page',
      menu: 'Menu',
      close: 'Fermer le menu',
      links: [
        { href: '#monter', label: 'Monter un serveur' },
        { href: '#crise', label: 'La soirée' },
        { href: '#commandes', label: 'Commandes' },
        { href: '#carte', label: 'Carte de rang' },
        { href: '#comparatif', label: 'Comparatif' },
        { href: '#pricing', label: 'Tarifs' },
      ],
    },
    en: {
      home: 'Kotbo, back to top',
      nav: 'Page sections',
      menu: 'Menu',
      close: 'Close menu',
      links: [
        { href: '#monter', label: 'Build a server' },
        { href: '#crise', label: 'The night' },
        { href: '#commandes', label: 'Commands' },
        { href: '#carte', label: 'Rank card' },
        { href: '#comparatif', label: 'Comparison' },
        { href: '#pricing', label: 'Pricing' },
      ],
    },
  };

  const t = $derived(TEXT[getLocale()]);
  let open = $state(false);
  let scrolled = $state(false);

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
    const sections = TEXT.fr.links
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((node): node is HTMLElement => node !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) current = `#${entry.target.id}`;
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
    if (!link || !list) {
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
    if (event.key === 'Escape') open = false;
  }
</script>

<svelte:window onkeydown={onKeydown} />

<header class="sticky top-0 z-50 border-b transition-colors {scrolled ? 'border-gray-200 bg-[#f8f9fa]' : 'border-transparent'}">
  <div class="mx-auto flex max-w-360 items-center justify-between gap-4 px-4 py-3 sm:px-8">
    <a href="#top" aria-label={t.home} class="flex items-center gap-2.5 rounded-lg">
      <img src="{base}/favicon.svg" alt="" width="36" height="36" class="h-9 w-9 rounded-xl" />
      <span class="font-headline text-xl font-extrabold text-gray-900">Kotbo</span>
    </a>

    <nav aria-label={t.nav} class="hidden lg:block">
      <ul bind:this={list} class="relative flex gap-7 text-sm font-semibold text-gray-700">
        {#each t.links as link (link.href)}
          <li>
            <a
              href={link.href}
              onclick={(e) => goTo(e, link.href)}
              aria-current={current === link.href ? 'location' : undefined}
              class="inline-flex min-h-10 items-center transition-colors hover:text-gray-900 {current === link.href ? 'text-gray-900' : ''}"
            >
              {link.label}
            </a>
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

    <div class="flex items-center gap-3">
      <LanguageSwitcher />
      <div class="hidden sm:block"><InviteButton content="header" tone="ink" /></div>
      <button
        type="button"
        onclick={() => (open = !open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        class="min-h-11 rounded-xl border-2 border-gray-900 px-3 text-sm font-bold text-gray-900 lg:hidden"
      >
        {open ? t.close : t.menu}
      </button>
    </div>
  </div>

  {#if open}
    <nav id="mobile-menu" aria-label={t.nav} class="border-t border-gray-200 bg-[#f8f9fa] lg:hidden">
      <ul class="mx-auto max-w-360 px-4 py-2 sm:px-8">
        {#each t.links as link (link.href)}
          <li>
            <a href={link.href} onclick={(e) => goTo(e, link.href)} class="flex min-h-12 items-center text-base font-semibold text-gray-900">
              {link.label}
            </a>
          </li>
        {/each}
      </ul>
      <div class="px-4 pb-4 sm:hidden"><InviteButton content="menu" class="w-full" /></div>
    </nav>
  {/if}
</header>
