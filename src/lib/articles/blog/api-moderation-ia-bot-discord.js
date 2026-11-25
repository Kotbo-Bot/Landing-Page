/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'api-moderation-ia-bot-discord', en: 'ai-moderation-api-discord-bot' },
  date: '2026-11-25',
  author: 'Kotbo',
  /** Le module du registre le plus proche (aucun module bot dédié à l'API externe : settings). */
  modules: ['settings'],
  text: {
    fr: {
      title: 'API de modération IA pour bot Discord (toxicité et émotions)',
      h1: 'API de modération IA pour bot Discord : intégrer AegisAI en quelques lignes',
      description:
        'Comment brancher son propre bot Discord sur l’API AegisAI by Kotbo : connexion Discord, clé API par MP, routes /analyze, /emotion et /scan, quotas et organisations.',
      lead: 'Tu développes ton propre bot Discord ou une application communautaire et tu veux noter la toxicité et l’émotion des messages sans entraîner ni héberger un modèle ? L’API publique d’AegisAI by Kotbo répond en HTTP JSON avec une clé gratuite pendant la bêta',
      sections: [
        {
          h2: 'Obtenir une clé API gratuitement en bêta',
          body: 'Toutes les demandes de clés se font depuis l’espace membre sur aegisai.kotbo.fr avec ton compte Discord, sans carte bancaire',
          steps: [
            { title: 'Connecte-toi avec Discord', body: 'Ouvre le portail et coche l’option pour autoriser les MP Discord afin d’être prévenu dès que ta clé est prête' },
            { title: 'Envoie ta demande', body: 'Dans Clés API, renseigne le nom de ton bot, une description rapide et, si tu travailles en équipe, ton organisation' },
            { title: 'Révèle le token sur le site', body: 'Après validation, le bot AegisAI t’envoie un MP avec un lien direct vers ton dashboard : tu copies le token affiché une seule fois dans la variable d’environnement AEGIS_API_TOKEN' },
          ],
        },
        {
          h2: 'Les trois routes d’analyse et le contrôle de santé',
          body: 'Toutes les requêtes d’analyse passent en POST JSON sur https://aegisai.kotbo.fr avec l’en-tête Authorization: Aegis VOTRE_TOKEN et un champ text de 1 à 4 000 caractères',
          items: [
            { title: 'POST /analyze', body: 'Renvoie toxicity entre 0 et 1 ainsi que le booléen is_toxic calculé au seuil 0.85' },
            { title: 'POST /emotion', body: 'Renvoie l’émotion dominante prédite (label) et son score de confiance entre 0 et 1' },
            { title: 'POST /scan', body: 'Exécute toxicité et émotion en parallèle sur le même appel et retourne les deux objets dans une seule réponse JSON' },
            { title: 'GET /health', body: 'Route publique sans authentification pour vérifier que le moteur Rust et les modèles ONNX répondent' },
          ],
        },
        {
          h2: 'Bonnes pratiques en production',
          body: 'Un appel réseau vers une API de modération doit rester rapide et tolérant aux pannes pour ne pas bloquer ton bot',
          points: [
            'Laisse save à false par défaut : n’active save: true sur /analyze ou /scan que si tes utilisateurs acceptent de contribuer au triage pendant 30 jours',
            'Coupe ou filtre les messages vides et au-delà de 4 000 caractères avant l’appel pour éviter les erreurs 400 et 413',
            'Respecte la limite par minute sur fenêtre glissante de 60 secondes (60 requêtes par minute par défaut, sinon erreur HTTP 429)',
            'Prévois un délai court et un repli non bloquant si l’API renvoie 500 ou 503',
          ],
        },
        {
          h2: 'Travailler à plusieurs sur les mêmes clés',
          body: 'Dans ton espace membre AegisAI, tu peux créer une organisation pour regrouper les clés de plusieurs bots, inviter tes co-développeurs en tant que owner, admin ou member, déléguer une clé précise en rôle manager ou viewer, et lancer une rotation instantanée si un token fuit',
        },
      ],
      faq: [
        {
          q: 'Quel format d’en-tête attend l’API AegisAI ?',
          a: 'Utilise Authorization: Aegis VOTRE_TOKEN (et non Bearer) avec Content-Type: application/json',
        },
        {
          q: 'Quelle est la limite de requêtes pendant la bêta ?',
          a: 'Chaque clé dispose par défaut de 60 requêtes par minute sur une fenêtre glissante de 60 secondes, ajustable côté admin entre 1 et 10 000 req/min selon les besoins',
        },
        {
          q: 'Les textes envoyés sont-ils conservés par défaut ?',
          a: 'Non. Sans save: true, les messages sont analysés puis oubliés. Avec save: true sur /analyze ou /scan, ils rejoignent la file de triage au maximum 30 jours',
        },
        {
          q: 'Puis-je utiliser un autre seuil que 0.85 ?',
          a: 'Oui. Le champ is_toxic utilise 0.85 par défaut, mais ta logique peut lire directement la valeur numérique toxicity entre 0 et 1',
        },
        {
          q: 'Que faire si mon token fuite dans un dépôt Git ?',
          a: 'Clique sur Régénérer la clé dans l’onglet Clés API de ton espace membre : l’ancien token est invalidé immédiatement',
        },
      ],
    },
    en: {
      title: 'AI moderation API for a Discord bot (toxicity and emotion)',
      h1: 'AI moderation API for your Discord bot: integrate AegisAI in a few lines',
      description:
        'How to connect your own Discord bot to the AegisAI by Kotbo API: Discord login, DM key delivery, /analyze, /emotion and /scan endpoints, rate limits and organisations.',
      lead: 'Building your own Discord bot or community app and need toxicity and emotion scoring without hosting ML models yourself? The public AegisAI by Kotbo API answers over HTTP JSON with free API keys during the beta',
      sections: [
        {
          h2: 'Get a free beta API key',
          body: 'All key requests happen in the member portal at aegisai.kotbo.fr using your Discord account, with no credit card required',
          steps: [
            { title: 'Sign in with Discord', body: 'Open the portal and tick the Discord DM option so the bot can notify you as soon as your key is approved' },
            { title: 'Submit a request', body: 'In the API keys tab, enter your bot name, a short description and optionally link an organisation' },
            { title: 'Reveal your token once', body: 'Once approved, the AegisAI bot sends a DM with a direct link to your dashboard where you copy the secret into AEGIS_API_TOKEN' },
          ],
        },
        {
          h2: 'The three analysis endpoints and health check',
          body: 'Send POST JSON requests to https://aegisai.kotbo.fr with Authorization: Aegis YOUR_TOKEN and a non-empty text field up to 4,000 characters',
          items: [
            { title: 'POST /analyze', body: 'Returns toxicity between 0 and 1 plus the boolean is_toxic flag based on a 0.85 threshold' },
            { title: 'POST /emotion', body: 'Returns the predicted dominant emotion label and its confidence score between 0 and 1' },
            { title: 'POST /scan', body: 'Runs toxicity and emotion inference in parallel and returns both results in a single JSON payload' },
            { title: 'GET /health', body: 'Unauthenticated status endpoint confirming that the Rust server and ONNX models are ready' },
          ],
        },
        {
          h2: 'Production best practices',
          body: 'A moderation call sits in the message path of your bot, so keep error handling predictable',
          points: [
            'Keep save set to false by default: only send save: true on /analyze or /scan if your users consented to 30-day triage retention',
            'Skip empty strings and trim or check messages above 4,000 characters to avoid 400 and 413 responses',
            'Stay within your key’s 60-second sliding-window quota (60 requests per minute by default, otherwise HTTP 429)',
            'Use a short HTTP timeout and fail open if the API returns 500 or 503',
          ],
        },
        {
          h2: 'Collaborate with organisations and key managers',
          body: 'In your AegisAI dashboard, create an organisation to group your bots, invite teammates by Discord ID as owner, admin or member, grant per-key manager or viewer access, and rotate leaked tokens in one click',
        },
      ],
      faq: [
        {
          q: 'Which Authorization header format does AegisAI expect?',
          a: 'Use Authorization: Aegis YOUR_TOKEN (not Bearer) alongside Content-Type: application/json',
        },
        {
          q: 'What is the default rate limit during the beta?',
          a: 'Each key defaults to 60 requests per minute over a 60-second sliding window, adjustable by admins between 1 and 10,000 req/min',
        },
        {
          q: 'Are analyzed messages stored by default?',
          a: 'No. Without save: true, messages are scored and discarded. When save: true is sent on /analyze or /scan, retention is capped at 30 days',
        },
        {
          q: 'Can I apply a custom threshold instead of 0.85?',
          a: 'Yes. Ignore is_toxic and compare the raw toxicity float directly against your own threshold',
        },
        {
          q: 'What should I do if my token leaks in a repository?',
          a: 'Use Rotate key from your dashboard’s API keys tab to immediately invalidate the exposed token and reveal a new one',
        },
      ],
    },
  },
};
