<script lang="ts">
  /**
   * Une liste de questions dépliables.
   *
   * `<details>` plutôt qu'un bloc affiché à la demande : les réponses fermées
   * restent dans le HTML prérendu, où les moteurs et les assistants IA les
   * lisent, et le même texte nourrit le JSON-LD `FAQPage` (`seo/faq.js`).
   */
  import { ChevronDown } from '@lucide/svelte';
  import { track } from '$lib/funnel';

  interface Props {
    items: ReadonlyArray<{ q: string; a: string }>;
    /** Préfixe de la mesure `faq_opened` (`q0`, `staff-q0`…). */
    trackAs?: string;
  }

  const { items, trackAs = 'q' }: Props = $props();

  /**
   * Une question ouverte volontairement est un signal d'hésitation : c'est ce
   * que le visiteur voulait savoir avant de décider. Seule l'ouverture compte,
   * pas la fermeture, et la première question est déjà dépliée. Mesuré au
   * clic plutôt qu'à l'événement `toggle`, que le navigateur émet aussi pour
   * la question ouverte d'office.
   */
  function onSummaryClick(event: MouseEvent, i: number) {
    const details = (event.currentTarget as HTMLElement).parentElement as HTMLDetailsElement;
    if (!details.open) track('faq_opened', { content: `${trackAs}${i}` });
  }
</script>

<div class="flex flex-col gap-3">
  {#each items as item, i (item.q)}
    <details open={i === 0} class="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
      <summary
        onclick={(e) => onSummaryClick(e, i)}
        class="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50/80 sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden"
      >
        <h3 class="text-base font-black text-gray-900 sm:text-lg">{item.q}</h3>
        <ChevronDown class="w-5 shrink-0 text-gray-400 transition-transform duration-300 group-open:rotate-180" strokeWidth={3} />
      </summary>
      <p class="px-5 pb-5 font-medium leading-relaxed text-gray-600 sm:px-6 sm:pb-6">{item.a}</p>
    </details>
  {/each}
</div>
