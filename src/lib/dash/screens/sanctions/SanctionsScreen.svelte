<!--
  Écran Sécurité > Sanctions du dashboard, en démo dans un cadre de 1180 × 720.

  Recopie de `Kotbo/apps/dashboard/src/pages/security/Sanctions.svelte`
  (branche `recette`) et des pages qu'elle rend selon l'onglet :
  `pages/Sanctions.svelte` (historique, configuration) et
  `pages/BanAppeals.svelte` (contestations). La page « Approbation des
  permissions » (`AdminLockRequests`) n'a pas d'onglet dans la barre de la
  page : elle n'est pas reprise.
  Dans le dashboard, l'onglet Contestations remplace toute la page (titre
  compris) ; ici l'en-tête change de titre mais la barre d'onglets reste,
  sans quoi on ne pourrait plus revenir à l'historique.
  Les données sont fictives (`dash/fixtures/sanctions.ts`) et tout se passe
  en mémoire (`demo.svelte.ts`) : rien ne part sur le réseau.
-->
<script lang="ts">
  import Dash from '$lib/dash/Dash.svelte';
  import Papicon from '$lib/dash/Papicon.svelte';
  import { ModulePage, RefreshButton, Tabs } from '$lib/dash/ui';
  import MemberCaseModal from '$lib/dash/screens/members/MemberCaseModal.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { SanctionsDemo } from './demo.svelte';
  import SanctionsList from './SanctionsList.svelte';
  import SanctionsSettings from './SanctionsSettings.svelte';
  import BanAppeals from './BanAppeals.svelte';
  import ConfirmModal from './ConfirmModal.svelte';

  const TEXT = {
    fr: {
      title: 'Sanctions',
      desc: 'Chaque sanction du serveur : qui, par qui et pourquoi.',
      appealsTitle: 'Contestations de ban',
      appealsDesc: 'Un membre banni peut contester son ban avec un formulaire. Tu décides ici.',
      refresh: 'Actualiser',
      tabHistory: 'Historique',
      tabConfig: 'Configuration',
      tabAppeals: 'Contestations de ban',
      close: 'Fermer',
    },
    en: {
      title: 'Sanctions',
      desc: 'Every sanction on the server: who, by whom and why.',
      appealsTitle: 'Ban appeals',
      appealsDesc: 'A banned member can appeal with a form. You decide here.',
      refresh: 'Refresh',
      tabHistory: 'History',
      tabConfig: 'Configuration',
      tabAppeals: 'Ban appeals',
      close: 'Close',
    },
  };

  const { class: className = '' }: { class?: string } = $props();
  const t = $derived(TEXT[getLocale()]);

  const demo = new SanctionsDemo();
  let activeTab = $state<'sanctions' | 'settings' | 'appeals'>('sanctions');

  // Le dashboard recharge depuis l'API ; ici, rien à recharger : juste le tour d'icône.
  let refreshing = $state(false);
  function refresh() {
    refreshing = true;
    setTimeout(() => (refreshing = false), 600);
  }
</script>

<Dash class="relative isolate h-[720px] w-[1180px] overflow-hidden bg-background px-8 py-6 text-on-surface {className}">
  <ModulePage
    title={activeTab === 'appeals' ? t.appealsTitle : t.title}
    description={activeTab === 'appeals' ? t.appealsDesc : t.desc}
    icon={activeTab === 'appeals' ? 'gavel' : 'alert-triangle'}
  >
    {#snippet actions()}
      {#if activeTab !== 'appeals'}
        <div class="flex items-center gap-3">
          <RefreshButton onClick={refresh} loading={refreshing} label={t.refresh} className="px-5 py-2.5 font-bold " iconClass="text-lg" />
        </div>
      {/if}
    {/snippet}


    {#if activeTab === 'appeals'}
      <BanAppeals {demo} {pageTabs} />
    {:else}
      <div class="space-y-6">
        {@render pageTabs()}
        {#if activeTab === 'sanctions'}
          <SanctionsList {demo} />
        {:else}
          <SanctionsSettings {demo} />
        {/if}
      </div>
    {/if}
  </ModulePage>

  {#if demo.caseUserId}
    <!-- Au-dessus du dossier de sanction, d'où on l'ouvre aussi (plan `member-case-overlay` du dashboard). -->
    <div class="member-case-overlay absolute inset-0">
      <MemberCaseModal userId={demo.caseUserId} onclose={() => (demo.caseUserId = null)} />
    </div>
  {/if}

  <ConfirmModal {demo} />

  <!-- Notifications du dashboard (ToastContainer), dans le coin du cadre. -->
  <div class="absolute bottom-4 right-4 z-[30000] flex flex-col gap-2 w-[360px]" aria-live="polite">
    {#each demo.toasts as item (item.id)}
      <div
        class="relative overflow-hidden flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border shadow-lg shadow-black/40 animate-in slide-in-from-right fade-in duration-200 bg-surface-container-high {item.type === 'success' ? 'bg-linear-to-r from-emerald-500/12 to-emerald-500/12 text-success border-success/25' : 'bg-linear-to-r from-red-500/12 to-red-500/12 text-error border-error/25'}"
        role={item.type === 'error' ? 'alert' : 'status'}
      >
        <Papicon name={item.type === 'success' ? 'check_circle' : 'error'} size={16} class="shrink-0" />
        <p class="text-sm flex-1">{item.message}</p>
        <button onclick={() => demo.dismiss(item.id)} class="ml-auto p-0.5 hover:bg-white/10 rounded transition-colors cursor-pointer shrink-0" aria-label={t.close}>
          <Papicon name="close" size={14} />
        </button>
      </div>
    {/each}
  </div>
</Dash>

<!-- La barre d'onglets de la page, rendue par l'écran ou par l'onglet Contestations. -->
{#snippet pageTabs()}
  <Tabs
    label={t.title}
    tabs={[
      { id: 'sanctions', label: t.tabHistory, icon: 'alert-triangle' },
      { id: 'settings', label: t.tabConfig, icon: 'settings' },
      { id: 'appeals', label: t.tabAppeals, icon: 'gavel' },
    ]}
    active={activeTab}
    onchange={(id) => (activeTab = id as typeof activeTab)}
  />
{/snippet}
