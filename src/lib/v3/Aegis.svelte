<script lang="ts">
  /**
   * Aegis AI, la branche IA de Kotbo : trois modèles (toxicité, émotions,
   * sujets) servis sur aegisai.kotbo.fr, que la modération du bot appelle.
   *
   * Pas de chiffre ni de démo inventés : le texte ne dit que ce que le bot fait
   * (deux seuils, zone grise tranchée par un modérateur, activation par
   * l'administrateur, voir `privacy/+page.svelte`). Le lien mène à leur site.
   */
  import { getLocale } from '$lib/i18n/state.svelte';
  import ChannelHeader from './ChannelHeader.svelte';

  const AEGIS_URL = 'https://aegisai.kotbo.fr';

  const TEXT = {
    fr: {
      title: 'Une IA de modération, faite chez Kotbo',
      intro:
        'Aegis AI est notre branche IA. Trois modèles lisent les messages de ton serveur et donnent leur avis à la modération : le bot supprime quand c’est net, et ton staff tranche quand c’est flou',
      models: [
        { name: 'Toxicité', text: 'Insultes, harcèlement, menaces : un score par message, avec un seuil de suppression et un seuil « à vérifier » que tu règles' },
        { name: 'Émotions', text: 'Colère, tristesse, peur : de quoi repérer un conflit qui monte ou un membre en détresse, sans jamais le sanctionner' },
        { name: 'Sujets', text: 'De quoi parle ton serveur, salon par salon, pour savoir où va la discussion' },
      ],
      note: 'Activé par l’administrateur, serveur par serveur. Tu choisis si les messages servent à entraîner le modèle',
      cta: 'Découvrir Aegis AI',
      docs: 'Documentation API',
      newTab: '(nouvel onglet)',
    },
    en: {
      title: 'A moderation AI, built in-house at Kotbo',
      intro:
        'Aegis AI is our AI arm. Three models read your server’s messages and advise moderation: the bot deletes when it’s clear-cut, and your staff decides when it’s blurry',
      models: [
        { name: 'Toxicity', text: 'Insults, harassment, threats: one score per message, with a deletion threshold and a “to review” threshold you set' },
        { name: 'Emotions', text: 'Anger, sadness, fear: spot a rising conflict or a member in distress, never to sanction them' },
        { name: 'Topics', text: 'What your server talks about, channel by channel, to see where the conversation is going' },
      ],
      note: 'Turned on by the administrator, server by server. You choose whether messages help train the model',
      cta: 'Discover Aegis AI',
      docs: 'API documentation',
      newTab: '(new tab)',
    },
  };
  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const docsHref = $derived(locale === 'en' ? '/docs/en/aide/aegisai-api/' : '/docs/aide/aegisai-api/');
</script>

<section id="aegis" aria-labelledby="aegis-title" class="bg-night-2 pb-16 sm:pb-24 lg:pb-32">
  <div class="bg-night-2/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="aegis" /></div>
  </div>
  <div class="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:pt-20">
    <div class="max-w-3xl">
      <h2 id="aegis-title" class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-ink sm:text-5xl lg:text-6xl">{t.title}</h2>
      <p class="mt-6 text-lg text-mist text-pretty">{t.intro}</p>
    </div>

    <ul class="mt-12 grid gap-4 md:grid-cols-3">
      {#each t.models as model (model.name)}
        <li class="rounded-2xl border border-line bg-night-3 p-6">
          <h3 class="font-display text-2xl font-black text-ink">{model.name}</h3>
          <p class="mt-3 text-mist text-pretty">{model.text}</p>
        </li>
      {/each}
    </ul>

    <p class="mt-8 max-w-3xl text-fog text-pretty">{t.note}</p>
    <div class="mt-6 flex flex-wrap items-center gap-3">
      <a
        href={AEGIS_URL}
        target="_blank"
        rel="noopener"
        class="inline-flex min-h-11 items-center rounded-xl border border-line-2 px-5 font-bold text-ink transition-colors hover:bg-night-3"
      >{t.cta}<span class="sr-only"> {t.newTab}</span></a>
      <a
        href={docsHref}
        class="inline-flex min-h-11 items-center rounded-xl border border-line px-5 font-semibold text-mist transition-colors hover:bg-night-3 hover:text-ink"
      >{t.docs}</a>
    </div>
  </div>
</section>
