<script lang="ts">
  /**
   * La FAQ de l'accueil. Le texte vit dans `seo/faq.js` parce qu'il nourrit
   * aussi le JSON-LD `FAQPage`. Les ouvertures sont mesurées par rang
   * (`q0`, `q1`…) : ajouter à la fin, ne pas réordonner.
   */
  import { getLocale } from '$lib/i18n/state.svelte';
  import { HOME_FAQ } from '$lib/seo/faq.js';
  import { track } from '$lib/funnel';
  import ChannelHeader from './ChannelHeader.svelte';

  const TEXT = {
    fr: { title: 'Les questions qu’on nous pose tout le temps.' },
    en: { title: 'The questions we get all the time.' },
  };
  const t = $derived(TEXT[getLocale()]);
  const items = $derived(HOME_FAQ[getLocale()]);
</script>

<section id="faq" aria-labelledby="faq-title" class="border-t border-line bg-night-2 pb-16 sm:pb-24 lg:pb-32">
  <div class="sticky top-16 z-20 bg-night-2/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="faq" /></div>
  </div>
  <div class="mx-auto max-w-3xl px-4 pt-14 sm:px-6 lg:pt-20">
    <div>
      <h2 id="faq-title" class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-white sm:text-5xl">{t.title}</h2>
    </div>
    <div class="mt-10 divide-y divide-line border-y border-line">
      {#each items as item, i (item.q)}
        <details
          class="group"
          ontoggle={(e) => (e.currentTarget as HTMLDetailsElement).open && track('faq_opened', { content: `q${i}` })}
        >
          <summary class="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-bold text-white marker:hidden sm:text-xl [&::-webkit-details-marker]:hidden">
            {item.q}
            <span aria-hidden="true" class="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-2 text-fog transition-transform group-open:rotate-45">+</span>
          </summary>
          <p class="max-w-3xl pb-6 leading-relaxed text-mist">{item.a}</p>
        </details>
      {/each}
    </div>
  </div>
</section>
