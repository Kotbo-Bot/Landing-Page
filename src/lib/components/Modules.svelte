<script lang="ts">
  /**
   * Catalogue des modules, en dense.
   *
   * La version precedente montrait dix modules dans de grandes cartes avec un
   * apercu Discord chacune : joli, mais quatre cents lignes pour dire un
   * dixieme du catalogue, et un visiteur qui repart en croyant que Kotbo fait
   * dix choses. Ici on assume l'inverse - la liste complete, serree, ou le
   * nombre fait l'argument. C'est la maniere de faire de mybao.io, et elle
   * marche pour la meme raison : personne ne lit les 51 lignes, tout le monde
   * voit qu'il y en a 51.
   *
   * Les noms viennent de `MODULE_REGISTRY` (packages/contracts) : ce sont les
   * modules reels, tels que le dashboard les affiche. Les modules `core`
   * (Membres, Parametres, Commandes...) sont exclus - ce sont les pages de
   * l'outil, pas des fonctionnalites qu'on vend.
   */
  import { Check } from '@lucide/svelte';
  import { reveal } from '$lib/actions/reveal';
  import Emph from '$lib/components/ui/Emph.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { base } from '$app/paths';
  import { featurePath } from '$lib/i18n/routes';
  import { featureOfModule } from '$lib/data/features';

  interface Props {
    inviteUrl: string;
  }

  const { inviteUrl }: Props = $props();

  const TEXT = {
    fr: {
      eyebrow: 'Catalogue',
      titlePrefix: 'modules.',
      titleEmph: 'Un seul',
      titleSuffix: 'abonnement.',
      intro:
        "Pas de palier qui débloque le module suivant : une offre payante ouvre tout le catalogue, y compris ce qui sortira après.",
      exclusivesLabel: "Et ce qu'aucun autre bot ne fait",
      cta: 'Ajouter Kotbo à mon serveur',
      groups: [
        {
          key: 'moderation',
          label: 'Modération & sécurité',
          accent: 'text-red-500',
          modules: [
            'Sanctions', 'AutoMod', 'Logs Discord', 'Modération des pseudos',
            'Doubles comptes', 'Protection anti-raid', 'Appels de bannissement',
            'Code Police', 'Vérification de sécurité',
          ],
        },
        {
          key: 'staff',
          label: 'Gestion du staff',
          accent: 'text-indigo-500',
          modules: [
            'Recrutement', 'Annuaire staff', 'Hiérarchie & rôles staff',
            'Tutorat & formation', 'Réunions', 'Absences', 'Sondages staff',
            'Discipline staff', 'Évaluations',
          ],
        },
        {
          key: 'community',
          label: 'Communauté & engagement',
          accent: 'text-amber-500',
          modules: [
            'Leveling & XP', 'Saisons', 'Prestige', 'Clans', 'Drops',
            'Économie & RPG', 'Marché entre membres', 'Quêtes', 'Réputation',
            'Salons fun', 'Daily Algo', 'Tickets support', 'Giveaways',
            'Événements & quiz', 'Suggestions', 'Starlight',
          ],
        },
        {
          key: 'content',
          label: 'Contenu & communication',
          accent: 'text-cyan-500',
          modules: [
            'Règlement', 'Accueil & départ', 'Rôles par réaction', 'Auto-réponses',
            'Auto-thread & salons', 'Actualités & RSS', 'Traduction automatique',
            'Digest', 'Formulaires personnalisés',
          ],
        },
        {
          key: 'integrations',
          label: 'Intégrations',
          accent: 'text-emerald-500',
          modules: [
            'Analytics', 'YouTube', 'Twitch', 'Réseaux sociaux',
            'Automatisations', 'Santé des salons',
          ],
        },
        {
          key: 'cross_server',
          label: 'Cross-serveur',
          accent: 'text-violet-500',
          modules: ['Liens de salons', 'Serveur staff'],
        },
      ],
      exclusives: [
        {
          title: 'Serveur MCP',
          desc: "Branche Claude ou n'importe quel agent IA sur ton serveur : clés d'API à permissions fines (lecture des stats, écriture des sanctions, tickets...), révocables et journalisées.",
        },
        {
          title: 'Widgets Discord natifs',
          desc: 'Messages, temps vocal, niveau et statut de modération affichés en direct sur la fiche de profil Discord de chaque membre.',
        },
        {
          title: 'Dashboard 100 % français',
          desc: "Pensé, écrit et supporté en français, pas traduit à la va-vite depuis l'anglais.",
        },
      ],
    },
    en: {
      eyebrow: 'Catalog',
      titlePrefix: 'modules.',
      titleEmph: 'One',
      titleSuffix: 'subscription.',
      intro:
        "No tier that unlocks the next module: a single paid plan opens the whole catalog, including whatever ships after.",
      exclusivesLabel: "And what no other bot does",
      cta: 'Add Kotbo to my server',
      groups: [
        {
          key: 'moderation',
          label: 'Moderation & security',
          accent: 'text-red-500',
          modules: [
            'Sanctions', 'AutoMod', 'Discord logs', 'Nickname moderation',
            'Alt accounts', 'Anti-raid protection', 'Ban appeals',
            'Police Code', 'Security verification',
          ],
        },
        {
          key: 'staff',
          label: 'Staff management',
          accent: 'text-indigo-500',
          modules: [
            'Recruitment', 'Staff directory', 'Staff hierarchy & roles',
            'Mentoring & training', 'Meetings', 'Leave', 'Staff polls',
            'Staff discipline', 'Reviews',
          ],
        },
        {
          key: 'community',
          label: 'Community & engagement',
          accent: 'text-amber-500',
          modules: [
            'Leveling & XP', 'Seasons', 'Prestige', 'Clans', 'Drops',
            'Economy & RPG', 'Member marketplace', 'Quests', 'Reputation',
            'Fun channels', 'Daily Algo', 'Support tickets', 'Giveaways',
            'Events & quizzes', 'Suggestions', 'Starlight',
          ],
        },
        {
          key: 'content',
          label: 'Content & communication',
          accent: 'text-cyan-500',
          modules: [
            'Rules', 'Welcome & leave', 'Reaction roles', 'Auto-responses',
            'Auto-threads & channels', 'News & RSS', 'Automatic translation',
            'Digest', 'Custom forms',
          ],
        },
        {
          key: 'integrations',
          label: 'Integrations',
          accent: 'text-emerald-500',
          modules: [
            'Analytics', 'YouTube', 'Twitch', 'Social media',
            'Automations', 'Channel health',
          ],
        },
        {
          key: 'cross_server',
          label: 'Cross-server',
          accent: 'text-violet-500',
          modules: ['Channel links', 'Staff server'],
        },
      ],
      exclusives: [
        {
          title: 'MCP server',
          desc: "Connect Claude or any AI agent to your server: finely-scoped API keys (read stats, write sanctions, tickets...), revocable and logged.",
        },
        {
          title: 'Native Discord widgets',
          desc: "Messages, voice time, level, and moderation status shown live on every member's Discord profile card.",
        },
        {
          title: '100% French dashboard',
          desc: "Designed, written, and supported in French, not hastily translated from English.",
        },
      ],
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const groups = $derived(t.groups);
  const exclusives = $derived(t.exclusives);

  const total = $derived(groups.reduce((sum, g) => sum + g.modules.length, 0));
</script>

<section id="modules" class="py-20 lg:py-24 bg-white">
  <div class="max-w-[90rem] mx-auto px-8">

    <div use:reveal={{ direction: 'up' }} class="text-center max-w-2xl mx-auto mb-12">
      <p class="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 mb-5">{t.eyebrow}</p>
      <h2 class="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-6 font-headline leading-[1.08]">
        {total} {t.titlePrefix}<br /><Emph>{t.titleEmph}</Emph> {t.titleSuffix}
      </h2>
      <p class="text-lg text-gray-500 font-bold leading-relaxed">
        {t.intro}
      </p>
    </div>

    <!-- Catalogue dense : le nombre fait l'argument, pas la mise en scene. -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
      {#each groups as group, i (group.key)}
        <div
          use:reveal={{ direction: 'up', delay: (i % 3) * 60 }}
          class="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div class="flex items-baseline justify-between gap-3 mb-4">
            <h3 class="text-[11px] font-black uppercase tracking-widest {group.accent}">
              {group.label}
            </h3>
            <span class="text-[11px] font-black text-gray-300 tabular-nums">{group.modules.length}</span>
          </div>
          <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-2">
            {#each group.modules as module (module)}
              {@const page = featureOfModule(module)}
              <li class="flex items-center gap-2 text-sm font-bold text-gray-600 leading-tight">
                <Check class="w-3.5 h-3.5 text-gray-300 shrink-0" strokeWidth={4} />
                <!-- Les modules qui ont leur page y mènent : c'est le lien
                     interne le plus fort vers elles. -->
                {#if page}
                  <a href="{base}{featurePath(page.slug, getLocale())}" class="underline decoration-gray-300 underline-offset-4 hover:text-gray-900 hover:decoration-gray-900">{module}</a>
                {:else}
                  {module}
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>

    <!-- Ce que les autres n'ont pas du tout. -->
    <div use:reveal={{ direction: 'up', delay: 80 }} class="max-w-6xl mx-auto mt-10">
      <div class="rounded-2xl border-2 border-indigo-100 bg-indigo-50/40 p-6 sm:p-8">
        <p class="text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-5">
          {t.exclusivesLabel}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {#each exclusives as item (item.title)}
            <div>
              <h3 class="text-base font-black text-gray-900 mb-1.5">{item.title}</h3>
              <p class="text-sm text-gray-500 font-medium leading-snug">{item.desc}</p>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <div use:reveal={{ direction: 'up', delay: 120 }} class="text-center mt-14">
      <a
        href={inviteUrl}
        class="inline-block bg-indigo-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1"
      >
        {t.cta}
      </a>
    </div>
  </div>
</section>
