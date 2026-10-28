<script lang="ts">
  import BlogPost from '$lib/pages/BlogPost.svelte';

  const { data } = $props();
</script>

<BlogPost slug={data.slug} />
