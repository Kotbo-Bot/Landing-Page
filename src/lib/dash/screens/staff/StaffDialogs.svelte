<!--
  Fenêtres de la gestion du staff : ajouter, avertir, mettre en liste noire,
  rattacher à des pôles, régler les sanctions automatiques. Recopie de
  `lib/components/staff/StaffDialogs.svelte` (dashboard).
-->
<script lang="ts">
  import { getLocale } from '$lib/i18n/state.svelte';
  import { Button, Callout, Field, Modal, Papicon, ToggleSwitch } from '$lib/dash/ui';
  import type { StaffMember } from '$lib/dash/types';
  import StaffAvatar from './StaffAvatar.svelte';
  import HierarchyIcon from './HierarchyIcon.svelte';
  import WarnMeter from './WarnMeter.svelte';
  import MemberLookup, { type LookupOption } from './MemberLookup.svelte';
  import { useStaff, staffName } from './staffStore.svelte';
  import { dialogFocus } from './dialogFocus';

  const TEXT = {
    fr: {
      change: 'Changer',
      addMember: 'Ajouter un membre',
      addMemberSub: 'Il reçoit son grade et, si tu veux, une période de tutorat.',
      discordUser: 'Utilisateur Discord',
      mentionOrId: '@mention, pseudo ou ID Discord',
      globalGrade: 'Grade global',
      gradeDetected: "Choisi d'après ses rôles Discord.",
      gradeHint: 'Le grade le plus bas est proposé par défaut.',
      createTutoring: 'Créer un tutorat',
      tutoringHint: "Un tuteur l'accompagne pendant ses premières semaines.",
      cancel: 'Annuler',
      needRole: "Crée d'abord un grade dans l'onglet Rôles du staff",
      selectMember: 'Sélectionne un membre Discord ou saisis un ID valide.',
      addToStaff: 'Ajouter au staff',
      newWarning: 'Nouvel avertissement',
      warnDesc: 'Donne un avertissement à un membre du staff en cas de manquement aux règles.',
      targetMember: 'Membre visé',
      searchStaff: 'Chercher un membre du staff…',
      afterThis: 'Après cet avertissement',
      thresholdTitle: 'Seuil atteint',
      thresholdAuto: 'Le seuil de rétrogradation sera atteint : Kotbo rétrogradera ce membre aussitôt.',
      thresholdValidation: 'Le seuil de rétrogradation sera atteint : une demande de validation partira à la direction.',
      warnReason: "Raison de l'avertissement",
      reasonRequired: 'Écris la raison, elle apparaîtra dans son historique',
      phWarnReason: 'Décris précisément le manquement constaté…',
      expiresAt: 'Expire le',
      expiresHint: "Laisse vide pour qu'il reste actif jusqu'à suppression.",
      issueWarning: 'Avertir',
      blacklist: 'Mettre en liste noire',
      blacklistDesc: "Coupe net tout accès d'un utilisateur à l'équipe staff.",
      blacklistTarget: 'Membre à mettre en liste noire',
      blacklistReason: "Raison de l'exclusion",
      phBlacklistReason: "Explique ce qui s'est passé…",
      blacklistEnd: 'Fin (vide = définitive)',
      blacklistEndHintPerma: 'Laisse vide : la liste noire est définitive par défaut.',
      blacklistEndHint: 'Laisse vide pour une durée illimitée.',
      blacklistEffectTitle: 'Ce membre quitte le staff',
      blacklistEffect: "Il perd son grade et ses rôles staff, et ne pourra pas être réintégré tant que l'entrée existe.",
      applyBlacklist: 'Ajouter à la liste noire',
      hierarchiesOf: (name: string) => `Hiérarchies de ${name}`,
      gradesSub: 'Un membre peut appartenir à plusieurs hiérarchies, avec un grade dans chacune.',
      currentGrades: 'Grades actuels',
      remove: 'Retirer',
      noSecondary: "Ce membre n'appartient à aucune hiérarchie secondaire.",
      associate: 'Associer une nouvelle hiérarchie',
      hierarchy: 'Hiérarchie',
      chooseHierarchy: '-- Choisir une hiérarchie --',
      alreadyLinked: ' (déjà lié)',
      grade: 'Grade',
      chooseGrade: '-- Choisir un grade --',
      close: 'Fermer',
      pickHierarchyGrade: 'Choisis une hiérarchie et un grade',
      add: 'Ajouter',
      configTitle: 'Automatisation et Sanctions',
      configDesc: 'Configure les comportements automatiques quand des seuils critiques sont atteints.',
      executionMode: "Mode d'exécution",
      thresholdsDesc: "Règles d'action selon l'accumulation d'avertissements",
      modeApproval: 'Approbation',
      modeValidationDesc: 'Kotbo prévient la direction, qui confirme la sanction.',
      modeAuto: 'Automatique',
      modeAutoDesc: 'Kotbo rétrograde ou met en liste noire dès que le seuil est atteint.',
      warnThresholds: "Seuils d'avertissements",
      demotion: 'Démotion',
      demoteHint: 'Avertissements actifs avant de perdre un grade.',
      warnUnit: 'avertissement(s)',
      blacklistThreshold: 'Liste noire',
      blacklistThresholdHint: 'Avertissements actifs avant la liste noire.',
      removeRoles: 'Retirer les rôles (démotion)',
      removeRolesDesc: "Supprime l'intégralité des rôles staff",
      permaBlacklist: 'Liste noire définitive',
      permaBlacklistDesc: "L'utilisateur est banni du staff par défaut",
      saving: 'Sauvegarde…',
      autosaved: 'Chaque changement est enregistré aussitôt.',
    },
    en: {
      change: 'Change',
      addMember: 'Add a member',
      addMemberSub: 'They get their grade and, if you want, a tutoring period.',
      discordUser: 'Discord User',
      mentionOrId: '@mention, username or Discord ID',
      globalGrade: 'Global Grade',
      gradeDetected: 'Picked from their Discord roles.',
      gradeHint: 'The lowest grade is suggested by default.',
      createTutoring: 'Create a tutoring track',
      tutoringHint: 'A tutor guides them through their first weeks.',
      cancel: 'Cancel',
      needRole: 'Create a grade first in the Staff roles tab',
      selectMember: 'Select a Discord member or enter a valid ID.',
      addToStaff: 'Add to staff',
      newWarning: 'New warning',
      warnDesc: 'Issue a warning to staff for a rule violation.',
      targetMember: 'Target member',
      searchStaff: 'Search a staff member...',
      afterThis: 'After this warning',
      thresholdTitle: 'Threshold reached',
      thresholdAuto: 'The demotion threshold will be reached: Kotbo will demote this member right away.',
      thresholdValidation: 'The demotion threshold will be reached: an approval request will go to management.',
      warnReason: 'Reason for the warning',
      reasonRequired: 'Write the reason, it will show in their history',
      phWarnReason: 'Precisely describe the observed violation...',
      expiresAt: 'Expires on',
      expiresHint: 'Leave empty to keep it active until deleted.',
      issueWarning: 'Issue warning',
      blacklist: 'Add to blocklist',
      blacklistDesc: "Instantly cut off a user's access to the Staff team.",
      blacklistTarget: 'Member to add to the blocklist',
      blacklistReason: 'Reason for exclusion',
      phBlacklistReason: 'Explain what happened…',
      blacklistEnd: 'End (empty = permanent)',
      blacklistEndHintPerma: 'Leave empty: blacklisting is permanent by default.',
      blacklistEndHint: 'Leave empty for no end date.',
      blacklistEffectTitle: 'This member leaves the staff',
      blacklistEffect: 'They lose their grade and staff roles, and cannot be re-added while the entry exists.',
      applyBlacklist: 'Add to blocklist',
      hierarchiesOf: (name: string) => `Hierarchies of ${name}`,
      gradesSub: 'A member can belong to several hierarchies, with a grade in each.',
      currentGrades: 'Current Grades',
      remove: 'Remove',
      noSecondary: 'This member does not belong to any secondary hierarchy.',
      associate: 'Associate a new hierarchy',
      hierarchy: 'Hierarchy',
      chooseHierarchy: '-- Choose a hierarchy --',
      alreadyLinked: ' (already linked)',
      grade: 'Grade',
      chooseGrade: '-- Choose a grade --',
      close: 'Close',
      pickHierarchyGrade: 'Pick a hierarchy and a grade',
      add: 'Add',
      configTitle: 'Automation & Sanctions',
      configDesc: 'Configure automatic behaviors when critical thresholds are reached.',
      executionMode: 'Execution mode',
      thresholdsDesc: 'Action rules based on warning accumulation',
      modeApproval: 'Approval',
      modeValidationDesc: 'Kotbo alerts management, who confirms the sanction.',
      modeAuto: 'Automatic',
      modeAutoDesc: 'Kotbo demotes or blacklists as soon as the threshold is reached.',
      warnThresholds: 'Warning thresholds',
      demotion: 'Demotion',
      demoteHint: 'Active warnings before losing a grade.',
      warnUnit: 'Warn(s)',
      blacklistThreshold: 'Blocklist',
      blacklistThresholdHint: 'Active warnings before blacklisting.',
      removeRoles: 'Remove roles (Demotion)',
      removeRolesDesc: 'Removes all staff roles',
      permaBlacklist: 'Permanent blocklist',
      permaBlacklistDesc: 'The user is banned from staff by default',
      saving: 'Saving...',
      autosaved: 'Every change is saved right away.',
    },
  };

  const staff = useStaff();
  const t = $derived(TEXT[getLocale()]);
  const explain = (reason: string) => staff.toast('warning', reason);

  // ── Clavier : focus à l'ouverture, Échap ferme la fenêtre ──
  const dialogKey = $derived(
    staff.dialogs.addMember ? 'add'
    : staff.dialogs.warn ? `warn:${staff.dialogs.warn.userId}`
    : staff.dialogs.blacklist ? `blacklist:${staff.dialogs.blacklist.userId}`
    : staff.dialogs.grades ? 'grades'
    : staff.dialogs.settings ? 'settings'
    : '',
  );
  const trackFocus = dialogFocus();
  $effect(() => trackFocus(dialogKey));

  function onWindowKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || event.defaultPrevented || staff.confirmRequest || !dialogKey) return;
    staff.dialogs = { addMember: false, warn: null, blacklist: null, grades: null, settings: false };
  }

  const asOption = (m: { userId: string; username?: string | null; displayName?: string | null; avatarUrl?: string | null }): LookupOption => ({
    id: m.userId,
    username: m.username ?? m.userId,
    displayName: m.displayName,
    avatarUrl: m.avatarUrl,
  });

  // ── Ajouter un membre ──
  let addQuery = $state('');
  let addUserId = $state('');
  let addGrade = $state('');
  let addTutoring = $state(true);

  $effect(() => {
    if (staff.dialogs.addMember) {
      addQuery = '';
      addUserId = '';
      addTutoring = true;
      addGrade = staff.orderedRoles.at(-1)?.name ?? '';
    }
  });

  async function submitAdd() {
    const who = staff.candidates.find((c) => c.userId === addUserId);
    const ok = await staff.addMember({ userId: addUserId, grade: addGrade, username: who?.username ?? '', avatarUrl: who?.avatarUrl ?? '', createTestingPeriod: addTutoring });
    if (ok) staff.dialogs.addMember = false;
  }

  // ── Avertir ──
  let warnQuery = $state('');
  let warnUserId = $state('');
  let warnReason = $state('');
  let warnExpires = $state('');
  let warnTouched = $state(false);
  const warnPreset = $derived(staff.dialogs.warn?.userId ? staff.memberByUserId(staff.dialogs.warn.userId) : undefined);
  const warnTarget = $derived(warnPreset ?? (warnUserId ? staff.memberByUserId(warnUserId) : undefined));

  $effect(() => {
    if (staff.dialogs.warn) {
      warnQuery = '';
      warnUserId = staff.dialogs.warn.userId;
      warnReason = '';
      warnExpires = '';
      warnTouched = false;
    }
  });

  async function submitWarn() {
    warnTouched = true;
    if (!warnUserId || !warnReason.trim()) return;
    const ok = await staff.issueWarning({ staffUserId: warnUserId, reason: warnReason, expiresAt: warnExpires });
    if (ok) staff.dialogs.warn = null;
  }

  // ── Liste noire ──
  let blQuery = $state('');
  let blUserId = $state('');
  let blReason = $state('');
  let blEnd = $state('');
  let blTouched = $state(false);
  const blPreset = $derived(staff.dialogs.blacklist?.userId ? staff.memberByUserId(staff.dialogs.blacklist.userId) : undefined);

  $effect(() => {
    if (staff.dialogs.blacklist) {
      blQuery = '';
      blUserId = staff.dialogs.blacklist.userId;
      blReason = '';
      blEnd = '';
      blTouched = false;
    }
  });

  async function submitBlacklist() {
    blTouched = true;
    if (!blUserId || !blReason.trim()) return;
    const ok = await staff.blacklist({ staffUserId: blUserId, reason: blReason, endDate: blEnd });
    if (ok) staff.dialogs.blacklist = null;
  }

  // ── Pôles d'un membre ──
  const gradesMember = $derived(staff.dialogs.grades ? staff.memberByUserId(staff.dialogs.grades) : undefined);
  let gHierarchyId = $state('');
  let gGrade = $state('');
  let lastGradesUser = '';

  $effect(() => {
    const target = gradesMember;
    if (!target) {
      lastGradesUser = '';
      return;
    }
    if (target.userId === lastGradesUser) return;
    lastGradesUser = target.userId;
    const draft = staff.resolveMemberHierarchyDraft(target);
    gHierarchyId = draft?.hierarchyId ?? '';
    gGrade = draft?.grade ?? '';
  });

  function pickHierarchy(id: string) {
    gHierarchyId = id;
    if (!id || !gradesMember) {
      gGrade = '';
      return;
    }
    const existing = gradesMember.hierarchyGrades?.find((entry) => entry.hierarchyId === id)?.grade;
    gGrade = existing || staff.rolesInHierarchy(id)[0]?.name || '';
  }

  async function submitGrade() {
    if (!gradesMember || !gHierarchyId || !gGrade) return;
    await staff.addHierarchyGrade(gradesMember.userId, gHierarchyId, gGrade);
  }
