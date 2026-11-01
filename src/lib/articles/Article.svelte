<script lang="ts">
  /**
   * Un article : l'article staff (`articles/staff.ts`), une page de la
   * console (`data/features.ts`), une note de version (`articles/releases.js`)
   * ou un billet du blog, annonce ou guide (`articles/blog.js`).
   * Une note se range dans son propre forum (`forum`), porte sa date et le
   * lien vers la release GitHub (`source`), et mène aux versions d'avant. Un
   * billet du blog (`articles/blog.js`) a son forum, sa date et son auteur.
   *
   * Ces pages sont écrites pour la recherche : un titre qui reprend la
   * requête, un texte qui dit ce que le bot fait, une FAQ qui répond aux
   * questions telles qu'on les tape. Elles se lisent comme un sujet du forum
   * (`ForumBar`) : l'auteur et le temps de lecture sous le titre, le texte sur
   * une colonne de lecture, le sommaire à côté sur grand écran. Puis la FAQ,
   * trois autres sujets, et l'invitation.
   *
   * Les écrans du dashboard ne sont chargés que par l'article qui les montre
   * (`figure`), pour que les autres restent légers.
   */
  import type { Snippet } from 'svelte';
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { featurePath, FEATURES_ROUTE, homeOf } from '$lib/i18n/routes';
  import { FEATURES } from '$lib/data/features';
  import { TRIAL_DAYS } from '$lib/product';
  import Seo from '$lib/seo/Seo.svelte';
  import Shell from '$lib/v3/Shell.svelte';
  import AddButton from '$lib/v3/AddButton.svelte';
  import FaqList from '$lib/v3/FaqList.svelte';
  import ForumBar, { type Forum } from './ForumBar.svelte';
  import PostList from './PostList.svelte';
  import { BLOG_POSTS, POSTS, RELEASE_POSTS, relatedTo } from './posts';
  import type { ArticleSection } from './staff';

  type Screen = NonNullable<ArticleSection['figure']>['screen'];

  interface Props {
    postKey: string;
    seo: { title: string; description: string; path: string; jsonLd?: object };
    h1: string;
    lead: string;
    sections: ArticleSection[];
    faq?: ReadonlyArray<{ q: string; a: string }>;
    final?: { title: string; body: string };
    /** Emplacements des deux invitations, repris dans la mesure. */
    invite: { hero: string; final: string };
    figure?: Snippet<[Screen]>;
    /** Le forum de l'article et le libellé du lien vers sa liste ; celui des articles par défaut. */
    forum?: Forum & { all: string };
    /** Date de publication, `AAAA-MM-JJ`. */
    date?: string;
    /** Le texte d'origine, ailleurs. */
    source?: { href: string; label: string };
    /** Signature d'un billet du blog ; Kotbo par défaut. */
    author?: string;
  }

  const { postKey, seo, h1, lead, sections, faq = [], final, invite, figure, forum, date, source, author }: Props = $props();

  const TEXT = {
    fr: {
      author: 'Kotbo',
      minutes: (n: number) => `${n} min de lecture`,
      demo: 'Fouiller la démo du dashboard',
      offer: `Compris dans toutes les offres, avec ${TRIAL_DAYS} jours d’essai sans carte bancaire`,
      toc: 'Sur cette page',
      faq: 'Questions fréquentes',
      related: 'À lire aussi',
      all: 'Tous les articles',
      final: { title: 'Essaie-le sur ton serveur', body: `${TRIAL_DAYS} jours offerts, sans carte bancaire. Toutes les offres contiennent tout le catalogue` },
      pricing: 'Voir les tarifs',
    },
    en: {
      author: 'Kotbo',
      minutes: (n: number) => `${n} min read`,
      demo: 'Dig through the dashboard demo',
      offer: `Included in every plan, with a ${TRIAL_DAYS}-day trial and no credit card`,
      toc: 'On this page',
      faq: 'Frequently asked questions',
      related: 'Read next',
      all: 'All articles',
      final: { title: 'Try it on your server', body: `${TRIAL_DAYS} days free, no credit card. Every plan includes the whole catalog` },
      pricing: 'See pricing',
    },
  };

  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  // Un billet du blog mène aux autres billets, puis aux articles.
  const pool = $derived(
    RELEASE_POSTS.some((p) => p.key === postKey) ? RELEASE_POSTS : BLOG_POSTS.some((p) => p.key === postKey) ? [...BLOG_POSTS, ...POSTS] : POSTS,
  );
  const post = $derived(pool.find((p) => p.key === postKey)!);
  const related = $derived(relatedTo(postKey, 3, pool));
  const published = $derived(
    date ? new Date(`${date}T12:00:00Z`).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null,
  );
  const closing = $derived(final ?? t.final);

  /** Le lien d'un point vers l'article qui le détaille, s'il est publié. */
  function linkOf(key: string): string | null {
    const feature = FEATURES.find((f) => f.key === key);
    return feature ? `${base}${featurePath(feature.slug, locale)}` : null;
  }
</script>

<Seo title={seo.title} description={seo.description} path={seo.path} jsonLd={seo.jsonLd} />

