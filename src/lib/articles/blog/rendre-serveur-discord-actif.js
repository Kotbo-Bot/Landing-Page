/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'rendre-serveur-discord-actif', en: 'make-discord-server-active' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['events', 'quests', 'seasons', 'fun', 'drops', 'daily_algo'],
  text: {
    fr: {
      title: 'Comment rendre son serveur Discord actif (et le garder)',
      h1: 'Comment rendre ton serveur Discord actif, problème par problème',
      description:
        'Comment rendre son serveur Discord actif : les vraies causes d’un serveur mort et quoi faire pour chacune, avec les outils de Discord et ceux de Kotbo.',
      lead: 'Un serveur Discord devient actif quand les membres ont une raison de revenir et de se parler. Aucun bot ne fabrique ça à ta place, mais chaque symptôme d’un serveur mort a sa réponse. Ce guide part des problèmes, puis donne l’outil de Discord ou de Kotbo qui va avec',
      sections: [
        {
          h2: 'Les nouveaux arrivent et ne disent rien',
          body: 'Un nouveau qui ne sait pas où parler finit par repartir. Commence par Discord lui-même : l’onboarding natif, dans les paramètres du serveur, pose quelques questions à l’arrivée et n’affiche que les salons utiles. Ensuite, donne-lui une première action qui ne demande pas de se présenter',
          points: [
            'Un salon de comptage ou d’histoire à un mot, où l’on participe avec un seul message',
            'Une quête du jour qui récompense une réponse, une réaction ou un fil créé',
            'Le +rep (/rep give), pour que les anciens remercient ceux qui aident, nouveaux compris',
          ],
        },
        {
          h2: 'Le serveur est mort le soir et le week-end',
          body: 'Un salon calme a besoin de rendez-vous. Le même créneau chaque semaine marche mieux qu’un gros événement surprise : les gens finissent par le noter. Dans Kotbo, tout part du module Événements & quiz',
          items: [
            { title: 'Quiz en direct', body: 'Tu écris les questions dans le dashboard, tu les lances une par une et les membres répondent avec des boutons. Chacun retrouve ses résultats avec /event resultat' },
            { title: 'Événement avec inscription', body: 'Une annonce avec un bouton d’inscription, un formulaire si tu veux des réponses, et l’événement Discord créé en même temps pour qu’il apparaisse dans la liste des événements du serveur' },
            { title: 'Drops', body: 'Le bot pose lui-même des pièces, de l’XP ou des points de clan dans un salon, à une heure imprévisible. Selon le mode tiré, le premier qui clique gagne, les premiers gagnent chacun, ou tout le monde se sert pendant un moment' },
          ],
        },
        {
          h2: 'Les membres passent mais ne reviennent pas',
          body: 'Revenir est une habitude, et une habitude se construit avec un petit objectif quotidien. Les quêtes se créent dans le dashboard à partir de modèles : messages envoyés, réponses, réactions, fils créés, minutes en vocal ou +rep donnés, chaque jour ou chaque semaine',
          commands: [
            { name: '/quests list', body: 'Les quêtes du jour et de la semaine avec leur progression. Une quête terminée verse ses pièces et son XP toute seule' },
            { name: '/daily', body: 'La récompense quotidienne de l’économie, majorée tant que la série tient' },
            { name: '/seasons current', body: 'La saison en cours et son classement' },
            { name: '/stats-compteur', body: 'Les statistiques du jeu de comptage, pour relancer les records' },
          ],
        },
        {
          h2: 'Toujours les mêmes en haut du classement',
          body: 'Un classement que personne ne peut plus rattraper décourage plus qu’il ne motive. Donne une chance aux nouveaux',
          items: [
            { title: 'Les saisons', body: 'Une saison a un nom et des dates. À sa clôture, le classement est figé et archivé (/seasons leaderboard), et le classement de prestige repart de bas pour tout le monde', link: { feature: 'leveling', label: 'Lire l’article sur les niveaux et l’XP' } },
            { title: 'Les clans', body: 'Les membres jouent en équipe : celui qui ne finira jamais premier fait quand même gagner son clan' },
          ],
        },
        {
          h2: 'Personne n’ose lancer la conversation',
          body: 'Les salons de jeu donnent un prétexte pour écrire. Ils marchent même à quelques personnes, et c’est souvent par là qu’un petit serveur reprend vie. Avec le mode punitif, une erreur remet le comptage ou la chaîne de mots à zéro. Sans, le message fautif est supprimé et son auteur prévenu. Le mode punitif fait des rancunes tenaces, c’est un peu le but',
          points: [
            'Comptage : chacun son tour, jamais deux fois de suite',
            'Histoire à un mot et chaîne de mots',
            'Nombre mystère et rébus emoji, avec tes propres rébus si tu veux',
            'Ni oui ni non, et le salon où seuls les emojis passent',
            'Image du jour : une image par membre et par jour',
            'Confessions anonymes avec /confession envoyer, que le staff peut lever avec /confession reveler',
          ],
        },
        {
          h2: 'Une semaine d’animation, pas à pas',
          body: 'Inutile de tout activer le premier jour. Voici un départ raisonnable avec Kotbo',
          steps: [
            { title: 'Ouvre un ou deux salons fun', body: 'Dans le dashboard, active Salons fun et choisis un salon pour le comptage. Ajoute un deuxième jeu seulement s’il prend' },
            { title: 'Crée trois quêtes', body: 'Dans Quêtes, pars des modèles : une quête de messages, une de vocal, une hebdomadaire plus longue. Garde des objectifs atteignables' },
            { title: 'Fixe un rendez-vous', body: 'Prépare un quiz court dans Événements & quiz et annonce-le pour le même soir chaque semaine' },
            { title: 'Fais tomber des drops', body: 'Active les drops dans ton salon général avec un intervalle long : ils doivent surprendre, pas inonder' },
            { title: 'Lance une saison', body: 'Crée une saison d’un mois dans Saisons, pour que le classement reparte de bas à date fixe' },
          ],
        },
        {
          h2: 'Pour les serveurs de devs ou de joueurs',
          body: 'Une communauté technique ou gaming accroche mieux à un défi qu’à une discussion libre',
          points: [
            'Daily Algo : un défi d’algorithmique par jour, des soumissions et un classement de la semaine, consultable avec /daily-algo',
            'CTF : un Capture The Flag organisé dans Événements & quiz, où les membres valident leurs flags avec /ctf claim',
            'Le raid hebdomadaire du jeu de rôle, à suivre avec /raid',
          ],
        },
      ],
      faq: [
        {
          q: 'Comment rendre un serveur Discord plus actif ?',
          a: 'Donne aux membres une raison de revenir et un prétexte pour écrire : un rendez-vous fixe chaque semaine, des quêtes quotidiennes, des salons de jeu simples comme le comptage. Commence petit et garde ce qui prend',
        },
        {
          q: 'Pourquoi mon serveur Discord est mort ?',
          a: 'Le plus souvent, les nouveaux ne savent pas où parler, il n’y a aucun rendez-vous, ou le classement est verrouillé par les mêmes. Chaque cause a sa réponse : onboarding, événements réguliers, saisons',
        },
        {
          q: 'Comment animer un petit serveur Discord ?',
          a: 'Mise sur des jeux qui marchent à peu de monde, comme le comptage ou l’histoire à un mot, et sur un seul rendez-vous hebdomadaire. Un gros événement devant cinq personnes fait plus de mal que de bien',
        },
        {
          q: 'Quel bot pour animer un serveur Discord ?',
          a: 'Kotbo regroupe les quiz, les événements avec inscription, les quêtes, les saisons, les salons de jeu et les drops dans un seul bot, réglé depuis un dashboard web',
        },
        {
          q: 'Comment faire un quiz sur Discord ?',
          a: 'Avec Kotbo, crée un quiz dans Événements & quiz sur le dashboard, puis lance les questions une par une. Les membres répondent avec des boutons et retrouvent leurs résultats avec /event resultat',
        },
        {
          q: 'Comment faire un salon de comptage sur Discord ?',
          a: 'Active Salons fun dans le dashboard Kotbo et choisis le salon de comptage. Chacun écrit le nombre suivant à son tour, et le mode punitif remet tout à zéro à la première erreur',
        },
      ],
    },
    en: {
      title: 'How to make your Discord server active (and keep it)',
      h1: 'How to make your Discord server active, one problem at a time',
      description:
        'How to make your Discord server active: the real reasons a server goes dead and what to do about each one, with Discord’s own tools and with Kotbo.',
      lead: 'A Discord server becomes active when members have a reason to come back and talk to each other. No bot builds that for you, but every symptom of a dead server has a fix. This guide starts from the problems, then gives the Discord or Kotbo tool that goes with each',
      sections: [
        {
          h2: 'New members join and never say a word',
          body: 'A newcomer who doesn’t know where to talk ends up leaving. Start with Discord itself: native onboarding, in the server settings, asks a few questions on arrival and only shows the channels that matter. Then give them a first move that doesn’t require an introduction',
          points: [
            'A counting or one-word story channel, where joining in takes a single message',
            'A daily quest that rewards a reply, a reaction or a new thread',
            'The +rep (/rep give), so regulars can thank whoever helps, newcomers included',
          ],
        },
        {
          h2: 'The server is dead in the evening and on weekends',
          body: 'A quiet channel needs appointments. The same slot every week works better than one big surprise event: people end up remembering it. In Kotbo, it all starts in the Events & quizzes module',
          items: [
            { title: 'Live quiz', body: 'You write the questions in the dashboard, launch them one by one and members answer with buttons. Everyone checks their results with /event resultat' },
            { title: 'Event with sign-ups', body: 'An announcement with a sign-up button, a form if you want answers, and the Discord event created at the same time so it shows up in the server’s event list' },
            { title: 'Drops', body: 'The bot drops coins, XP or clan points in a channel on its own, at an unpredictable time. Depending on the mode drawn, the first click wins, the first few each win, or everyone grabs a share for a while' },
          ],
        },
        {
          h2: 'Members drop by but don’t come back',
          body: 'Coming back is a habit, and habits are built with a small daily goal. Quests are created in the dashboard from templates: messages sent, replies, reactions, threads created, minutes in voice or +rep given, daily or weekly',
          commands: [
            { name: '/quests list', body: 'Today’s and this week’s quests with their progress. A finished quest pays its coins and XP on its own' },
            { name: '/daily', body: 'The economy’s daily reward, raised as long as the streak holds' },
            { name: '/seasons current', body: 'The current season and its leaderboard' },
            { name: '/counting-stats', body: 'Counting game stats, to chase the next record' },
          ],
        },
        {
          h2: 'The same people always top the leaderboard',
          body: 'A leaderboard nobody can catch up with discourages more than it motivates. Give newcomers a shot',
          items: [
            { title: 'Seasons', body: 'A season has a name and dates. When it closes, the leaderboard is frozen and archived (/seasons leaderboard), and the prestige ranking starts again from low for everyone', link: { feature: 'leveling', label: 'Read the article on levels and XP' } },
            { title: 'Clans', body: 'Members play as a team: someone who will never finish first still helps their clan win' },
          ],
        },
        {
          h2: 'Nobody dares to start the conversation',
          body: 'Game channels give people an excuse to type. They work with just a handful of members, and that is often how a small server comes back to life. With punitive mode, a mistake resets the count or the word chain to zero. Without it, the wrong message is deleted and its author warned. Punitive mode creates lasting grudges, which is half the fun',
          points: [
            'Counting: one at a time, never twice in a row',
            'One-word story and word chain',
            'Mystery number and emoji riddles, with your own riddles if you like',
            'No yes or no allowed, and the emoji-only channel',
            'Picture of the day: one image per member per day',
            'Anonymous confessions with /confession send, which staff can unmask with /confession reveal',
          ],
        },
        {
          h2: 'One week of server activities, step by step',
          body: 'No need to turn everything on the first day. Here is a sensible start with Kotbo',
          steps: [
            { title: 'Open one or two fun channels', body: 'In the dashboard, turn on Fun channels and pick a channel for counting. Add a second game only if the first one catches on' },
            { title: 'Create three quests', body: 'In Quests, start from the templates: one for messages, one for voice, one longer weekly quest. Keep the goals reachable' },
            { title: 'Set a weekly appointment', body: 'Prepare a short quiz in Events & quizzes and announce it for the same evening every week' },
            { title: 'Turn on drops', body: 'Enable drops in your main channel with a long interval: they should surprise people, not flood the chat' },
            { title: 'Start a season', body: 'Create a one-month season in Seasons, so the leaderboard starts again from low on a fixed date' },
          ],
        },
        {
          h2: 'For developer and gaming servers',
          body: 'A tech or gaming community hooks onto a challenge more easily than onto open chat',
          points: [
            'Daily Algo: one algorithm challenge a day, submissions and a weekly leaderboard, available with /daily-algo',
            'CTF: a Capture The Flag run from Events & quizzes, where members submit flags with /ctf claim',
            'The role-playing game’s weekly raid, followed with /raid',
          ],
        },
      ],
      faq: [
        {
          q: 'How do I make my Discord server more active?',
          a: 'Give members a reason to come back and an excuse to type: a fixed weekly appointment, daily quests, simple game channels like counting. Start small and keep what catches on',
        },
        {
          q: 'Why is my Discord server dead?',
          a: 'Most of the time, newcomers don’t know where to talk, there is no regular appointment, or the same people lock the leaderboard. Each cause has its fix: onboarding, regular events, seasons',
        },
        {
          q: 'How do I grow activity on a small Discord server?',
          a: 'Bet on games that work with few people, like counting or one-word story, and on a single weekly appointment. A big event in front of five people does more harm than good',
        },
        {
          q: 'What is a good bot to keep a Discord server active?',
          a: 'Kotbo brings quizzes, events with sign-ups, quests, seasons, game channels and drops together in one bot, configured from a web dashboard',
        },
        {
          q: 'How do I host a quiz on Discord?',
          a: 'With Kotbo, create a quiz in Events & quizzes on the dashboard, then launch the questions one by one. Members answer with buttons and check their results with /event resultat',
        },
        {
          q: 'How do I make a counting channel on Discord?',
          a: 'Turn on Fun channels in the Kotbo dashboard and pick the counting channel. Everyone types the next number in turn, and punitive mode resets the count at the first mistake',
        },
      ],
    },
  },
};
