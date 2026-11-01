<script lang="ts">
  /**
   * L'archive du blog : les billets datés regroupés par année, du plus récent
   * au plus ancien, puis les articles des modules (sans date) à part. Chaque
   * entrée porte son étiquette, sa date et son temps de lecture, son résumé et
   * un « Lire plus », sur le modèle des blogs de bots (RaidProtect).
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { ktb } from '$lib/playground/discord/theme';
  import type { Post } from './posts';

  const { posts }: { posts: Post[] } = $props();

  const TEXT = {
    fr: { minutes: (n: number) => `${n} min de lecture`, more: 'Lire plus', modules: 'Les modules' },
    en: { minutes: (n: number) => `${n} min read`, more: 'Read more', modules: 'Modules' },
  };
  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);

  const groups = $derived.by(() => {
    const dated = posts.filter((p) => p.date).sort((a, b) => b.date!.localeCompare(a.date!));
    const years = new Map<string, Post[]>();
    for (const p of dated) years.set(p.date!.slice(0, 4), [...(years.get(p.date!.slice(0, 4)) ?? []), p]);
    const out = [...years].map(([title, items]) => ({ title, items }));
    const undated = posts.filter((p) => !p.date);
    return undated.length ? [...out, { title: t.modules, items: undated }] : out;
  });

  const fmt = (date: string) =>
    new Date(`${date}T12:00:00Z`).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
</script>

{#each groups as group (group.title)}
  <section class="mt-12 first:mt-0">
    <h3 class="border-b border-line pb-3 font-display text-2xl font-extrabold tracking-tight text-ink">{group.title}</h3>
    <ul class="mt-6 grid gap-5 lg:grid-cols-2">
      {#each group.items as post (post.key)}
        {@const text = post.text[locale]}
        <li class="flex">
          <a href="{base}{post.path[locale]}" class="group flex w-full flex-col rounded-2xl border border-line bg-night-2 p-6 transition-colors hover:border-glow/50 hover:bg-night-3">
            <span class="flex items-center gap-3 text-sm text-fog">
              <img src={ktb(post.icon)} alt="" width="28" height="28" class="h-7 w-7 rounded-md bg-night-4 p-1" />
              <span>{post.date ? `${fmt(post.date)} · ` : ''}{t.minutes(text.minutes)}</span>
            </span>
            <span class="mt-4 text-balance font-display text-xl font-extrabold leading-snug tracking-tight text-ink sm:text-2xl">{text.h1}</span>
            <span class="mt-3 leading-relaxed text-fog">{text.description}</span>
            <span class="mt-5 flex flex-wrap items-center gap-3">
              <span class="rounded-md bg-night-4 px-2 py-0.5 text-sm font-semibold text-mist">{text.name}</span>
              <span class="ml-auto font-semibold text-glow group-hover:underline">{t.more} →</span>
            </span>
          </a>
        </li>
      {/each}
    </ul>
  </section>
{/each}
