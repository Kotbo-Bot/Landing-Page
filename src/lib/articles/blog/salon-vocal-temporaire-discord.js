/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'salon-vocal-temporaire-discord', en: 'discord-temp-voice-channels' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['auto_thread'],
  text: {
    fr: {
      title: 'Salon vocal temporaire Discord : le join to create',
      h1: 'Salon vocal temporaire sur Discord : un vocal par groupe, créé à la demande',
      description:
        'Salon vocal temporaire Discord : un salon générateur crée un vocal à chaque membre qui le rejoint, avec un panneau pour le renommer, le verrouiller ou le céder.',
      lead: 'Un salon vocal temporaire, c’est un vocal créé quand un membre rejoint un salon « générateur », puis supprimé quand il se vide. Discord ne le fait pas nativement, il faut un bot. Avec Kotbo, le créateur reçoit un panneau pour gérer son salon sans demander au staff',
      sections: [
        {
          h2: 'Pourquoi des vocaux à la demande',
          body: 'Dix salons vocaux fixes, c’est neuf salons vides la plupart du temps et un seul où tout le monde s’entasse. Le principe du join to create règle ça',
          points: [
            'Un seul salon visible au repos : le générateur',
            'Chaque groupe a son propre vocal, à son nom',
            'Le salon disparaît quand le dernier membre part, la liste des salons reste propre',
            'Le staff n’a plus à créer ni à ranger des vocaux à la main',
          ],
        },
        {
          h2: 'Ce que Discord propose sans bot',
          body: 'Discord laisse fixer une limite de places sur un vocal et régler qui peut le rejoindre, mais ces réglages sont faits par le staff, salon par salon. Aucun réglage natif ne crée un salon quand quelqu’un se connecte, ni ne donne à un membre la main sur un seul vocal. C’est le rôle du bot',
        },
        {
          h2: 'Créer un salon vocal temporaire avec Kotbo',
          body: 'Ça se règle sur dash.kotbo.fr, page Salons, onglet Vocaux à la demande',
          steps: [
            { title: 'Active le module Salons', body: 'Dans Modules, active Salons. Il porte aussi les fils automatiques et les compteurs, et il est éteint par défaut' },
            { title: 'Choisis le salon générateur', body: 'Un salon vocal que les membres rejoignent pour obtenir le leur. Tu peux ajouter d’autres générateurs, par exemple un par catégorie de jeux' },
            { title: 'Écris le modèle de nom', body: 'Par défaut « Salon de {user} » : {user} est remplacé par le pseudo du membre' },
            { title: 'Règle ce que le salon reçoit à sa création', body: 'Places par défaut, verrouillage, chat textuel du salon, rôles autorisés d’office et pouvoirs du propriétaire' },
            { title: 'Restreins l’accès si besoin', body: 'Le champ Rôle requis réserve le générateur à un rôle, par exemple les membres vérifiés' },
          ],
        },
        {
          h2: 'Ce que le propriétaire peut faire depuis le panneau',
          body: 'À la création, Kotbo poste un panneau à boutons dans le chat du salon. Il s’organise en trois onglets : Salon, Membres et Propriété',
          items: [
            { title: 'Renommer', body: 'Discord limite le renommage d’un salon à deux fois par tranche de dix minutes. Le bouton le dit et affiche le décompte au lieu de laisser croire à un bug' },
            { title: 'Limiter les places', body: 'Jusqu’à 99, ou sans limite' },
            { title: 'Verrouiller', body: 'Seuls le propriétaire, les membres qu’il autorise et les rôles autorisés d’office peuvent entrer. Si tu actives les demandes d’accès, les autres cliquent sur Demander l’accès et le propriétaire accepte ou refuse' },
            { title: 'Régler le chat', body: 'Qui peut écrire dans le chat du vocal : tout le monde, ceux qui sont en vocal, le propriétaire seul ou personne' },
            { title: 'Réserver le salon', body: 'À un rôle ou à des membres choisis. Ceux qui ne sont pas concernés peuvent être déplacés ailleurs ou déconnectés' },
            { title: 'Gérer les membres', body: 'Autoriser quelqu’un à entrer, l’expulser du salon ou l’en bannir' },
            { title: 'Transférer', body: 'Donner le salon à un autre membre présent' },
          ],
        },
        {
          h2: 'Quand le propriétaire quitte son salon',
          body: 'C’est là que la plupart des vocaux temporaires deviennent ingérables. Kotbo suit des règles que tu choisis dans le bloc Propriété du salon',
          points: [
            'MP de passation : s’il reste du monde, le propriétaire qui part reçoit en MP la liste des présents pour choisir son successeur',
            'Sans choix dans le délai réglé, un message « Récupérer le salon » arrive dans le chat : le premier membre présent qui clique devient propriétaire',
            'Tu peux réserver la récupération au staff, et laisser le staff annuler la réclamation d’un membre',
            'Supprimer le salon quand il est vide est activé par défaut. Désactivé, le salon reste ouvert et le premier qui entre peut le récupérer',
          ],
        },
        {
          h2: 'Garder la main côté staff',
          body: 'Les réglages des modérateurs se décident action par action : renommer, limite, verrouillage, chat, réservation, expulser ou bannir, transfert. Chaque action peut rester ouverte au staff ou passer en admins seulement. Les salons ouverts se suivent dans l’onglet Salons actifs, et chaque action faite depuis un panneau peut partir dans tes journaux',
        },
      ],
      faq: [
        {
          q: 'Comment faire un salon vocal temporaire sur Discord ?',
          a: 'Il faut un bot, Discord ne le fait pas seul. Avec Kotbo, active le module Salons, choisis un salon vocal générateur dans l’onglet Vocaux à la demande, et chaque membre qui le rejoint reçoit son propre vocal',
        },
        {
          q: 'C’est quoi un salon join to create ?',
          a: 'Un salon vocal qui ne sert qu’à en créer d’autres. Quand un membre le rejoint, le bot crée un vocal à son nom et l’y déplace',
        },
        {
          q: 'Est-ce que le salon se supprime tout seul ?',
          a: 'Oui, par défaut le salon est supprimé quand il se vide. Tu peux désactiver ce réglage pour qu’il reste ouvert et que le premier qui entre le récupère',
        },
        {
          q: 'Comment verrouiller son salon vocal temporaire ?',
          a: 'Depuis le panneau posté dans le chat du salon, onglet Salon. Une fois verrouillé, seuls les membres autorisés et les rôles autorisés d’office entrent. Si les demandes d’accès sont activées, les autres peuvent demander à entrer',
        },
        {
          q: 'Pourquoi je ne peux pas renommer mon salon plusieurs fois ?',
          a: 'Discord n’accepte que deux renommages d’un même salon par tranche de dix minutes. Le panneau affiche le temps restant avant le prochain',
        },
        {
          q: 'Qui peut récupérer un salon vocal dont le propriétaire est parti ?',
          a: 'Par défaut, le premier membre présent qui clique sur Récupérer le salon. Tu peux réserver ce bouton au staff dans le bloc Propriété du salon, et le staff peut toujours récupérer un salon sans propriétaire',
        },
        {
          q: 'Est-ce qu’on peut avoir plusieurs générateurs ?',
          a: 'Oui. Tu ajoutes des générateurs additionnels, chacun avec son modèle de nom, sa catégorie et son rôle requis',
        },
      ],
    },
    en: {
      title: 'Discord temp voice channels: join to create',
      h1: 'Temporary voice channels on Discord: one room per group, created on demand',
      description:
        'Discord temp voice channels: join a generator channel and get your own private voice room, with a panel to rename it, lock it or hand it over to someone else.',
      lead: 'A temporary voice channel is created when a member joins a “generator” channel, then deleted once it empties. Discord doesn’t do this natively, you need a bot. With Kotbo, the creator gets a panel to run the room without asking staff',
      sections: [
        {
          h2: 'Why join to create',
          body: 'Ten fixed voice channels usually means nine empty rooms and one where everyone piles in. Join to create fixes that',
          points: [
            'Only one channel shows when nobody is talking: the generator',
            'Each group gets its own room, under its own name',
            'The room disappears when the last member leaves, so the channel list stays clean',
            'Staff stops creating and tidying voice channels by hand',
          ],
        },
        {
          h2: 'What Discord offers without a bot',
          body: 'Discord lets you set a user limit on a voice channel and decide who can join, but staff sets those up channel by channel. No native setting creates a room when someone connects, or gives one member control over a single voice channel. That’s the bot’s job',
        },
        {
          h2: 'How to set up temp voice channels with Kotbo',
          body: 'It all happens on dash.kotbo.fr, Channels page, On-demand voice tab',
          steps: [
            { title: 'Turn on the Channels module', body: 'In Modules, turn on Channels. It also covers auto-threads and counters, and it’s off by default' },
            { title: 'Pick the generator channel', body: 'A voice channel members join to get their own. You can add more generators, one per game category for instance' },
            { title: 'Write the name template', body: 'By default “{user}’s channel”: {user} becomes the member’s name' },
            { title: 'Set what each room starts with', body: 'Default slots, locking, the channel text chat, auto-allowed roles and owner powers' },
            { title: 'Restrict access if needed', body: 'The Required role field limits the generator to one role, verified members for instance' },
          ],
        },
        {
          h2: 'What the owner can do from the panel',
          body: 'When the room is created, Kotbo posts a button panel in its chat. It has three tabs: Channel, Members and Ownership',
          items: [
            { title: 'Rename', body: 'Discord only allows two renames of a channel per ten minutes. The button says so and shows a countdown instead of looking stuck' },
            { title: 'Limit slots', body: 'Up to 99, or unlimited' },
            { title: 'Lock', body: 'Only the owner, members they allow and auto-allowed roles can join. If you turn on access requests, others click Request access and the owner accepts or declines' },
            { title: 'Set the chat', body: 'Who can write in the voice chat: everyone, those in voice, the owner only, or no one' },
            { title: 'Reserve the room', body: 'For a role or for picked members. Anyone else can be moved elsewhere or disconnected' },
            { title: 'Manage members', body: 'Allow someone in, kick them from the room or ban them from it' },
            { title: 'Transfer', body: 'Hand the room over to another member who is in it' },
          ],
        },
        {
          h2: 'When the owner leaves',
          body: 'That’s where most temp voice setups fall apart. Kotbo follows the rules you set in the Channel ownership block',
          points: [
            'Handover DM: if people are still there, the owner who leaves gets a DM listing them to pick a successor',
            'With no pick in time, a “Claim the channel” message lands in the chat: the first member present who clicks becomes the owner',
            'You can keep claiming to staff only, and let staff cancel a member’s claim',
            'Deleting the room when it empties is on by default. Turned off, the room stays open and the first person to join can claim it',
          ],
        },
        {
          h2: 'Keeping staff in control',
          body: 'Moderator permissions are set action by action: rename, limit, lock, chat, reservation, kick or ban, transfer. Each one stays open to staff or goes admins only, so a moderator can step in on a room without being able to do everything. Open rooms show up in the Active channels tab, and every panel action can go to your logs',
        },
      ],
      faq: [
        {
          q: 'How do I make temporary voice channels on Discord?',
          a: 'You need a bot, Discord doesn’t do it on its own. With Kotbo, turn on the Channels module, pick a generator voice channel in the On-demand voice tab, and every member who joins it gets their own room',
        },
        {
          q: 'What is a join to create channel?',
          a: 'A voice channel that only exists to create others. When a member joins it, the bot creates a room under their name and moves them there',
        },
        {
          q: 'Do temp voice channels delete themselves?',
          a: 'Yes, by default the room is deleted once it empties. You can turn that off so it stays open and the next person to join claims it',
        },
        {
          q: 'How do I lock my temporary voice channel?',
          a: 'From the panel posted in the room’s chat, Channel tab. Once locked, only allowed members and auto-allowed roles get in. With access requests turned on, others can ask to join',
        },
        {
          q: 'Why can’t I rename my voice channel again?',
          a: 'Discord only accepts two renames of the same channel per ten minutes. The panel shows how long until the next one',
        },
        {
          q: 'Who can claim a voice channel when its owner leaves?',
          a: 'By default, the first member in the room who clicks Claim the channel. You can keep that button to staff in the Channel ownership block, and staff can always claim a room with no owner',
        },
        {
          q: 'Can I have several generator channels?',
          a: 'Yes. You add extra generators, each with its own name template, category and required role',
        },
      ],
    },
  },
};
