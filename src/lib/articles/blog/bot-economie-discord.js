/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'bot-economie-discord', en: 'discord-economy-bot' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['economy', 'marketplace'],
  text: {
    fr: {
      title: 'Bot économie Discord : monnaie, boutique et marché',
      h1: 'Une économie sur ton serveur Discord : monnaie, boutique de rôles et marché entre membres',
      description:
        'Bot économie Discord : crée une monnaie virtuelle, une boutique de rôles et un marché entre membres avec Kotbo, en gardant l’inflation sous contrôle.',
      lead: 'Discord n’a pas de monnaie intégrée : une économie de serveur passe forcément par un bot. Kotbo en installe une complète, avec une monnaie à ton nom, des gains quotidiens, une boutique de rôles payée en pièces et un marché où les membres se revendent leurs objets. Le tout se règle depuis le dashboard',
      sections: [
        {
          h2: 'À quoi sert une monnaie virtuelle sur Discord',
          body: 'Une économie donne une valeur à l’activité : on gagne des pièces en étant là, on les dépense dans quelque chose qui compte sur le serveur. Sans rien à acheter, les pièces ne valent rien. Sans dépenses, elles s’accumulent et plus personne ne les regarde. Tout le travail est dans cet équilibre',
          points: [
            'Une raison de repasser chaque jour, avec la récompense quotidienne et sa série',
            'Une récompense concrète pour les membres actifs : un rôle couleur, l’accès à un salon, un objet rare',
            'De quoi parler : le classement des plus riches, les enchères, la partie de dés perdue à la dernière seconde',
          ],
        },
        {
          h2: 'Les commandes pour gagner et dépenser des pièces',
          body: 'Les membres gagnent de la monnaie par commande, et aussi en parlant : quand le module Niveaux tourne, écrire et passer du temps en vocal rapporte quelques pièces, avec un délai entre deux gains pour que le spam ne paie pas',
          commands: [
            { name: '/daily', body: 'La récompense du jour, tirée entre un minimum et un maximum que tu fixes. Revenir sans interruption fait monter une série qui majore le gain' },
            { name: '/work', body: 'Un salaire toutes les heures, plus un peu d’XP du jeu. Il grandit avec le niveau du joueur' },
            { name: '/coins membre:<membre>', body: 'Le solde d’un membre, ou le tien sans option' },
            { name: '/give-coins membre:<membre> montant:<montant>', body: 'Donner des pièces à un autre membre, dans la limite du plafond par transfert et du délai entre deux envois que tu règles' },
            { name: '/richest', body: 'Les dix membres les plus riches du serveur' },
            { name: '/economy-info', body: 'Le résumé de l’économie du serveur : la monnaie, les façons d’en gagner, la boutique' },
          ],
        },
        {
          h2: 'Créer une boutique de rôles sur Discord',
          body: 'La boutique s’ouvre avec /boutique sur Discord, et sur la page Boutique du site du serveur. Chaque offre peut demander un rôle ou un niveau minimum, limiter les achats par membre, avoir un stock, s’offrir à quelqu’un d’autre ou passer par la validation du staff. Des codes promo, en pourcentage ou en montant, s’appliquent à toute la boutique ou à quelques offres',
          items: [
            { title: 'Rôle', body: 'Donné pour toujours ou pour un nombre de jours. Racheter un rôle temporaire prolonge la durée en cours' },
            { title: 'Abonnement', body: 'Un rôle payé à chaque période. Si le solde ne suit plus, le membre a des jours de grâce, puis le rôle lui est retiré' },
            { title: 'Objets et XP', body: 'Des objets du jeu livrés dans l’inventaire, ou de l’XP ajoutée au niveau du membre' },
            { title: 'Prestation', body: 'Ce que le staff livre à la main, comme un emoji perso ou un salon privé. La commande attend toujours une validation, et un refus rembourse le membre' },
          ],
        },
        {
          h2: 'Mettre en place l’économie pas à pas',
          body: 'Compte une demi-heure pour une première version qui tient la route, boutique comprise',
          steps: [
            { title: 'Active le module', body: 'Dans le dashboard, active Économie & RPG. La page Économie regroupe la configuration, les objets, la boutique, le marché noir et les joueurs' },
            { title: 'Nomme ta monnaie', body: 'Dans l’onglet Configuration, donne un nom et un emoji à ta monnaie, et une image si tu veux. Par défaut, elle s’appelle KotboCoins' },
            { title: 'Règle les gains', body: 'Fixe le minimum, le maximum et le délai du /daily. Commence bas : rendre les gains plus généreux passe toujours mieux que reprendre des pièces' },
            { title: 'Remplis la boutique', body: 'Ajoute deux ou trois offres qui ont du sens chez toi, un rôle couleur ou l’accès à un salon, avant de penser aux objets' },
            { title: 'Annonce-la', body: 'Poste un message qui renvoie vers /economy-info et /boutique, pour que les membres sachent quoi faire de leurs pièces' },
          ],
        },
        {
          h2: 'Les jeux d’argent, sans transformer le serveur en casino',
          body: 'Kotbo propose quatre jeux misés en pièces : /dice, /roulette, /rps et /guess, que /games présente. Ce sont eux qui font gonfler ou fondre les soldes le plus vite. Règle-les avant de les ouvrir, et si ton serveur accueille des mineurs, pose-toi franchement la question de les garder',
          points: [
            'Chaque jeu s’ouvre ou se ferme séparément, et un jeu fermé est refusé à tout le monde, administrateurs compris',
            'Une mise maximale, qui vaut pour /dice, /roulette et /rps',
            'Un nombre de parties par jour et par membre, tous jeux confondus',
          ],
        },
        {
          h2: 'Un marché entre membres pour faire circuler les objets',
          body: 'Avec le module Marché entre membres, /market ouvre l’hôtel des ventes : chacun y met en vente les objets de son inventaire, à prix fixe ou aux enchères, pour une durée d’une heure à sept jours. Les objets viennent de la boutique, des drops et du jeu de rôle, que les membres lancent avec /rpg, /tour et /raid',
          points: [
            'Le prix proposé à la mise en vente part de la moyenne des ventes du même objet sur les 30 derniers jours',
            'Un enchérisseur dépassé récupère sa mise',
            'Une taxe de 0 à 50 %, retenue au vendeur à chaque vente : ces pièces sortent de l’économie, ce qui freine l’inflation',
          ],
        },
        {
          h2: 'Garder une économie saine',
          body: 'Une économie qui marche fait sortir des pièces aussi régulièrement qu’elle en fait entrer',
          points: [
            'Des dépenses qui reviennent : abonnements, rôles temporaires, taxe du marché',
            'Des plafonds sur les mises et sur les transferts entre membres',
            '/remove-coins et /remove-item, réservées aux administrateurs, pour corriger un abus',
            'Une remise à zéro des joueurs, des objets ou de toute l’économie depuis le dashboard, quand il faut repartir propre',
          ],
        },
      ],
      faq: [
        {
          q: 'Comment créer une monnaie sur Discord ?',
          a: 'Discord n’a pas de monnaie intégrée, il faut un bot. Avec Kotbo, active le module Économie & RPG dans le dashboard, puis donne un nom et un emoji à ta monnaie dans l’onglet Configuration',
        },
        {
          q: 'Quel bot Discord pour une économie avec boutique de rôles ?',
          a: 'Kotbo gère la monnaie, les gains quotidiens, les jeux et une boutique qui vend des rôles permanents, temporaires ou en abonnement. Les membres l’ouvrent avec /boutique',
        },
        {
          q: 'Comment gagner des pièces sur un bot économie Discord ?',
          a: 'Avec Kotbo : /daily une fois par période, /work toutes les heures, les quêtes, les drops et, si le module Niveaux tourne, l’activité en texte et en vocal',
        },
        {
          q: 'Comment éviter l’inflation dans une économie Discord ?',
          a: 'Donne aux pièces des usages qui les font sortir : abonnements, rôles temporaires, taxe du marché. Plafonne aussi les mises et les transferts, et garde des gains quotidiens modestes au départ',
        },
        {
          q: 'Est-ce que les membres peuvent s’échanger des objets ?',
          a: 'Oui, avec le module Marché entre membres. /market ouvre l’hôtel des ventes, où chacun vend ses objets à prix fixe ou aux enchères',
        },
        {
          q: 'Peut-on désactiver les jeux d’argent d’un bot économie ?',
          a: 'Oui. Avec Kotbo, /dice, /roulette, /rps et /guess s’ouvrent ou se ferment un par un dans la page Économie, et un jeu fermé est refusé à tout le monde',
        },
      ],
    },
    en: {
      title: 'Discord economy bot: currency, role shop and market',
      h1: 'Set up a Discord server economy: currency, role shop and member marketplace',
      description:
        'Discord economy bot: create a virtual currency, a role shop and a member marketplace with Kotbo, and keep inflation in check. Commands and setup guide.',
      lead: 'Discord has no built-in currency, so a server economy always runs on a bot. Kotbo sets up a full one: a currency with your name on it, daily rewards, a role shop paid in coins and a marketplace where members resell their items. Everything is configured from the dashboard',
      sections: [
        {
          h2: 'Why add a virtual currency to your Discord server',
          body: 'An economy puts a value on activity: members earn coins for being around and spend them on something that matters on the server. With nothing to buy, coins are worthless. With nothing to spend them on, they pile up and nobody looks at them anymore. The whole job is that balance',
          points: [
            'A reason to drop by every day, with the daily reward and its streak',
            'A concrete reward for active members: a color role, access to a channel, a rare item',
            'Something to talk about: the richest members leaderboard, auctions, the dice game lost at the last second',
          ],
        },
        {
          h2: 'Economy commands to earn and spend coins',
          body: 'Members earn currency through commands, and by talking too: when the Leveling module is on, chatting and spending time in voice earns a few coins, with a delay between two rewards so spam doesn’t pay',
          commands: [
            { name: '/daily', body: 'Today’s reward, drawn between a minimum and a maximum you set. Coming back without a break builds a streak that raises the reward' },
            { name: '/work', body: 'A salary every hour, plus a bit of game XP. It grows with the player’s level' },
            { name: '/coins membre:<member>', body: 'A member’s balance, or yours with no option' },
            { name: '/give-coins membre:<member> montant:<amount>', body: 'Give coins to another member, within the per-transfer cap and the delay between transfers you set' },
            { name: '/richest', body: 'The ten richest members of the server' },
            { name: '/economy-info', body: 'A summary of the server economy: the currency, how to earn it, the shop' },
          ],
        },
        {
          h2: 'Build a Discord role shop',
          body: 'The shop opens with /boutique on Discord, and on the Shop page of the server’s website. Each offer can require a role or a minimum level, cap purchases per member, have a stock, be gifted to someone else or go through staff approval. Promo codes, as a percentage or a fixed amount, apply to the whole shop or to a few offers',
          items: [
            { title: 'Role', body: 'Given forever or for a number of days. Buying a timed role again extends the current period' },
            { title: 'Subscription', body: 'A role paid every period. If the balance runs short, the member gets grace days, then the role is removed' },
            { title: 'Items and XP', body: 'Game items delivered to the inventory, or XP added to the member’s level' },
            { title: 'Service', body: 'Something the staff delivers by hand, like a custom emoji or a private channel. The order always waits for approval, and a refusal refunds the member' },
          ],
        },
        {
          h2: 'How to set up the economy step by step',
          body: 'Plan half an hour for a first version that holds up, shop included',
          steps: [
            { title: 'Turn on the module', body: 'In the dashboard, turn on Economy & RPG. The Economy page groups the settings, items, shop, black market and players' },
            { title: 'Name your currency', body: 'In the Settings tab, give your currency a name and an emoji, plus an image if you like. By default it is called KotboCoins' },
            { title: 'Set the rewards', body: 'Set the minimum, maximum and delay of /daily. Start low: making rewards more generous always goes down better than taking coins back' },
            { title: 'Stock the shop', body: 'Add two or three offers that mean something on your server, a color role or access to a channel, before thinking about items' },
            { title: 'Announce it', body: 'Post a message pointing to /economy-info and /boutique, so members know what to do with their coins' },
          ],
        },
        {
          h2: 'Gambling games, without turning the server into a casino',
          body: 'Kotbo has four games played with coins: /dice, /roulette, /rps and /guess, listed by /games. They are what inflates or drains balances fastest. Set them up before opening them, and if your server has minors, think hard about keeping them at all',
          points: [
            'Each game opens or closes on its own, and a closed game is refused to everyone, administrators included',
            'A maximum bet, which applies to /dice, /roulette and /rps',
            'A number of games per day and per member, all games combined',
          ],
        },
        {
          h2: 'A member marketplace to keep items moving',
          body: 'With the Member marketplace module, /market opens the auction house: members list items from their inventory at a fixed price or as an auction, for one hour up to seven days. Items come from the shop, drops and the role-playing game, which members start with /rpg, /tower and /raid',
          points: [
            'The suggested listing price starts from the average sale price of the same item over the last 30 days',
            'An outbid bidder gets their bid back',
            'A 0 to 50 % tax taken from the seller on each sale: those coins leave the economy, which slows inflation',
          ],
        },
        {
          h2: 'Keep your economy healthy',
          body: 'A working economy takes coins out as steadily as it puts them in',
          points: [
            'Recurring spending: subscriptions, timed roles, marketplace tax',
            'Caps on bets and on transfers between members',
            '/remove-coins and /remove-item, for administrators only, to fix abuse',
            'A reset of players, items or the whole economy from the dashboard, when you need a clean start',
          ],
        },
      ],
      faq: [
        {
          q: 'How do I make a currency on Discord?',
          a: 'Discord has no built-in currency, so you need a bot. With Kotbo, turn on the Economy & RPG module in the dashboard, then give your currency a name and an emoji in the Settings tab',
        },
        {
          q: 'What is the best Discord bot for an economy with a role shop?',
          a: 'Kotbo handles the currency, daily rewards, games and a shop that sells permanent, timed or subscription roles. Members open it with /boutique',
        },
        {
          q: 'How do members earn coins with a Discord economy bot?',
          a: 'With Kotbo: /daily once per period, /work every hour, quests, drops and, when the Leveling module is on, text and voice activity',
        },
        {
          q: 'How do I prevent inflation in a Discord economy?',
          a: 'Give coins uses that take them out: subscriptions, timed roles, marketplace tax. Also cap bets and transfers, and keep daily rewards modest at first',
        },
        {
          q: 'Can members trade items with each other?',
          a: 'Yes, with the Member marketplace module. /market opens the auction house, where members sell items at a fixed price or as an auction',
        },
        {
          q: 'Can I turn off gambling in a Discord economy bot?',
          a: 'Yes. With Kotbo, /dice, /roulette, /rps and /guess open or close one by one on the Economy page, and a closed game is refused to everyone',
        },
      ],
    },
  },
};
