/**
 * Les billets du blog, du plus récent au plus ancien. Chacun est un article
 * (`/blog/<slug>`, `/en/blog/<slug>`), l'index `/blog` les liste.
 *
 * Un billet a la forme d'une note de version (`releases.js`), plus son
 * auteur. Comme elles, rien n'y est écrit qui ne soit pas décidé : pas de
 * date ni de chiffre promis.
 *
 * Les annonces de l'équipe s'écrivent ici. Les guides, un par question que
 * les admins tapent dans Google (« comment faire un giveaway sur discord »),
 * vivent chacun dans son fichier sous `blog/`, listés par `blog/guides.js` :
 * ils ont un slug par langue, pour viser les requêtes anglaises aussi, et
 * chaque commande ou réglage cité se vérifie dans le dépôt produit.
 *
 * JavaScript simple plutôt que TypeScript : `seo/jsonld.js` lit ces billets au
 * build pour la CSP, il doit pouvoir les importer sans Vite.
 */

import { GUIDES } from './blog/guides.js';

/**
 * @typedef {{ title: string, body: string, link?: { feature: string, label: string } }} BlogItem
 * @typedef {{ name: string, body: string }} BlogCommand
 * @typedef {{ h2: string, body: string, points?: string[], items?: BlogItem[], steps?: BlogItem[], commands?: BlogCommand[], figure?: { screen: 'tickets' | 'sanctions' | 'staff' | 'members', caption: string } }} BlogSection
 * @typedef {{ title?: string, h1: string, description: string, lead: string, sections: BlogSection[], faq?: { q: string, a: string }[] }} BlogText
 * @typedef {{ slug: string | { fr: string, en: string }, date: string, author: string, modules?: string[], text: { fr: BlogText, en: BlogText } }} BlogPost
 */

/**
 * Le slug d'un billet dans une langue : un seul pour une annonce, un par
 * langue pour un guide.
 * @param {BlogPost} post @param {'fr' | 'en'} locale
 */
export function blogSlug(post, locale) {
  return typeof post.slug === 'string' ? post.slug : post.slug[locale];
}