<Shell>
  <article aria-labelledby="article-title">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ForumBar post={post.text[locale].name} {forum} /></div>

    <header class="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:pt-16">
      <div class="max-w-4xl">
        <!-- La ligne d'auteur d'un message Discord. -->
        <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fog">
          <img src="{base}/favicon.svg" alt="" width="28" height="28" class="h-7 w-7 rounded-full" />
          <span class="font-semibold text-ink">{author ?? t.author}</span>
          {#if published}<time datetime={date}>{published}</time>{/if}
          <span>{t.minutes(post.text[locale].minutes)}</span>
        </p>
        <h1 id="article-title" class="mt-5 text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-ink sm:text-5xl lg:text-6xl">{h1}</h1>
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-mist sm:text-xl">{lead}</p>
        <div class="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <AddButton content={invite.hero} size="lg" />
          <a href="/demo/" class="inline-flex min-h-11 items-center font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{t.demo}</a>
          {#if source}
            <a href={source.href} target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{source.label}</a>
          {/if}
        </div>
        <p class="mt-4 text-sm text-fog">{t.offer}</p>
      </div>
    </header>

    <div class="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-20 lg:pb-28 lg:pt-24">
      <div class="min-w-0 max-w-3xl space-y-20">
        {#each sections as section, i (section.h2)}
          <section id="section-{i + 1}" aria-labelledby="section-{i + 1}-title" class="scroll-mt-24">
            <h2 id="section-{i + 1}-title" class="text-balance font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">{section.h2}</h2>
            <p class="mt-4 text-lg leading-relaxed text-mist">{section.body}</p>

            {#if section.points}
              <ul class="mt-6 list-disc space-y-3 pl-5 leading-relaxed text-mist marker:text-glow">
                {#each section.points as point (point)}
                  <li>{point}</li>
                {/each}
              </ul>
            {/if}

            {#if section.items}
              <ul class="mt-8 grid gap-x-10 sm:grid-cols-2">
                {#each section.items as item (item.title)}
                  {@const href = item.link ? linkOf(item.link.feature) : null}
                  <li class="border-t border-line py-5">
                    <h3 class="font-display text-lg font-bold text-ink">{item.title}</h3>
                    <p class="mt-1 leading-relaxed text-fog">{item.body}</p>
                    {#if item.link && href}
                      <a {href} class="mt-1 inline-flex min-h-11 items-center font-semibold text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{item.link.label}</a>
                    {/if}
                  </li>
                {/each}
              </ul>
            {/if}

            {#if section.steps}
              <ol class="mt-8">
                {#each section.steps as step, n (step.title)}
                  <li class="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-line py-5">
                    <span aria-hidden="true" class="font-display text-3xl font-black leading-none text-fog">{n + 1}</span>
                    <div>
                      <h3 class="font-display text-lg font-bold text-ink">{step.title}</h3>
                      <p class="mt-1 leading-relaxed text-fog">{step.body}</p>
                    </div>
                  </li>
                {/each}
              </ol>
            {/if}

            {#if section.commands}
              <!-- Les commandes comme Discord les affiche dans un message : une mention cliquable. -->
              <dl class="mt-8 divide-y divide-line border-y border-line">
                {#each section.commands as command (command.name)}
                  <div class="grid gap-x-6 gap-y-2 py-5 sm:grid-cols-[minmax(0,15rem)_1fr]">
                    <dt><code class="inline-block max-w-full break-words rounded-md bg-glow/15 px-2 py-0.5 font-sans font-semibold text-glow">{command.name}</code></dt>
                    <dd class="leading-relaxed text-fog">{command.body}</dd>
                  </div>
                {/each}
              </dl>
            {/if}

            {#if section.figure && figure}
              <figure class="mt-10 rounded-2xl border border-line-2 bg-night-3 p-2 sm:p-3">
                <figcaption class="px-2 pb-3 pt-1 text-base text-mist sm:px-3">{section.figure.caption}</figcaption>
                {@render figure(section.figure.screen)}
              </figure>
            {/if}
          </section>
        {/each}
      </div>

      <!-- Le sommaire suit la lecture sur grand écran. -->
      <nav aria-labelledby="toc-title" class="hidden lg:block">
        <div class="sticky top-24">
          <p id="toc-title" class="text-sm font-semibold text-ink">{t.toc}</p>
          <ol class="mt-3 border-l border-line text-sm">
            {#each sections as section, i (section.h2)}
              <li><a href="#section-{i + 1}" class="-ml-px block border-l border-transparent py-2 pl-4 leading-snug text-fog transition-colors hover:border-ink hover:text-ink">{section.h2}</a></li>
            {/each}
            {#if faq.length}
              <li><a href="#faq" class="-ml-px block border-l border-transparent py-2 pl-4 leading-snug text-fog transition-colors hover:border-ink hover:text-ink">{t.faq}</a></li>
            {/if}
          </ol>
        </div>
      </nav>
    </div>
  </article>

  {#if faq.length}
    <section id="faq" aria-labelledby="faq-title" class="scroll-mt-20 bg-night-2 py-16 sm:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="max-w-3xl">
          <h2 id="faq-title" class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-ink sm:text-5xl">{t.faq}</h2>
          <div class="mt-10"><FaqList items={faq} trackAs="{postKey}-q" level="h3" /></div>
        </div>
      </div>
    </section>
  {/if}

  <nav aria-labelledby="related-title" class="py-16 sm:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <h2 id="related-title" class="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t.related}</h2>
        <a href={forum?.href ?? `${base}${FEATURES_ROUTE[locale]}`} class="inline-flex min-h-11 items-center font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{forum?.all ?? t.all}</a>
      </div>
      <div class="mt-8"><PostList posts={related} /></div>
    </div>
  </nav>

  <section aria-labelledby="final-title" class="border-t border-line bg-night-2 py-20 sm:py-28">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <h2 id="final-title" class="max-w-3xl text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-ink sm:text-6xl">{closing.title}</h2>
      <p class="mt-5 max-w-xl text-lg leading-relaxed text-mist">{closing.body}</p>
      <div class="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
        <AddButton content={invite.final} size="lg" />
        <a href="{base}{homeOf(locale)}#prix" class="inline-flex min-h-11 items-center font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{t.pricing}</a>
      </div>
    </div>
  </section>
</Shell>
