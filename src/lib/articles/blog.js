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
    slug: 'kotbo-gratuit',
    date: '2026-11-01',
    author: 'Klaynight',
    text: {
      fr: {
        h1: 'Kotbo devient gratuit : ce qui est inclus, ce qui reste dans l’offre complète',
        description:
          'Kotbo a maintenant une offre gratuite sans limite de durée : modération, anti-raid, logs, accueil, tickets, niveaux, stats. L’offre complète garde la gestion du staff, l’IA, le site et l’engagement poussé.',
        lead: 'Jusqu’ici, un serveur sans abonnement avait le bot mais aucun module. C’est fini : Kotbo a une offre gratuite, sans limite de durée et sans carte bancaire, qui couvre ce qu’un serveur attend d’un bot',
        sections: [
          {
            h2: 'Ce qui est gratuit',
            body: 'Tout ce que les autres bots donnent gratuitement, réglé depuis le même dashboard que l’offre complète',
            points: [
              'Modération : sanctions, AutoMod, anti-raid, vérification, modération des pseudos',
              'Logs Discord',
              'Accueil et départ, règlement, rôles par réaction, créateur d’embeds, auto-réponses, auto-thread',
              'Niveaux et XP, tickets, giveaways, événements et quiz, suggestions, Starlight',
              'Analytics, déclencheurs, actualités et RSS, alertes YouTube et Twitch, rappel de bump',
              'L’annuaire du staff',
            ],
          },
          {
            h2: 'La sécurité ne sera jamais payante',
            body: 'Un serveur raidé parce qu’il n’avait pas payé, c’est un échec pour tout le monde. Sanctions, AutoMod, anti-raid, vérification et logs restent dans l’offre gratuite, et un test du code de Kotbo échoue si quelqu’un les en retire',
          },
          {
            h2: 'Ce que garde l’offre complète',
            body: 'Ce qu’aucun bot gratuit ne fait. C’est là que Kotbo se distingue',
            points: [
              'Toute la gestion du staff : hiérarchie, recrutement, tutorat, réunions, absences, listes de suivi, sondages, discipline, évaluations',
              'L’IA de modération AegisAI, la détection des doubles comptes, les appels de bannissement',
              'Le site de ta communauté, avec wiki, blog et forum',
              'Saisons, prestige, clans, drops, économie et RPG, marché, quêtes, réputation',
              'Le serveur MCP pour piloter Kotbo depuis une IA, et le cross-serveur',
            ],
          },
          {
            h2: 'Voir la gestion du staff avant de payer',
            body: 'Sur une page staff verrouillée, le bouton Voir un exemple rempli ouvre la même page dans la démo publique, avec une équipe fictive. Tu vois exactement ce que tu débloques',
          },
          {
            h2: 'Un seul prix, pour tous les serveurs',
            body: 'L’offre complète s’appelle Plus et coûte le même prix pour tous les serveurs, petits ou grands : 5 € par mois, ou 30 € par an, hors taxes. Avec un code de parrainage, elle s’essaie 15 jours, puis la première facture a 10 % de remise',
          },
          {
            h2: 'Si ton essai ou ton abonnement se termine',
            body: 'Le serveur ne s’éteint plus. Il repasse en gratuit : la modération, l’accueil et les niveaux continuent de tourner, les modules de l’offre complète se mettent en pause avec leurs réglages et leurs données. Un abonnement les rallume dans l’état où tu les as laissés',
          },
        ],
        faq: [
          {
            q: 'L’offre gratuite a-t-elle une limite de durée ?',
            a: 'Non. Elle ne s’arrête pas et ne demande pas de carte bancaire',
          },
          {
            q: 'Mon serveur était déjà installé sans abonnement : que se passe-t-il ?',
            a: 'Les modules gratuits que tu avais allumés se mettent à tourner. Les autres s’allument depuis la page Modules du dashboard',
          },
          {
            q: 'Je suis déjà abonné : qu’est-ce qui change pour moi ?',
            a: 'Rien. Ton offre ouvre toujours tout le catalogue, au même prix. Si tu es sur Pro ou Ultimate, tu peux passer sur Plus depuis la page Facturation pour payer moins',
          },
        ],
      },
      en: {
        h1: 'Kotbo goes free: what is included, what stays in the full plan',
        description:
          'Kotbo now has a free plan with no time limit: moderation, anti-raid, logs, welcome, tickets, levels, stats. The full plan keeps staff management, AI, the website and advanced engagement.',
        lead: 'Until now, a server without a subscription had the bot but no module. Not anymore: Kotbo has a free plan, with no time limit and no credit card, covering what a server expects from a bot',
        sections: [
          {
            h2: 'What is free',
            body: 'Everything other bots give away for free, set up from the same dashboard as the full plan',
            points: [
              'Moderation: sanctions, AutoMod, anti-raid, verification, nickname moderation',
              'Discord logs',
              'Welcome and goodbye, rules, reaction roles, embed builder, auto-responses, auto-thread',
              'Levels and XP, tickets, giveaways, events and quizzes, suggestions, Starlight',
              'Analytics, triggers, news and RSS, YouTube and Twitch alerts, bump reminder',
              'The staff directory',
            ],
          },
          {
            h2: 'Security will never be paid',
            body: 'A server raided because it did not pay is a failure for everyone. Sanctions, AutoMod, anti-raid, verification and logs stay in the free plan, and a test in Kotbo’s code fails if anyone removes them',
          },
          {
            h2: 'What the full plan keeps',
            body: 'What no free bot does. This is where Kotbo stands apart',
            points: [
              'Full staff management: hierarchy, recruitment, mentoring, meetings, time off, tracking lists, polls, discipline, reviews',
              'AegisAI moderation, alt account detection, ban appeals',
              'Your community website, with wiki, blog and forum',
              'Seasons, prestige, clans, drops, economy and RPG, marketplace, quests, reputation',
              'The MCP server to run Kotbo from an AI, and cross-server',
            ],
          },
          {
            h2: 'See staff management before you pay',
            body: 'On a locked staff page, the Voir un exemple rempli button opens the same page in the public demo, with a sample team. You see exactly what you unlock',
          },
          {
            h2: 'One price, for every server',
            body: 'The full plan is called Plus and costs the same for every server, small or large: €5 a month, or €30 a year, excluding VAT. With a referral code, it comes with a 15-day trial, then 10% off the first invoice',
          },
          {
            h2: 'If your trial or subscription ends',
            body: 'The server no longer shuts down. It goes back to free: moderation, welcome and levels keep running, full-plan modules pause with their settings and data. A subscription brings them back as you left them',
          },
        ],
        faq: [
          {
            q: 'Does the free plan have a time limit?',
            a: 'No. It does not end and does not ask for a credit card',
          },
          {
            q: 'My server was already set up without a subscription: what happens?',
            a: 'The free modules you had switched on start running. Switch on the others from the Modules page of the dashboard',
          },
          {
            q: 'I already subscribe: what changes for me?',
            a: 'Nothing. Your plan still opens the whole catalogue, at the same price. If you are on Pro or Ultimate, you can switch to Plus from the Billing page to pay less',
          },
        ],
      },
    },
  },
  {
    slug: 'documentation-kotbo-nouvelle-adresse',
    date: '2026-11-01',
    author: 'Klaynight',
    text: {
      fr: {
        h1: 'La documentation de Kotbo déménage sur kotbo.fr/docs',
        description:
          'Le guide de Kotbo quitte docs.kotbo.fr pour kotbo.fr/docs. Les anciens liens redirigent automatiquement : ce qui change, ce qui ne change pas, et quoi mettre à jour de ton côté.',
        lead: 'La documentation de Kotbo n’est plus sur docs.kotbo.fr : elle se trouve maintenant sur kotbo.fr/docs, avec le reste du site. Rien à refaire de ton côté, les anciens liens continuent de fonctionner',
        sections: [
          {
            h2: 'Ce qui change',
            body: 'Le guide du dashboard, les pages Discord et l’aide gardent exactement le même contenu, en français et en anglais. Seule l’adresse bouge',
            points: [
              'Avant : docs.kotbo.fr',
              'Maintenant : kotbo.fr/docs',
              'Un bandeau sur la documentation rappelle le changement, tu peux le fermer',
            ],
          },
          {
            h2: 'Les anciens liens',
            body: 'Un lien docs.kotbo.fr/dashboard/moderation/sanctions t’amène directement sur kotbo.fr/docs/dashboard/moderation/sanctions. Les pages que tu as épinglées sur ton serveur, dans tes tickets ou dans ton règlement restent valables',
          },
          {
            h2: 'Pourquoi ce changement',
            body: 'Tout Kotbo est regroupé sous un seul domaine : le site, les fonctionnalités, le blog et maintenant la documentation. C’est plus simple à retenir, et les recherches sur kotbo.fr font aussi remonter le guide',
          },
          {
            h2: 'À mettre à jour de ton côté',
            body: 'Rien n’est obligatoire, mais si tu as copié des liens vers la documentation dans un salon, un message épinglé ou un site, tu peux les remplacer par la nouvelle adresse pour éviter la redirection',
          },
        ],
        faq: [
          {
            q: 'Les anciens liens vont-ils continuer de marcher ?',
            a: 'Oui. docs.kotbo.fr redirige vers la même page sur kotbo.fr/docs, chemin compris',
          },
          {
            q: 'Le contenu de la documentation change-t-il ?',
            a: 'Non. Le contenu est le même, seule l’adresse change',
          },
          {
            q: 'La recherche et le sélecteur de langue fonctionnent-ils toujours ?',
            a: 'Oui, la recherche et le passage du français à l’anglais fonctionnent comme avant sur la nouvelle adresse',
          },
        ],
      },
      en: {
        h1: 'Kotbo’s documentation moves to kotbo.fr/docs',
        description:
          'The Kotbo guide leaves docs.kotbo.fr for kotbo.fr/docs. Old links redirect automatically: what changes, what does not, and what to update on your side.',
        lead: 'Kotbo’s documentation is no longer at docs.kotbo.fr: it now lives at kotbo.fr/docs, alongside the rest of the site. Nothing to redo on your side, old links keep working',
        sections: [
          {
            h2: 'What changes',
            body: 'The dashboard guide, the Discord pages and the help section keep exactly the same content, in French and English. Only the address moves',
            points: [
              'Before: docs.kotbo.fr',
              'Now: kotbo.fr/docs',
              'A banner on the documentation reminds you of the change, and you can close it',
            ],
          },
          {
            h2: 'Old links',
            body: 'A docs.kotbo.fr/dashboard/moderation/sanctions link takes you straight to kotbo.fr/docs/dashboard/moderation/sanctions. Pages you pinned on your server, in your tickets or in your rules stay valid',
          },
          {
            h2: 'Why the change',
            body: 'All of Kotbo is gathered under a single domain: the site, the features, the blog and now the documentation. It is easier to remember, and searches on kotbo.fr surface the guide too',
          },
          {
            h2: 'What to update on your side',
            body: 'Nothing is required, but if you copied documentation links into a channel, a pinned message or a website, you can replace them with the new address to skip the redirect',
          },
        ],
        faq: [
          {
            q: 'Will old links keep working?',
            a: 'Yes. docs.kotbo.fr redirects to the same page on kotbo.fr/docs, path included',
          },
          {
            q: 'Does the documentation content change?',
            a: 'No. The content is the same, only the address changes',
          },
          {
            q: 'Do search and the language switcher still work?',
            a: 'Yes, search and switching between French and English work as before at the new address',
          },
        ],
      },
    },
  },
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
