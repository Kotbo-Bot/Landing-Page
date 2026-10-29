/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'rappel-bump-discord', en: 'discord-bump-reminder' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['bump_reminder', 'analytics'],
  text: {
    fr: {
      title: 'Rappel de bump Discord : ne plus rater un bump',
      h1: 'Rappel de bump sur Discord : savoir quand rebumper sans compter',
      description:
        'Rappel de bump Discord : comment marche le bump sur Disboard et les autres annuaires, puis un rappel automatique avec Kotbo dès que ton serveur peut rebumper.',
      lead: 'Bumper un serveur, c’est taper /bump pour le faire remonter dans un annuaire comme Disboard. Chaque site impose un délai entre deux bumps, et c’est le délai qu’on oublie. Kotbo repère tes bumps tout seul et poste un rappel dès que le suivant est possible',
      sections: [
        {
          h2: 'Comment marche un bump',
          body: 'Les annuaires de serveurs Discord classent les serveurs par date de dernier bump. Tu ajoutes leur bot à ton serveur, un membre tape /bump, et le serveur remonte en tête de liste jusqu’à ce que d’autres bumpent à leur tour',
          points: [
            'Chaque site a son délai : sur Disboard, c’est un bump toutes les 2 heures',
            'Un /bump trop tôt est refusé, et le serveur ne gagne rien',
            'Un bump raté, c’est des heures en bas de la liste pendant que les autres remontent',
          ],
        },
        {
          h2: 'Et sans annuaire ?',
          body: 'Discord a son propre répertoire, la Découverte de serveurs, réservé aux serveurs Communauté qui remplissent ses critères. On n’y bumpe pas : Discord choisit qui il met en avant. Pour la plupart des serveurs qui démarrent, les annuaires restent la façon la plus directe de se faire voir. Ils marchent mieux avec une description soignée et des tags qui collent à ton serveur, puisque c’est ce que lisent les visiteurs avant de cliquer',
        },
        {
          h2: 'Ce que fait le rappel de bump de Kotbo',
          body: 'Le module Rappel de bump est allumé par défaut et n’a rien à régler. Il reconnaît les bumps de quatre annuaires',
          items: [
            { title: 'Disboard, Discadia, DiscordServers.com, Disforge', body: 'Kotbo lit la réponse publique de leur bot à la commande /bump. Il reconnaît à la fois le bot qui répond et la commande d’origine, pour ne pas confondre un bump avec une pub ou un classement posté par le même bot' },
            { title: 'Le bon délai pour chaque site', body: 'Kotbo garde le délai de chaque annuaire et calcule l’heure du prochain bump possible' },
            { title: 'Le rappel au bon endroit', body: 'Dès que la fenêtre s’ouvre, un message « Rappel de bump » arrive dans le salon du dernier bump, avec le nom de l’annuaire et celui du dernier membre qui a bumpé' },
            { title: 'Sans ping', body: 'Le rappel nomme le dernier bumpeur mais ne notifie personne. Ton salon de bump reste supportable' },
          ],
        },
        {
          h2: 'Mettre en place le rappel',
          body: 'Rien à configurer côté Kotbo, juste une habitude à prendre',
          steps: [
            { title: 'Ajoute le bot de l’annuaire', body: 'Inscris ton serveur sur l’annuaire de ton choix et invite son bot' },
            { title: 'Garde un salon pour les bumps', body: 'Un salon dédié, où Kotbo peut lire et écrire. C’est là que le rappel arrivera' },
            { title: 'Bumpe une première fois', body: 'Tape /bump. Kotbo repère la réponse et note l’heure du prochain bump' },
            { title: 'Attends le rappel', body: 'Quand il arrive, le premier qui passe rebumpe, et le cycle repart' },
          ],
        },
        {
          h2: 'Voir le prochain bump sans ouvrir Discord',
          body: 'Sur dash.kotbo.fr, la page Santé du serveur affiche l’état du bump : le temps avant le prochain, ou un signal quand il est déjà possible. Le rappel n’envoie qu’un message par fenêtre : si personne ne rebumpe, il ne relance pas en boucle',
        },
        {
          h2: 'Savoir si tes bumps ramènent du monde',
          body: 'Bumper ne sert à rien si personne ne reste. Les invitations de Kotbo comptent qui fait venir qui, et surtout qui reste. Pour le reste, l’onglet Comparer de la page Statistiques met une semaine de bumps réguliers face à une semaine sans, et tu sais si l’effort paie',
          commands: [
            { name: '/invites stats', body: 'Pour toi ou un autre membre : invitations totales, membres encore présents, partis, et taux de rétention' },
            { name: '/invites leaderboard', body: 'Le classement des inviteurs, trié sur le nombre de membres restés plutôt que sur le total' },
          ],
        },
        {
          h2: 'Mesurer une pub ou un partenariat',
          body: 'Le bump n’est qu’un canal parmi d’autres. Pour comparer, Kotbo rattache les arrivées à leur source quand tu lui en donnes le moyen',
          items: [
            { title: 'Un code d’invitation par campagne', body: 'Dans le module Campagnes, attache un code d’invitation : les arrivées passées par ce code depuis la date de départ sont créditées à la campagne' },
            { title: 'Les partenariats', body: 'Le module Partenariats suit tes partenaires, les publicités croisées et ce qu’elles rapportent. Il est éteint par défaut, à allumer dans Modules' },
          ],
        },
      ],
      faq: [
        {
          q: 'Comment avoir un rappel de bump sur Discord ?',
          a: 'Il faut un bot qui repère tes bumps et compte le délai. Kotbo le fait sans réglage : il lit la réponse de l’annuaire à /bump et poste un rappel dans le même salon quand le bump suivant est possible',
        },
        {
          q: 'Toutes les combien de temps on peut bump sur Disboard ?',
          a: 'Disboard accepte un bump toutes les 2 heures. Un /bump tapé avant est refusé',
        },
        {
          q: 'Quels annuaires Kotbo reconnaît-il ?',
          a: 'Disboard, Discadia, DiscordServers.com et Disforge. Kotbo reconnaît leur bot et la commande /bump à l’origine de la réponse',
        },
        {
          q: 'Est-ce que le rappel ping tout le serveur ?',
          a: 'Non. Le rappel nomme le dernier membre qui a bumpé mais n’envoie aucune notification',
        },
        {
          q: 'Pourquoi Kotbo n’a pas vu mon bump ?',
          a: 'Kotbo ne voit que les réponses publiques. Un /bump refusé parce que trop tôt n’est visible que de celui qui l’a tapé, donc il n’est pas compté, et c’est voulu',
        },
        {
          q: 'Est-ce que je peux couper le rappel de bump ?',
          a: 'Oui. Éteins le module Rappel de bump dans Modules du dashboard : Kotbo arrête alors de repérer les bumps de ton serveur',
        },
        {
          q: 'Comment savoir qui a fait venir le plus de membres ?',
          a: 'Tape /invites leaderboard : Kotbo classe les inviteurs sur le nombre de membres encore présents, pas sur le total brut',
        },
      ],
    },
    en: {
      title: 'Discord bump reminder: never miss a bump again',
      h1: 'Discord bump reminder: know when to bump again without keeping count',
      description:
        'Discord bump reminder: how bumping works on Disboard and other server lists, then an automatic reminder with Kotbo as soon as your server can be bumped again.',
      lead: 'Bumping a server means typing /bump to push it back up a server list like Disboard. Every site sets a cooldown between bumps, and that cooldown is what people forget. Kotbo spots your bumps on its own and posts a reminder as soon as the next one is possible',
      sections: [
        {
          h2: 'How bumping works',
          body: 'Discord server lists rank servers by their last bump. You add their bot to your server, a member types /bump, and the server jumps to the top of the list until others bump in turn',
          points: [
            'Each site has its own cooldown: on Disboard, one bump every 2 hours',
            'A /bump typed too early is refused, and the server gains nothing',
            'A missed bump means hours at the bottom of the list while others climb',
          ],
        },
        {
          h2: 'What about Discord’s own directory?',
          body: 'Discord has Server Discovery, kept for Community servers that meet its criteria. You can’t bump there: Discord picks who gets featured. For most servers starting out, server lists stay the most direct way to get seen. They work better with a clear description and tags that fit your server, since that’s what visitors read before clicking',
        },
        {
          h2: 'What Kotbo’s bump reminder does',
          body: 'The Bump reminder module is on by default and has nothing to set up. It recognizes bumps on four server lists',
          items: [
            { title: 'Disboard, Discadia, DiscordServers.com, Disforge', body: 'Kotbo reads their bot’s public reply to the /bump command. It checks both the bot that replies and the command behind it, so an ad or a ranking posted by the same bot never counts as a bump' },
            { title: 'The right cooldown for each site', body: 'Kotbo keeps each list’s cooldown and works out when the next bump is possible' },
            { title: 'The reminder in the right place', body: 'As soon as the window opens, a reminder lands in the channel of the last bump, naming the list and the last member who bumped' },
            { title: 'No ping', body: 'The reminder names the last bumper but notifies nobody. Your bump channel stays bearable' },
          ],
        },
        {
          h2: 'Setting up the reminder',
          body: 'Nothing to configure on Kotbo’s side, just a habit to build',
          steps: [
            { title: 'Add the server list’s bot', body: 'List your server on the site of your choice and invite its bot' },
            { title: 'Keep one channel for bumps', body: 'A dedicated channel where Kotbo can read and write. That’s where the reminder will land' },
            { title: 'Bump once', body: 'Type /bump. Kotbo spots the reply and records when the next bump is due' },
            { title: 'Wait for the reminder', body: 'When it shows up, whoever is around bumps again, and the cycle restarts' },
          ],
        },
        {
          h2: 'Checking the next bump without opening Discord',
          body: 'On dash.kotbo.fr, the Server health page shows the bump status: time left before the next one, or a signal when it’s already open. The reminder sends one message per window: if nobody bumps, it doesn’t keep nagging',
        },
        {
          h2: 'Finding out if bumps bring people in',
          body: 'Bumping is pointless if nobody stays. Kotbo’s invite tracking counts who brings in whom, and above all who stays. Beyond that, the Compare tab on the Statistics page puts a week of steady bumps next to a week without, so you know if it’s worth the effort',
          commands: [
            { name: '/invites stats', body: 'For you or another member: total invites, members still here, members who left, and retention rate' },
            { name: '/invites leaderboard', body: 'The inviter ranking, sorted by members who stayed rather than the raw total' },
          ],
        },
        {
          h2: 'Measuring an ad or a partnership',
          body: 'Bumping is one channel among others. To compare, Kotbo ties joins to their source when you give it a way to',
          items: [
            { title: 'One invite code per campaign', body: 'In the Campaigns module, attach an invite code: joins through that code since the start date are credited to the campaign' },
            { title: 'Partnerships', body: 'The Partnerships module tracks your partners, cross-promotions and what they bring in. It’s off by default, turn it on in Modules' },
          ],
        },
      ],
      faq: [
        {
          q: 'How do I get a bump reminder on Discord?',
          a: 'You need a bot that spots your bumps and tracks the cooldown. Kotbo does it with no setup: it reads the server list’s reply to /bump and posts a reminder in the same channel when the next bump is possible',
        },
        {
          q: 'How often can you bump on Disboard?',
          a: 'Disboard accepts one bump every 2 hours. A /bump typed earlier is refused',
        },
        {
          q: 'Which server lists does Kotbo recognize?',
          a: 'Disboard, Discadia, DiscordServers.com and Disforge. Kotbo recognizes their bot and the /bump command behind the reply',
        },
        {
          q: 'Does the bump reminder ping the whole server?',
          a: 'No. The reminder names the last member who bumped but sends no notification',
        },
        {
          q: 'Why didn’t Kotbo see my bump?',
          a: 'Kotbo only sees public replies. A /bump refused for being too early is only visible to whoever typed it, so it doesn’t count, on purpose',
        },
        {
          q: 'Can I turn the bump reminder off?',
          a: 'Yes. Turn off the Bump reminder module in Modules on the dashboard: Kotbo then stops tracking bumps on your server',
        },
        {
          q: 'How do I see who invited the most members?',
          a: 'Type /invites leaderboard: Kotbo ranks inviters by members still on the server, not by the raw total',
        },
      ],
    },
  },
};
