<script lang="ts">
  /**
   * Un message Discord : avatar, auteur, heure, contenu.
   *
   * `enter` rejoue l'arrivée du message. Elle sert à une seule chose : montrer
   * ce qui vient de se produire (un membre arrive, le bot répond). Les messages
   * déjà là au chargement ne bougent pas.
   */
  import type { Snippet } from 'svelte';
  import { mockAvatar } from '$lib/mockMedia';

  interface Props {
    author: string;
    /** Couleur du rôle, comme dans la liste des membres. */
    color?: string;
    bot?: boolean;
    avatar?: string;
    time: string;
    enter?: boolean;
    /** Message barré par la modération : on le garde visible, grisé. */
    removed?: boolean;
    children: Snippet;
  }

  const {
    author,
    color = '#f2f3f5',
    bot = false,
    avatar,
    time,
    enter = false,
    removed = false,
    children,
  }: Props = $props();
</script>

<div class="dc-message flex gap-3 px-4 py-1.5 {enter ? 'dc-enter' : ''} {removed ? 'opacity-45' : ''}">
  <img
    src={avatar ?? mockAvatar(author)}
    alt=""
    width="40"
    height="40"
    class="mt-0.5 h-10 w-10 shrink-0 rounded-full bg-[#1e1f22]"
  />
  <div class="min-w-0 flex-1">
    <p class="flex flex-wrap items-baseline gap-x-2 leading-snug">
      <span class="font-semibold" style="color: {color}">{author}</span>
      {#if bot}
        <span class="rounded bg-[#5865f2] px-1 py-px text-[0.625rem] font-semibold leading-none text-white">APP</span>
      {/if}
      <span class="text-xs text-[#949ba4]">{time}</span>
    </p>
    <div class="text-[0.9375rem] leading-relaxed text-[#dbdee1] {removed ? 'line-through' : ''}">
      {@render children()}
    </div>
  </div>
</div>
