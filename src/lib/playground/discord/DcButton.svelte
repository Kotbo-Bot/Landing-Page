<script lang="ts">
  /**
   * Un bouton de message Discord. Toujours un vrai `<button>` qui change l'état
   * de la démo : un bouton Discord mort sur la page serait pire que pas de
   * bouton du tout.
   */
  import type { Snippet } from 'svelte';

  interface Props {
    tone?: 'primary' | 'secondary' | 'success' | 'danger';
    disabled?: boolean;
    icon?: string;
    onclick: () => void;
    children: Snippet;
  }

  const { tone = 'secondary', disabled = false, icon, onclick, children }: Props = $props();

  const TONES = {
    primary: 'bg-[#5865f2] hover:bg-[#4752c4]',
    secondary: 'bg-[#4e5058] hover:bg-[#6d6f78]',
    success: 'bg-[#248046] hover:bg-[#1a6334]',
    danger: 'bg-[#da373c] hover:bg-[#a12828]',
  } as const;
</script>

<button
  type="button"
  {onclick}
  {disabled}
  class="inline-flex min-h-9 items-center gap-1.5 rounded px-3.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 {TONES[tone]}"
>
  {#if icon}<img src={icon} alt="" width="16" height="16" class="h-4 w-4" />{/if}
  {@render children()}
</button>
