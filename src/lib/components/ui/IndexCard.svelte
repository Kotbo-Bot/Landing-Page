<script lang="ts">
  /**
   * Une fiche bristol, scotchée sur le tableau : réglure bleue, marge rouge.
   * Le cousin du post-it pour ce qui se lit (un sommaire, une fiche de
   * fonctionnalité) : le post-it commente, la fiche informe.
   *
   * Comme le post-it, elle a une ombre courte et peut pencher un peu ; en
   * mouvement réduit, elle reste penchée mais ne bouge pas au survol.
   */
  import type { Snippet } from 'svelte';

  interface Props {
    rotation?: number;
    tape?: boolean;
    class?: string;
    children: Snippet;
  }

  const { rotation = 0, tape = true, class: className = '', children }: Props = $props();
</script>

<div
  class="index-card relative bg-white shadow-[var(--shadow-postit)] {tape ? 'postit-tape' : ''} {className}"
  style="--tilt: {rotation}deg"
>
  <span aria-hidden="true" class="pointer-events-none absolute inset-y-0 left-7 w-px bg-[#f4a3a3]"></span>
  <div class="relative py-5 pl-11 pr-5">
    {@render children()}
  </div>
</div>

<style>
  .index-card {
    transform: rotate(var(--tilt));
    /* La réglure suit le corps du texte : une ligne tous les 1,75rem. */
    background-image: repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent calc(1.75rem - 1px),
      #dde6f3 calc(1.75rem - 1px),
      #dde6f3 1.75rem
    );
    background-position: 0 1.25rem;
  }
</style>
