/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'bot-ticket-discord', en: 'discord-ticket-bot' },
  date: '2026-11-01',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['tickets'],
  text: {
    fr: {
      title: 'Bot ticket Discord : créer un système de tickets de support',
      h1: 'Bot ticket Discord : un système de tickets de support complet',
      description:
        'Bot ticket Discord : comment créer un système de tickets avec panneau, types de demandes, prise en charge par le staff, macros, transcription et sondage de satisfaction, avec Kotbo.',
      lead: 'Un système de tickets donne à chaque demande de ton serveur son propre espace privé : le membre clique sur un bouton, un salon s’ouvre, le staff répond, puis le ticket se ferme avec une transcription. Discord n’a rien de tel en natif, il faut un bot. Dans Kotbo, tout se règle sur la page Tickets du dashboard, et les actions courantes se font aussi avec /ticket depuis le salon du ticket',
      sections: [
        {
          h2: 'À quoi sert un bot de tickets sur Discord',
          body: 'Sans tickets, le support passe par les messages privés des modos ou par un salon public où tout le monde lit les problèmes des autres',
          points: [
            'Chaque demande est isolée : seuls le membre et le staff voient la conversation',
            'Rien ne se perd, un ticket a un statut (ouvert, pris en charge, fermé, archivé)',
            'Le staff voit d’un coup d’œil qui s’occupe de quoi',
            'La transcription garde une trace en cas de litige',
          ],
        },
        {
          h2: 'Ce que Discord propose sans bot',
          body: 'Rien d’équivalent. Un salon privé créé à la main pour chaque demande demande du temps à un modo, et les droits d’accès sont à régler à chaque fois. Un bot automatise la création du salon, les permissions et la clôture',
        },
        {
          h2: 'Créer ton système de tickets avec Kotbo',
          body: 'Tout se règle sur dash.kotbo.fr, page Tickets. Le staff y répond aussi aux demandes, sans passer par Discord',
          steps: [
            { title: 'Choisis le mode', body: 'Un salon dédié par ticket, un fil de discussion, ou les messages privés. Le salon dédié est le plus courant, le fil évite d’encombrer la liste des salons' },
            { title: 'Pose les salons et le rôle staff', body: 'La catégorie où ranger les tickets, le salon des journaux, et le rôle du staff qui gère les demandes' },
            { title: 'Publie le panneau', body: 'Le message avec le bouton d’ouverture, dans le salon de ton choix. Tu règles son titre, sa description, le texte du bouton et sa couleur' },
            { title: 'Ajoute des types de ticket', body: 'Recrutement, signalement, question… Chaque type a son nom, son emoji, sa catégorie et son rôle staff, et peut poser jusqu’à cinq questions au membre à l’ouverture' },
            { title: 'Teste avec ton propre compte', body: 'Ouvre un ticket comme un membre, réponds en tant que staff, ferme-le, et vérifie la transcription' },
          ],
        },
        {
          h2: 'Gérer un ticket au quotidien',
          body: 'Dans le salon d’un ticket, ces commandes remplacent les clics',
          commands: [
            { name: '/ticket claim', body: 'Prend en charge le ticket courant, pour que les autres modos sachent qu’il est géré' },
            { name: '/ticket close', body: 'Ferme le ticket. /ticket reopen le rouvre' },
            { name: '/ticket archive', body: 'Archive le ticket sans rien supprimer : le salon passe en lecture seule. /ticket unarchive le sort des archives' },
            { name: '/ticket lock duree:<durée>', body: 'Protège le ticket contre toute suppression, 7 jours, 30 jours, 90 jours ou en permanence. Option raison pour consigner le motif dans les logs' },
            { name: '/ticket add cible:<membre ou rôle>', body: 'Ajoute un membre ou un rôle au ticket. /ticket remove le retire, /ticket rename change le nom du salon' },
            { name: '/ticket delete', body: 'Supprime le ticket avec sa transcription' },
          ],
          figure: {
            screen: 'tickets',
            caption: 'L’écran Tickets du dashboard : la liste des demandes et la conversation. Démo sur des membres fictifs',
          },
        },
        {
          h2: 'Les réglages qui font gagner du temps',
          body: 'Une fois le système en place, quelques options évitent au staff de répéter les mêmes gestes',
          items: [
            { title: 'Macros', body: 'Des réponses pré-écrites que le staff insère en un clic, avec des actions optionnelles. Idéal pour les questions qui reviennent' },
            { title: 'Rappel d’inactivité', body: 'Un ticket resté sans réponse pendant le nombre d’heures que tu fixes reçoit un message de relance, que tu peux écrire toi-même' },
            { title: 'Sondage de satisfaction', body: 'À la fermeture, le membre note le support, et peut laisser un commentaire. Les avis peuvent être republiés dans un salon, avec ou sans le nom de l’auteur' },
            { title: 'Types avec leur propre équipe', body: 'Un ticket de recrutement peut aller dans une autre catégorie et vers un autre rôle qu’un ticket de support' },
            { title: 'Protection contre la suppression', body: 'Verrouille un ticket sensible pour qu’un modo ne le supprime pas par erreur' },
          ],
        },
        {
          h2: 'Trois erreurs courantes avec un système de tickets',
          body: 'Ce qui fait échouer un support par tickets est rarement technique',
          points: [
            'Trop de types dès le départ : commence avec deux ou trois, ajoute-en quand le besoin apparaît',
            'Personne n’est responsable : utilise la prise en charge pour qu’un ticket ait toujours un modo attitré',
            'Des tickets qui traînent : active le rappel d’inactivité pour relancer le membre, puis ferme ou archive sans attendre',
          ],
        },
      ],
      faq: [
        {
          q: 'Comment faire un système de tickets sur Discord ?',
          a: 'Discord n’en a pas en natif. Avec Kotbo, ouvre la page Tickets du dashboard, choisis le mode, la catégorie et le rôle staff, puis publie le panneau avec son bouton d’ouverture',
        },
        {
          q: 'Quel bot de tickets Discord choisir ?',
          a: 'Plusieurs bots proposent des tickets. Celui de Kotbo gère les types de demandes, les macros, le rappel d’inactivité, la transcription et le sondage de satisfaction, et vit dans le même dashboard que le reste de ton staff',
        },
        {
          q: 'Peut-on ouvrir un ticket en message privé ?',
          a: 'Oui, c’est l’un des trois modes. La commande /ticket open fonctionne aussi en message privé : le membre précise alors l’identifiant du serveur',
        },
        {
          q: 'Les tickets sont-ils gardés après la fermeture ?',
          a: 'Oui. Un ticket fermé peut être rouvert, et la suppression se fait avec une transcription. Pour tout garder sans rien supprimer, archive le ticket : le salon passe en lecture seule',
        },
        {
          q: 'Un modo peut-il supprimer un ticket par erreur ?',
          a: 'Pas si tu le protèges. /ticket lock empêche la suppression pendant 7, 30 ou 90 jours, ou en permanence, jusqu’à /ticket unlock',
        },
        {
          q: 'Peut-on poser des questions au membre avant d’ouvrir le ticket ?',
          a: 'Oui. Chaque type de ticket peut afficher un formulaire avec jusqu’à cinq champs, courts ou longs, obligatoires ou non',
        },
      ],
    },
    en: {
      title: 'Discord ticket bot: build a support ticket system',
      h1: 'Discord ticket bot: a complete support ticket system',
      description:
        'Discord ticket bot: how to build a ticket system with a panel, request types, staff claiming, macros, transcripts and a satisfaction survey, using Kotbo.',
      lead: 'A ticket system gives every request on your server its own private space: the member clicks a button, a channel opens, staff answer, then the ticket closes with a transcript. Discord has nothing like it built in, so you need a bot. In Kotbo everything is set up on the Tickets page of the dashboard, and the everyday actions are also available with /ticket from the ticket channel',
      sections: [
        {
          h2: 'What a Discord ticket bot is for',
          body: 'Without tickets, support runs through mods’ DMs or a public channel where everyone reads everyone else’s problems',
          points: [
            'Each request is isolated: only the member and the staff see the conversation',
            'Nothing gets lost, a ticket has a status (open, claimed, closed, archived)',
            'Staff see at a glance who is handling what',
            'The transcript keeps a record in case of a dispute',
          ],
        },
        {
          h2: 'What Discord offers without a bot',
          body: 'Nothing like it. Creating a private channel by hand for each request costs a mod time, and the permissions have to be set every time. A bot automates the channel creation, the permissions and the closing',
        },
        {
          h2: 'Setting up tickets with Kotbo',
          body: 'Everything is set on dash.kotbo.fr, in the Tickets page. Staff can also answer requests there, without opening Discord',
          steps: [
            { title: 'Pick the mode', body: 'A dedicated channel per ticket, a thread, or direct messages. A dedicated channel is the most common, a thread keeps your channel list tidy' },
            { title: 'Set the channels and the staff role', body: 'The category where tickets are filed, the logs channel, and the staff role that handles requests' },
            { title: 'Publish the panel', body: 'The message with the open button, in the channel of your choice. You set its title, description, button text and color' },
            { title: 'Add ticket types', body: 'Recruitment, report, question… Each type has its own name, emoji, category and staff role, and can ask the member up to five questions when opening' },
            { title: 'Test with your own account', body: 'Open a ticket as a member, answer as staff, close it, and check the transcript' },
          ],
        },
        {
          h2: 'Handling a ticket day to day',
          body: 'Inside a ticket channel, these commands replace clicking around. Option names are in French on every client',
          commands: [
            { name: '/ticket claim', body: 'Takes charge of the current ticket, so other mods know it’s handled' },
            { name: '/ticket close', body: 'Closes the ticket. /ticket reopen brings it back' },
            { name: '/ticket archive', body: 'Archives the ticket without deleting anything: the channel becomes read-only. /ticket unarchive takes it out of the archive' },
            { name: '/ticket lock duree:<duration>', body: 'Protects the ticket from deletion for 7 days, 30 days, 90 days or permanently. A reason option logs why' },
            { name: '/ticket add cible:<member or role>', body: 'Adds a member or a role to the ticket. /ticket remove takes them out, /ticket rename renames the channel' },
            { name: '/ticket delete', body: 'Deletes the ticket along with its transcript' },
          ],
          figure: {
            screen: 'tickets',
            caption: 'The Tickets screen of the dashboard: the list of requests and the conversation. Demo with made-up members',
          },
        },
        {
          h2: 'Settings that save time',
          body: 'Once the system is running, a few options spare staff from repeating the same moves',
          items: [
            { title: 'Macros', body: 'Pre-written replies staff insert in one click, with optional actions. Ideal for questions that keep coming back' },
            { title: 'Inactivity reminder', body: 'A ticket left without a reply for the number of hours you set gets a follow-up message, which you can write yourself' },
            { title: 'Satisfaction survey', body: 'On closing, the member rates the support and can leave a comment. Reviews can be reposted in a channel, with or without the author’s name' },
            { title: 'Types with their own team', body: 'A recruitment ticket can go to another category and another role than a support ticket' },
            { title: 'Deletion protection', body: 'Lock a sensitive ticket so a mod can’t delete it by mistake' },
          ],
        },
        {
          h2: 'Three common ticket mistakes',
          body: 'What makes ticket support fail is rarely technical',
          points: [
            'Too many types from the start: begin with two or three and add more when the need shows up',
            'Nobody owns the ticket: use claiming so every ticket always has a named mod',
            'Tickets that linger: turn on the inactivity reminder to nudge the member, then close or archive promptly',
          ],
        },
      ],
      faq: [
        {
          q: 'How do I make a ticket system on Discord?',
          a: 'Discord has no native one. With Kotbo, open the Tickets page of the dashboard, pick the mode, the category and the staff role, then publish the panel with its open button',
        },
        {
          q: 'Which Discord ticket bot should I use?',
          a: 'Several bots offer tickets. Kotbo’s handles request types, macros, inactivity reminders, transcripts and a satisfaction survey, and lives in the same dashboard as the rest of your staff tools',
        },
        {
          q: 'Can a ticket be opened by direct message?',
          a: 'Yes, it’s one of the three modes. The /ticket open command also works in DMs: the member then gives the server ID',
        },
        {
          q: 'Are tickets kept after closing?',
          a: 'Yes. A closed ticket can be reopened, and deleting one produces a transcript. To keep everything without deleting anything, archive the ticket: the channel becomes read-only',
        },
        {
          q: 'Can a mod delete a ticket by mistake?',
          a: 'Not if you protect it. /ticket lock blocks deletion for 7, 30 or 90 days, or permanently, until /ticket unlock',
        },
        {
          q: 'Can I ask the member questions before the ticket opens?',
          a: 'Yes. Each ticket type can show a form with up to five fields, short or long, required or not',
        },
      ],
    },
  },
};
