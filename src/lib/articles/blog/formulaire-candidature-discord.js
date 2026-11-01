/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'formulaire-candidature-discord', en: 'discord-application-form-bot' },
  date: '2026-11-01',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['custom_forms'],
  text: {
    fr: {
      title: 'Formulaire Discord : candidature, inscription et sondage en ligne',
      h1: 'Formulaire Discord : créer un formulaire de candidature ou d’inscription',
      description:
        'Formulaire Discord : comment créer un formulaire en ligne pour des candidatures, des inscriptions ou des sondages, avec logique conditionnelle, lien public et fermeture automatique, avec Kotbo.',
      lead: 'Un formulaire Discord sert à récolter des réponses structurées : une candidature de modo, une inscription à un événement, un avis sur le serveur. Discord n’a pas de formulaire natif, et un salon où chacun écrit sa candidature en vrac devient vite ingérable. Dans Kotbo, tu construis le formulaire dans le dashboard, tu partages un lien public, et les réponses arrivent dans une liste que le staff trie',
      sections: [
        {
          h2: 'À quoi sert un formulaire sur un serveur Discord',
          body: 'Dès que tu poses plus de trois questions, un message libre ne suffit plus',
          points: [
            'Les candidatures reçoivent les mêmes questions, donc se comparent facilement',
            'Les inscriptions à un événement sont comptées sans que personne tienne une liste',
            'Un sondage plus riche qu’un simple vote avec des réactions',
            'Rien ne se perd dans un salon qui défile',
          ],
        },
        {
          h2: 'Ce que Discord propose sans bot',
          body: 'Discord a des fenêtres de saisie réservées aux bots et aux applications, mais aucune interface pour construire un formulaire sans coder. Les serveurs bricolent avec des liens vers des services externes, que les membres ouvrent sans toujours savoir à qui ils répondent',
        },
        {
          h2: 'Construire un formulaire avec Kotbo',
          body: 'Tout se règle sur dash.kotbo.fr, page Formulaires. Le bouton Nouveau formulaire demande un nom et une description, puis ouvre l’éditeur',
          steps: [
            { title: 'Pose les questions', body: 'Texte court ou paragraphe, choix unique, cases à cocher, liste déroulante, échelle linéaire, grilles, date, heure, email, nombre. Des titres de section structurent les longs formulaires' },
            { title: 'Ajoute une logique conditionnelle', body: 'Selon la réponse à une question, le membre saute vers une autre section. Un candidat modo ne voit que les questions qui le concernent' },
            { title: 'Habille-le', body: 'Couleur d’accent, bannière, logo, police, arrondi des cartes. Un aperçu montre le rendu avant publication' },
            { title: 'Écris le message de confirmation', body: 'Ce que le membre lit juste après l’envoi, par exemple le délai de réponse' },
            { title: 'Active-le et copie le lien public', body: 'Le formulaire est accessible par un lien. Colle-le dans un salon, un ticket ou un message épinglé' },
          ],
        },
        {
          h2: 'Exiger la connexion Discord ou non',
          body: 'Tu choisis si le membre doit se connecter avec son compte Discord pour répondre. Avec la connexion, tu sais qui répond et tu peux lui donner un rôle ensuite. Sans, le formulaire est ouvert à tous. Pour un formulaire de recrutement, la connexion est toujours exigée',
        },
        {
          h2: 'Utiliser un formulaire pour recruter',
          body: 'Un formulaire peut être relié au module Recrutement. Les candidatures arrivent alors dans le suivi des recrutements, et la hiérarchie visée détermine le rôle ou le grade donné automatiquement à l’embauche',
          items: [
            { title: 'Hiérarchie visée', body: 'Le grade attribué à l’embauche depuis ce formulaire. Sans hiérarchie, c’est le rôle le plus bas' },
            { title: 'Fermeture à X recrues', body: 'Le formulaire se ferme quand le nombre de recrues voulu est atteint. Tu choisis de compter toutes les recrues, ou de recompter à chaque réouverture' },
            { title: 'Fermeture à X candidatures en attente', body: 'Il se ferme quand trop de candidatures attendent une réponse, et rouvre dès que l’une est tranchée' },
            { title: 'Fermé par Kotbo', body: 'Le formulaire indique pourquoi il a été fermé, et tu peux le rouvrir à la main ou monter le plafond' },
          ],
        },
        {
          h2: 'Traiter les réponses',
          body: 'Chaque formulaire a sa liste de réponses dans le dashboard, avec le nombre de soumissions. Le staff les relit à son rythme, loin du flux d’un salon. Un formulaire d’inscription à un événement se relie à l’événement : sans formulaire, un clic sur « S’inscrire » suffit, avec, le membre répond d’abord',
        },
      ],
      faq: [
        {
          q: 'Comment faire un formulaire sur Discord ?',
          a: 'Avec Kotbo, ouvre la page Formulaires du dashboard, clique sur Nouveau formulaire, ajoute tes questions, puis copie le lien public pour le partager',
        },
        {
          q: 'Comment faire un formulaire de candidature pour mon staff ?',
          a: 'Crée un formulaire, relie-le au module Recrutement, choisis la hiérarchie visée, et exige la connexion Discord. Les candidatures arrivent dans le suivi des recrutements',
        },
        {
          q: 'Peut-on poser des questions différentes selon les réponses ?',
          a: 'Oui, avec la logique conditionnelle : selon la réponse à une question, le membre est dirigé vers la section suivante',
        },
        {
          q: 'Le membre doit-il se connecter avec Discord ?',
          a: 'C’est un réglage du formulaire. Pour un formulaire de recrutement, la connexion est toujours exigée',
        },
        {
          q: 'Peut-on fermer un formulaire automatiquement ?',
          a: 'Oui, quand un nombre de recrues est atteint ou quand trop de candidatures sont en attente. Kotbo indique la raison de la fermeture',
        },
        {
          q: 'À quoi ressemble le formulaire pour le membre ?',
          a: 'À une page web que tu peux habiller avec ton logo, ta bannière et ta couleur. Tu vois l’aperçu avant de publier',
        },
      ],
    },
    en: {
      title: 'Discord form: applications, sign-ups and online surveys',
      h1: 'Discord form: build an application or sign-up form',
      description:
        'Discord form: how to create an online form for applications, sign-ups or surveys, with conditional logic, a public link and automatic closing, with Kotbo.',
      lead: 'A Discord form collects structured answers: a mod application, an event sign-up, feedback on the server. Discord has no native form, and a channel where everyone writes their application in bulk quickly becomes unmanageable. In Kotbo you build the form in the dashboard, share a public link, and answers land in a list staff can sort through',
      sections: [
        {
          h2: 'What a form is for on a Discord server',
          body: 'As soon as you ask more than three questions, a free message isn’t enough',
          points: [
            'Applications get the same questions, so they compare easily',
            'Event sign-ups are counted without anyone keeping a list',
            'A richer survey than a simple reaction vote',
            'Nothing gets lost in a scrolling channel',
          ],
        },
        {
          h2: 'What Discord offers without a bot',
          body: 'Discord has input windows reserved for bots and apps, but no interface to build a form without coding. Servers make do with links to outside services, which members open without always knowing who they’re answering',
        },
        {
          h2: 'Building a form with Kotbo',
          body: 'Everything is set on dash.kotbo.fr, in the Forms page. The New form button asks for a name and a description, then opens the editor',
          steps: [
            { title: 'Add the questions', body: 'Short text or paragraph, single choice, checkboxes, dropdown, linear scale, grids, date, time, email, number. Section titles structure long forms' },
            { title: 'Add conditional logic', body: 'Depending on the answer to a question, the member jumps to another section. A mod applicant only sees the questions that concern them' },
            { title: 'Style it', body: 'Accent color, banner, logo, font, card rounding. A preview shows the result before publishing' },
            { title: 'Write the confirmation message', body: 'What the member reads right after sending, for example the response time' },
            { title: 'Turn it on and copy the public link', body: 'The form is reachable through a link. Paste it in a channel, a ticket or a pinned message' },
          ],
        },
        {
          h2: 'Requiring Discord login or not',
          body: 'You choose whether the member must sign in with their Discord account to answer. With login, you know who is answering and can give them a role afterwards. Without it, the form is open to everyone. For a recruitment form, login is always required',
        },
        {
          h2: 'Using a form to recruit',
          body: 'A form can be linked to the Recruitment module. Applications then land in the recruitment tracking, and the target hierarchy determines the role or rank given automatically on hiring',
          items: [
            { title: 'Target hierarchy', body: 'The rank assigned on hiring from this form. With no hierarchy, it’s the lowest role' },
            { title: 'Close at X hires', body: 'The form closes when the number of hires you want is reached. You choose to count all hires, or to recount on each reopening' },
            { title: 'Close at X pending applications', body: 'It closes when too many applications await an answer, and reopens as soon as one is decided' },
            { title: 'Closed by Kotbo', body: 'The form says why it was closed, and you can reopen it by hand or raise the cap' },
          ],
        },
        {
          h2: 'Handling the answers',
          body: 'Each form has its own list of answers in the dashboard, with the number of submissions. Staff go through them at their own pace, away from a channel’s flow. An event sign-up form is linked to the event: with no form, one click on “Sign up” is enough, with one, the member answers first',
        },
      ],
      faq: [
        {
          q: 'How do I make a form on Discord?',
          a: 'With Kotbo, open the Forms page of the dashboard, click New form, add your questions, then copy the public link to share it',
        },
        {
          q: 'How do I make an application form for my staff?',
          a: 'Create a form, link it to the Recruitment module, pick the target hierarchy, and require Discord login. Applications arrive in the recruitment tracking',
        },
        {
          q: 'Can I ask different questions depending on the answers?',
          a: 'Yes, with conditional logic: depending on the answer to a question, the member is sent to the next section',
        },
        {
          q: 'Does the member have to sign in with Discord?',
          a: 'It’s a setting of the form. For a recruitment form, login is always required',
        },
        {
          q: 'Can a form close automatically?',
          a: 'Yes, when a number of hires is reached or when too many applications are pending. Kotbo shows the reason for the closing',
        },
        {
          q: 'What does the form look like to the member?',
          a: 'A web page you can dress up with your logo, banner and color. You see the preview before publishing',
        },
      ],
    },
  },
};
