/**
 * Les données structurées (JSON-LD) des pages bilingues.
 *
 * Elles disent aux moteurs, et aux assistants IA qui s'en servent pour
 * répondre, ce qu'est Kotbo en termes non ambigus : un logiciel (bot Discord
 * et dashboard), son éditeur, son prix, et les questions auxquelles chaque
 * page répond.
 *
 * Le JSON-LD est injecté en ligne ; la CSP n'autorise que les empreintes
 * calculées au build par `svelte.config.js` sur `allJsonLd()`, avec le même
 * `JSON.stringify` que les pages. Tout le contenu doit donc venir d'ici : un
 * texte calculé ailleurs, au rendu, serait bloqué. D'où le JavaScript simple,
 * que Node importe sans passer par Vite.
 *
 * Pas d'`aggregateRating` : les notes viennent de Top.gg, et Google interdit
 * de reprendre celles d'un autre site (voir `product.ts`).
 */
import { FREE_FAQ, HOME_FAQ, HUB_FAQ, STAFF_FAQ } from './faq.js';
// Les pages de la console, telles que `scripts/fetch-features.mjs` les écrit
// avant le build : le JSON-LD de chaque article en sort.
import featurePages from '../data/feature-pages.json' with { type: 'json' };

const SITE = 'https://kotbo.fr';
const ORG_ID = `${SITE}/#organization`;
const SITE_ID = `${SITE}/#website`;
const APP_ID = `${SITE}/#software`;

/** Les URL de chaque page, alignées sur `i18n/routes.ts`. */
const PATHS = {
  home: { fr: '/', en: '/en' },
  staff: { fr: '/gestion-staff-discord', en: '/en/discord-staff-management' },
  hub: { fr: '/fonctionnalites', en: '/en/features' },
};

/** Comme `featurePath` (`i18n/routes.ts`). */
const featureUrl = (/** @type {{ fr: string, en: string }} */ slug, /** @type {'fr' | 'en'} */ locale) =>
  `${SITE}${locale === 'en' ? `/en/features/${slug.en}` : `/fonctionnalites/${slug.fr}`}`;

/**
 * @typedef {{ name: string, title: string, description: string, h1: string, lead: string, faq: { q: string, a: string }[] }} FeatureText
 * @typedef {{ key: string, slug: { fr: string, en: string }, text: { fr: FeatureText, en: FeatureText } }} FeaturePage
 */
/** @type {FeaturePage[]} */
const FEATURE_PAGES = featurePages.pages;

const LANG = { fr: 'fr-FR', en: 'en-US' };

/** Les graphies sous lesquelles on cherche Kotbo sans le connaître. */
const ALTERNATE_NAMES = ['Kotbot', 'Kot bot', 'Kotbo bot'];

const TEXT = {
  fr: {
    appDescription:
      "Bot Discord français tout-en-un et dashboard web pour gérer une communauté et son équipe : modération, AutoMod, anti-raid, logs, détection des doubles comptes, tickets, gestion du staff (hiérarchies, absences, réunions, évaluations, recrutement), niveaux et économie.",
    features: [
      'Gestion du staff : hiérarchies, grades, annuaire',
      'Absences du staff avec validation par un supérieur',
      'Réunions, tâches et sondages du staff',
      'Évaluations de performance des modérateurs',
      'Recrutement par formulaire de candidature',
      'Discipline staff et notes du manager',
      'Sanctions avec motif, auteur et preuves',
      'Détection des doubles comptes',
      'Appels de bannissement',
      'AutoMod, protection anti-raid et captcha',
      'Logs Discord',
      'Tickets support',
      'Niveaux, économie, giveaways et événements',
      'Serveur MCP : piloter le serveur depuis Claude, ChatGPT ou Gemini',
    ],
    home: 'Accueil',
    hub: 'Fonctionnalités',
    hubName: 'Fonctionnalités de Kotbo, un article par module',
    staffName: 'Gestion du staff Discord',
    staffDescription:
      "Gérer l'équipe de modération d'un serveur Discord avec Kotbo : hiérarchies, absences, réunions, évaluations, recrutement, casier des sanctions et doubles comptes.",
  },
  en: {
    appDescription:
      'All-in-one French Discord bot and web dashboard to run a community and its team: moderation, AutoMod, anti-raid, logs, alt account detection, tickets, staff management (hierarchies, absences, meetings, reviews, recruitment), levels and economy.',
    features: [
      'Staff management: hierarchies, ranks, directory',
      'Staff absences approved by a superior',
      'Staff meetings, tasks and polls',
      'Moderator performance reviews',
      'Recruitment through application forms',
      'Staff discipline and manager notes',
      'Sanctions with reason, author and evidence',
      'Alt account detection',
      'Ban appeals',
      'AutoMod, anti-raid protection and captcha',
      'Discord logs',
      'Support tickets',
      'Levels, economy, giveaways and events',
      'MCP server: run the server from Claude, ChatGPT or Gemini',
    ],
    home: 'Home',
    hub: 'Features',
    hubName: "Kotbo's features, one article per module",
    staffName: 'Discord staff management',
    staffDescription:
      "Run a Discord server's moderation team with Kotbo: hierarchies, absences, meetings, reviews, recruitment, sanction records and alt accounts.",
  },
};

/** @param {'fr' | 'en'} locale */
function organization(locale) {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Kotbo',
    url: `${SITE}/`,
    logo: { '@type': 'ImageObject', url: `${SITE}/icon-512.png`, width: 512, height: 512 },
    email: 'contact@kotbo.fr',
    areaServed: 'FR',
    knowsLanguage: [LANG.fr, LANG.en],
    sameAs: ['https://top.gg/bot/1481651387317354598', 'https://docs.kotbo.fr/'],
    alternateName: ALTERNATE_NAMES,
    inLanguage: LANG[locale],
  };
}

