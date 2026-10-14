<script lang="ts">
  /**
   * La barre qui ouvre chaque zone : nom du salon et sujet, comme en haut d'un
   * salon Discord. La navigation, elle, vit dans la barre du haut (`Nav`).
   */
  import { getLocale } from '$lib/i18n/state.svelte';
  import { channelOf, type ChannelId } from './channels';

  interface Props {
    id: ChannelId;
  }
  const { id }: Props = $props();
  const channel = $derived(channelOf(getLocale(), id));
</script>

<div class="flex h-12 min-w-0 items-center gap-2.5 border-b border-line text-[15px]">
  <svg aria-hidden="true" viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-fog"><path fill="currentColor" d="M10.9 3.2a1 1 0 0 0-1.97-.3L8.4 6H5a1 1 0 0 0 0 2h3.06l-.95 6H4a1 1 0 1 0 0 2h2.8l-.5 3.15a1 1 0 0 0 1.98.3L8.83 16h5.97l-.5 3.15a1 1 0 0 0 1.98.3l.55-3.45H20a1 1 0 1 0 0-2h-2.85l.95-6H21a1 1 0 1 0 0-2h-2.58l.5-3.1a1 1 0 0 0-1.98-.3L16.4 6h-5.97l.48-2.8ZM10.1 8h5.97l-.95 6H9.15l.95-6Z" /></svg>
  <span class="shrink-0 font-semibold text-ink" translate="no">{channel.name}</span>
  <span aria-hidden="true" class="mx-1 hidden h-6 w-px shrink-0 bg-line-2 sm:block"></span>
  <span class="hidden truncate text-fog sm:block">{channel.topic}</span>
</div>
