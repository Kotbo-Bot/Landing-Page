<!--
  Fenêtre du dashboard : fond assombri, panneau, en-tête avec bouton de
  fermeture, corps qui défile, pied fixe.

  Recopie de `Kotbo/apps/dashboard/src/lib/components/Modal.svelte` (branche
  `recette`), mêmes tailles et mêmes classes. Deux différences, parce que
  l'écran est un aperçu posé dans la page et non une application plein écran :
  - pas de téléportation dans `<body>` (hors de `.dash`, la fenêtre perdrait
    le thème) ;
  - `contained` (par défaut) la cale en `position: absolute` sur l'ancêtre
    positionné le plus proche, le cadre de l'aperçu, au lieu de couvrir la
    fenêtre du navigateur, mesure sa hauteur sur ce cadre (`%` au lieu de
    `vh`) et ne bloque pas le défilement de la page.
    `contained={false}` retrouve le `position: fixed` du dashboard.
  Le texte des boutons de fermeture passe par `TEXT`.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Papicon from '$lib/dash/Papicon.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';

  const TEXT = {
    fr: { closeBackdrop: 'Fermer la fenêtre', close: 'Fermer' },
    en: { closeBackdrop: 'Close the window', close: 'Close' },
  };

  let {
    open = $bindable(false),
    onClose = () => {},
    title = '',
    subtitle = '',
    size = 'md',
    showCloseButton = true,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    aboveCase = false,
    contained = true,
    children,
    footer,
  }: {
    open?: boolean;
    onClose?: (e?: Event) => void;
    title?: string;
    subtitle?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'screen';
    showCloseButton?: boolean;
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
    /** Ouverte depuis le dossier membre : passe au-dessus de lui au lieu de dessous. */
    aboveCase?: boolean;
    /** Calée sur le cadre de l'aperçu (absolute) plutôt que sur la fenêtre (fixed). */
    contained?: boolean;
    children?: Snippet;
    /** Barre d'actions fixe sous le contenu défilant (ex : Annuler / Enregistrer). */
    footer?: Snippet;
  } = $props();

  const t = $derived(TEXT[getLocale()]);
  const titleId = $props.id();

  const sizeClasses: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
    screen: 'max-w-none',
  };

  const isScreen = $derived(size === 'screen');

  function handleBackdropClick(e: Event) {
    if (closeOnBackdropClick && e.currentTarget === e.target) {
      open = false;
      onClose(e);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (closeOnEscape && e.key === 'Escape') {
      open = false;
      onClose(e);
    }
  }

  $effect(() => {
    if (contained) return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

{#if open}
  <div
    class="app-modal {aboveCase ? 'app-modal--above-case' : ''} {contained ? 'absolute' : 'fixed'} inset-0 flex items-center justify-center {isScreen ? 'p-0 sm:p-4' : 'p-4'}"
    role="dialog"
    aria-modal="true"
    aria-labelledby={title ? titleId : undefined}
  >
    <!-- Fond -->
    <div
      class="absolute inset-0 bg-black/40"
      onclick={handleBackdropClick}
      onkeydown={handleKeydown}
      onkeypress={(e) => e.key === 'Enter' && handleBackdropClick(e)}
      tabindex="-1"
      role="button"
      aria-label={t.closeBackdrop}
    ></div>

    <!-- Panneau -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="app-modal__panel relative w-full {sizeClasses[size]} bg-surface-container-lowest shadow-lg overflow-hidden border border-outline-variant flex flex-col animate-in fade-in slide-up duration-150 {isScreen
        ? `h-full rounded-none ${contained ? 'sm:h-[calc(100%-2rem)]' : 'sm:h-[calc(100vh-2rem)]'} sm:rounded-xl`
        : `rounded-xl ${contained ? 'max-h-[90%]' : 'max-h-[90vh]'}`}"
      onclick={(e) => e.stopPropagation()}
    >
      {#if title || showCloseButton}
        <header class="app-modal__header px-5 py-4 border-b border-outline-variant flex items-center justify-between">
          <div class="min-w-0 flex-1">
            {#if title}
              <h3 id={titleId} class="text-base font-semibold text-on-surface">{title}</h3>
            {/if}
            {#if subtitle}
              <p class="text-sm text-on-surface-variant mt-0.5">{subtitle}</p>
            {/if}
          </div>
          {#if showCloseButton}
            <button
              type="button"
              onclick={(e) => { open = false; onClose(e); }}
              class="ml-3 h-8 w-8 flex items-center justify-center rounded-md bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface"
              aria-label={t.close}
            >
              <Papicon icon="x" size={14} />
            </button>
          {/if}
        </header>
      {/if}

      <!-- Le seul conteneur qui défile : un enfant ne doit pas en ajouter un
           second en pleine hauteur, sinon deux barres de défilement. -->
      <div class="app-modal__body flex-1 min-h-0 overflow-y-auto">
        {@render children?.()}
      </div>

      <!-- Le pied reste en place pendant que le corps défile. -->
      {#if footer}
        <footer class="app-modal__footer px-5 py-3.5 border-t border-outline-variant bg-surface-container-lowest shrink-0">
          {@render footer()}
        </footer>
      {/if}
    </div>
  </div>
{/if}
