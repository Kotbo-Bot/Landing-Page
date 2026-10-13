<!--
  Recherche d'un membre du serveur. Reprend le balisage de
  `lib/components/DiscordMemberLookup.svelte` (dashboard), sur une liste
  locale : les membres du casting au lieu de l'API Discord.
-->
<script lang="ts" module>
  export type LookupOption = { id: string; username: string; displayName?: string | null; avatarUrl?: string | null };
</script>

<script lang="ts">
  import { Papicon } from '$lib/dash/ui';

  let {
    options,
    query = $bindable(''),
    selectedId = $bindable(''),
    placeholder = '',
    id = undefined,
  }: { options: LookupOption[]; query?: string; selectedId?: string; placeholder?: string; id?: string } = $props();

  let focused = $state(false);
  let root = $state<HTMLDivElement | null>(null);

  const suggestions = $derived.by(() => {
    if (!focused) return [];
    const q = query.trim().toLowerCase().replace(/^@/, '');
    const selected = options.find((o) => o.id === selectedId);
    if (selected && (selected.displayName || selected.username) === query) return [];
    return options.filter((o) => !q || [o.username, o.displayName, o.id].some((v) => v?.toLowerCase().includes(q))).slice(0, 5);
  });

  function handleInput(value: string) {
    query = value;
    selectedId = '';
  }

  function selectSuggestion(option: LookupOption) {
    selectedId = option.id;
    query = option.displayName || option.username;
    focused = false;
  }

  function onfocusout(event: FocusEvent) {
    if (!root?.contains(event.relatedTarget as Node)) focused = false;
  }
</script>

<div bind:this={root} class="relative" {onfocusout}>
  <input
    {id}
    type="text"
    value={query}
    {placeholder}
    autocomplete="off"
    onfocus={() => (focused = true)}
    oninput={(event) => handleInput((event.currentTarget as HTMLInputElement).value)}
    onkeydown={(e) => {
      if (e.key === 'Escape' && suggestions.length) {
        e.stopPropagation();
        focused = false;
      }
    }}
    class="w-full bg-[#1e1e2e]/60 border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8a2be2]/50 focus:border-transparent transition-all duration-300"
  />

  {#if suggestions.length > 0}
    <div class="absolute z-50 w-full mt-2 bg-[#1e1e2e] border border-white/10 rounded-xl shadow-sm overflow-hidden">
      <div class="max-h-60 overflow-y-auto p-2 space-y-1">
        {#each suggestions as suggestion (suggestion.id)}
          <button
            type="button"
            class="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 focus-visible:bg-white/5 transition-colors flex items-center gap-3 group"
            onclick={() => selectSuggestion(suggestion)}
          >
            <div class="h-8 w-8 rounded-full overflow-hidden bg-white/5 shrink-0 border border-white/10 group-hover:border-white/20 transition-colors">
              {#if suggestion.avatarUrl}
                <img src={suggestion.avatarUrl} alt="" class="h-full w-full object-cover" />
              {:else}
                <div class="h-full w-full flex items-center justify-center text-on-surface-variant"><Papicon icon="user" size={14} /></div>
              {/if}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate">{suggestion.displayName || suggestion.username}</span>
                <span class="text-2xs text-on-surface-variant shrink-0 ml-2">@{suggestion.username}</span>
              </div>
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
