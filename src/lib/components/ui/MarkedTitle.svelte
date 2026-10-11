<script lang="ts">
  /**
   * Un titre dont le dernier mot est entouré au marqueur. Les titres des pages
   * fonctionnalités viennent du dashboard : le cercle se pose sur leur dernier
   * mot, quel qu'il soit, une fois par page (DESIGN.md).
   */
  import MarkerCircle from './MarkerCircle.svelte';

  const { text }: { text: string } = $props();

  const parts = $derived.by(() => {
    const trimmed = text.trim();
    const cut = trimmed.lastIndexOf(' ');
    return cut < 0 ? { head: '', last: trimmed } : { head: trimmed.slice(0, cut + 1), last: trimmed.slice(cut + 1) };
  });
</script>

{parts.head}<MarkerCircle color="blue" class="text-indigo-600" animated>{parts.last}</MarkerCircle>
