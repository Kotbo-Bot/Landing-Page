/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'reglement-serveur-discord', en: 'discord-server-rules-bot' },
  date: '2026-11-01',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['regulation'],
  text: {
    fr: {
      title: 'Règlement Discord : écrire, publier et faire accepter les règles',
      h1: 'Règlement de serveur Discord : écrire les règles et les faire accepter',
      description:
        'Règlement de serveur Discord : comment rédiger des règles claires, les publier en articles, ajouter un bouton J’accepte qui donne un rôle et lier les sanctions au règlement avec Kotbo.',
      lead: 'Un règlement est la première chose qu’un nouveau membre devrait lire, et la première chose que tu sortiras quand il faudra sanctionner. Discord n’a qu’un écran de règles basique à l’arrivée. Dans Kotbo, le règlement s’écrit en articles sur la page Règlement du dashboard, se publie dans un salon, peut se faire accepter d’un clic, et chaque sanction s’appuie ensuite sur l’article enfreint',
      sections: [
        {
          h2: 'Pourquoi un règlement structuré en articles',
          body: 'Un long message d’épingle que personne ne lit ne protège pas un serveur. Des articles courts, numérotés, changent la donne',
          points: [
            'Un membre sanctionné sait précisément quelle règle il a enfreinte',
            'Tes modos citent un article plutôt que d’improviser un motif',
            'Tu modifies une règle sans réécrire tout le message',
            'Les rapports de sanction s’appuient sur les mêmes articles, donc restent cohérents',
          ],
        },
        {
          h2: 'Ce que Discord propose sans bot',
          body: 'Discord propose un écran de règles à valider à l’arrivée sur un serveur communautaire, avec un texte libre. C’est utile, mais le règlement reste un bloc de texte : pas d’articles à numéroter, pas de lien avec les sanctions, pas de rôle donné à l’acceptation pour ouvrir le reste du serveur',
        },
        {
          h2: 'Écrire et publier ton règlement avec Kotbo',
          body: 'Tout se règle sur dash.kotbo.fr, page Règlement',
          steps: [
            { title: 'Crée les articles', body: 'Un titre, un emoji facultatif, et une description en Markdown. Un article par règle, courte et précise : « Respect et courtoisie », « Pas de publicité », « Pas de contenu sensible »' },
            { title: 'Ordonne-les', body: 'Glisse les articles pour les réorganiser. Un article peut être masqué sans être supprimé' },
            { title: 'Choisis le salon de publication', body: 'Le règlement s’affiche en messages propres dans le salon que tu désignes' },
            { title: 'Publie', body: 'Un clic sur « Publier le règlement ». Quand tu changes un article, « Actualiser le message » met à jour le message publié' },
            { title: 'Garde un aperçu', body: 'Pendant que tu écris un article, un aperçu montre son rendu' },
          ],
        },
        {
          h2: 'Faire accepter le règlement avec un bouton',
          body: 'Un règlement lu à moitié ne vaut rien. L’option « J’accepte » ajoute un bouton sous le règlement publié',
          items: [
            { title: 'Rôle donné à l’acceptation', body: 'Le clic donne le rôle que tu choisis. Laisse vide et Kotbo crée un rôle « Vérifié » au premier clic' },
            { title: 'Masquer le reste du serveur', body: 'Tant qu’il n’a pas accepté, le membre ne voit que le salon du règlement. Les autres salons s’ouvrent avec le rôle' },
            { title: 'Mise à jour du bouton', body: 'Le bouton apparaît ou disparaît à la prochaine publication du règlement' },
          ],
        },
        {
          h2: 'Le parcours d’arrivée complet',
          body: 'Le règlement s’inscrit dans un parcours que la page résume dans l’ordre, chaque étape étant facultative',
          points: [
            'Le captcha, si le module anti-raid est actif, pour écarter les comptes automatiques',
            'La vérification d’identité, si le module Multi-comptes est actif',
            'L’acceptation du règlement, avec le rôle donné au clic',
          ],
        },
        {
          h2: 'Relier le règlement aux sanctions',
          body: 'Quand un modo sanctionne un membre, il peut citer l’article enfreint, et les rapports de sanction reprennent le texte de la règle. Supprimer un article le retire des futurs rapports. C’est ce lien qui rend le règlement utile au quotidien, et pas seulement décoratif',
        },
        {
          h2: 'Conseils pour un règlement qui se lit',
          body: 'Quelques réflexes pour que tes règles soient lues et appliquées',
          points: [
            'Dix articles au maximum : au-delà, plus personne ne retient rien',
            'Une règle, une idée : un article qui en mélange trois est impossible à citer',
            'Dis ce qui est interdit, et ce qui se passe quand on l’enfreint',
            'Relis-le à chaque incident qui t’a surpris : une règle manquante se rajoute en un article',
          ],
        },
      ],
      faq: [
        {
          q: 'Comment faire un règlement sur Discord ?',
          a: 'Avec Kotbo, ouvre la page Règlement du dashboard, crée un article par règle, choisis le salon de publication et clique sur « Publier le règlement »',
        },
        {
          q: 'Comment faire accepter le règlement à l’arrivée ?',
          a: 'Active le bouton « J’accepte » : il donne un rôle au clic, et tu peux masquer les autres salons tant qu’il n’est pas cliqué',
        },
        {
          q: 'Comment modifier le règlement après l’avoir publié ?',
          a: 'Change l’article dans le dashboard, puis clique sur « Actualiser le message » : le message publié sur Discord est mis à jour',
        },
        {
          q: 'Peut-on masquer un article sans le supprimer ?',
          a: 'Oui, un article peut être désactivé : il n’apparaît plus dans le règlement publié, et tu peux le réactiver plus tard',
        },
        {
          q: 'Que se passe-t-il si je supprime un article ?',
          a: 'Il disparaît de tous les futurs rapports de sanction. Si tu veux seulement le retirer du règlement public, masque-le plutôt',
        },
        {
          q: 'Le bouton J’accepte remplace-t-il un captcha ?',
          a: 'Non, ce sont deux étapes différentes du parcours d’arrivée. Le captcha vérifie que le compte est humain, l’acceptation prouve que le règlement a été vu',
        },
      ],
    },
    en: {
      title: 'Discord rules: write, publish and get them accepted',
      h1: 'Discord server rules: write them and get them accepted',
      description:
        'Discord server rules: how to write clear rules, publish them as articles, add an I accept button that grants a role, and tie sanctions to the rules with Kotbo.',
      lead: 'Rules are the first thing a new member should read, and the first thing you’ll pull out when it’s time to sanction. Discord only offers a basic rules screen on arrival. In Kotbo the rules are written as articles in the Rules page of the dashboard, published in a channel, accepted with one click, and each sanction then points to the article that was broken',
      sections: [
        {
          h2: 'Why structure rules as articles',
          body: 'A long pinned message nobody reads doesn’t protect a server. Short, numbered articles change that',
          points: [
            'A sanctioned member knows exactly which rule they broke',
            'Your mods cite an article instead of improvising a reason',
            'You edit one rule without rewriting the whole message',
            'Sanction reports rely on the same articles, so they stay consistent',
          ],
        },
        {
          h2: 'What Discord offers without a bot',
          body: 'Discord offers a rules screen to accept when joining a community server, with free text. It’s useful, but the rules stay a block of text: no numbered articles, no link to sanctions, no role granted on acceptance to open up the rest of the server',
        },
        {
          h2: 'Writing and publishing your rules with Kotbo',
          body: 'Everything is set on dash.kotbo.fr, in the Rules page',
          steps: [
            { title: 'Create the articles', body: 'A title, an optional emoji, and a Markdown description. One article per rule, short and precise: “Respect and courtesy”, “No advertising”, “No sensitive content”' },
            { title: 'Order them', body: 'Drag articles to reorder them. An article can be hidden without being deleted' },
            { title: 'Pick the publishing channel', body: 'The rules appear as clean messages in the channel you choose' },
            { title: 'Publish', body: 'One click on “Publish the rules”. When you change an article, “Update the message” refreshes the published message' },
            { title: 'Keep a preview', body: 'While you write an article, a preview shows how it will look' },
          ],
        },
        {
          h2: 'Getting the rules accepted with a button',
          body: 'Rules read halfway are worthless. The “I accept” option adds a button under the published rules',
          items: [
            { title: 'Role granted on acceptance', body: 'The click grants the role you pick. Leave it empty and Kotbo creates a “Verified” role on the first click' },
            { title: 'Hide the rest of the server', body: 'Until they accept, the member only sees the rules channel. Other channels open with the role' },
            { title: 'Button refresh', body: 'The button appears or disappears at the next publication of the rules' },
          ],
        },
        {
          h2: 'The full arrival path',
          body: 'The rules fit into a path the page summarizes in order, every step being optional',
          points: [
            'The captcha, if the anti-raid module is on, to keep automated accounts out',
            'Identity verification, if the Multi-accounts module is on',
            'Accepting the rules, with the role granted on click',
          ],
        },
        {
          h2: 'Tying rules to sanctions',
          body: 'When a mod sanctions a member, they can cite the broken article, and sanction reports reuse the rule’s text. Deleting an article removes it from future reports. That link is what makes rules useful day to day, not just decorative',
        },
        {
          h2: 'Tips for rules that get read',
          body: 'A few habits so your rules are read and applied',
          points: [
            'Ten articles at most: beyond that nobody remembers anything',
            'One rule, one idea: an article mixing three can’t be cited',
            'Say what’s forbidden, and what happens when it’s broken',
            'Reread them after every incident that surprised you: a missing rule is one article away',
          ],
        },
      ],
      faq: [
        {
          q: 'How do I make rules on Discord?',
          a: 'With Kotbo, open the Rules page of the dashboard, create one article per rule, pick the publishing channel and click “Publish the rules”',
        },
        {
          q: 'How do I make new members accept the rules?',
          a: 'Turn on the “I accept” button: it grants a role on click, and you can hide the other channels until it’s clicked',
        },
        {
          q: 'How do I edit the rules after publishing?',
          a: 'Change the article in the dashboard, then click “Update the message”: the message published on Discord is refreshed',
        },
        {
          q: 'Can I hide an article without deleting it?',
          a: 'Yes, an article can be deactivated: it no longer shows in the published rules, and you can bring it back later',
        },
        {
          q: 'What happens if I delete an article?',
          a: 'It disappears from all future sanction reports. If you only want it out of the public rules, hide it instead',
        },
        {
          q: 'Does the I accept button replace a captcha?',
          a: 'No, they’re two different steps of the arrival path. The captcha checks the account is human, the acceptance proves the rules were seen',
        },
      ],
    },
  },
};
