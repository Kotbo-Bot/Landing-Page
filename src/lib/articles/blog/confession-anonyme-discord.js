/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'confession-anonyme-discord', en: 'discord-anonymous-confession-bot' },
  date: '2026-11-01',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['fun'],
  text: {
    fr: {
      title: 'Confession anonyme Discord : créer un salon de confessions',
      h1: 'Confession anonyme Discord : un salon où l’on écrit sans nom',
      description:
        'Confession anonyme Discord : comment créer un salon de confessions numérotées, garder la modération du staff et révéler l’auteur en cas d’abus, avec Kotbo.',
      lead: 'Un salon de confessions laisse les membres écrire sans que leur nom apparaisse : une pensée, un aveu, une question gênante. Sur Discord, le message d’un membre affiche toujours son auteur, il faut donc un bot pour relayer. Avec Kotbo, un membre tape /confession envoyer, le bot publie le texte sous un numéro, et un administrateur garde la possibilité de lever l’anonymat si ça dérape',
      sections: [
        {
          h2: 'À quoi sert un salon de confessions',
          body: 'Certains membres ne diront jamais en public ce qu’ils diraient sans nom. Un salon de confessions libère la parole, et nourrit des discussions que le serveur n’aurait pas eues autrement',
          points: [
            'Les membres timides ou en difficulté osent écrire',
            'Les confessions drôles ou touchantes lancent des conversations',
            'Le serveur garde un ton plus humain, plus proche',
            'Le staff voit des sujets qui ne seraient jamais remontés autrement',
          ],
        },
        {
          h2: 'Ce que Discord propose sans bot',
          body: 'Rien. Un message envoyé par un membre porte toujours son nom. Les messages anonymes passent par un bot qui publie à la place de l’auteur. Le point délicat est donc ce que le bot garde en coulisses, et qui peut y accéder',
        },
        {
          h2: 'Configurer les confessions avec Kotbo',
          body: 'Le salon se règle depuis la page Salons fun du dashboard, ou avec une commande réservée aux administrateurs',
          steps: [
            { title: 'Active les salons fun', body: 'Le module Salons fun regroupe les confessions et les jeux de salon. Il doit être activé' },
            { title: 'Choisis le salon public', body: 'Là où les confessions apparaîtront, avec /confession salon ou depuis le dashboard' },
            { title: 'Ajoute un salon de journal pour le staff', body: 'Facultatif, mais recommandé : chaque confession y est notée, sans son texte ni son auteur, et chaque révélation y est tracée' },
            { title: 'Explique les règles', body: 'Dis dans le règlement ce qui est interdit, et que l’anonymat peut être levé en cas d’abus' },
          ],
        },
        {
          h2: 'Comment un membre confesse',
          body: 'Une seule commande suffit, et personne ne voit qui l’a tapée',
          commands: [
            { name: '/confession envoyer message:<texte>', body: 'Publie une confession anonyme dans le salon prévu. Maximum 1500 caractères, avec 60 secondes d’attente entre deux envois' },
            { name: '/confession salon salon:<salon> log:<salon>', body: 'Réservé aux administrateurs. Choisit le salon public et, en option, le salon privé du staff' },
            { name: '/confession reveler numero:<numéro>', body: 'Réservé aux administrateurs. Révèle l’auteur d’une confession à celui qui lance la commande' },
          ],
        },
        {
          h2: 'Être honnête sur l’anonymat',
          body: 'Une confession est anonyme pour les membres, pas pour les administrateurs. Kotbo garde l’auteur de chaque confession pour pouvoir le révéler à un administrateur en cas d’abus : harcèlement, menaces, contenu interdit. La révélation est réservée aux administrateurs, et chaque révélation est notée dans le journal du staff. Dis-le clairement dans ton règlement : un membre qui confesse doit savoir à quoi s’en tenir',
          points: [
            'Le salon public n’affiche jamais l’auteur, seulement « Confession #numéro »',
            'Aucune mention ne peut partir d’une confession, pour éviter de pinger quelqu’un sans nom',
            'Le dashboard liste les dernières confessions sans jamais montrer l’auteur',
          ],
        },
        {
          h2: 'Garder le salon sain',
          body: 'Un salon anonyme attire les excès. Quelques réflexes aident',
          points: [
            'Épingle un message qui rappelle ce qui est interdit',
            'Renseigne le salon de journal du staff pour savoir quand une confession est publiée',
            'Réagis vite aux abus : un administrateur peut lever l’anonymat avec /confession reveler',
          ],
        },
      ],
      faq: [
        {
          q: 'Comment faire un salon de confessions anonymes sur Discord ?',
          a: 'Avec Kotbo, choisis le salon avec /confession salon ou dans la page Salons fun du dashboard. Les membres écrivent ensuite avec /confession envoyer et le bot publie le texte sous un numéro',
        },
        {
          q: 'Les confessions sont-elles vraiment anonymes ?',
          a: 'Pour les membres, oui : le salon n’affiche jamais l’auteur. Pour les administrateurs, non : Kotbo garde l’auteur pour pouvoir le révéler en cas d’abus, et chaque révélation est tracée dans le journal du staff',
        },
        {
          q: 'Qui peut révéler l’auteur d’une confession ?',
          a: 'Seuls les administrateurs du serveur, avec /confession reveler suivi du numéro de la confession',
        },
        {
          q: 'Combien de caractères peut faire une confession ?',
          a: 'Jusqu’à 1500 caractères. Un membre doit aussi attendre 60 secondes entre deux confessions',
        },
        {
          q: 'Peut-on mentionner quelqu’un dans une confession ?',
          a: 'Non. Aucune mention ne part d’un message anonyme, pour éviter les pings sans auteur',
        },
        {
          q: 'Faut-il un salon réservé au staff ?',
          a: 'Ce n’est pas obligatoire, mais c’est recommandé : un salon de journal garde une trace de chaque confession publiée et de chaque révélation',
        },
      ],
    },
    en: {
      title: 'Discord anonymous confession: set up a confessions channel',
      h1: 'Discord anonymous confession: a channel where people write without a name',
      description:
        'Discord anonymous confession: how to set up a channel of numbered confessions, keep staff moderation and reveal the author in case of abuse, with Kotbo.',
      lead: 'A confessions channel lets members write without their name showing: a thought, a confession, an awkward question. On Discord a member’s message always shows its author, so a bot has to relay it. With Kotbo, a member types /confession send, the bot posts the text under a number, and an administrator keeps the ability to lift anonymity if things go wrong',
      sections: [
        {
          h2: 'What a confessions channel is for',
          body: 'Some members will never say in public what they’d say without a name. A confessions channel frees speech, and starts discussions the server wouldn’t have had otherwise',
          points: [
            'Shy or struggling members dare to write',
            'Funny or touching confessions start conversations',
            'The server keeps a more human, closer tone',
            'Staff see topics that would never have surfaced otherwise',
          ],
        },
        {
          h2: 'What Discord offers without a bot',
          body: 'Nothing. A message sent by a member always carries their name. Anonymous messages go through a bot that posts in the author’s place. The delicate part is therefore what the bot keeps behind the scenes, and who can access it',
        },
        {
          h2: 'Setting up confessions with Kotbo',
          body: 'The channel is set from the Fun channels page of the dashboard, or with an administrator-only command',
          steps: [
            { title: 'Turn on fun channels', body: 'The Fun channels module groups confessions and channel games. It has to be on' },
            { title: 'Pick the public channel', body: 'Where confessions will appear, with /confession setup or from the dashboard' },
            { title: 'Add a staff log channel', body: 'Optional but recommended: every confession is noted there, without its text or author, and every reveal is traced' },
            { title: 'Explain the rules', body: 'State in your rules what’s forbidden, and that anonymity can be lifted in case of abuse' },
          ],
        },
        {
          h2: 'How a member confesses',
          body: 'A single command is enough, and nobody sees who typed it',
          commands: [
            { name: '/confession send message:<text>', body: 'Posts an anonymous confession in the dedicated channel. 1500 characters at most, with a 60-second wait between two sends' },
            { name: '/confession setup channel:<channel> log:<channel>', body: 'Administrators only. Sets the public channel and, optionally, the private staff channel' },
            { name: '/confession reveal number:<number>', body: 'Administrators only. Reveals a confession’s author to whoever runs the command' },
          ],
        },
        {
          h2: 'Being honest about anonymity',
          body: 'A confession is anonymous for members, not for administrators. Kotbo keeps the author of each confession so it can reveal them to an administrator in case of abuse: harassment, threats, forbidden content. Revealing is restricted to administrators, and every reveal is noted in the staff log. Say it clearly in your rules: a member confessing should know where they stand',
          points: [
            'The public channel never shows the author, only “Confession #number”',
            'No mention can go out from a confession, to avoid pinging someone nameless',
            'The dashboard lists the latest confessions without ever showing the author',
          ],
        },
        {
          h2: 'Keeping the channel healthy',
          body: 'An anonymous channel attracts excess. A few habits help',
          points: [
            'Pin a message reminding what’s forbidden',
            'Set the staff log channel so you know when a confession is posted',
            'React fast to abuse: an administrator can lift anonymity with /confession reveal',
          ],
        },
      ],
      faq: [
        {
          q: 'How do I make an anonymous confessions channel on Discord?',
          a: 'With Kotbo, pick the channel with /confession setup or in the Fun channels page of the dashboard. Members then write with /confession send and the bot posts the text under a number',
        },
        {
          q: 'Are confessions really anonymous?',
          a: 'For members, yes: the channel never shows the author. For administrators, no: Kotbo keeps the author to be able to reveal them in case of abuse, and every reveal is traced in the staff log',
        },
        {
          q: 'Who can reveal a confession’s author?',
          a: 'Only the server’s administrators, with /confession reveal followed by the confession’s number',
        },
        {
          q: 'How long can a confession be?',
          a: 'Up to 1500 characters. A member also has to wait 60 seconds between two confessions',
        },
        {
          q: 'Can I mention someone in a confession?',
          a: 'No. No mention goes out from an anonymous message, to avoid pings with no author',
        },
        {
          q: 'Do I need a staff-only channel?',
          a: 'It’s not mandatory, but it’s recommended: a log channel keeps a record of every confession posted and every reveal',
        },
      ],
    },
  },
};
