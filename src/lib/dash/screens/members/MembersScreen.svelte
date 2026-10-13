<!--
  La page Membres du dashboard, recopiée de `pages/Members.svelte` (branche
  `recette`), à 1180 x 720, le dossier d'Arka ouvert par défaut.

  Différences avec le dashboard :
  - la liste est le casting de `dash/cast.ts` : recherche, tri, filtres et
    pagination tournent sur place au lieu d'interroger `/members/search` ;
    les compteurs du haut restent ceux du serveur de démo ;
  - une carte ouvre directement le dossier (`MemberCaseModal`) ; dans le
    dashboard elle mène à la fiche `/members/:id`, d'où le dossier s'ouvre ;
  - la barre de recherche n'est plus collante et garde sa mise en page de
    bureau quelle que soit la largeur : la page réduit le cadre d'un bloc.
-->
<script lang="ts">
  import { tick, untrack } from 'svelte';
  import { slide } from 'svelte/transition';
  import Dash from '$lib/dash/Dash.svelte';
  import Papicon from '$lib/dash/Papicon.svelte';
  import { Button, FilterPills, ModulePage } from '$lib/dash/ui';
  import { memberAvatarSrc } from '$lib/dash/media';
  import { MEMBERS } from '$lib/dash/cast';
  import { DIRECTORY_TOTALS, memberDirectory } from '$lib/dash/fixtures/members';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { dateLocale } from './format';
  import MemberCaseModal from './MemberCaseModal.svelte';

  const TEXT = {
    fr: {
      title: 'Membres',
      desc: 'Retrouve un membre et consulte son historique sur le serveur.',
      totalMembers: 'Total membres',
      search: 'Rechercher par nom, pseudo ou ID…',
      sortLabel: 'Trier par',
      sortLastActivity: 'Dernière activité',
      sortMessages: 'Messages envoyés',
      sortJoined: 'Date d’arrivée',
      sortAsc: 'Tri croissant',
      sortDesc: 'Tri décroissant',
      filters: 'Filtres',
      typeLabel: 'Type de compte',
      humans: 'Humains',
      bots: 'Bots',
      all: 'Tous',
      presenceLabel: 'Présence sur le serveur',
      present: 'Présents',
      left: 'Partis',
      perPage: 'Par page',
      resetFilters: 'Réinitialiser les filtres',
      statOnline: (n: string) => `${n} présents`,
      statLeft: (n: string) => `${n} partis`,
      statBots: (n: number) => (n === 1 ? '1 bot' : `${n} bots`),
      noResult: 'Aucun résultat',
      noResultDesc: 'Aucun membre ne correspond à tes critères de recherche.',
      resetAll: 'Réinitialiser tout',
      noName: 'Sans nom',
      activity: 'Activité',
      messages: 'Messages',
      never: 'Jamais',
      unknown: 'Inconnu',
      agoMinutes: (n: number) => `il y a ${n} min`,
      agoHours: (n: number) => `il y a ${n} h`,
      agoDays: (n: number) => `il y a ${n} j`,
      pagination: (shown: number, total: number) => `${shown} / ${total} membres`,
      previous: 'Page précédente',
      next: 'Page suivante',
    },
    en: {
      title: 'Members',
      desc: 'Find a member and see their history on the server.',
      totalMembers: 'Total members',
      search: 'Search by name, username or ID…',
      sortLabel: 'Sort by',
      sortLastActivity: 'Last activity',
      sortMessages: 'Messages sent',
      sortJoined: 'Join date',
      sortAsc: 'Ascending order',
      sortDesc: 'Descending order',
      filters: 'Filters',
      typeLabel: 'Account type',
      humans: 'Humans',
      bots: 'Bots',
      all: 'All',
      presenceLabel: 'Presence on the server',
      present: 'On server',
      left: 'Left',
      perPage: 'Per page',
      resetFilters: 'Reset the filters',
      statOnline: (n: string) => `${n} on the server`,
      statLeft: (n: string) => `${n} left`,
      statBots: (n: number) => (n === 1 ? '1 bot' : `${n} bots`),
      noResult: 'No result',
      noResultDesc: 'We could not find any member matching your search criteria.',
      resetAll: 'Reset everything',
      noName: 'No name',
      activity: 'Activity',
      messages: 'Messages',
      never: 'Never',
      unknown: 'Unknown',
      agoMinutes: (n: number) => `${n} min ago`,
      agoHours: (n: number) => `${n} h ago`,
      agoDays: (n: number) => `${n} d ago`,
      pagination: (shown: number, total: number) => `${shown} / ${total} members`,
      previous: 'Previous page',
      next: 'Next page',
    },
  };

  const { initialUserId = MEMBERS.arka.userId }: { initialUserId?: string | null } = $props();

  const t = $derived(TEXT[getLocale()]);

  type SortBy = 'lastSeenAt' | 'messageCount' | 'guildJoinedAt';
  const directory = memberDirectory();

  let searchQuery = $state('');
  let sortBy = $state<SortBy>('lastSeenAt');
  let sortOrder = $state<'asc' | 'desc'>('desc');
  let botFilter = $state<'human' | 'bot' | 'all'>('human');
  let serverStatus = $state<'on_server' | 'left' | 'all'>('on_server');
  // Le dashboard propose 12, 24 ou 48 par page (24 d'office). Le cadre de 720 px
  // tient deux rangées de cartes avec les filtres et la pagination : 8 au plus.
  const PAGE_SIZES = [4, 6, 8];
  const DEFAULT_LIMIT = 8;
  let limit = $state(DEFAULT_LIMIT);
  let page = $state(1);
  let filtersOpen = $state(false);

  // Écarts au réglage par défaut, comptés sur le bouton « Filtres » : un filtre
  // replié ne doit pas pouvoir vider la liste sans qu'on le voie.
  const activeFilterCount = $derived((botFilter !== 'human' ? 1 : 0) + (serverStatus !== 'on_server' ? 1 : 0) + (limit !== DEFAULT_LIMIT ? 1 : 0));

  const found = $derived.by(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = directory.filter((member) => {
      if (botFilter === 'human' && member.isBot) return false;
      if (botFilter === 'bot' && !member.isBot) return false;
      if (serverStatus === 'on_server' && !member.isOnServer) return false;
      if (serverStatus === 'left' && member.isOnServer) return false;
      if (!query) return true;
      return [member.displayName, member.username, member.id].some((v) => (v ?? '').toLowerCase().includes(query));
    });
    const value = (m: (typeof list)[number]) => (sortBy === 'messageCount' ? m.messageCount : new Date(m[sortBy] ?? 0).getTime());
    return list.toSorted((a, b) => (sortOrder === 'asc' ? value(a) - value(b) : value(b) - value(a)));
  });
  const totalPages = $derived(Math.max(1, Math.ceil(found.length / limit)));
  const members = $derived(found.slice((page - 1) * limit, page * limit));

  function changeFilter(apply: () => void) {
    apply();
    page = 1;
  }

  function resetSearch() {
    searchQuery = '';
    sortBy = 'lastSeenAt';
    sortOrder = 'desc';
    botFilter = 'human';
    serverStatus = 'on_server';
    limit = DEFAULT_LIMIT;
    page = 1;
  }

  function formatRelative(value: string | null) {
    if (!value) return t.unknown;
    const diffMs = Date.now() - new Date(value).getTime();
    const minutes = Math.max(1, Math.floor(diffMs / 60000));
    if (minutes < 60) return t.agoMinutes(minutes);
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t.agoHours(hours);
    const days = Math.floor(hours / 24);
    if (days < 30) return t.agoDays(days);
    return new Date(value).toLocaleDateString(dateLocale(), { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // --- Dossier ouvert ---
  // Le dossier ouvert au départ ; ensuite, c'est le visiteur qui choisit.
  let caseUserId = $state<string | null>(untrack(() => initialUserId));
  let root = $state<HTMLDivElement>();
  let opener: HTMLElement | null = null;

  async function openCase(id: string, event: MouseEvent) {
    opener = event.currentTarget as HTMLElement;
    caseUserId = id;
    await tick();
    // Le focus passe dans le dossier sans faire défiler la page du site.
    root?.querySelector<HTMLElement>('[data-case-close]')?.focus({ preventScroll: true });
  }

  function closeCase() {
    caseUserId = null;
    opener?.focus({ preventScroll: true });
    opener = null;
  }
</script>

<Dash class="relative h-[720px] w-[1180px] overflow-hidden bg-[var(--surface)]">
  <div bind:this={root} class="h-full">
    <div class="h-full p-6">
      <ModulePage title={t.title} description={t.desc}>
        {#snippet actions()}
          <div class="flex items-center gap-4">
            <div class="flex -space-x-3">
              {#each found.slice(0, 5) as member (member.id)}
                <img src={memberAvatarSrc(member.avatarUrl, member.displayName || member.username, member.id)} alt="" class="h-8 w-8 rounded-full border-2 border-surface-container object-cover" />
              {/each}
              {#if found.length > 5}
                <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-container bg-surface-container-high text-2xs font-bold text-on-surface-variant">
                  +{found.length - 5}
                </div>
              {/if}
            </div>
            <div class="h-8 w-px bg-outline-variant/20"></div>
            <div class="text-right">
              <div class="text-lg font-semibold text-on-surface">{DIRECTORY_TOTALS.onServer.toLocaleString(dateLocale())}</div>
              <div class="text-xs font-semibold text-on-surface-variant/70">{t.totalMembers}</div>
            </div>
          </div>
        {/snippet}

        <section class="space-y-4 rounded-xl bg-surface/80 pb-2">
          <div class="flex flex-row items-center gap-3">
            <div class="relative flex-1">
              <span class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-on-surface-variant/40">
                <Papicon icon="search" size={18} />
              </span>
              <input
                type="search"
                bind:value={searchQuery}
                oninput={() => (page = 1)}
                placeholder={t.search}
                aria-label={t.search}
                class="h-10 w-full rounded-lg border border-outline-variant/40 bg-surface-container-low pl-11 pr-9 text-sm text-on-surface outline-hidden placeholder:text-on-surface-variant focus:border-primary/40 focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div class="flex items-center gap-2">
              <div class="relative">
                <select
                  value={sortBy}
                  aria-label={t.sortLabel}
                  onchange={(event) => changeFilter(() => (sortBy = (event.currentTarget as HTMLSelectElement).value as SortBy))}
                  class="h-10 w-full appearance-none rounded-lg border border-outline-variant/40 bg-surface-container-low pl-3 pr-9 text-sm text-on-surface transition-colors hover:bg-surface-container focus:border-primary/40"
                >
                  <option value="lastSeenAt">{t.sortLastActivity}</option>
                  <option value="messageCount">{t.sortMessages}</option>
                  <option value="guildJoinedAt">{t.sortJoined}</option>
                </select>
                <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <Papicon icon="chevron-down" size={14} />
                </span>
              </div>

              <Button
                variant="ghost"
                icon={sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'}
                onclick={() => changeFilter(() => (sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'))}
                title={sortOrder === 'asc' ? t.sortAsc : t.sortDesc}
                aria-label={sortOrder === 'asc' ? t.sortAsc : t.sortDesc}
              />

              <Button variant={filtersOpen ? 'secondary' : 'ghost'} icon="sliders-horizontal" onclick={() => (filtersOpen = !filtersOpen)} aria-expanded={filtersOpen} aria-controls="members-filters">
                {t.filters}
                {#if activeFilterCount > 0}
                  <span class="ml-0.5 rounded-full bg-primary px-1.5 text-2xs font-semibold tabular-nums text-on-primary">{activeFilterCount}</span>
                {/if}
              </Button>
            </div>
          </div>

          {#if filtersOpen}
            <div id="members-filters" transition:slide={{ duration: 160 }} class="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-outline-variant/30 bg-surface-container-low/60 px-4 py-3">
              <FilterPills
                label={t.typeLabel}
                value={botFilter}
                onchange={(value) => changeFilter(() => (botFilter = value))}
                options={[
                  { value: 'human', label: t.humans },
                  { value: 'bot', label: t.bots },
                  { value: 'all', label: t.all },
                ]}
              />
              <FilterPills
                label={t.presenceLabel}
                value={serverStatus}
                onchange={(value) => changeFilter(() => (serverStatus = value))}
                options={[
                  { value: 'on_server', label: t.present },
                  { value: 'left', label: t.left },
                  { value: 'all', label: t.all },
                ]}
              />
              <label class="flex items-center gap-2 text-xs text-on-surface-variant">
                {t.perPage}
                <select
                  value={limit}
                  onchange={(event) => changeFilter(() => (limit = Number((event.currentTarget as HTMLSelectElement).value)))}
                  class="h-8 rounded-md border border-outline-variant/40 bg-surface-container-low px-2 text-xs text-on-surface outline-hidden"
                >
                  {#each PAGE_SIZES as size (size)}
                    <option value={size}>{size}</option>
                  {/each}
                </select>
              </label>
              {#if activeFilterCount > 0}
                <Button variant="ghost" size="sm" icon="rotate-ccw" onclick={resetSearch} class="ml-auto">{t.resetFilters}</Button>
              {/if}
            </div>
          {/if}

          <p class="text-xs text-on-surface-variant">
            {t.statOnline(DIRECTORY_TOTALS.onServer.toLocaleString(dateLocale()))}
            <span aria-hidden="true" class="mx-1.5 text-on-surface-variant/40">·</span>
            {t.statLeft(DIRECTORY_TOTALS.left.toLocaleString(dateLocale()))}
            <span aria-hidden="true" class="mx-1.5 text-on-surface-variant/40">·</span>
            {t.statBots(DIRECTORY_TOTALS.bots)}
          </p>
        </section>

        <div>
          {#if members.length === 0}
            <div class="flex flex-col items-center justify-center py-16 text-center">
              <div class="flex h-16 w-16 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant/20">
                <Papicon icon="users" size={32} />
              </div>
              <h3 class="mt-6 text-xl font-bold text-on-surface">{t.noResult}</h3>
              <p class="mt-2 max-w-xs text-sm text-on-surface-variant">{t.noResultDesc}</p>
              <button type="button" onclick={resetSearch} class="mt-6 text-body-sm font-medium text-primary hover:underline">{t.resetAll}</button>
            </div>
          {:else}
            <div class="grid grid-cols-4 gap-4">
              {#each members as member (member.id)}
                <button
                  type="button"
                  onclick={(event) => openCase(member.id, event)}
                  class="group flex flex-col rounded-xl border {member.isOnServer ? 'border-outline-variant/10 bg-surface-container-low/40' : 'border-error/10 bg-error/5'} p-4 text-left transition-all duration-300 hover:border-primary/20 hover:bg-surface-container-low hover:shadow-xl hover:shadow-primary/5"
                >
                  <div class="flex items-center gap-3">
                    <div class="relative shrink-0">
                      <img src={memberAvatarSrc(member.avatarUrl, member.displayName || member.username, member.id)} alt="" class="h-11 w-11 rounded-full object-cover" />
                      <div class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface-container-lowest {member.presenceStatus === 'online' ? 'bg-success' : member.presenceStatus === 'idle' ? 'bg-warning' : member.presenceStatus === 'dnd' ? 'bg-error' : 'bg-on-surface-variant/40'}"></div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <h3 class="truncate text-sm font-semibold text-on-surface transition-colors group-hover:text-primary">{member.displayName || t.noName}</h3>
                      <p class="truncate text-xs text-on-surface-variant">@{member.username || member.id.slice(0, 8)}</p>
                    </div>
                  </div>
                  <dl class="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <dt class="text-2xs text-on-surface-variant">{t.activity}</dt>
                      <dd class="text-sm text-on-surface">{formatRelative(member.lastSeenAt)}</dd>
                    </div>
                    <div>
                      <dt class="text-2xs text-on-surface-variant">{t.messages}</dt>
                      <dd class="text-sm tabular-nums text-on-surface">{member.messageCount.toLocaleString(dateLocale())}</dd>
                    </div>
                  </dl>
                </button>
              {/each}
            </div>
          {/if}
        </div>

        {#if totalPages > 1}
          <footer class="flex items-center justify-between border-t border-outline-variant/10 pt-4">
            <p class="text-xs font-bold text-on-surface-variant/70">{t.pagination(members.length, found.length)}</p>
            <div class="flex items-center gap-1">
              <button type="button" aria-label={t.previous} onclick={() => { if (page > 1) page -= 1; }} disabled={page === 1} class="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-30">
                <Papicon icon="chevron-left" size={16} />
              </button>
              <div class="px-4 text-xs font-semibold text-on-surface">{page} <span class="mx-1 text-on-surface-variant/30">/</span> {totalPages}</div>
              <button type="button" aria-label={t.next} onclick={() => { if (page < totalPages) page += 1; }} disabled={page === totalPages} class="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-30">
                <Papicon icon="chevron-right" size={16} />
              </button>
            </div>
          </footer>
        {/if}
      </ModulePage>
    </div>

    <MemberCaseModal userId={caseUserId} onclose={closeCase} />
  </div>
</Dash>
