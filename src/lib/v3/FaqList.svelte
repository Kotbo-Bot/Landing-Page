<script lang="ts">
  /**
   * Une liste de questions dépliables, celle de la FAQ de l'accueil et des
   * articles.
   *
   * `<details>` plutôt qu'un bloc affiché à la demande : les réponses fermées
   * restent dans le HTML prérendu, où les moteurs et les assistants IA les
   * lisent, et le même texte nourrit le JSON-LD `FAQPage` (`seo/faq.js`).
   * Une ouverture est mesurée par rang (`q0`, `staff-q1`…) : c'est ce que le
   * visiteur voulait savoir avant de décider.
   */
  import { track } from '$lib/funnel';

  interface Props {
    items: ReadonlyArray<{ q: string; a: string }>;
    /** Préfixe de la mesure `faq_opened`. */
    trackAs?: string;
    /** Niveau des questions dans le plan de la page. */
    level?: 'h3' | 'p';
  }

  const { items, trackAs = 'q', level = 'p' }: Props = $props();
</script>

<div class="divide-y divide-line border-y border-line">
  {#each items as item, i (item.q)}
    <details
      class="group"
      ontoggle={(e) => (e.currentTarget as HTMLDetailsElement).open && track('faq_opened', { content: `${trackAs}${i}` })}
    >
      <summary class="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold text-ink marker:hidden sm:text-xl [&::-webkit-details-marker]:hidden">
        <svelte:element this={level}>{item.q}</svelte:element>
        <span aria-hidden="true" class="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-2 text-fog transition-transform group-open:rotate-45">+</span>
      </summary>
      <p class="max-w-3xl pb-6 leading-relaxed text-mist">{item.a}</p>
    </details>
  {/each}
</div>
