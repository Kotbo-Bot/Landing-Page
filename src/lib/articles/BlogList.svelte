<script lang="ts">
  /**
   * L'archive du blog : une barre de recherche et des thèmes pour s'y retrouver,
   * puis les billets datés regroupés par année, du plus récent au plus ancien,
   * et les articles des modules (sans date) à part. Chaque entrée porte son
   * thème en couleur, sa date et son temps de lecture, son résumé et un
   * « Lire plus », sur le modèle des blogs de bots (RaidProtect).
   *
   * La recherche ignore les accents et la casse, et exige tous les mots saisis.
   * Elle et le thème choisi se lisent et s'écrivent dans l'adresse
   * (`?q=raid&theme=security`), pour qu'on puisse partager une vue. La touche
   * « / » ouvre la recherche, « Échap » l'efface.
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { replaceState } from '$app/navigation';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { ktb } from '$lib/playground/discord/theme';
  import { ACCENTS } from './accents.js';
  import type { Post } from './posts';

  const { posts }: { posts: Post[] } = $props();

  type Theme = keyof typeof ACCENTS;

  const TEXT = {
    fr: {
      minutes: (n: number) => `${n} min de lecture`,
      more: 'Lire plus',
      modules: 'Les modules',
      search: 'Rechercher un article',
      placeholder: 'Rechercher : raid, giveaway, tickets, alts…',
      clear: 'Effacer la recherche',
      themes: 'Thèmes',
      all: 'Tout',
      count: (n: number) => (n === 0 ? 'Aucun article' : n === 1 ? '1 article' : `${n} articles`),
      none: 'Aucun article ne correspond.',
      noneHint: 'Essaie un mot plus court, ou change de thème.',
      reset: 'Tout afficher',
      labels: { security: 'Sécurité', community: 'Communauté', welcome: 'Accueil et rôles', staff: 'Staff', tools: 'Outils', news: 'Nouveautés', default: 'Autres' },
    },
    en: {
      minutes: (n: number) => `${n} min read`,
      more: 'Read more',
      modules: 'Modules',
      search: 'Search articles',
      placeholder: 'Search: raid, giveaway, tickets, alts…',
      clear: 'Clear search',
      themes: 'Themes',
      all: 'All',
      count: (n: number) => (n === 0 ? 'No articles' : n === 1 ? '1 article' : `${n} articles`),
      none: 'No article matches.',
      noneHint: 'Try a shorter word, or change theme.',
      reset: 'Show everything',
      labels: { security: 'Security', community: 'Community', welcome: 'Welcome & roles', staff: 'Staff', tools: 'Tools', news: 'News', default: 'Other' },
    },
  };
  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);

  /** Sans accents ni casse : « Sécurité » se trouve en tapant « securite ». */
  const norm = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  const THEME_OF = new Map<string, Theme>(Object.entries(ACCENTS).map(([theme, color]) => [color, theme as Theme]));
  const themeOf = (post: Post): Theme => THEME_OF.get(post.accent) ?? 'default';

  let query = $state('');
  let theme = $state<Theme | 'all'>('all');
  let input = $state<HTMLInputElement>();
  let ready = $state(false);

  const terms = $derived(norm(query).split(/\s+/).filter(Boolean));
  const index = $derived(posts.map((post) => ({ post, theme: themeOf(post), hay: norm(`${post.text[locale].h1} ${post.text[locale].name} ${post.text[locale].description}`) })));
  const matching = $derived(index.filter((e) => terms.every((w) => e.hay.includes(w))));
  const filtered = $derived(matching.filter((e) => theme === 'all' || e.theme === theme).map((e) => e.post));

  /** Les thèmes présents, avec le nombre d'articles qui répondent à la recherche. */
  const themes = $derived.by(() => {
    const order: Theme[] = ['security', 'community', 'welcome', 'staff', 'tools', 'news', 'default'];
    return order
      .map((id) => ({ id, label: t.labels[id], count: matching.filter((e) => e.theme === id).length, total: index.filter((e) => e.theme === id).length }))
      .filter((x) => x.total > 0);
  });

  const groups = $derived.by(() => {
    const dated = filtered.filter((p) => p.date).sort((a, b) => b.date!.localeCompare(a.date!));
    const years = new Map<string, Post[]>();
    for (const p of dated) years.set(p.date!.slice(0, 4), [...(years.get(p.date!.slice(0, 4)) ?? []), p]);
    const out = [...years].map(([title, items]) => ({ title, items }));
    const undated = filtered.filter((p) => !p.date);
    return undated.length ? [...out, { title: t.modules, items: undated }] : out;
  });

  const fmt = (date: string) =>
    new Date(`${date}T12:00:00Z`).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  onMount(() => {
    const params = new URLSearchParams(location.search);
    query = params.get('q') ?? '';
    const asked = params.get('theme');
    if (asked && asked in ACCENTS) theme = asked as Theme;
    ready = true;
  });

  // La vue s'écrit dans l'adresse, sans ajouter d'entrée à l'historique.
  $effect(() => {
    if (!ready) return;
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (theme !== 'all') params.set('theme', theme);
    const search = params.toString();
    try {
      replaceState(`${location.pathname}${search ? `?${search}` : ''}${location.hash}`, {});
    } catch {
      /* Le routeur n'est pas prêt : l'adresse reste telle quelle. */
    }
  });

  function onKey(event: KeyboardEvent) {
    const typing = (event.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable]');
    if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      input?.focus();
    }
  }

  function reset() {
    query = '';
    theme = 'all';
    input?.focus();
  }
