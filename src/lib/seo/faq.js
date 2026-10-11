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
      q: 'Kotbo remplace-t-il vraiment MEE6, Dyno ou Carl-bot ?',
      a: "Sur leur socle commun (modération, niveaux, rôles par réaction, logs), oui - Kotbo couvre ces fonctions nativement. Ce qu'il ajoute par-dessus (tickets, staff, candidatures, planning, économie) est justement ce que ces bots ne font pas, et qui pousse à en installer un deuxième à côté.",
    },
    {
      q: 'Puis-je garder mes autres bots à côté de Kotbo ?',
      a: "Oui, rien n'empêche de faire tourner plusieurs bots en parallèle. Le seul point d'attention : si deux bots répondent au même événement - un message de bienvenue, par exemple - il faut désactiver le doublon pour ne pas se retrouver avec deux messages.",
    },
    {
      q: 'Kotbo peut-il reprendre la configuration de mon ancien bot automatiquement ?',
      a: "En partie. À l'installation, Kotbo détecte les bots connus déjà présents sur le serveur (MEE6, Dyno, Carl-bot, Ticket Tool, YAGPDB, ProBot, Arcane, Tatsu, Amari, Wick, Sapphire...) et propose de reprendre ce qui est visible depuis Discord : rôles de niveau, salon de logs, catégorie de tickets. Rien n'est appliqué sans validation du staff.",
    },
    {
      q: 'Mes membres vont-ils perdre leurs niveaux en changeant de bot ?',
      a: "Non, ils peuvent être repris. L'onglet Import de la page Niveaux accepte un JSON (pseudo, niveau, XP par membre) : récupère le classement de ton ancien bot (export, capture d'écran, copier-coller), fais-le reformater par une IA au format attendu, colle le résultat - l'import se fait en quelques minutes, avec un aperçu avant validation. Kotbo peut en plus caler sa courbe de progression sur celle de MEE6 (formule publique, reproduite à moins de 6 % d'écart) pour que les paliers restent cohérents après la bascule.",
    },
    {
      q: 'Combien coûte Kotbo comparé à MEE6, Dyno ou Ticket Tool ?',
      a: 'Kotbo démarre à 2,50 €/mois, contre environ 12 € pour MEE6, 15 € pour Dyno, ou 5 à 12 € pour Ticket Tool en formule payante. Le calculateur plus haut fait le total avec les bots que tu as vraiment sur ton serveur.',
    },
    {
      q: 'Kotbo est-il un bot français ?',
      a: 'Oui - développé, documenté et supporté en français, dashboard compris.',
    },
    {
      q: "Kotbo gère-t-il l'équipe de modération, pas seulement les membres ?",
      a: "Oui, c'est ce qui le distingue des bots de modération. Le dashboard tient le staff comme une équipe : hiérarchies et grades reliés aux rôles Discord, absences validées par un supérieur, réunions, tâches, sondages internes, évaluations de performance avec la note du manager, et recrutement par formulaire de candidature. Tout est compris dans l'abonnement, sans module en option.",
    },
  ],
  en: [
    {
      q: 'Does Kotbo really replace MEE6, Dyno, or Carl-bot?',
      a: "On their common ground (moderation, levels, reaction roles, logs), yes - Kotbo covers these natively. What it adds on top (tickets, staff, applications, scheduling, economy) is exactly what those bots don't do, which is what pushes people to install a second one alongside them.",
    },
    {
      q: 'Can I keep my other bots alongside Kotbo?',
      a: "Yes, nothing stops you from running several bots in parallel. The one thing to watch: if two bots respond to the same event - a welcome message, for example - you'll need to disable the duplicate so you don't end up with two messages.",
    },
    {
      q: 'Can Kotbo automatically take over my old bot’s configuration?',
      a: "Partly. During setup, Kotbo detects known bots already present on the server (MEE6, Dyno, Carl-bot, Ticket Tool, YAGPDB, ProBot, Arcane, Tatsu, Amari, Wick, Sapphire...) and offers to pick up what's visible from Discord: level roles, log channel, ticket category. Nothing is applied without staff approval.",
    },
    {
      q: 'Will my members lose their levels when switching bots?',
      a: "No, they can be carried over. The Import tab on the Levels page accepts JSON (username, level, XP per member): grab the leaderboard from your old bot (export, screenshot, copy-paste), have an AI reformat it into the expected format, paste the result - the import takes a few minutes, with a preview before you confirm. Kotbo can also match its progression curve to MEE6's (public formula, reproduced within 6% accuracy) so tiers stay consistent after the switch.",
    },
    {
      q: 'How much does Kotbo cost compared to MEE6, Dyno, or Ticket Tool?',
      a: "Kotbo starts at €2.50/month, versus roughly €12 for MEE6, €15 for Dyno, or €5 to €12 for Ticket Tool's paid plan. The calculator above totals it up with the bots you actually run on your server.",
    },
    {
      q: 'Is Kotbo a French bot?',
      a: 'Yes - built, documented, and supported in French, dashboard included.',
    },
    {
      q: 'Does Kotbo manage the moderation team, not just the members?',
      a: "Yes, that's what sets it apart from moderation bots. The dashboard runs your staff as a team: hierarchies and ranks tied to Discord roles, absences approved by a superior, meetings, tasks, internal polls, performance reviews with the manager's note, and recruitment through application forms. All of it comes with the subscription, no add-on modules.",
    },
  ],
};

