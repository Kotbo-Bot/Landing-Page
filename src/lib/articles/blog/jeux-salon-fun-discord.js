/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'jeux-salon-fun-discord', en: 'discord-counting-game-bot' },
  date: '2026-11-01',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['fun'],
  text: {
    fr: {
      title: 'Jeux Discord pour salon : comptage, chaîne de mots et plus',
      h1: 'Jeux de salon Discord : comptage, chaîne de mots, rébus et autres',
      description:
        'Jeux de salon Discord : comment lancer un salon de comptage, une chaîne de mots, un rébus emoji, un nombre mystère ou Ni oui ni non avec Kotbo, sans rien modérer à la main.',
      lead: 'Un salon de jeu, c’est un salon où une règle simple fait vivre la conversation : compter, enchaîner des mots, deviner un nombre. Les membres s’y croisent sans effort, et le salon se régule seul. Discord ne vérifie pas les règles d’un jeu, c’est le rôle d’un bot. Dans Kotbo, ces jeux sont regroupés dans le module Salons fun, et chacun a son salon',
      sections: [
        {
          h2: 'Pourquoi des salons de jeu sur un serveur',
          body: 'Un jeu donne aux membres une raison d’écrire sans avoir quelque chose à dire',
          points: [
            'Les petits jeux attirent les membres qui ne se lancent pas dans une grande discussion',
            'Un record collectif donne un but commun, et un classement donne envie de revenir',
            'Les règles sont simples, donc un nouvel arrivant comprend vite',
            'Les erreurs se corrigent toutes seules, sans qu’un modo intervienne',
          ],
        },
        {
          h2: 'Ce que Discord propose sans bot',
          body: 'Rien pour vérifier qu’un message respecte la règle d’un jeu. Sans bot, un modo doit surveiller le salon et supprimer les mauvaises réponses à la main, ce qui ne tient pas longtemps',
        },
        {
          h2: 'Les jeux que Kotbo propose',
          body: 'Chaque jeu a son salon à désigner, et le bot supprime ou refuse tout message qui ne respecte pas la règle',
          items: [
            { title: 'Comptage', body: 'Les membres comptent 1, 2, 3… à tour de rôle. Le bot suit le nombre actuel et le record du serveur, et garde les stats de chaque joueur' },
            { title: 'Chaîne de mots', body: 'Chaque mot doit commencer par la dernière lettre du précédent' },
            { title: 'One word story', body: 'Une histoire écrite un mot après l’autre. Les mauvais messages sont supprimés et les doubles envois bloqués' },
            { title: 'Ni Oui ni Non', body: 'Interdit de répondre par oui ou par non : tout message qui contient l’un des deux est supprimé' },
            { title: 'Emoji uniquement', body: 'Seuls les emojis sont autorisés, tout le reste est supprimé' },
            { title: 'Rébus emoji', body: 'Deviner l’expression cachée derrière une suite d’emojis. Un nouveau rébus se génère d’un clic' },
            { title: 'Nombre mystère', body: 'Deviner un chiffre choisi par le bot. Une nouvelle cible se génère d’un clic' },
            { title: 'Image du jour', body: 'Chacun poste l’image qu’il trouve la meilleure de la journée, de 00:00 à 23:59. Un message sans image ou une deuxième image dans la journée est supprimé, avec une explication' },
          ],
        },
        {
          h2: 'Mettre en place un jeu avec Kotbo',
          body: 'Tout se règle sur dash.kotbo.fr, page Salons fun',
          steps: [
            { title: 'Crée un salon par jeu', body: 'Un salon dédié, nommé clairement (#comptage, #chaine-de-mots). Un jeu par salon' },
            { title: 'Désigne le salon dans le dashboard', body: 'Chaque jeu a sa carte avec son sélecteur de salon' },
            { title: 'Choisis le mode punitif ou non', body: 'En mode punitif, une erreur au comptage ou dans la chaîne de mots remet le jeu à zéro. Désactivé, le message fautif est supprimé et son auteur prévenu, sans casser la progression' },
            { title: 'Épingle la règle', body: 'Un message court qui explique le jeu évite les premières erreurs' },
            { title: 'Réinitialise quand il le faut', body: 'Le dashboard permet de remettre le comptage à zéro, de réinitialiser la chaîne de mots ou de générer un nouveau rébus ou un nouveau nombre mystère' },
          ],
        },
        {
          h2: 'Suivre le jeu de comptage',
          body: 'Le comptage a sa propre commande de statistiques',
          commands: [
            { name: '/stats-compteur', body: 'Affiche le nombre actuel, le record, le salon de comptage, la dernière activité, ton score, tes nombres corrects et ratés, et les meilleurs joueurs. Si le comptage n’est pas configuré, la commande le dit' },
          ],
        },
        {
          h2: 'Éviter les pièges',
          body: 'Un salon de jeu bien lancé s’anime tout seul, mal lancé il reste vide',
          points: [
            'Choisis le mode punitif seulement si ta communauté l’accepte : un reset en pleine série en décourage certains',
            'Ne mélange pas deux jeux dans le même salon, le bot ne s’y retrouverait pas',
            'Annonce les records : un record battu est une raison de se reconnecter',
            'Retire un jeu qui ne prend pas au bout de quelques semaines plutôt que de laisser un salon mort',
          ],
        },
      ],
      faq: [
        {
          q: 'Comment faire un salon de comptage sur Discord ?',
          a: 'Avec Kotbo, ouvre la page Salons fun du dashboard, désigne ton salon de comptage et active le module. Le bot suit le nombre actuel, le record et les stats de chaque joueur',
        },
        {
          q: 'Quel bot de jeux Discord choisir pour un salon ?',
          a: 'Plusieurs bots proposent un comptage. Celui de Kotbo propose huit jeux de salon dans le même module, avec un mode punitif ou non et un suivi des records',
        },
        {
          q: 'Que se passe-t-il quand quelqu’un se trompe en comptant ?',
          a: 'Ça dépend du mode punitif. Activé, le comptage repart de zéro. Désactivé, le message fautif est supprimé et son auteur prévenu, sans casser la progression',
        },
        {
          q: 'Peut-on voir le record du comptage ?',
          a: 'Oui, avec /stats-compteur, qui affiche aussi le nombre actuel, ton score et les meilleurs joueurs',
        },
        {
          q: 'Peut-on remettre un jeu à zéro ?',
          a: 'Oui, depuis le dashboard : le comptage, la chaîne de mots, le rébus emoji et le nombre mystère ont chacun leur bouton de réinitialisation',
        },
        {
          q: 'Faut-il modérer un salon de jeu à la main ?',
          a: 'Non, le bot supprime les messages qui ne respectent pas la règle du jeu, comme un mot qui ne commence pas par la bonne lettre',
        },
      ],
    },
    en: {
      title: 'Discord channel games: counting, word chain and more',
      h1: 'Discord channel games: counting, word chain, emoji riddles and more',
      description:
        'Discord channel games: how to run a counting channel, a word chain, an emoji riddle, a mystery number or No Yes No with Kotbo, with nothing to moderate by hand.',
      lead: 'A game channel is a channel where one simple rule keeps conversation going: count, chain words, guess a number. Members cross paths effortlessly, and the channel polices itself. Discord doesn’t check a game’s rules, that’s a bot’s job. In Kotbo these games are grouped in the Fun channels module, and each has its own channel',
      sections: [
        {
          h2: 'Why have game channels on a server',
          body: 'A game gives members a reason to write without needing something to say',
          points: [
            'Small games attract members who won’t dive into a big discussion',
            'A shared record gives a common goal, and a leaderboard brings people back',
            'The rules are simple, so a newcomer gets it fast',
            'Mistakes fix themselves, with no mod stepping in',
          ],
        },
        {
          h2: 'What Discord offers without a bot',
          body: 'Nothing to check that a message follows a game’s rule. Without a bot, a mod has to watch the channel and delete wrong answers by hand, which doesn’t last',
        },
        {
          h2: 'The games Kotbo offers',
          body: 'Each game has its own channel to pick, and the bot deletes or rejects any message that breaks the rule',
          items: [
            { title: 'Counting', body: 'Members count 1, 2, 3… in turn. The bot tracks the current number and the server record, and keeps each player’s stats' },
            { title: 'Word chain', body: 'Each word must start with the last letter of the previous one' },
            { title: 'One word story', body: 'A story written one word at a time. Wrong messages are deleted and double posts blocked' },
            { title: 'No Yes No', body: 'Answering yes or no is forbidden: any message containing either one is deleted' },
            { title: 'Emoji only', body: 'Only emojis are allowed, everything else is deleted' },
            { title: 'Emoji riddle', body: 'Guess the phrase hidden behind a string of emojis. A new riddle is generated in one click' },
            { title: 'Mystery number', body: 'Guess a number picked by the bot. A new target is generated in one click' },
            { title: 'Image of the day', body: 'Everyone posts the image they find best of the day, from 00:00 to 23:59. A message without an image or a second image in the same day is deleted, with an explanation' },
          ],
        },
        {
          h2: 'Setting up a game with Kotbo',
          body: 'Everything is set on dash.kotbo.fr, in the Fun channels page',
          steps: [
            { title: 'Create one channel per game', body: 'A dedicated channel with a clear name (#counting, #word-chain). One game per channel' },
            { title: 'Pick the channel in the dashboard', body: 'Each game has its card with a channel selector' },
            { title: 'Choose punitive mode or not', body: 'In punitive mode a mistake in counting or the word chain resets the game. Off, the offending message is deleted and its author warned, without breaking progress' },
            { title: 'Pin the rule', body: 'A short message explaining the game avoids the first mistakes' },
            { title: 'Reset when needed', body: 'The dashboard lets you reset the counting, reset the word chain, or generate a new riddle or mystery number' },
          ],
        },
        {
          h2: 'Following the counting game',
          body: 'Counting has its own stats command',
          commands: [
            { name: '/counting-stats', body: 'Shows the current number, the record, the counting channel, the last activity, your score, your correct and failed numbers, and the top players. If counting isn’t set up, the command says so' },
          ],
        },
        {
          h2: 'Avoiding the traps',
          body: 'A well-launched game channel livens up on its own, a badly launched one stays empty',
          points: [
            'Choose punitive mode only if your community accepts it: a reset in the middle of a run discourages some',
            'Don’t mix two games in the same channel, the bot wouldn’t cope',
            'Announce records: a broken record is a reason to log back in',
            'Drop a game that doesn’t catch on after a few weeks instead of leaving a dead channel',
          ],
        },
      ],
      faq: [
        {
          q: 'How do I make a counting channel on Discord?',
          a: 'With Kotbo, open the Fun channels page of the dashboard, pick your counting channel and turn the module on. The bot tracks the current number, the record and each player’s stats',
        },
        {
          q: 'Which game bot should I use for a Discord channel?',
          a: 'Several bots offer counting. Kotbo’s offers eight channel games in the same module, with a punitive mode or not and record tracking',
        },
        {
          q: 'What happens when someone gets the count wrong?',
          a: 'It depends on punitive mode. On, the count starts again from zero. Off, the offending message is deleted and its author warned, without breaking progress',
        },
        {
          q: 'Can I see the counting record?',
          a: 'Yes, with /counting-stats, which also shows the current number, your score and the top players',
        },
        {
          q: 'Can I reset a game?',
          a: 'Yes, from the dashboard: counting, word chain, emoji riddle and mystery number each have their reset button',
        },
        {
          q: 'Do I have to moderate a game channel by hand?',
          a: 'No, the bot deletes messages that break the game’s rule, like a word that doesn’t start with the right letter',
        },
      ],
    },
  },
};
