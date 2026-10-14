<script lang="ts">
  /**
   * Des articles en liste, comme les sujets d'un salon forum Discord : le
   * pictogramme du module, le titre de l'article, son résumé, puis son
   * étiquette et le temps de lecture. L'article épinglé le dit, comme un sujet épinglé.
   *
   * Une ligne entière est un lien. Pas de cartes : un forum se lit de haut en
   * bas, un sujet sous l'autre.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { ktb } from '$lib/playground/discord/theme';
  import type { Post } from './posts';

  const { posts }: { posts: Post[] } = $props();

  const TEXT = {
    fr: { pinned: 'Épinglé', minutes: (n: number) => `${n} min de lecture` },
    en: { pinned: 'Pinned', minutes: (n: number) => `${n} min read` },
  };
  const t = $derived(TEXT[getLocale()]);
  const locale = $derived(getLocale());
</script>

<ul class="divide-y divide-line border-y border-line">
  {#each posts as post (post.key)}
    {@const text = post.text[locale]}
    <li>
      <a href="{base}{post.path[locale]}" class="group grid grid-cols-[2.5rem_1fr] gap-x-4 px-1 py-6 transition-colors hover:bg-night-3 sm:grid-cols-[3rem_1fr] sm:px-4">
        <img src={ktb(post.icon)} alt="" width="40" height="40" class="mt-1 h-9 w-9 rounded-lg bg-night-3 p-1.5 transition-colors group-hover:bg-night-4 sm:h-11 sm:w-11 sm:p-2" />
        <span class="flex min-w-0 flex-col">
          {#if post.pinned}
            <span class="mb-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-glow">
              <svg aria-hidden="true" viewBox="0 0 24 24" class="h-4 w-4"><path fill="currentColor" d="M15.1 2.3a1 1 0 0 0-1.6.3L11.4 7 7 8.1a1 1 0 0 0-.47 1.68l3.07 3.07-4.9 4.9a1 1 0 1 0 1.42 1.42l4.9-4.9 3.07 3.07a1 1 0 0 0 1.68-.47l1.1-4.4 4.4-2.1a1 1 0 0 0 .3-1.6Z" /></svg>
              {t.pinned}
            </span>
          {/if}
          <span class="text-balance font-display text-xl font-extrabold leading-snug tracking-tight text-ink sm:text-2xl">{text.h1}</span>
          <span class="mt-2 max-w-3xl leading-relaxed text-fog">{text.description}</span>
          <span class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fog">
            <!-- L'étiquette du sujet, comme celles des forums Discord. -->
            <span class="rounded-md bg-night-4 px-2 py-0.5 font-semibold text-mist">{text.name}</span>
            <span>{t.minutes(text.minutes)}</span>
          </span>
        </span>
      </a>
    </li>
  {/each}
</ul>
