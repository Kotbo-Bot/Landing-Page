<!--
  Réponses types du support : réponses pré-écrites que le staff insère depuis
  un ticket, avec leurs actions (type, rôles, satisfaction, fermeture).

  Recopie de `Kotbo/apps/dashboard/src/lib/components/tickets/TicketMacros.svelte`
  (branche `recette`). Le dashboard écrit ces textes en dur, en français ; ils
  passent ici par `TEXT`. Création, modification et suppression changent la
  liste de démo. Les deux listes à choix multiples (`MultiSelect`, types et
  rôles) deviennent des pastilles à cocher ; « Supprimer » demande
  confirmation comme là-bas.
-->
<script lang="ts">
  import { Button, Modal, Papicon, FormInput } from '$lib/dash/ui';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { buildMacros, MACRO_ROLES, MACRO_TICKET_TYPES, type DemoMacro } from '$lib/dash/fixtures/tickets';
  import FormTextarea from './FormTextarea.svelte';
  import { dialog } from './a11y';
  import type { Ask } from './confirm';
  import type { Toasts } from './toastStore.svelte';

  const TEXT = {
    fr: {
      title: 'Macros',
      introPre: "Réponses pré-écrites que le staff insère depuis le bouton « Macros » d'un ticket. Variables disponibles :",
      newMacro: 'Nouvelle macro',
      empty: 'Aucune macro',
      emptyDesc: 'Crée tes réponses récurrentes : le staff les enverra en deux clics, avec les actions qui vont avec.',
      disabled: 'désactivée',
      autoOnOpen: "auto à l'ouverture",
      uses: (count: number) => `${count} utilisation${count > 1 ? 's' : ''}`,
      keywords: (list: string) => `· mots-clés : ${list}`,
      requalify: 'requalifie',
      addsRole: 'pose un rôle',
      removesRole: 'retire un rôle',
      survey: 'sonde',
      closes: 'ferme',
      edit: 'Modifier',
      delete: 'Supprimer',
      required: 'Le nom et le contenu sont obligatoires.',
      updated: 'Macro mise à jour',
      created: 'Macro créée',
      deleteTitle: 'Supprimer cette macro ?',
      deleteDesc: (name: string) => `« ${name} » sera définitivement retirée du sélecteur du staff.`,
      deleted: 'Macro supprimée',
      editTitle: 'Modifier la macro',
      subtitle: "Le texte est envoyé dans le salon du ticket, puis les actions s'appliquent.",
      name: 'Nom',
      namePh: 'Demande de preuves',
      category: 'Catégorie',
      categoryPh: 'Modération',
      emoji: 'Emoji',
      content: 'Contenu',
      contentPh: 'Bonjour {user}, pourriez-vous joindre une capture ?',
      contentHint: "2000 caractères maximum, la limite d'un message Discord.",
      types: 'Types de ticket concernés',
      typesAll: 'Tous les types',
      roles: 'Rôles autorisés',
      rolesAll: 'Tout le staff',
      kw: 'Mots-clés de suggestion',
      kwPh: 'remboursement, facture, paiement',
      kwHint: "Séparés par des virgules. Si l'un d'eux apparaît dans la demande, la macro remonte en tête du sélecteur.",
      actions: 'Actions attachées',
      actionsHint: "Appliquées après l'envoi du texte. La fermeture vient toujours en dernier.",
      setType: 'Requalifier en',
      noChange: 'Ne pas changer',
      addRole: 'Ajouter le rôle',
      removeRole: 'Retirer le rôle',
      none: 'Aucun',
      requestSatisfaction: "Déclencher l'enquête de satisfaction",
      closeTicket: 'Fermer le ticket',
      autoSend: "Envoyer automatiquement à l'ouverture",
      autoSendDesc: "Seul le texte part : les actions attachées ne s'appliquent pas, fermer ou requalifier un ticket qui vient de naître ferait plus de dégâts que de bien.",
      active: 'Macro active',
      cancel: 'Annuler',
      save: 'Enregistrer',
    },
    en: {
      title: 'Macros',
      introPre: 'Pre-written replies the staff inserts from the "Macros" button of a ticket. Available variables:',
      newMacro: 'New macro',
      empty: 'No macros',
      emptyDesc: 'Write your recurring replies: the staff sends them in two clicks, with the actions that go with them.',
      disabled: 'disabled',
      autoOnOpen: 'auto on open',
      uses: (count: number) => `${count} use${count > 1 ? 's' : ''}`,
      keywords: (list: string) => `· keywords: ${list}`,
      requalify: 'retypes',
      addsRole: 'adds a role',
      removesRole: 'removes a role',
      survey: 'surveys',
      closes: 'closes',
      edit: 'Edit',
      delete: 'Delete',
      required: 'Name and content are required.',
      updated: 'Macro updated',
      created: 'Macro created',
      deleteTitle: 'Delete this macro?',
      deleteDesc: (name: string) => `"${name}" will be permanently removed from the staff picker.`,
      deleted: 'Macro deleted',
      editTitle: 'Edit macro',
      subtitle: 'The text is sent in the ticket channel, then the actions apply.',
      name: 'Name',
      namePh: 'Ask for evidence',
      category: 'Category',
      categoryPh: 'Moderation',
      emoji: 'Emoji',
      content: 'Content',
      contentPh: 'Hi {user}, could you attach a screenshot?',
      contentHint: '2000 characters max, the limit of a Discord message.',
      types: 'Ticket types',
      typesAll: 'All types',
      roles: 'Allowed roles',
      rolesAll: 'All staff',
      kw: 'Suggestion keywords',
      kwPh: 'refund, invoice, payment',
      kwHint: 'Comma-separated. If one appears in the request, the macro moves to the top of the picker.',
      actions: 'Attached actions',
      actionsHint: 'Applied after the text is sent. Closing always comes last.',
      setType: 'Retype as',
      noChange: "Don't change",
      addRole: 'Add role',
      removeRole: 'Remove role',
      none: 'None',
      requestSatisfaction: 'Trigger the satisfaction survey',
      closeTicket: 'Close the ticket',
      autoSend: 'Send automatically on open',
      autoSendDesc: 'Only the text goes out: attached actions do not apply, closing or retyping a ticket that was just born would do more harm than good.',
      active: 'Macro enabled',
      cancel: 'Cancel',
      save: 'Save',
    },
  };

  const { ask, toasts }: { ask: Ask; toasts: Toasts } = $props();

  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);

  let macros = $state<DemoMacro[]>(buildMacros());
  let macroModalOpen = $state(false);
  /** `null` = création ; sinon l'identifiant de la macro modifiée. */
  let editingMacroId = $state<string | null>(null);
  let macroForm = $state(emptyMacroForm());
  /** Saisie libre des mots-clés, convertie en tableau à l'enregistrement. */
  let macroKeywordsText = $state('');

  function emptyMacroForm() {
    return {
      name: '',
      category: '',
      emoji: '',
      content: '',
      enabled: true,
      ticketTypeIds: [] as string[],
      allowedRoleIds: [] as string[],
      autoSendOnOpen: false,
      setTicketTypeId: '',
      addRoleId: '',
      removeRoleId: '',
      requestSatisfaction: false,
      closeTicket: false,
    };
  }

  /** Résumé des actions attachées, pour la ligne de la liste. */
  function macroActionSummary(macro: DemoMacro): string {
    const parts: string[] = [];
    if (macro.setTicketTypeId) parts.push(t.requalify);
    if (macro.addRoleId) parts.push(t.addsRole);
    if (macro.removeRoleId) parts.push(t.removesRole);
    if (macro.requestSatisfaction) parts.push(t.survey);
    if (macro.closeTicket) parts.push(t.closes);
    return parts.join(', ');
  }

  function openNewMacro() {
    editingMacroId = null;
    macroForm = emptyMacroForm();
    macroKeywordsText = '';
    macroModalOpen = true;
  }

  function openEditMacro(macro: DemoMacro) {
    editingMacroId = macro.id;
    macroForm = {
      name: macro.name[locale],
      category: macro.category?.[locale] ?? '',
      emoji: macro.emoji ?? '',
      content: macro.content[locale],
      enabled: macro.enabled,
      ticketTypeIds: [],
      allowedRoleIds: [],
      autoSendOnOpen: macro.autoSendOnOpen,
      setTicketTypeId: macro.setTicketTypeId ?? '',
      addRoleId: macro.addRoleId ?? '',
      removeRoleId: macro.removeRoleId ?? '',
      requestSatisfaction: macro.requestSatisfaction,
      closeTicket: macro.closeTicket,
    };
    macroKeywordsText = macro.keywords.join(', ');
    macroModalOpen = true;
  }

  function saveMacro() {
    const name = macroForm.name.trim();
    const content = macroForm.content.trim();
    if (!name || !content) {
      toasts.error(t.required);
      return;
    }
    const both = (value: string) => ({ fr: value, en: value });
    const fields = {
      name: both(name),
      category: macroForm.category.trim() ? both(macroForm.category.trim()) : null,
      emoji: macroForm.emoji.trim() || null,
      content: both(content),
      enabled: macroForm.enabled,
      keywords: macroKeywordsText.split(',').map((k) => k.trim()).filter(Boolean),
      autoSendOnOpen: macroForm.autoSendOnOpen,
      // Chaînes vides = « pas d'action ».
      setTicketTypeId: macroForm.setTicketTypeId || null,
      addRoleId: macroForm.addRoleId || null,
      removeRoleId: macroForm.removeRoleId || null,
      requestSatisfaction: macroForm.requestSatisfaction,
      closeTicket: macroForm.closeTicket,
    };
    if (editingMacroId) {
      macros = macros.map((macro) => (macro.id === editingMacroId ? { ...macro, ...fields } : macro));
    } else {
      macros = [...macros, { id: `mc-${Date.now()}`, usageCount: 0, ...fields }];
    }
    toasts.success(editingMacroId ? t.updated : t.created);
    macroModalOpen = false;
  }

  async function deleteMacro(macro: DemoMacro) {
    const confirmed = await ask({ title: t.deleteTitle, description: t.deleteDesc(macro.name[locale]), confirmLabel: t.delete, variant: 'danger' });
    if (!confirmed) return;
    macros = macros.filter((item) => item.id !== macro.id);
    toasts.success(t.deleted);
  }

  function toggleIn(list: string[], id: string): string[] {
    return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
  }
