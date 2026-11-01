/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'annonces-actualites-rss-discord', en: 'discord-announcements-rss-feed' },
  date: '2026-11-01',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['news'],
  text: {
    fr: {
      title: 'Annonces Discord : publier des actualités avec un flux RSS',
      h1: 'Annonces Discord : rédiger des actualités et les diffuser en RSS',
      description:
        'Annonces Discord : comment rédiger des annonces et des notes de version, les publier dans un salon par rubrique et les offrir en flux RSS public, avec Kotbo.',
      lead: 'Les annonces d’un serveur se perdent dans le flux : un message épinglé, un salon #annonces que personne ne remonte. Discord permet de publier, mais pas de ranger par rubrique, de garder un brouillon ou d’offrir un flux à suivre ailleurs. Dans Kotbo, la page Actualités du dashboard te laisse rédiger, classer, diffuser dans le bon salon et publier un flux RSS que tes membres suivent depuis leur lecteur',
      sections: [
        {
          h2: 'À quoi servent des actualités structurées',
          body: 'Une annonce lue au bon moment évite dix questions au staff',
          points: [
            'Les patch notes, les annonces de recrutement et les nouvelles du staff ne se mélangent plus',
            'Un brouillon se relit avant publication, au lieu d’être écrit en direct dans Discord',
            'Les membres qui ne passent pas souvent sur Discord suivent le serveur par RSS',
            'Les anciennes annonces restent consultables, rangées par catégorie',
          ],
        },
        {
          h2: 'Ce que Discord propose sans bot',
          body: 'Discord a des salons d’annonces que les autres serveurs peuvent suivre, et des messages épinglés. Mais rien pour rédiger à l’avance, ranger par catégorie, éditer en Markdown avec aperçu, ni offrir un flux RSS à ton audience',
        },
        {
          h2: 'Rédiger et publier une actualité avec Kotbo',
          body: 'Tout se règle sur dash.kotbo.fr, page Actualités',
          steps: [
            { title: 'Crée l’article', body: 'Un titre, un résumé court facultatif, et le contenu en Markdown avec un aperçu en direct. Tu peux ajouter l’URL d’une image' },
            { title: 'Classe-le', body: 'Annonce, Blog, Patch note, Staff ou Mise à jour, plus une sous-catégorie facultative (API, Web, Europe…)' },
            { title: 'Choisis comment il part sur Discord', body: 'Soit le message complet avec une page publique, soit un résumé avec un bouton vers la page. Ce choix s’applique à la publication immédiate ou quand un brouillon est publié' },
            { title: 'Publie ou garde en brouillon', body: 'Publier immédiatement rend l’article public et envoie la notification. Sinon il reste en brouillon' },
          ],
        },
        {
          h2: 'Une rubrique, un salon',
          body: 'La section de configuration associe une catégorie, ou une sous-catégorie, à un salon Discord. Chaque rubrique est comme celle d’un journal',
          items: [
            { title: 'Salon de diffusion', body: 'Les annonces de la rubrique y sont publiées. Tu peux avoir un salon pour les patch notes et un autre pour les annonces du staff' },
            { title: 'Flux RSS dédié', body: 'Chaque rubrique a son flux public, que ton audience peut suivre séparément' },
            { title: 'Index des flux', body: 'Une table liste chaque rubrique avec son salon de diffusion et son flux' },
            { title: 'Vue forum', body: 'Les articles sont regroupés par catégorie puis par sous-catégorie, comme un forum' },
          ],
        },
        {
          h2: 'Le flux RSS public',
          body: 'Le flux est généré à partir des articles publiés. Tes membres, ou n’importe qui, peuvent s’y abonner avec Feedly, Inoreader ou tout autre lecteur RSS. Copie son lien depuis le dashboard. Un brouillon n’apparaît jamais dans le flux',
        },
        {
          h2: 'Bien rédiger une annonce',
          body: 'Une annonce utile se lit en dix secondes',
          points: [
            'Mets l’information principale dans le titre : « Maintenance samedi à 21 h » plutôt que « Annonce importante »',
            'Utilise le résumé court pour la version rapide, et le corps pour le détail',
            'Une catégorie par type de message : les membres choisissent ce qu’ils suivent',
            'Relis le brouillon dans l’aperçu avant de publier, surtout les liens et les mentions',
          ],
        },
      ],
      faq: [
        {
          q: 'Comment faire des annonces sur Discord avec un flux RSS ?',
          a: 'Avec Kotbo, rédige l’article dans la page Actualités du dashboard, associe sa catégorie à un salon Discord, et publie. Les articles publiés alimentent un flux RSS public',
        },
        {
          q: 'Peut-on préparer une annonce à l’avance ?',
          a: 'Oui, un article reste en brouillon tant que tu ne le publies pas. Il n’apparaît ni sur Discord ni dans le flux RSS',
        },
        {
          q: 'Peut-on envoyer les annonces dans plusieurs salons ?',
          a: 'Oui, chaque rubrique, c’est-à-dire une catégorie ou une sous-catégorie, a son propre salon de diffusion',
        },
        {
          q: 'Quel format utiliser pour le contenu ?',
          a: 'Le Markdown, avec une prévisualisation en direct pendant que tu écris',
        },
        {
          q: 'Comment mes membres suivent-ils le flux RSS ?',
          a: 'Ils copient le lien du flux dans un lecteur RSS comme Feedly ou Inoreader',
        },
        {
          q: 'Peut-on publier un patch note séparément des autres annonces ?',
          a: 'Oui, Patch note est une catégorie à part, qui peut avoir son salon et son flux',
        },
      ],
    },
    en: {
      title: 'Discord announcements: publish news with an RSS feed',
      h1: 'Discord announcements: write news and broadcast it as RSS',
      description:
        'Discord announcements: how to write announcements and patch notes, publish them in a channel per section and offer a public RSS feed, with Kotbo.',
      lead: 'A server’s announcements get lost in the flow: a pinned message, an #announcements channel nobody scrolls back through. Discord lets you post, but not sort by section, keep a draft, or offer a feed to follow elsewhere. In Kotbo, the News page of the dashboard lets you write, categorize, broadcast to the right channel and publish an RSS feed your members follow from their reader',
      sections: [
        {
          h2: 'What structured news is for',
          body: 'An announcement read at the right time spares staff ten questions',
          points: [
            'Patch notes, recruitment announcements and staff news no longer get mixed up',
            'A draft gets reread before publishing, instead of being written live in Discord',
            'Members who rarely open Discord follow the server through RSS',
            'Older announcements stay readable, sorted by category',
          ],
        },
        {
          h2: 'What Discord offers without a bot',
          body: 'Discord has announcement channels other servers can follow, and pinned messages. But nothing to write in advance, sort by category, edit in Markdown with a preview, or offer an RSS feed to your audience',
        },
        {
          h2: 'Writing and publishing news with Kotbo',
          body: 'Everything is set on dash.kotbo.fr, in the News page',
          steps: [
            { title: 'Create the article', body: 'A title, an optional short summary, and the content in Markdown with a live preview. You can add an image URL' },
            { title: 'Categorize it', body: 'Announcement, Blog, Patch note, Staff or Update, plus an optional subcategory (API, Web, Europe…)' },
            { title: 'Choose how it goes to Discord', body: 'Either the full message with a public page, or a summary with a button to the page. This choice applies on immediate publication or when a draft is published' },
            { title: 'Publish or keep as a draft', body: 'Publishing immediately makes the article public and sends the notification. Otherwise it stays a draft' },
          ],
        },
        {
          h2: 'One section, one channel',
          body: 'The configuration section pairs a category, or a subcategory, with a Discord channel. Each section works like a newspaper’s',
          items: [
            { title: 'Broadcast channel', body: 'The section’s announcements are posted there. You can have one channel for patch notes and another for staff announcements' },
            { title: 'Dedicated RSS feed', body: 'Each section has its own public feed, which your audience can follow separately' },
            { title: 'Feed index', body: 'A table lists each section with its broadcast channel and its feed' },
            { title: 'Forum view', body: 'Articles are grouped by category then subcategory, like a forum' },
          ],
        },
        {
          h2: 'The public RSS feed',
          body: 'The feed is generated from published articles. Your members, or anyone, can subscribe with Feedly, Inoreader or any other RSS reader. Copy its link from the dashboard. A draft never shows up in the feed',
        },
        {
          h2: 'Writing a good announcement',
          body: 'A useful announcement reads in ten seconds',
          points: [
            'Put the key information in the title: “Maintenance Saturday at 9 pm” rather than “Important announcement”',
            'Use the short summary for the quick version, and the body for the details',
            'One category per type of message: members choose what they follow',
            'Reread the draft in the preview before publishing, especially links and mentions',
          ],
        },
      ],
      faq: [
        {
          q: 'How do I make announcements on Discord with an RSS feed?',
          a: 'With Kotbo, write the article in the News page of the dashboard, pair its category with a Discord channel, and publish. Published articles feed a public RSS feed',
        },
        {
          q: 'Can I prepare an announcement in advance?',
          a: 'Yes, an article stays a draft until you publish it. It shows neither on Discord nor in the RSS feed',
        },
        {
          q: 'Can announcements go to several channels?',
          a: 'Yes, each section, meaning a category or a subcategory, has its own broadcast channel',
        },
        {
          q: 'What format should the content use?',
          a: 'Markdown, with a live preview while you write',
        },
        {
          q: 'How do my members follow the RSS feed?',
          a: 'They copy the feed’s link into an RSS reader such as Feedly or Inoreader',
        },
        {
          q: 'Can I publish a patch note separately from other announcements?',
          a: 'Yes, Patch note is its own category, which can have its own channel and feed',
        },
      ],
    },
  },
};