/** @type {Faq} */
export const STAFF_FAQ = {
  fr: [
    {
      q: "Comment gérer le staff d'un serveur Discord avec Kotbo ?",
      a: "Kotbo range ton équipe dans un dashboard web. Tu crées des hiérarchies (Modération, Animation…) reliées à des rôles Discord, avec leurs grades et leur responsable. Chaque modérateur a sa fiche : grade, activité, période de test, avertissements, notes du manager. Les absences, réunions, tâches et sondages du staff se gèrent au même endroit.",
    },
    {
      q: "Comment gérer les absences des modérateurs sur Discord ?",
      a: "Le modérateur déclare son absence avec ses dates, un type et un motif. Le supérieur désigné la prend en compte, l'approuve ou la refuse, et le calendrier du staff montre qui est disponible sur la période. Fini le salon #absences qu'on remonte pour savoir qui revient quand.",
    },
    {
      q: 'Comment recruter des modérateurs sur un serveur Discord ?',
      a: "Avec un formulaire de candidature créé dans le dashboard : questions libres, choix multiples, connexion Discord obligatoire si tu veux savoir qui postule. Le formulaire est rattaché à une hiérarchie staff : à l'embauche, Kotbo attribue le rôle de cette hiérarchie au nouveau modérateur.",
    },
    {
      q: 'Comment évaluer le travail de son équipe de modération ?',
      a: "Kotbo génère une évaluation de performance pour un modérateur ou pour tout le staff, sur la période de ton choix (de 7 à 365 jours, 30 par défaut). Le manager y ajoute sa note. Les avertissements et les notes internes restent sur la fiche du modérateur, pour que les décisions de promotion ou de rétrogradation s'appuient sur un historique.",
    },
    {
      q: 'Kotbo garde-t-il un casier des membres sanctionnés ?',
      a: "Oui. Chaque sanction garde son motif, son auteur et ses preuves (captures, transcriptions), et l'historique complet des sanctions d'un membre se retrouve sur sa fiche. Les membres bannis peuvent faire appel par le module Appels de bannissement, et l'appel est traité par le staff avec ce dossier sous les yeux.",
    },
    {
      q: 'Kotbo gère-t-il les doubles comptes ?',
      a: "Oui, avec le module Doubles comptes. Le staff relie un compte principal à ses doubles comptes, avec le motif de la liaison, et retrouve à tout moment tous les comptes liés d'un membre. Un membre sanctionné qui revient sous un autre pseudo n'efface plus son passé.",
    },
    {
      q: 'Combien coûte la gestion du staff avec Kotbo ?',
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
      a: "Yes, with the Alt accounts module. Staff link a main account to its alts, with the reason for the link, and can see every account linked to a member at any time. A sanctioned member who comes back under another name no longer starts with a clean slate.",
    },
    {
      q: 'How much does staff management with Kotbo cost?',
      a: "It comes with every paid plan, along with the rest of the catalog: from €5 per month excl. VAT for a server up to 1,000 members, or €30 per year. Every server gets a 15-day trial, once, to set everything up before paying.",
    },
  ],
};
