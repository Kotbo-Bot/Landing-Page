<!--
  Configuration du système de tickets.

  Recopie partielle de `Kotbo/apps/dashboard/src/lib/components/tickets/TicketSettings.svelte`
  (branche `recette`, 2 000 lignes) : l'en-tête et ses deux boutons, le
  bandeau d'état, et quatre des onze sections repliables (salons et rôles,
  inactivité, objectifs de service, sondage de satisfaction), avec leur
  balisage d'origine. Les autres (apparence du message, accueil, validation,
  archivage, enregistrement, quotas, types de tickets) ne tiennent pas dans le
  cadre. Différences :
  - les listes déroulantes avec recherche (`SearchableSelect`) deviennent des
    `<select>` simples, sur les salons et rôles du serveur de démo ;
  - un réglage s'applique tout de suite à l'aperçu (sur-revendication,
    objectifs de service) : la barre « modifications non enregistrées » du
    dashboard n'est pas reprise.
-->
<script lang="ts">
  import { Papicon, FormInput } from '$lib/dash/ui';
  import { getLocale } from '$lib/i18n/state.svelte';
  import type { DemoTicketConfig } from '$lib/dash/fixtures/tickets';
  import FormTextarea from './FormTextarea.svelte';
  import type { Ask } from './confirm';
  import type { Toasts } from './toastStore.svelte';

  const TEXT = {
    fr: {
      title: 'Configuration des tickets',
      desc: "Fonctionnement, salons, message d'ouverture et types de tickets.",
      setup: 'Mise en route',
      sendEmbed: 'Envoyer le message',
      setupTitle: 'Mettre le module en route ?',
      setupDesc: "Kotbo crée ce qui manque : la catégorie des tickets, le salon du panneau et le salon des journaux. Ce que tu as déjà choisi est gardé, et le panneau n'est publié que dans un salon tout juste créé.",
      setupBtn: 'Créer les salons',
      setupNothing: "Tout était déjà en place, rien n'a été créé.",
      panelTitle: 'Envoyer le panneau des tickets ?',
      panelDesc: 'Le panneau pour ouvrir un ticket sera publié dans le salon choisi.',
      panelBtn: 'Envoyer le panneau',
      panelSent: 'Panneau des tickets envoyé.',
      ready: 'Les tickets sont opérationnels. Le reste de cette page en affine le comportement.',
      active: 'Actif',
      channelsTitle: 'Salons et rôles',
      channelsDesc: 'Catégorie par défaut, journaux, relais des messages privés et rôle du staff',
      category: 'Catégorie des tickets par défaut',
      panelChannel: "Salon du panneau d'ouverture",
      logChannel: 'Salon des journaux et transcriptions',
      staffRole: 'Rôle staff support par défaut',
      dmRelay: 'Salon de relais des messages privés (mode MP)',
      selectPh: 'Sélectionner',
      selectChannelPh: 'Sélectionner un salon',
      overclaim: 'Autoriser la sur-revendication',
      overclaimDesc: 'Un staff peut reprendre un ticket déjà revendiqué.',
      overclaimWho: 'Qui peut sur-revendiquer ?',
      overclaimAny: 'Tout le staff',
      overclaimSuperior: 'Grade supérieur ou égal',
      autoclaim: 'Prise en charge automatique',
      autoclaimDesc: "Dès qu'un membre du staff écrit dans un ticket ouvert, il en devient automatiquement le référent.",
      inactivityTitle: 'Inactivité',
      inactivityDesc: 'Rappel automatique si le créateur ne répond pas',
      enableReminders: 'Activer les rappels',
      remindersDesc: 'Message automatique après inactivité du créateur.',
      delayHours: 'Délai (heures)',
      inactivityMessage: 'Message ({user} = mention)',
      inactivityPh: 'Bonjour {user}, votre ticket est inactif…',
      staffReminder: 'Relancer le staff quand un membre attend',
      staffReminderDesc: "Si personne du staff n'a répondu au membre après ce délai, le bot mentionne la personne qui a pris le ticket, sinon le rôle staff. Une relance par attente, comptée dans les statistiques.",
      staffReminderMinutes: 'Délai sans réponse (minutes)',
      slaTitle: 'Objectifs de service',
      slaDesc: 'Délais de première réponse et de résolution, suivis dans la boîte de réception.',
      slaFirst: 'Première réponse (minutes)',
      slaNone: 'Aucun objectif',
      slaFirstHint: "Par exemple 60 : un ticket sans réponse au bout d'une heure passe « hors délai ».",
      slaResolution: 'Résolution (heures)',
      slaResolutionHint: "Délai entre l'ouverture et la fermeture.",
      satTitle: 'Sondage de satisfaction',
      satDesc: 'Question facultative posée après la note, à la fermeture du ticket',
      satComment: 'Demander un commentaire',
      satCommentDesc: 'Après avoir noté, le membre peut ajouter un commentaire libre. La note reste enregistrée même sans réponse.',
      satQuestion: 'Question posée',
      satQuestionPh: 'Avez-vous des commentaires à ajouter ?',
      satTimeout: 'Délai (secondes)',
      satHint: 'Laisse la question vide pour utiliser le texte par défaut dans la langue du serveur. Passé le délai (30 à 900 s), le bouton disparaît du message privé.',
      satLog: 'Salon des avis',
      satLogDesc: 'Chaque avis y est republié : note, auteur, staff concerné et commentaire. Laisse vide pour désactiver.',
      satAnonymous: "Masquer l'auteur de l'avis",
      satAnonymousDesc: "Le message affiche « Membre anonyme » à la place du membre. Le tableau de bord, lui, montre toujours l'auteur.",
      categories: ['Support', 'Archives'],
      channels: ['ouvrir-un-ticket', 'tickets-logs', 'staff', 'avis-tickets'],
      roles: ['Staff', 'Modération', 'Support'],
    },
    en: {
      title: 'Ticket configuration',
      desc: 'Operating mode, channels, embed and ticket types.',
      setup: 'Set up',
      sendEmbed: 'Send Embed',
      setupTitle: 'Set the module up?',
      setupDesc: 'The missing channels will be created on the server: the ticket category, the panel channel and the log channel. Channels already selected are kept, and the panel is only published in a freshly created channel.',
      setupBtn: 'Create the channels',
      setupNothing: 'Everything was already in place, nothing was created.',
      panelTitle: 'Send the ticket panel?',
      panelDesc: 'The ticket opening panel will be published in the configured channel.',
      panelBtn: 'Send panel',
      panelSent: 'Ticket panel sent successfully!',
      ready: 'Tickets are up and running. The rest of this page fine-tunes how they behave.',
      active: 'Active',
      channelsTitle: 'Channels & roles',
      channelsDesc: 'Default category, logs, DM relay, staff role and overclaiming',
      category: 'Default ticket category',
      panelChannel: 'Opening panel channel',
      logChannel: 'Logs / transcripts channel',
      staffRole: 'Default support staff role',
      dmRelay: 'Direct message relay channel (DM mode)',
      selectPh: 'Select',
      selectChannelPh: 'Select a channel',
      overclaim: 'Allow overclaiming',
      overclaimDesc: 'A staff member can take over an already claimed ticket.',
      overclaimWho: 'Who can overclaim?',
      overclaimAny: 'All staff',
      overclaimSuperior: 'Higher or equal grade',
      autoclaim: 'Auto-claim on reply',
      autoclaimDesc: 'As soon as a staff member writes in an open ticket, it is automatically claimed by them.',
      inactivityTitle: 'Inactivity',
      inactivityDesc: 'Automatic reminder if the author does not reply',
      enableReminders: 'Enable reminders',
      remindersDesc: 'Automatic message after the author becomes inactive.',
      delayHours: 'Delay (hours)',
      inactivityMessage: 'Message ({user} = mention)',
      inactivityPh: 'Hello {user}, your ticket has been inactive...',
      staffReminder: 'Remind staff when a member is waiting',
      staffReminderDesc: 'If no staff member has replied after this delay, the bot mentions whoever claimed the ticket, otherwise the staff role. One reminder per wait, counted in the stats.',
      staffReminderMinutes: 'Delay without reply (minutes)',
      slaTitle: 'Service targets',
      slaDesc: 'First reply and resolution times, tracked in the inbox.',
      slaFirst: 'First reply (minutes)',
      slaNone: 'No target',
      slaFirstHint: 'For example 60: a ticket without a reply after an hour becomes "overdue".',
      slaResolution: 'Resolution (hours)',
      slaResolutionHint: 'Time between opening and closing.',
      satTitle: 'Satisfaction survey',
      satDesc: 'Optional question asked after the rating, when the ticket closes',
      satComment: 'Ask for a comment',
      satCommentDesc: 'After rating, the member can add a free-text comment. The rating is stored even without an answer.',
      satQuestion: 'Question asked',
      satQuestionPh: 'Anything else you would like to add?',
      satTimeout: 'Timeout (seconds)',
      satHint: 'Leave the question empty to use the default wording in the server language. After the timeout (30 to 900 s), the button disappears from the DM.',
      satLog: 'Reviews channel',
      satLogDesc: 'Every review is reposted there as an embed: rating, author, assigned staff and comment. Leave empty to disable.',
      satAnonymous: 'Hide the review author',
      satAnonymousDesc: 'The embed shows "Anonymous member" instead of the member. The dashboard still shows the author.',
      categories: ['Support', 'Archives'],
      channels: ['open-a-ticket', 'ticket-logs', 'staff', 'ticket-reviews'],
      roles: ['Staff', 'Moderation', 'Support'],
    },
  };

  let { config = $bindable(), ask, toasts }: { config: DemoTicketConfig; ask: Ask; toasts: Toasts } = $props();

  const t = $derived(TEXT[getLocale()]);

  let expandedConfigSection = $state<string | null>(null);
  function toggleConfigSection(section: string) {
    expandedConfigSection = expandedConfigSection === section ? null : section;
  }

  // Réglages de la démo qui ne changent rien d'autre dans l'aperçu.
  let ticketCategoryId = $state('0');
  let ticketChannelId = $state('0');
  let ticketLogChannelId = $state('1');
  let ticketStaffRoleId = $state('0');
  let ticketDmRelayChannelId = $state('');
  let ticketAutoClaimOnReply = $state(false);
  let ticketStaffReminderEnabled = $state(false);
  let ticketStaffReminderMinutes = $state(60);
  let ticketSatisfactionLogChannelId = $state('3');
  let ticketSatisfactionLogAnonymous = $state(false);

  async function runTicketSetup() {
    if (!(await ask({ title: t.setupTitle, description: t.setupDesc, confirmLabel: t.setupBtn }))) return;
    toasts.success(t.setupNothing);
  }

  async function sendEmbedPanel() {
    if (!(await ask({ title: t.panelTitle, description: t.panelDesc, confirmLabel: t.panelBtn }))) return;
    toasts.success(t.panelSent);
  }
