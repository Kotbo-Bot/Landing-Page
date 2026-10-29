/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'creer-site-serveur-discord', en: 'website-for-discord-server' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['site', 'site_wiki', 'site_blog'],
  text: {
    fr: {
      title: 'Créer un site pour son serveur Discord, sans coder',
      h1: 'Créer un site pour ton serveur Discord sans écrire une ligne de code',
      description:
        'Créer un site pour son serveur Discord : pages, wiki, blog, forum et blocs tirés du serveur, prêts en aperçu dès l’arrivée de Kotbo et en ligne en un clic.',
      lead: 'Pour donner un site à ton serveur Discord, tu peux en monter un à part et le tenir à jour à la main, ou le tirer de ce qui se passe déjà sur Discord. Kotbo prépare un site pour ton serveur, hors ligne, à l’adresse dash.kotbo.fr/s/ton-serveur : tu le relis en aperçu, tu le retouches, et tu le mets en ligne d’un clic',
      sections: [
        {
          h2: 'Pourquoi un serveur Discord a besoin d’un site',
          body: 'Tout ce qui se passe dans un serveur reste derrière la porte : il faut un compte, puis rejoindre, pour lire quoi que ce soit. Un site sert à tout ce qui doit se lire de l’extérieur',
          points: [
            'Être trouvé sur Google : un serveur Discord n’y apparaît pas, un site oui',
            'Montrer le règlement, l’équipe et les actus avant que les gens rejoignent',
            'Garder un wiki ou une FAQ qui ne se noie pas dans les messages',
            'Donner une porte aux membres bannis pour leur appel, puisqu’ils ne voient plus le serveur',
          ],
        },
        {
          h2: 'Ce que Kotbo met dans le site',
          body: 'Une page se compose de blocs empilés, édités tels qu’ils s’affichent. Une partie du contenu s’écrit, l’autre vient directement du serveur et se tient à jour toute seule',
          items: [
            { title: 'Pages libres', body: 'Texte, images, FAQ dépliable, bannières, chiffres clés. Chaque page se règle en public, membres connectés, rôles précis ou staff' },
            { title: 'Wiki', body: 'Une arborescence de pages avec étiquettes, historique des versions et recherche, que les membres retrouvent aussi sur Discord avec /wiki' },
            { title: 'Blog', body: 'Des articles datés avec auteur, flux RSS et commentaires des membres connectés, filtrés contre les liens d’arnaque' },
            { title: 'Forum', body: 'Un salon forum Discord recopié dans les deux sens : un fil devient un sujet, et une réponse écrite sur le site part dans le salon au nom du membre' },
            { title: 'Blocs des modules', body: 'Équipe, règlement, actualités, classements, clans, giveaways, événements, suggestions, recrutement, tickets, appels de ban, vocaux actifs, membres en ligne' },
            { title: 'Votes', body: 'Les liens de vote top.gg et d’annuaires de serveurs, avec vérification du vote quand le site de classement le propose, et le classement des votants' },
          ],
        },
        {
          h2: 'Mettre en ligne le site de ton serveur',
          body: 'Tout se passe dans la section Site communautaire du dashboard, en cinq onglets : Aperçu, Contenu, Apparence, Croissance et Réglages',
          steps: [
            { title: 'Ouvre l’aperçu', body: 'Kotbo prépare le site dès son activation, ou à l’ouverture de la section. Il devine le type de communauté, reprend les derniers messages de ton salon d’annonces en articles et recopie tes forums publics' },
            { title: 'Retouche les pages', body: 'Dans l’éditeur, tape / pour insérer un bloc. Plusieurs membres du staff peuvent écrire sur la même page en même temps' },
            { title: 'Règle l’apparence', body: 'Thème, couleur, police, menu. Les visiteurs choisissent entre clair et sombre' },
            { title: 'Relis en privé', body: 'Un lien d’aperçu montre le site entier avant sa mise en ligne, sans qu’il soit indexé' },
            { title: 'Publie', body: 'Un clic met le site en ligne. Une page peut aussi être programmée pour plus tard' },
          ],
        },
        {
          h2: 'Les commandes liées au site',
          body: 'Le site et le serveur se renvoient l’un vers l’autre, y compris depuis Discord',
          commands: [
            { name: '/wiki page:<page>', body: 'Cherche une page du wiki du site, avec autocomplétion, et renvoie son lien dans Discord' },
            { name: '/boutique', body: 'La boutique du serveur, en monnaie du bot : rôles, objets, abonnements. Elle se tient sur Discord, ses réglages sont dans l’onglet Boutique de la page Économie' },
          ],
        },
        {
          h2: 'Un site qui ramène des membres',
          body: 'Un site qui ne fait pas rejoindre le serveur ne sert qu’à moitié. Kotbo mesure le chemin complet, sans cookie',
          points: [
            'Le bouton Rejoindre passe par une invitation suivie, étiquetée Site web',
            'Le tunnel compte les visiteurs, les clics sur Rejoindre, les arrivées par cette invitation et celles encore là au bout de 7 jours',
            'Un plan du site pour Google, et une carte de partage générée pour les liens collés sur les réseaux',
            'Les forums recopiés d’un salon public deviennent des pages qu’un moteur de recherche peut trouver',
          ],
        },
        {
          h2: 'Ce que le site ne fait pas',
          body: 'Mieux vaut le savoir avant de commencer',
          points: [
            'Il vit à l’adresse dash.kotbo.fr/s/ suivie du nom choisi, que tu peux changer : l’ancienne adresse redirige',
            'La mention Propulsé par Kotbo reste en pied de page',
            'La boutique ne se vend pas sur le site, seulement sur Discord avec /boutique',
            'Un bloc dont le module est éteint disparaît du site, et l’éditeur te le signale',
          ],
        },
      ],
      faq: [
        {
          q: 'Comment créer un site pour son serveur Discord ?',
          a: 'Avec Kotbo, le site est préparé dès l’activation du bot : ouvre la section Site communautaire du dashboard, relis l’aperçu, retouche les pages et publie. Aucun code ni hébergement à gérer',
        },
        {
          q: 'Est-ce qu’un serveur Discord apparaît sur Google ?',
          a: 'Non, le contenu d’un serveur n’est pas lisible par les moteurs de recherche. Un site public avec plan du site, wiki et forum recopié l’est',
        },
        {
          q: 'Peut-on mettre un wiki sur son serveur Discord ?',
          a: 'Le wiki vit sur le site, avec arborescence, étiquettes et historique. Sur Discord, /wiki retrouve une page et en donne le lien',
        },
        {
          q: 'Est-ce que le site se met à jour tout seul ?',
          a: 'Les blocs tirés du serveur, comme les classements, les giveaways ou les membres en ligne, se lisent en direct. Les messages du salon d’annonces peuvent aussi devenir des articles',
        },
        {
          q: 'Peut-on cacher certaines pages au public ?',
          a: 'Oui. Chaque page se règle en public, membres du serveur connectés avec Discord, rôles précis ou staff',
        },
        {
          q: 'Plusieurs personnes peuvent-elles modifier le site ?',
          a: 'Oui. Le staff édite à plusieurs en direct, et les rôles rédacteurs choisis pour le wiki et le blog écrivent sans accès au reste du dashboard',
        },
      ],
    },
    en: {
      title: 'Website for a Discord server, without coding',
      h1: 'Build a website for your Discord server without writing any code',
      description:
        'A website for your Discord server: pages, wiki, blog, forum and blocks pulled from the server, ready to preview once Kotbo arrives and online in one click.',
      lead: 'To give your Discord server a website, you can build one on the side and update it by hand, or pull it from what already happens on Discord. Kotbo prepares a site for your server, offline, at dash.kotbo.fr/s/your-server: you review the preview, tweak it, and put it online in one click',
      sections: [
        {
          h2: 'Why a Discord server needs a website',
          body: 'Everything in a server stays behind the door: you need an account, then to join, before reading anything. A website is for what should be readable from outside',
          points: [
            'Showing up on Google: a Discord server doesn’t, a website does',
            'Showing your rules, team and news before people join',
            'Keeping a wiki or FAQ that doesn’t drown in chat',
            'Giving banned members somewhere to appeal, since they can’t see the server anymore',
          ],
        },
        {
          h2: 'What Kotbo puts on the site',
          body: 'A page is a stack of blocks, edited as they look. Some of it you write, the rest comes straight from the server and stays up to date on its own',
          items: [
            { title: 'Free pages', body: 'Text, images, collapsible FAQ, banners, key figures. Each page can be public, for signed-in members, for given roles or for staff' },
            { title: 'Wiki', body: 'A tree of pages with tags, version history and search, which members also reach from Discord with /wiki' },
            { title: 'Blog', body: 'Dated posts with an author, an RSS feed and comments from signed-in members, filtered for scam links' },
            { title: 'Forum', body: 'A Discord forum channel mirrored both ways: a thread becomes a topic, and a reply written on the site goes to the channel under the member’s name' },
            { title: 'Module blocks', body: 'Team, rules, news, leaderboards, clans, giveaways, events, suggestions, recruitment, tickets, ban appeals, active voice channels, members online' },
            { title: 'Votes', body: 'Vote links for top.gg and server lists, with vote checking when the ranking site supports it, and a voter leaderboard' },
          ],
        },
        {
          h2: 'Putting your server’s website online',
          body: 'It all happens in the dashboard’s Community site section, across five tabs: Overview, Content, Appearance, Growth and Settings',
          steps: [
            { title: 'Open the preview', body: 'Kotbo prepares the site when it’s activated, or when you open the section. It guesses your community type, turns the latest posts of your announcements channel into articles and mirrors your public forums' },
            { title: 'Edit the pages', body: 'In the editor, type / to insert a block. Several staff members can write on the same page at the same time' },
            { title: 'Set the look', body: 'Theme, colour, font, menu. Visitors pick light or dark' },
            { title: 'Review privately', body: 'A preview link shows the whole site before it goes live, without being indexed' },
            { title: 'Publish', body: 'One click puts the site online. A page can also be scheduled for later' },
          ],
        },
        {
          h2: 'Commands that work with the site',
          body: 'The site and the server point to each other, Discord side included',
          commands: [
            { name: '/wiki page:<page>', body: 'Searches the site’s wiki, with autocomplete, and returns the page link in Discord' },
            { name: '/boutique', body: 'The server shop, paid in the bot’s currency: roles, items, subscriptions. It runs on Discord, and its settings sit in the Shop tab of the Economy page' },
          ],
        },
        {
          h2: 'A website that brings members in',
          body: 'A site that doesn’t get people to join only does half the job. Kotbo measures the whole path, without cookies',
          points: [
            'The Join button goes through a tracked invite, labelled Site web',
            'The funnel counts visitors, Join clicks, joins through that invite and those still there after 7 days',
            'A sitemap for Google, and a generated share card for links posted on social media',
            'Forums mirrored from a public channel become pages a search engine can find',
          ],
        },
        {
          h2: 'What the site doesn’t do',
          body: 'Better to know before you start',
          points: [
            'It lives at dash.kotbo.fr/s/ followed by the name you choose, which you can change: the old address redirects',
            'The Powered by Kotbo mention stays in the footer',
            'The shop isn’t sold on the site, only on Discord with /boutique',
            'A block whose module is off disappears from the site, and the editor flags it',
          ],
        },
      ],
      faq: [
        {
          q: 'How do I make a website for my Discord server?',
          a: 'With Kotbo, the site is prepared as soon as the bot is activated: open the dashboard’s Community site section, review the preview, edit the pages and publish. No code and no hosting to manage',
        },
        {
          q: 'Do Discord servers show up on Google?',
          a: 'No, what’s inside a server can’t be read by search engines. A public website with a sitemap, a wiki and a mirrored forum can',
        },
        {
          q: 'Can I have a wiki for my Discord server?',
          a: 'The wiki lives on the site, with a page tree, tags and history. On Discord, /wiki finds a page and links to it',
        },
        {
          q: 'Does the website update itself?',
          a: 'Blocks pulled from the server, like leaderboards, giveaways or members online, read live data. Posts from your announcements channel can also become articles',
        },
        {
          q: 'Can I hide some pages from the public?',
          a: 'Yes. Each page can be public, limited to server members signed in with Discord, to given roles, or to staff',
        },
        {
          q: 'Can several people edit the website?',
          a: 'Yes. Staff edit together in real time, and the writer roles you pick for the wiki and blog can write without access to the rest of the dashboard',
        },
      ],
    },
  },
};