/** @param {'fr' | 'en'} locale */
function software(locale) {
  const t = TEXT[locale];
  return {
    '@type': 'SoftwareApplication',
    '@id': APP_ID,
    name: 'Kotbo',
    url: `${SITE}${PATHS.home[locale]}`,
    description: t.appDescription,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: locale === 'fr' ? 'Bot Discord' : 'Discord bot',
    operatingSystem: 'Discord, Web',
    inLanguage: [LANG.fr, LANG.en],
    image: `${SITE}/og-image.png`,
    featureList: t.features,
    // Le prix mensuel le plus bas et le plus haut des offres de
    // `v3/Price.svelte`, hors taxes : les modifier ensemble.
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: '5.00',
      highPrice: '25.00',
      offerCount: 3,
      url: `${SITE}${PATHS.home[locale]}#prix`,
    },
    publisher: { '@id': ORG_ID },
    alternateName: ALTERNATE_NAMES,
  };
}

/** @param {{ q: string, a: string }[]} items @param {string} url @param {'fr' | 'en'} locale */
function faqPage(items, url, locale) {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    inLanguage: LANG[locale],
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/** @param {'fr' | 'en'} locale */
export function homeJsonLd(locale) {
  const url = `${SITE}${PATHS.home[locale]}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization(locale),
      {
        '@type': 'WebSite',
        '@id': SITE_ID,
        url: `${SITE}/`,
        name: 'Kotbo',
        inLanguage: [LANG.fr, LANG.en],
        publisher: { '@id': ORG_ID },
      },
      software(locale),
      faqPage(HOME_FAQ[locale], url, locale),
    ],
  };
}

/**
 * Le fil d'Ariane d'un article : accueil, index des articles, article.
 * @param {'fr' | 'en'} locale @param {string} name @param {string} url
 */
function articleBreadcrumb(locale, name, url) {
  const t = TEXT[locale];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.home, item: `${SITE}${PATHS.home[locale]}` },
      { '@type': 'ListItem', position: 2, name: t.hub, item: `${SITE}${PATHS.hub[locale]}` },
      { '@type': 'ListItem', position: 3, name, item: url },
    ],
  };
}

/**
 * Un article. Pas de date : les pages de la console n'en portent pas, et une
 * date inventée serait pire que pas de date.
 * @param {'fr' | 'en'} locale @param {{ url: string, name: string, headline: string, description: string }} a
 */
function article(locale, { url, name, headline, description }) {
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    url,
    mainEntityOfPage: url,
    headline,
    name,
    description,
    inLanguage: LANG[locale],
    image: `${SITE}/og-image.png`,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    about: { '@id': APP_ID },
    isPartOf: { '@id': `${SITE}${PATHS.hub[locale]}#collection` },
    breadcrumb: articleBreadcrumb(locale, name, url),
  };
}

/** @param {'fr' | 'en'} locale */
export function staffJsonLd(locale) {
  const t = TEXT[locale];
  const url = `${SITE}${PATHS.staff[locale]}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization(locale),
      software(locale),
      article(locale, { url, name: t.staffName, headline: t.staffName, description: t.staffDescription }),
      faqPage(STAFF_FAQ[locale], url, locale),
    ],
  };
}

/**
 * Une page de la console, par sa clé.
 * @param {string} key @param {'fr' | 'en'} locale
 */
export function featureJsonLd(key, locale) {
  const page = FEATURE_PAGES.find((p) => p.key === key);
  if (!page) return undefined;
  const text = page.text[locale];
  const url = featureUrl(page.slug, locale);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization(locale),
      software(locale),
      article(locale, { url, name: text.name, headline: text.h1, description: text.description }),
      // La FAQ affichée : celle de la fiche, plus la question sur la gratuité
      // (comme `data/features.ts`).
      faqPage([...text.faq, FREE_FAQ[locale]], url, locale),
    ],
  };
}

/**
 * L'index des articles : la liste, dans l'ordre de la page (l'article staff
 * épinglé, puis les pages de la console).
 * @param {'fr' | 'en'} locale
 */
export function hubJsonLd(locale) {
  const t = TEXT[locale];
  const url = `${SITE}${PATHS.hub[locale]}`;
  const items = [
    { name: t.staffName, url: `${SITE}${PATHS.staff[locale]}` },
    ...FEATURE_PAGES.map((p) => ({ name: p.text[locale].name, url: featureUrl(p.slug, locale) })),
  ];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization(locale),
      software(locale),
      {
        '@type': 'CollectionPage',
        '@id': `${url}#collection`,
        url,
        name: t.hubName,
        inLanguage: LANG[locale],
        isPartOf: { '@id': SITE_ID },
        about: { '@id': APP_ID },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t.home, item: `${SITE}${PATHS.home[locale]}` },
            { '@type': 'ListItem', position: 2, name: t.hub, item: url },
          ],
        },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, url: item.url })),
        },
      },
      faqPage(HUB_FAQ[locale], url, locale),
    ],
  };
}

/**
 * Le `<script>` tel que les pages l'injectent, et tel que la CSP l'empreinte.
 * `<`, `>` et `&` sont échappés : le texte des articles vient de l'API, et un
 * `</script>` dans un titre fermerait la balise.
 */
export function jsonLdString(/** @type {object} */ data) {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

/** Tous les JSON-LD que le site peut servir, pour la CSP. */
export function allJsonLd() {
  return /** @type {const} */ (['fr', 'en']).flatMap((locale) => [
    homeJsonLd(locale),
    staffJsonLd(locale),
    hubJsonLd(locale),
    ...FEATURE_PAGES.map((p) => /** @type {object} */ (featureJsonLd(p.key, locale))),
  ]);
}
