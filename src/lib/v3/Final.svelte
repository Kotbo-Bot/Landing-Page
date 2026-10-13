<script lang="ts">
  /**
   * Le dernier appel. Un aplat indigo plein cadre, la seule fois où la page
   * quitte la nuit : c'est la décision, elle doit se voir de loin. La phrase
   * reprend la promesse du héros (la pile de bots qui s'en va).
   */
  import { getLocale } from '$lib/i18n/state.svelte';
  import { TRIAL_DAYS } from '$lib/product';
  import AddButton from './AddButton.svelte';

  const TEXT = {
    fr: {
      title: 'Allez. Kick les six autres.',
      sub: `${TRIAL_DAYS} jours offerts, sans carte bancaire. Ton serveur est prêt avant que t’aies fini ton kebab.`,
      demo: 'Ou fouille d’abord la démo du dashboard',
    },
    en: {
      title: 'Go on. Kick the other six.',
      sub: `${TRIAL_DAYS} days free, no credit card. Your server is ready before your food gets cold.`,
      demo: 'Or dig through the dashboard demo first',
    },
  };
  const t = $derived(TEXT[getLocale()]);
</script>

<section aria-labelledby="final-title" class="relative overflow-hidden bg-[#4f46e5]">
  <div aria-hidden="true" class="v3-grid absolute inset-0 opacity-60"></div>
  <div class="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:py-36">
    <h2 id="final-title" class="mx-auto max-w-5xl font-display text-5xl font-black leading-[0.95] tracking-[-0.03em] text-white sm:text-7xl lg:text-8xl">{t.title}</h2>
    <p class="mx-auto mt-6 max-w-xl text-lg text-indigo-100 sm:text-xl">{t.sub}</p>
    <div class="mt-10 flex flex-col items-center gap-5">
      <AddButton content="final" size="lg" tone="white" />
      <a href="/demo/" class="text-base font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">{t.demo}</a>
    </div>
  </div>
</section>