</script>

<svelte:window onkeydown={onWindowKeydown} />

{#snippet presetMember(member: StaffMember, onChange: () => void)}
  <div class="flex items-center gap-3 rounded-lg border border-outline-variant bg-surface-container px-3 py-2.5">
    <StaffAvatar url={member.avatarUrl} name={staffName(member)} userId={member.userId} size={32} />
    <span class="min-w-0 flex-1">
      <span class="block truncate text-sm font-medium text-on-surface">{staffName(member)}</span>
      <span class="block truncate text-xs text-on-surface-variant">{member.grade}</span>
    </span>
    <Button variant="ghost" size="sm" onclick={onChange}>{t.change}</Button>
  </div>
{/snippet}

<!-- Ajouter un membre -->
<Modal aboveCase open={staff.dialogs.addMember} onClose={() => (staff.dialogs.addMember = false)} title={t.addMember} subtitle={t.addMemberSub}>
  <div class="space-y-4 p-5">
    <Field label={t.discordUser} required>
      {#snippet children(id)}
        <MemberLookup {id} options={staff.candidates.map(asOption)} bind:query={addQuery} bind:selectedId={addUserId} placeholder={t.mentionOrId} />
      {/snippet}
    </Field>
    <Field label={t.globalGrade} hint={t.gradeHint}>
      {#snippet children(id, describedBy)}
        <select {id} aria-describedby={describedBy} class="input" bind:value={addGrade}>
          {#each staff.orderedRoles as role (role.id)}
            <option value={role.name}>{role.name}</option>
          {/each}
        </select>
      {/snippet}
    </Field>
    <div class="flex items-start justify-between gap-4 rounded-lg border border-outline-variant px-4 py-3">
      <span>
        <span class="block text-sm font-medium text-on-surface">{t.createTutoring}</span>
        <span class="block text-xs text-on-surface-variant">{t.tutoringHint}</span>
      </span>
      <ToggleSwitch checked={addTutoring} ariaLabel={t.createTutoring} onToggle={(v: boolean) => (addTutoring = v)} />
    </div>
  </div>
  {#snippet footer()}
    <div class="flex justify-end gap-2">
      <Button variant="ghost" onclick={() => (staff.dialogs.addMember = false)}>{t.cancel}</Button>
      <Button
        variant="primary"
        icon="plus"
        disabled={!addUserId || !addGrade}
        disabledReason={!addGrade ? t.needRole : t.selectMember}
        onexplain={explain}
        onclick={submitAdd}>{t.addToStaff}</Button
      >
    </div>
  {/snippet}
</Modal>

<!-- Avertir -->
<Modal aboveCase open={!!staff.dialogs.warn} onClose={() => (staff.dialogs.warn = null)} title={t.newWarning} subtitle={t.warnDesc}>
  <div class="space-y-4 p-5">
    {#if warnPreset}
      {@render presetMember(warnPreset, () => (staff.dialogs.warn = { userId: '' }))}
    {:else}
      <Field label={t.targetMember} required error={warnTouched && !warnUserId ? t.selectMember : ''}>
        {#snippet children(id)}
          <MemberLookup {id} options={staff.activeMembers.map(asOption)} bind:query={warnQuery} bind:selectedId={warnUserId} placeholder={t.searchStaff} />
        {/snippet}
      </Field>
    {/if}

    {#if warnTarget}
      {@const next = (warnTarget.warnings?.length ?? 0) + 1}
      <div class="flex items-center justify-between gap-3 rounded-lg bg-surface-container px-3 py-2.5">
        <span class="text-xs text-on-surface-variant">{t.afterThis}</span>
        <WarnMeter count={next} threshold={staff.config.warnsToDemote || 3} />
      </div>
      {#if next >= staff.config.warnsToDemote && staff.config.warnsToDemote > 0}
        <Callout variant="warning" title={t.thresholdTitle}>
          {staff.config.actionMode === 'auto' ? t.thresholdAuto : t.thresholdValidation}
        </Callout>
      {/if}
    {/if}

    <Field label={t.warnReason} required error={warnTouched && !warnReason.trim() ? t.reasonRequired : ''}>
      {#snippet children(id, describedBy)}
        <textarea {id} aria-describedby={describedBy} class="input resize-none" rows="3" placeholder={t.phWarnReason} bind:value={warnReason}></textarea>
      {/snippet}
    </Field>
    <Field label={t.expiresAt} hint={t.expiresHint}>
      {#snippet children(id, describedBy)}
        <input {id} aria-describedby={describedBy} class="input" type="datetime-local" bind:value={warnExpires} />
      {/snippet}
    </Field>
  </div>
  {#snippet footer()}
    <div class="flex justify-end gap-2">
      <Button variant="ghost" onclick={() => (staff.dialogs.warn = null)}>{t.cancel}</Button>
      <Button variant="primary" icon="alert-triangle" onclick={submitWarn}>{t.issueWarning}</Button>
    </div>
  {/snippet}
</Modal>

<!-- Liste noire -->
<Modal aboveCase open={!!staff.dialogs.blacklist} onClose={() => (staff.dialogs.blacklist = null)} title={t.blacklist} subtitle={t.blacklistDesc}>
  <div class="space-y-4 p-5">
    {#if blPreset}
      {@render presetMember(blPreset, () => (staff.dialogs.blacklist = { userId: '' }))}
    {:else}
      <Field label={t.blacklistTarget} required error={blTouched && !blUserId ? t.selectMember : ''}>
        {#snippet children(id)}
          <MemberLookup {id} options={[...staff.activeMembers.map(asOption), ...staff.candidates.map(asOption)]} bind:query={blQuery} bind:selectedId={blUserId} placeholder={t.mentionOrId} />
        {/snippet}
      </Field>
    {/if}
    <Field label={t.blacklistReason} required error={blTouched && !blReason.trim() ? t.reasonRequired : ''}>
      {#snippet children(id, describedBy)}
        <textarea {id} aria-describedby={describedBy} class="input resize-none" rows="3" placeholder={t.phBlacklistReason} bind:value={blReason}></textarea>
      {/snippet}
    </Field>
    <Field label={t.blacklistEnd} hint={staff.config.blacklistPermanentByDefault ? t.blacklistEndHintPerma : t.blacklistEndHint}>
      {#snippet children(id, describedBy)}
        <input {id} aria-describedby={describedBy} class="input" type="date" bind:value={blEnd} />
      {/snippet}
    </Field>
    {#if blPreset}
      <Callout variant="danger" title={t.blacklistEffectTitle}>{t.blacklistEffect}</Callout>
    {/if}
  </div>
  {#snippet footer()}
    <div class="flex justify-end gap-2">
      <Button variant="ghost" onclick={() => (staff.dialogs.blacklist = null)}>{t.cancel}</Button>
      <Button variant="danger" icon="slash" onclick={submitBlacklist}>{t.applyBlacklist}</Button>
    </div>
  {/snippet}
</Modal>

<!-- Pôles d'un membre -->
<Modal aboveCase open={!!gradesMember} onClose={() => (staff.dialogs.grades = null)} title={gradesMember ? t.hierarchiesOf(staffName(gradesMember)) : ''} subtitle={t.gradesSub}>
  {#if gradesMember}
    <div class="space-y-5 p-5">
      <div>
        <p class="field-label">{t.currentGrades}</p>
        {#if gradesMember.hierarchyGrades?.length}
          <ul class="divide-y divide-outline-variant rounded-lg border border-outline-variant">
            {#each gradesMember.hierarchyGrades as grade (grade.id)}
              {@const hierarchy = staff.hierarchyById(grade.hierarchyId)}
              <li class="flex items-center gap-3 px-3 py-2.5">
                <HierarchyIcon icon={hierarchy?.icon} color={hierarchy?.color} size={28} />
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-sm font-medium text-on-surface">{hierarchy?.name ?? ''}</span>
                  <span class="block truncate text-xs text-on-surface-variant">{grade.grade}</span>
                </span>
                <Button variant="ghost" size="sm" icon="x" aria-label="{t.remove} {hierarchy?.name ?? ''}" onclick={() => staff.removeHierarchyGrade(gradesMember.userId, grade.hierarchyId)} />
              </li>
            {/each}
          </ul>
        {:else}
          <p class="rounded-lg border border-dashed border-outline-variant px-3 py-3 text-sm text-on-surface-variant">{t.noSecondary}</p>
        {/if}
      </div>

      <div class="space-y-3 border-t border-outline-variant pt-5">
        <p class="text-sm font-medium text-on-surface">{t.associate}</p>
        <div class="grid grid-cols-2 gap-3">
          <Field label={t.hierarchy}>
            {#snippet children(id)}
              <select {id} class="input" value={gHierarchyId} onchange={(e) => pickHierarchy((e.currentTarget as HTMLSelectElement).value)}>
                <option value="">{t.chooseHierarchy}</option>
                {#each staff.orderedHierarchies as h (h.id)}
                  <option value={h.id}>{h.name}{gradesMember.hierarchyGrades?.some((hg) => hg.hierarchyId === h.id) ? t.alreadyLinked : ''}</option>
                {/each}
              </select>
            {/snippet}
          </Field>
          <Field label={t.grade}>
            {#snippet children(id)}
              <select {id} class="input" bind:value={gGrade} disabled={!gHierarchyId}>
                <option value="">{t.chooseGrade}</option>
                {#each staff.rolesInHierarchy(gHierarchyId || null) as r (r.id)}
                  <option value={r.name}>{r.name}</option>
                {/each}
              </select>
            {/snippet}
          </Field>
        </div>
      </div>
    </div>
  {/if}
  {#snippet footer()}
    <div class="flex justify-end gap-2">
      <Button variant="ghost" onclick={() => (staff.dialogs.grades = null)}>{t.close}</Button>
      <Button variant="primary" icon="plus" disabled={!gHierarchyId || !gGrade} disabledReason={t.pickHierarchyGrade} onexplain={explain} onclick={submitGrade}>{t.add}</Button>
    </div>
  {/snippet}
</Modal>

<!-- Réglages : sanctions automatiques -->
<Modal aboveCase open={staff.dialogs.settings} onClose={() => (staff.dialogs.settings = false)} title={t.configTitle} subtitle={t.configDesc} size="lg">
  <div class="space-y-6 p-5">
    <section class="space-y-3">
      <div>
        <h4 class="text-sm font-semibold text-on-surface">{t.executionMode}</h4>
        <p class="text-xs text-on-surface-variant">{t.thresholdsDesc}</p>
      </div>
      <div class="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t.executionMode}>
        {#each [
          { value: 'validation' as const, icon: 'user-check', label: t.modeApproval, desc: t.modeValidationDesc },
          { value: 'auto' as const, icon: 'zap', label: t.modeAuto, desc: t.modeAutoDesc },
        ] as option (option.value)}
          {@const selected = staff.config.actionMode === option.value}
          <button type="button" role="radio" aria-checked={selected} class="mode-option" class:mode-option--on={selected} onclick={() => staff.saveConfig({ actionMode: option.value })}>
            <span class="mode-option__icon"><Papicon icon={option.icon} size={16} /></span>
            <span class="min-w-0 text-left">
              <span class="block text-sm font-medium text-on-surface">{option.label}</span>
              <span class="block text-xs text-on-surface-variant">{option.desc}</span>
            </span>
          </button>
        {/each}
      </div>
    </section>

    <section class="space-y-3">
      <h4 class="text-sm font-semibold text-on-surface">{t.warnThresholds}</h4>
      <div class="grid grid-cols-2 gap-3">
        <Field label={t.demotion} hint={t.demoteHint}>
          {#snippet children(id, describedBy)}
            <div class="flex items-center gap-2">
              <input {id} aria-describedby={describedBy} class="input w-24 tabular-nums" type="number" min="0" value={staff.config.warnsToDemote} onchange={(e) => staff.saveConfig({ warnsToDemote: Number((e.currentTarget as HTMLInputElement).value) })} />
              <span class="text-sm text-on-surface-variant">{t.warnUnit}</span>
            </div>
          {/snippet}
        </Field>
        <Field label={t.blacklistThreshold} hint={t.blacklistThresholdHint}>
          {#snippet children(id, describedBy)}
            <div class="flex items-center gap-2">
              <input {id} aria-describedby={describedBy} class="input w-24 tabular-nums" type="number" min="0" value={staff.config.warnsToBlacklist} onchange={(e) => staff.saveConfig({ warnsToBlacklist: Number((e.currentTarget as HTMLInputElement).value) })} />
              <span class="text-sm text-on-surface-variant">{t.warnUnit}</span>
            </div>
          {/snippet}
        </Field>
      </div>
    </section>

    <section class="divide-y divide-outline-variant rounded-lg border border-outline-variant">
      <div class="flex items-center justify-between gap-4 px-4 py-3">
        <span>
          <span class="block text-sm font-medium text-on-surface">{t.removeRoles}</span>
          <span class="block text-xs text-on-surface-variant">{t.removeRolesDesc}</span>
        </span>
        <ToggleSwitch checked={staff.config.demoteRemoveAllRoles} ariaLabel={t.removeRoles} onToggle={(v: boolean) => staff.saveConfig({ demoteRemoveAllRoles: v })} />
      </div>
      <div class="flex items-center justify-between gap-4 px-4 py-3">
        <span>
          <span class="block text-sm font-medium text-on-surface">{t.permaBlacklist}</span>
          <span class="block text-xs text-on-surface-variant">{t.permaBlacklistDesc}</span>
        </span>
        <ToggleSwitch checked={staff.config.blacklistPermanentByDefault} ariaLabel={t.permaBlacklist} onToggle={(v: boolean) => staff.saveConfig({ blacklistPermanentByDefault: v })} />
      </div>
    </section>
  </div>
  {#snippet footer()}
    <div class="flex items-center justify-between gap-2">
      <span class="text-xs text-on-surface-variant" aria-live="polite">{staff.savingConfig ? t.saving : t.autosaved}</span>
      <Button variant="secondary" onclick={() => (staff.dialogs.settings = false)}>{t.close}</Button>
    </div>
  {/snippet}
</Modal>

<style>
  .mode-option {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem 0.875rem;
    border-radius: 0.625rem;
    border: 1px solid var(--outline-variant);
    background: var(--surface-container-lowest);
    transition: border-color 0.15s ease, background-color 0.15s ease;
  }
  .mode-option:hover {
    background: var(--surface-hover);
  }
  .mode-option--on {
    border-color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 6%, transparent);
  }
  .mode-option__icon {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    color: var(--on-surface-variant);
    background: var(--surface-container);
  }
  .mode-option--on .mode-option__icon {
    color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 12%, transparent);
  }
</style>
