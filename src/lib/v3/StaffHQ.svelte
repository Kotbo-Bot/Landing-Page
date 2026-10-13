<script lang="ts">
  /**
   * Le QG : ce qui distingue Kotbo des bots de modération.
   *
   * Les écrans sont ceux du dashboard, reconstitués à l'identique dans
   * `components/mockups` (membres fictifs). Un onglet par écran plutôt que
   * quatre captures empilées : le visiteur choisit ce qu'il veut voir, et la
   * page reste courte. Sous la fenêtre, la liste de ce que le module staff
   * fait réellement (vérifiée dans le registre des modules, voir `faq.js`).
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { STAFF_ROUTE } from '$lib/i18n/routes';
  import { reveal } from '$lib/actions/reveal';
  import { ktb } from '$lib/playground/discord/theme';
  import MockProfile from '$lib/components/mockups/MockProfile.svelte';
  import MockStaff from '$lib/components/mockups/MockStaff.svelte';
  import MockSanction from '$lib/components/mockups/MockSanction.svelte';
  import MockTickets from '$lib/components/mockups/MockTickets.svelte';

  type Tab = 'profile' | 'staff' | 'sanctions' | 'tickets';

  const TEXT = {
    fr: {
      kicker: 'dash.kotbo.fr',
      title: 'Les autres bots gèrent tes membres. Kotbo gère aussi ceux qui les gèrent.',
      intro:
        'Ton staff a enfin un vrai QG. Chaque membre a sa fiche, chaque modo son suivi, chaque sanction son dossier. Tout ce que Kotbo fait dans Discord atterrit ici.',
      tabsLabel: 'Écrans du dashboard',
      tabs: {
        profile: { label: 'Fiche membre', caption: 'Toute l’histoire d’un membre sur une page : messages, vocal, sanctions, notes du staff, score de risque.' },
        staff: { label: 'Équipe', caption: 'Qui bosse, qui est en période d’essai, qui a pris un avertissement. Les grades suivent les rôles Discord.' },
        sanctions: { label: 'Sanctions', caption: 'Motif, auteur, preuves. Six mois plus tard, « pourquoi il est ban ? » a encore une réponse.' },
        tickets: { label: 'Tickets', caption: 'Les tickets tombent dans le dashboard, se prennent en un clic et gardent leur transcript.' },
      } as Record<Tab, { label: string; caption: string }>,
      erpTitle: 'Le module staff, en vrai',
      erp: [
        { icon: 'news', title: 'Recrutement', text: 'Formulaire de candidature, tri, réponse. Fini les candidatures perdues en MP.' },
        { icon: 'cal', title: 'Absences', text: 'Demandées dans Discord, validées par un supérieur, visibles par toute l’équipe.' },
        { icon: 'clock', title: 'Réunions et tâches', text: 'Planifiées, rappelées, avec qui était là.' },
        { icon: 'stats', title: 'Évaluations', text: 'Activité réelle de chaque modo et note du manager. Les promotions se méritent.' },
        { icon: 'crown', title: 'Hiérarchie', text: 'Grades reliés aux rôles Discord, droits du dashboard qui suivent.' },
        { icon: 'shield', title: 'Discipline staff', text: 'Avertissements internes, rétrogradation automatique, tout est daté.' },
      ],
      more: 'Tout sur la gestion du staff',
      demo: 'Fouiller le vrai dashboard, sans compte',
      fictive: 'Écrans du dashboard, membres fictifs',
    },
    en: {
      kicker: 'dash.kotbo.fr',
      title: 'Other bots manage your members. Kotbo also manages the people who manage them.',
      intro:
        'Your staff finally gets a real HQ. Every member has a profile, every mod has a track record, every sanction has a file. Everything Kotbo does in Discord lands here.',
      tabsLabel: 'Dashboard screens',
      tabs: {
        profile: { label: 'Member profile', caption: 'A member’s whole story on one page: messages, voice, sanctions, staff notes, risk score.' },
        staff: { label: 'Team', caption: 'Who’s working, who’s on probation, who got a warning. Ranks follow Discord roles.' },
        sanctions: { label: 'Sanctions', caption: 'Reason, author, proof. Six months later, “why was he banned?” still has an answer.' },
        tickets: { label: 'Tickets', caption: 'Tickets land in the dashboard, get claimed in one click and keep their transcript.' },
      } as Record<Tab, { label: string; caption: string }>,
      erpTitle: 'The staff module, for real',
      erp: [
        { icon: 'news', title: 'Recruitment', text: 'Application forms, review, answer. No more applications lost in DMs.' },
        { icon: 'cal', title: 'Time off', text: 'Requested in Discord, approved by a superior, visible to the whole team.' },
        { icon: 'clock', title: 'Meetings and tasks', text: 'Scheduled, reminded, with who showed up.' },
        { icon: 'stats', title: 'Reviews', text: 'Each mod’s real activity plus the manager’s rating. Promotions get earned.' },
        { icon: 'crown', title: 'Hierarchy', text: 'Ranks tied to Discord roles, dashboard permissions that follow.' },
        { icon: 'shield', title: 'Staff discipline', text: 'Internal warnings, automatic demotion, everything dated.' },
      ],
      more: 'Everything about staff management',
      demo: 'Dig through the real dashboard, no account',
      fictive: 'Dashboard screens, fictional members',
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const TABS: Tab[] = ['profile', 'staff', 'sanctions', 'tickets'];
  let active = $state<Tab>('profile');
  let tabEls: HTMLButtonElement[] = [];

  function onKey(e: KeyboardEvent, i: number) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
    active = TABS[n];
    tabEls[n]?.focus();
  }
</script>

<section id="qg" aria-labelledby="hq-title" class="relative border-t border-line bg-night-2 py-24 lg:py-32">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <div use:reveal={{ direction: 'up' }} class="max-w-4xl">
      <p class="font-mono text-sm text-glow">{t.kicker}</p>
      <h2 id="hq-title" class="mt-4 font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">{t.title}</h2>
      <p class="mt-6 max-w-2xl text-lg leading-relaxed text-mist">{t.intro}</p>
    </div>

    <div use:reveal={{ direction: 'up', delay: 100 }} class="mt-14">
      <div role="tablist" aria-label={t.tabsLabel} class="flex gap-1 overflow-x-auto pb-px">
        {#each TABS as tab, i (tab)}
          <button
            bind:this={tabEls[i]}
            role="tab"
            type="button"
            id="hq-tab-{tab}"
            aria-selected={active === tab}
            aria-controls="hq-panel"
            tabindex={active === tab ? 0 : -1}
            onclick={() => (active = tab)}
            onkeydown={(e) => onKey(e, i)}
            class="min-h-11 shrink-0 rounded-t-xl border border-b-0 px-4 text-sm font-semibold transition-colors {active === tab
              ? 'border-line-2 bg-night-3 text-white'
              : 'border-transparent text-fog hover:text-white'}"
          >
            {t.tabs[tab].label}
          </button>
        {/each}
      </div>

      <div id="hq-panel" role="tabpanel" aria-labelledby="hq-tab-{active}" class="rounded-b-2xl rounded-tr-2xl border border-line-2 bg-night-3 p-2 sm:p-3">
        <p class="px-2 pb-3 pt-1 text-base text-mist sm:px-3">{t.tabs[active].caption}</p>
        <div class="overflow-hidden rounded-xl bg-white">
          <div class="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2.5">
            <span class="flex gap-1.5" aria-hidden="true">
              <span class="h-2.5 w-2.5 rounded-full bg-gray-300"></span><span class="h-2.5 w-2.5 rounded-full bg-gray-300"></span><span class="h-2.5 w-2.5 rounded-full bg-gray-300"></span>
            </span>
            <span class="mx-auto rounded-md bg-white px-3 py-0.5 font-mono text-xs text-gray-600">dash.kotbo.fr</span>
          </div>
          <div class="overflow-x-auto">
            <div class="min-w-[56rem]">
              {#key active}
                <div class="hq-screen">
                  {#if active === 'profile'}
                    <div class="relative h-[34rem] overflow-hidden"><MockProfile /></div>
                  {:else if active === 'staff'}
                    <div class="flex h-[34rem] flex-col"><MockStaff /></div>
                  {:else if active === 'sanctions'}
                    <div class="flex h-[34rem] flex-col"><MockSanction /></div>
                  {:else}
                    <div class="flex h-[34rem] flex-col overflow-hidden"><MockTickets /></div>
                  {/if}
                </div>
              {/key}
            </div>
          </div>
        </div>
        <p class="px-3 pb-1 pt-3 font-mono text-[11px] text-fog">{t.fictive}</p>
      </div>
    </div>

    <div class="mt-20 grid gap-12 lg:grid-cols-[18rem_1fr]">
      <div use:reveal={{ direction: 'up' }}>
        <h3 class="font-display text-3xl font-extrabold tracking-tight text-white">{t.erpTitle}</h3>
        <div class="mt-6 flex flex-col gap-3">
          <a href="{base}{STAFF_ROUTE[getLocale()]}" class="inline-flex min-h-11 items-center gap-2 font-semibold text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">
            {t.more}
          </a>
          <a href="/demo/" class="inline-flex min-h-11 items-center gap-2 font-semibold text-white underline decoration-white/20 underline-offset-4 hover:decoration-white">
            {t.demo}
          </a>
        </div>
      </div>
      <ul class="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {#each t.erp as item, i (item.title)}
          <li use:reveal={{ direction: 'up', delay: i * 50 }} class="bg-night-2 p-6">
            <img src={ktb(item.icon)} alt="" width="28" height="28" class="h-7 w-7" />
            <p class="mt-4 font-display text-lg font-bold text-white">{item.title}</p>
            <p class="mt-1.5 leading-relaxed text-fog">{item.text}</p>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>

<style>
  .hq-screen {
    animation: screen-in 380ms ease both;
  }
  @keyframes screen-in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
  }
</style>
