/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'relier-serveurs-discord', en: 'link-discord-servers' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['channel_links', 'staff_server'],
  text: {
    fr: {
      title: 'Relier deux serveurs Discord : salon commun et staff',
      h1: 'Relier deux serveurs Discord : un salon commun et un serveur staff synchronisé',
      description:
        'Relier deux serveurs Discord : un salon partagé entre plusieurs serveurs avec /link, et un serveur staff dont les rôles suivent ceux du serveur principal.',
      lead: 'Discord ne relie pas deux serveurs entre eux : rôles, salons et messages restent propres à chacun. Pour un salon commun ou un serveur staff à part, il faut un bot. Kotbo fait les deux : /link recopie les messages d’un salon dans d’autres serveurs, et /staffserver garde les rôles de l’équipe alignés entre ton serveur et celui du staff',
      sections: [
        {
          h2: 'Ce que Discord fait déjà tout seul',
          body: 'Sur un serveur Communauté, un salon d’annonces peut être suivi depuis un autre serveur : chaque annonce publiée y est recopiée. C’est la seule passerelle native, et elle ne va que dans un sens',
          points: [
            'Pas de discussion à deux sens entre deux serveurs',
            'Pas de rôles partagés : un modo promu chez toi ne l’est nulle part ailleurs',
            'Pas de sanctions communes ni de journal commun',
          ],
        },
        {
          h2: 'Relier deux salons de deux serveurs',
          body: 'Le module Liens de salons crée un pont : un message posté dans un salon apparaît dans les autres. Un des serveurs doit avoir Kotbo activé, les autres n’ont besoin d’aucune clé',
          steps: [
            { title: 'Invite Kotbo sur l’autre serveur', body: 'Sans code d’activation, ce serveur passe en liaison seule : le bot n’y fait que recopier le salon relié et n’y enregistre aucune donnée d’activité' },
            { title: 'Génère un code sur ton serveur', body: 'Lance /link invite sur le salon à relier. Le code vaut 30 minutes, pour 1 serveur par défaut et jusqu’à 25' },
            { title: 'Accepte sur l’autre serveur', body: 'Un administrateur y lance /link accept avec le code et le salon de son côté. Le pont est en place' },
            { title: 'Vérifie', body: '/link list montre les ponts et les permissions qui manquent au bot, /link status dit sur un serveur invité ce que le bot y fait' },
          ],
        },
        {
          h2: 'Régler ce que le pont fait passer',
          body: 'Tout se règle avec /link config ou depuis la page Liens de salons du dashboard',
          items: [
            { title: 'Au nom de l’auteur ou en embed', body: 'En mode webhook, le message reprend le pseudo et l’avatar de son auteur. En mode embed, il arrive dans un message enrichi signé' },
            { title: 'Le sens', body: 'Chaque salon émet et reçoit, émet seulement ou reçoit seulement. Pratique pour un salon d’annonces partagé entre plusieurs serveurs' },
            { title: 'Le contenu', body: 'Par défaut, le texte, les images, les modifications, les suppressions et les épinglages passent. Réactions, embeds, fils et sondages s’allument à la demande' },
            { title: 'Les mentions de masse', body: 'Un @everyone ou un @here qui traverse le pont arrive neutralisé : il se lit, mais ne notifie personne de l’autre côté' },
          ],
        },
        {
          h2: 'Créer un serveur staff Discord',
          body: 'Un serveur staff à part garde les discussions de l’équipe hors du serveur principal. Le souci, c’est de tenir les rôles à jour des deux côtés. /staffserver setup relie les deux serveurs, le bot devant être présent sur chacun, et choisit qui fait foi',
          items: [
            { title: 'Principal vers staff', body: 'La hiérarchie se gère sur ton serveur, le serveur staff reçoit un rôle staff simple' },
            { title: 'Staff vers principal', body: 'La hiérarchie se gère sur le serveur staff, ton serveur reçoit le rôle simple' },
            { title: 'Bidirectionnel', body: 'La hiérarchie est synchronisée sur les deux serveurs' },
            { title: 'Rôles retrouvés ou créés', body: 'À la liaison, Kotbo cherche sur l’autre serveur un rôle du même nom pour chaque grade, le crée s’il manque, puis synchronise tout le monde' },
          ],
          figure: { screen: 'staff', caption: 'La hiérarchie du staff sur un serveur fictif : ce sont ces grades que le serveur staff reprend' },
        },
        {
          h2: 'Les commandes /link et /staffserver',
          body: 'Les deux commandes sont réservées aux administrateurs. Leurs sous-commandes s’écrivent pareil sur un Discord en français ou en anglais',
          commands: [
            { name: '/link invite salon:<salon>', body: 'Crée un code de pont. Options : participation, utilisations, mode, et invitation-serveur pour joindre un lien vers ton serveur' },
            { name: '/link accept code:<code> salon:<salon>', body: 'Rejoint un pont depuis l’autre serveur, avec ou sans clé d’activation' },
            { name: '/link direct', body: 'Ouvre un pont sans code vers un salon d’un autre serveur où le bot est déjà, avec les identifiants du serveur et du salon' },
            { name: '/link config id:<pont>', body: 'Choisit ce que le pont relaie, le renomme ou le met en pause' },
            { name: '/staffserver setup serveur-staff:<identifiant> mode:<mode>', body: 'Relie un serveur staff. Options : hierarchie, role-staff-simple, log-principal et log-staff' },
            { name: '/staffserver sync link-id:<lien>', body: 'Force une synchronisation complète des rôles, après un gros changement dans la hiérarchie' },
          ],
        },
        {
          h2: 'Ce que le serveur staff fait en plus',
          body: 'Une fois relié, le serveur staff n’a pas besoin de sa propre clé : il suit l’activation du serveur principal. La page Serveur du staff du dashboard y branche des notifications',
          points: [
            'Une invitation envoyée en MP au membre qui reçoit son premier rôle staff, valable 7 jours pour une utilisation',
            'Une alerte quand un membre perd tous ses rôles staff, avec un bouton pour l’expulser du serveur staff. Kotbo n’expulse jamais tout seul',
            'Le miroir du modlog, les rapports de sanction et les alertes de candidatures, postés dans les salons de ton choix',
            'Les entretiens de recrutement ouverts sur le serveur staff plutôt que sur le serveur principal',
          ],
        },
      ],
      faq: [
        {
          q: 'Comment relier deux serveurs Discord ?',
          a: 'Discord ne le fait pas nativement, à part le suivi d’un salon d’annonces. Avec Kotbo, lance /link invite sur ton serveur, puis /link accept avec le code sur l’autre : les deux salons partagent leurs messages',
        },
        {
          q: 'Comment faire un chat entre deux serveurs Discord ?',
          a: 'Il faut un bot qui recopie les messages d’un salon à l’autre. Le module Liens de salons de Kotbo le fait au nom de l’auteur, avec pseudo et avatar, dans les deux sens',
        },
        {
          q: 'Est-ce que l’autre serveur doit payer Kotbo ?',
          a: 'Non. Un seul serveur du pont a besoin d’une clé d’activation. Les autres passent en liaison seule, où le bot ne fait que recopier le salon relié',
        },
        {
          q: 'Comment créer un serveur staff Discord ?',
          a: 'Crée un serveur pour l’équipe, invite Kotbo dessus, puis lance /staffserver setup depuis le serveur principal avec l’identifiant du serveur staff. Les rôles du staff s’y synchronisent',
        },
        {
          q: 'Un modo rétrogradé est-il retiré du serveur staff ?',
          a: 'Ses rôles suivent la synchronisation. S’il perd tous ses rôles staff, Kotbo poste une alerte avec un bouton pour l’expulser du serveur staff, et la décision reste au staff',
        },
        {
          q: 'Peut-on relier plus de deux serveurs ?',
          a: 'Oui. Un code de /link invite peut servir jusqu’à 25 fois, et /link ajouter rattache un salon d’un autre serveur à un pont existant',
        },
      ],
    },
    en: {
      title: 'Link Discord servers: shared chat and staff server',
      h1: 'Link Discord servers: a cross-server chat and a synced staff server',
      description:
        'Link Discord servers: a channel shared across several servers with /link, and a staff server whose roles follow the main server’s staff hierarchy.',
      lead: 'Discord doesn’t link servers together: roles, channels and messages stay with each server. For a shared channel or a separate staff server, you need a bot. Kotbo does both: /link copies a channel’s messages to other servers, and /staffserver keeps your team’s roles in step between your server and the staff one',
      sections: [
        {
          h2: 'What Discord already does on its own',
          body: 'On a Community server, an announcement channel can be followed from another server: each announcement gets copied there. It’s the only native bridge, and it only goes one way',
          points: [
            'No two-way chat between two servers',
            'No shared roles: a mod promoted on your server isn’t promoted anywhere else',
            'No shared sanctions and no shared log',
          ],
        },
        {
          h2: 'Linking channels across two servers',
          body: 'The Channel links module creates a bridge: a message posted in one channel shows up in the others. One server needs Kotbo activated, the others need no key',
          steps: [
            { title: 'Invite Kotbo to the other server', body: 'Without an activation code, that server runs in link-only mode: the bot only copies the linked channel and stores no activity data there' },
            { title: 'Create a code on your server', body: 'Run /link invite on the channel to link. The code lasts 30 minutes, for 1 server by default and up to 25' },
            { title: 'Accept on the other server', body: 'An admin there runs /link accept with the code and their channel. The bridge is up' },
            { title: 'Check it', body: '/link list shows bridges and any permissions the bot is missing, /link status tells a guest server what the bot does there' },
          ],
        },
        {
          h2: 'Choosing what the bridge carries',
          body: 'Everything is set with /link config or from the dashboard’s Channel links page',
          items: [
            { title: 'As the author or as an embed', body: 'In webhook mode, the message keeps its author’s name and avatar. In embed mode, it arrives as a signed rich message' },
            { title: 'Direction', body: 'Each channel sends and receives, only sends, or only receives. Useful for one announcement channel shared across several servers' },
            { title: 'Content', body: 'By default, text, images, edits, deletions and pins go through. Reactions, embeds, threads and polls can be turned on' },
            { title: 'Mass mentions', body: 'An @everyone or @here crossing the bridge arrives defused: people can read it, but nobody on the other side gets notified' },
          ],
        },
        {
          h2: 'Setting up a Discord staff server',
          body: 'A separate staff server keeps team talk out of the main server. The catch is keeping roles right on both sides. /staffserver setup links the two servers, with the bot present on each, and picks which side is the source',
          items: [
            { title: 'Main to staff', body: 'The hierarchy is managed on your server, and the staff server gets a simple staff role' },
            { title: 'Staff to main', body: 'The hierarchy is managed on the staff server, and your server gets the simple role' },
            { title: 'Both ways', body: 'The hierarchy is synced on both servers' },
            { title: 'Roles matched or created', body: 'When linking, Kotbo looks on the other server for a role with the same name as each rank, creates it if missing, then syncs everyone' },
          ],
          figure: { screen: 'staff', caption: 'A staff hierarchy on a demo server: these are the ranks the staff server mirrors' },
        },
        {
          h2: 'The /link and /staffserver commands',
          body: 'Both commands are for admins. Their subcommands are the same whatever language your Discord is in',
          commands: [
            { name: '/link invite salon:<channel>', body: 'Creates a bridge code. Options: participation, utilisations, mode, and invitation-serveur to attach an invite to your server' },
            { name: '/link accept code:<code> salon:<channel>', body: 'Joins a bridge from the other server, with or without an activation key' },
            { name: '/link direct', body: 'Opens a bridge without a code to a channel on another server where the bot already is, using the server and channel IDs' },
            { name: '/link config id:<bridge>', body: 'Chooses what the bridge relays, renames it or pauses it' },
            { name: '/staffserver setup serveur-staff:<id> mode:<mode>', body: 'Links a staff server. Options: hierarchie, role-staff-simple, log-principal and log-staff' },
            { name: '/staffserver sync link-id:<link>', body: 'Forces a full role sync, after a big change in the hierarchy' },
          ],
        },
        {
          h2: 'What the staff server adds',
          body: 'Once linked, the staff server needs no key of its own: it follows the main server’s activation. The dashboard’s Staff server page wires notifications into it',
          points: [
            'A DM invite sent to a member who gets their first staff role, valid 7 days for one use',
            'An alert when a member loses all their staff roles, with a button to kick them from the staff server. Kotbo never kicks on its own',
            'The modlog mirror, sanction reports and recruitment alerts, posted in the channels you choose',
            'Recruitment interviews opened on the staff server instead of the main one',
          ],
        },
      ],
      faq: [
        {
          q: 'How do I link two Discord servers?',
          a: 'Discord doesn’t do it natively, apart from following an announcement channel. With Kotbo, run /link invite on your server, then /link accept with the code on the other one: both channels share their messages',
        },
        {
          q: 'How do I make a cross-server chat on Discord?',
          a: 'You need a bot that copies messages from one channel to another. Kotbo’s Channel links module does it as the author, with name and avatar, both ways',
        },
        {
          q: 'Does the other server have to pay for Kotbo?',
          a: 'No. Only one server in the bridge needs an activation key. The others run in link-only mode, where the bot only copies the linked channel',
        },
        {
          q: 'How do I create a Discord staff server?',
          a: 'Create a server for the team, invite Kotbo to it, then run /staffserver setup from the main server with the staff server’s ID. Staff roles get synced there',
        },
        {
          q: 'Is a demoted mod removed from the staff server?',
          a: 'Their roles follow the sync. If they lose all their staff roles, Kotbo posts an alert with a button to kick them from the staff server, and the call stays with your staff',
        },
        {
          q: 'Can I link more than two servers?',
          a: 'Yes. A /link invite code can be used up to 25 times, and /link ajouter adds a channel from another server to an existing bridge',
        },
      ],
    },
  },
};
