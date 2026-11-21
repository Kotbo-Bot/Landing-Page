<script lang="ts">
  import { Button } from '@arcscord/discord-ui-svelte';

  interface Props {
    tone?: 'primary' | 'secondary' | 'success' | 'danger';
    disabled?: boolean;
    icon?: string;
    onclick: () => void;
    label: string;
  }

  const { tone = 'secondary', disabled = false, icon, onclick, label }: Props = $props();
</script>

<Button variant={tone} {disabled} onClick={onclick} {label}>
  {#snippet emoji()}
    {#if icon}<img src={icon} alt="" width="16" height="16" />{/if}
  {/snippet}
</Button>
