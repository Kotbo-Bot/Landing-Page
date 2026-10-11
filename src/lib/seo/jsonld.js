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
import { HOME_FAQ, STAFF_FAQ } from './faq.js';

const SITE = 'https://kotbo.fr';
const ORG_ID = `${SITE}/#organization`;
const SITE_ID = `${SITE}/#website`;
const APP_ID = `${SITE}/#software`;

/** Les URL de chaque page, alignées sur `LOCALIZED_ROUTES` (`i18n/routes.ts`). */
const PATHS = {
  home: { fr: '/', en: '/en/' },
  staff: { fr: '/gestion-staff-discord', en: '/en/discord-staff-management' },
};

const LANG = { fr: 'fr-FR', en: 'en-US' };

const TEXT = {
  fr: {
    appDescription:
      "Bot Discord français et dashboard web pour gérer une communauté et son équipe : gestion du staff (hiérarchies, absences, réunions, évaluations, recrutement), modération avec historique des sanctions, doubles comptes, tickets, niveaux et économie.",
    features: [
      'Gestion du staff : hiérarchies, grades, annuaire',
      'Absences du staff avec validation par un supérieur',
      'Réunions, tâches et sondages du staff',
      'Évaluations de performance des modérateurs',
      'Recrutement par formulaire de candidature',
      'Discipline staff et notes du manager',
      'Sanctions avec motif, auteur et preuves',
      'Doubles comptes',
      'Appels de bannissement',
      'AutoMod et protection anti-raid',
      'Tickets support',
      'Niveaux, économie et événements',
      'Serveur MCP pour agents IA',
    ],
    home: 'Accueil',
    staffName: 'Gestion du staff Discord',
    staffDescription:
      "Gérer l'équipe de modération d'un serveur Discord avec Kotbo : hiérarchies, absences, réunions, évaluations, recrutement, casier des sanctions et doubles comptes.",
  },
  en: {
    appDescription:
      'French Discord bot and web dashboard to run a community and its team: staff management (hierarchies, absences, meetings, reviews, recruitment), moderation with sanction history, alt accounts, tickets, levels and economy.',
    features: [
      'Staff management: hierarchies, ranks, directory',
      'Staff absences approved by a superior',
      'Staff meetings, tasks and polls',
      'Moderator performance reviews',
      'Recruitment through application forms',
      'Staff discipline and manager notes',
      'Sanctions with reason, author and evidence',
      'Alt accounts',
      'Ban appeals',
      'AutoMod and anti-raid protection',
      'Support tickets',
      'Levels, economy and events',
      'MCP server for AI agents',
    ],
    home: 'Home',
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
    // `components/Pricing.svelte`, hors taxes : les modifier ensemble.
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: '5.00',
      highPrice: '25.00',
      offerCount: 3,
      url: `${SITE}${PATHS.home[locale]}#pricing`,
    },
    publisher: { '@id': ORG_ID },
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

/** @param {'fr' | 'en'} locale */
export function staffJsonLd(locale) {
  const t = TEXT[locale];
  const url = `${SITE}${PATHS.staff[locale]}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization(locale),
      software(locale),
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name: t.staffName,
        description: t.staffDescription,
        inLanguage: LANG[locale],
        isPartOf: { '@id': SITE_ID },
        about: { '@id': APP_ID },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t.home, item: `${SITE}${PATHS.home[locale]}` },
            { '@type': 'ListItem', position: 2, name: t.staffName, item: url },
          ],
        },
      },
      faqPage(STAFF_FAQ[locale], url, locale),
    ],
  };
}

/** Le `<script>` tel que les pages l'injectent, et tel que la CSP l'empreinte. */
export function jsonLdString(/** @type {object} */ data) {
  return JSON.stringify(data);
}

/** Tous les JSON-LD que le site peut servir, pour la CSP. */
export function allJsonLd() {
  return /** @type {const} */ (['fr', 'en']).flatMap((locale) => [homeJsonLd(locale), staffJsonLd(locale)]);
}