</script>

<svelte:window onkeydown={onKey} />

<div role="search" class="space-y-5">
  <div class="relative">
    <label for="blog-search" class="sr-only">{t.search}</label>
    <svg aria-hidden="true" viewBox="0 0 24 24" class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fog"><path d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
    <input
      id="blog-search"
      bind:this={input}
      bind:value={query}
      type="search"
      autocomplete="off"
      enterkeyhint="search"
      placeholder={t.placeholder}
      onkeydown={(e) => e.key === 'Escape' && query && (query = '')}
      class="h-14 w-full rounded-full border border-transparent bg-night-3 pl-12 pr-28 text-lg text-ink shadow-[var(--tf-shadow)] transition placeholder:text-fog focus:border-ink focus:outline-none [&::-webkit-search-cancel-button]:hidden"
    />
    {#if query}
      <button type="button" onclick={() => ((query = ''), input?.focus())} class="tf-press absolute right-3 top-1/2 inline-flex h-9 -translate-y-1/2 items-center rounded-full bg-night-4 px-4 text-sm font-semibold text-mist hover:text-ink">{t.clear}</button>
    {:else}
      <kbd aria-hidden="true" class="pointer-events-none absolute right-4 top-1/2 hidden h-7 -translate-y-1/2 items-center rounded-md border border-line-2 px-2 font-mono text-sm text-fog sm:inline-flex">/</kbd>
    {/if}
  </div>

  <div class="flex flex-wrap items-center gap-2" role="group" aria-label={t.themes}>
    <button
      type="button"
      aria-pressed={theme === 'all'}
      onclick={() => (theme = 'all')}
      class="tf-press inline-flex min-h-10 items-center gap-2 rounded-full border border-transparent px-4 text-sm font-semibold transition-colors {theme === 'all' ? 'bg-ink text-night' : 'bg-night-3 text-mist hover:text-ink'}"
    >
      {t.all}<span class="text-xs opacity-70">{matching.length}</span>
    </button>
    {#each themes as item (item.id)}
      {@const on = theme === item.id}
      <button
        type="button"
        aria-pressed={on}
        disabled={item.count === 0 && !on}
        onclick={() => (theme = on ? 'all' : item.id)}
        style="--accent: {ACCENTS[item.id]}"
        class="tf-press inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors disabled:opacity-40 {on
          ? 'border-transparent bg-ink text-night'
          : 'border-[color-mix(in_srgb,var(--accent)_25%,transparent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-ink hover:bg-[color-mix(in_srgb,var(--accent)_22%,transparent)]'}"
      >
        <span aria-hidden="true" class="h-2.5 w-2.5 rounded-full bg-[var(--accent)]"></span>
        {item.label}<span class="text-xs opacity-70">{item.count}</span>
      </button>
    {/each}
  </div>

  <p class="text-sm text-fog" aria-live="polite">{t.count(filtered.length)}</p>
</div>

<div class="mt-8">
  {#each groups as group (group.title)}
    <section class="mt-12 first:mt-0">
      <h3 class="border-b border-line pb-3 font-display text-2xl font-extrabold tracking-tight text-ink">{group.title}</h3>
      <ul class="mt-6 grid gap-5 lg:grid-cols-2">
        {#each group.items as post (post.key)}
          {@const text = post.text[locale]}
          <li class="flex">
            <a
              href="{base}{post.path[locale]}"
              style="--accent: {post.accent}"
              class="tf-card group flex w-full flex-col p-6 hover:border-[color-mix(in_srgb,var(--accent)_55%,transparent)]"
            >
              <span class="flex items-center gap-3 text-sm text-fog">
                <img src={ktb(post.icon)} alt="" width="28" height="28" class="h-9 w-9 rounded-[11px] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] p-1.5 ring-1 ring-[color-mix(in_srgb,var(--accent)_28%,transparent)]" />
                <span>{post.date ? `${fmt(post.date)} · ` : ''}{t.minutes(text.minutes)}</span>
              </span>
              <span class="mt-4 text-balance font-display text-xl font-extrabold leading-snug tracking-tight text-ink sm:text-2xl">{text.h1}</span>
              <span class="mt-3 leading-relaxed text-fog">{text.description}</span>
              <span class="mt-5 flex flex-wrap items-center gap-3">
                <span class="inline-flex h-6 items-center rounded-full border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-2.5 text-xs font-semibold text-[color-mix(in_srgb,var(--accent)_65%,var(--color-ink))]">{t.labels[themeOf(post)]}</span>
                <span class="ml-auto font-semibold text-[color-mix(in_srgb,var(--accent)_65%,var(--color-ink))] group-hover:underline">{t.more} →</span>
              </span>
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {:else}
    <div class="tf-card px-6 py-14 text-center">
      <p class="font-display text-2xl font-extrabold text-ink">{t.none}</p>
      <p class="mt-2 text-fog">{t.noneHint}</p>
      <button type="button" onclick={reset} class="tf-press mt-6 inline-flex min-h-11 items-center rounded-full bg-ink px-6 font-semibold text-night">{t.reset}</button>
    </div>
  {/each}
</div>