</script>

{#snippet sectionHeader(id: string, icon: string, tone: string, title: string, desc: string, badge: boolean)}
  <button onclick={() => toggleConfigSection(id)} aria-expanded={expandedConfigSection === id} class="w-full flex items-center justify-between p-5 hover:bg-white/3 transition-colors text-left">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-lg {tone} flex items-center justify-center shrink-0">
        <Papicon {icon} size={18} />
      </div>
      <div>
        <p class="text-sm font-semibold text-on-surface">{title}</p>
        <p class="text-2xs text-on-surface-variant mt-0.5">{desc}</p>
      </div>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      {#if badge}
        <span class="px-2 py-0.5 rounded-full text-2xs font-semibold uppercase bg-success/10 text-success border border-success/20">{t.active}</span>
      {/if}
      <Papicon icon={expandedConfigSection === id ? 'chevron-up' : 'chevron-down'} size={16} class="text-on-surface-variant/40" />
    </div>
  </button>
{/snippet}

<div class="max-w-4xl mx-auto space-y-4">
  <!-- Actions de l'en-tête -->
  <div class="flex flex-row items-center justify-between gap-3 pb-2">
    <div>
      <h3 class="text-lg font-semibold text-on-surface">{t.title}</h3>
      <p class="text-on-surface-variant text-xs mt-0.5">{t.desc}</p>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button
        onclick={runTicketSetup}
        class="px-4 py-2.5 bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center gap-2 shrink-0"
      >
        <Papicon icon="sparkles" size={13} />
        {t.setup}
      </button>
      <button
        onclick={sendEmbedPanel}
        class="px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-semibold active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center gap-2 shrink-0"
      >
        <Papicon icon="send" size={13} />
        {t.sendEmbed}
      </button>
    </div>
  </div>

  <div class="rounded-xl border border-success/25 bg-success/5 px-4 py-3 flex items-center gap-3">
    <Papicon icon="check-circle" size={16} class="text-success shrink-0" />
    <p class="text-xs text-on-surface">{t.ready}</p>
  </div>

  <!-- ─── Salons et rôles ─── -->
  <div class="rounded-xl border border-outline-variant/10 bg-surface-container-low/40 overflow-hidden">
    {@render sectionHeader('channels', 'hash', 'bg-success/10 text-success', t.channelsTitle, t.channelsDesc, false)}
    {#if expandedConfigSection === 'channels'}
      <div class="px-5 pb-5 space-y-4 border-t border-outline-variant/10 pt-4">
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.category}</span>
            <select bind:value={ticketCategoryId} class="input w-full">
              <option value="">{t.selectPh}</option>
              {#each t.categories as name, index (index)}<option value={String(index)}>{name}</option>{/each}
            </select>
          </label>
          <label class="block">
            <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.panelChannel}</span>
            <select bind:value={ticketChannelId} class="input w-full">
              <option value="">{t.selectPh}</option>
              {#each t.channels as name, index (index)}<option value={String(index)}>#{name}</option>{/each}
            </select>
          </label>
          <label class="block">
            <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.logChannel}</span>
            <select bind:value={ticketLogChannelId} class="input w-full">
              <option value="">{t.selectPh}</option>
              {#each t.channels as name, index (index)}<option value={String(index)}>#{name}</option>{/each}
            </select>
          </label>
          <label class="block">
            <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.staffRole}</span>
            <select bind:value={ticketStaffRoleId} class="input w-full">
              <option value="">{t.selectPh}</option>
              {#each t.roles as name, index (index)}<option value={String(index)}>@{name}</option>{/each}
            </select>
          </label>
          <label class="block col-span-2">
            <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.dmRelay}</span>
            <select bind:value={ticketDmRelayChannelId} class="input w-full">
              <option value="">{t.selectChannelPh}</option>
              {#each t.channels as name, index (index)}<option value={String(index)}>#{name}</option>{/each}
            </select>
          </label>
        </div>

        <div class="border-t border-outline-variant/10 pt-4 space-y-3">
          <label class="flex items-center gap-3 cursor-pointer p-2.5 hover:bg-white/5 rounded-xl transition-colors">
            <input type="checkbox" bind:checked={config.ticketAllowOverclaim} class="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant/30" />
            <div>
              <span class="text-xs font-bold text-on-surface">{t.overclaim}</span>
              <p class="text-2xs text-on-surface-variant">{t.overclaimDesc}</p>
            </div>
          </label>
          {#if config.ticketAllowOverclaim}
            <label class="block ml-7">
              <span class="text-xs font-bold text-on-surface-variant/80 mb-2 block">{t.overclaimWho}</span>
              <select bind:value={config.ticketOverclaimPermission} class="input w-full">
                <option value="ANY">{t.overclaimAny}</option>
                <option value="SUPERIOR_OR_EQUAL">{t.overclaimSuperior}</option>
              </select>
            </label>
          {/if}
          <label class="flex items-center gap-3 cursor-pointer p-2.5 hover:bg-white/5 rounded-xl transition-colors">
            <input type="checkbox" bind:checked={ticketAutoClaimOnReply} class="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant/30" />
            <div>
              <span class="text-xs font-bold text-on-surface">{t.autoclaim}</span>
              <p class="text-2xs text-on-surface-variant">{t.autoclaimDesc}</p>
            </div>
          </label>
        </div>
      </div>
    {/if}
  </div>

  <!-- ─── Inactivité ─── -->
  <div class="rounded-xl border border-outline-variant/10 bg-surface-container-low/40 overflow-hidden">
    {@render sectionHeader('inactivity', 'clock', 'bg-warning/10 text-warning', t.inactivityTitle, t.inactivityDesc, config.ticketInactivityEnabled || ticketStaffReminderEnabled)}
    {#if expandedConfigSection === 'inactivity'}
      <div class="px-5 pb-5 space-y-4 border-t border-outline-variant/10 pt-4">
        <label class="flex items-center gap-3 cursor-pointer p-2.5 hover:bg-white/5 rounded-xl transition-colors">
          <input type="checkbox" bind:checked={config.ticketInactivityEnabled} class="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant/30" />
          <div>
            <span class="text-xs font-bold text-on-surface">{t.enableReminders}</span>
            <p class="text-2xs text-on-surface-variant">{t.remindersDesc}</p>
          </div>
        </label>
        {#if config.ticketInactivityEnabled}
          <div class="grid grid-cols-3 gap-4">
            <label class="block">
              <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.delayHours}</span>
              <input type="number" bind:value={config.ticketInactivityHours} min={1} max={168} class="w-full bg-surface-container-high text-sm px-4 py-2.5 rounded-xl border border-outline-variant/10 focus:ring-1 ring-primary/30 transition-all outline-none" />
            </label>
            <label class="block col-span-2">
              <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.inactivityMessage}</span>
              <FormTextarea bind:value={config.ticketInactivityMessage} placeholder={t.inactivityPh} className="w-full h-20" />
            </label>
          </div>
        {/if}

        <label class="flex items-center gap-3 cursor-pointer p-2.5 hover:bg-white/5 rounded-xl transition-colors">
          <input type="checkbox" bind:checked={ticketStaffReminderEnabled} class="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant/30" />
          <div>
            <span class="text-xs font-bold text-on-surface">{t.staffReminder}</span>
            <p class="text-2xs text-on-surface-variant">{t.staffReminderDesc}</p>
          </div>
        </label>
        {#if ticketStaffReminderEnabled}
          <label class="block sm:max-w-[33%]">
            <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.staffReminderMinutes}</span>
            <input type="number" bind:value={ticketStaffReminderMinutes} min={1} max={10080} class="w-full bg-surface-container-high text-sm px-4 py-2.5 rounded-xl border border-outline-variant/10 focus:ring-1 ring-primary/30 transition-all outline-none" />
          </label>
        {/if}
      </div>
    {/if}
  </div>

  <!-- ─── Objectifs de service ─── -->
  <div class="rounded-xl border border-outline-variant/10 bg-surface-container-low/40 overflow-hidden">
    {@render sectionHeader('sla', 'timer', 'bg-primary/10 text-primary', t.slaTitle, t.slaDesc, !!(config.ticketSlaFirstResponseMinutes || config.ticketSlaResolutionHours))}
    {#if expandedConfigSection === 'sla'}
      <div class="px-5 pb-5 space-y-4 border-t border-outline-variant/10 pt-4">
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-xs font-semibold text-on-surface-variant ml-1 mb-2 block">{t.slaFirst}</span>
            <input type="number" min="1" max="10080" placeholder={t.slaNone} bind:value={config.ticketSlaFirstResponseMinutes} class="input" />
            <span class="text-2xs text-on-surface-variant ml-1 mt-1 block">{t.slaFirstHint}</span>
          </label>
          <label class="block">
            <span class="text-xs font-semibold text-on-surface-variant ml-1 mb-2 block">{t.slaResolution}</span>
            <input type="number" min="1" max="720" placeholder={t.slaNone} bind:value={config.ticketSlaResolutionHours} class="input" />
            <span class="text-2xs text-on-surface-variant ml-1 mt-1 block">{t.slaResolutionHint}</span>
          </label>
        </div>
      </div>
    {/if}
  </div>

  <!-- ─── Sondage de satisfaction ─── -->
  <div class="rounded-xl border border-outline-variant/10 bg-surface-container-low/40 overflow-hidden">
    {@render sectionHeader('satisfaction', 'smile', 'bg-success/10 text-success', t.satTitle, t.satDesc, config.ticketSatisfactionCommentEnabled || !!ticketSatisfactionLogChannelId)}
    {#if expandedConfigSection === 'satisfaction'}
      <div class="px-5 pb-5 space-y-4 border-t border-outline-variant/10 pt-4">
        <label class="flex items-center gap-3 cursor-pointer p-2.5 hover:bg-white/5 rounded-xl transition-colors">
          <input type="checkbox" bind:checked={config.ticketSatisfactionCommentEnabled} class="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant/30" />
          <div>
            <span class="text-xs font-bold text-on-surface">{t.satComment}</span>
            <p class="text-2xs text-on-surface-variant">{t.satCommentDesc}</p>
          </div>
        </label>
        {#if config.ticketSatisfactionCommentEnabled}
          <div class="grid grid-cols-3 gap-4">
            <label class="block col-span-2">
              <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.satQuestion}</span>
              <FormInput type="text" bind:value={config.ticketSatisfactionCommentQuestion} placeholder={t.satQuestionPh} className="w-full" />
            </label>
            <label class="block">
              <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.satTimeout}</span>
              <input type="number" bind:value={config.ticketSatisfactionCommentTimeout} min={30} max={900} step={10} class="w-full bg-surface-container-high text-sm px-4 py-2.5 rounded-xl border border-outline-variant/10 focus:ring-1 ring-primary/30 transition-all outline-none" />
            </label>
          </div>
          <p class="text-2xs text-on-surface-variant ml-1">{t.satHint}</p>
        {/if}

        <div class="pt-2 border-t border-outline-variant/10 space-y-4">
          <label class="block">
            <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.satLog}</span>
            <select bind:value={ticketSatisfactionLogChannelId} class="input w-full">
              <option value="">{t.selectPh}</option>
              {#each t.channels as name, index (index)}<option value={String(index)}>#{name}</option>{/each}
            </select>
            <p class="text-2xs text-on-surface-variant ml-1 mt-1.5">{t.satLogDesc}</p>
          </label>
          {#if ticketSatisfactionLogChannelId}
            <label class="flex items-center gap-3 cursor-pointer p-2.5 hover:bg-white/5 rounded-xl transition-colors">
              <input type="checkbox" bind:checked={ticketSatisfactionLogAnonymous} class="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant/30" />
              <div>
                <span class="text-xs font-bold text-on-surface">{t.satAnonymous}</span>
                <p class="text-2xs text-on-surface-variant">{t.satAnonymousDesc}</p>
              </div>
            </label>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
