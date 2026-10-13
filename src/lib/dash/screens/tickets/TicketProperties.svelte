<!--
  Propriétés du ticket ouvert : priorité, personne en charge, étiquettes et
  échéances de service.

  Recopie de `Kotbo/apps/dashboard/src/lib/components/tickets/TicketProperties.svelte`
  (branche `recette`). Les appels à l'API (`updateTicketProperties`,
  `assignTicket`, `fetchTicketAgents`) deviennent des changements d'état
  locaux remontés par `onchange` ; la liste du staff vient de la page.
-->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { Papicon } from '$lib/dash/ui';
  import { getLocale } from '$lib/i18n/state.svelte';
  import type { SlaClock, TicketPriority, TicketSla } from '$lib/dash/types';

  const TEXT = {
    fr: {
      priority: 'Priorité',
      assignee: 'Attribué à',
      nobody: 'Personne',
      agentLoad: (count: number) => `${count} en cours`,
      tags: 'Étiquettes',
      removeTag: (tag: string) => `Retirer l'étiquette ${tag}`,
      addTag: 'Ajouter…',
      sla: 'Objectifs',
      slaFirst: '1re réponse :',
      slaResolution: 'Résolution :',
      slaMet: 'tenue',
      slaLate: (time: string) => `en retard de ${time}`,
      slaOverdue: (time: string) => `dépassée de ${time}`,
      slaLeft: (time: string) => `reste ${time}`,
      min: (count: number) => `${count} min`,
      hours: (count: number) => `${count} h`,
      days: (count: number) => `${count} j`,
      low: 'Basse',
      normal: 'Normale',
      high: 'Haute',
      urgent: 'Urgente',
    },
    en: {
      priority: 'Priority',
      assignee: 'Assigned to',
      nobody: 'Nobody',
      agentLoad: (count: number) => `${count} open`,
      tags: 'Tags',
      removeTag: (tag: string) => `Remove tag ${tag}`,
      addTag: 'Add…',
      sla: 'Targets',
      slaFirst: 'First reply:',
      slaResolution: 'Resolution:',
      slaMet: 'met',
      slaLate: (time: string) => `late by ${time}`,
      slaOverdue: (time: string) => `overdue by ${time}`,
      slaLeft: (time: string) => `${time} left`,
      min: (count: number) => `${count} min`,
      hours: (count: number) => `${count} h`,
      days: (count: number) => `${count} d`,
      low: 'Low',
      normal: 'Normal',
      high: 'High',
      urgent: 'Urgent',
    },
  };

  type Agent = { id: string; name: string; openTickets: number };

  const {
    ticket,
    agents = [],
    knownTags = [],
    tagLabel,
    onpriority,
    onassign,
    ontags,
  }: {
    ticket: {
      id: string;
      status: string;
      priority?: TicketPriority;
      tags?: string[];
      claimedById: string | null;
      claimedByName: string | null;
      sla?: TicketSla | null;
    };
    agents?: Agent[];
    /** Étiquettes déjà utilisées sur le serveur, proposées à la saisie. */
    knownTags?: string[];
    tagLabel: (tag: string) => string;
    onpriority: (priority: TicketPriority) => void;
    onassign: (userId: string) => void;
    ontags: (tags: string[]) => void;
  } = $props();

  const t = $derived(TEXT[getLocale()]);
  const active = $derived(ticket.status === 'OPEN' || ticket.status === 'CLAIMED');

  // ── Étiquettes ─────────────────────────────────────────
  let tagInput = $state('');
  const tags = $derived(ticket.tags ?? []);

  function addTag() {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    tagInput = '';
    if (!tag || tags.includes(tag)) return;
    ontags([...tags, tag]);
  }

  function onTagKey(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag();
    } else if (event.key === 'Backspace' && !tagInput && tags.length > 0) {
      ontags(tags.slice(0, -1));
    }
  }

  // ── Échéances ──────────────────────────────────────────
  let now = $state(Date.now());
  let tick: ReturnType<typeof setInterval> | null = null;
  onMount(() => { tick = setInterval(() => (now = Date.now()), 30_000); });
  onDestroy(() => { if (tick) clearInterval(tick); });

  function span(ms: number): string {
    const minutes = Math.round(Math.abs(ms) / 60_000);
    if (minutes < 60) return t.min(Math.max(1, minutes));
    const hours = Math.round(minutes / 60);
    return hours < 48 ? t.hours(hours) : t.days(Math.round(hours / 24));
  }

  function describe(clock: SlaClock): { text: string; tone: string } {
    if (clock.status === 'met') return { text: t.slaMet, tone: 'text-success' };
    if (clock.completedAt) return { text: t.slaLate(span(new Date(clock.completedAt).getTime() - new Date(clock.dueAt).getTime())), tone: 'text-error' };
    const left = new Date(clock.dueAt).getTime() - now;
    if (left < 0) return { text: t.slaOverdue(span(left)), tone: 'text-error' };
    return { text: t.slaLeft(span(left)), tone: clock.status === 'at_risk' ? 'text-warning' : 'text-on-surface' };
  }

  const PRIORITIES: Array<{ value: TicketPriority; key: 'low' | 'normal' | 'high' | 'urgent' }> = [
    { value: 'LOW', key: 'low' },
    { value: 'NORMAL', key: 'normal' },
    { value: 'HIGH', key: 'high' },
    { value: 'URGENT', key: 'urgent' },
  ];

  const tagListId = `ticket-tags-${Math.random().toString(36).slice(2)}`;
