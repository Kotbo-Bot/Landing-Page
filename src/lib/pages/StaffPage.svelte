<script lang="ts">
  /**
   * La page « gestion du staff Discord ».
   *
   * L'accueil fait essayer Kotbo ; cette page répond à une recherche précise :
   * « comment gérer le staff de mon serveur Discord ». C'est là que Kotbo se
   * distingue des bots de modération, et c'est la question qu'on pose à Google
   * comme aux assistants IA. Elle se lit de haut en bas sans rien à manipuler,
   * et chaque phrase décrit une fonction qui existe : le registre des modules
   * (`components/Modules.svelte`) et les outils MCP du bot font foi.
   *
   * Rendue par `/gestion-staff-discord` et `/en/discord-staff-management`
   * (`i18n/routes.ts`). Les écrans du dashboard sont les maquettes de la v1,
   * annoncés comme des démos.
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { reveal } from '$lib/actions/reveal';
  import { track } from '$lib/funnel';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { HOME_ROUTE, STAFF_ROUTE } from '$lib/i18n/routes';
  import { TRIAL_DAYS } from '$lib/product';
  import Seo from '$lib/seo/Seo.svelte';
  import { STAFF_FAQ } from '$lib/seo/faq.js';
  import { staffJsonLd } from '$lib/seo/jsonld.js';
  import SiteNav from '$lib/sections/SiteNav.svelte';
  import SiteFooter from '$lib/sections/SiteFooter.svelte';
  import InviteButton from '$lib/playground/InviteButton.svelte';
  import FaqList from '$lib/components/FaqList.svelte';
  import MockStaff from '$lib/components/mockups/MockStaff.svelte';
  import MockSanction from '$lib/components/mockups/MockSanction.svelte';

  const TEXT = {
    fr: {
      title: 'Gestion du staff Discord : absences, recrutement, évaluations | Kotbo',
      description:
        'Gère l’équipe de modération de ton serveur Discord : hiérarchies, absences, réunions, évaluations, recrutement, casier des sanctions et doubles comptes.',
      breadcrumbHome: 'Accueil',
      breadcrumbNav: "Fil d'Ariane",
      eyebrow: 'Gestion du staff Discord',
      h1: 'Ton équipe de modération, gérée comme une équipe.',
      lead: 'Kotbo est un bot Discord français avec un dashboard web. Il modère, et il tient aussi ton staff : hiérarchies et grades, absences, réunions, tâches, évaluations et recrutement. Côté membres, chaque sanction et chaque double compte reste dans un dossier.',
      demo: 'Essayer la démo du dashboard',
      team: {
        title: 'Ce qu’un responsable de staff fait à la main, au même endroit.',
        intro:
          'Sans outil, le staff vit dans un salon #absences, un tableur de grades et des messages privés. Dans Kotbo, chaque modérateur a sa fiche et chaque décision laisse une trace.',
        caption: 'Aperçu de démonstration : l’annuaire du staff dans le dashboard.',
        items: [
          {
            title: 'Hiérarchies et grades',
            body: 'Modération, Animation, Support : chaque hiérarchie a son rôle Discord, son responsable et ses grades. Promouvoir ou retirer un modérateur met ses rôles à jour.',
          },
          {
            title: 'Absences',
            body: 'Le modérateur déclare ses dates, le type d’absence et le motif. Son supérieur l’approuve ou la refuse, et le calendrier du staff montre qui est là.',
          },
          {
            title: 'Réunions',
            body: 'Une réunion se planifie dans le dashboard avec sa date et son ordre du jour, et le staff en est prévenu dans Discord.',
          },
          {
            title: 'Tâches',
            body: 'Assigne une tâche à un modérateur avec une priorité et une échéance, et suis-la jusqu’à ce qu’elle soit terminée.',
          },
          {
            title: 'Sondages staff',
            body: 'Fais voter l’équipe sur une décision, en anonyme si besoin, avec une date de clôture.',
          },
          {
            title: 'Évaluations',
            body: 'Une évaluation de performance par modérateur, ou pour tout le staff, sur 7 à 365 jours. Le manager y ajoute sa note.',
          },
          {
            title: 'Discipline et notes',
            body: 'Avertissements staff et notes privées du manager restent sur la fiche du modérateur. Une promotion se décide sur un historique, pas sur un souvenir.',
          },
          {
            title: 'Tutorat et formation',
            body: 'Les nouveaux modérateurs sont accompagnés par un tuteur pendant leur période de test.',
          },
        ],
      },
      recruit: {
        title: 'Recruter sans perdre les candidatures dans un salon.',
        steps: [
          {
            title: 'Crée le formulaire',
            body: 'Questions libres, choix multiples, connexion Discord obligatoire pour savoir qui postule.',
          },
          {
            title: 'Lis les candidatures',
            body: 'Les réponses arrivent dans le dashboard, une par candidat, au lieu de s’empiler dans un salon.',
          },
          {
            title: 'Embauche',
            body: 'Le formulaire est rattaché à une hiérarchie : le candidat retenu reçoit le rôle de cette hiérarchie.',
          },
        ],
      },
      security: {
        title: 'Chaque membre a un dossier.',
        intro: 'La gestion du staff ne s’arrête pas à l’équipe : les décisions qu’elle prend sur les membres sont gardées, avec leurs preuves.',
        caption: 'Aperçu de démonstration : une sanction et son dossier.',
        items: [
          {
            title: 'Casier des sanctions',
            body: 'Chaque sanction garde son motif, son auteur et ses preuves (captures, transcriptions). L’historique complet d’un membre est sur sa fiche.',
          },
          {
            title: 'Doubles comptes',
            body: 'Le staff relie un compte principal à ses doubles comptes, avec le motif. Un membre sanctionné qui revient sous un autre pseudo ne repart pas de zéro.',
          },
          {
            title: 'Appels de bannissement',
            body: 'Un membre banni fait appel par formulaire. Le staff peut demander des précisions, décide avec le dossier sous les yeux et bloque les appels abusifs.',
          },
          {
            title: 'AutoMod et anti-raid',
            body: 'Mots interdits, règles par expression régulière et protection anti-raid filtrent avant que le staff ait à intervenir.',
          },
        ],
      },
      faqTitle: 'Questions sur la gestion du staff',
      final: {
        title: 'Essaie-le avec ton équipe.',
        body: `${TRIAL_DAYS} jours d’essai, une fois par serveur. Toutes les offres contiennent tout le catalogue, à partir de 5 € HT par mois.`,
        pricing: 'Voir les tarifs',
      },
    },
    en: {
      title: 'Discord staff management: absences, recruitment, reviews | Kotbo',
      description:
        "Run your Discord server's moderation team: hierarchies, absences, meetings, reviews, recruitment, sanction records and alt accounts.",
      breadcrumbHome: 'Home',
      breadcrumbNav: 'Breadcrumb',
      eyebrow: 'Discord staff management',
      h1: 'Your moderation team, run like a team.',
      lead: 'Kotbo is a French Discord bot with a web dashboard. It moderates, and it also runs your staff: hierarchies and ranks, absences, meetings, tasks, reviews and recruitment. On the member side, every sanction and every alt account stays on file.',
      demo: 'Try the dashboard demo',
      team: {
        title: 'What a staff lead does by hand, in one place.',
        intro:
          'Without a tool, staff lives in an #absences channel, a spreadsheet of ranks and DMs. In Kotbo, every moderator has a profile and every decision leaves a record.',
        caption: 'Demo preview: the staff directory in the dashboard.',
        items: [
          {
            title: 'Hierarchies and ranks',
            body: 'Moderation, Events, Support: each hierarchy has its Discord role, its lead and its ranks. Promoting or removing a moderator updates their roles.',
          },
          {
            title: 'Absences',
            body: 'The moderator reports their dates, the type of absence and the reason. Their superior approves or rejects it, and the staff calendar shows who is around.',
          },
          {
            title: 'Meetings',
            body: 'A meeting is scheduled in the dashboard with its date and agenda, and staff are notified in Discord.',
          },
          {
            title: 'Tasks',
            body: 'Assign a task to a moderator with a priority and a due date, and follow it until it is done.',
          },
          {
            title: 'Staff polls',
            body: 'Let the team vote on a decision, anonymously if needed, with a closing date.',
          },
          {
            title: 'Reviews',
            body: 'A performance review per moderator, or for the whole staff, over 7 to 365 days. The manager adds their note.',
          },
          {
            title: 'Discipline and notes',
            body: "Staff warnings and the manager's private notes stay on the moderator's profile. A promotion is decided on a record, not a memory.",
          },
          {
            title: 'Mentoring and training',
            body: 'New moderators are paired with a mentor during their trial period.',
          },
        ],
      },
      recruit: {
        title: 'Recruit without losing applications in a channel.',
        steps: [
          {
            title: 'Build the form',
            body: "Open questions, multiple choice, mandatory Discord login so you know who's applying.",
          },
          {
            title: 'Read the applications',
            body: 'Answers land in the dashboard, one per applicant, instead of piling up in a channel.',
          },
          {
            title: 'Hire',
            body: "The form is attached to a hierarchy: the chosen applicant gets that hierarchy's role.",
          },
        ],
      },
      security: {
        title: 'Every member has a file.',
        intro: "Staff management doesn't stop at the team: the decisions it makes about members are kept, with their evidence.",
        caption: 'Demo preview: a sanction and its file.',
        items: [
          {
            title: 'Sanction records',
            body: "Every sanction keeps its reason, its author and its evidence (screenshots, transcripts). A member's full history sits on their profile.",
          },
          {
            title: 'Alt accounts',
            body: 'Staff link a main account to its alts, with the reason. A sanctioned member who comes back under another name does not start from scratch.',
          },
          {
            title: 'Ban appeals',
            body: 'A banned member appeals through a form. Staff can ask for details, decide with the file in front of them and block abusive appeals.',
          },
          {
            title: 'AutoMod and anti-raid',
            body: 'Banned words, regular-expression rules and anti-raid protection filter before staff need to step in.',
          },
        ],
      },
      faqTitle: 'Questions about staff management',
      final: {
        title: 'Try it with your team.',
        body: `${TRIAL_DAYS}-day trial, once per server. Every plan includes the whole catalog, from €5 per month excl. VAT.`,
        pricing: 'See pricing',
      },
    },
  };

  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const faq = $derived(STAFF_FAQ[locale]);

  onMount(() => {
    // Cette page est une entrée du tunnel au même titre que l'accueil : on y
    // arrive depuis un moteur de recherche.
    track('site_visit', { path: location.pathname });
  });
</script>

<Seo title={t.title} description={t.description} path={STAFF_ROUTE[locale]} jsonLd={staffJsonLd(locale)} />

<div id="top" class="relative min-h-screen text-gray-900">
  <SiteNav />
  <main>
    <section aria-labelledby="staff-title" class="mx-auto max-w-360 px-4 pb-16 pt-8 sm:px-8 lg:pb-24 lg:pt-14">
      <nav aria-label={t.breadcrumbNav} class="text-sm font-semibold text-gray-600">
        <a href="{base}{HOME_ROUTE[locale]}" class="underline decoration-gray-300 underline-offset-4 hover:text-gray-900">{t.breadcrumbHome}</a>
        <span aria-hidden="true" class="mx-1.5 text-gray-400">/</span>
        <span aria-current="page">{t.eyebrow}</span>
      </nav>
      <h1 id="staff-title" class="mt-6 max-w-4xl font-headline text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl xl:text-6xl">
        {t.h1}
      </h1>
      <p class="mt-6 max-w-3xl text-lg leading-relaxed text-gray-700 sm:text-xl">{t.lead}</p>
      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <InviteButton content="staff-hero" size="lg" />
        <a
          href="{base}/demo/"
          class="inline-flex min-h-13 items-center justify-center rounded-xl border-2 border-gray-900 px-7 text-base font-bold text-gray-900 transition-colors hover:bg-white"
        >
          {t.demo}
        </a>
      </div>
    </section>

    <section id="equipe" aria-labelledby="team-title" class="border-t-2 border-gray-200 bg-white py-20 lg:py-28">
      <div class="mx-auto max-w-360 px-4 sm:px-8">
        <div use:reveal={{ direction: 'up' }} class="max-w-3xl">
          <h2 id="team-title" class="font-headline text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{t.team.title}</h2>
          <p class="mt-4 text-lg leading-relaxed text-gray-700">{t.team.intro}</p>
        </div>

        <div class="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
          <ul class="grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {#each t.team.items as item (item.title)}
              <li use:reveal={{ direction: 'up' }}>
                <h3 class="font-headline text-xl font-extrabold text-gray-900">{item.title}</h3>
                <p class="mt-2 leading-relaxed text-gray-700">{item.body}</p>
              </li>
            {/each}
          </ul>
          <figure use:reveal={{ direction: 'up', delay: 100 }} class="lg:sticky lg:top-24 lg:self-start">
            <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_30px_70px_-25px_rgba(17,24,39,0.35)]">
              <div class="flex h-110 flex-col"><MockStaff /></div>
            </div>
            <figcaption class="mt-3 text-sm font-semibold text-gray-600">{t.team.caption}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section id="recrutement" aria-labelledby="recruit-title" class="py-20 lg:py-28">
      <div class="mx-auto max-w-360 px-4 sm:px-8">
        <h2 id="recruit-title" use:reveal={{ direction: 'up' }} class="max-w-3xl font-headline text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          {t.recruit.title}
        </h2>
        <ol class="mt-12 grid gap-6 md:grid-cols-3">
          {#each t.recruit.steps as step, i (step.title)}
            <li use:reveal={{ direction: 'up', delay: i * 80 }} class="rounded-2xl border-2 border-gray-900 bg-white p-6">
              <p class="font-headline text-sm font-extrabold text-indigo-600">{String(i + 1).padStart(2, '0')}</p>
              <h3 class="mt-2 font-headline text-xl font-extrabold text-gray-900">{step.title}</h3>
              <p class="mt-2 leading-relaxed text-gray-700">{step.body}</p>
            </li>
          {/each}
        </ol>
      </div>
    </section>

    <section id="securite" aria-labelledby="security-title" class="border-t-2 border-gray-200 bg-white py-20 lg:py-28">
      <div class="mx-auto max-w-360 px-4 sm:px-8">
        <div use:reveal={{ direction: 'up' }} class="max-w-3xl">
          <h2 id="security-title" class="font-headline text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{t.security.title}</h2>
          <p class="mt-4 text-lg leading-relaxed text-gray-700">{t.security.intro}</p>
        </div>

        <div class="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
          <figure use:reveal={{ direction: 'up' }} class="order-2 lg:order-1">
            <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_30px_70px_-25px_rgba(17,24,39,0.35)]">
              <div class="flex h-100 flex-col"><MockSanction /></div>
            </div>
            <figcaption class="mt-3 text-sm font-semibold text-gray-600">{t.security.caption}</figcaption>
          </figure>
          <ul class="order-1 grid gap-8 lg:order-2">
            {#each t.security.items as item (item.title)}
              <li use:reveal={{ direction: 'up' }}>
                <h3 class="font-headline text-xl font-extrabold text-gray-900">{item.title}</h3>
                <p class="mt-2 leading-relaxed text-gray-700">{item.body}</p>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </section>

    <section id="faq" aria-labelledby="staff-faq-title" class="py-20 lg:py-28">
      <div class="mx-auto max-w-3xl px-4 sm:px-8">
        <h2 id="staff-faq-title" use:reveal={{ direction: 'up' }} class="mb-10 font-headline text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {t.faqTitle}
        </h2>
        <FaqList items={faq} trackAs="staff-q" />
      </div>
    </section>

    <section aria-labelledby="staff-final-title" class="bg-gray-900 py-20 text-white lg:py-24">
      <div class="mx-auto max-w-360 px-4 sm:px-8">
        <h2 id="staff-final-title" class="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl">{t.final.title}</h2>
        <p class="mt-4 max-w-2xl text-lg leading-relaxed text-gray-300">{t.final.body}</p>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <InviteButton content="staff-final" tone="light" size="lg" />
          <a
            href="{base}{HOME_ROUTE[locale]}#pricing"
            class="inline-flex min-h-13 items-center justify-center rounded-xl border-2 border-white px-7 text-base font-bold text-white transition-colors hover:bg-white hover:text-gray-900"
          >
            {t.final.pricing}
          </a>
        </div>
      </div>
    </section>
  </main>
  <SiteFooter />
</div>
