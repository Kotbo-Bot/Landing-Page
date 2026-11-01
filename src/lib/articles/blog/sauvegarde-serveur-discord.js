/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'sauvegarde-serveur-discord', en: 'discord-server-backup-restore' },
  date: '2026-11-01',
  author: 'Kotbo',
  /** Pas de module dans le registre : la sauvegarde est une page de l'outil (Sauvegardes) et la commande /backup. */
  modules: [],
  text: {
    fr: {
      title: 'Sauvegarde de serveur Discord : sauvegarder et restaurer',
      h1: 'Sauvegarde de serveur Discord : copier et restaurer salons, rôles et réglages',
      description:
        'Sauvegarde de serveur Discord : comment sauvegarder les salons, les rôles, les emojis et la configuration, exporter en JSON et restaurer après un raid ou une erreur, avec Kotbo.',
      lead: 'Un serveur Discord se construit sur des mois : des dizaines de salons, des rôles, des permissions réglées au détail. Un raid, un admin qui dérape ou un mauvais clic suffisent à tout défaire, et Discord n’a pas de bouton pour revenir en arrière. Avec Kotbo, tu gardes une copie de ton serveur sur la page Sauvegardes du dashboard ou avec la commande /backup, et tu la restaures en cas de problème',
      sections: [
        {
          h2: 'Pourquoi sauvegarder un serveur Discord',
          body: 'Personne ne planifie de perdre son serveur, et pourtant ça arrive vite',
          points: [
            'Un raid supprime des salons et des rôles en quelques secondes',
            'Un compte admin piraté ou un modo en colère peut tout casser',
            'Une restructuration qui tourne mal se défait avec une restauration',
            'Tu peux dupliquer une structure éprouvée sur un nouveau serveur',
          ],
        },
        {
          h2: 'Ce que Discord propose sans bot',
          body: 'Discord permet de dupliquer un serveur en modèle, mais le modèle ne garde ni les messages, ni les membres, ni les réglages d’un bot, et ne se restaure pas sur un serveur existant. Il n’y a pas d’historique de versions. Pour une vraie sauvegarde, il faut un bot qui enregistre l’état du serveur',
        },
        {
          h2: 'Créer une sauvegarde avec Kotbo',
          body: 'La commande est réservée aux administrateurs. Elle se lance depuis Discord, ou depuis la page Sauvegardes de dash.kotbo.fr',
          steps: [
            { title: 'Lance la sauvegarde', body: 'Avec /backup create, ou le bouton Nouvelle sauvegarde du dashboard. Sans nom, la sauvegarde prend le nom du serveur et la date' },
            { title: 'Choisis ce qui est inclus', body: 'Rôles, salons, emojis, stickers, membres et configuration de Kotbo (modules, staff, formulaires…) sont inclus par défaut. Les messages ne le sont pas, tu peux les ajouter' },
            { title: 'Attends la fin', body: 'Le dashboard suit les étapes : rôles et salons, permissions et emojis, enregistrement. Le traitement se fait en tâche de fond' },
            { title: 'Vérifie la liste', body: 'Chaque sauvegarde indique le nombre de rôles, de salons, d’emojis, de stickers et de membres qu’elle contient' },
          ],
        },
        {
          h2: 'Les commandes de sauvegarde',
          body: 'Toutes demandent le droit d’administrateur',
          commands: [
            { name: '/backup create nom:<nom> description:<texte>', body: 'Crée une sauvegarde. Options en plus pour inclure ou non les messages, les membres, les rôles, les salons, les emojis, les stickers et la configuration Kotbo' },
            { name: '/backup list', body: 'Liste les sauvegardes du serveur' },
            { name: '/backup restore id:<id> mode_complet:<oui ou non>', body: 'Restaure une sauvegarde. Par défaut la restauration est sélective, mode_complet demande une restauration complète' },
            { name: '/backup export id:<id>', body: 'Exporte une sauvegarde en fichier JSON' },
            { name: '/backup import fichier:<fichier>', body: 'Importe une sauvegarde depuis un fichier JSON, avec un nom en option' },
            { name: '/backup delete id:<id>', body: 'Supprime une sauvegarde' },
          ],
        },
        {
          h2: 'Restaurer : ce qu’il faut savoir avant de cliquer',
          body: 'Une restauration applique les rôles, les salons et les permissions sauvegardés, et écrase la configuration actuelle du serveur avec les données de la sauvegarde. L’action est irréversible, donc fais d’abord une sauvegarde de l’état actuel si tu doutes. Pense aussi à remonter le rôle de Kotbo en haut de la liste des rôles : il ne peut rétablir que ce qui se trouve sous lui',
        },
        {
          h2: 'Exporter, importer, dupliquer',
          body: 'Le format JSON sert à trois choses',
          items: [
            { title: 'Garder une copie hors de Kotbo', body: 'Exporte la sauvegarde et range le fichier avec tes archives' },
            { title: 'Déplacer un serveur', body: 'Importe le fichier sur un autre serveur pour y reprendre la même structure' },
            { title: 'Partager un modèle', body: 'Un fichier peut servir de point de départ à un nouveau serveur de ta communauté' },
          ],
        },
        {
          h2: 'Combien de sauvegardes, et à quel rythme',
          body: 'Chaque serveur peut garder jusqu’à 3 sauvegardes à la fois. Supprime la plus ancienne pour en créer une nouvelle. Fais-en une avant chaque grosse modification de structure (nouvelle catégorie, refonte des rôles), et exporte régulièrement la plus récente en JSON pour ne pas dépendre de la limite',
        },
      ],
      faq: [
        {
          q: 'Comment sauvegarder un serveur Discord ?',
          a: 'Avec Kotbo, lance /backup create ou ouvre la page Sauvegardes du dashboard. Les rôles, salons, emojis, stickers, membres et la configuration de Kotbo sont inclus par défaut',
        },
        {
          q: 'Comment restaurer un serveur Discord après un raid ?',
          a: 'Ouvre la page Sauvegardes, choisis la sauvegarde et clique sur Restaurer, ou lance /backup restore. La restauration applique les rôles, salons et permissions sauvegardés',
        },
        {
          q: 'Les messages sont-ils sauvegardés ?',
          a: 'Pas par défaut. L’option est désactivée et tu peux l’ajouter à la création de la sauvegarde',
        },
        {
          q: 'Combien de sauvegardes peut-on garder ?',
          a: 'Trois par serveur. Supprime-en une pour en créer une nouvelle, ou exporte-les en JSON pour les garder ailleurs',
        },
        {
          q: 'Qui peut créer ou restaurer une sauvegarde ?',
          a: 'La commande /backup demande le droit d’administrateur du serveur',
        },
        {
          q: 'Peut-on restaurer une sauvegarde sur un autre serveur ?',
          a: 'Oui, en exportant la sauvegarde en JSON puis en l’important sur l’autre serveur avec /backup import ou depuis la page Sauvegardes',
        },
      ],
    },
    en: {
      title: 'Discord server backup: back up and restore',
      h1: 'Discord server backup: copy and restore channels, roles and settings',
      description:
        'Discord server backup: how to back up channels, roles, emojis and configuration, export to JSON and restore after a raid or a mistake, with Kotbo.',
      lead: 'A Discord server is built over months: dozens of channels, roles, permissions tuned in detail. A raid, an admin going rogue or one wrong click can undo it all, and Discord has no button to go back. With Kotbo you keep a copy of your server in the Backups page of the dashboard or with the /backup command, and restore it when something goes wrong',
      sections: [
        {
          h2: 'Why back up a Discord server',
          body: 'Nobody plans on losing their server, yet it happens fast',
          points: [
            'A raid deletes channels and roles in seconds',
            'A hijacked admin account or an angry mod can break everything',
            'A restructuring that goes badly can be undone with a restore',
            'You can duplicate a proven structure onto a new server',
          ],
        },
        {
          h2: 'What Discord offers without a bot',
          body: 'Discord lets you duplicate a server as a template, but a template keeps no messages, no members and no bot settings, and can’t be restored onto an existing server. There is no version history. For a real backup you need a bot that records the server’s state',
        },
        {
          h2: 'Creating a backup with Kotbo',
          body: 'The command is reserved for administrators. It runs from Discord, or from the Backups page of dash.kotbo.fr',
          steps: [
            { title: 'Start the backup', body: 'With /backup create, or the New backup button in the dashboard. Without a name, the backup is named after the server and the date' },
            { title: 'Choose what’s included', body: 'Roles, channels, emojis, stickers, members and Kotbo’s configuration (modules, staff, forms…) are included by default. Messages are not, you can add them' },
            { title: 'Wait for it to finish', body: 'The dashboard follows the steps: roles and channels, permissions and emojis, saving. Processing runs in the background' },
            { title: 'Check the list', body: 'Each backup shows how many roles, channels, emojis, stickers and members it holds' },
          ],
        },
        {
          h2: 'Backup commands',
          body: 'All of them require the administrator permission',
          commands: [
            { name: '/backup create nom:<name> description:<text>', body: 'Creates a backup. Extra options to include or skip messages, members, roles, channels, emojis, stickers and the Kotbo configuration' },
            { name: '/backup list', body: 'Lists the server’s backups' },
            { name: '/backup restore id:<id> mode_complet:<yes or no>', body: 'Restores a backup. Restoring is selective by default, mode_complet asks for a full restore' },
            { name: '/backup export id:<id>', body: 'Exports a backup as a JSON file' },
            { name: '/backup import fichier:<file>', body: 'Imports a backup from a JSON file, with an optional name' },
            { name: '/backup delete id:<id>', body: 'Deletes a backup' },
          ],
        },
        {
          h2: 'Restoring: what to know before you click',
          body: 'A restore applies the saved roles, channels and permissions, and overwrites the server’s current configuration with the backup’s data. It can’t be undone, so take a backup of the current state first if you’re unsure. Also move Kotbo’s role to the top of the role list: it can only restore what sits below it',
        },
        {
          h2: 'Exporting, importing, duplicating',
          body: 'The JSON format serves three purposes',
          items: [
            { title: 'Keep a copy outside Kotbo', body: 'Export the backup and file it with your archives' },
            { title: 'Move a server', body: 'Import the file on another server to rebuild the same structure there' },
            { title: 'Share a template', body: 'A file can be the starting point for a new server in your community' },
          ],
        },
        {
          h2: 'How many backups, and how often',
          body: 'Each server can keep up to 3 backups at a time. Delete the oldest to create a new one. Make one before every big structure change (a new category, a role overhaul), and export the latest to JSON regularly so you don’t depend on the limit',
        },
      ],
      faq: [
        {
          q: 'How do I back up a Discord server?',
          a: 'With Kotbo, run /backup create or open the Backups page of the dashboard. Roles, channels, emojis, stickers, members and Kotbo’s configuration are included by default',
        },
        {
          q: 'How do I restore a Discord server after a raid?',
          a: 'Open the Backups page, pick the backup and click Restore, or run /backup restore. The restore applies the saved roles, channels and permissions',
        },
        {
          q: 'Are messages backed up?',
          a: 'Not by default. The option is off and you can add it when creating the backup',
        },
        {
          q: 'How many backups can I keep?',
          a: 'Three per server. Delete one to create a new one, or export them to JSON to keep them elsewhere',
        },
        {
          q: 'Who can create or restore a backup?',
          a: 'The /backup command requires the server’s administrator permission',
        },
        {
          q: 'Can I restore a backup onto another server?',
          a: 'Yes, by exporting the backup as JSON then importing it on the other server with /backup import or from the Backups page',
        },
      ],
    },
  },
};
