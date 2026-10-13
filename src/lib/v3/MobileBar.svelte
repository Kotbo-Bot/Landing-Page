<script lang="ts">
  /**
   * Sur téléphone, le bouton d'invitation reste à portée de pouce une fois le
   * héros passé. Il se cache sur le dernier appel, qui a déjà le sien.
   */
  import { onMount } from 'svelte';
  import AddButton from './AddButton.svelte';

  let show = $state(false);

  onMount(() => {
    const final = document.getElementById('final-title');
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.9;
      const atEnd = final ? final.getBoundingClientRect().top < window.innerHeight : false;
      show = past && !atEnd;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<div
  class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-night/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 sm:hidden {show
    ? 'translate-y-0'
    : 'translate-y-full'}"
  aria-hidden={!show}
  inert={!show}
>
  <AddButton content="sticky-mobile" class="w-full" />
</div>
