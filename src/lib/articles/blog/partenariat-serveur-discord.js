/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'partenariat-serveur-discord', en: 'discord-server-partnerships' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['members', 'channel_links', 'embed_builder', 'site'],
  text: {
    fr: {
      title: 'Partenariat Discord : comment le faire et le suivre',
      h1: 'Comment faire des partenariats Discord qui ramènent vraiment des membres',
      description:
        'Partenariat Discord : trouver le bon serveur, se mettre d’accord, échanger les pubs et mesurer qui ramène des membres, avec Discord et les outils de Kotbo.',
      lead: 'Un partenariat Discord, c’est deux serveurs qui se font de la pub l’un chez l’autre. Pour qu’il serve à quelque chose, il faut un partenaire proche de ta communauté, un accord écrit, et une invitation par partenaire pour savoir qui ramène qui. Discord fournit l’essentiel, Kotbo s’occupe du suivi',
      sections: [
        {
          h2: 'C’est quoi un partenariat sur Discord',
          body: 'Rien d’officiel : c’est un accord entre deux staffs. La forme la plus courante est l’échange de pubs dans un salon #partenaires, mais on voit aussi des formats plus vivants',
          points: [
            'Un échange de pubs : chaque serveur poste la présentation de l’autre, parfois avec un rappel régulier',
            'Un salon commun où les membres des deux serveurs discutent ensemble',
            'Un événement à deux : tournoi, soirée jeux, concours',
            'Un représentant du partenaire présent sur ton serveur, avec un rôle à lui',
          ],
        },
        {
          h2: 'Trouver un serveur partenaire',
          body: 'Un partenaire qui ne ressemble pas à ta communauté t’amène des gens qui repartent le lendemain. Avant de proposer quoi que ce soit, regarde ces points',
          items: [
            { title: 'Le même public', body: 'Même jeu, même thème, même langue. Un serveur RP et un serveur d’entraide scolaire n’ont pas grand-chose à s’échanger' },
            { title: 'Une taille proche', body: 'Un gros serveur accepte rarement un échange avec un serveur dix fois plus petit, et quand il le fait, la pub se perd dans le flot' },
            { title: 'Un staff joignable', body: 'Repère la personne qui gère les partenariats. Beaucoup de serveurs ont un salon ou un ticket dédié, c’est par là qu’il faut passer' },
            { title: 'Un serveur sain', body: 'Fais un tour avant : règlement, modération, ambiance. Sa réputation devient un peu la tienne dès que sa pub est chez toi' },
          ],
        },
        {
          h2: 'Comment faire un partenariat Discord, étape par étape',
          body: 'La partie Discord se fait sans bot. Le seul réflexe à prendre : une invitation par partenaire',
          steps: [
            { title: 'Prépare ta pub', body: 'Quelques lignes sur ton serveur, ce qu’on y trouve, et un lien d’invitation. Courte, lisible, sans mur d’emojis' },
            { title: 'Contacte le staff', body: 'Par le canal prévu sur leur serveur. Présente-toi, dis ce que tu proposes et ce que tu attends' },
            { title: 'Mettez-vous d’accord par écrit', body: 'Où va la pub, à quelle fréquence, combien de temps, et ce qui met fin au partenariat. Un message épinglé des deux côtés suffit' },
            { title: 'Crée une invitation pour ce partenaire', body: 'Dans Discord, Inviter des gens sur le salon d’arrivée, puis règle l’expiration sur Jamais. Donne ce lien au partenaire, et à lui seul' },
            { title: 'Publie sa pub', body: 'Dans ton salon #partenaires, à la date convenue. Vérifie que la tienne est bien en ligne chez lui' },
            { title: 'Fais le point après un mois', body: 'Combien de membres sont arrivés par son lien, et combien sont restés. C’est ce chiffre qui décide de la suite' },
          ],
        },
        {
          h2: 'Mesurer ce que rapporte chaque partenaire',
          body: 'Kotbo suit chaque invitation de ton serveur : qui est arrivé par quel lien, et qui est reparti. Dans le dashboard, page Invitations, tu donnes un nom à l’invitation de chaque partenaire. L’onglet Provenances fait ensuite le compte par nom',
          points: [
            'Les arrivées attribuées à chaque provenance',
            'Les départs, et la rétention : la part des arrivants encore là',
            'La part des arrivées que tes invitations nommées expliquent',
            'Une invitation peut aussi être suspendue ou supprimée depuis la même page, si un partenariat s’arrête mal',
          ],
        },
        {
          h2: 'Un salon commun avec ton partenaire',
          body: 'Le module Liens de salons recopie les messages d’un salon dans un salon de l’autre serveur, au nom de leur auteur. Ton partenaire n’a pas besoin de Kotbo actif chez lui : son serveur passe en liaison seule, où le bot ne fait que recopier ce salon',
          commands: [
            { name: '/link invite salon:<salon>', body: 'Sur ton serveur : génère un code de pont pour ce salon, valable 30 minutes. L’option invitation-serveur crée aussi un lien d’invitation vers ton serveur' },
            { name: '/link accept code:<code> salon:<salon>', body: 'Sur le serveur du partenaire, après y avoir invité Kotbo : relie son salon au tien' },
            { name: '/link status', body: 'Sur le serveur du partenaire : ce que le bot y fait, et ce qu’il n’y fait pas' },
            { name: '/invites stats membre:<membre>', body: 'Les arrivées amenées par un membre, utile si le représentant du partenaire invite lui-même depuis ton serveur' },
          ],
        },
        {
          h2: 'La pub qui se republie toute seule',
          body: 'Un accord prévoit souvent un rappel de la pub chaque semaine. Personne n’y pense au bout de trois semaines, alors autant le confier au bot',
          items: [
            { title: 'Messages enrichis', body: 'Le créateur d’embeds du dashboard compose la pub du partenaire, avec titre, couleur et image, et l’envoie dans le salon choisi' },
            { title: 'Tâches planifiées', body: 'Une tâche Message programmé reposte un texte ou un embed dans un salon, chaque heure, jour, semaine, mois, ou selon ton propre rythme' },
            { title: 'Une page Partenaires sur ton site', body: 'Le site communautaire de Kotbo a un bloc Partenaires, une liste que tu remplis à la main, visible sans compte Discord' },
          ],
        },
      ],
      faq: [
        {
          q: 'Comment faire un partenariat sur Discord ?',
          a: 'Trouve un serveur proche du tien en public et en taille, contacte son staff par le canal prévu, mettez-vous d’accord par écrit, puis échangez vos pubs. Donne à chaque partenaire sa propre invitation pour mesurer ce qu’il ramène',
        },
        {
          q: 'Quel bot pour gérer les partenariats Discord ?',
          a: 'Il en faut un qui suive les invitations par provenance et republie les pubs. Kotbo fait les deux, et relie aussi un salon entre deux serveurs avec /link',
        },
        {
          q: 'Comment savoir combien de membres un partenaire a ramenés ?',
          a: 'Crée une invitation dédiée à ce partenaire. Dans Kotbo, nomme-la sur la page Invitations : l’onglet Provenances compte les arrivées par ce lien, les départs et la rétention',
        },
        {
          q: 'Est-ce que mon partenaire doit avoir Kotbo ?',
          a: 'Pour un salon commun, il doit inviter le bot, sans clé d’activation : son serveur passe en liaison seule. Pour un simple échange de pubs, il n’a besoin de rien',
        },
        {
          q: 'Kotbo a-t-il un module Partenariats ?',
          a: 'Il existe, mais il est en pause depuis la 9.5, et ses données sont gardées. En attendant, les invitations nommées, les liens de salons et les messages programmés couvrent l’essentiel',
        },
        {
          q: 'Comment arrêter un partenariat proprement ?',
          a: 'Préviens le staff d’en face, retire sa pub, et suspends ou supprime l’invitation que tu lui avais donnée. Si vous aviez un salon commun, /link retirer ou /link remove coupe le pont',
        },
      ],
    },
    en: {
      title: 'Discord partnerships: how to set them up and track them',
      h1: 'How to run Discord server partnerships that actually bring members',
      description:
        'Discord server partnerships: find the right server, agree on terms, swap ads and see which partner really brings members, with Discord and Kotbo’s tools.',
      lead: 'A Discord partnership is two servers advertising each other. To be worth anything, you need a partner close to your community, written terms, and one invite link per partner so you know who brought whom. Discord covers the basics, Kotbo handles the tracking',
      sections: [
        {
          h2: 'What a Discord partnership is',
          body: 'Nothing official: it’s a deal between two staff teams. The usual form is an ad swap in a #partners channel, but some go further',
          points: [
            'An ad swap: each server posts the other’s description, sometimes with a regular repost',
            'A shared channel where members of both servers talk together',
            'A joint event: tournament, game night, contest',
            'A representative of the partner on your server, with a role of their own',
          ],
        },
        {
          h2: 'Finding a partner server',
          body: 'A partner that doesn’t look like your community sends you people who leave the next day. Before you pitch anything, check these',
          items: [
            { title: 'Same audience', body: 'Same game, same topic, same language. A roleplay server and a homework help server have little to trade' },
            { title: 'Similar size', body: 'A big server rarely swaps with one ten times smaller, and when it does, your ad drowns in the feed' },
            { title: 'Reachable staff', body: 'Find who handles partnerships. Many servers have a channel or a ticket type for it, go through that' },
            { title: 'A healthy server', body: 'Look around first: rules, moderation, atmosphere. Once their ad is on your server, their reputation rubs off on you' },
          ],
        },
        {
          h2: 'How to set up a Discord partnership, step by step',
          body: 'The Discord side needs no bot. The one habit to build: one invite link per partner',
          steps: [
            { title: 'Write your ad', body: 'A few lines about your server, what people find there, and an invite link. Short and readable, no wall of emojis' },
            { title: 'Contact their staff', body: 'Through the channel they set up for it. Introduce yourself, say what you offer and what you expect' },
            { title: 'Put the terms in writing', body: 'Where the ad goes, how often, for how long, and what ends the deal. A pinned message on both sides is enough' },
            { title: 'Create an invite for that partner', body: 'In Discord, Invite People on your landing channel, then set the expiry to Never. Give that link to that partner only' },
            { title: 'Post their ad', body: 'In your #partners channel, on the agreed date. Check that yours is live on their side' },
            { title: 'Review after a month', body: 'How many members joined through their link, and how many stayed. That number decides what comes next' },
          ],
        },
        {
          h2: 'Tracking what each partner brings',
          body: 'Kotbo tracks every invite on your server: who joined through which link, and who left. In the dashboard, on the Invites page, you give each partner’s invite a name. The Sources tab then counts by name',
          points: [
            'Joins attributed to each source',
            'Leaves, and retention: the share of new members still there',
            'How much of your total joins your named invites explain',
            'An invite can also be suspended or deleted from the same page if a partnership ends badly',
          ],
        },
        {
          h2: 'A shared channel with your partner',
          body: 'The Channel links module copies messages from one channel into a channel on the other server, under their author’s name. Your partner doesn’t need Kotbo activated: their server goes into link-only mode, where the bot only relays that channel',
          commands: [
            { name: '/link invite salon:<channel>', body: 'On your server: creates a bridge code for that channel, valid for 30 minutes. The invitation-serveur option also creates an invite link to your server' },
            { name: '/link accept code:<code> salon:<channel>', body: 'On the partner’s server, once Kotbo is invited there: links their channel to yours' },
            { name: '/link status', body: 'On the partner’s server: what the bot does there, and what it doesn’t' },
            { name: '/invites stats membre:<member>', body: 'Joins brought by one member, handy if the partner’s representative invites people from your server' },
          ],
        },
        {
          h2: 'An ad that reposts itself',
          body: 'Partnership terms often include a weekly repost of the ad. Nobody remembers it by week three, so hand it to the bot',
          items: [
            { title: 'Rich messages', body: 'The dashboard’s embed builder lays out the partner’s ad, with title, colour and image, and sends it to the channel you pick' },
            { title: 'Scheduled tasks', body: 'A scheduled message task reposts a text or an embed in a channel every hour, day, week, month, or on your own schedule' },
            { title: 'A Partners page on your website', body: 'Kotbo’s community site has a Partners block, a list you fill in by hand, readable without a Discord account' },
          ],
        },
      ],
      faq: [
        {
          q: 'How do I partner with another Discord server?',
          a: 'Find a server close to yours in audience and size, contact its staff through their partnership channel, agree on terms in writing, then swap ads. Give each partner its own invite link to measure what it brings',
        },
        {
          q: 'What is a good Discord partnership bot?',
          a: 'You want one that tracks invites by source and reposts ads on a schedule. Kotbo does both, and can also bridge a channel between two servers with /link',
        },
        {
          q: 'How do I know how many members a partner brought?',
          a: 'Create an invite dedicated to that partner. In Kotbo, name it on the Invites page: the Sources tab counts joins through that link, leaves and retention',
        },
        {
          q: 'Does my partner need Kotbo too?',
          a: 'For a shared channel, they invite the bot without any activation key and their server runs in link-only mode. For a plain ad swap, they need nothing',
        },
        {
          q: 'Does Kotbo have a Partnerships module?',
          a: 'It exists but has been paused since 9.5, and its data is kept. Meanwhile, named invites, channel links and scheduled messages cover the essentials',
        },
        {
          q: 'How do I end a Discord partnership cleanly?',
          a: 'Tell the other staff, remove their ad, and suspend or delete the invite you gave them. If you shared a channel, /link retirer or /link remove cuts the bridge',
        },
      ],
    },
  },
};
