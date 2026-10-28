<script lang="ts">
  import ReleasePage from '$lib/pages/ReleasePage.svelte';

  const { data } = $props();
</script>

<ReleasePage slug={data.slug} />