</script>

<div class="tp-grid">
  <label class="tp-field">
    <span>{t.priority}</span>
    <select class="input tp-select" value={ticket.priority ?? 'NORMAL'} onchange={(event) => onpriority(event.currentTarget.value as TicketPriority)}>
      {#each PRIORITIES as option (option.value)}<option value={option.value}>{t[option.key]}</option>{/each}
    </select>
  </label>

  <label class="tp-field">
    <span>{t.assignee}</span>
    <select class="input tp-select" value={ticket.claimedById ?? ''} disabled={!active} onchange={(event) => onassign(event.currentTarget.value)}>
      <option value="">{t.nobody}</option>
      {#if ticket.claimedById && !agents.some((agent) => agent.id === ticket.claimedById)}
        <option value={ticket.claimedById}>{ticket.claimedByName ?? ticket.claimedById}</option>
      {/if}
      {#each agents as agent (agent.id)}
        <option value={agent.id}>{agent.name}{agent.openTickets ? ` · ${t.agentLoad(agent.openTickets)}` : ''}</option>
      {/each}
    </select>
  </label>

  <div class="tp-field tp-field--wide">
    <span>{t.tags}</span>
    <div class="tp-tags">
      {#each tags as tag (tag)}
        <span class="tp-tag">#{tagLabel(tag)}<button type="button" aria-label={t.removeTag(tagLabel(tag))} onclick={() => ontags(tags.filter((x) => x !== tag))}><Papicon icon="x" size={10} /></button></span>
      {/each}
      <input
        class="tp-tag-input"
        list={tagListId}
        aria-label={t.tags}
        placeholder={tags.length ? '' : t.addTag}
        bind:value={tagInput}
        onkeydown={onTagKey}
        onblur={addTag}
        maxlength="30"
      />
      <datalist id={tagListId}>{#each knownTags.filter((tag) => !tags.includes(tag)) as tag (tag)}<option value={tag}></option>{/each}</datalist>
    </div>
  </div>

  {#if ticket.sla?.firstResponse || ticket.sla?.resolution}
    <div class="tp-field">
      <span>{t.sla}</span>
      <div class="flex flex-col text-2xs leading-snug">
        {#if ticket.sla.firstResponse}
          {@const d = describe(ticket.sla.firstResponse)}
          <span>{t.slaFirst} <strong class="font-medium {d.tone}">{d.text}</strong></span>
        {/if}
        {#if ticket.sla.resolution}
          {@const d = describe(ticket.sla.resolution)}
          <span>{t.slaResolution} <strong class="font-medium {d.tone}">{d.text}</strong></span>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .tp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr));
    gap: 0.6rem 0.9rem;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid color-mix(in srgb, var(--outline-variant) 60%, transparent);
  }
  .tp-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
  }
  .tp-field > span {
    font-size: 0.6875rem;
    color: var(--on-surface-variant);
  }
  .tp-field--wide {
    grid-column: span 2;
  }
  .tp-select {
    padding: 0.35rem 0.55rem;
    font-size: 0.8125rem;
  }
  .tp-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.3rem;
    min-height: 2rem;
    padding: 0.2rem 0.4rem;
    border: 1px solid var(--outline-variant);
    border-radius: 0.5rem;
    background: var(--surface-container-lowest);
  }
  /* La saisie n'a pas de contour propre : le cadre porte le focus clavier. */
  .tp-tags:focus-within {
    outline: 2px solid var(--primary-color);
    outline-offset: 1px;
  }
  .tp-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.05rem 0.35rem 0.05rem 0.45rem;
    border-radius: 999px;
    background: var(--surface-container);
    color: var(--on-surface);
    font-size: 0.6875rem;
  }
  .tp-tag button {
    display: inline-flex;
    color: var(--on-surface-variant);
  }
  .tp-tag-input {
    flex: 1;
    min-width: 5rem;
    border: none;
    outline: none;
    background: transparent;
    color: var(--on-surface);
    font-size: 0.75rem;
  }
</style>
