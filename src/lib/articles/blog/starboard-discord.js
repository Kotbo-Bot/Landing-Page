/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'starboard-discord', en: 'discord-starboard-bot' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['starboard'],
  text: {
    fr: {
      title: 'Starboard Discord : mettre en avant les meilleurs messages',
      h1: 'Starboard Discord : republier les messages qui font réagir',
      description:
        'Starboard Discord : comment marche un salon des meilleurs messages, et comment le régler avec Kotbo : emojis, seuil, salons surveillés et votes négatifs.',
      lead: 'Un starboard, c’est un salon où un bot republie les messages qui ont reçu assez de réactions, souvent des étoiles. Discord n’en a pas en natif, il faut un bot. Dans Kotbo, c’est le module Starlight, la page Messages à la une du dashboard : tu choisis les emojis qui comptent, le seuil et le salon, et le bot s’occupe du reste',
      sections: [
        {
          h2: 'À quoi sert un starboard Discord',
          body: 'Sur un serveur actif, le meilleur mème de la semaine disparaît sous des centaines de messages en une soirée. Le starboard le garde au chaud',
          points: [
            'Les messages qui ont fait rire ou réagir restent trouvables dans un seul salon',
            'Les nouveaux voient d’un coup d’œil le ton du serveur',
            'Les membres actifs voient leurs messages mis en avant, ce qui donne envie de revenir',
          ],
        },
        {
          h2: 'Ce que Discord propose sans bot',
          body: 'Rien d’équivalent. Les messages épinglés s’en approchent, mais un modo doit les épingler à la main, salon par salon, et ils ne disent rien de ce que la communauté a aimé. Pour un starboard qui se remplit tout seul, il faut un bot qui compte les réactions',
        },
        {
          h2: 'Configurer le starboard avec Kotbo',
          body: 'Tout se règle sur dash.kotbo.fr, page Messages à la une. Le module démarre éteint : sans salon de publication, il n’aurait nulle part où écrire',
          steps: [
            { title: 'Crée le salon', body: 'Un salon #starboard ou #pépites, en lecture seule pour les membres si tu veux qu’il reste propre' },
            { title: 'Choisis le salon des highlights', body: 'Dans la section Publication, sélectionne ce salon et la couleur des messages republiés' },
            { title: 'Fixe le seuil', body: 'Le score à atteindre pour être republié, votes positifs moins votes négatifs. Il est à 5 par défaut' },
            { title: 'Choisis les emojis', body: 'Un ou plusieurs emojis positifs, ⭐ ou un emoji de ton serveur. Le premier sert de compteur sur le highlight' },
            { title: 'Active le module', body: 'Dès qu’un message atteint le seuil, Kotbo le republie, et le compteur se met à jour à chaque nouvelle réaction' },
          ],
        },
        {
          h2: 'Les réglages du starboard',
          body: 'Au-delà du seuil, chaque section de la page règle un point précis',
          items: [
            { title: 'Votes négatifs', body: 'Des emojis retranchés du score, 👎 par défaut. Laisse la liste vide pour ne compter que les votes positifs' },
            { title: 'Compter les réactions du highlight', body: 'Les votes posés sur le message republié comptent dans le même score. C’est souvent là que les membres votent' },
            { title: 'Salons surveillés et exclus', body: 'Laisse vide pour surveiller tout le serveur, ou limite à quelques salons. Un salon exclu l’emporte toujours, pratique pour #staff ou #règlement' },
            { title: 'Messages de bots', body: 'Ignorés par défaut, à activer si tes bots ou webhooks postent du contenu qui mérite d’être mis en avant' },
            { title: 'Retirer sous le seuil', body: 'Si le score redescend, le highlight est supprimé. Coupe l’option pour qu’un message reste publié une fois le seuil atteint' },
          ],
        },
        {
          h2: 'Ce que contient un highlight',
          body: 'Le message republié reprend l’original pour qu’on n’ait pas à aller le chercher',
          points: [
            'Le score et le salon d’origine en tête',
            'L’auteur avec son avatar, le texte et la date',
            'Jusqu’à quatre images regroupées en galerie, les autres fichiers en liens',
            'Un bouton qui renvoie au message d’origine',
            'Si le message d’origine est supprimé, le highlight l’est aussi',
          ],
        },
        {
          h2: 'Amorcer les votes, ou faire une boîte à idées',
          body: 'Kotbo pose lui-même les emojis de vote sur chaque highlight, pour que personne n’ait à les chercher. Tu peux aussi choisir des salons à amorcer : chaque nouveau message y reçoit les emojis de vote. Sur un salon d’idées, ça donne une boîte à suggestions où les meilleures remontent seules. Les réactions posées par le bot ne comptent pas dans le score',
        },
        {
          h2: 'Quel seuil choisir pour ton starboard',
          body: 'Il n’y a pas de bon chiffre pour tous les serveurs. Commence bas sur un petit serveur, pour que le salon ne reste pas vide, et monte le seuil quand il se remplit plus vite que les gens ne le lisent. Avec Retirer sous le seuil, un message qui perd ses votes redescend tout seul, et les votes négatifs donnent à la communauté un moyen de dire non',
        },
      ],
      faq: [
        {
          q: 'C’est quoi un starboard sur Discord ?',
          a: 'Un salon où un bot republie les messages qui ont reçu assez de réactions, souvent des étoiles. Il garde les meilleurs moments du serveur au même endroit',
        },
        {
          q: 'Comment faire un starboard sur Discord ?',
          a: 'Discord n’en a pas en natif. Avec Kotbo, ouvre la page Messages à la une du dashboard, choisis le salon, les emojis et le seuil, puis active le module',
        },
        {
          q: 'Quel bot starboard Discord utiliser ?',
          a: 'Plusieurs bots ont un starboard. Celui de Kotbo compte des votes positifs et négatifs, surveille les salons de ton choix et vit dans le même dashboard que le reste de la gestion du serveur',
        },
        {
          q: 'Combien de réactions faut-il pour arriver sur le starboard ?',
          a: 'C’est toi qui fixes le seuil. Par défaut, il faut un score de 5, votes positifs moins votes négatifs',
        },
        {
          q: 'Est-ce qu’on peut utiliser un emoji personnalisé pour le starboard ?',
          a: 'Oui. Ajoute l’emoji de ton serveur dans la liste des emojis positifs, il compte comme une étoile',
        },
        {
          q: 'Que se passe-t-il si le message d’origine est supprimé ?',
          a: 'Kotbo retire le highlight du salon. Rien ne reste qui pointe vers un message disparu',
        },
        {
          q: 'Est-ce que le starboard marche dans les fils ?',
          a: 'Oui. Un fil suit les réglages de son salon parent : si le salon est surveillé, les messages de ses fils le sont aussi',
        },
      ],
    },
    en: {
      title: 'Discord starboard bot: feature your best messages',
      h1: 'Discord starboard: repost the messages people react to',
      description:
        'Discord starboard bot: how a best-of channel works, and how to set one up with Kotbo, with your own emojis, threshold, watched channels and downvotes.',
      lead: 'A starboard is a channel where a bot reposts messages that got enough reactions, usually stars. Discord has no native one, so you need a bot. In Kotbo it’s the Starlight module, the Featured messages page of the dashboard: you pick the emojis that count, the threshold and the channel, and the bot handles the rest',
      sections: [
        {
          h2: 'What a Discord starboard is for',
          body: 'On an active server, the meme of the week sinks under hundreds of messages in one evening. The starboard keeps it safe',
          points: [
            'The messages that got laughs or reactions stay findable in one channel',
            'Newcomers see the tone of the server at a glance',
            'Active members see their messages featured, which brings them back',
          ],
        },
        {
          h2: 'What Discord offers without a bot',
          body: 'Nothing quite like it. Pinned messages come close, but a mod has to pin them by hand, channel by channel, and they say nothing about what the community liked. For a starboard that fills itself, you need a bot that counts reactions',
        },
        {
          h2: 'Setting up a starboard with Kotbo',
          body: 'Everything is set on dash.kotbo.fr, in the Featured messages page. The module starts off: without a channel to post in, it would have nowhere to write',
          steps: [
            { title: 'Create the channel', body: 'A #starboard or #hall-of-fame channel, read-only for members if you want it to stay clean' },
            { title: 'Pick the highlights channel', body: 'In the Publication section, select that channel and the color of reposted messages' },
            { title: 'Set the threshold', body: 'The score a message needs to be reposted, upvotes minus downvotes. It defaults to 5' },
            { title: 'Pick the emojis', body: 'One or more upvote emojis, ⭐ or one of your server’s emojis. The first one is used as the counter on the highlight' },
            { title: 'Turn the module on', body: 'As soon as a message hits the threshold, Kotbo reposts it, and the counter updates with each new reaction' },
          ],
        },
        {
          h2: 'Starboard settings',
          body: 'Beyond the threshold, each section of the page handles one thing',
          items: [
            { title: 'Downvotes', body: 'Emojis subtracted from the score, 👎 by default. Leave the list empty to count upvotes only' },
            { title: 'Count reactions on the highlight', body: 'Votes on the reposted message feed the same score. That’s often where members vote' },
            { title: 'Watched and ignored channels', body: 'Leave empty to watch the whole server, or limit it to a few channels. An ignored channel always wins, handy for #staff or #rules' },
            { title: 'Bot messages', body: 'Ignored by default, turn them on if your bots or webhooks post content worth featuring' },
            { title: 'Remove below threshold', body: 'If the score drops, the highlight is deleted. Turn it off so a message stays posted once it made it' },
          ],
        },
        {
          h2: 'What a highlight contains',
          body: 'The reposted message carries the original so nobody has to go looking for it',
          points: [
            'The score and the source channel at the top',
            'The author with their avatar, the text and the date',
            'Up to four images grouped as a gallery, other files as links',
            'A button that jumps to the original message',
            'If the original message is deleted, the highlight goes too',
          ],
        },
        {
          h2: 'Seeding votes, or building an idea box',
          body: 'Kotbo adds the vote emojis to each highlight itself, so nobody has to hunt for them. You can also pick channels to seed: every new message there gets the vote emojis. On an ideas channel, that makes a suggestion box where the best ideas rise on their own. Reactions added by the bot don’t count toward the score',
        },
        {
          h2: 'Picking a starboard threshold',
          body: 'No single number suits every server. Start low on a small server so the channel doesn’t sit empty, and raise the threshold once it fills faster than people read it. With Remove below threshold, a message that loses its votes drops off on its own, and downvotes give the community a way to say no',
        },
      ],
      faq: [
        {
          q: 'What is a starboard on Discord?',
          a: 'A channel where a bot reposts messages that got enough reactions, usually stars. It keeps the server’s best moments in one place',
        },
        {
          q: 'How do I make a starboard on Discord?',
          a: 'Discord has no native one. With Kotbo, open the Featured messages page of the dashboard, pick the channel, the emojis and the threshold, then turn the module on',
        },
        {
          q: 'What is a good Discord starboard bot?',
          a: 'Several bots have a starboard. Kotbo’s counts upvotes and downvotes, watches the channels you choose and lives in the same dashboard as the rest of your server management',
        },
        {
          q: 'How many reactions does it take to reach the starboard?',
          a: 'You set the threshold. By default a message needs a score of 5, upvotes minus downvotes',
        },
        {
          q: 'Can I use a custom emoji for the starboard?',
          a: 'Yes. Add your server’s emoji to the upvote list and it counts like a star',
        },
        {
          q: 'What happens if the original message is deleted?',
          a: 'Kotbo removes the highlight from the channel, so nothing is left pointing at a message that’s gone',
        },
        {
          q: 'Does the starboard work in threads?',
          a: 'Yes. A thread follows its parent channel’s settings: if the channel is watched, messages in its threads are too',
        },
      ],
    },
  },
};
