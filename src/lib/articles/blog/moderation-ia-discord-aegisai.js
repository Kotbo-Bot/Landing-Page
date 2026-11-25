/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'moderation-ia-discord-aegisai', en: 'ai-moderation-discord-aegisai' },
  date: '2026-11-25',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['automod'],
  text: {
    fr: {
      title: 'Modération IA Discord : filtrer toxicité et émotions avec AegisAI',
      h1: 'Modération IA sur Discord : repérer insultes détournées, conflits et harcèlement avec AegisAI',
      description:
        'Comment configurer la modération IA AegisAI sur Discord avec Kotbo : deux seuils de toxicité, file À vérifier, escalade, harcèlement ciblé et alertes de détresse.',
      lead: 'Une liste de mots bannis bloque les insultes simples, mais elle rate les fautes volontaires et les phrases polies qui restent agressives. Dans Kotbo, le module AegisAI note chaque message de 0 à 100 sur la toxicité et lit l’émotion pour trancher les cas nets et soumettre les cas douteux à ton staff',
      sections: [
        {
          h2: 'Ce qu’une liste de mots bannis ne voit pas',
          body: 'Remplacer une lettre par un chiffre ou tourner une pique sans gros mot suffit souvent à passer entre les mailles d’un filtre classique. À l’inverse, un mot vulgaire lâché dans une blague entre amis se fait bloquer à tort',
          points: [
            'AegisAI analyse le sens complet du message au lieu de chercher un mot isolé',
            'L’analyse d’émotion indique si le ton tire vers la colère, la tristesse, la peur ou la joie',
            'Ton équipe garde la main sur toute la zone grise entre deux seuils réglables',
          ],
        },
        {
          h2: 'Régler les deux seuils sur Kotbo',
          body: 'Sur dash.kotbo.fr, ouvre Protection puis AegisAI. Le principe repose sur deux limites chiffrées de 0 à 100',
          steps: [
            { title: 'Allume l’analyse et choisis la vie privée', body: 'Active Analyse des messages puis indique si les textes anonymisés (sans mentions, liens ni emojis) peuvent servir à améliorer AegisAI' },
            { title: 'Pars d’un préréglage', body: 'Tolérant (revue à 88, action à 97), Équilibré (80 / 95) ou Strict (70 / 90). Chaque valeur reste modifiable à la main' },
            { title: 'Choisis l’action automatique', body: 'Au-dessus du second seuil, Kotbo peut retirer le message, avertir avec un poids choisi ou exclure temporairement en joignant une transcription du salon' },
            { title: 'Définis le salon des cartes et les exemptions', body: 'Les messages placés entre les deux seuils arrivent dans À vérifier sur le dashboard et en cartes dans Discord pour que le staff confirme ou marque Faux positif' },
          ],
        },
        {
          h2: 'Escalade, harcèlement ciblé et détresse',
          body: 'L’onglet Modules d’AegisAI exploite les scores et les émotions sur plusieurs messages consécutifs',
          items: [
            { title: 'Escalade', body: 'Si le ton monte dans un salon sur une courte fenêtre, Kotbo pose un mode lent temporaire et prévient l’équipe' },
            { title: 'Harcèlement ciblé', body: 'Plusieurs messages toxiques envoyés en réponse ou mention vers la même personne déclenchent un signalement staff, ou une exclusion temporaire' },
            { title: 'Détresse', body: 'Une forte tristesse ou peur remonte discrètement dans un salon restreint pour prendre des nouvelles du membre, sans jamais appliquer de sanction' },
            { title: 'Humeur des tickets', body: 'Les tickets marqués par la colère ou la détresse peuvent passer automatiquement en priorité haute pour ton équipe support' },
          ],
        },
        {
          h2: 'Vie privée et repli si l’API ne répond pas',
          body: 'Kotbo retire toujours les mentions, les liens, les emojis, les pièces jointes et l’identité des membres avant d’envoyer le texte à AegisAI. Si le service répond avec du retard, le message part en revue manuelle plutôt que d’être supprimé à l’aveugle, et s’il est indisponible, Kotbo se rabat sur ta liste de mots bannis',
        },
      ],
      faq: [
        {
          q: 'L’IA AegisAI est-elle incluse dans l’offre gratuite de Kotbo ?',
          a: 'Non. L’AutoMod classique est gratuit sans limite de durée, tandis que le module AegisAI fait partie de l’offre Plus à 5 € HT par mois',
        },
        {
          q: 'AegisAI peut-il sanctionner un message par erreur ?',
          a: 'Chaque message au-dessus du seuil automatique reste consultable dans À vérifier, avec un bouton Faux positif qui annule l’action du bot et une transcription en preuve',
        },
        {
          q: 'Les pseudos et messages modifiés sont-ils aussi analysés ?',
          a: 'Oui, si tu actives les options Messages modifiés et Pseudos dans les réglages d’AegisAI : un insulteur qui édite son message après coup est rattrapé',
        },
        {
          q: 'Est-ce que le module Détresse sanctionne le membre ?',
          a: 'Jamais. Le module Détresse envoie uniquement une alerte discrète au staff pour prendre des nouvelles',
        },
        {
          q: 'Puis-je utiliser AegisAI en dehors de Kotbo ?',
          a: 'Oui. L’API publique sur aegisai.kotbo.fr est ouverte aux bots et applications externes en bêta gratuite',
        },
      ],
    },
    en: {
      title: 'Discord AI moderation: detect toxicity and emotion with AegisAI',
      h1: 'AI moderation on Discord: catch disguised insults, conflicts and harassment with AegisAI',
      description:
        'How to set up AegisAI moderation on Discord with Kotbo: dual toxicity thresholds, human review queue, escalation, targeted harassment and distress alerts.',
      lead: 'A banned-word list catches obvious slurs, yet misses deliberate typos and polite attacks. In Kotbo, the AegisAI module scores every message from 0 to 100 for toxicity and detects emotion so the bot handles clear violations and sends borderline cases to your staff',
      sections: [
        {
          h2: 'What a word filter misses',
          body: 'Swapping one letter for a digit or phrasing an attack politely is enough to bypass a static list. At the same time, mild swearing between friends often triggers false bans',
          points: [
            'AegisAI scores the meaning of the full message rather than a single isolated token',
            'Emotion classification detects anger, sadness, fear or joy alongside toxicity',
            'Your staff stays in control of everything sitting between two adjustable thresholds',
          ],
        },
        {
          h2: 'Set your two thresholds in Kotbo',
          body: 'On dash.kotbo.fr, open Protection then AegisAI. Filtering relies on two numbers between 0 and 100',
          steps: [
            { title: 'Switch on analysis and pick privacy', body: 'Enable Message analysis and choose whether stripped text (no mentions, links or emojis) may help train AegisAI' },
            { title: 'Start from a preset', body: 'Lenient (review at 88, auto action at 97), Balanced (80 / 95) or Strict (70 / 90). Both numbers remain editable by hand' },
            { title: 'Pick the automatic action', body: 'Above the top threshold, Kotbo can delete the message, warn with a chosen weight or issue a timeout while attaching a channel transcript' },
            { title: 'Choose a card channel and exemptions', body: 'Borderline messages land under To review in the dashboard and as Discord action cards so moderators confirm or mark False positive' },
          ],
        },
        {
          h2: 'Escalation, targeted harassment and distress',
          body: 'The Modules tab builds three higher-level detections on top of per-message scores',
          items: [
            { title: 'Escalation', body: 'When heated messages stack up in a channel within a short window, Kotbo applies temporary slowmode and notifies staff' },
            { title: 'Targeted harassment', body: 'Repeated toxic replies or mentions aimed at the same member alert staff, or issue a timeout plus an alert' },
            { title: 'Distress', body: 'Strong sadness or fear quietly notifies staff in a restricted channel so someone can check in, with never any sanction' },
            { title: 'Ticket mood', body: 'Support tickets marked by anger or distress can automatically rise to high priority' },
          ],
        },
        {
          h2: 'Privacy and automatic fallback',
          body: 'Kotbo strips mentions, links, emojis, attachments and member identities before sending text to AegisAI. Late responses go to staff review instead of blind deletion, and if AegisAI is unreachable, Kotbo falls back on your server’s banned-word list',
        },
      ],
      faq: [
        {
          q: 'Is AegisAI included in Kotbo’s free plan?',
          a: 'No. Standard AutoMod is free forever, while AegisAI is part of the Plus plan at €5/month excl. VAT',
        },
        {
          q: 'What happens if AegisAI makes a mistake?',
          a: 'Every automatic action stays listed in To review with a False positive button that undoes the action and shows the channel transcript',
        },
        {
          q: 'Does it also check edited messages and nicknames?',
          a: 'Yes, when you enable Edited messages and Nicknames in AegisAI settings so edits made afterwards do not slip through',
        },
        {
          q: 'Can the Distress module punish a member?',
          a: 'Never. Distress alerts only ping staff privately so someone can reach out',
        },
        {
          q: 'Can I call AegisAI from my own bot instead of Kotbo?',
          a: 'Yes. The public API at aegisai.kotbo.fr is open to external Discord bots and apps in Free Beta',
        },
      ],
    },
  },
};