</script>

<div class="max-w-4xl mx-auto space-y-4">
  <div class="flex items-start justify-between gap-4 pb-2">
    <div>
      <h3 class="text-lg font-semibold text-on-surface">{t.title}</h3>
      <p class="text-on-surface-variant text-xs mt-0.5">
        {t.introPre} <code class="px-1 rounded bg-surface-container">{'{user}'}</code>,
        <code class="px-1 rounded bg-surface-container">{'{staff}'}</code>,
        <code class="px-1 rounded bg-surface-container">{'{ticket_id}'}</code>,
        <code class="px-1 rounded bg-surface-container">{'{ticket_type}'}</code>,
        <code class="px-1 rounded bg-surface-container">{'{server}'}</code>.
      </p>
    </div>
    <Button variant="primary" icon="plus" onclick={openNewMacro}>{t.newMacro}</Button>
  </div>

  {#if macros.length === 0}
    <div class="rounded-xl border border-outline-variant/10 bg-surface-container-low/40 p-8 text-center">
      <Papicon icon="zap" size={28} class="text-on-surface-variant/40 mx-auto mb-2" />
      <p class="text-sm font-semibold text-on-surface">{t.empty}</p>
      <p class="text-xs text-on-surface-variant mt-1">{t.emptyDesc}</p>
    </div>
  {:else}
    <div class="space-y-2">
      {#each macros as macro (macro.id)}
        <div class="rounded-xl border border-outline-variant/10 bg-surface-container-low/40 p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                {#if macro.emoji}<span class="text-sm">{macro.emoji}</span>{/if}
                <span class="text-sm font-semibold text-on-surface">{macro.name[locale]}</span>
                {#if macro.category}
                  <span class="text-2xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">{macro.category[locale]}</span>
                {/if}
                {#if !macro.enabled}
                  <span class="text-2xs px-1.5 py-0.5 rounded bg-error/10 text-error">{t.disabled}</span>
                {/if}
                {#if macro.autoSendOnOpen}
                  <span class="text-2xs px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400">{t.autoOnOpen}</span>
                {/if}
              </div>
              <p class="text-xs text-on-surface-variant/80 mt-1.5 line-clamp-2 whitespace-pre-wrap">{macro.content[locale]}</p>
              <div class="flex items-center gap-3 mt-2 text-2xs text-on-surface-variant">
                <span>{t.uses(macro.usageCount)}</span>
                {#if macro.keywords.length}
                  <span>{t.keywords(macro.keywords.join(', '))}</span>
                {/if}
                {#if macroActionSummary(macro)}
                  <span>· {macroActionSummary(macro)}</span>
                {/if}
              </div>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button
                type="button"
                class="p-2 rounded-lg hover:bg-white/5 text-on-surface-variant hover:text-on-surface transition-colors"
                title={t.edit}
                aria-label={t.edit}
                onclick={() => openEditMacro(macro)}
              >
                <Papicon icon="pencil" size={15} />
              </button>
              <button
                type="button"
                class="p-2 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                title={t.delete}
                aria-label={t.delete}
                onclick={() => deleteMacro(macro)}
              >
                <Papicon icon="trash" size={15} />
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Création / modification d'une macro -->
{#if macroModalOpen}
  <div class="contents" use:dialog={() => (macroModalOpen = false)}>
    <Modal bind:open={macroModalOpen} title={editingMacroId ? t.editTitle : t.newMacro} subtitle={t.subtitle} size="lg">
      <div class="space-y-4">
        <div class="grid grid-cols-[1fr_140px_80px] gap-3">
          <label class="block">
            <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.name}</span>
            <FormInput type="text" bind:value={macroForm.name} placeholder={t.namePh} className="w-full" />
          </label>
          <label class="block">
            <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.category}</span>
            <FormInput type="text" bind:value={macroForm.category} placeholder={t.categoryPh} className="w-full" />
          </label>
          <label class="block">
            <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.emoji}</span>
            <FormInput type="text" bind:value={macroForm.emoji} placeholder="📎" className="w-full" />
          </label>
        </div>

        <label class="block">
          <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.content}</span>
          <FormTextarea bind:value={macroForm.content} placeholder={t.contentPh} className="w-full h-28" />
          <span class="text-2xs text-on-surface-variant ml-1 mt-1 block">{t.contentHint}</span>
        </label>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.types}</span>
            <div class="flex flex-wrap gap-1.5" role="group" aria-label={t.types}>
              {#each MACRO_TICKET_TYPES as type (type.id)}
                <button type="button" class="filter-pill" aria-pressed={macroForm.ticketTypeIds.includes(type.id)} onclick={() => (macroForm.ticketTypeIds = toggleIn(macroForm.ticketTypeIds, type.id))}>{type.label[locale]}</button>
              {/each}
            </div>
            {#if macroForm.ticketTypeIds.length === 0}<span class="text-2xs text-on-surface-variant ml-1 mt-1 block">{t.typesAll}</span>{/if}
          </div>
          <div>
            <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.roles}</span>
            <div class="flex flex-wrap gap-1.5" role="group" aria-label={t.roles}>
              {#each MACRO_ROLES as role (role.id)}
                <button type="button" class="filter-pill" aria-pressed={macroForm.allowedRoleIds.includes(role.id)} onclick={() => (macroForm.allowedRoleIds = toggleIn(macroForm.allowedRoleIds, role.id))}>@{role.name}</button>
              {/each}
            </div>
            {#if macroForm.allowedRoleIds.length === 0}<span class="text-2xs text-on-surface-variant ml-1 mt-1 block">{t.rolesAll}</span>{/if}
          </div>
        </div>

        <label class="block">
          <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.kw}</span>
          <FormInput type="text" bind:value={macroKeywordsText} placeholder={t.kwPh} className="w-full" />
          <span class="text-2xs text-on-surface-variant ml-1 mt-1 block">{t.kwHint}</span>
        </label>

        <div class="border-t border-outline-variant/10 pt-4 space-y-3">
          <p class="text-xs font-bold text-on-surface">{t.actions}</p>
          <p class="text-2xs text-on-surface-variant -mt-2">{t.actionsHint}</p>

          <div class="grid grid-cols-2 gap-3">
            <label class="block">
              <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.setType}</span>
              <select bind:value={macroForm.setTicketTypeId} class="input w-full">
                <option value="">{t.noChange}</option>
                {#each MACRO_TICKET_TYPES as type (type.id)}
                  <option value={type.id}>{type.label[locale]}</option>
                {/each}
              </select>
            </label>
            <label class="block">
              <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.addRole}</span>
              <select bind:value={macroForm.addRoleId} class="input w-full">
                <option value="">{t.none}</option>
                {#each MACRO_ROLES as role (role.id)}
                  <option value={role.id}>@{role.name}</option>
                {/each}
              </select>
            </label>
            <label class="block">
              <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.removeRole}</span>
              <select bind:value={macroForm.removeRoleId} class="input w-full">
                <option value="">{t.none}</option>
                {#each MACRO_ROLES as role (role.id)}
                  <option value={role.id}>@{role.name}</option>
                {/each}
              </select>
            </label>
          </div>

          <label class="flex items-center gap-3 cursor-pointer p-2.5 hover:bg-white/5 rounded-xl transition-colors">
            <input type="checkbox" bind:checked={macroForm.requestSatisfaction} class="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant/30" />
            <span class="text-xs font-bold text-on-surface">{t.requestSatisfaction}</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer p-2.5 hover:bg-white/5 rounded-xl transition-colors">
            <input type="checkbox" bind:checked={macroForm.closeTicket} class="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant/30" />
            <span class="text-xs font-bold text-on-surface">{t.closeTicket}</span>
          </label>
        </div>

        <div class="border-t border-outline-variant/10 pt-4 space-y-3">
          <label class="flex items-center gap-3 cursor-pointer p-2.5 hover:bg-white/5 rounded-xl transition-colors">
            <input type="checkbox" bind:checked={macroForm.autoSendOnOpen} class="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant/30" />
            <div>
              <span class="text-xs font-bold text-on-surface">{t.autoSend}</span>
              <p class="text-2xs text-on-surface-variant">{t.autoSendDesc}</p>
            </div>
          </label>
          <label class="flex items-center gap-3 cursor-pointer p-2.5 hover:bg-white/5 rounded-xl transition-colors">
            <input type="checkbox" bind:checked={macroForm.enabled} class="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant/30" />
            <span class="text-xs font-bold text-on-surface">{t.active}</span>
          </label>
        </div>

        <div class="flex justify-end gap-2 pt-1">
          <Button onclick={() => (macroModalOpen = false)}>{t.cancel}</Button>
          <Button variant="primary" onclick={saveMacro}>{t.save}</Button>
        </div>
      </div>
    </Modal>
  </div>
{/if}
