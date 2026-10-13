<!--
  Sondages internes du staff, votes pondérés par le grade ; les résultats ne
  s'affichent qu'après avoir voté. Recopie de
  `lib/components/staff/StaffPolls.svelte` (dashboard).
-->
<script lang="ts">
  import { getLocale } from '$lib/i18n/state.svelte';
  import { Button, EmptyState, Field, FilterPills, Modal, Papicon } from '$lib/dash/ui';
  import { useStaff, isPollClosed, type StaffPoll } from './staffStore.svelte';
  import { formatDate, formatRelative } from './format';
  import { dialogFocus } from './dialogFocus';

  const TEXT = {
    fr: {
      filter: 'Filtrer',
      ongoing: 'En cours',
      closedFilter: 'Terminés',
      newPoll: 'Nouveau sondage',
      noneOpen: 'Aucun sondage en cours',
      noneActive: 'Aucun sondage actif',
      emptyDesc: 'Un sondage pose une question au staff. Le vote de chacun pèse selon son grade.',
      emptyAction: 'Lancer un sondage',
      closedBadge: 'Clôturé',
      by: (author: string) => `Par ${author}`,
      closeNow: 'Clôturer maintenant',
      voters: (n: number, weight: string) => `Votants : ${n} · poids total ${weight}`,
      ends: (when: string) => `se termine ${when}`,
      voteToSee: 'Vote pour voir les résultats',
      modalSub: 'Prends des décisions collectives avec des votes pondérés par grade.',
      fieldTitle: 'Titre du sondage',
      phTitle: 'Ex: Nouveau règlement du salon général',
      fieldDesc: 'Description',
      phDesc: 'Détaille le sujet du vote…',
      fieldOptions: 'Options de réponse',
      option: (n: number) => `Option ${n}`,
      removeOption: (n: number) => `Retirer l'option ${n}`,
      addOption: 'Ajouter une option',
      fieldCloses: 'Date de clôture automatique (optionnelle)',
      closesHint: "Sans date, le sondage reste ouvert jusqu'à ce que tu le clôtures.",
      cancel: 'Annuler',
      minOptions: 'Il faut au moins 2 options valides',
      publish: 'Publier le sondage',
    },
    en: {
      filter: 'Filter',
      ongoing: 'Ongoing',
      closedFilter: 'Closed',
      newPoll: 'New Poll',
      noneOpen: 'No open poll',
      noneActive: 'No active poll',
      emptyDesc: 'A poll asks the staff a question. Each vote weighs according to grade.',
      emptyAction: 'Start a poll',
      closedBadge: 'Closed',
      by: (author: string) => `By ${author}`,
      closeNow: 'Close now',
      voters: (n: number, weight: string) => `Voters: ${n} · total weight ${weight}`,
      ends: (when: string) => `ends ${when}`,
      voteToSee: 'Vote to see the results',
      modalSub: 'Make collective decisions with grade-weighted votes.',
      fieldTitle: 'Poll title',
      phTitle: 'E.g: New rules for the general channel',
      fieldDesc: 'Description',
      phDesc: 'Detail the subject of the vote...',
      fieldOptions: 'Answer options',
      option: (n: number) => `Option ${n}`,
      removeOption: (n: number) => `Remove option ${n}`,
      addOption: 'Add an option',
      fieldCloses: 'Automatic closing date (optional)',
      closesHint: 'Without a date, the poll stays open until you close it.',
      cancel: 'Cancel',
      minOptions: 'You need at least 2 valid options',
      publish: 'Publish the poll',
    },
  };

  const staff = useStaff();
  const t = $derived(TEXT[getLocale()]);

  type Filter = 'open' | 'closed';
  let filter = $state<Filter>('open');
  $effect(() => {
    // Rien en cours : on montre les résultats plutôt qu'une liste vide.
    if (staff.openPolls.length === 0 && staff.polls.length > 0) filter = 'closed';
  });

  const visible = $derived(staff.polls.filter((poll) => (filter === 'open' ? !isPollClosed(poll) : isPollClosed(poll))));

  function voteWeight(v: { weight?: number }) {
    return v.weight || 1;
  }

  function results(poll: StaffPoll) {
    const votes = poll.votes ?? [];
    const total = votes.reduce((s, v) => s + voteWeight(v), 0);
    const options = poll.options.map((option) => {
      const optionVotes = votes.filter((v) => v.optionId === option.id);
      const weight = optionVotes.reduce((s, v) => s + voteWeight(v), 0);
      return { ...option, weight, voters: optionVotes.length, percent: total > 0 ? (weight / total) * 100 : 0 };
    });
    const top = Math.max(0, ...options.map((o) => o.weight));
    const mine = votes.find((v) => (v.staffMember?.userId ?? v.userId) === staff.viewer.userId);
    return { total, options, top, mine, voters: votes.length };
  }

  // ── Création ──
  let creating = $state(false);
  let title = $state('');
  let description = $state('');
  let options = $state<string[]>(['', '']);
  let closesAt = $state('');

  function openCreate() {
    title = '';
    description = '';
    options = ['', ''];
    closesAt = '';
    creating = true;
  }

  async function submit() {
    const ok = await staff.createPoll({ title, description, options, closesAt });
    if (ok) {
      creating = false;
      filter = 'open';
    }
  }

  // ── Clavier : focus à l'ouverture, Échap ferme la fenêtre ──
  const trackFocus = dialogFocus();
  $effect(() => trackFocus(creating ? 'poll' : ''));

  function onWindowKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && !event.defaultPrevented && creating) creating = false;
  }

  const canSubmit = $derived(!!title.trim() && options.filter((o) => o.trim()).length >= 2);
