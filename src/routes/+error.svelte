<script lang="ts">
  /**
   * La page d'erreur, servie aussi pour toute adresse inconnue (`404.html`,
   * le repli d'`adapter-static`). Dans la langue de Discord : le salon
   * n'existe pas. Elle renvoie vers ce qui existe, et ne s'indexe pas.
   */
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { FEATURES_ROUTE, homeOf } from '$lib/i18n/routes';
  import Shell from '$lib/v3/Shell.svelte';

  const TEXT = {
    fr: {
      missing: { title: 'Ce salon n’existe pas', body: 'Le lien est cassé, ou la page a déménagé. L’accueil et les articles, eux, sont toujours là' },
      broken: { title: 'Quelque chose a planté', body: 'La page n’a pas pu s’afficher. Recharge-la, ou repars de l’accueil' },
      home: 'Retour à l’accueil',
      articles: 'Lire les articles',
    },
    en: {
      missing: { title: 'This channel doesn’t exist', body: 'The link is broken, or the page has moved. The home page and the articles are still here' },
      broken: { title: 'Something crashed', body: 'The page couldn’t load. Reload it, or start again from the home page' },
      home: 'Back to home',
      articles: 'Read the articles',
    },
  };
  const t = $derived(TEXT[getLocale()]);
  const text = $derived(page.status === 404 ? t.missing : t.broken);
</script>

<svelte:head>
  <title>{text.title} | Kotbo</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<Shell invite={false}>
  <section aria-labelledby="error-title" class="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-36">
    <p class="font-mono text-sm text-fog">{page.status}</p>
    <h1 id="error-title" class="mt-4 max-w-3xl text-balance font-display text-5xl font-black leading-[0.98] tracking-[-0.03em] text-ink sm:text-7xl">{text.title}</h1>
    <p class="mt-6 max-w-xl text-lg leading-relaxed text-mist">{text.body}</p>
    <div class="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
      <a href="{base}{homeOf(getLocale())}" class="inline-flex min-h-12 items-center rounded-xl border border-line-2 px-5 font-bold text-ink transition-colors hover:bg-night-3">{t.home}</a>
      <a href="{base}{FEATURES_ROUTE[getLocale()]}" class="inline-flex min-h-11 items-center font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{t.articles}</a>
    </div>
  </section>
</Shell>
