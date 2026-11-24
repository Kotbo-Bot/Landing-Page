/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'securiser-serveur-discord-checklist', en: 'discord-server-security-checklist' },
  date: '2026-11-24',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['automod', 'raid_protection', 'double_accounts'],
  text: {
    fr: {
      title: 'Sécuriser un serveur Discord : la checklist',
      h1: 'Sécuriser un serveur Discord : la checklist en 10 points',
      description:
        'La checklist pour sécuriser un serveur Discord : vérification, permissions, 2FA du staff, AutoMod, anti-raid, arnaques, logs et doubles comptes. Pas à pas.',
      lead: 'Un serveur Discord se fait attaquer par des raids, des arnaques, des modérateurs piratés et des bannis qui reviennent. La plupart des protections tiennent en quelques réglages. Voici les dix à passer en revue, dans l’ordre, avec ce que Discord fait déjà et ce que Kotbo ajoute',
      sections: [
        {
          h2: 'D’abord, les réglages de Discord',
          body: 'Ils ne coûtent rien et couvrent les attaques les plus courantes. Passe-les en revue avant d’installer un bot',
          steps: [
            {
              title: '1. Monte le niveau de vérification',
              body: 'Il filtre les arrivants selon leur compte : e-mail vérifié, compte créé depuis plus de 5 minutes, membre depuis plus de 10 minutes, ou téléphone vérifié au niveau le plus haut',
            },
            {
              title: '2. Réduis les permissions de @everyone',
              body: 'Retire le droit de mentionner tout le monde et de créer des invitations. Un compte qui ne peut pas pinger ni inviter fait beaucoup moins de dégâts',
            },
            {
              title: '3. Donne le moins de permissions possible au staff',
              body: 'Réserve Administrateur à une ou deux personnes de confiance. Un compte de modérateur piraté avec cette permission peut tout supprimer',
            },
            {
              title: '4. Exige la double authentification pour la modération',
              body: 'Discord permet d’imposer l’authentification à deux facteurs à tout membre qui bannit, expulse ou gère les salons et les rôles. C’est la meilleure défense contre un compte de modérateur volé',
            },
          ],
        },
        {
          h2: 'Ensuite, ce qu’un bot ajoute',
          body: 'Les réglages natifs filtrent, mais ils ne réagissent pas à ta façon. Les six derniers points reposent sur Kotbo, dont les protections ci-dessous sont gratuites',
          steps: [
            {
              title: '5. Active les règles d’AutoMod',
              body: 'Kotbo crée pour toi les règles natives de Discord (mots interdits, invitations vers d’autres serveurs) et ajoute l’anti-spam, les liens avec une liste de domaines autorisés, les majuscules, les emojis et les mentions en rafale',
            },
            {
              title: '6. Règle l’anti-raid',
              body: 'Tu fixes un seuil, par exemple 10 arrivées en 60 secondes. Au-delà, Kotbo bloque les arrivées, impose un captcha ou exclut les nouveaux venus, prévient le staff et lève le mode raid tout seul après la durée choisie',
            },
            {
              title: '7. Pose un salon piège',
              body: 'Un salon que personne ne lit, où seuls les bots de spam écrivent. Le premier message posté dedans déclenche la sanction que tu as choisie. Le staff n’est jamais piégé',
            },
            {
              title: '8. Bloque les faux Nitro et le phishing',
              body: 'Le filtre anti-arnaque de Kotbo traite les liens de faux Nitro, de phishing, les domaines jumeaux et les QR codes avant que tes membres ne cliquent',
            },
            {
              title: '9. Active les logs',
              body: 'Le journal d’audit de Discord ne garde ni le contenu des messages supprimés ni plus de 45 jours d’historique. Kotbo enregistre messages supprimés et modifiés, arrivées, rôles et salons dans un salon de logs et dans le dashboard',
            },
            {
              title: '10. Repère les doubles comptes',
              body: 'Un banni qui revient avec un autre compte contourne tout le reste. La détection de Kotbo compare chaque arrivant aux membres connus et laisse le staff trancher',
            },
          ],
        },
        {
          h2: 'Que faire quand ça arrive quand même',
          body: 'Aucune checklist n’est parfaite. Prévois la réponse avant d’en avoir besoin',
          points: [
            'Un salon staff où arrivent les alertes, lu en priorité',
            'Un mode raid que tu sais lever à la main ou laisser expirer',
            'Des sanctions consignées avec leur auteur et leur raison, pour ne pas rejuger un cas',
            'Un formulaire d’appel de ban pour les erreurs, plutôt que des messages privés',
          ],
        },
        {
          h2: 'Pour aller plus loin',
          body: 'Les trois modules qui portent le plus de poids dans cette checklist, détaillés',
          items: [
            {
              title: 'AutoMod et anti-raid',
              body: 'Règles natives, anti-spam, captcha et salon piège',
              link: { feature: 'automod', label: 'Voir l’AutoMod et l’anti-raid' },
            },
            {
              title: 'Logs Discord',
              body: 'Qui a fait quoi, messages supprimés compris',
              link: { feature: 'logs', label: 'Voir les logs' },
            },
            {
              title: 'Détecteur de doubles comptes',
              body: 'Gratuit, le staff tranche',
              link: { feature: 'double_accounts', label: 'Voir le détecteur de doubles comptes' },
            },
          ],
        },
      ],
      faq: [
        {
          q: 'Comment sécuriser un serveur Discord ?',
          a: 'Monte le niveau de vérification, réduis les permissions de @everyone et du staff, impose la double authentification pour la modération, puis ajoute un bot qui gère l’AutoMod, l’anti-raid, les arnaques, les logs et les doubles comptes',
        },
        {
          q: 'Le niveau de vérification de Discord suffit-il contre les raids ?',
          a: 'Il écarte les comptes tout neufs, mais pas un raid de comptes anciens ou piratés. Un anti-raid avec seuil et réaction automatique couvre ce que le réglage natif ne fait pas',
        },
        {
          q: 'Qu’est-ce qui met le plus un serveur en danger ?',
          a: 'Un compte de modérateur piraté avec des permissions élevées. Réserve Administrateur à très peu de personnes et impose la double authentification pour la modération',
        },
        {
          q: 'Ces protections sont-elles payantes ?',
          a: 'Non : l’AutoMod, l’anti-raid, les logs et la détection des doubles comptes sont inclus dans l’offre gratuite de Kotbo',
        },
      ],
    },
    en: {
      title: 'Discord Server Security Checklist (10 Steps)',
      h1: 'How to secure a Discord server: a 10-step checklist',
      description:
        'The checklist to secure a Discord server: verification, permissions, staff 2FA, AutoMod, anti-raid, scams, logs and alt accounts. Step by step.',
      lead: 'A Discord server gets hit by raids, scams, hijacked moderator accounts and banned members who come back. Most protections come down to a handful of settings. Here are the ten to go through, in order, with what Discord already does and what Kotbo adds',
      sections: [
        {
          h2: 'First, Discord’s own settings',
          body: 'They cost nothing and cover the most common attacks. Go through them before installing a bot',
          steps: [
            {
              title: '1. Raise the verification level',
              body: 'It filters newcomers by their account: verified email, account older than 5 minutes, member for more than 10 minutes, or a verified phone at the highest level',
            },
            {
              title: '2. Trim @everyone’s permissions',
              body: 'Remove the right to mention everyone and to create invites. An account that can’t ping or invite does far less damage',
            },
            {
              title: '3. Give staff the fewest permissions possible',
              body: 'Keep Administrator for one or two trusted people. A hijacked moderator account with that permission can delete everything',
            },
            {
              title: '4. Require two-factor authentication for moderation',
              body: 'Discord lets you require 2FA from anyone who bans, kicks or manages channels and roles. It’s the best defense against a stolen moderator account',
            },
          ],
        },
        {
          h2: 'Then, what a bot adds',
          body: 'Native settings filter, but they don’t react your way. The last six points rely on Kotbo, whose protections below are free',
          steps: [
            {
              title: '5. Turn on AutoMod rules',
              body: 'Kotbo creates Discord’s native rules for you (blocked words, invites to other servers) and adds anti-spam, links with an allow list of domains, caps, emoji floods and mass mentions',
            },
            {
              title: '6. Set up anti-raid',
              body: 'You set a threshold, say 10 joins in 60 seconds. Past it, Kotbo locks joins, forces a captcha or kicks newcomers, alerts staff and lifts raid mode on its own after the time you chose',
            },
            {
              title: '7. Set a honeypot channel',
              body: 'A channel nobody reads, where only spam bots post. The first message in it triggers the sanction you picked. Staff are never caught',
            },
            {
              title: '8. Block fake Nitro and phishing',
              body: 'Kotbo’s anti-scam filter handles fake Nitro links, phishing, lookalike domains and QR codes before your members click',
            },
            {
              title: '9. Turn on logs',
              body: 'Discord’s audit log keeps neither the content of deleted messages nor more than 45 days of history. Kotbo records deleted and edited messages, joins, roles and channels in a log channel and in the dashboard',
            },
            {
              title: '10. Spot alt accounts',
              body: 'A banned member who comes back on another account gets around everything else. Kotbo’s detection compares every newcomer with known members and lets staff decide',
            },
          ],
        },
        {
          h2: 'What to do when it happens anyway',
          body: 'No checklist is perfect. Plan the response before you need it',
          points: [
            'A staff channel where alerts land, read first',
            'A raid mode you know how to lift by hand or let expire',
            'Sanctions recorded with their author and reason, so you don’t retry a case',
            'A ban appeal form for mistakes, instead of private messages',
          ],
        },
        {
          h2: 'Go further',
          body: 'The three modules that carry the most weight in this checklist, in detail',
          items: [
            {
              title: 'AutoMod and anti-raid',
              body: 'Native rules, anti-spam, captcha and a honeypot channel',
              link: { feature: 'automod', label: 'See AutoMod and anti-raid' },
            },
            {
              title: 'Discord logs',
              body: 'Who did what, deleted messages included',
              link: { feature: 'logs', label: 'See the logs' },
            },
            {
              title: 'Alt account detection',
              body: 'Free, staff decides',
              link: { feature: 'double_accounts', label: 'See the alt account checker' },
            },
          ],
        },
      ],
      faq: [
        {
          q: 'How do I secure a Discord server?',
          a: 'Raise the verification level, trim @everyone’s and staff permissions, require 2FA for moderation, then add a bot that handles AutoMod, anti-raid, scams, logs and alt accounts',
        },
        {
          q: 'Is Discord’s verification level enough against raids?',
          a: 'It keeps out brand-new accounts, but not a raid of older or hijacked accounts. An anti-raid with a threshold and an automatic response covers what the native setting doesn’t',
        },
        {
          q: 'What puts a server most at risk?',
          a: 'A hijacked moderator account with high permissions. Keep Administrator for very few people and require 2FA for moderation',
        },
        {
          q: 'Are these protections paid?',
          a: 'No: AutoMod, anti-raid, logs and alt account detection are included in Kotbo’s free plan',
        },
      ],
    },
  },
};
