<script lang="ts" module>
  /** Un forum : son nom de salon, son index, le sujet affiché sur l'index. */
  export type Forum = { name: string; href: string; topic: string };
</script>

<script lang="ts">
  /**
   * La barre qui ouvre l'index et chaque article, comme le haut d'un salon
   * forum dans Discord : l'accueil est un serveur dont chaque zone est un salon
   * (`v3/ChannelHeader`), les articles en sont le forum, un sujet par article.
   *
   * Sur un article, elle se lit « forum › sujet » et sert de fil d'Ariane :
   * le nom du forum ramène à l'index. Les notes de version ont leur propre
   * forum (`forum`), `nouveautes`.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { FEATURES_ROUTE, homeOf } from '$lib/i18n/routes';

  /** Le nom du sujet ouvert ; absent sur l'index. Sans `forum`, celui des articles. */
  const { post, forum }: { post?: string; forum?: Forum } = $props();

  const TEXT = {
    fr: { crumbs: 'Fil d’Ariane', home: 'Kotbo', forum: 'fonctionnalites', topic: 'ce que le bot fait vraiment, module par module' },
    en: { crumbs: 'Breadcrumb', home: 'Kotbo', forum: 'features', topic: 'what the bot actually does, module by module' },
  };
  const t = $derived(TEXT[getLocale()]);
  const locale = $derived(getLocale());
  const current = $derived(forum ?? { name: t.forum, href: `${base}${FEATURES_ROUTE[locale]}`, topic: t.topic });
</script>

<nav aria-label={t.crumbs} class="flex h-12 min-w-0 items-center border-b border-line text-[15px]">
  <ol class="flex min-w-0 items-center gap-2.5">
    <li class="sr-only"><a href="{base}{homeOf(locale)}">{t.home}</a></li>
    <li class="flex min-w-0 shrink-0 items-center gap-2.5">
      <!-- Le pictogramme des salons forum de Discord. -->
      <svg aria-hidden="true" viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-fog"><path fill="currentColor" d="M18.9 3H5.1A2.1 2.1 0 0 0 3 5.1v9.8C3 16.06 3.94 17 5.1 17H7v3.3a.7.7 0 0 0 1.18.5L11.9 17h7A2.1 2.1 0 0 0 21 14.9V5.1A2.1 2.1 0 0 0 18.9 3ZM7 8h10a1 1 0 1 1 0 2H7a1 1 0 0 1 0-2Zm0 4h6a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2Z" /></svg>
      {#if post}
        <a href={current.href} class="font-semibold text-fog underline-offset-4 hover:text-ink hover:underline" translate="no">{current.name}</a>
      {:else}
        <span aria-current="page" class="font-semibold text-ink" translate="no">{current.name}</span>
      {/if}
    </li>
    {#if post}
      <li class="flex min-w-0 items-center gap-2.5">
        <svg aria-hidden="true" viewBox="0 0 24 24" class="h-4 w-4 shrink-0 text-fog"><path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        <span aria-current="page" class="truncate font-semibold text-ink">{post}</span>
      </li>
    {/if}
  </ol>
  {#if !post}
    <span aria-hidden="true" class="mx-3.5 hidden h-6 w-px shrink-0 bg-line-2 sm:block"></span>
    <span class="hidden truncate text-fog sm:block">{current.topic}</span>
  {/if}
</nav>
