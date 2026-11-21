<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Author, Avatar, MessageFrame, type MessageAuthor } from '@arcscord/discord-ui-svelte';
  import { mockAvatar } from '$lib/mockMedia';

  interface Props {
    author: string;
    color?: string;
    bot?: boolean;
    avatar?: string;
    time: string;
    enter?: boolean;
    removed?: boolean;
    mentioned?: boolean;
    ephemeral?: boolean;
    tag?: string;
    children: Snippet;
  }

  const { author, color, bot = false, avatar, time, enter = false,
    removed = false, mentioned = false, ephemeral = false, tag, children }: Props = $props();
  const user: MessageAuthor = $derived({
    id: author,
    displayName: author,
    color,
    bot,
    verified: bot,
    avatarUrl: avatar ?? mockAvatar(author),
    tag: tag ? { text: tag } : undefined,
  });
</script>

<div class="dc-message {enter ? 'dc-enter' : ''} {removed ? 'opacity-45' : ''}">
  <MessageFrame {mentioned} {ephemeral}>
    {#snippet avatar()}<Avatar author={user} />{/snippet}
    {#snippet header()}
      <header class="dui-message-header">
        <Author author={user} />
        <span class="dui-timestamp">{time}</span>
      </header>
    {/snippet}
    <div class={removed ? 'line-through' : ''}>{@render children()}</div>
  </MessageFrame>
</div>
