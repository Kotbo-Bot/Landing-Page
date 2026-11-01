/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'tracker-invitations-discord', en: 'discord-invite-tracker' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['members', 'analytics', 'logs', 'campaigns'],
  text: {
    fr: {
      title: 'Tracker d’invitations Discord : qui invite qui',
      h1: 'Suivre les invitations sur Discord : savoir qui invite qui et d’où viennent tes membres',
      description:
        'Tracker d’invitations Discord : ce que Discord montre déjà, puis qui a invité qui, la provenance de chaque lien et la rétention des invités avec Kotbo.',
      lead: 'Discord liste tes invitations et leur nombre d’utilisations, mais il ne te dit pas lesquelles font venir des membres qui restent. Un tracker d’invitations relie chaque arrivée au lien utilisé et à celui qui l’a créé. Kotbo le fait dès qu’il est sur ton serveur, avec des commandes pour les membres et une page complète sur le dashboard',
      sections: [
        {
          h2: 'Ce que Discord montre sans bot',
          body: 'Dans Paramètres du serveur, Invitations, tu vois les liens actifs, leur créateur, leur nombre d’utilisations et leur date d’expiration. C’est utile pour faire le ménage, moins pour comprendre ta croissance',
          points: [
            'Un nombre d’utilisations ne dit pas combien de membres sont restés',
            'Aucun classement des inviteurs, aucun historique une fois le lien supprimé',
            'Aucun moyen de regrouper plusieurs liens sous une même source, comme « TikTok » ou « Partenaire »',
          ],
        },
        {
          h2: 'Les invitations en commande slash',
          body: 'Pour les membres, sans passer par le dashboard. Les deux commandes dépendent du module Statistiques, allumé par défaut',
          commands: [
            { name: '/invites stats', body: 'Pour toi, ou pour un autre avec l’option membre : invitations totales, membres encore présents, membres partis, taux de rétention et dernières invitations' },
            { name: '/invites leaderboard', body: 'Le classement des inviteurs, trié sur le nombre de membres restés plutôt que sur le total. Celui qui fait venir des comptes qui partent le lendemain ne monte pas' },
          ],
        },
        {
          h2: 'Savoir d’où viennent tes membres',
          body: 'La page Invitations de dash.kotbo.fr pose une question simple : quel canal fait vraiment grandir le serveur. La réponse tient en trois gestes',
          steps: [
            { title: 'Crée un lien par canal', body: 'Un lien pour ta bio TikTok, un pour Instagram, un pour chaque annuaire ou partenaire. Kotbo a besoin de la permission Gérer le serveur, que Discord exige pour lire les invitations' },
            { title: 'Nomme la provenance', body: 'Dans l’onglet Invitations, clique sur Nommer à côté d’un lien et tape la source. Donne le même nom à plusieurs liens pour les regrouper' },
            { title: 'Lis l’onglet Provenances', body: 'Chaque source affiche ses liens, ses arrivées et les membres restants, avec la meilleure provenance en tête' },
            { title: 'Exporte si besoin', body: 'Le bouton Exporter sort les données pour les garder ou les croiser ailleurs' },
          ],
        },
        {
          h2: 'Ce que la page Invitations montre',
          body: 'Quatre onglets, chacun pour une question',
          items: [
            { title: 'Invitations', body: 'Tous les liens avec leur code, leur provenance, leur créateur, leurs arrivées et la date de la dernière. Filtre par statut : actives, suspendues, expirées ou supprimées' },
            { title: 'Provenances', body: 'La performance par source, et la part des arrivées que tes liens nommés couvrent. Un lien sans provenance est signalé, pour que tes chiffres restent complets' },
            { title: 'Meilleurs inviteurs', body: 'Les inviteurs classés par nombre d’arrivées, avec la date de leur dernier invité. Pour le classement sur les membres restés, c’est /invites leaderboard' },
            { title: 'Suspensions', body: 'Les créateurs d’invitations que tu as suspendus, et le bouton pour les rétablir' },
          ],
        },
        {
          h2: 'Couper une invitation qui ramène des comptes louches',
          body: 'Un lien qui fuite sur un serveur de raid, un membre qui fait venir des comptes jetables : la page Invitations sert aussi à la sécurité',
          points: [
            'Suspendre une invitation : avec le module Journaux allumé, toute nouvelle arrivée par ce code est expulsée tout de suite et signalée dans tes journaux',
            'Purger une invitation : Kotbo expulse les membres encore présents arrivés par ce lien',
            'Suspendre un créateur : ses liens sont bloqués de la même façon, et la case de purge en cascade expulse en plus les membres qu’il a déjà fait venir',
            'Un créateur suspendu se rétablit dans l’onglet Suspensions',
          ],
        },
        {
          h2: 'Mesurer une campagne ou un partenariat',
          body: 'Dans le module Campagnes, tu peux attacher un code d’invitation à une campagne : les arrivées passées par ce code depuis sa date de départ lui sont créditées. Pour un partenariat, le module Partenariats suit les publicités croisées et ce qu’elles rapportent. Il est éteint par défaut, à allumer dans Modules',
        },
      ],
      faq: [
        {
          q: 'Comment savoir qui a invité quelqu’un sur Discord ?',
          a: 'Discord liste les invitations et leur créateur, mais pas qui a fait venir chaque membre. Avec Kotbo, chaque arrivée est reliée au lien utilisé, et /invites stats montre qui un membre a fait venir',
        },
        {
          q: 'Quel bot pour tracker les invitations sur Discord ?',
          a: 'Kotbo suit les invitations dès son arrivée sur le serveur : qui a invité qui, combien sont restés, et quelle provenance marche le mieux. Le même bot gère aussi la modération, les tickets et le staff',
        },
        {
          q: 'Comment voir le classement des invitations ?',
          a: 'Tape /invites leaderboard. Kotbo classe les inviteurs sur le nombre de membres encore présents sur le serveur',
        },
        {
          q: 'Comment savoir si mes membres viennent de TikTok ou d’un annuaire ?',
          a: 'Crée un lien d’invitation par canal, puis nomme sa provenance dans la page Invitations du dashboard. L’onglet Provenances compare ensuite les arrivées et les membres restants de chaque source',
        },
        {
          q: 'Pourquoi Kotbo ne voit pas mes invitations ?',
          a: 'Discord ne donne la liste des invitations qu’aux bots qui ont la permission Gérer le serveur. Vérifie que le rôle de Kotbo l’a',
        },
        {
          q: 'Comment bloquer une invitation utilisée par des raideurs ?',
          a: 'Dans la page Invitations, suspends le code : Kotbo expulse toute nouvelle arrivée par ce lien. Tu peux aussi purger les membres déjà arrivés par ce lien, ou suspendre son créateur',
        },
      ],
    },
    en: {
      title: 'Discord invite tracker: see who invited whom',
      h1: 'Discord invite tracker: see who invited whom and where your members come from',
      description:
        'Discord invite tracker: what Discord already shows, then who invited whom, where each invite link comes from and how many invited members stay, with Kotbo.',
      lead: 'Discord lists your invites and how often they were used, but it doesn’t tell you which ones bring members who stay. An invite tracker ties every join to the link used and to whoever created it. Kotbo does it as soon as it’s on your server, with commands for members and a full page on the dashboard',
      sections: [
        {
          h2: 'What Discord shows without a bot',
          body: 'In Server Settings, Invites, you see active links, who created them, how many times they were used and when they expire. Handy for cleanup, less so for understanding your growth',
          points: [
            'A use count doesn’t tell you how many members stayed',
            'No inviter ranking, and no history once a link is deleted',
            'No way to group several links under one source, like “TikTok” or “Partner”',
          ],
        },
        {
          h2: 'Invite stats as slash commands',
          body: 'For members, without going through the dashboard. Both commands belong to the Statistics module, on by default',
          commands: [
            { name: '/invites stats', body: 'For you, or someone else with the membre option: total invites, members still here, members who left, retention rate and latest invites' },
            { name: '/invites leaderboard', body: 'The inviter ranking, sorted by members who stayed rather than the raw total. Bringing in accounts that leave the next day won’t get anyone to the top' },
          ],
        },
        {
          h2: 'Finding out where your members come from',
          body: 'The Invites page on dash.kotbo.fr asks one simple question: which channel is really growing the server. Getting the answer takes a few steps',
          steps: [
            { title: 'Create one link per channel', body: 'One link for your TikTok bio, one for Instagram, one per server list or partner. Kotbo needs the Manage Server permission, which Discord requires to read invites' },
            { title: 'Name the source', body: 'In the Invites tab, click Name next to a link and type the source. Give several links the same name to group them' },
            { title: 'Read the Sources tab', body: 'Each source shows its links, its joins and the members who stayed, with the best source on top' },
            { title: 'Export if needed', body: 'The Export button gets the data out, to keep it or compare it elsewhere' },
          ],
        },
        {
          h2: 'What the Invites page shows',
          body: 'Four tabs, one question each',
          items: [
            { title: 'Invites', body: 'Every link with its code, source, creator, joins and the date of the last one. Filter by status: active, suspended, expired or deleted' },
            { title: 'Sources', body: 'Performance by source, and the share of joins your named links cover. A link with no source gets flagged, so your numbers stay complete' },
            { title: 'Top inviters', body: 'Inviters ranked by number of joins, with the date of their latest one. For the ranking by members who stayed, use /invites leaderboard' },
            { title: 'Suspensions', body: 'The invite creators you suspended, and the button to restore them' },
          ],
        },
        {
          h2: 'Shutting down an invite that brings in shady accounts',
          body: 'A link leaked to a raid server, a member bringing in throwaway accounts: the Invites page doubles as a security tool',
          points: [
            'Suspend an invite: with the Logs module on, anyone new joining through that code is kicked right away and flagged in your logs',
            'Purge an invite: Kotbo kicks the members still on the server who joined through that link',
            'Suspend a creator: their links get blocked the same way, and the cascade purge box also kicks the members they already brought in',
            'A suspended creator can be restored from the Suspensions tab',
          ],
        },
        {
          h2: 'Measuring a campaign or a partnership',
          body: 'In the Campaigns module, you can attach an invite code to a campaign: joins through that code since its start date are credited to it. For partnerships, the Partnerships module tracks cross-promotions and what they bring in. It’s off by default, turn it on in Modules',
        },
      ],
      faq: [
        {
          q: 'How do I see who invited someone on Discord?',
          a: 'Discord lists invites and their creator, but not who brought in each member. With Kotbo, every join is tied to the link used, and /invites stats shows who a member brought in',
        },
        {
          q: 'What is a good Discord invite tracker bot?',
          a: 'Kotbo tracks invites from the moment it joins your server: who invited whom, how many stayed, and which source works best. The same bot also handles moderation, tickets and staff',
        },
        {
          q: 'How do I see the invite leaderboard?',
          a: 'Type /invites leaderboard. Kotbo ranks inviters by how many of their invited members are still on the server',
        },
        {
          q: 'How do I know if members come from TikTok or a server list?',
          a: 'Create one invite link per channel, then name its source on the dashboard’s Invites page. The Sources tab then compares joins and members who stayed for each source',
        },
        {
          q: 'Why can’t Kotbo see my invites?',
          a: 'Discord only shares the invite list with bots that have the Manage Server permission. Check that Kotbo’s role has it',
        },
        {
          q: 'How do I block an invite used by raiders?',
          a: 'On the Invites page, suspend the code: Kotbo kicks anyone new who joins through that link. You can also purge the members who already came through it, or suspend its creator',
        },
      ],
    },
  },
};
