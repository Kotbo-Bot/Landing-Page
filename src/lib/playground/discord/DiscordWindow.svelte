<script lang="ts">
  /**
   * La fenêtre Discord des aperçus : rail des serveurs, liste des salons, fil.
   *
   * Sur grand écran, la disposition est celle du client. Sur téléphone, le rail
   * disparaît et la liste des salons devient une rangée qui défile : c'est ce
   * que fait l'application mobile, et deux colonnes de 200 px n'y tiendraient
   * pas.
   *
   * Les salons sont de vrais boutons quand `onselect` est fourni : cliquer un
   * salon affiche ce que Kotbo y a posé. Sans `onselect`, ce sont des libellés.
   */
  import type { Snippet } from 'svelte';
  import { KOTBO_AVATAR } from './theme';

  export interface Channel {
    id: string;
    name: string;
    kind?: 'text' | 'voice' | 'forum';
    /** Le salon vient d'apparaître : on le signale une fois. */
    fresh?: boolean;
    unread?: boolean;
  }

  export interface Category {
    id: string;
    name: string;
    channels: Channel[];
  }

  interface Props {
    serverName: string;
    /** Image du serveur (URL ou `data:`). Sans image, les initiales du nom. */
    serverIcon?: string | null;
    categories: Category[];
    active: string;
    onselect?: (id: string) => void;
    /** Libellé accessible de la liste des salons. */
    channelsLabel: string;
    topic?: string;
    /** Hauteur de la zone de messages. */
    height?: string;
    children: Snippet;
    composer?: Snippet;
  }

  const {
    serverName,
    serverIcon,
    categories,
    active,
    onselect,
    channelsLabel,
    topic,
    height = '30rem',
    children,
    composer,
  }: Props = $props();

  /** Comme Discord : la première lettre de chaque mot, trois au plus. */
  const initials = $derived(
    serverName
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .slice(0, 3),
  );

  const activeChannel = $derived(
    categories.flatMap((c) => c.channels).find((c) => c.id === active),
  );

  function glyph(kind: Channel['kind']): string {
    return kind === 'voice' ? '🔊' : kind === 'forum' ? '💬' : '#';
  }
</script>

<div
  class="flex overflow-hidden rounded-xl bg-[#313338] text-[#dbdee1] shadow-[0_30px_70px_-20px_rgba(17,24,39,0.55)]"
  style="--dc-height: {height}"
>
  <!-- Rail des serveurs : décor fidèle, non interactif. -->
  <div aria-hidden="true" class="hidden w-18 shrink-0 flex-col items-center gap-2 bg-[#1e1f22] py-3 md:flex">
    <div class="grid h-12 w-12 place-items-center rounded-2xl bg-[#313338]">
      <img src={KOTBO_AVATAR} alt="" width="28" height="28" class="h-7 w-7 opacity-80" />
    </div>
    <div class="h-0.5 w-8 rounded bg-[#35363c]"></div>
    <div class="relative">
      <span class="absolute -left-3 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r bg-white"></span>
      <div class="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl {serverIcon ? 'bg-[#313338]' : 'bg-[#5865f2]'}">
        {#if serverIcon}
          <img src={serverIcon} alt="" width="48" height="48" class="h-12 w-12 object-cover" />
        {:else}
          <!-- Initiales, comme Discord pour un serveur sans image. -->
          <span class="text-sm font-semibold text-white">{initials}</span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Liste des salons, grand écran. -->
  <nav aria-label={channelsLabel} class="hidden w-56 shrink-0 flex-col bg-[#2b2d31] md:flex">
    <p class="truncate border-b border-[#1f2023] px-4 py-3 font-semibold text-[#f2f3f5]">{serverName}</p>
    <div class="flex-1 overflow-y-auto px-2 py-3" style="max-height: var(--dc-height)">
      {#each categories as category (category.id)}
        <p class="mb-1 mt-3 px-2 text-xs font-semibold text-[#949ba4] first:mt-0">{category.name}</p>
        <ul>
          {#each category.channels as channel (channel.id)}
            <li class={channel.fresh ? 'dc-fresh' : ''}>
              {#if onselect}
                <button
                  type="button"
                  onclick={() => onselect(channel.id)}
                  aria-current={channel.id === active ? 'true' : undefined}
                  class="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-[0.9375rem] transition-colors {channel.id ===
                  active
                    ? 'bg-[#404249] text-white'
                    : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'}"
                >
                  <span aria-hidden="true" class="w-4 text-center text-[#80848e]">{glyph(channel.kind)}</span>
                  <span class="truncate">{channel.name}</span>
                  {#if channel.unread && channel.id !== active}
                    <span class="ml-auto h-2 w-2 shrink-0 rounded-full bg-white" aria-hidden="true"></span>
                  {/if}
                </button>
              {:else}
                <span class="flex items-center gap-1.5 px-2 py-1.5 text-[0.9375rem] text-[#949ba4]">
                  <span aria-hidden="true" class="w-4 text-center">{glyph(channel.kind)}</span>
                  <span class="truncate">{channel.name}</span>
                </span>
              {/if}
            </li>
          {/each}
        </ul>
      {/each}
    </div>
  </nav>

  <div class="flex min-w-0 flex-1 flex-col">
    <!-- En-tête du salon. -->
    <div class="flex min-h-12 items-center gap-2 border-b border-[#26272b] px-4 py-2">
      <span aria-hidden="true" class="text-lg text-[#80848e]">{glyph(activeChannel?.kind)}</span>
      <span class="font-semibold text-[#f2f3f5]">{activeChannel?.name ?? ''}</span>
      {#if topic}
        <span class="hidden truncate border-l border-[#3f4147] pl-2 text-sm text-[#949ba4] lg:inline">{topic}</span>
      {/if}
    </div>

    <!-- Salons, téléphone : une rangée qui défile. -->
    {#if onselect}
      <nav aria-label={channelsLabel} class="border-b border-[#26272b] md:hidden">
        <ul class="flex gap-1.5 overflow-x-auto px-3 py-2">
          {#each categories.flatMap((c) => c.channels) as channel (channel.id)}
            <li class="shrink-0">
              <button
                type="button"
                onclick={() => onselect(channel.id)}
                aria-current={channel.id === active ? 'true' : undefined}
                class="flex min-h-11 items-center gap-1 rounded-full px-3 text-sm {channel.id === active
                  ? 'bg-[#404249] text-white'
                  : 'bg-[#2b2d31] text-[#b5bac1]'}"
              >
                <span aria-hidden="true">{glyph(channel.kind)}</span>{channel.name}
              </button>
            </li>
          {/each}
        </ul>
      </nav>
    {/if}

    <!-- Hauteur fixe et non `flex-1` : une base flexible nulle écrasait la
         hauteur demandée, et le fil se réduisait à ses deux premiers messages. -->
    <div class="dc-scroll flex-none overflow-y-auto py-3" style="height: var(--dc-height)">
      {@render children()}
    </div>

    {#if composer}
      <div class="px-4 pb-4">{@render composer()}</div>
    {/if}
  </div>
</div>
