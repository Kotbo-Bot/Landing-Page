/**
 * Les FAQ du site, en JavaScript simple plutôt que dans le `TEXT` de leur
 * composant : le même texte sert deux fois, affiché dans la page et repris
 * dans le JSON-LD `FAQPage` (`jsonld.js`). `svelte.config.js` lit ce fichier
 * au build pour autoriser le JSON-LD dans la CSP : il doit rester importable
 * par Node, sans TypeScript ni alias `$lib`.
 *
 * Chaque réponse reste alignée sur ce que le produit fait réellement (le
 * registre des modules, les outils MCP du bot). Une réponse qui promet plus
 * que le produit se paye à la première question posée au support.
 *
 * Les questions de l'accueil sont mesurées par leur rang (`faq_opened`,
 * `q0`, `q1`…) : ajouter à la fin, ne pas réordonner.
 */

/** @typedef {{ q: string, a: string }} FaqItem */
/** @typedef {{ fr: FaqItem[], en: FaqItem[] }} Faq */

/** @type {Faq} */
export const HOME_FAQ = {
  fr: [
    {
      q: 'Kotbo remplace vraiment MEE6, Dyno ou Carl-bot ?',
      a: "Sur ce qu'ils font tous (modération, niveaux, rôles par réaction, logs), oui, Kotbo le fait nativement. Et il ajoute ce qu'ils ne font pas : tickets, gestion du staff, candidatures, planning, économie. C'est justement ce qui t'obligeait à installer un deuxième, puis un troisième bot.",
    },
    {
      q: 'Je peux garder mes autres bots à côté ?',
      a: "Oui. Le seul truc à surveiller : si deux bots réagissent au même événement (un message de bienvenue par exemple), coupe le doublon, sinon tes membres reçoivent deux messages.",
    },
    {
      q: 'Kotbo peut reprendre la config de mon ancien bot ?',
      a: "En partie. À l'installation, Kotbo repère les bots connus déjà présents (MEE6, Dyno, Carl-bot, Ticket Tool, YAGPDB, ProBot, Arcane, Tatsu, Amari, Wick, Sapphire…) et propose de reprendre ce qui se voit depuis Discord : rôles de niveau, salon de logs, catégorie de tickets. Rien n'est appliqué sans la validation du staff.",
    },
    {
      q: 'Mes membres perdent leurs niveaux si je change de bot ?',
      a: "Non. L'onglet Import de la page Niveaux accepte un JSON (pseudo, niveau, XP par membre). Récupère le classement de ton ancien bot (export, capture, copier-coller), fais-le remettre au bon format par une IA, colle, vérifie l'aperçu, c'est réglé en quelques minutes. Kotbo peut aussi caler sa courbe d'XP sur celle de MEE6 (formule publique, reproduite à moins de 6 % près) pour que les paliers restent les mêmes.",
    },
    {
      q: 'Ça coûte combien, comparé à MEE6, Dyno ou Ticket Tool ?',
      a: "Kotbo démarre à 2,50 €/mois (offre Starter payée à l'année), tout compris. En face, compte environ 12 € pour MEE6, 5 € pour Dyno, 5 à 7 € pour Ticket Tool en premium. Le ticket de caisse plus haut fait l'addition avec ce que t'as vraiment.",
    },
    {
      q: 'Kotbo est un bot français ?',
      a: 'Oui. Développé, documenté et supporté en français, dashboard compris.',
    },
    {
      q: 'Kotbo gère aussi le staff, pas seulement les membres ?',
      a: "Oui, c'est son truc. Le dashboard gère ton staff comme une vraie équipe : hiérarchie et grades reliés aux rôles Discord, absences validées par un supérieur, réunions, tâches, sondages internes, évaluations avec la note du manager, recrutement par formulaire. Tout est dans l'abonnement, aucun module en option.",
    },
    {
      q: 'Kotbo demande les droits administrateur ?',
      a: "Non. L'invitation liste chaque permission une par une (gérer les salons et les rôles, modérer, lire le journal d'audit, envoyer des messages…), et chacune sert un module. Tu vois tout sur l'écran de Discord avant de valider.",
    },
    {
      q: "C'est gratuit ?",
      a: "Les 15 premiers jours, oui, une fois par serveur et sans carte bancaire. Tu configures tout pendant l'essai, puis tu choisis ton offre : le prix dépend seulement du nombre de membres, de 2,50 €/mois à l'année pour moins de 1 000 membres.",
    },
  ],
  en: [
    {
      q: 'Does Kotbo really replace MEE6, Dyno, or Carl-bot?',
      a: "On what they all do (moderation, levels, reaction roles, logs), yes, Kotbo does it natively. And it adds what they don't: tickets, staff management, applications, scheduling, economy. That's exactly what made you install a second bot, then a third.",
    },
    {
      q: 'Can I keep my other bots alongside it?',
      a: "Yes. The one thing to watch: if two bots react to the same event (a welcome message, for example), turn off the duplicate or your members get two messages.",
    },
    {
      q: 'Can Kotbo pick up my old bot’s config?',
      a: "Partly. During setup, Kotbo spots known bots already on the server (MEE6, Dyno, Carl-bot, Ticket Tool, YAGPDB, ProBot, Arcane, Tatsu, Amari, Wick, Sapphire…) and offers to pick up what's visible from Discord: level roles, log channel, ticket category. Nothing is applied until your staff confirms.",
    },
    {
      q: 'Do my members lose their levels if I switch bots?',
      a: "No. The Import tab on the Levels page takes JSON (username, level, XP per member). Grab your old bot's leaderboard (export, screenshot, copy-paste), have an AI put it in the right format, paste, check the preview, done in a few minutes. Kotbo can also match its XP curve to MEE6's (public formula, reproduced within 6%) so tiers stay the same.",
    },
    {
      q: 'How much is it compared to MEE6, Dyno, or Ticket Tool?',
      a: "Kotbo starts at €2.50/month (Starter, billed yearly), everything included. On the other side, count roughly €12 for MEE6, €5 for Dyno, €5 to €7 for Ticket Tool premium. The receipt above adds up what you actually run.",
    },
    {
      q: 'Is Kotbo a French bot?',
      a: 'Yes. Built, documented and supported in French, with an English dashboard too.',
    },
    {
      q: 'Does Kotbo manage the staff too, not just members?',
      a: "Yes, that's its thing. The dashboard runs your staff like a real team: hierarchy and ranks tied to Discord roles, time off approved by a superior, meetings, tasks, internal polls, reviews with the manager's rating, recruitment through application forms. All in the subscription, no add-on modules.",
    },
    {
      q: 'Does Kotbo ask for Administrator permission?',
      a: "No. The invite lists every permission one by one (manage channels and roles, moderate, read the audit log, send messages…), and each one powers a module. You see it all on Discord's screen before you confirm.",
    },
    {
      q: 'Is it free?',
      a: "For the first 15 days, yes, once per server and with no credit card. Set everything up during the trial, then pick your plan: the price only depends on member count, from €2.50/month billed yearly under 1,000 members.",
    },
  ],
};

