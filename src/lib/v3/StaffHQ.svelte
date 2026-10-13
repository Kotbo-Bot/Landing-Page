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
  import { ktb } from '$lib/playground/discord/theme';
  import MockProfile from '$lib/components/mockups/MockProfile.svelte';
  import MockStaff from '$lib/components/mockups/MockStaff.svelte';
  import MockSanction from '$lib/components/mockups/MockSanction.svelte';
  import MockTickets from '$lib/components/mockups/MockTickets.svelte';
  import ChannelHeader from './ChannelHeader.svelte';

  type Tab = 'profile' | 'staff' | 'sanctions' | 'tickets';

  const TEXT = {
    fr: {
      title: 'Ton staff a enfin un QG, et il est dans le dashboard',
      intro:
        'Tout ce que Kotbo fait dans Discord atterrit dans le dashboard. Ton staff y retrouve la fiche de n’importe quel membre, le suivi de chaque modo et le dossier derrière chaque ban',
      tabsLabel: 'Écrans du dashboard',
      tabs: {
        profile: { label: 'Fiche membre', caption: 'Toute l’histoire d’un membre sur une page : messages, vocal, sanctions, notes du staff, score de risque' },
        staff: { label: 'Équipe', caption: 'Tu vois qui bosse vraiment, qui est en période d’essai et qui a pris un avertissement. Les grades suivent les rôles Discord' },
        sanctions: { label: 'Sanctions', caption: 'Chaque sanction garde son motif, son auteur et ses preuves. Six mois plus tard, tu sais encore pourquoi il a été ban' },
        tickets: { label: 'Tickets', caption: 'Les tickets tombent dans le dashboard, se prennent en un clic et gardent leur transcript' },
      } as Record<Tab, { label: string; caption: string }>,
      erpTitle: 'Le module staff, en vrai',
      erp: [
        { icon: 'news', title: 'Recrutement', text: 'Un formulaire de candidature, et les réponses arrivent triées dans le dashboard au lieu de tes MP' },
        { icon: 'cal', title: 'Absences', text: 'Demandées dans Discord, validées par un supérieur, visibles par toute l’équipe' },
        { icon: 'clock', title: 'Réunions et tâches', text: 'Kotbo les planifie, envoie le rappel et note qui est venu' },
        { icon: 'stats', title: 'Évaluations', text: 'L’activité réelle de chaque modo à côté de la note de son responsable, pour promouvoir les bonnes personnes' },
        { icon: 'crown', title: 'Hiérarchie', text: 'Grades reliés aux rôles Discord, droits du dashboard qui suivent' },
        { icon: 'shield', title: 'Discipline staff', text: 'Les modos ont leurs propres avertissements, datés, et la rétrogradation peut tomber toute seule' },
      ],
      more: 'Tout sur la gestion du staff',
      demo: 'Fouiller le vrai dashboard, sans compte',
      fictive: 'Écrans du dashboard, membres fictifs',
    },
    en: {
      title: 'Your staff finally gets an HQ, and it lives in the dashboard',
      intro:
        'Everything Kotbo does in Discord lands in the dashboard. Your staff can pull up any member’s profile, every mod’s track record and the file behind each ban',
      tabsLabel: 'Dashboard screens',
      tabs: {
        profile: { label: 'Member profile', caption: 'A member’s whole story on one page: messages, voice, sanctions, staff notes, risk score' },
        staff: { label: 'Team', caption: 'See who actually works, who’s on probation and who got a warning. Ranks follow Discord roles' },
        sanctions: { label: 'Sanctions', caption: 'Every sanction keeps its reason, its author and its proof. Six months later, you still know why he got banned' },
        tickets: { label: 'Tickets', caption: 'Tickets land in the dashboard, get claimed in one click and keep their transcript' },
      } as Record<Tab, { label: string; caption: string }>,
      erpTitle: 'The staff module, for real',
      erp: [
        { icon: 'news', title: 'Recruitment', text: 'One application form, and answers land sorted in the dashboard instead of your DMs' },
        { icon: 'cal', title: 'Time off', text: 'Requested in Discord, approved by a superior, visible to the whole team' },
        { icon: 'clock', title: 'Meetings and tasks', text: 'Kotbo schedules them, sends the reminder and logs who showed up' },
        { icon: 'stats', title: 'Reviews', text: 'Each mod’s real activity next to their lead’s rating, so the right people get promoted' },
        { icon: 'crown', title: 'Hierarchy', text: 'Ranks tied to Discord roles, dashboard permissions that follow' },
        { icon: 'shield', title: 'Staff discipline', text: 'Mods get their own dated warnings, and demotion can kick in on its own' },
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
    const moves: Record<string, number> = {
      ArrowRight: (i + 1) % TABS.length,
      ArrowLeft: (i - 1 + TABS.length) % TABS.length,
      Home: 0,
      End: TABS.length - 1,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    const n = moves[e.key];
    active = TABS[n];
    tabEls[n]?.focus();
  }
</script>

<section id="qg" aria-labelledby="hq-title" class="relative bg-night-2 pb-16 sm:pb-24 lg:pb-32">
  <div class="bg-night-2/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="qg" /></div>
  </div>
  <div class="mx-auto pt-14 lg:pt-20 max-w-7xl px-4 sm:px-6">
    <div class="max-w-4xl">
      <h2 id="hq-title" class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">{t.title}</h2>
      <p class="mt-6 max-w-2xl text-lg leading-relaxed text-mist">{t.intro}</p>
    </div>

    <div class="mt-14">
      <div role="tablist" aria-label={t.tabsLabel} class="flex flex-wrap gap-1">
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
              ? 'border-line-2 bg-night-3 text-white shadow-[inset_0_2px_0_#a5b4fc]'
              : 'border-transparent text-fog hover:text-white'}"
          >
            {t.tabs[tab].label}
          </button>
        {/each}
      </div>

      <div id="hq-panel" role="tabpanel" aria-labelledby="hq-tab-{active}" class="rounded-b-2xl rounded-tr-2xl border border-line-2 bg-night-3 p-2 sm:p-3">
        <p id="hq-cap" class="px-2 pb-3 pt-1 text-base text-mist sm:px-3">{t.tabs[active].caption}</p>
        <!-- Une capture, pas une interface : `inert` retire ses faux contrôles du
             clavier et ses titres du plan, la légende la décrit. -->
        <div class="dash-dark overflow-hidden rounded-xl border border-line">
          <!-- Zone défilable : focusable pour défiler au clavier (WCAG 2.1.1). -->
          <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
          <div class="overflow-x-auto" tabindex="0" role="region" aria-labelledby="hq-cap hq-fict">
            <div class="min-w-[56rem]" inert aria-hidden="true">
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
        <p id="hq-fict" class="px-3 pb-1 pt-3 text-xs text-fog">{t.fictive}</p>
      </div>
    </div>

    <div class="mt-20 grid gap-12 lg:grid-cols-[18rem_1fr]">
      <div>
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
      <ul class="grid gap-x-10 sm:grid-cols-2">
        {#each t.erp as item (item.title)}
          <li class="flex gap-4 border-t border-line py-5">
            <img src={ktb(item.icon)} alt="" width="22" height="22" class="mt-0.5 h-5.5 w-5.5 shrink-0" />
            <div>
              <p class="font-display text-lg font-bold text-white">{item.title}</p>
              <p class="mt-1 leading-relaxed text-fog">{item.text}</p>
            </div>
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
