<script lang="ts">
  import type { Snippet } from 'svelte';
  import { DiscordUI } from '@arcscord/discord-ui-svelte';
  import { getLocale } from '$lib/i18n/state.svelte';

  const { children, class: className = '' }: { children: Snippet; class?: string } = $props();
</script>

<DiscordUI
  theme="ash"
  locale={getLocale() === 'fr' ? 'fr-FR' : 'en-US'}
  timeZone="Europe/Zurich"
  class="stay-dark {className}"
>
  {@render children()}
</DiscordUI>
