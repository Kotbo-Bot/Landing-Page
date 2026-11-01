/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'faire-un-giveaway-discord', en: 'giveaway-on-discord' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['giveaways'],
  text: {
    fr: {
      title: 'Comment faire un giveaway sur Discord (avec un bot)',
      h1: 'Comment faire un giveaway sur Discord, du lancement au tirage',
      description:
        'Comment faire un giveaway sur Discord : lancer le concours avec un bot, fixer les conditions de participation, tirer au sort et relancer le tirage si besoin.',
      lead: 'Discord n’a pas d’outil de giveaway intégré : pour faire un giveaway sur Discord, il te faut un bot qui publie l’annonce, compte les participants et tire au sort à l’heure dite. Avec Kotbo, une commande ou un formulaire du dashboard suffit, et les conditions de participation écartent les comptes créés pour l’occasion',
      sections: [
        {
          h2: 'Pourquoi un bot giveaway Discord',
          body: 'Tu peux toujours demander aux gens de réagir sous un message et tirer un nom à la main. Ça marche pour dix personnes, beaucoup moins au-delà',
          points: [
            'Personne ne peut vérifier que le tirage était honnête',
            'Les doubles comptes et les comptes créés la veille entrent comme les autres',
            'Il faut penser à clôturer, et recompter si un gagnant a quitté le serveur',
            'Un bot tire au sort à l’heure prévue, annonce les gagnants et garde la liste des participants',
          ],
        },
        {
          h2: 'Lancer un giveaway avec Kotbo',
          body: 'Depuis le dashboard, page Giveaways, le bouton Lancer un giveaway ouvre un formulaire : lot, description, nombre de gagnants, durée ou date de fin, salon. Depuis Discord, c’est la commande /giveaway',
          steps: [
            { title: 'Choisis le lot', body: 'Écris ce qu’il y a à gagner, et une description si tu veux préciser les conditions' },
            { title: 'Fixe la durée', body: 'En minutes avec la commande, en minutes, heures, jours ou avec une date de fin depuis le dashboard' },
            { title: 'Choisis le salon', body: 'Le salon courant par défaut, ou celui que tu indiques. Un salon par défaut peut aussi être fixé dans la configuration' },
            { title: 'Lance', body: 'Kotbo publie l’annonce avec un bouton Rejoindre. Les membres participent d’un clic, et recliquer retire leur participation' },
            { title: 'Laisse tourner', body: 'À la fin, Kotbo tire au sort, annonce les gagnants dans le salon et grise le bouton' },
          ],
        },
        {
          h2: 'La commande /giveaway et ses sous-commandes',
          body: 'Sur un Discord en français, les sous-commandes s’affichent en français : lancer, cloturer, relancer. En anglais, ce sont start, end et reroll',
          commands: [
            { name: '/giveaway lancer lot:<lot> gagnants:<nombre> duree:<minutes>', body: 'Lance un concours. Options en plus : salon, description, modele pour partir d’un modèle enregistré, validation pour exiger l’accord du staff avant de remettre le lot' },
            { name: '/giveaway cloturer id:<identifiant>', body: 'Clôture un concours en cours et tire au sort tout de suite. L’identifiant est donné au lancement' },
            { name: '/giveaway relancer id:<identifiant>', body: 'Tire un nouveau gagnant pour un concours terminé, parmi les participants qui n’ont pas encore gagné' },
          ],
        },
        {
          h2: 'Les conditions de participation',
          body: 'L’onglet Configuration de la page Giveaways règle qui peut cliquer sur Rejoindre. Un membre refusé reçoit un message qui lui explique pourquoi, et tu peux réécrire chacun de ces messages',
          items: [
            { title: 'Rôles requis et rôles exclus', body: 'Réserve le concours à certains rôles, ou en écarte. Un rôle exclu l’emporte toujours sur un rôle requis' },
            { title: 'Âge du compte Discord', body: 'Un nombre de jours minimum depuis la création du compte, pour écarter les comptes créés pour l’occasion' },
            { title: 'Ancienneté sur le serveur', body: 'Un nombre de jours minimum depuis l’arrivée, pour les membres venus juste pour le lot' },
            {
              title: 'Niveau minimum',
              body: 'Le niveau atteint avec le module Niveaux, pour réserver le lot aux membres actifs',
              link: { feature: 'leveling', label: 'Lire l’article sur les niveaux' },
            },
            {
              title: 'Une personne, une entrée',
              body: 'Les comptes reconnus comme appartenant au même membre ne participent qu’une fois',
              link: { feature: 'double_accounts', label: 'Lire l’article sur les doubles comptes' },
            },
          ],
        },
        {
          h2: 'Tirage au sort et relance',
          body: 'Quelques règles qui évitent les litiges sous l’annonce',
          points: [
            'Un participant qui quitte le serveur est retiré des concours en cours, il ne peut pas gagner un lot qu’on ne pourra pas lui remettre',
            'Des rôles peuvent compter plusieurs fois dans le tirage, jusqu’à dix fois. Le meilleur rôle s’applique, ils ne se cumulent pas',
            'Avec la validation, les gagnants restent en attente : le staff valide ou relance le tirage avec les boutons sous l’annonce',
            'La relance tire un seul nouveau gagnant à la fois, et l’annonce est mise à jour',
          ],
        },
        {
          h2: 'Confier les giveaways à l’équipe animation',
          body: 'Par défaut, /giveaway est ouvert aux administrateurs et aux membres qui ont Gérer le serveur ou Gérer les messages. Ajoute des rôles gestionnaires dans la configuration et ton équipe animation lance ses concours sans toucher à la modération. L’onglet Modèles garde tes concours récurrents, et une page publique liste les giveaways en cours sans connexion. L’apparence de l’annonce se règle aussi dans la configuration : couleurs, titre, images, libellé et couleur du bouton, annonce des gagnants et réponses aux participants. Chaque enregistrement est gardé sous un nom, pour revenir à une ancienne configuration',
        },
      ],
      faq: [
        {
          q: 'Comment faire un giveaway sur Discord ?',
          a: 'Discord n’a pas d’outil intégré, il faut un bot. Avec Kotbo, tape /giveaway lancer avec le lot, le nombre de gagnants et la durée, ou lance-le depuis la page Giveaways du dashboard',
        },
        {
          q: 'Quel bot giveaway Discord utiliser ?',
          a: 'Plusieurs bots font des giveaways. Kotbo les fait avec des conditions de participation, une entrée par personne malgré les doubles comptes et une validation du staff, dans le même dashboard que le reste du serveur',
        },
        {
          q: 'Comment relancer un giveaway sur Discord ?',
          a: 'Tape /giveaway relancer avec l’identifiant du concours terminé. Kotbo tire un nouveau gagnant parmi les participants qui n’ont pas encore gagné et l’annonce dans le salon',
        },
        {
          q: 'Comment empêcher les doubles comptes de participer à un giveaway ?',
          a: 'Active « Une personne, une entrée » dans la configuration des giveaways. Les comptes reconnus comme appartenant au même membre n’entrent qu’une fois, et un âge de compte minimum écarte les comptes tout neufs',
        },
        {
          q: 'Comment terminer un giveaway plus tôt ?',
          a: 'Tape /giveaway cloturer avec l’identifiant du concours, ou clique sur Tirer gagnant dans la page Giveaways. Le tirage a lieu tout de suite',
        },
        {
          q: 'Est-ce que le lot peut être remis automatiquement ?',
          a: 'Pour les récompenses de Kotbo, oui : des pièces, de l’XP ou un objet du jeu de rôle sont crédités aux gagnants, après validation du staff si elle est demandée. Un lot extérieur, comme un abonnement Nitro, se remet à la main',
        },
        {
          q: 'Est-ce qu’un membre peut se retirer d’un giveaway ?',
          a: 'Oui, il reclique sur le bouton de participation. Kotbo lui confirme le retrait dans un message visible de lui seul',
        },
      ],
    },
    en: {
      title: 'How to do a giveaway on Discord with a bot',
      h1: 'How to do a giveaway on Discord, from launch to draw',
      description:
        'How to do a giveaway on Discord: start it with a giveaway bot, set entry requirements, draw the winners on time and reroll if a winner doesn’t claim the prize.',
      lead: 'Discord has no built-in giveaway tool: to run a giveaway on Discord you need a bot that posts the announcement, counts entries and draws on time. With Kotbo, one command or a dashboard form does it, and entry requirements keep out accounts created just for the prize',
      sections: [
        {
          h2: 'Why use a Discord giveaway bot',
          body: 'You can always ask people to react under a message and draw a name by hand. It works for ten people, much less beyond that',
          points: [
            'Nobody can check the draw was fair',
            'Alt accounts and accounts made yesterday get in like everyone else',
            'Someone has to remember to close it, and redraw if a winner left the server',
            'A bot draws at the set time, announces the winners and keeps the entry list',
          ],
        },
        {
          h2: 'Starting a giveaway with Kotbo',
          body: 'From the dashboard, Giveaways page, the start button opens a form: prize, description, number of winners, duration or end date, channel. From Discord, it’s the /giveaway command',
          steps: [
            { title: 'Pick the prize', body: 'Write what’s up for grabs, plus a description if you want to spell out the rules' },
            { title: 'Set the duration', body: 'In minutes with the command, in minutes, hours, days or as an end date from the dashboard' },
            { title: 'Pick the channel', body: 'The current channel by default, or the one you name. A default channel can also be set in the configuration' },
            { title: 'Start it', body: 'Kotbo posts the announcement with a join button. Members enter in one click, and clicking again withdraws them' },
            { title: 'Let it run', body: 'At the end, Kotbo draws, announces the winners in the channel and greys out the button' },
          ],
        },
        {
          h2: 'The /giveaway command and its subcommands',
          body: 'On an English Discord client the subcommands are start, end and reroll. A French client shows them as lancer, cloturer and relancer',
          commands: [
            { name: '/giveaway start prize:<prize> winners:<number> duration:<minutes>', body: 'Starts a giveaway. Extra options: channel, description, template to start from a saved template, validation to require staff approval before the prize is handed out' },
            { name: '/giveaway end id:<id>', body: 'Closes a running giveaway and draws right away. The id is given when you start it' },
            { name: '/giveaway reroll id:<id>', body: 'Draws a new winner for a finished giveaway, among entrants who haven’t won yet' },
          ],
        },
        {
          h2: 'Giveaway entry requirements',
          body: 'The Configuration tab of the Giveaways page sets who can click join. A refused member gets a message telling them why, and you can rewrite each of those messages',
          items: [
            { title: 'Required and excluded roles', body: 'Limit the giveaway to some roles, or keep some out. An excluded role always wins over a required one' },
            { title: 'Discord account age', body: 'A minimum number of days since the account was created, to keep out accounts made for the occasion' },
            { title: 'Time on the server', body: 'A minimum number of days since joining, for members who showed up just for the prize' },
            {
              title: 'Minimum level',
              body: 'The level reached with the Levels module, to keep the prize for active members',
              link: { feature: 'leveling', label: 'Read the article on levels' },
            },
            {
              title: 'One person, one entry',
              body: 'Accounts recognized as belonging to the same member only enter once',
              link: { feature: 'double_accounts', label: 'Read the article on alt accounts' },
            },
          ],
        },
        {
          h2: 'The draw and the reroll',
          body: 'A few rules that head off arguments under the announcement',
          points: [
            'An entrant who leaves the server is removed from running giveaways, so they can’t win a prize nobody can hand them',
            'Some roles can count several times in the draw, up to ten times. The best role applies, they don’t stack',
            'With validation on, winners stay pending: staff approve or reroll with the buttons under the announcement',
            'A reroll draws one new winner at a time, and the announcement is updated',
          ],
        },
        {
          h2: 'Handing giveaways to your events team',
          body: 'By default, /giveaway is open to admins and members with Manage Server or Manage Messages. Add manager roles in the configuration and your events team runs giveaways without moderation rights. The Templates tab keeps your recurring giveaways, and a public page lists running giveaways with no login needed. The announcement’s look is set in the configuration too: colors, title, images, button label and color, the winners announcement and the replies to entrants. Each save is kept under a name, so you can go back to an older setup',
        },
      ],
      faq: [
        {
          q: 'How do you do a giveaway on Discord?',
          a: 'Discord has no built-in tool, so you need a bot. With Kotbo, type /giveaway start with the prize, number of winners and duration, or start it from the Giveaways page of the dashboard',
        },
        {
          q: 'What is a good Discord giveaway bot?',
          a: 'Several bots run giveaways. Kotbo runs them with entry requirements, one entry per person despite alt accounts and staff validation, in the same dashboard as the rest of your server',
        },
        {
          q: 'How do I reroll a giveaway on Discord?',
          a: 'Type /giveaway reroll with the id of the finished giveaway. Kotbo draws a new winner among entrants who haven’t won yet and announces it in the channel',
        },
        {
          q: 'How do I stop alt accounts from entering a giveaway?',
          a: 'Turn on “One person, one entry” in the giveaway configuration. Accounts recognized as the same member only enter once, and a minimum account age keeps out brand new accounts',
        },
        {
          q: 'How do I end a giveaway early?',
          a: 'Type /giveaway end with the giveaway id, or use the draw button in the Giveaways page. The draw happens right away',
        },
        {
          q: 'Can the prize be handed out automatically?',
          a: 'For Kotbo’s own rewards, yes: coins, roleplay XP or a roleplay item are credited to the winners, after staff validation if it’s on. An outside prize, like a Nitro subscription, you hand over yourself',
        },
        {
          q: 'Can a member leave a giveaway?',
          a: 'Yes, they click the join button again. Kotbo confirms the withdrawal in a message only they can see',
        },
      ],
    },
  },
};
