<script lang="ts">
  import type { Snippet } from 'svelte';
  import { ActionRow, Embed, type EmbedView } from '@arcscord/discord-ui-svelte';

  interface Props {
    color?: string;
    title?: string;
    icon?: string;
    description?: string;
    fields?: { name: string; value: string; inline?: boolean }[];
    footer?: string;
    thumbnail?: string;
    actions?: Snippet;
  }

  const { color = '#5865f2', title, icon, description, fields = [], footer, thumbnail, actions }: Props = $props();
  const embed: EmbedView = $derived({
    id: 'preview-embed',
    color,
    title: icon ? undefined : title,
    author: icon && title ? { name: title, iconUrl: icon } : undefined,
    description,
    fields: fields.map((field, i) => ({ ...field, id: String(i), inline: field.inline !== false })),
    footer: footer ? { text: footer } : undefined,
    thumbnail: thumbnail ? { id: 'thumbnail', url: thumbnail, alt: '' } : undefined,
  });
</script>

<div class="mt-1.5 max-w-128">
  <Embed {embed} />
  {#if actions}<div class="mt-2"><ActionRow>{@render actions()}</ActionRow></div>{/if}
</div>
