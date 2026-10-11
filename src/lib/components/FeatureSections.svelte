<script lang="ts">
  /**
   * Le corps d'une page fonctionnalité, comme un cahier : chaque section
   * numérotée dans la marge, son titre, son texte, et sa liste cochée au
   * marqueur. Le numéro sert aussi d'ancre au sommaire de la fiche.
   */
  import type { FeatureSection } from '$lib/data/features';
  import HandCheck from '$lib/components/ui/HandCheck.svelte';

  const { sections, numbered = true }: { sections: FeatureSection[]; numbered?: boolean } = $props();
</script>

<div class="space-y-14">
  {#each sections as section, i (section.h2)}
    <section id="section-{i + 1}" class="scroll-mt-28 {numbered ? 'sm:grid sm:grid-cols-[4.5rem_1fr] sm:gap-6' : ''}">
      {#if numbered}
        <p aria-hidden="true" class="font-headline text-4xl font-extrabold leading-none text-indigo-600/25 sm:text-right sm:text-5xl">
          {String(i + 1).padStart(2, '0')}
        </p>
      {/if}
      <div>
        <h2 class="mt-2 font-headline text-2xl font-extrabold tracking-tight text-gray-900 sm:mt-0 sm:text-[1.9rem] sm:leading-tight">{section.h2}</h2>
        <p class="mt-3 max-w-2xl text-base leading-relaxed text-gray-700 sm:text-lg">{section.body}</p>
        {#if section.points}
          <ul class="mt-5 max-w-2xl space-y-3">
            {#each section.points as point (point)}
              <li class="flex gap-3 leading-relaxed text-gray-800">
                <HandCheck class="mt-0.5 h-6 w-6 shrink-0" />
                <span>{point}</span>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </section>
  {/each}
</div>
