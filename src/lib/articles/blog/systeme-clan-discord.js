/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'systeme-clan-discord', en: 'discord-clan-bot' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['clans'],
  text: {
    fr: {
      title: 'Système de clans Discord : créer des clans avec un bot',
      h1: 'Créer un système de clans sur ton serveur Discord',
      description:
        'Système de clans Discord : rôles, QG, points de clan, saisons et paris entre membres. Comment monter des clans sur ton serveur, pas à pas, avec Kotbo.',
      lead: 'Un système de clans répartit les membres en équipes qui gagnent des points ensemble et se disputent un classement, saison après saison. Discord fournit les rôles et les salons. Kotbo ajoute le score, les saisons, les paris et la répartition des membres',
      sections: [
        {
          h2: 'Comment marche un clan sur Discord',
          body: 'Discord ne connaît pas les clans. Un clan, c’est un rôle qui identifie ses membres et un salon, le QG, que seuls ce rôle et le staff voient grâce aux permissions du salon. Tu peux monter tout ça à la main. Ce qui manque, c’est le score et ce qui va avec',
          points: [
            'Un rôle par clan, et un seul clan par membre : Kotbo retire l’ancien rôle de clan quand un membre en reçoit un nouveau',
            'Un QG par clan, choisi dans la fiche du clan',
            'Un rôle de chef de clan, facultatif, que Kotbo peut remettre au meilleur contributeur en fin de saison',
          ],
        },
        {
          h2: 'D’où viennent les points de clan',
          body: 'Le module Clans s’appuie sur le module de niveaux : la progression de chaque membre nourrit le score de son clan. D’autres modules s’y branchent si tu les actives',
          items: [
            { title: 'Passages de niveau', body: 'Un nombre de points à chaque niveau franchi, fixe ou proportionnel à l’XP demandée par le niveau', link: { feature: 'leveling', label: 'Lire l’article sur les niveaux et l’XP' } },
            { title: 'Boosts du serveur', body: 'Des points pour le clan du membre qui booste' },
            { title: 'Drops', body: 'Des points de clan posés au hasard dans un salon, pour le clan de celui qui les ramasse' },
            { title: 'Daily Algo et RPG', body: 'Les points de la semaine du Daily Algo convertis à la clôture, et les gains du jeu de rôle : boss, raid, quêtes' },
            { title: 'Staff', body: 'Des points ajoutés ou retirés à la main depuis le dashboard, pour un événement ou une sanction' },
          ],
        },
        {
          h2: 'Créer tes clans pas à pas',
          body: 'Prévois les rôles et les QG avant d’ouvrir le dashboard, le reste se fait en quelques écrans',
          steps: [
            { title: 'Prépare les rôles et les QG', body: 'Sur Discord, crée un rôle par clan et un salon par clan visible par ce rôle seulement. Range chaque QG dans sa catégorie si tu veux qu’elle porte le titre du champion' },
            { title: 'Active les modules', body: 'Dans le dashboard, active le module de niveaux puis Clans' },
            { title: 'Crée les clans', body: 'Pour chacun : un nom, une description, le rôle Discord, le salon QG et, si tu veux, un rôle de chef' },
            { title: 'Répartis les membres', body: 'Active l’attribution à l’arrivée pour placer chaque nouveau dans le clan le moins peuplé, et lance /clan distribute pour répartir au hasard les membres déjà là' },
            { title: 'Programme la saison', body: 'Choisis les dates de début et de fin, le salon d’annonce, et le renouvellement automatique si les saisons doivent s’enchaîner seules' },
          ],
        },
        {
          h2: 'Saisons de clans : ce qui se passe à la clôture',
          body: 'À la fin d’une saison, Kotbo désigne le clan vainqueur, remet ses récompenses, ajoute « [CHAMPION] » précédé d’un trophée au nom de la catégorie de son QG, publie l’annonce, puis remet les scores des clans à zéro. L’historique reste consultable avec /clan historique',
          points: [
            'Récompenses au choix : plus de chances aux giveaways pour le clan gagnant, rôle de chef pour le meilleur contributeur',
            'Un bilan, si tu l’actives, publié chaque lundi dans le QG de chaque clan : points de la semaine, meilleurs contributeurs, place au classement',
            'Un salon de flux, si tu veux, qui annonce chaque gain ou perte de points sans notifier personne',
            'Une page publique du classement, à partager pour suivre la guerre des clans en direct',
            'Une clôture ratée s’annule depuis le dashboard, pour revenir à la saison précédente',
          ],
        },
        {
          h2: 'Les commandes /clan',
          body: 'Les trois dernières demandent la permission Gérer le serveur',
          commands: [
            { name: '/clan list', body: 'Tous les clans du serveur avec leur effectif' },
            { name: '/clan leaderboard', body: 'Le classement des clans pour la saison en cours' },
            { name: '/clan info nom:<clan>', body: 'La fiche d’un clan et ses meilleurs contributeurs de la saison' },
            { name: '/clan historique saison:<numéro>', body: 'Le résultat d’une saison passée' },
            { name: '/clan paris', body: 'Tes paris en cours, ta dette et ton bilan, visibles par toi seul' },
            { name: '/clan distribute', body: 'Place au hasard tous les membres qui n’ont pas de clan' },
            { name: '/clan dedupe', body: 'Corrige les membres qui portent plusieurs rôles de clan' },
            { name: '/clan clear', body: 'Retire leur rôle de clan à tous les membres' },
          ],
        },
        {
          h2: 'Les paris en points de clan',
          body: 'Deux membres qui se chambrent peuvent régler ça avec /paris : chacun mise des points de clan sur un sujet libre, et un arbitre tranche. Les mises sont prélevées à l’entrée et rendues si le pari n’aboutit pas. Entre deux clans, les points changent vraiment de camp. Et oui, le perdant le prend toujours mal',
          commands: [
            { name: '/paris duel sujet:<sujet> mise:<mise> adversaire:<membre>', body: 'Un défi à un membre, ou au premier qui le relève si le serveur autorise les duels sans adversaire' },
            { name: '/paris pool sujet:<sujet> mise:<mise> places:<nombre>', body: 'Plusieurs parieurs, un seul gagnant qui rafle le pot' },
            { name: '/paris equipes sujet:<sujet> mise:<mise> camps:<camps>', body: 'Des camps qui s’affrontent, le camp gagnant se partage le pot au prorata des mises' },
          ],
        },
        {
          h2: 'Garder des clans équilibrés',
          body: 'Un clan qui écrase les autres tue la compétition. Quand tu crées de nouveaux clans, le rééquilibrage déplace des membres des clans les plus peuplés vers eux, selon le critère choisi : les moins actifs, au hasard ou les plus actifs d’abord. L’activité se mesure en points par jour de présence, pour ne pas pénaliser les derniers arrivés. Les chefs et les membres engagés dans un pari ne bougent jamais, et chacun emporte ses points de la saison en cours',
        },
      ],
      faq: [
        {
          q: 'Comment faire des clans sur Discord ?',
          a: 'Crée un rôle et un salon privé par clan, puis confie le score à un bot. Avec Kotbo, active les modules de niveaux et Clans, et relie chaque clan à son rôle et à son QG dans le dashboard',
        },
        {
          q: 'Quel bot pour un système de clans sur Discord ?',
          a: 'Kotbo gère les clans de bout en bout : points de clan, saisons, classement public, bilan hebdomadaire, paris entre membres et répartition automatique des nouveaux',
        },
        {
          q: 'Comment gagner des points de clan ?',
          a: 'En progressant sur le serveur : chaque passage de niveau rapporte des points au clan du membre. Les boosts, les drops, le Daily Algo, le jeu de rôle et les paris peuvent aussi en rapporter, selon ce que le serveur active',
        },
        {
          q: 'Un membre peut-il être dans deux clans sur Discord ?',
          a: 'Pas avec Kotbo. Si un membre reçoit un second rôle de clan, l’ancien lui est retiré, et /clan dedupe corrige les doublons existants',
        },
        {
          q: 'Comment répartir les membres dans des clans ?',
          a: 'Active l’attribution à l’arrivée, qui place chaque nouveau dans le clan le moins peuplé, et lance /clan distribute pour répartir au hasard les membres sans clan',
        },
        {
          q: 'Que se passe-t-il à la fin d’une saison de clans ?',
          a: 'Kotbo désigne le vainqueur, remet les récompenses choisies, renomme la catégorie de son QG avec le titre de champion, publie l’annonce et remet les scores à zéro. L’historique reste consultable',
        },
      ],
    },
    en: {
      title: 'Discord clan bot: set up a clan system on your server',
      h1: 'How to set up a clan system on your Discord server',
      description:
        'Discord clan bot: roles, HQ channels, clan points, seasons and member bets. How to build a clan system on your server, step by step, with Kotbo.',
      lead: 'A clan system splits members into teams that earn points together and compete on a leaderboard, season after season. Discord provides the roles and channels. Kotbo adds the scoring, seasons, bets and member assignment',
      sections: [
        {
          h2: 'How clans work on Discord',
          body: 'Discord has no notion of clans. A clan is a role that marks its members and a channel, the HQ, that only that role and the staff can see thanks to channel permissions. You can build all of that by hand. What is missing is the score and everything around it',
          points: [
            'One role per clan, and one clan per member: Kotbo removes the old clan role when a member gets a new one',
            'One HQ per clan, picked on the clan’s settings card',
            'An optional clan leader role, which Kotbo can hand to the top contributor at the end of the season',
          ],
        },
        {
          h2: 'Where clan points come from',
          body: 'The Clans module builds on the leveling module: each member’s progress feeds their clan’s score. Other modules plug in if you turn them on',
          items: [
            { title: 'Level-ups', body: 'A number of points for each level reached, fixed or in proportion to the XP that level requires', link: { feature: 'leveling', label: 'Read the article on levels and XP' } },
            { title: 'Server boosts', body: 'Points for the clan of the member who boosts' },
            { title: 'Drops', body: 'Clan points dropped at random in a channel, for the clan of whoever grabs them' },
            { title: 'Daily Algo and RPG', body: 'The week’s Daily Algo points converted when the week closes, and role-playing game wins: bosses, raid, quests' },
            { title: 'Staff', body: 'Points added or removed by hand from the dashboard, for an event or a penalty' },
          ],
        },
        {
          h2: 'How to set up clans step by step',
          body: 'Get the roles and HQ channels ready before opening the dashboard, the rest takes a few screens',
          steps: [
            { title: 'Prepare roles and HQs', body: 'On Discord, create one role per clan and one channel per clan visible to that role only. Put each HQ in its own category if you want that category to carry the champion title' },
            { title: 'Turn on the modules', body: 'In the dashboard, turn on Leveling & XP, then Clans' },
            { title: 'Create the clans', body: 'For each one: a name, a description, the Discord role, the HQ channel and, if you like, a leader role' },
            { title: 'Assign members', body: 'Turn on assignment on join to put each newcomer in the smallest clan, and run /clan distribute to spread existing members at random' },
            { title: 'Schedule the season', body: 'Pick start and end dates, the announcement channel, and auto-renewal if seasons should follow each other on their own' },
          ],
        },
        {
          h2: 'Clan seasons: what happens when one ends',
          body: 'When a season ends, Kotbo names the winning clan, hands out its rewards, adds “[CHAMPION]” with a trophy to its HQ category name, posts the announcement, then resets the clan scores. Past seasons stay available with /clan historique',
          points: [
            'Optional rewards: better giveaway odds for the winning clan, the leader role for the top contributor',
            'An optional weekly recap posted every Monday in each clan’s HQ: the week’s points, top contributors, leaderboard position',
            'An optional feed channel that reports every clan point gain or loss without pinging anyone',
            'A public leaderboard page to share, so members can follow the clan war live',
            'A botched season close can be rolled back from the dashboard',
          ],
        },
        {
          h2: 'The /clan commands',
          body: 'Subcommands and options are typed as shown. The last three require the Manage Server permission',
          commands: [
            { name: '/clan list', body: 'Every clan on the server with its member count' },
            { name: '/clan leaderboard', body: 'The clan leaderboard for the current season' },
            { name: '/clan info nom:<clan>', body: 'A clan’s card and its top contributors this season' },
            { name: '/clan historique saison:<number>', body: 'The result of a past season' },
            { name: '/clan paris', body: 'Your open bets, your debt and your record, visible to you only' },
            { name: '/clan distribute', body: 'Puts every member without a clan into one at random' },
            { name: '/clan dedupe', body: 'Fixes members who carry several clan roles' },
            { name: '/clan clear', body: 'Removes the clan role from every member' },
          ],
        },
        {
          h2: 'Betting clan points',
          body: 'Two members trash-talking each other can settle it with /paris: each stakes clan points on any topic, and a referee decides. Stakes are taken on entry and returned if the bet falls through. Between two clans, points really change sides. And yes, the loser always takes it badly',
          commands: [
            { name: '/paris duel sujet:<topic> mise:<stake> adversaire:<member>', body: 'A challenge to one member, or to whoever takes it up if the server allows open duels' },
            { name: '/paris pool sujet:<topic> mise:<stake> places:<number>', body: 'Several bettors, one winner who takes the pot' },
            { name: '/paris equipes sujet:<topic> mise:<stake> camps:<sides>', body: 'Sides facing off, the winning side splits the pot in proportion to the stakes' },
          ],
        },
        {
          h2: 'Keeping clans balanced',
          body: 'One clan crushing the others kills the competition. When you add new clans, rebalancing moves members from the biggest clans into them, by the rule you pick: least active first, at random or most active first. Activity is measured in points per day of presence, so late joiners are not penalized. Leaders and members with an open bet never move, and everyone takes their current season points along',
        },
      ],
      faq: [
        {
          q: 'How do I make clans on Discord?',
          a: 'Create a role and a private channel for each clan, then let a bot keep the score. With Kotbo, turn on Leveling & XP and Clans, and link each clan to its role and HQ in the dashboard',
        },
        {
          q: 'What is a good Discord clan bot?',
          a: 'Kotbo runs clans end to end: clan points, seasons, a public leaderboard, a weekly recap, member bets and automatic assignment of newcomers',
        },
        {
          q: 'How do you earn clan points?',
          a: 'By progressing on the server: every level-up earns points for the member’s clan. Boosts, drops, Daily Algo, the role-playing game and bets can add more, depending on what the server turns on',
        },
        {
          q: 'Can a member be in two clans on Discord?',
          a: 'Not with Kotbo. If a member gets a second clan role, the old one is removed, and /clan dedupe fixes existing duplicates',
        },
        {
          q: 'How do I split members into clans?',
          a: 'Turn on assignment on join, which puts each newcomer in the smallest clan, and run /clan distribute to spread members without a clan at random',
        },
        {
          q: 'What happens at the end of a clan season?',
          a: 'Kotbo names the winner, hands out the chosen rewards, renames its HQ category with the champion title, posts the announcement and resets the scores. Past seasons stay available',
        },
      ],
    },
  },
};
