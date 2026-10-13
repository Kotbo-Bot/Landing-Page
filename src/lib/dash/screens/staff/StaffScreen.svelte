<!--
  Écran Équipe du dashboard, recopié pour l'accueil.

  Recopie de `pages/StaffManagement.svelte` (Kotbo/apps/dashboard, branche
  `recette`) : chiffres clés, onglets de la gestion du staff, dossier membre au
  clic sur un membre (avec son onglet « Staff »). Les données sont fictives
  (`dash/fixtures/staff.ts`) et tout se passe en local : aucun appel réseau.
  Prévu pour un cadre de 1180 x 720 sans défilement.
-->
<script lang="ts">
  import { untrack } from 'svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import Dash from '$lib/dash/Dash.svelte';
  import { Tabs, Button, ModulePage, Papicon } from '$lib/dash/ui';
  import MemberCaseModal from '$lib/dash/screens/members/MemberCaseModal.svelte';
  import { StaffStore, provideStaff, type StaffTab } from './staffStore.svelte';
  import StaffDirectory from './StaffDirectory.svelte';
  import StaffRoles from './StaffRoles.svelte';
  import StaffWarnings from './StaffWarnings.svelte';
  import StaffBlacklist from './StaffBlacklist.svelte';
  import StaffPolls from './StaffPolls.svelte';
  import StaffLeadership from './StaffLeadership.svelte';
  import StaffDialogs from './StaffDialogs.svelte';
  import StaffCaseTab from './StaffCaseTab.svelte';
  import OrgChart from './OrgChart.svelte';
  import RolePermissionSettings from './RolePermissionSettings.svelte';
  import ConfirmModal from './ConfirmModal.svelte';
  import StaffToasts from './StaffToasts.svelte';
  import { dialogFocus } from './dialogFocus';

  const TEXT = {
    fr: {
      title: 'Gestion du personnel',
      desc: 'Supervise ton équipe de modération, attribue des permissions et gère les avertissements.',
      settings: 'Réglages',
      settingsTitle: 'Configuration automatisation et Sanctions',
      kpiLabel: 'Chiffres du staff',
      tabsLabel: 'Équipe',
      kpiTeam: 'Équipe',
      kpiTutors: (n: number) => `Tuteurs : ${n}`,
      kpiSuspended: (n: number) => `Suspendus : ${n}`,
      kpiAllActive: 'Tout le monde est actif',
      kpiWarnings: 'Avertissements actifs',
      kpiNear: (n: number) => `Proches du seuil : ${n}`,
      kpiNoRisk: 'Personne près du seuil',
      kpiActivity: "Baisse d'activité",
      kpiInDecline: 'à surveiller cette semaine',
      kpiSteady: 'Équipe régulière',
      kpiPolls: 'Sondages en cours',
      kpiToVote: (n: number) => `En attente de ton vote : ${n}`,
      kpiUpToDate: 'Tu as tout voté',
      tabs: {
        members: 'Membres',
        roles: 'Rôles du staff',
        organigramme: 'Organigramme',
        warnings: 'Avertissements',
        blacklist: 'Liste noire',
        polls: 'Sondages',
        leadership: 'Leadership',
        permissions: 'Permissions',
      },
      permsDesc: 'Choisis qui peut consulter et administrer les différentes sections de la gestion du personnel.',
      permsDirectoryTitle: 'Annuaire staff',
      permsDirectoryDesc: "Contrôle l'accès à la liste des membres du personnel.",
      permsRolesTitle: 'Hiérarchie et rôles',
      permsRolesDesc: "Contrôle l'accès à la gestion des rôles et de la hiérarchie staff.",
      caseTab: 'Staff',
    },
    en: {
      title: 'Staff Management',
      desc: 'Oversee your moderation team, assign permissions and manage warnings.',
      settings: 'Settings',
      settingsTitle: 'Automation & Sanctions Configuration',
      kpiLabel: 'Staff figures',
      tabsLabel: 'Team',
      kpiTeam: 'Team',
      kpiTutors: (n: number) => `Tutors: ${n}`,
      kpiSuspended: (n: number) => `Suspended: ${n}`,
      kpiAllActive: 'Everyone is active',
      kpiWarnings: 'Active warnings',
      kpiNear: (n: number) => `Near the threshold: ${n}`,
      kpiNoRisk: 'Nobody near the threshold',
      kpiActivity: 'Activity drop',
      kpiInDecline: 'to watch this week',
      kpiSteady: 'Steady team',
      kpiPolls: 'Open polls',
      kpiToVote: (n: number) => `Awaiting your vote: ${n}`,
      kpiUpToDate: "You're all caught up",
      tabs: {
        members: 'Members',
        roles: 'Staff roles',
        organigramme: 'Org chart',
        warnings: 'Warnings',
        blacklist: 'Blocklist',
        polls: 'Polls',
        leadership: 'Leadership',
        permissions: 'Permissions',
      },
      permsDesc: 'Manage who can view and administer the different sections of staff management.',
      permsDirectoryTitle: 'Staff Directory',
      permsDirectoryDesc: 'Controls access to the staff member list.',
      permsRolesTitle: 'Hierarchy & Roles',
      permsRolesDesc: 'Controls access to role and staff hierarchy management.',
      caseTab: 'Staff',
    },
  };

  const TAB_ICONS: Record<StaffTab, string> = {
    members: 'users',
    roles: 'shield',
    organigramme: 'git-branch',
    warnings: 'alert-circle',
    blacklist: 'user-x',
    polls: 'bar-chart',
    leadership: 'crown',
    permissions: 'lock',
  };

  const { initialTab = 'members', class: className = '' }: { initialTab?: StaffTab; class?: string } = $props();

  const t = $derived(TEXT[getLocale()]);

  const staff = provideStaff(new StaffStore(getLocale()));
  // La langue change après l'hydratation : on repart des données dans la bonne langue.
  $effect(() => {
    const locale = getLocale();
    untrack(() => {
      if (staff.locale !== locale) staff.reset(locale);
    });
  });

  let activeTab = $state<StaffTab>(untrack(() => initialTab));

  function switchTab(tab: StaffTab) {
    activeTab = tab;
  }

  // ── Compteurs ──
  const myOpenVotes = $derived(
    staff.openPolls.filter((poll) => !(poll.votes ?? []).some((v) => (v.staffMember?.userId ?? v.userId) === staff.viewer.userId)).length,
  );
  const suspendedCount = $derived(staff.activeMembers.filter((s) => !!s.suspendedAt).length);
  const tutorCount = $derived(staff.activeMembers.filter((s) => s.isTutor).length);
  const nearThreshold = $derived(
    staff.activeMembers.filter((s) => (s.warnings?.length ?? 0) > 0 && (s.warnings?.length ?? 0) >= (staff.config.warnsToDemote || 3) - 1).length,
  );

  type Stat = { id: StaffTab; label: string; icon: string; value: string; note: string; tone: string };
  const stats = $derived<Stat[]>([
    {
      id: 'members',
      label: t.kpiTeam,
      icon: 'users',
      value: String(staff.activeMembers.length),
      note: [tutorCount ? t.kpiTutors(tutorCount) : '', suspendedCount ? t.kpiSuspended(suspendedCount) : ''].filter(Boolean).join(' · ') || t.kpiAllActive,
      tone: '',
    },
    {
      id: 'warnings',
      label: t.kpiWarnings,
      icon: 'alert-triangle',
      value: String(staff.activeWarningCount),
      note: nearThreshold ? t.kpiNear(nearThreshold) : t.kpiNoRisk,
      tone: nearThreshold ? 'text-warning' : '',
    },
    {
      id: 'leadership',
      label: t.kpiActivity,
      icon: 'activity',
      value: staff.inactiveCount ? String(staff.inactiveCount) : '0',
      note: staff.inactiveCount ? t.kpiInDecline : t.kpiSteady,
      tone: staff.inactiveCount ? 'text-warning' : '',
    },
    {
      id: 'polls',
      label: t.kpiPolls,
      icon: 'bar-chart',
      value: String(staff.openPolls.length),
      note: myOpenVotes ? t.kpiToVote(myOpenVotes) : t.kpiUpToDate,
      tone: '',
    },
  ]);

  const tabBadges = $derived<Partial<Record<StaffTab, number>>>({
    members: staff.activeMembers.length,
    warnings: staff.activeWarningCount,
    blacklist: staff.blacklistedMembers.length,
    polls: myOpenVotes,
  });

  const tabs = $derived(
    (Object.keys(TAB_ICONS) as StaffTab[]).map((id) => {
      const badge = tabBadges[id];
      const tab = { id, label: t.tabs[id], icon: TAB_ICONS[id] };
      return badge ? { ...tab, badge } : tab;
    }),
  );

  // ── Tenir dans le cadre ──
  // Les fixtures tiennent à l'échelle 1. Si le visiteur ajoute assez de lignes
  // (grades, sondages…) pour déborder, l'onglet se réduit au lieu d'être coupé.
  let frame = $state<HTMLDivElement | null>(null);
  let panel = $state<HTMLDivElement | null>(null);
  let panelZoom = $state(1);

  $effect(() => {
    if (!frame || !panel) return;
    const measure = () => {
      if (!frame || !panel) return;
      const frameRect = frame.getBoundingClientRect();
      // Le parent peut réduire tout l'écran (transform) : on revient en pixels de mise en page.
      const outer = frame.offsetHeight ? frameRect.height / frame.offsetHeight : 1;
      if (!outer) return;
      const top = (panel.getBoundingClientRect().top - frameRect.top) / outer;
      const available = frame.clientHeight - parseFloat(getComputedStyle(frame).paddingBottom) - top;
      const natural = panel.getBoundingClientRect().height / outer / panelZoom;
      const next = natural > available ? Math.floor((available / natural) * 100) / 100 : 1;
      if (next !== panelZoom) panelZoom = next;
    };
    untrack(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    observer.observe(frame);
    return () => observer.disconnect();
  });

  // ── Dossier membre ──
  let caseUserId = $state<string | null>(null);

  function openMemberCase(userId: string) {
    caseUserId = userId;
  }

  // Le dossier ne prend pas le focus seul : sans ça, Échap ne le fermait pas.
  const trackCaseFocus = dialogFocus(false);
  $effect(() => trackCaseFocus(caseUserId ? `case:${caseUserId}` : ''));

  const caseIsStaff = $derived(!!caseUserId && !!staff.memberByUserId(caseUserId));
</script>

{#snippet staffCaseTab()}
  {#if caseUserId}<StaffCaseTab userId={caseUserId} />{/if}
{/snippet}

<!-- overflow-clip et non hidden : un focus au bas de l'écran ne doit pas le faire défiler. -->
<Dash class="staff-screen relative overflow-clip {className}">
  <div bind:this={frame} class="h-full overflow-clip p-5">
    <ModulePage title={t.title} description={t.desc} icon="users">
      {#snippet actions()}
        <Button icon="settings" title={t.settingsTitle} onclick={() => (staff.dialogs.settings = true)}>{t.settings}</Button>
      {/snippet}

      <!-- Chiffres clés : un clic mène à l'onglet qui les détaille. Le dashboard
           met des dt/dd dans un bouton (liste invalide) : ici des span, même rendu. -->
      <section class="section-card p-5" aria-label={t.kpiLabel}>
        <div class="grid grid-cols-4 gap-x-6 gap-y-4">
          {#each stats as stat (stat.id)}
            <div class="min-w-0 border-l border-outline-variant pl-5 first:border-l-0 first:pl-0">
              <button type="button" class="kpi group" onclick={() => switchTab(stat.id)}>
                <span class="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <Papicon icon={stat.icon} size={14} />
                  <span class="truncate">{stat.label}</span>
                  <Papicon icon="arrow-right" size={12} class="opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span class="mt-0.5 block">
                  <span class="block text-2xl font-semibold tabular-nums tracking-tight text-on-surface {stat.tone}">{stat.value}</span>
                  <span class="block truncate text-xs text-on-surface-variant {stat.tone}">{stat.note}</span>
                </span>
              </button>
            </div>
          {/each}
        </div>
      </section>

      <div class="space-y-4">
        <Tabs label={t.tabsLabel} {tabs} active={activeTab} onchange={(id) => switchTab(id as StaffTab)} />

        <div bind:this={panel} style={panelZoom < 1 ? `zoom: ${panelZoom}` : undefined}>
          {#if activeTab === 'members'}
            <StaffDirectory openCase={openMemberCase} />
          {:else if activeTab === 'roles'}
            <StaffRoles />
          {:else if activeTab === 'organigramme'}
            <OrgChart schema={staff.hierarchySchema} />
          {:else if activeTab === 'warnings'}
            <StaffWarnings openCase={openMemberCase} />
          {:else if activeTab === 'blacklist'}
            <StaffBlacklist />
          {:else if activeTab === 'polls'}
            <StaffPolls />
          {:else if activeTab === 'leadership'}
            <StaffLeadership openCase={openMemberCase} />
          {:else if activeTab === 'permissions'}
            <div class="space-y-4">
              <p class="max-w-prose text-sm text-on-surface-variant">{t.permsDesc}</p>
              <RolePermissionSettings title={t.permsDirectoryTitle} description={t.permsDirectoryDesc} featureKey="staff_directory" />
              <RolePermissionSettings title={t.permsRolesTitle} description={t.permsRolesDesc} featureKey="staff_roles" />
            </div>
          {/if}
        </div>
      </div>
    </ModulePage>
  </div>

  <MemberCaseModal
    userId={caseUserId}
    extraTab={caseIsStaff ? { label: t.caseTab, icon: 'shield', content: staffCaseTab } : null}
    initialTab={caseIsStaff ? 'extra' : 'resume'}
    onclose={() => (caseUserId = null)}
  />

  <StaffDialogs />
  <ConfirmModal />
  <StaffToasts />
</Dash>

<style>
  .kpi {
    display: block;
    width: calc(100% + 0.75rem);
    margin: -0.375rem;
    padding: 0.375rem;
    border-radius: 0.5rem;
    text-align: left;
    transition: background-color 0.15s ease;
  }
  .kpi:hover {
    background: var(--surface-hover);
  }

  /* Pour tenir dans 720 px de haut : la description sur une ligne, un peu moins d'air sous les chiffres. */
  :global(.staff-screen .module-page__identity > p) {
    max-width: none;
  }
  :global(.staff-screen .module-page__body > :not(:last-child)) {
    margin-block-end: 1.5rem;
  }
</style>
