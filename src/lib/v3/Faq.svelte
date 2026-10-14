<script lang="ts">
  /**
   * La FAQ de l'accueil. Le texte vit dans `seo/faq.js` parce qu'il nourrit
   * aussi le JSON-LD `FAQPage`. Les ouvertures sont mesurées par rang
   * (`q0`, `q1`…) : ajouter à la fin, ne pas réordonner.
   */
  import { getLocale } from '$lib/i18n/state.svelte';
  import { HOME_FAQ } from '$lib/seo/faq.js';
  import ChannelHeader from './ChannelHeader.svelte';
  import FaqList from './FaqList.svelte';

  const TEXT = {
    fr: { title: 'T’as encore un doute ? Normal, on te répond' },
    en: { title: 'Still got a doubt? Fair, here are the answers' },
  };
  const t = $derived(TEXT[getLocale()]);
  const items = $derived(HOME_FAQ[getLocale()]);
</script>

<section id="faq" aria-labelledby="faq-title" class="bg-night-2 pb-16 sm:pb-24 lg:pb-32">
  <div class="bg-night-2/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="faq" /></div>
  </div>
  <div class="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:pt-20">
    <div class="max-w-3xl">
    <div>
      <h2 id="faq-title" class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-ink sm:text-5xl">{t.title}</h2>
    </div>
    <div class="mt-10"><FaqList {items} /></div>
    </div>
  </div>
</section>
