<script lang="ts">
  import FeatureDetail from '$lib/pages/FeatureDetail.svelte';

  const { data } = $props();
</script>

<FeatureDetail featureKey={data.featureKey} />
