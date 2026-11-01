/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'systeme-niveaux-xp-discord', en: 'discord-leveling-system-bot' },
  date: '2026-11-01',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['leveling'],
  text: {
    fr: {
      title: 'Système de niveaux Discord : XP, rôles récompenses et classement',
      h1: 'Système de niveaux Discord : donner de l’XP et récompenser les membres',
      description:
        'Système de niveaux Discord : comment gagner de l’XP en écrivant et en vocal, régler la courbe, offrir des rôles récompenses, annoncer les niveaux et importer un ancien classement avec Kotbo.',
      lead: 'Un système de niveaux donne de l’expérience aux membres qui discutent, et un niveau à chaque palier. Discord n’a pas de niveaux en natif, c’est le travail d’un bot. Dans Kotbo, c’est le module Niveaux : tu choisis un préréglage ou tu règles les gains un par un, tu offres des rôles à certains niveaux, et la commande /rank affiche la carte de chacun',
      sections: [
        {
          h2: 'À quoi servent les niveaux sur un serveur Discord',
          body: 'Les niveaux transforment la présence en progression visible, et donnent une raison de revenir',
          points: [
            'Les membres actifs voient leur effort reconnu, avec une carte de niveau et un classement',
            'Les rôles récompenses débloquent des salons, des couleurs ou des droits au fil du temps',
            'Le staff repère les habitués sans fouiller l’historique',
            'Un nouveau comprend vite qui anime le serveur',
          ],
        },
        {
          h2: 'Ce que Discord propose sans bot',
          body: 'Rien. Discord ne mesure ni l’ancienneté d’activité ni le nombre de messages d’un membre. Pour des niveaux, il faut un bot qui compte l’activité et garde l’XP de chacun',
        },
        {
          h2: 'Mettre en place les niveaux avec Kotbo',
          body: 'Tout se règle sur dash.kotbo.fr, page Niveaux. Le module démarre éteint, et un interrupteur en haut de la page met les niveaux en pause sans rien perdre',
          steps: [
            { title: 'Choisis un préréglage', body: 'Basique, Gains rapides, Progression proportionnelle, Marathon ou Prestige. Un préréglage règle d’un coup les gains d’XP et la courbe. Tu peux ensuite affiner' },
            { title: 'Règle les gains d’XP', body: 'Par défaut, un message rapporte entre 15 et 25 XP, avec un délai de 60 secondes entre deux gains pour décourager le spam. Le vocal rapporte 5 XP par minute' },
            { title: 'Choisis le salon des annonces', body: 'Les montées de niveau s’affichent dans un salon dédié, dans le salon où le membre a écrit, ou en message privé. Le message est modifiable' },
            { title: 'Ajoute des rôles récompenses', body: 'Un niveau, un rôle : le membre le reçoit en atteignant le niveau. Tu peux les cumuler ou ne garder que le plus élevé' },
            { title: 'Active le module', body: 'Dès lors, chaque message compte. Les niveaux se calculent toujours depuis l’XP totale' },
          ],
        },
        {
          h2: 'La courbe de progression',
          body: 'L’XP nécessaire pour monter se calcule avec une formule : base × niveau^exposant + linéaire × niveau. Deux curseurs suffisent pour la plupart des serveurs, et un aperçu montre l’effet tout de suite',
          items: [
            { title: 'Rythme de progression', body: 'De très rapide à très lent. Un serveur qui démarre veut des niveaux qui s’enchaînent, un serveur de plusieurs années veut qu’ils se méritent' },
            { title: 'Écart entre les niveaux', body: 'Plus il est fort, plus chaque niveau coûte cher par rapport au précédent' },
            { title: 'Niveau maximum', body: 'À 0, aucun plafond. Au plafond, l’XP continue de s’accumuler mais le niveau ne bouge plus' },
            { title: 'Changer la courbe plus tard', body: 'Le niveau est recalculé depuis l’XP totale : personne ne perd d’XP, mais les niveaux se redistribuent. Le dashboard indique combien de membres changeront de niveau avant que tu enregistres' },
          ],
        },
        {
          h2: 'Régler finement les gains d’XP',
          body: 'Au-delà des préréglages, l’onglet Gains d’XP règle chaque cas',
          items: [
            { title: 'Multiplicateurs par rôle', body: 'Un rôle peut rapporter plus d’XP, par exemple pour les soutiens du serveur ou les membres premium' },
            { title: 'Bonus selon la longueur', body: 'Plus un message est long, plus il rapporte, jusqu’à un multiplicateur maximum. Utile pour valoriser les vrais messages plutôt que les « ok »' },
            { title: 'Exclusions', body: 'Des salons, des catégories et des rôles qui ne rapportent aucune XP, comme #spam ou #bots' },
            { title: 'Règles du vocal', body: 'Par défaut, le vocal ne rapporte rien si le membre est muet ou sourd, ou dans le salon AFK' },
            { title: 'Boost du clan gagnant', body: 'Si tu utilises les clans, les membres du clan gagnant de la dernière saison gagnent plus d’XP automatiquement' },
          ],
        },
        {
          h2: 'Importer un ancien classement',
          body: 'Tu changes de bot de niveaux et tu ne veux pas repartir de zéro ? L’onglet Importer charge un fichier JSON : une liste de membres avec leur XP ou leur niveau. Kotbo retrouve chaque membre par son nom d’utilisateur, son nom d’affichage ou son tag. Si seul l’XP est fournie, le niveau est déduit, et si seul le niveau est fourni, l’XP minimale de ce niveau est attribuée. Une analyse à blanc montre ce qui changerait avant d’écrire quoi que ce soit',
        },
        {
          h2: 'Les commandes pour les membres',
          body: 'Les membres suivent leur progression avec deux commandes',
          commands: [
            { name: '/rank membre:<membre>', body: 'Affiche la carte de niveau et d’expérience, la tienne par défaut, avec un bouton pour la personnaliser' },
            { name: '/leaderboard', body: 'Affiche le classement du serveur. Le dashboard propose aussi un classement public, avec une page par serveur' },
          ],
        },
      ],
      faq: [
        {
          q: 'Comment faire un système de niveaux sur Discord ?',
          a: 'Discord n’en a pas en natif. Avec Kotbo, ouvre la page Niveaux du dashboard, choisis un préréglage, le salon des annonces et les rôles récompenses, puis active le module',
        },
        {
          q: 'Combien d’XP gagne-t-on par message ?',
          a: 'Par défaut, entre 15 et 25 XP, avec 60 secondes minimum entre deux gains. Tu peux changer les deux valeurs, ou choisir un préréglage plus généreux',
        },
        {
          q: 'Le vocal donne-t-il de l’XP ?',
          a: 'Oui, 5 XP par minute par défaut. Le vocal ne rapporte rien si le membre est muet ou sourd, ou dans le salon AFK, sauf si tu changes ces règles',
        },
        {
          q: 'Peut-on donner un rôle à un certain niveau ?',
          a: 'Oui. Dans Rôles récompenses, associe un niveau à un rôle. Tu choisis si les membres gardent tous les rôles obtenus ou seulement le plus élevé',
        },
        {
          q: 'Que se passe-t-il si je change la courbe ?',
          a: 'Le niveau est toujours recalculé depuis l’XP totale. Personne ne perd d’XP, mais certains membres changent de niveau, et le dashboard te dit combien avant d’enregistrer',
        },
        {
          q: 'Peut-on exclure des salons ou des rôles ?',
          a: 'Oui. Les salons, catégories et rôles exclus ne rapportent aucune XP. Une liste noire commune peut aussi couper la progression sur les niveaux, l’économie, les quêtes ou les clans en une seule fois',
        },
        {
          q: 'Comment récupérer les niveaux d’un autre bot ?',
          a: 'Exporte la liste des membres avec leur XP ou leur niveau au format JSON, puis charge-la dans l’onglet Importer. Lance d’abord l’analyse à blanc pour vérifier le résultat',
        },
      ],
    },
    en: {
      title: 'Discord leveling system: XP, reward roles and leaderboard',
      h1: 'Discord leveling system: give XP and reward your members',
      description:
        'Discord leveling system: how members earn XP by chatting and in voice, how to tune the curve, hand out reward roles, announce level-ups and import an old leaderboard with Kotbo.',
      lead: 'A leveling system gives experience to members who chat, and a level at each milestone. Discord has no levels built in, that’s a bot’s job. In Kotbo it’s the Levels module: you pick a preset or tune the gains one by one, hand out roles at certain levels, and the /rank command shows everyone’s card',
      sections: [
        {
          h2: 'What levels are for on a Discord server',
          body: 'Levels turn presence into visible progress, and give people a reason to come back',
          points: [
            'Active members see their effort recognized, with a level card and a leaderboard',
            'Reward roles unlock channels, colors or permissions over time',
            'Staff spot the regulars without digging through history',
            'A newcomer quickly sees who keeps the server alive',
          ],
        },
        {
          h2: 'What Discord offers without a bot',
          body: 'Nothing. Discord doesn’t measure how long a member has been active or how many messages they sent. For levels you need a bot that counts activity and keeps everyone’s XP',
        },
        {
          h2: 'Setting up levels with Kotbo',
          body: 'Everything is set on dash.kotbo.fr, in the Levels page. The module starts off, and a switch at the top of the page pauses levels without losing anything',
          steps: [
            { title: 'Pick a preset', body: 'Basic, Fast gains, Proportional progression, Marathon or Prestige. A preset sets the XP gains and the curve in one go. You can fine-tune afterwards' },
            { title: 'Set the XP gains', body: 'By default a message earns between 15 and 25 XP, with a 60-second delay between two gains to discourage spam. Voice earns 5 XP per minute' },
            { title: 'Choose the announcement channel', body: 'Level-ups show in a dedicated channel, in the channel where the member wrote, or by direct message. The message is editable' },
            { title: 'Add reward roles', body: 'One level, one role: the member gets it on reaching the level. You can stack them or keep only the highest' },
            { title: 'Turn the module on', body: 'From then on every message counts. Levels are always computed from total XP' },
          ],
        },
        {
          h2: 'The progression curve',
          body: 'The XP needed to level up comes from a formula: base × level^exponent + linear × level. Two sliders are enough for most servers, and a preview shows the effect right away',
          items: [
            { title: 'Progression pace', body: 'From very fast to very slow. A new server wants levels that come quickly, a years-old server wants them earned' },
            { title: 'Gap between levels', body: 'The stronger it is, the more each level costs compared to the previous one' },
            { title: 'Maximum level', body: '0 means no cap. At the cap XP keeps accumulating but the level stops moving' },
            { title: 'Changing the curve later', body: 'The level is recomputed from total XP: nobody loses XP, but levels get redistributed. The dashboard tells you how many members will change level before you save' },
          ],
        },
        {
          h2: 'Fine-tuning XP gains',
          body: 'Beyond presets, the XP gains tab handles every case',
          items: [
            { title: 'Role multipliers', body: 'A role can earn more XP, for example for server supporters or premium members' },
            { title: 'Length bonus', body: 'The longer a message, the more it earns, up to a maximum multiplier. Useful to reward real messages over a bare “ok”' },
            { title: 'Exclusions', body: 'Channels, categories and roles that earn no XP, like #spam or #bots' },
            { title: 'Voice rules', body: 'By default voice earns nothing if the member is muted or deafened, or in the AFK channel' },
            { title: 'Winning clan boost', body: 'If you use clans, members of the last season’s winning clan earn more XP automatically' },
          ],
        },
        {
          h2: 'Importing an old leaderboard',
          body: 'Switching leveling bots and don’t want to start from zero? The Import tab loads a JSON file: a list of members with their XP or level. Kotbo matches each member by username, display name or tag. If only XP is given, the level is derived, and if only the level is given, the minimum XP for that level is assigned. A dry run shows what would change before anything is written',
        },
        {
          h2: 'Commands for members',
          body: 'Members follow their progress with two commands',
          commands: [
            { name: '/rank membre:<member>', body: 'Shows the level and experience card, yours by default, with a button to customize it' },
            { name: '/leaderboard', body: 'Shows the server leaderboard. The dashboard also offers a public leaderboard, with a page per server' },
          ],
        },
      ],
      faq: [
        {
          q: 'How do I make a leveling system on Discord?',
          a: 'Discord has no native one. With Kotbo, open the Levels page of the dashboard, pick a preset, the announcement channel and the reward roles, then turn the module on',
        },
        {
          q: 'How much XP does a message give?',
          a: 'By default between 15 and 25 XP, with at least 60 seconds between two gains. You can change both values, or pick a more generous preset',
        },
        {
          q: 'Does voice chat give XP?',
          a: 'Yes, 5 XP per minute by default. Voice earns nothing if the member is muted or deafened, or in the AFK channel, unless you change those rules',
        },
        {
          q: 'Can I give a role at a certain level?',
          a: 'Yes. In Reward roles, pair a level with a role. You choose whether members keep every role they earned or only the highest',
        },
        {
          q: 'What happens if I change the curve?',
          a: 'The level is always recomputed from total XP. Nobody loses XP, but some members change level, and the dashboard tells you how many before you save',
        },
        {
          q: 'Can I exclude channels or roles?',
          a: 'Yes. Excluded channels, categories and roles earn no XP. A shared blacklist can also cut progression across levels, economy, quests and clans at once',
        },
        {
          q: 'How do I bring levels over from another bot?',
          a: 'Export the member list with their XP or level as JSON, then load it in the Import tab. Run the dry run first to check the result',
        },
      ],
    },
  },
};
