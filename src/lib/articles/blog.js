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
 * @typedef {{ title?: string, h1: string, description: string, lead: string, teaser?: string, sections: BlogSection[], faq?: { q: string, a: string }[] }} BlogText
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
    slug: 'aegisai-espace-developpeur-discord-organisations',
    date: '2026-11-25',
    author: 'Klaynight',
    text: {
      fr: {
        h1: 'AegisAI : connexion Discord, demandes de clés par MP, organisations et bêta gratuite',
        description:
          'AegisAI passe à la connexion Discord unique, ajoute les demandes de clés avec notification en MP, les organisations, les managers de clés, les statistiques par portée et l’offre bêta gratuite.',
        teaser: 'AegisAI : connexion Discord, clés par MP, organisations et bêta gratuite',
        lead: 'Jusqu’ici, il fallait déjà avoir un token de bot pour ouvrir l’espace développeur d’AegisAI. C’est terminé : tout le monde se connecte désormais avec Discord, demande sa clé depuis le dashboard et suit son usage par organisation',
        sections: [
          {
            h2: 'Tout passe par la connexion Discord',
            body: 'L’ancienne connexion par clé API sur le portail est supprimée. Tu te connectes en un clic avec ton compte Discord sur aegisai.kotbo.fr/portal, aussi bien pour tester et gérer tes clés que pour l’administration',
            points: [
              'Une seule session unifiée pour l’espace développeur et l’administration selon tes droits Discord',
              'Redirection automatique vers la page demandée après connexion',
              'Plus de token brut à taper dans un formulaire de connexion',
            ],
          },
          {
            h2: 'Demander une clé et être prévenu en MP Discord',
            body: 'Si tu n’as pas encore de clé API, tu en fais la demande directement dans l’onglet Clés API du dashboard en indiquant le nom de ton bot, l’usage prévu et, si tu veux, une organisation',
            steps: [
              { title: 'Autorise les messages privés', body: 'Sur la page de connexion ou dans tes préférences, active l’option pour recevoir un MP Discord quand ta clé est prête. Cela t’ajoute au serveur Discord commun si tes MP sont fermés aux inconnus' },
              { title: 'Soumets ta demande', body: 'Ton dossier part dans la file de validation des administrateurs avec tes coordonnées Discord et ton nom de bot' },
              { title: 'Reçois le lien en MP', body: 'Dès que la demande est validée, le bot AegisAI t’envoie un message privé avec un lien direct vers la clé sur ton espace membre. Une notification interne reste visible sur le site si tes MP restent bloqués' },
              { title: 'Révèle ton token une seule fois', body: 'Le secret n’est jamais envoyé en clair dans Discord. Tu le révèles une seule fois depuis le site, et tu peux le régénérer à tout moment en cas de perte' },
            ],
          },
          {
            h2: 'Organisations, managers et statistiques dédiées',
            body: 'Un bot est rarement géré par une seule personne sur la durée. Le nouvel espace membre te laisse organiser tes accès sans partager ton token principal à l’aveugle',
            items: [
              { title: 'Organisations', body: 'Regroupe plusieurs clés sous une même équipe et invite des membres par identifiant Discord avec le rôle owner, admin ou member' },
              { title: 'Managers par clé', body: 'Ajoute un collaborateur sur une clé précise en tant que manager (stats, rotation, révocation) ou viewer (lecture seule des statistiques)' },
              { title: 'Statistiques filtrées', body: 'Le graphique d’usage se filtre sur toutes tes clés, sur une organisation entière ou sur un seul bot, avec des chiffres réels mis à jour en direct' },
              { title: 'Rotation et révocation', body: 'Tu crées une nouvelle clé sur un bot ou tu coupes un token compromis directement depuis le dashboard' },
            ],
          },
          {
            h2: 'Bêta gratuite et socle pour la suite',
            body: 'Un onglet Facturation fait son apparition dans le dashboard avec le détail de l’offre Bêta gratuite : aucune carte bancaire demandée et une limite par défaut de 60 requêtes par minute par clé. Les plans payants viendront après la bêta, sans coupure surprise pour les clés existantes. La référence complète des routes, exemples et codes HTTP est centralisée sur kotbo.fr/docs/aide/aegisai-api',
          },
        ],
        faq: [
          {
            q: 'Peut-on encore se connecter avec un token API sur le portail ?',
            a: 'Non. La connexion par clé est retirée : tout passe par la connexion Discord OAuth2',
          },
          {
            q: 'Mon token est-il envoyé en clair dans le MP Discord ?',
            a: 'Non. Le MP contient uniquement la confirmation et un lien direct vers ton tableau de bord, où le token s’affiche une seule fois',
          },
          {
            q: 'Que se passe-t-il si mes MP Discord sont fermés ?',
            a: 'L’acceptation crée toujours une notification visible dans ton espace membre dès ta connexion au site, et les administrateurs peuvent relancer l’envoi du MP plus tard',
          },
          {
            q: 'L’API AegisAI est-elle payante pendant la bêta ?',
            a: 'Non. L’offre Bêta gratuite ne demande aucune carte bancaire',
          },
        ],
      },
      en: {
        h1: 'AegisAI: Discord login, DM key delivery, organisations and free beta',
        description:
          'AegisAI moves to Discord-only login, adds API key requests with Discord DM notifications, organisations, key managers, scoped stats and a Free Beta tier.',
        teaser: 'AegisAI: Discord login, DM key delivery, organisations and free beta',
        lead: 'Until now, you already needed a bot token just to open the AegisAI developer space. That is over: everyone now signs in with Discord, requests keys from the dashboard and tracks usage by organisation',
        sections: [
          {
            h2: 'Everything goes through Discord login',
            body: 'The old API-key login form on the portal is gone. You sign in with one click using Discord at aegisai.kotbo.fr/portal, whether you manage your own keys or administer the platform',
            points: [
              'One unified session for the developer dashboard and admin views based on your Discord permissions',
              'Automatic redirect back to the requested page after sign-in',
              'No raw bot token to paste into a login box',
            ],
          },
          {
            h2: 'Request a key and get notified by Discord DM',
            body: 'If you do not have an API key yet, submit a request from the API keys tab with your bot name, intended use and an optional organisation',
            steps: [
              { title: 'Allow direct messages', body: 'On the sign-in screen or in your preferences, tick the Discord DM option so the bot can message you when your key is ready. This adds permission to join the shared Discord server if your DMs are closed to strangers' },
              { title: 'Send your request', body: 'Your request enters the team review queue with your Discord profile and bot details' },
              { title: 'Get the direct link by DM', body: 'As soon as an administrator approves it, the AegisAI bot sends a DM linking straight to your key in the dashboard. An in-app alert is also created in case your DMs are blocked' },
              { title: 'Reveal your token once', body: 'The raw secret is never sent in plain text over Discord. You reveal it once on the website, and you can rotate the key at any time if it gets lost' },
            ],
          },
          {
            h2: 'Organisations, managers and scoped stats',
            body: 'A bot is rarely maintained by a single person forever. The updated dashboard lets you share access without handing out your root secret blindly',
            items: [
              { title: 'Organisations', body: 'Group several keys under a shared team workspace and invite members by Discord ID with the owner, admin or member role' },
              { title: 'Per-key managers', body: 'Assign a teammate on a single key as a manager (stats, rotation, revocation) or viewer (read-only stats)' },
              { title: 'Scoped statistics', body: 'Filter usage charts across all your keys, a single organisation or one bot, using real live metrics' },
              { title: 'Key rotation and revocation', body: 'Issue a replacement token or revoke a leaked key straight from the dashboard' },
            ],
          },
          {
            h2: 'Free beta and billing foundation',
            body: 'A Billing tab now appears in the dashboard showing the active Free Beta plan: no credit card required and a default 60 requests per minute limit per key. Paid tiers will follow after the beta without cutting off existing keys overnight. Full endpoint specs, code samples and status codes live at kotbo.fr/docs/en/aide/aegisai-api',
          },
        ],
        faq: [
          {
            q: 'Can I still sign in to the portal with an API key?',
            a: 'No. API-key login has been removed; authentication uses Discord OAuth2 only',
          },
          {
            q: 'Is my raw token sent in plain text in the Discord DM?',
            a: 'No. The DM only contains confirmation and a direct link to your dashboard, where the token is revealed once',
          },
          {
            q: 'What if my Discord DMs are closed?',
            a: 'Approval always creates an unread notification inside your dashboard, and administrators can also resend the DM later',
          },
          {
            q: 'Do I have to pay for the AegisAI API during the beta?',
            a: 'No. The Free Beta plan requires no credit card',
          },
        ],
      },
    },
  },
  {
    slug: 'kotbo-10-0',
    date: '2026-11-20',
    author: 'Klaynight',
    modules: ['seasons', 'reputation', 'drops', 'leveling'],
    text: {
      fr: {
        h1: 'Kotbo 10.0 : ton bot et ton domaine, les tags de serveur, des modules de communauté refaits',
        description:
          'Kotbo 10.0 : ton propre bot et ton domaine, l’automod des tags de serveur, Réputation, Saisons, Suggestions, Starlight et Drops refaits, import des niveaux depuis MEE6 ou DraftBot, dashboard accessible.',
        teaser: 'Kotbo 10.0 : ton bot, ton domaine, les tags de serveur et l’import de tes niveaux',
        lead: 'Kotbo 10.0 donne à ton serveur sa propre identité : tu peux lancer ton bot sous ton nom, servir ton dashboard sur ton domaine et suivre l’effet de ton tag de serveur. Réputation, Saisons, Suggestions, Starlight et Drops sont refaits, et tu reprends tes niveaux depuis MEE6 ou DraftBot',
        sections: [
          {
            h2: 'Ton bot et ton domaine',
            body: 'La page Identité du dashboard règle le profil de Kotbo chez toi, ou lance ton propre bot. Ces options font partie de l’offre Plus',
            items: [
              { title: 'Le profil de Kotbo chez toi', body: 'Tu choisis le nom, la photo et la bannière que ton serveur voit, importées depuis ton ordinateur ou par un lien' },
              { title: 'Ton propre bot', body: 'Tu colles le jeton d’une application créée sur le portail développeur de Discord, et Kotbo la lance. Ton bot ne reste que sur ton serveur, et tu peux revenir au bot Kotbo quand tu veux' },
              { title: 'Ton domaine', body: 'Ton dashboard s’ouvre sur ton adresse, et seulement pour ton serveur' },
            ],
            points: ['Si ton serveur quitte l’offre Plus, ton bot perso s’arrête'],
          },
          {
            h2: 'Tags de serveur : les suivre, les protéger, les mesurer',
            body: 'Les tags de serveur Discord s’affichent à côté des pseudos. Kotbo les prend en charge de bout en bout',
            items: [
              { title: 'Un automod dédié', body: 'Dans Filtres, onglet Tags, tes règles s’appliquent à l’arrivée d’un membre et à son changement de tag. Kotbo repère les tags qui imitent le tien et met en quarantaine quand une vague de membres arrive avec le même' },
              { title: 'L’effet de ton tag', body: 'La carte « Le tag amène-t-il des membres ? » d’Analytics estime son effet sur les arrivées, à partir d’un relevé chaque soir de ses porteurs' },
              { title: 'Une fiche par serveur', body: 'Chiffres clés, profil public, invitation et porteurs du tag sur une seule fiche, qui s’ouvre d’un clic depuis un tag' },
            ],
            points: ['Le tag apparaît à côté des membres dans les invitations, les niveaux, les tickets et les listes de membres'],
          },
          {
            h2: 'Réputation, Saisons, Suggestions, Starlight, Drops : tout est refait',
            body: 'Ces modules ont maintenant le même confort : une page claire, des réglages par serveur, des récompenses et des conseils quand quelque chose bloque',
            items: [
              { title: 'Réputation', body: 'Des rôles à partir de certains paliers, avec une annonce. Un remerciement peut rapporter de l’XP et des pièces, et se donner par réaction. Des garde-fous évitent les abus et le staff peut ajuster un score' },
              { title: 'Saisons', body: 'Le classement compte l’XP gagnée pendant la période, sans remettre les niveaux à zéro. Récompenses, paliers et annonces se règlent, et chaque fin de saison a son bilan et son palmarès' },
              { title: 'Suggestions', body: 'Tu peux revenir sur une décision, récompenser l’auteur d’une idée retenue, créer des catégories et fixer un seuil de votes' },
              { title: 'Starlight', body: 'Une galerie réunit les messages à la une. Tu récompenses les auteurs, tu exclus des membres et tu règles un seuil par salon' },
              { title: 'Drops', body: 'Un drop peut attendre que son salon soit actif. Les jackpots font gagner un multiple du montant un drop sur N, et des règles de ramassage fixent plafond, ancienneté ou rôle requis' },
              { title: 'Salons fun', body: 'Les jeux se règlent en tuiles qu’il suffit d’activer, et le quiz se joue aussi sur le web' },
            ],
          },
          {
            h2: 'Reprendre tes niveaux',
            body: 'Tu changes de bot de niveaux ? Tes membres gardent leur progression',
            items: [
              { title: 'Quatre sources', body: 'MEE6, DraftBot, Lurkr et Tatsu s’importent depuis la page Niveaux', link: { feature: 'leveling', label: 'Lire l’article sur les niveaux' } },
              { title: 'Lecture par IA', body: 'Tu peux aussi donner une capture d’écran ou un texte de classement : une IA le lit et le convertit' },
            ],
            points: ['Le classement public des niveaux est fermé à l’aspiration, pour que personne ne copie ton classement'],
          },
          {
            h2: 'Suivi des boosts',
            body: 'Un badge s’affiche à côté du pseudo des boosters, dans leur fiche et sur leur profil public. L’onglet Boosts montre la courbe, la liste des boosters et un journal, calcule les avantages que ton serveur débloque, et Kotbo te prévient quand un boost se perd',
          },
          {
            h2: 'Un dashboard accessible, et en deux langues',
            body: 'Le dashboard suit les règles du référentiel d’accessibilité RGAA',
            points: [
              'Focus visible, champs étiquetés, fenêtres pilotables au clavier',
              'Graphiques accompagnés d’un tableau de données, contrastes renforcés',
              'Changement de langue sans recharger la page',
              'Commandes en anglais, et textes envoyés sur Discord dans la langue de ton serveur',
            ],
          },
          {
            h2: 'Et aussi',
            body: 'Le reste de la version',
            points: [
              'Accueil du dashboard : cinq nouveaux blocs (Pulse, Shield, mes tâches, boosts, climat) et une barre latérale redimensionnable',
              'Modération : emojis, stickers et emojis d’un autre serveur interdits, plus d’images d’arnaque reconnues par Kotbo Vision, compteur de comptes piégés du honeypot',
              'Kotbo × AegisAI réentraîné sur 157 074 messages, 97,5 % de précision : un modèle quatre fois plus léger, environ 7 ms par message',
              'Fiche membre : historique de l’identité du membre',
              'Facturation : transfert de l’abonnement vers un autre serveur',
              'Aperçus de liens : un module gratuit qui affiche des cartes pour GitHub, X, TikTok et Steam',
              'Commande /regle pour citer un article du règlement par son numéro ou son titre',
              'Ponts entre serveurs : le trafic de chaque pont est compté et affiché',
              'Vocaux temporaires : chaque membre règle son salon et sa visibilité',
              'Daily Algo et Partenariats sont retirés de Kotbo',
            ],
          },
        ],
        faq: [
          {
            q: 'Le bot perso et le domaine perso sont-ils gratuits ?',
            a: 'Non. Ils font partie de l’offre Plus, et le bot perso s’arrête si le serveur la quitte',
          },
          {
            q: 'Quels bots de niveaux puis-je importer ?',
            a: 'MEE6, DraftBot, Lurkr et Tatsu, ou une capture d’écran ou un texte de classement lus par IA',
          },
          {
            q: 'Où sont les réglages des tags de serveur ?',
            a: 'Dans Filtres, onglet Tags, pour l’automod, et dans Analytics, pour l’effet du tag sur les arrivées',
          },
        ],
      },
      en: {
        h1: 'Kotbo 10.0: your own bot and domain, server tags, rebuilt community modules',
        description:
          'Kotbo 10.0: your own bot and domain, server tag automod, rebuilt Reputation, Seasons, Suggestions, Starlight and Drops, level import from MEE6 or DraftBot, an accessible dashboard.',
        teaser: 'Kotbo 10.0: your own bot, your domain, server tags and level import',
        lead: 'Kotbo 10.0 gives your server its own identity: run your bot under your name, serve your dashboard on your domain and track what your server tag does. Reputation, Seasons, Suggestions, Starlight and Drops are rebuilt, and you can bring your levels over from MEE6 or DraftBot',
        sections: [
          {
            h2: 'Your bot and your domain',
            body: 'The dashboard’s Identity page sets Kotbo’s profile on your server, or launches your own bot. These options are part of the Plus plan',
            items: [
              { title: 'Kotbo’s profile on your server', body: 'You pick the name, photo and banner your server sees, imported from your computer or by link' },
              { title: 'Your own bot', body: 'You paste the token of an application created on Discord’s developer portal, and Kotbo launches it. Your bot stays on your server only, and you can switch back to the Kotbo bot whenever you want' },
              { title: 'Your domain', body: 'Your dashboard opens on your address, and only for your server' },
            ],
            points: ['If your server leaves the Plus plan, your custom bot stops'],
          },
          {
            h2: 'Server tags: follow them, protect them, measure them',
            body: 'Discord server tags show next to usernames. Kotbo now handles them end to end',
            items: [
              { title: 'A dedicated automod', body: 'In Filters, Tags tab, your rules apply when a member joins and when they change tag. Kotbo spots tags that imitate yours and quarantines when a wave of members arrives with the same one' },
              { title: 'What your tag does', body: 'The “Does the tag bring members?” card in Analytics estimates its effect on joins, from a nightly count of its holders' },
              { title: 'One profile per server', body: 'Key figures, public profile, invite and tag holders on a single profile, one click away from any tag' },
            ],
            points: ['The tag shows next to members in invites, levels, tickets and member lists'],
          },
          {
            h2: 'Reputation, Seasons, Suggestions, Starlight, Drops: all rebuilt',
            body: 'These modules now share the same comfort: a clear page, per-server settings, rewards and hints when something is stuck',
            items: [
              { title: 'Reputation', body: 'Roles from certain tiers, with an announcement. A thank-you can earn XP and coins, and be given with a reaction. Safeguards prevent abuse and staff can adjust a score' },
              { title: 'Seasons', body: 'The ranking counts the XP earned during the period, without resetting levels. Rewards, tiers and announcements are configurable, and every season ends with a recap and a hall of fame' },
              { title: 'Suggestions', body: 'You can revisit a decision, reward the author of an accepted idea, create categories and set a vote threshold' },
              { title: 'Starlight', body: 'A gallery gathers the highlighted messages. You reward authors, exclude members and set a threshold per channel' },
              { title: 'Drops', body: 'A drop can wait until its channel is active. Jackpots pay a multiple of the amount one drop in N, and pickup rules set a cap, an account age or a required role' },
              { title: 'Fun channels', body: 'Games are set up with tiles you just switch on, and the quiz can also be played on the web' },
            ],
          },
          {
            h2: 'Bring your levels over',
            body: 'Switching leveling bots? Your members keep their progress',
            items: [
              { title: 'Four sources', body: 'MEE6, DraftBot, Lurkr and Tatsu import from the Levels page', link: { feature: 'leveling', label: 'Read the leveling article' } },
              { title: 'AI reading', body: 'You can also hand over a screenshot or the text of a leaderboard: an AI reads and converts it' },
            ],
            points: ['The public levels leaderboard is closed to scraping, so nobody copies your ranking'],
          },
          {
            h2: 'Boost tracking',
            body: 'A badge shows next to boosters’ names, in their profile and on their public profile. The Boosts tab shows the curve, the list of boosters and a log, works out the perks your server unlocks, and Kotbo warns you when a boost is lost',
          },
          {
            h2: 'An accessible dashboard, in two languages',
            body: 'The dashboard follows the RGAA accessibility framework',
            points: [
              'Visible focus, labelled fields, dialogs you can drive from the keyboard',
              'Charts that come with a data table, stronger contrast',
              'Language switch without reloading the page',
              'Commands in English, and texts sent on Discord in your server’s language',
            ],
          },
          {
            h2: 'Also in this release',
            body: 'The rest of the version',
            points: [
              'Dashboard home: five new blocks (Pulse, Shield, my tasks, boosts, climate) and a resizable sidebar',
              'Moderation: emojis, stickers and another server’s emojis can be banned, more scam images recognised by Kotbo Vision, a honeypot trapped-account counter',
              'Kotbo × AegisAI retrained on 157,074 messages, 97.5% accuracy: a model four times lighter, about 7 ms per message',
              'Member profile: the member’s identity history',
              'Billing: transfer your subscription to another server',
              'Link previews: a free module that shows cards for GitHub, X, TikTok and Steam',
              'A new command quotes a rules article by number or title',
              'Cross-server bridges: each bridge’s traffic is counted and shown',
              'Temporary voice channels: each member sets their own channel and its visibility',
              'Daily Algo and Partnerships are removed from Kotbo',
            ],
          },
        ],
        faq: [
          {
            q: 'Are the custom bot and custom domain free?',
            a: 'No. They are part of the Plus plan, and the custom bot stops if the server leaves it',
          },
          {
            q: 'Which leveling bots can I import?',
            a: 'MEE6, DraftBot, Lurkr and Tatsu, or a screenshot or text of a leaderboard read by AI',
          },
          {
            q: 'Where are the server tag settings?',
            a: 'In Filters, Tags tab, for the automod, and in Analytics, for the tag’s effect on joins',
          },
        ],
      },
    },
  },
  {
    slug: 'organigramme-staff',
    date: '2026-11-07',
    author: 'Klaynight',
    modules: ['staff_roles'],
    text: {
      fr: {
        h1: 'L’organigramme du staff refait : trois vues, réorganisable, exportable',
        description:
          'L’organigramme du staff de Kotbo se lit par hiérarchie, par pôle ou par grade, se réorganise à la souris et s’exporte en PNG, SVG ou Excel.',
        lead: 'L’organigramme de la gestion du staff a été réécrit. Il se lit de trois façons, se réorganise en glissant les cartes, et sort en image ou en tableau pour être partagé',
        sections: [
          {
            h2: 'Trois façons de lire ton équipe',
            body: 'Un sélecteur change ce que montre l’organigramme, un autre la façon de l’afficher',
            items: [
              { title: 'Hiérarchie', body: 'Les pôles rattachés les uns aux autres, avec leurs grades et leurs membres' },
              { title: 'Par pôle', body: 'Chaque pôle à plat, avec ses grades' },
              { title: 'Par grade', body: 'Les membres rangés par grade, tous pôles confondus' },
            ],
            points: ['Affichage en arbre, à l’horizontale ou en plan', 'Un clic sur un membre ouvre sa fiche'],
          },
          {
            h2: 'Réorganiser en glissant',
            body: 'Le bouton Réorganiser passe l’organigramme en édition, pour ceux qui ont le droit de le modifier',
            points: [
              'Glisse un pôle sur un autre pour le rattacher, ou sur son bord pour le placer à côté',
              'Glisse un grade vers un autre pôle',
              'Glisse un membre vers un grade',
              'Sans souris, chaque carte a un menu Déplacer : placer avant, après, rattacher à un pôle, changer de grade',
            ],
          },
          {
            h2: 'Un changement de grade dit ce qu’il fait',
            body: 'Avant de passer un membre à un autre grade, Kotbo demande confirmation et rappelle les conséquences : ses rôles Discord de grade sont mis à jour, et ceux qu’il avait dans ses autres pôles sont retirés',
          },
          {
            h2: 'Exporter l’organigramme',
            body: 'Le bouton Exporter sort l’organigramme tel qu’il est affiché',
            items: [
              { title: 'Image PNG', body: 'À poster sur Discord' },
              { title: 'Image SVG', body: 'Nette à toutes les tailles' },
              { title: 'Tableau Excel', body: 'Une ligne par membre : pôle, pôle parent, grade, membre et identifiant Discord' },
            ],
          },
        ],
        faq: [
          {
            q: 'Où se trouve l’organigramme ?',
            a: 'Dans la gestion du staff du dashboard, sur la page de la hiérarchie',
          },
          {
            q: 'Est-il dans l’offre gratuite ?',
            a: 'Non. La hiérarchie du staff fait partie de l’offre complète. L’annuaire du staff, lui, reste gratuit',
          },
          {
            q: 'Qui peut réorganiser ?',
            a: 'Les membres qui ont le droit de modifier la hiérarchie. Les autres voient l’organigramme sans pouvoir le changer',
          },
        ],
      },
      en: {
        h1: 'The staff org chart, rebuilt: three views, rearrangeable, exportable',
        description:
          'Kotbo’s staff org chart reads by hierarchy, by team or by rank, rearranges with the mouse and exports to PNG, SVG or Excel.',
        lead: 'The staff management org chart has been rewritten. It reads three ways, rearranges by dragging cards, and comes out as an image or a spreadsheet to share',
        sections: [
          {
            h2: 'Three ways to read your team',
            body: 'One selector changes what the org chart shows, another how it is laid out',
            items: [
              { title: 'Hierarchy', body: 'Teams nested under each other, with their ranks and members' },
              { title: 'By team', body: 'Each team flat, with its ranks' },
              { title: 'By rank', body: 'Members grouped by rank, across all teams' },
            ],
            points: ['Tree, horizontal or outline layout', 'Clicking a member opens their profile'],
          },
          {
            h2: 'Rearrange by dragging',
            body: 'The Rearrange button puts the org chart in edit mode, for those allowed to change it',
            points: [
              'Drop a team on another to nest it, or on its edge to place it alongside',
              'Drag a rank to another team',
              'Drag a member to a rank',
              'Without a mouse, each card has a Move menu: place before, after, nest under a team, change rank',
            ],
          },
          {
            h2: 'A rank change says what it does',
            body: 'Before moving a member to another rank, Kotbo asks for confirmation and spells out the effects: their Discord rank roles are updated, and the ones they held in their other teams are removed',
          },
          {
            h2: 'Export the org chart',
            body: 'The Export button outputs the org chart as displayed',
            items: [
              { title: 'PNG image', body: 'To post on Discord' },
              { title: 'SVG image', body: 'Sharp at any size' },
              { title: 'Excel sheet', body: 'One row per member: team, parent team, rank, member and Discord ID' },
            ],
          },
        ],
        faq: [
          {
            q: 'Where is the org chart?',
            a: 'In the dashboard’s staff management, on the hierarchy page',
          },
          {
            q: 'Is it in the free plan?',
            a: 'No. Staff hierarchy is part of the full plan. The staff directory stays free',
          },
          {
            q: 'Who can rearrange it?',
            a: 'Members allowed to edit the hierarchy. Everyone else sees the org chart without being able to change it',
          },
        ],
      },
    },
  },
  {
    slug: 'automatisations-tester-et-corriger',
    date: '2026-11-07',
    author: 'Klaynight',
    modules: ['workflows'],
    text: {
      fr: {
        h1: 'Automatisations : les tester avant de les allumer, et comprendre pourquoi elles échouent',
        description:
          'Les automatisations de Kotbo gagnent un essai à blanc, un rejeu lisible qui mène à l’étape à corriger, des alertes d’échec, des compteurs, des délais et de nouveaux déclencheurs.',
        lead: 'Une automatisation qui échoue en silence, c’est pire que pas d’automatisation. Cette série de mises à jour fait qu’une automatisation se teste avant de tourner, prévient quand elle casse, et montre où la corriger',
        sections: [
          {
            h2: 'Tester sans rien casser',
            body: 'Le bouton Tester lance un essai à blanc du brouillon. Les lectures sont réelles, les actions sont seulement consignées, les attentes sont franchies',
            points: [
              'Tu choisis le membre qui joue l’événement, et l’essai se relance aussitôt',
              'L’essai vérifie les mêmes permissions que la vraie exécution, et échoue sur la bonne étape avec la bonne raison',
              'Il ne réserve aucun délai et n’écrit aucun compteur',
            ],
          },
          {
            h2: 'Prévenu avant, prévenu après',
            body: 'À l’enregistrement, Kotbo signale ce qu’il sait déjà : module éteint, permission manquante dans un salon choisi, rôle hors de portée du bot, salon ou rôle supprimé. L’enregistrement passe quand même, chaque avertissement mène à son étape',
            points: [
              'Au premier échec d’une série, le créateur de l’automatisation est prévenu dans le dashboard, et en message privé s’il l’a demandé',
              'Une erreur nomme la permission qui manque, au lieu du message brut de Discord',
            ],
          },
          {
            h2: 'Un rejeu qui se lit',
            body: 'Le rejeu d’une exécution liste les étapes parcourues avec leur statut, et montre ce que chacune a fait : le message rendu comme sur Discord, ou une phrase pour un rôle donné ou retiré. Sur un échec, Corriger dans l’éditeur ouvre l’éditeur sur l’étape fautive',
          },
          {
            h2: 'Ce qu’une automatisation sait faire de plus',
            items: [
              { title: 'Au plus une fois toutes les…', body: 'Un délai de récupération par membre, par salon ou pour le serveur' },
              { title: 'Compteurs', body: 'Des variables qui se gardent d’une exécution à l’autre, par membre ou pour le serveur : ajouter, définir, comparer' },
              { title: 'Tenir un message à jour', body: 'Publié au premier passage, modifié ensuite, republié s’il a été supprimé' },
              { title: 'Ancienneté et inactivité', body: 'Deux déclencheurs : un membre atteint une ancienneté, ou n’écrit plus depuis un nombre de jours. Allumer l’un d’eux ne rattrape pas tous les anciens membres d’un coup' },
            ],
            body: 'De nouvelles étapes et deux nouveaux déclencheurs',
          },
          {
            h2: 'Plus simple à démarrer',
            body: 'Le choix du déclencheur et des actions se cherche au mot près, sans tenir compte des accents ni des majuscules. Une liste vide propose directement les modèles, et l’éditeur prévient avant de quitter avec des modifications non enregistrées',
          },
        ],
        faq: [
          {
            q: 'Les automatisations sont-elles dans l’offre gratuite ?',
            a: 'Oui, les déclencheurs font partie de l’offre gratuite',
          },
          {
            q: 'Un essai à blanc peut-il envoyer un message ou donner un rôle ?',
            a: 'Non. Il lit les vraies données du serveur mais ne fait que noter ce que chaque action aurait fait',
          },
          {
            q: 'Le déclencheur d’inactivité va-t-il viser tous mes anciens membres d’un coup ?',
            a: 'Non. Son premier passage pose seulement un repère, il n’y a pas de rattrapage massif',
          },
        ],
      },
      en: {
        h1: 'Automations: test them before switching them on, and see why they fail',
        description:
          'Kotbo automations get a dry run, a readable replay that leads to the step to fix, failure alerts, counters, cooldowns and new triggers.',
        lead: 'An automation that fails silently is worse than none. This round of updates means an automation can be tested before it runs, warns you when it breaks, and shows you where to fix it',
        sections: [
          {
            h2: 'Test without breaking anything',
            body: 'The Test button runs a dry run of the draft. Reads are real, actions are only logged, waits are skipped',
            points: [
              'You pick the member who plays the event, and the test reruns right away',
              'The test checks the same permissions as a real run, and fails on the right step for the right reason',
              'It reserves no cooldown and writes no counter',
            ],
          },
          {
            h2: 'Warned before, warned after',
            body: 'On save, Kotbo flags what it already knows: module off, missing permission in a chosen channel, role out of the bot’s reach, deleted channel or role. The save still goes through, each warning links to its step',
            points: [
              'On the first failure in a row, the automation’s creator is notified in the dashboard, and by DM if they asked for it',
              'An error names the missing permission, instead of Discord’s raw message',
            ],
          },
          {
            h2: 'A replay you can read',
            body: 'A run’s replay lists the steps it went through with their status, and shows what each did: the message rendered as on Discord, or a sentence for a role given or removed. On a failure, Fix in editor opens the editor on the faulty step',
          },
          {
            h2: 'What an automation can do now',
            body: 'New steps and two new triggers',
            items: [
              { title: 'At most once every…', body: 'A cooldown per member, per channel or for the server' },
              { title: 'Counters', body: 'Variables kept from one run to the next, per member or for the server: add, set, compare' },
              { title: 'Keep a message updated', body: 'Posted on the first run, edited after, reposted if it was deleted' },
              { title: 'Tenure and inactivity', body: 'Two triggers: a member reaches a tenure, or has not posted for a number of days. Switching one on does not catch up on every old member at once' },
            ],
          },
          {
            h2: 'Easier to start',
            body: 'Triggers and actions can be searched word by word, ignoring accents and case. An empty list shows the templates right away, and the editor warns you before leaving with unsaved changes',
          },
        ],
        faq: [
          {
            q: 'Are automations in the free plan?',
            a: 'Yes, triggers are part of the free plan',
          },
          {
            q: 'Can a dry run send a message or give a role?',
            a: 'No. It reads the server’s real data but only records what each action would have done',
          },
          {
            q: 'Will the inactivity trigger hit all my old members at once?',
            a: 'No. Its first pass only sets a marker, there is no mass catch-up',
          },
        ],
      },
    },
  },
  {
    slug: 'roles-a-boutons-refaits',
    date: '2026-11-07',
    author: 'Klaynight',
    modules: ['reaction_roles'],
    text: {
      fr: {
        h1: 'Les menus de rôles à boutons, refaits de la création au suivi',
        description:
          'Les menus de rôles à boutons de Kotbo : création en quatre étapes, modèles couleurs, pronoms et notifications, mode un seul rôle, nombre de membres sur les boutons, menus supprimés signalés.',
        lead: 'Les menus de rôles à boutons ont été repris de bout en bout : on en crée un en quatre étapes, on voit tout de suite ce qu’il donnera sur Discord, et Kotbo prévient quand quelque chose l’empêche de marcher',
        sections: [
          {
            h2: 'Créer un menu en quatre étapes',
            body: 'La fenêtre de création parle clair : un modèle, combien de rôles un membre peut prendre, les boutons, puis où publier',
            points: [
              'Trois modes : plusieurs rôles, un seul rôle, ou plusieurs rôles pour de bon',
              'Une ligne par bouton : emoji, texte, rôle. Un bouton sans texte prend le nom de son rôle',
              'Le texte du message et la couleur de la barre se règlent pour chaque menu',
              'Les boutons se réordonnent en glissant, ou au clavier avec les flèches',
              'Un aperçu Discord suit la saisie',
            ],
          },
          {
            h2: 'Des menus tout prêts',
            body: 'Couleurs, Pronoms et Notifications remplissent le formulaire en un clic. Les rôles qui manquent ne sont créés qu’à la publication, sans aucune permission. Fermer la fenêtre ne laisse aucun rôle derrière soi',
          },
          {
            h2: 'Un seul rôle à la fois',
            body: 'En mode un seul rôle, prendre un rôle retire les autres du menu, et recliquer sur le sien le retire. C’est le mode des couleurs de pseudo',
          },
          {
            h2: 'Kotbo prévient quand ça coince',
            items: [
              { title: 'Rôle bloqué', body: 'Le formulaire et la carte du menu signalent un rôle que le bot ne pourra pas donner : absent, permission manquante, ou rôle placé au-dessus du sien, avec la correction à faire' },
              { title: 'Message supprimé', body: 'Si le message d’un menu disparaît de Discord, le staff est prévenu et la carte propose Republier, qui le repose à l’identique' },
              { title: 'Rôle supprimé', body: 'Un rôle de menu supprimé sur Discord prévient le staff tout de suite' },
            ],
            body: 'Un menu qui ne donne plus de rôle sans que personne ne le sache, c’est fini',
          },
          {
            h2: 'Suivre ce que donnent tes menus',
            body: 'Chaque carte montre le menu tel que les membres le voient, avec le nombre de membres qui portent chaque rôle',
            points: [
              'Le nombre de membres peut aussi s’afficher sur les boutons eux-mêmes, et suit les rôles donnés à la main ou retirés par un autre bot',
              'Les logs disent quel menu a donné ou retiré un rôle',
              'Un onglet Rôles par réaction dans Analytics montre les prises et les retraits par jour et par rôle (offre complète)',
            ],
          },
        ],
        faq: [
          {
            q: 'Les menus de rôles sont-ils gratuits ?',
            a: 'Oui. Seul l’onglet Rôles par réaction d’Analytics demande l’offre complète',
          },
          {
            q: 'Un modèle peut-il créer un rôle avec des permissions ?',
            a: 'Non. Les rôles créés par un modèle n’ont aucune permission, et un rôle existant du même nom n’est repris que s’il n’en a pas non plus',
          },
          {
            q: 'Mes anciens menus continuent-ils de marcher ?',
            a: 'Oui. Les menus déjà en un seul rôle passent sur le nouveau mode, les autres ne changent pas',
          },
        ],
      },
      en: {
        h1: 'Button role menus, rebuilt from creation to tracking',
        description:
          'Kotbo’s button role menus: four-step creation, colour, pronoun and notification templates, single-role mode, member counts on buttons, deleted menus flagged.',
        lead: 'Button role menus have been reworked end to end: you create one in four steps, see straight away what it will look like on Discord, and Kotbo tells you when something stops it from working',
        sections: [
          {
            h2: 'Create a menu in four steps',
            body: 'The creation window speaks plainly: a template, how many roles a member can take, the buttons, then where to post',
            points: [
              'Three modes: several roles, a single role, or several roles for good',
              'One line per button: emoji, label, role. A button without a label takes its role’s name',
              'Message text and embed bar colour are set per menu',
              'Buttons reorder by dragging, or from the keyboard with the arrow keys',
              'A Discord preview follows what you type',
            ],
          },
          {
            h2: 'Ready-made menus',
            body: 'Colours, Pronouns and Notifications fill the form in one click. Missing roles are only created on publish, with no permissions at all. Closing the window leaves no role behind',
          },
          {
            h2: 'One role at a time',
            body: 'In single-role mode, taking a role removes the others in the menu, and clicking yours again removes it. It is the mode for name colours',
          },
          {
            h2: 'Kotbo warns you when it gets stuck',
            body: 'No more menus that quietly stop giving roles',
            items: [
              { title: 'Blocked role', body: 'The form and the menu card flag a role the bot cannot give: missing, lacking permission, or placed above the bot’s own, with the fix to make' },
              { title: 'Deleted message', body: 'If a menu’s message disappears from Discord, staff are notified and the card offers Repost, which puts it back as it was' },
              { title: 'Deleted role', body: 'A menu role deleted on Discord notifies staff right away' },
            ],
          },
          {
            h2: 'Track what your menus give out',
            body: 'Each card shows the menu as members see it, with the number of members holding each role',
            points: [
              'The member count can also show on the buttons themselves, and follows roles given by hand or removed by another bot',
              'Logs say which menu gave or removed a role',
              'A Reaction roles tab in Analytics shows roles taken and dropped per day and per role (full plan)',
            ],
          },
        ],
        faq: [
          {
            q: 'Are role menus free?',
            a: 'Yes. Only the Reaction roles tab in Analytics needs the full plan',
          },
          {
            q: 'Can a template create a role with permissions?',
            a: 'No. Roles created by a template have no permissions, and an existing role with the same name is only reused if it has none either',
          },
          {
            q: 'Do my old menus keep working?',
            a: 'Yes. Menus already set to a single role move to the new mode, the others do not change',
          },
        ],
      },
    },
  },
  {
    slug: 'kotbo-gratuit',
    date: '2026-11-01',
    author: 'Klaynight',
    text: {
      fr: {
        title: 'Kotbo gratuit : ce qui est inclus et ce qui reste payant',
        h1: 'Kotbo devient gratuit : ce qui est inclus, ce qui reste dans l’offre complète',
        description:
          'Kotbo a maintenant une offre gratuite sans limite de durée ni carte bancaire : modération, anti-raid, logs, accueil, tickets, niveaux, stats sur 7 jours. Le détail module par module, les limites, et ce que garde l’offre Plus.',
        teaser: 'Kotbo passe gratuit : modération, tickets, niveaux et stats sans abonnement ni carte',
        lead: 'Jusqu’ici, un serveur sans abonnement avait le bot mais aucun module. C’est fini : Kotbo a une offre gratuite, sans limite de durée et sans carte bancaire, qui couvre ce qu’un serveur attend d’un bot. Voici le détail, module par module, et ce qui reste dans l’offre complète',
        sections: [
          {
            h2: 'Ce qui change',
            body: 'Avant, sans abonnement, Kotbo restait sur ton serveur sans rien faire tourner. Maintenant, un serveur sans abonnement est en offre gratuite : près de trente modules s’allument depuis le dashboard, sans essai qui expire et sans carte à donner',
            points: [
              'Pas de limite de durée : l’offre gratuite ne s’arrête pas',
              'Pas de carte bancaire : rien à saisir pour l’utiliser',
              'Le même dashboard que l’offre complète : les modules payants y sont visibles, avec un cadenas',
            ],
          },
          {
            h2: 'Ce qui est gratuit, module par module',
            body: 'Tout ce que les autres bots donnent gratuitement, et un peu plus, réglé depuis le même dashboard',
            items: [
              {
                title: 'Modération et sécurité',
                body: 'Sanctions (avertissement, mute, exclusion, bannissement) avec historique, AutoMod, anti-raid, vérification à l’arrivée et modération des pseudos',
                link: { feature: 'automod', label: 'Lire l’article sur l’AutoMod' },
              },
              {
                title: 'Logs',
                body: 'Les journaux du serveur dans les salons de ton choix : messages supprimés ou modifiés, arrivées et départs, rôles, salons, sanctions',
                link: { feature: 'logs', label: 'Lire l’article sur les logs' },
              },
              {
                title: 'Accueil et contenu',
                body: 'Messages de bienvenue et de départ, règlement, rôles par réaction, créateur d’embeds, auto-réponses, auto-thread, actualités et flux RSS',
              },
              {
                title: 'Niveaux et XP',
                body: 'L’XP sur les messages et le vocal, le classement et les rôles de récompense',
                link: { feature: 'leveling', label: 'Lire l’article sur les niveaux' },
              },
              {
                title: 'Tickets',
                body: 'Des panneaux de tickets pour le support de ton serveur, avec leur suivi dans le dashboard',
                link: { feature: 'tickets', label: 'Lire l’article sur les tickets' },
              },
              {
                title: 'Communauté',
                body: 'Giveaways, événements et quiz, suggestions, Starlight pour mettre en avant les meilleurs messages, salons fun (comptage, histoire à un mot, nombre mystère)',
              },
              {
                title: 'Intégrations',
                body: 'Déclencheurs pour automatiser des actions, alertes YouTube et Twitch, rappel de bump',
              },
              {
                title: 'Stats',
                body: 'Analytics sur les 7 derniers jours, détaillé plus bas',
              },
              {
                title: 'L’annuaire du staff',
                body: 'La liste de ton équipe, rangée par grade. C’est la vitrine de la gestion du staff, le reste de la catégorie est dans l’offre complète',
              },
            ],
          },
          {
            h2: 'La sécurité ne sera jamais payante',
            body: 'Un serveur raidé parce qu’il n’avait pas payé, c’est un échec pour tout le monde. Sanctions, AutoMod, anti-raid, vérification et logs restent dans l’offre gratuite, et un test du code de Kotbo échoue si quelqu’un les en retire',
          },
          {
            h2: 'Les stats en gratuit : 7 jours d’historique',
            body: 'Analytics est ouvert en gratuit sur les 7 derniers jours. Assez pour voir ce qui se passe cette semaine sur ton serveur',
            points: [
              'Onglets ouverts : vue d’ensemble, messages, vocal, carte de chaleur, membres, croissance, modération',
              'Les autres onglets et les filtres par salon ou par rôle sont dans l’offre complète. Chaque onglet verrouillé a un lien vers le même onglet dans la démo',
              'Kotbo enregistre tout, même en gratuit : passer à l’offre complète ouvre l’historique déjà collecté, rien n’est à reconstruire',
            ],
          },
          {
            h2: 'Ce que garde l’offre complète',
            body: 'Ce qu’aucun bot gratuit ne fait. C’est là que Kotbo se distingue',
            items: [
              {
                title: 'Toute la gestion du staff',
                body: 'Hiérarchie et organigramme, recrutement, tutorat, réunions, absences, listes de suivi, sondages, discipline, évaluations',
              },
              {
                title: 'L’IA et la protection avancée',
                body: 'L’IA de modération AegisAI dans l’AutoMod, la détection des doubles comptes, les appels de bannissement',
                link: { feature: 'double_accounts', label: 'Lire l’article sur les doubles comptes' },
              },
              {
                title: 'Le site de ta communauté',
                body: 'Un site à l’adresse de ton serveur, avec wiki, blog et forum',
              },
              {
                title: 'L’engagement poussé',
                body: 'Saisons, prestige, clans, drops, économie et RPG, marché, quêtes, réputation',
              },
              {
                title: 'Piloter Kotbo depuis une IA, et le cross-serveur',
                body: 'Le serveur MCP pour gérer ton serveur depuis Claude, ChatGPT ou Gemini, et les modules qui relient plusieurs serveurs',
              },
              {
                title: 'Analytics complet',
                body: 'Tout l’historique, tous les onglets, et les filtres par salon et par rôle',
              },
            ],
          },
          {
            h2: 'Voir avant de payer',
            body: 'Sur une page staff verrouillée, le bouton Voir un exemple rempli ouvre la même page dans la démo publique, avec une équipe d’exemple. Les onglets Analytics verrouillés renvoient de la même façon vers la démo. Tu vois exactement ce que tu débloques avant de sortir ta carte',
          },
          {
            h2: 'Démarrer en gratuit',
            body: 'Trois minutes, sans carte',
            steps: [
              { title: 'Ajoute Kotbo à ton serveur', body: 'Depuis le bouton Ajouter à Discord du site' },
              { title: 'Suis le parcours de configuration', body: 'Le dashboard te demande quel salon sert à quoi et allume les premiers modules' },
              { title: 'Choisis Continuer en gratuit', body: 'À l’étape de l’offre. Tu pourras passer à l’offre complète plus tard, depuis la page Facturation' },
              { title: 'Allume ce dont tu as besoin', body: 'Les autres modules gratuits s’allument depuis la page Modules du dashboard' },
            ],
          },
          {
            h2: 'Un seul prix, pour tous les serveurs',
            body: 'L’offre complète s’appelle Plus et coûte le même prix pour tous les serveurs, petits ou grands : 5 € par mois, ou 30 € par an, hors taxes. Avec un code de parrainage donné par un autre serveur, elle s’essaie 15 jours, puis la première facture a 10 % de remise. Pour un partenariat ou une marque blanche, l’offre Sur mesure se discute par contact',
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
            q: 'L’anti-raid et l’AutoMod sont-ils vraiment gratuits ?',
            a: 'Oui, comme les sanctions, la vérification et les logs. Seule l’IA AegisAI, qui lit le ton des messages, est dans l’offre complète',
          },
          {
            q: 'Les stats sont-elles limitées en gratuit ?',
            a: 'Oui, à 7 jours d’historique et à sept onglets. Kotbo continue de tout enregistrer : l’offre complète ouvre l’historique déjà collecté',
          },
          {
            q: 'Faut-il une carte pour essayer l’offre complète ?',
            a: 'Oui. L’essai de 15 jours passe par un code de parrainage et par le paiement en ligne, qui demande une carte. L’offre gratuite, elle, n’en demande jamais',
          },
          {
            q: 'Mon serveur était déjà installé sans abonnement : que se passe-t-il ?',
            a: 'Les modules gratuits que tu avais allumés se mettent à tourner. Les autres s’allument depuis la page Modules du dashboard',
          },
          {
            q: 'Je suis déjà abonné : qu’est-ce qui change pour moi ?',
            a: 'Rien. Ton offre ouvre toujours tout le catalogue, au même prix. Si tu es sur Pro ou Ultimate, tu peux passer sur Plus depuis la page Facturation pour payer moins',
          },
          {
            q: 'Si j’arrête l’offre complète, je perds mes réglages ?',
            a: 'Non. Les modules payants se mettent en pause avec leurs réglages et leurs données, et repartent tels quels si tu te réabonnes',
          },
        ],
      },
      en: {
        title: 'Kotbo free plan: everything included, and what stays paid',
        h1: 'Kotbo goes free: what is included, what stays in the full plan',
        description:
          'Kotbo now has a free plan with no time limit and no credit card: moderation, anti-raid, logs, welcome, tickets, levels, 7-day stats. The details module by module, the limits, and what the Plus plan keeps.',
        teaser: 'Kotbo goes free: moderation, tickets, levels and stats with no subscription or card',
        lead: 'Until now, a server without a subscription had the bot but no module. Not anymore: Kotbo has a free plan, with no time limit and no credit card, covering what a server expects from a bot. Here are the details, module by module, and what stays in the full plan',
        sections: [
          {
            h2: 'What changes',
            body: 'Before, without a subscription, Kotbo sat on your server without running anything. Now, a server without a subscription is on the free plan: nearly thirty modules switch on from the dashboard, with no expiring trial and no card to hand over',
            points: [
              'No time limit: the free plan does not end',
              'No credit card: nothing to enter to use it',
              'The same dashboard as the full plan: paid modules are visible there, with a lock',
            ],
          },
          {
            h2: 'What is free, module by module',
            body: 'Everything other bots give away for free, and a bit more, set up from the same dashboard',
            items: [
              {
                title: 'Moderation and security',
                body: 'Sanctions (warn, mute, kick, ban) with history, AutoMod, anti-raid, join verification and nickname moderation',
                link: { feature: 'automod', label: 'Read the AutoMod article' },
              },
              {
                title: 'Logs',
                body: 'Server logs in the channels you pick: deleted or edited messages, joins and leaves, roles, channels, sanctions',
                link: { feature: 'logs', label: 'Read the logs article' },
              },
              {
                title: 'Welcome and content',
                body: 'Welcome and goodbye messages, rules, reaction roles, embed builder, auto-responses, auto-thread, news and RSS feeds',
              },
              {
                title: 'Levels and XP',
                body: 'XP from messages and voice, the leaderboard and reward roles',
                link: { feature: 'leveling', label: 'Read the levels article' },
              },
              {
                title: 'Tickets',
                body: 'Ticket panels for your server’s support, tracked from the dashboard',
                link: { feature: 'tickets', label: 'Read the tickets article' },
              },
              {
                title: 'Community',
                body: 'Giveaways, events and quizzes, suggestions, Starlight to highlight the best messages, fun channels (counting, one-word story, mystery number)',
              },
              {
                title: 'Integrations',
                body: 'Triggers to automate actions, YouTube and Twitch alerts, bump reminder',
              },
              {
                title: 'Stats',
                body: 'Analytics over the last 7 days, detailed below',
              },
              {
                title: 'The staff directory',
                body: 'Your team’s list, sorted by rank. It is the showcase of staff management, the rest of the category is in the full plan',
              },
            ],
          },
          {
            h2: 'Security will never be paid',
            body: 'A server raided because it did not pay is a failure for everyone. Sanctions, AutoMod, anti-raid, verification and logs stay in the free plan, and a test in Kotbo’s code fails if anyone removes them',
          },
          {
            h2: 'Free stats: 7 days of history',
            body: 'Analytics is open on the free plan over the last 7 days. Enough to see what is happening on your server this week',
            points: [
              'Open tabs: overview, messages, voice, heatmap, members, growth, moderation',
              'The other tabs and the per-channel or per-role filters are in the full plan. Each locked tab links to the same tab in the demo',
              'Kotbo records everything, even on the free plan: moving to the full plan opens the history already collected, nothing to rebuild',
            ],
          },
          {
            h2: 'What the full plan keeps',
            body: 'What no free bot does. This is where Kotbo stands apart',
            items: [
              {
                title: 'Full staff management',
                body: 'Hierarchy and org chart, recruitment, mentoring, meetings, time off, tracking lists, polls, discipline, reviews',
              },
              {
                title: 'AI and advanced protection',
                body: 'AegisAI moderation inside AutoMod, alt account detection, ban appeals',
                link: { feature: 'double_accounts', label: 'Read the alt accounts article' },
              },
              {
                title: 'Your community website',
                body: 'A site at your server’s address, with wiki, blog and forum',
              },
              {
                title: 'Advanced engagement',
                body: 'Seasons, prestige, clans, drops, economy and RPG, marketplace, quests, reputation',
              },
              {
                title: 'Run Kotbo from an AI, and cross-server',
                body: 'The MCP server to manage your server from Claude, ChatGPT or Gemini, and the modules that link several servers',
              },
              {
                title: 'Full Analytics',
                body: 'The whole history, every tab, and per-channel and per-role filters',
              },
            ],
          },
          {
            h2: 'See it before you pay',
            body: 'On a locked staff page, the Voir un exemple rempli button opens the same page in the public demo, with a sample team. Locked Analytics tabs link to the demo the same way. You see exactly what you unlock before taking out your card',
          },
          {
            h2: 'Start for free',
            body: 'Three minutes, no card',
            steps: [
              { title: 'Add Kotbo to your server', body: 'From the Add to Discord button on the site' },
              { title: 'Follow the setup flow', body: 'The dashboard asks which channel is for what and switches on the first modules' },
              { title: 'Pick Continue for free', body: 'At the plan step. You can move to the full plan later, from the Billing page' },
              { title: 'Switch on what you need', body: 'The other free modules switch on from the Modules page of the dashboard' },
            ],
          },
          {
            h2: 'One price, for every server',
            body: 'The full plan is called Plus and costs the same for every server, small or large: €5 a month, or €30 a year, excluding VAT. With a referral code from another server, it comes with a 15-day trial, then 10% off the first invoice. For a partnership or white label, the Custom plan is discussed by contact',
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
            q: 'Are anti-raid and AutoMod really free?',
            a: 'Yes, as are sanctions, verification and logs. Only the AegisAI model, which reads the tone of messages, is in the full plan',
          },
          {
            q: 'Are stats limited on the free plan?',
            a: 'Yes, to 7 days of history and seven tabs. Kotbo keeps recording everything: the full plan opens the history already collected',
          },
          {
            q: 'Do I need a card to try the full plan?',
            a: 'Yes. The 15-day trial goes through a referral code and online payment, which asks for a card. The free plan never does',
          },
          {
            q: 'My server was already set up without a subscription: what happens?',
            a: 'The free modules you had switched on start running. Switch on the others from the Modules page of the dashboard',
          },
          {
            q: 'I already subscribe: what changes for me?',
            a: 'Nothing. Your plan still opens the whole catalogue, at the same price. If you are on Pro or Ultimate, you can switch to Plus from the Billing page to pay less',
          },
          {
            q: 'If I stop the full plan, do I lose my settings?',
            a: 'No. Paid modules pause with their settings and data, and pick up as they were if you subscribe again',
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
        lead: 'AegisAI, l’IA créée par Marvideo qui note la toxicité et l’émotion des messages, rejoint Kotbo et devient AegisAI by Kotbo. Si ton serveur l’utilise déjà, tu n’as rien à faire',
        sections: [
          {
            h2: 'D’où vient AegisAI',
            body: 'Marvideo, de marvideo.fr, a créé AegisAI : une API qui lit un message et renvoie sa note de toxicité et l’émotion qu’il porte. Kotbo s’en sert depuis la 9.5 pour repérer ce que les listes de mots bannis ratent : les fautes volontaires et les phrases polies mais méchantes',
          },
          {
            h2: 'Ce que veut dire la fusion',
            body: 'AegisAI passe sous la marque Kotbo. Marvideo continue de le développer, désormais avec Kotbo et au plus près du bot qui s’en sert',
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
        lead: 'AegisAI, the model built by Marvideo that scores the toxicity and emotion of messages, joins Kotbo and becomes AegisAI by Kotbo. If your server already uses it, there is nothing to do',
        sections: [
          {
            h2: 'Where AegisAI comes from',
            body: 'Marvideo, from marvideo.fr, built AegisAI: an API that reads a message and returns its toxicity score and the emotion it carries. Kotbo has used it since 9.5 to catch what banned-word lists miss: deliberate misspellings and polite but nasty sentences',
          },
          {
            h2: 'What the merger means',
            body: 'AegisAI moves under the Kotbo brand. Marvideo keeps building it, now with Kotbo and right next to the bot that uses it',
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