</script>

<svelte:window onkeydown={onWindowKeydown} />

<div class="space-y-4">
  <div class="flex flex-row items-center justify-between gap-3">
    <FilterPills
      label={t.filter}
      value={filter}
      onchange={(v) => (filter = v)}
      options={[
        { value: 'open', label: t.ongoing, count: staff.openPolls.length },
        { value: 'closed', label: t.closedFilter, count: staff.polls.length - staff.openPolls.length },
      ]}
    />
    {#if staff.canModerate}
      <Button variant="primary" icon="plus" onclick={openCreate}>{t.newPoll}</Button>
    {/if}
  </div>

  {#if visible.length === 0}
    <div class="section-card">
      <EmptyState icon="bar-chart" title={filter === 'open' ? t.noneOpen : t.noneActive} description={t.emptyDesc} actionLabel={t.emptyAction} onAction={openCreate} />
    </div>
  {:else}
    <div class="grid grid-cols-2 gap-4">
      {#each visible as poll (poll.id)}
        {@const closed = isPollClosed(poll)}
        {@const r = results(poll)}
        {@const reveal = closed || !!r.mine}
        <article class="section-card flex flex-col p-5">
          <header class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="flex items-center gap-2 text-xs text-on-surface-variant">
                {#if closed}
                  <span class="badge badge-neutral">{t.closedBadge}</span>
                {:else}
                  <span class="badge badge-success"><span class="h-1.5 w-1.5 rounded-full bg-success"></span>{t.ongoing}</span>
                {/if}
                <span class="truncate">{t.by(poll.author?.displayName || poll.author?.username || '')}</span>
              </div>
              <h3 class="mt-2 text-base font-semibold leading-snug text-on-surface">{poll.title}</h3>
              {#if poll.description}
                <p class="mt-1 text-sm text-on-surface-variant">{poll.description}</p>
              {/if}
            </div>
            {#if !closed && staff.canManageSettings}
              <Button variant="ghost" size="sm" icon="lock" title={t.closeNow} aria-label={t.closeNow} onclick={() => staff.closePoll(poll.id)} />
            {/if}
          </header>

          <div class="mt-4 space-y-2" role="group" aria-label={poll.title}>
            {#each r.options as option (option.id)}
              {@const isMine = r.mine?.optionId === option.id}
              {@const isTop = reveal && option.weight > 0 && option.weight === r.top}
              <button
                type="button"
                class="poll-option"
                class:poll-option--mine={isMine}
                class:poll-option--revealed={reveal}
                disabled={closed || !!r.mine}
                onclick={() => staff.vote(poll.id, option.id)}
                style="--fill: {reveal ? option.percent : 0}%"
              >
                <span class="relative flex min-w-0 items-center gap-2">
                  {#if isMine}<Papicon icon="check-circle" size={14} class="shrink-0 text-primary" />{/if}
                  <span class="truncate text-sm {isTop ? 'font-semibold text-on-surface' : 'text-on-surface'}">{option.text}</span>
                </span>
                {#if reveal}
                  <span class="relative shrink-0 text-xs tabular-nums text-on-surface-variant">{Math.round(option.percent)} %</span>
                {/if}
              </button>
            {/each}
          </div>

          <footer class="mt-4 flex items-center justify-between gap-3 border-t border-outline-variant pt-3 text-xs text-on-surface-variant">
            <span>{t.voters(r.voters, r.total.toFixed(1).replace(/\.0$/, ''))}</span>
            {#if !closed && poll.closesAt}
              <span class="inline-flex items-center gap-1" title={formatDate(poll.closesAt)}><Papicon icon="clock" size={12} />{t.ends(formatRelative(poll.closesAt))}</span>
            {:else if !closed && !r.mine}
              <span class="text-primary">{t.voteToSee}</span>
            {/if}
          </footer>
        </article>
      {/each}
    </div>
  {/if}
</div>

<Modal open={creating} onClose={() => (creating = false)} title={t.newPoll} subtitle={t.modalSub}>
  <div class="space-y-4 p-5">
    <Field label={t.fieldTitle} required>
      {#snippet children(id)}
        <input {id} class="input" type="text" placeholder={t.phTitle} bind:value={title} />
      {/snippet}
    </Field>
    <Field label={t.fieldDesc}>
      {#snippet children(id)}
        <textarea {id} class="input resize-none" rows="2" placeholder={t.phDesc} bind:value={description}></textarea>
      {/snippet}
    </Field>
    <fieldset class="space-y-2">
      <legend class="field-label">{t.fieldOptions}</legend>
      {#each options as _option, i (i)}
        <div class="flex items-center gap-2">
          <input class="input" aria-label={t.option(i + 1)} placeholder={t.option(i + 1)} bind:value={options[i]} />
          {#if options.length > 2}
            <Button variant="ghost" size="sm" icon="x" aria-label={t.removeOption(i + 1)} onclick={() => (options = options.filter((_, j) => j !== i))} />
          {/if}
        </div>
      {/each}
      <Button variant="ghost" size="sm" icon="plus" onclick={() => (options = [...options, ''])}>{t.addOption}</Button>
    </fieldset>
    <Field label={t.fieldCloses} hint={t.closesHint}>
      {#snippet children(id, describedBy)}
        <input {id} aria-describedby={describedBy} class="input" type="datetime-local" bind:value={closesAt} />
      {/snippet}
    </Field>
  </div>
  {#snippet footer()}
    <div class="flex justify-end gap-2">
      <Button variant="ghost" onclick={() => (creating = false)}>{t.cancel}</Button>
      <Button variant="primary" icon="check-square" disabled={!canSubmit} disabledReason={t.minOptions} onexplain={(reason) => staff.toast('warning', reason)} onclick={submit}>{t.publish}</Button>
    </div>
  {/snippet}
</Modal>

<style>
  .poll-option {
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    overflow: hidden;
    padding: 0.5625rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid var(--outline-variant);
    background: var(--surface-container-lowest);
    text-align: left;
    transition: border-color 0.15s ease, background-color 0.15s ease;
  }
  .poll-option::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: var(--fill);
    background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .poll-option:not(:disabled):hover {
    border-color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 4%, transparent);
  }
  .poll-option:disabled {
    cursor: default;
  }
  .poll-option--mine {
    border-color: color-mix(in srgb, var(--primary-color) 50%, transparent);
  }
</style>