/** @type {Faq} */
export const STAFF_FAQ = {
  fr: [
    {
      q: "Comment gérer le staff d'un serveur Discord avec Kotbo ?",
      a: "Kotbo range ton équipe dans un dashboard web. Tu crées des hiérarchies (Modération, Animation…) reliées à des rôles Discord, avec leurs grades et leur responsable. Chaque modérateur a sa fiche : grade, activité, période de test, avertissements, notes du manager. Les absences, réunions, tâches et sondages du staff se gèrent au même endroit.",
    },
    {
      q: "Comment gérer les absences des modérateurs sur Discord ?",
      a: "Le modérateur déclare son absence avec ses dates, un type et un motif. Le supérieur désigné la prend en compte, l'approuve ou la refuse, et le calendrier du staff montre qui est disponible sur la période. Fini le salon #absences qu'on remonte pour savoir qui revient quand.",
    },
    {
      q: 'Comment recruter des modérateurs sur un serveur Discord ?',
      a: "Avec un formulaire de candidature créé dans le dashboard : questions libres, choix multiples, connexion Discord obligatoire si tu veux savoir qui postule. Le formulaire est rattaché à une hiérarchie staff : à l'embauche, Kotbo attribue le rôle de cette hiérarchie au nouveau modérateur.",
    },
    {
      q: 'Comment évaluer le travail de son équipe de modération ?',
      a: "Kotbo génère une évaluation de performance pour un modérateur ou pour tout le staff, sur la période de ton choix (de 7 à 365 jours, 30 par défaut). Le manager y ajoute sa note. Les avertissements et les notes internes restent sur la fiche du modérateur, pour que les décisions de promotion ou de rétrogradation s'appuient sur un historique.",
    },
    {
      q: 'Kotbo garde-t-il un casier des membres sanctionnés ?',
      a: "Oui. Chaque sanction garde son motif, son auteur et ses preuves (captures, transcriptions), et l'historique complet des sanctions d'un membre se retrouve sur sa fiche. Les membres bannis peuvent faire appel par le module Appels de bannissement, et l'appel est traité par le staff avec ce dossier sous les yeux.",
    },
    {
      q: 'Kotbo gère-t-il les doubles comptes ?',
      a: "Oui. Kotbo compare chaque nouvel arrivant aux membres déjà présents (profil, invitations, style d'écriture, horaires, vocal, et appareil avec la vérification par lien) et signale les ressemblances au staff. Le staff tranche : il lie les comptes ou écarte l'alerte, et les comptes liés se consultent ensemble. Un membre sanctionné qui revient sous un autre pseudo n'efface plus son passé.",
    },
    {
      q: 'Combien coûte la gestion du staff avec Kotbo ?',
      a: "Elle est comprise dans toutes les offres payantes, avec le reste du catalogue : à partir de 5 € HT par mois pour un serveur jusqu'à 1 000 membres, ou 30 € HT par an. Chaque serveur a 15 jours d'essai, une fois, pour tout configurer avant de payer.",
    },
  ],
  en: [
    {
      q: "How do I manage a Discord server's staff with Kotbo?",
      a: 'Kotbo puts your team in a web dashboard. You create hierarchies (Moderation, Events…) tied to Discord roles, with their ranks and their lead. Each moderator has a profile: rank, activity, trial period, warnings, manager notes. Staff absences, meetings, tasks and polls are handled in the same place.',
    },
    {
      q: "How do I handle moderators' absences on Discord?",
      a: "The moderator reports their absence with dates, a type and a reason. The assigned superior acknowledges, approves or rejects it, and the staff calendar shows who is available over the period. No more scrolling up an #absences channel to find out who's back when.",
    },
    {
      q: 'How do I recruit moderators for a Discord server?',
      a: "With an application form built in the dashboard: open questions, multiple choice, and mandatory Discord login if you want to know who's applying. The form is attached to a staff hierarchy: on hiring, Kotbo gives the new moderator that hierarchy's role.",
    },
    {
      q: "How do I review my moderation team's work?",
      a: "Kotbo generates a performance review for one moderator or the whole staff, over the period you pick (7 to 365 days, 30 by default). The manager adds their note. Warnings and internal notes stay on the moderator's profile, so promotion or demotion decisions rest on a record.",
    },
    {
      q: 'Does Kotbo keep a record of sanctioned members?',
      a: "Yes. Every sanction keeps its reason, its author and its evidence (screenshots, transcripts), and a member's full sanction history sits on their profile. Banned members can appeal through the Ban appeals module, and staff handle the appeal with that file in front of them.",
    },
    {
      q: 'Does Kotbo handle alt accounts?',
      a: "Yes. Kotbo compares every newcomer with the members already there (profile, invites, writing style, activity hours, voice, and device with link verification) and flags resemblances to staff. Staff decide: they link the accounts or dismiss the alert, and linked accounts are reviewed together. A sanctioned member who comes back under another name no longer starts with a clean slate.",
    },
    {
      q: 'How much does staff management with Kotbo cost?',
      a: "It comes with every paid plan, along with the rest of the catalog: from €5 per month excl. VAT for a server up to 1,000 members, or €30 per year. Every server gets a 15-day trial, once, to set everything up before paying.",
    },
  ],
};
