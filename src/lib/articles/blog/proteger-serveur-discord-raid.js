/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'proteger-serveur-discord-raid', en: 'discord-anti-raid-bot' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['raid_protection', 'automod'],
  text: {
    fr: {
      title: 'Protéger son serveur Discord d’un raid : guide anti-raid',
      h1: 'Comment protéger ton serveur Discord d’un raid',
      description:
        'Comment protéger ton serveur Discord d’un raid : réglages natifs, bot anti-raid, verrou des arrivées et salon piège. Le pas-à-pas complet avec Kotbo.',
      lead: 'Un raid, c’est une vague de comptes qui rejoignent ton serveur en même temps pour spammer, pinger tout le monde ou poster des arnaques. Pour t’en protéger, règle d’abord ce que Discord propose, puis confie à un bot anti-raid la détection de la vague et la fermeture de la porte. Voici comment faire avec Kotbo, commande par commande',
      sections: [
        {
          h2: 'Reconnaître un raid Discord',
          body: 'Un raid se voit vite, mais souvent trop tard pour réagir à la main. Les comptes sont créés à la chaîne ou piratés, et ils arrivent groupés. Les signes qui reviennent',
          points: [
            'Des dizaines d’arrivées en une minute, souvent avec des comptes créés le jour même',
            'Le même message copié dans plusieurs salons, avec des mentions en masse',
            'Des MP d’arnaque envoyés à tes membres juste après l’arrivée des comptes',
            'Des invitations créées en rafale par un compte que personne ne connaît',
          ],
        },
        {
          h2: 'Ce que Discord fait déjà sans bot',
          body: 'Avant d’installer quoi que ce soit, passe par les paramètres de ton serveur. Discord a ses propres protections, et elles restent utiles avec un bot',
          items: [
            {
              title: 'Le niveau de vérification',
              body: 'Il filtre les arrivants selon leur compte : e-mail vérifié, compte créé depuis plus de 5 minutes, membre depuis plus de 10 minutes, ou téléphone vérifié au niveau le plus haut',
            },
            {
              title: 'L’AutoMod natif',
              body: 'Il bloque des mots, le spam de mentions et les messages que Discord juge suspects, avant qu’ils soient publiés',
            },
            {
              title: 'La pause des invitations et des MP',
              body: 'Discord te laisse suspendre les invitations et les messages privés entre membres. Cette pause dure 24 h au plus, après quoi il faut la relancer',
            },
            {
              title: 'Les permissions de @everyone',
              body: 'Retire à @everyone le droit de mentionner tout le monde et de créer des invitations. Un raid qui ne peut pas pinger fait beaucoup moins de dégâts',
            },
          ],
        },
        {
          h2: 'Configurer un bot anti-raid avec Kotbo',
          body: 'Ce qui manque à ces réglages, c’est une réaction réglée à ta façon : un seuil que tu choisis, une action automatique, une alerte dans ton salon staff et un verrou qui tient plus de 24 h. Le module Protection anti-raid de Kotbo s’en charge',
          steps: [
            {
              title: 'Active la détection',
              body: 'Tape /protection antiraid activer. Par défaut, 10 arrivées en 60 secondes font passer le serveur en mode raid. Les options seuil et fenetre changent ces deux valeurs',
            },
            {
              title: 'Choisis l’action automatique',
              body: 'L’option action propose trois réponses : bloquer les arrivées (le choix par défaut), forcer le captcha pour tous les arrivants, ou les expulser. L’expulsion rejette aussi les vrais membres tant que le mode raid dure',
            },
            {
              title: 'Donne-lui un salon d’alerte',
              body: 'Avec l’option salon-alertes, Kotbo y poste l’alerte et un bouton pour désactiver le mode raid. Sans salon, le mode raid s’active sans que personne soit prévenu',
            },
            {
              title: 'Règle la levée automatique',
              body: 'L’option duree fixe combien de minutes le mode raid reste actif quand il s’est lancé seul, 30 par défaut. Un mode raid lancé à la main ne se lève qu’à la main',
            },
            {
              title: 'Filtre les comptes trop récents',
              body: 'Dans le dashboard, Protection › Anti-raid, la section Comptes trop récents compare chaque arrivée à la date de création du compte. Tu choisis le seuil en jours ou en mois, puis signaler, expulser ou bannir, avec une liste d’exemptions',
            },
          ],
        },
        {
          h2: 'Les commandes pour arrêter un raid en cours',
          body: 'Quand le raid est déjà là, ces commandes coupent l’entrée et calment les salons. Elles sont réservées aux administrateurs par défaut, et les mêmes bascules existent en haut de la page Anti-raid du dashboard',
          commands: [
            {
              name: '/protection raidmode on',
              body: 'Passe le serveur en mode raid tout de suite, avec l’action que tu as choisie. Il reste actif jusqu’à /protection raidmode off',
            },
            {
              name: '/protection joinlock on',
              body: 'Bloque les nouvelles arrivées en suspendant les invitations. Sans durée, le verrou est permanent : Kotbo le renouvelle chaque heure, au-delà des 24 h de Discord',
            },
            {
              name: '/protection lockdown on',
              body: 'Verrouille le salon, sa catégorie ou tous les salons publics du serveur, avec une raison affichée. /protection lockdown off rend à chaque salon ses permissions d’origine',
            },
            {
              name: '/protection dmlock on',
              body: 'Bloque les MP entre membres issus du serveur, le temps que les arnaques en message privé s’arrêtent',
            },
            {
              name: '/protection invites urgence',
              body: 'Avec actif:true, supprime toutes les invitations existantes, puis chaque nouvelle invitation, jusqu’à ce que tu le coupes',
            },
            {
              name: '/protection status',
              body: 'Affiche l’état de chaque protection : captcha, anti-raid, mode raid, verrous, salons verrouillés, filtre anti-arnaque et invitations',
            },
          ],
        },
        {
          h2: 'Le salon piège contre les bots de spam',
          body: 'Le salon piège (honeypot) est un salon posé en haut de la liste, ouvert à tous, qui dit en gros de ne pas y écrire. Les humains lisent le panneau. Les bots de spam et les comptes piratés, beaucoup moins',
          items: [
            {
              title: 'Ce qui se passe quand quelqu’un y écrit',
              body: 'Le message est supprimé, une transcription du salon est gardée comme preuve et jointe à la sanction. Les images et les liens postés rejoignent la base du filtre anti-arnaque, qui reconnaîtra la même campagne ailleurs sur le serveur',
            },
            {
              title: 'La sanction, à toi de la choisir',
              body: 'Par défaut, une exclusion temporaire de 28 jours. Tu peux passer au ban, au softban, au kick ou au simple warn. Les administrateurs et les rôles staff configurés dans Kotbo peuvent y écrire sans risque',
            },
            {
              title: 'Une seconde chance pour les distraits',
              body: 'Avec le kick ou le softban, Kotbo peut envoyer en MP une invitation à usage unique, valable 24 h, à celui qui a écrit par erreur',
            },
            {
              title: 'Où le créer',
              body: 'Dans la page Salons du dashboard, section Salon piège : choisis un salon existant ou clique sur Créer automatiquement',
            },
          ],
        },
        {
          h2: 'Après le raid, faire le ménage',
          body: 'Une fois la porte fermée, il reste les comptes entrés et ce qu’ils ont posté',
          items: [
            {
              title: 'Remonter la chaîne des invitations',
              body: 'Dans Protection › Anti-raid, le lignage des invitations montre qui a invité un membre et qui est entré par la même porte. Tu peux mettre toute la branche en quarantaine, après un aperçu du nombre de membres touchés',
            },
            {
              title: 'Filtrer les arnaques qui restent',
              body: '/protection scam activer supprime les liens d’arnaque connus, faux Nitro et phishing, et peut avertir, exclure temporairement ou bannir leur auteur',
            },
            {
              title: 'Laisser l’AutoMod tenir les salons',
              body: 'Le spam, les mentions en masse et les liens se filtrent message par message avec l’AutoMod de Kotbo, en plus de l’AutoMod de Discord',
              link: { feature: 'automod', label: 'Lire l’article sur l’AutoMod' },
            },
          ],
        },
      ],
      faq: [
        {
          q: 'Comment arrêter un raid sur Discord ?',
          a: 'Coupe d’abord les arrivées, en mettant les invitations en pause dans les paramètres du serveur ou avec /protection joinlock on. Verrouille ensuite les salons touchés, puis sanctionne les comptes du raid',
        },
        {
          q: 'Quel bot anti-raid utiliser sur Discord ?',
          a: 'Il te faut un bot qui repère une vague d’arrivées, ferme la porte et prévient ton staff. Kotbo le fait avec /protection, et ajoute un salon piège, un captcha et un filtre anti-arnaque réglables depuis un dashboard web',
        },
        {
          q: 'Est-ce que Discord a une protection anti-raid native ?',
          a: 'Oui : le niveau de vérification, l’AutoMod natif et la pause des invitations et des MP pendant 24 h au plus. Un bot ajoute un seuil que tu règles, une action automatique et un verrou qui dure plus longtemps',
        },
        {
          q: 'Combien d’arrivées déclenchent le mode raid de Kotbo ?',
          a: 'Par défaut, 10 arrivées en 60 secondes. Tu changes ces valeurs avec les options seuil et fenetre de /protection antiraid activer, ou dans le dashboard',
        },
        {
          q: 'Le salon piège peut-il sanctionner un membre du staff ?',
          a: 'Non. Les administrateurs et les membres qui portent les rôles staff configurés dans Kotbo peuvent y écrire sans sanction',
        },
        {
          q: 'Que se passe-t-il pour les vrais membres pendant un raid ?',
          a: 'Avec l’action qui bloque les arrivées, personne ne peut rejoindre tant que le mode raid dure. Ceux qui passent malgré la pause peuvent être expulsés avec un message en MP que tu rédiges',
        },
      ],
    },
    en: {
      title: 'How to stop a raid on Discord: anti-raid bot guide',
      h1: 'How to stop a raid on Discord, and keep the next one out',
      description:
        'How to stop a raid on Discord: native settings, an anti-raid bot, a join lock and a honeypot channel. A step-by-step guide to raid protection with Kotbo.',
      lead: 'A raid is a wave of accounts joining your server at once to spam, ping everyone or post scams. To stop one, set up what Discord already offers, then let an anti-raid bot spot the wave and shut the door for you. Here is how to do it with Kotbo, command by command',
      sections: [
        {
          h2: 'How to spot a Discord raid',
          body: 'A raid is easy to see and hard to handle by hand. The accounts are mass-created or hacked, and they show up together. The usual signs',
          points: [
            'Dozens of joins in a minute, often from accounts created the same day',
            'The same message pasted in several channels, with mass mentions',
            'Scam DMs hitting your members right after the accounts arrive',
            'Invites created in bursts by an account nobody knows',
          ],
        },
        {
          h2: 'What Discord does without a bot',
          body: 'Before adding anything, open your server settings. Discord has its own protections, and they stay useful next to a bot',
          items: [
            {
              title: 'Verification level',
              body: 'It filters newcomers by their account: verified email, account older than 5 minutes, member for more than 10 minutes, or verified phone at the highest level',
            },
            {
              title: 'Native AutoMod',
              body: 'It blocks keywords, mention spam and messages Discord flags as suspicious before they are posted',
            },
            {
              title: 'Pausing invites and DMs',
              body: 'Discord lets you pause invites and direct messages between members. The pause lasts 24 hours at most, then you have to set it again',
            },
            {
              title: '@everyone permissions',
              body: 'Take away the right to mention everyone and to create invites from @everyone. A raid that can’t ping does far less damage',
            },
          ],
        },
        {
          h2: 'Setting up a Discord anti-raid bot',
          body: 'What these settings lack is a response tuned to your server: a threshold you pick, an automatic action, an alert in your staff channel and a lock that holds past 24 hours. Kotbo’s raid protection module covers that',
          steps: [
            {
              title: 'Turn on detection',
              body: 'Run /protection antiraid activer. By default, 10 joins within 60 seconds switch the server to raid mode. The seuil and fenetre options change those two numbers',
            },
            {
              title: 'Pick the automatic action',
              body: 'The action option offers three responses: lock joins (the default), force a captcha on every newcomer, or kick them. Kicking also turns real members away for as long as raid mode lasts',
            },
            {
              title: 'Give it an alert channel',
              body: 'With the salon-alertes option, Kotbo posts the alert there with a button to turn raid mode off. Without a channel, raid mode starts and nobody hears about it',
            },
            {
              title: 'Set the automatic release',
              body: 'The duree option sets how many minutes an automatic raid mode lasts, 30 by default. A raid mode you started by hand only ends by hand',
            },
            {
              title: 'Filter brand-new accounts',
              body: 'On the dashboard’s Anti-raid page, the account age section checks each join against the account’s creation date. Set a minimum in days or months, then alert, kick or ban, with an allow list for exceptions',
            },
          ],
        },
        {
          h2: 'Commands to stop a raid in progress',
          body: 'When the raid is already on, these commands close the door and calm the channels down. Subcommands and options are typed in French. They are admin-only by default, and the same switches sit at the top of the dashboard’s Anti-raid page',
          commands: [
            {
              name: '/protection raidmode on',
              body: 'Puts the server in raid mode right away, with the action you picked. It stays on until /protection raidmode off',
            },
            {
              name: '/protection joinlock on',
              body: 'Blocks new joins by pausing invites. Without a duration the lock is permanent: Kotbo renews it every hour, past Discord’s 24 hours',
            },
            {
              name: '/protection lockdown on',
              body: 'Locks the channel, its category or every public channel on the server, with a reason shown to members. /protection lockdown off gives each channel its original permissions back',
            },
            {
              name: '/protection dmlock on',
              body: 'Blocks DMs between members that come through the server, until the scam messages stop',
            },
            {
              name: '/protection invites urgence',
              body: 'With actif:true, deletes every existing invite, then every new one, until you turn it off',
            },
            {
              name: '/protection status',
              body: 'Shows the state of each protection: captcha, anti-raid, raid mode, locks, locked channels, scam filter and invites',
            },
          ],
        },
        {
          h2: 'A honeypot channel for spam bots',
          body: 'The honeypot is a channel placed at the top of the list, open to everyone, that basically says do not post here. People read the sign. Spam bots and hacked accounts, not so much',
          items: [
            {
              title: 'What happens when someone posts there',
              body: 'The message is deleted and a transcript of the channel is kept as evidence on the sanction. Posted images and links join the scam filter’s database, so the same campaign gets caught elsewhere on the server',
            },
            {
              title: 'You pick the sanction',
              body: 'A 28-day timeout by default. You can switch to a ban, softban, kick or a plain warning. Admins and the staff roles set in Kotbo can post there safely',
            },
            {
              title: 'A second chance for the absent-minded',
              body: 'With kick or softban, Kotbo can DM a single-use invite, valid for 24 hours, to whoever posted by mistake',
            },
            {
              title: 'Where to set it up',
              body: 'On the dashboard’s Channels page, in the honeypot section: pick an existing channel or let Kotbo create one',
            },
          ],
        },
        {
          h2: 'Cleaning up after the raid',
          body: 'Once the door is shut, you still have the accounts that got in and what they posted',
          items: [
            {
              title: 'Trace the invite chain',
              body: 'On the Anti-raid page, invite lineage shows who invited a member and who else came in the same way. You can quarantine the whole branch after a preview of how many members it touches',
            },
            {
              title: 'Filter the scams left behind',
              body: '/protection scam activer deletes known scam links, fake Nitro and phishing, and can warn, time out or ban whoever posted them',
            },
            {
              title: 'Let AutoMod hold the channels',
              body: 'Spam, mass mentions and links get filtered message by message by Kotbo’s AutoMod, on top of Discord’s own',
              link: { feature: 'automod', label: 'Read the AutoMod article' },
            },
          ],
        },
      ],
      faq: [
        {
          q: 'How do you stop a raid on Discord?',
          a: 'First stop the joins, by pausing invites in server settings or with /protection joinlock on. Then lock the affected channels and sanction the raid accounts',
        },
        {
          q: 'What is a good anti-raid bot for Discord?',
          a: 'You want a bot that spots a wave of joins, shuts the door and alerts your staff. Kotbo does that with /protection, and adds a honeypot, a captcha and a scam filter you configure from a web dashboard',
        },
        {
          q: 'Does Discord have built-in raid protection?',
          a: 'Yes: verification levels, native AutoMod, and pausing invites and DMs for up to 24 hours. A bot adds a threshold you set, an automatic action and a lock that lasts longer',
        },
        {
          q: 'How many joins trigger Kotbo’s raid mode?',
          a: 'By default, 10 joins within 60 seconds. You change those values with the seuil and fenetre options of /protection antiraid activer, or on the dashboard',
        },
        {
          q: 'Can the honeypot channel punish a staff member?',
          a: 'No. Admins and members with the staff roles configured in Kotbo can post there without a sanction',
        },
        {
          q: 'What happens to real members during a raid?',
          a: 'With the join lock action, nobody can join while raid mode lasts. Anyone who slips through the pause can be kicked with a DM you write',
        },
      ],
    },
  },
};
