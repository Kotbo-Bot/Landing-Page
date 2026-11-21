<script lang="ts">
  import type { Snippet } from 'svelte';
  import { DiscordUI, type MessageEntities } from '@arcscord/discord-ui-svelte';
  import { getLocale } from '$lib/i18n/state.svelte';

  const { children, class: className = '', entities }: { children: Snippet; class?: string; entities?: MessageEntities } = $props();
</script>

<DiscordUI
  theme="ash"
  {entities}
  locale={getLocale() === 'fr' ? 'fr-FR' : 'en-US'}
  timeZone="Europe/Zurich"
  class="stay-dark {className}"
>
  {@render children()}
</DiscordUI>
