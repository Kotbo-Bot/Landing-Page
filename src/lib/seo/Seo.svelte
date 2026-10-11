<script lang="ts">
  /**
   * Les balises de référencement et d'aperçu de lien d'une page.
   *
   * Discord lit Open Graph : `og:title` devient le titre bleu de l'embed,
   * `og:description` le texte, `og:image` la grande image (grâce à
   * `twitter:card` = `summary_large_image`, sinon il la réduit en vignette), et
   * `theme-color` la barre de couleur à gauche. X, Slack et LinkedIn lisent les
   * mêmes balises.
   *
   * L'image est rendue par `motion/` (`bun run render:og`) : ses dimensions
   * sont annoncées ici pour que les réseaux la placent sans la télécharger.
   *
   * Une page bilingue (`i18n/routes.ts`) annonce ses deux versions en
   * `hreflang`, le français servant de version par défaut. Son JSON-LD vient
   * de `jsonld.js`, seul contenu en ligne que la CSP autorise.
   */
  import { getLocale } from '$lib/i18n/state.svelte';
  import { SITE_URL } from '$lib/product';
  import { alternatesOf } from '$lib/i18n/routes';
  import { jsonLdString } from './jsonld.js';

  interface Props {
    title: string;
    description: string;
    /** Chemin de la page, `/` pour l'accueil. Sert à l'URL canonique. */
    path: string;
    robots?: string;
    /** Données structurées de la page, construites par `jsonld.js`. */
    jsonLd?: object;
  }

  let { title, description, path, robots = 'index, follow, max-image-preview:large', jsonLd }: Props = $props();

  const TEXT = {
    fr: { imageAlt: 'Kotbo : ton serveur Discord, géré au même endroit. Aperçu du dashboard.' },
    en: { imageAlt: 'Kotbo: your Discord server, run from one place. Dashboard preview.' },
  };

  /** Indigo de Kotbo (DESIGN.md) : la barre latérale de l'embed Discord. */
  const THEME_COLOR = '#4f46e5';
  const IMAGE = `${SITE_URL}/og-image.png`;

  const OG_LOCALE = { fr: 'fr_FR', en: 'en_US' } as const;

  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const url = $derived(`${SITE_URL}${path}`);
  const alternates = $derived(alternatesOf(path));
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="robots" content={robots} />
  <link rel="canonical" href={url} />
  <meta name="theme-color" content={THEME_COLOR} />
  {#if alternates}
    <link rel="alternate" hreflang="fr" href="{SITE_URL}{alternates.fr}" />
    <link rel="alternate" hreflang="en" href="{SITE_URL}{alternates.en}" />
    <link rel="alternate" hreflang="x-default" href="{SITE_URL}{alternates.fr}" />
  {/if}

  <meta property="og:site_name" content="Kotbo" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content={OG_LOCALE[locale]} />
  <meta property="og:locale:alternate" content={OG_LOCALE[locale === 'fr' ? 'en' : 'fr']} />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={IMAGE} />
  <meta property="og:image:secure_url" content={IMAGE} />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={t.imageAlt} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={IMAGE} />
  <meta name="twitter:image:alt" content={t.imageAlt} />

  {#if jsonLd}
    {@html `<script type="application/ld+json">${jsonLdString(jsonLd)}</script>`}
  {/if}
</svelte:head>
