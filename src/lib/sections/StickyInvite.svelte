<script lang="ts">
  /**
   * La barre d'invitation collée en bas, sur téléphone seulement.
   *
   * Elle n'apparaît qu'à deux conditions : le visiteur a monté quelque chose
   * dans le héros, et le héros n'est plus à l'écran. Avant, elle serait une
   * bannière de plus ; après, elle garde sous le pouce ce qu'il vient de
   * construire pendant qu'il lit la suite.
   */
  import { onMount } from 'svelte';
  import { builder } from '$lib/playground/kit.svelte';
  import InviteButton from '$lib/playground/InviteButton.svelte';

  let heroVisible = $state(true);

  onMount(() => {
    const hero = document.getElementById('monter');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => (heroVisible = entry?.isIntersecting ?? true), {
      threshold: 0.05,
    });
    observer.observe(hero);
    return () => observer.disconnect();
  });

  const show = $derived(builder.kit.touched && !heroVisible);
</script>

{#if show}
  <div class="sticky-invite fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-[#f8f9fa] px-4 py-3 sm:hidden">
    <InviteButton content="sticky" class="w-full" />
  </div>
{/if}
