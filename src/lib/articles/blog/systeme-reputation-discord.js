/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'systeme-reputation-discord', en: 'discord-reputation-bot' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['reputation', 'prestige'],
  text: {
    fr: {
      title: 'Système de réputation Discord : le +rep et le prestige',
      h1: 'Mettre un système de réputation sur ton serveur Discord',
      description:
        'Système de réputation Discord : des +rep que les membres se donnent pour se remercier, des limites contre la triche et un classement de prestige.',
      lead: 'Un système de réputation sur Discord, c’est un +rep que les membres se donnent pour se remercier. Il récompense ceux qui aident, là où l’XP récompense ceux qui parlent. Discord n’en a pas : Kotbo l’ajoute avec /rep, et son classement de prestige va plus loin pour les serveurs qui aiment la compétition',
      sections: [
        {
          h2: 'Réputation, XP et prestige : ce que chacun mesure',
          body: 'Les trois se complètent, mais ne récompensent pas la même chose. Choisis selon ce que tu veux voir plus souvent sur ton serveur. Beaucoup de serveurs font tourner réputation et niveaux ensemble, et n’ajoutent le prestige que quand la communauté réclame de la compétition',
          items: [
            { title: 'La réputation', body: 'Ce que les autres pensent de toi. Un membre qui répond aux questions ou dépanne les nouveaux grimpe, même s’il parle peu' },
            { title: 'L’XP et les niveaux', body: 'Le temps passé à écrire et en vocal. Ça mesure la présence, et ne dit rien de l’aide apportée', link: { feature: 'leveling', label: 'Lire l’article sur les niveaux et l’XP' } },
            { title: 'Le prestige', body: 'Un classement compétitif tiré de l’XP, avec des paliers, des séries et une perte de points quand on disparaît' },
          ],
        },
        {
          h2: 'Les commandes de réputation',
          body: 'On peut aussi donner un +rep sans taper de commande : clic droit sur un message ou sur un membre, Applications, ⚡ Actions Kotbo, puis Donner de la réputation. Depuis un message, la raison note le salon où il a été posté',
          commands: [
            { name: '/rep give membre:<membre> raison:<raison>', body: 'Donne un +rep à un membre. La raison est facultative et s’affiche avec le vote' },
            { name: '/rep check membre:<membre>', body: 'Le total d’un membre, sa place au classement et les votes qu’il lui reste aujourd’hui. Sans option, les tiens' },
            { name: '/rep top', body: 'Les dix membres les plus remerciés du serveur' },
          ],
        },
        {
          h2: 'Les règles qui empêchent de tricher',
          body: 'Un +rep ne vaut quelque chose que s’il est rare. Si chacun peut en distribuer autant qu’il veut, le classement devient la liste de ceux qui ont le plus de potes. Kotbo applique ces règles d’office',
          points: [
            'Trois votes par jour et par membre, le jour suivant le fuseau horaire du serveur',
            'Un seul +rep par jour vers la même personne',
            'Impossible de se voter soi-même ou de voter pour un bot',
            'Un membre, un rôle ou un salon placé sur la liste noire de progression ne peut plus utiliser /rep, sauf le staff qui gère le serveur',
          ],
        },
        {
          h2: 'Installer le +rep pas à pas',
          body: 'Le module tourne sans réglage : le travail consiste surtout à en faire un réflexe',
          steps: [
            { title: 'Active le module', body: 'Dans le dashboard, active Réputation dans le catalogue des modules' },
            { title: 'Explique-le', body: 'Épingle un message dans ton salon d’entraide : « quelqu’un t’a aidé ? /rep give »' },
            { title: 'Relie-le aux quêtes', body: 'Si le module Quêtes tourne, crée une quête « Donner des +rep » : elle récompense ceux qui remercient' },
            { title: 'Suis les votes', body: 'La page Réputation du dashboard montre le classement, le nombre de votants et les 50 derniers votes avec leur raison. Deux comptes qui se renvoient la balle s’y voient vite' },
          ],
        },
        {
          h2: 'Le prestige, un classement compétitif',
          body: 'Le prestige transforme l’XP en points de classement, les RP. Il demande le module de niveaux, et vise les serveurs où l’on aime se mesurer',
          items: [
            { title: 'Les gains', body: 'Une part de chaque point d’XP gagné, 0,35 RP par défaut, plus des RP pour les réactions si tu le veux, avec un plafond par jour et par membre' },
            { title: 'Les paliers', body: 'Bronze, Silver, Gold et la suite, découpés en divisions si tu veux, avec un rôle par palier et une annonce à chaque promotion ou rétrogradation' },
            { title: 'Les séries', body: 'Être actif plusieurs jours de suite majore les RP gagnés. Des gels sauvent la série après un jour manqué' },
            { title: 'La décroissance', body: 'Après quelques jours d’inactivité, le membre perd des RP chaque jour, jusqu’à un palier plancher que tu choisis' },
            { title: 'Les événements', body: 'Message Rush, Reaction Storm, Vocal Time ou événement libre : un multiplicateur de RP de 1 à 10 pendant une durée donnée' },
            { title: 'Les saisons', body: 'À la clôture d’une saison du module Saisons, chacun ne garde qu’un quart de ses RP' },
          ],
        },
        {
          h2: 'Les commandes du prestige',
          body: 'Les commandes /prestige-admin demandent la permission Gérer le serveur. Le reste se règle aussi sur la page Prestige du dashboard',
          commands: [
            { name: '/prestige rank membre:<membre>', body: 'La carte de rang compétitif d’un membre, ou la tienne' },
            { name: '/prestige top', body: 'Le classement RP du serveur' },
            { name: '/prestige streaks', body: 'Les plus longues séries en cours' },
            { name: '/prestige global', body: 'Le classement RP entre serveurs. /prestige global-optout t’en retire ou t’y remet, sans toucher au classement du serveur' },
            { name: '/prestige-admin setup', body: 'Active le classement et règle les RP par point d’XP, le plafond journalier et le salon des annonces' },
            { name: '/prestige-admin decay', body: 'Règle la décroissance : jours de tolérance, RP perdus par jour, palier plancher' },
            { name: '/prestige-admin event', body: 'Lance un événement RP, avec son type, sa durée et son multiplicateur' },
            { name: '/prestige-admin adjust membre:<membre> rp:<montant> motif:<motif>', body: 'Ajoute ou retire des RP à la main, avec un motif consigné' },
          ],
        },
      ],
      faq: [
        {
          q: 'Comment faire un système de réputation sur Discord ?',
          a: 'Il faut un bot, Discord n’en propose pas. Avec Kotbo, active le module Réputation dans le dashboard : les membres se donnent des +rep avec /rep give ou par clic droit, et /rep top affiche le classement',
        },
        {
          q: 'Quel bot pour donner des +rep sur Discord ?',
          a: 'Kotbo a un système de +rep intégré, avec trois votes par jour, une raison facultative, un classement et le suivi des votes dans le dashboard',
        },
        {
          q: 'Combien de +rep peut-on donner par jour ?',
          a: 'Trois par jour et par membre avec Kotbo, et un seul vers la même personne. Le compteur repart à minuit, à l’heure du serveur',
        },
        {
          q: 'Comment éviter la triche sur la réputation Discord ?',
          a: 'Limite les votes et rends-les visibles. Kotbo plafonne les votes, refuse l’auto-vote et liste les derniers votes dans le dashboard, ce qui fait ressortir les échanges de +rep entre deux comptes',
        },
        {
          q: 'Qu’est-ce que le prestige sur un serveur Discord ?',
          a: 'Avec Kotbo, c’est un classement compétitif en RP, tirés de l’XP. Il ajoute des paliers avec leurs rôles, des séries d’activité et une perte de RP après une période d’inactivité',
        },
        {
          q: 'Est-ce que la réputation fait gagner de l’XP ?',
          a: 'Non, les deux sont séparés : le +rep a son propre total et son propre classement. Une quête « Donner des +rep » peut en revanche récompenser ceux qui remercient en pièces et en XP',
        },
      ],
    },
    en: {
      title: 'Discord reputation bot: +rep and prestige rankings',
      h1: 'How to add a reputation system to your Discord server',
      description:
        'Discord reputation bot: members give each other +rep to say thanks, with limits that stop farming, plus a prestige ranking. Commands and setup guide.',
      lead: 'A reputation system on Discord is a +rep that members give each other as thanks. It rewards the people who help, where XP rewards the people who talk. Discord doesn’t have one: Kotbo adds it with /rep, and its prestige ranking goes further for servers that like to compete',
      sections: [
        {
          h2: 'Reputation, XP and prestige: what each one measures',
          body: 'They work well together, but they don’t reward the same thing. Pick based on what you want to see more of on your server. Many servers run reputation and levels side by side, and only add prestige once the community asks for competition',
          items: [
            { title: 'Reputation', body: 'What other members think of you. Someone who answers questions or helps newcomers climbs, even if they rarely chat' },
            { title: 'XP and levels', body: 'Time spent typing and in voice. It measures presence and says nothing about the help given', link: { feature: 'leveling', label: 'Read the article on levels and XP' } },
            { title: 'Prestige', body: 'A competitive ranking built from XP, with tiers, streaks and point loss when you vanish' },
          ],
        },
        {
          h2: 'Reputation commands',
          body: 'You can also give +rep without typing a command: right-click a message or a member, Apps, ⚡ Kotbo actions, then the reputation action. From a message, the reason records the channel it was posted in. Options are typed in French',
          commands: [
            { name: '/rep give membre:<member> raison:<reason>', body: 'Gives a member +rep. The reason is optional and shows with the vote' },
            { name: '/rep check membre:<member>', body: 'A member’s total, leaderboard rank and votes left today. With no option, yours' },
            { name: '/rep top', body: 'The ten most thanked members on the server' },
          ],
        },
        {
          h2: 'Rules that stop reputation farming',
          body: 'A +rep only means something if it is scarce. If anyone can hand out as many as they want, the leaderboard turns into a list of whoever has the most friends. Kotbo enforces these rules out of the box',
          points: [
            'Three votes per day per member, with the day following the server’s time zone',
            'Only one +rep per day to the same person',
            'No voting for yourself or for a bot',
            'A member, role or channel on the progression blacklist can no longer use /rep, except staff who manage the server',
          ],
        },
        {
          h2: 'How to set up +rep step by step',
          body: 'The module runs without any settings: the real work is turning it into a habit',
          steps: [
            { title: 'Turn on the module', body: 'In the dashboard, turn on Reputation in the module catalog' },
            { title: 'Explain it', body: 'Pin a message in your help channel: “someone helped you? /rep give”' },
            { title: 'Tie it to quests', body: 'If the Quests module is on, create a “Give +rep” quest: it rewards members who say thanks' },
            { title: 'Watch the votes', body: 'The Reputation page of the dashboard shows the leaderboard, the number of voters and the last 50 votes with their reason. Two accounts passing +rep back and forth stand out fast' },
          ],
        },
        {
          h2: 'Prestige, a competitive ranking',
          body: 'Prestige turns XP into ranking points, called RP. It needs the leveling module, and suits servers where members like to measure up',
          items: [
            { title: 'Earning RP', body: 'A share of every XP point earned, 0.35 RP by default, plus RP for reactions if you want, with a daily cap per member' },
            { title: 'Tiers', body: 'Bronze, Silver, Gold and up, split into divisions if you like, with a role per tier and an announcement on every promotion or demotion' },
            { title: 'Streaks', body: 'Being active several days in a row boosts the RP earned. Freezes save the streak after a missed day' },
            { title: 'Decay', body: 'After a few days of inactivity, the member loses RP every day, down to a floor tier you choose' },
            { title: 'Events', body: 'Message Rush, Reaction Storm, Vocal Time or a custom event: an RP multiplier from 1 to 10 for a set time' },
            { title: 'Seasons', body: 'When a season of the Seasons module closes, everyone keeps only a quarter of their RP' },
          ],
        },
        {
          h2: 'Prestige commands',
          body: '/prestige-admin commands require the Manage Server permission. The rest can also be set on the dashboard’s Prestige page. Options are typed in French',
          commands: [
            { name: '/prestige rank membre:<member>', body: 'A member’s competitive rank card, or yours' },
            { name: '/prestige top', body: 'The server’s RP leaderboard' },
            { name: '/prestige streaks', body: 'The longest active streaks' },
            { name: '/prestige global', body: 'The cross-server RP leaderboard. /prestige global-optout takes you off it or puts you back, without touching the server leaderboard' },
            { name: '/prestige-admin setup', body: 'Turns the ranking on and sets RP per XP point, the daily cap and the announcement channel' },
            { name: '/prestige-admin decay', body: 'Sets decay: grace days, RP lost per day, floor tier' },
            { name: '/prestige-admin event', body: 'Starts an RP event, with its type, duration and multiplier' },
            { name: '/prestige-admin adjust membre:<member> rp:<amount> motif:<reason>', body: 'Adds or removes RP by hand, with a logged reason' },
          ],
        },
      ],
      faq: [
        {
          q: 'How do I make a reputation system on Discord?',
          a: 'You need a bot, Discord doesn’t offer one. With Kotbo, turn on the Reputation module in the dashboard: members give +rep with /rep give or by right-click, and /rep top shows the leaderboard',
        },
        {
          q: 'What is a good Discord bot for +rep?',
          a: 'Kotbo has a built-in +rep system, with three votes a day, an optional reason, a leaderboard and vote tracking in the dashboard',
        },
        {
          q: 'How many +rep can you give per day?',
          a: 'Three per day per member with Kotbo, and only one to the same person. The count resets at midnight, server time',
        },
        {
          q: 'How do I stop reputation farming on Discord?',
          a: 'Limit votes and make them visible. Kotbo caps votes, blocks self-votes and lists recent votes in the dashboard, which makes +rep swaps between two accounts stand out',
        },
        {
          q: 'What is prestige on a Discord server?',
          a: 'With Kotbo, it is a competitive RP ranking built from XP. It adds tiers with their roles, activity streaks and RP loss after a period of inactivity',
        },
        {
          q: 'Does reputation give XP?',
          a: 'No, they are separate: +rep has its own total and its own leaderboard. A “Give +rep” quest can still reward members who say thanks with coins and XP',
        },
      ],
    },
  },
};
