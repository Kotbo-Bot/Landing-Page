<script lang="ts">
  /**
   * Deuxième acte : ce que le staff a sous les yeux pendant que le serveur tourne.
   *
   * Le héros montre ce que les membres voient (Discord). Cette zone montre
   * l'autre côté, le dashboard, avec les écrans repris à l'identique de
   * l'application par la v1 (`components/mockups`). Elle vient juste après le
   * héros parce que c'est la question qui suit « mon serveur a l'air bien » :
   * « et qui s'en occupe, et comment ? ».
   *
   * Trois écrans, trois tailles : la fiche membre est l'écran central du
   * produit et prend toute la largeur, l'équipe et les sanctions la suivent en
   * deux colonnes. La hiérarchie des tailles est celle de l'usage.
   */
  import { reveal } from '$lib/actions/reveal';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { ktb } from '$lib/playground/discord/theme';
  import MockProfile from '$lib/components/mockups/MockProfile.svelte';
  import MockStaff from '$lib/components/mockups/MockStaff.svelte';
  import MockSanction from '$lib/components/mockups/MockSanction.svelte';
  import PostIt from '$lib/components/ui/PostIt.svelte';
  import Media from '$lib/components/Media.svelte';

  const TEXT = {
    fr: {
      title: 'Pendant ce temps, ton staff a le dashboard.',
      intro:
        'Tout ce que Kotbo fait dans Discord atterrit dans un tableau de bord web. Une fiche par membre, une vue par modérateur, une trace par sanction.',
      windowTitle: 'dashboard.kotbo.fr · Fiche membre : Arka',
      profileNote: 'toute l’histoire d’un membre sur une page',
      staff: {
        title: 'Une équipe qu’on voit travailler',
        body: 'Grades, activité, périodes de test et avertissements des modérateurs, dans la même vue. Plus besoin de demander qui fait quoi.',
      },
      sanctions: {
        title: 'Des sanctions qui ont un dossier',
        body: 'Chaque sanction garde son motif, son auteur et ses preuves (captures, transcriptions). Six mois plus tard, la question « pourquoi il a été ban ? » a une réponse.',
      },
      cta: {
        badge: 'Démo interactive',
        title: 'Teste le vrai dashboard toi-même',
        desc: 'Fiches membres, gestion des sanctions, tickets en direct, classements et modules : tout fonctionne dans ton navigateur, sans compte et sans carte bancaire.',
        button: 'Ouvrir la démo du dashboard',
      },
      demo: 'Écrans du dashboard, données de démonstration.',
    },
    en: {
      title: 'Meanwhile, your staff has the dashboard.',
      intro:
        'Everything Kotbo does in Discord lands in a web dashboard. One page per member, one view per moderator, one record per sanction.',
      windowTitle: 'dashboard.kotbo.fr · Member profile: Arka',
      profileNote: 'a member’s whole story on one page',
      staff: {
        title: 'A team you can see working',
        body: 'Ranks, activity, trial periods and warnings for your moderators, in one view. No more asking who does what.',
      },
      sanctions: {
        title: 'Sanctions that come with a file',
        body: 'Every sanction keeps its reason, its author and its evidence (screenshots, transcripts). Six months later, “why was he banned?” has an answer.',
      },
      cta: {
        badge: 'Interactive Demo',
        title: 'Try the real dashboard yourself',
        desc: 'Member profiles, sanctions management, live tickets, leaderboards and modules: explore everything in your browser, no account or credit card needed.',
        button: 'Open the dashboard demo',
      },
      demo: 'Dashboard screens, demo data.',
    },
  };

  const t = $derived(TEXT[getLocale()]);
</script>

<section id="dashboard" aria-labelledby="desk-title" class="border-t-2 border-gray-200 bg-white py-20 lg:py-28">
  <div class="mx-auto max-w-360 px-4 sm:px-8">
    <div use:reveal={{ direction: 'up' }} class="max-w-3xl">
      <h2 id="desk-title" class="font-headline text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{t.title}</h2>
      <p class="mt-4 text-lg leading-relaxed text-gray-700">{t.intro}</p>
    </div>

    <div use:reveal={{ direction: 'up', delay: 100 }} class="relative mt-14">
      <div aria-hidden="true" class="absolute -top-12 right-8 z-10 hidden w-56 xl:block">
        <PostIt text={t.profileNote} color="yellow" rotation={4} />
      </div>
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_30px_70px_-25px_rgba(17,24,39,0.35)]">
        <div class="border-b border-gray-200 bg-gray-50 px-5 py-3 text-center text-xs font-semibold text-gray-600">
          {t.windowTitle}
        </div>
        <Media name="dashboardProfile">
          {#snippet fallback()}
            <div class="relative h-140 overflow-hidden md:h-160">
              <MockProfile user="Arka" role="Fondateur" avatar="Arka" />
            </div>
          {/snippet}
        </Media>
      </div>
    </div>

    <div class="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-10">
      <div use:reveal={{ direction: 'up' }}>
        <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <Media name="dashboardStaff">
            {#snippet fallback()}
              <div class="flex h-110 flex-col"><MockStaff /></div>
            {/snippet}
          </Media>
        </div>
        <h3 class="mt-6 flex items-center gap-2 font-headline text-2xl font-extrabold text-gray-900">
          <img src={ktb('mod')} alt="" width="28" height="28" class="h-7 w-7" />{t.staff.title}
        </h3>
        <p class="mt-2 max-w-xl leading-relaxed text-gray-700">{t.staff.body}</p>
      </div>
      <div use:reveal={{ direction: 'up', delay: 120 }} class="lg:mt-24">
        <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <Media name="dashboardSanction">
            {#snippet fallback()}
              <div class="flex h-100 flex-col"><MockSanction /></div>
            {/snippet}
          </Media>
        </div>
        <h3 class="mt-6 flex items-center gap-2 font-headline text-2xl font-extrabold text-gray-900">
          <img src={ktb('shield')} alt="" width="28" height="28" class="h-7 w-7" />{t.sanctions.title}
        </h3>
        <p class="mt-2 max-w-xl leading-relaxed text-gray-700">{t.sanctions.body}</p>
      </div>
    </div>

    <div use:reveal={{ direction: 'up', delay: 150 }} class="mt-16 rounded-3xl border-2 border-indigo-100 bg-linear-to-b from-indigo-50/60 to-white p-8 text-center sm:p-12 shadow-sm">
      <div class="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">
        <span class="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
        {t.cta.badge}
      </div>
      <h3 class="mt-4 font-headline text-2xl font-extrabold text-gray-900 sm:text-3xl">
        {t.cta.title}
      </h3>
      <p class="mx-auto mt-2 max-w-xl text-base leading-relaxed text-gray-600">
        {t.cta.desc}
      </p>
      <div class="mt-6 flex flex-wrap items-center justify-center gap-4">
        <a
          href="/demo/"
          class="inline-flex items-center gap-2.5 rounded-xl bg-gray-900 px-6 py-3.5 text-base font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-black hover:shadow-lg"
        >
          <span>{t.cta.button}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>

    <p class="mt-10 text-sm text-gray-600">{t.demo}</p>
  </div>
</section>