/** @type {BlogPost[]} */
export const BLOG = [
  ...GUIDES,
  {
    slug: 'aegisai-by-kotbo',
    date: '2026-10-28',
    author: 'Klaynight',
    text: {
      fr: {
        h1: 'AegisAI devient AegisAI by Kotbo',
        description:
          'AegisAI, l’IA qui repère les insultes et lit le ton des messages Discord, rejoint Kotbo. Rien ne change pour ton serveur, l’API passe sur aegisai.kotbo.fr et le modèle va grandir.',
        lead: 'AegisAI, l’IA créée par Marcel (marvideo) qui note la toxicité et l’émotion des messages, rejoint Kotbo et devient AegisAI by Kotbo. Si ton serveur l’utilise déjà, tu n’as rien à faire',
        sections: [
          {
            h2: 'D’où vient AegisAI',
            body: 'Marcel, de marvideo.fr, a créé AegisAI : une API qui lit un message et renvoie sa note de toxicité et l’émotion qu’il porte. Kotbo s’en sert depuis la 9.5 pour repérer ce que les listes de mots bannis ratent : les fautes volontaires et les phrases polies mais méchantes',
          },
          {
            h2: 'Ce que veut dire la fusion',
            body: 'AegisAI passe sous la marque Kotbo. Marcel continue de le développer, désormais avec Kotbo et au plus près du bot qui s’en sert',
          },
          {
            h2: 'Pour ton serveur, rien ne change',
            body: 'Le module AegisAI continue de tourner tel quel, rien n’est à réactiver',
            points: [
              'Tes seuils, tes exemptions et les modules dérivés gardent leurs réglages',
              'Le choix de partager ou non les messages pour entraîner le modèle reste celui de ton serveur, modifiable dans les réglages du module',
            ],
          },
          {
            h2: 'Pour les développeurs, l’API reste ouverte',
            body: 'AegisAI by Kotbo reste une API publique, ouverte aux projets hors Kotbo. Elle répond désormais à une seule adresse, aegisai.kotbo.fr : si ton code appelle encore l’ancienne, remplace-la',
          },
          {
            h2: 'Ce qui arrive',
            body: 'Rejoindre Kotbo donne à AegisAI de quoi grandir. Voici ce qui arrive, sans date pour l’instant',
            items: [
              { title: 'Beaucoup plus de messages', body: 'L’API va encaisser bien plus de messages à la seconde, pour suivre les gros serveurs aux heures de pointe' },
              { title: 'Un modèle plus juste', body: 'Les menaces mieux repérées, le chambrage entre amis moins souvent pris pour une insulte, les émotions en anglais plus fiables' },
              { title: 'Plus de 100 langues', body: 'AegisAI lira plus de 100 langues, au-delà du français et de l’anglais' },
            ],
          },
        ],
        faq: [
          {
            q: 'Dois-je faire quelque chose sur mon serveur ?',
            a: 'Non. Le module AegisAI continue de tourner avec tes réglages et le choix de partage de ton serveur',
          },
          {
            q: 'Peut-on encore utiliser AegisAI sans Kotbo ?',
            a: 'Oui. L’API reste ouverte aux autres projets, à l’adresse aegisai.kotbo.fr, désormais la seule',
          },
          {
            q: 'Qu’est-ce qu’AegisAI fait des messages de mon serveur ?',
            a: 'Kotbo envoie le texte des messages à l’API AegisAI, qui renvoie une note de toxicité et une émotion. Le partage des messages pour entraîner le modèle se choisit serveur par serveur',
          },
          {
            q: 'Quand arrivent les nouvelles langues ?',
            a: 'Il n’y a pas encore de date. Elles seront annoncées dans les notes de version à leur sortie',
          },
        ],
      },
      en: {
        h1: 'AegisAI becomes AegisAI by Kotbo',
        description:
          'AegisAI, the model that spots insults and reads the tone of Discord messages, joins Kotbo. Nothing changes for your server, the API moves to aegisai.kotbo.fr and the model is about to grow.',
        lead: 'AegisAI, the model built by Marcel (marvideo) that scores the toxicity and emotion of messages, joins Kotbo and becomes AegisAI by Kotbo. If your server already uses it, there is nothing to do',
        sections: [
          {
            h2: 'Where AegisAI comes from',
            body: 'Marcel, from marvideo.fr, built AegisAI: an API that reads a message and returns its toxicity score and the emotion it carries. Kotbo has used it since 9.5 to catch what banned-word lists miss: deliberate misspellings and polite but nasty sentences',
          },
          {
            h2: 'What the merger means',
            body: 'AegisAI moves under the Kotbo brand. Marcel keeps building it, now with Kotbo and right next to the bot that uses it',
          },
          {
            h2: 'For your server, nothing changes',
            body: 'The AegisAI module keeps running as it is, there is nothing to turn back on',
            points: [
              'Your thresholds, exemptions and derived modules keep their settings',
              'Whether messages are shared to train the model is still your server’s choice, editable in the module settings',
            ],
          },
          {
            h2: 'For developers, the API stays open',
            body: 'AegisAI by Kotbo stays a public API, open to projects outside Kotbo. It now answers at a single address, aegisai.kotbo.fr: if your code still calls the old one, replace it',
          },
          {
            h2: 'What’s coming',
            body: 'Joining Kotbo gives AegisAI room to grow. Here is what’s coming, with no date yet',
            items: [
              { title: 'Many more messages', body: 'The API will handle far more messages per second, to keep up with large servers at peak hours' },
              { title: 'A fairer model', body: 'Threats caught more reliably, friendly banter less often taken for an insult, more accurate emotions in English' },
              { title: 'Over 100 languages', body: 'AegisAI will read over 100 languages, beyond French and English' },
            ],
          },
        ],
        faq: [
          {
            q: 'Do I need to do anything on my server?',
            a: 'No. The AegisAI module keeps running with your settings and your server’s sharing choice',
          },
          {
            q: 'Can AegisAI still be used without Kotbo?',
            a: 'Yes. The API stays open to other projects, at aegisai.kotbo.fr, now the only address',
          },
          {
            q: 'What does AegisAI do with my server’s messages?',
            a: 'Kotbo sends the text of messages to the AegisAI API, which returns a toxicity score and an emotion. Sharing messages to train the model is chosen server by server',
          },
          {
            q: 'When do the new languages arrive?',
            a: 'There is no date yet. They will be announced in the release notes when they ship',
          },
        ],
      },
    },
  },
];
