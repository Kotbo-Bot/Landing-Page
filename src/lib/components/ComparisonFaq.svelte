<script lang="ts">
  /**
   * FAQ du comparatif.
   *
   * Les questions qui reviennent après le tableau, le calculateur et le
   * face-à-face - « d'accord, mais concrètement... ». Chaque réponse reste
   * alignée sur ce que `botMigrationService.ts` et `botRegistry.ts` font
   * réellement : la reprise de config est réelle mais partielle, les niveaux
   * des membres ne se transfèrent pas automatiquement, et DraftBot n'est pas
   * dans le registre de détection. Une FAQ qui promet plus que le produit ne
   * tient pas se paye à la première question posée en support.
   */
  import { reveal } from '$lib/actions/reveal';
  import FaqList from '$lib/components/FaqList.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { HOME_FAQ } from '$lib/seo/faq.js';

  // Les questions vivent dans `seo/faq.js` : le même texte nourrit le JSON-LD
  // `FAQPage` de l'accueil.
  const TEXT = {
    fr: {
      eyebrow: 'Questions fréquentes',
      title: 'Les questions qui reviennent.',
      items: HOME_FAQ.fr,
    },
    en: {
      eyebrow: 'Frequently asked questions',
      title: 'The questions that keep coming up.',
      items: HOME_FAQ.en,
    },
  };

  const t = $derived(TEXT[getLocale()]);

</script>

<section class="py-16 lg:py-24 bg-white">
  <div class="max-w-3xl mx-auto px-8">

    <div use:reveal={{ direction: 'up' }} class="text-center mb-10">
      <p class="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 mb-5">{t.eyebrow}</p>
      <h2 class="text-2xl md:text-4xl font-black tracking-tight text-gray-900 font-headline leading-[1.1]">
        {t.title}
      </h2>
    </div>

    <div use:reveal={{ direction: 'up', delay: 60 }}>
      <FaqList items={t.items} />
    </div>
  </div>
</section>
