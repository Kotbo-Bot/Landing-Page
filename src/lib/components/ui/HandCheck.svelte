<script lang="ts">
  /** Une coche tracée au marqueur bleu, pour les listes des pages. */
  const { class: className = '' }: { class?: string } = $props();
</script>

<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class={className}>
  <path
    d="M3.2 12.8c1.9 1.1 3.6 2.9 5 5.2 2.6-5.9 6.9-11.3 12.6-14.6"
    stroke="var(--color-marker-blue)"
    stroke-width="2.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
