<!--
  Bouton du dashboard, recopié de `Kotbo/apps/dashboard/src/lib/components/ui/Button.svelte`.
  Quatre variantes, deux tailles :
  - primary   : l'action principale de la zone, une seule par zone
  - secondary : les actions courantes
  - ghost     : les actions discrètes (annuler, fermer, liens d'appoint)
  - danger    : supprimer, révoquer, réinitialiser
  Avec `href`, il rend un lien qui a l'apparence d'un bouton.

  Un bouton désactivé dit pourquoi : avec `disabledReason`, il garde son air
  grisé mais reste cliquable. Le dashboard affiche alors la raison dans une
  notification ; le site n'a pas de notifications, la raison passe par
  `onexplain` (au choix de l'écran) et reste lisible au survol.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import Papicon from '$lib/components/Papicon.svelte';

  type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

  const {
    variant = 'secondary',
    size = 'md',
    icon = '',
    iconRight = '',
    loading = false,
    fullWidth = false,
    href = undefined,
    target = undefined,
    type = 'button',
    disabled = false,
    disabledReason = '',
    onexplain = undefined,
    class: className = '',
    children,
    onclick,
    ...rest
  }: {
    variant?: Variant;
    size?: 'sm' | 'md';
    /** Icône avant le libellé. Seule, sans libellé, le bouton devient carré : passer alors `aria-label`. */
    icon?: string;
    iconRight?: string;
    /** Affiche un indicateur et bloque le clic pendant une action en cours. */
    loading?: boolean;
    fullWidth?: boolean;
    href?: string;
    /** Avec `href` : `_blank` ouvre un nouvel onglet (rel=noopener posé d'office). */
    target?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    /** Ce qui manque pour pouvoir cliquer. Affiché au survol et au clic. */
    disabledReason?: string;
    /** Reçoit `disabledReason` au clic d'un bouton désactivé (le toast du dashboard). */
    onexplain?: (reason: string) => void;
    class?: string;
    children?: Snippet;
  } & Omit<HTMLButtonAttributes, 'type' | 'disabled' | 'class'> = $props();

  const VARIANT_CLASS: Record<Variant, string> = {
    primary: 'btn-primary',
    secondary: 'btn-tonal',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };

  const iconSize = $derived(size === 'sm' ? 13 : 15);
  /** Désactivé mais expliqué : reste focalisable et cliquable pour dire pourquoi. */
  const explained = $derived(disabled && !loading && !!disabledReason);

  function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    if (explained) {
      event.preventDefault();
      onexplain?.(disabledReason);
      return;
    }
    onclick?.(event);
  }
  const iconOnly = $derived(!children && !!icon);
  const classes = $derived(
    [
      'btn',
      VARIANT_CLASS[variant],
      size === 'sm' ? 'btn-sm' : '',
      iconOnly ? 'btn-icon' : '',
      fullWidth ? 'w-full' : '',
      className,
    ].filter(Boolean).join(' '),
  );
</script>

{#snippet content()}
  {#if loading}
    <span class="btn-spinner" aria-hidden="true"></span>
  {:else if icon}
    <Papicon {icon} size={iconSize} />
  {/if}
  {@render children?.()}
  {#if iconRight}
    <Papicon icon={iconRight} size={iconSize} />
  {/if}
{/snippet}

{#if href && !disabled}
  <a
    {href}
    {target}
    rel={target === '_blank' ? 'noopener noreferrer' : undefined}
    class={classes}
    {...rest as Record<string, unknown>}
    onclick={onclick as unknown as (event: MouseEvent) => void}
  >
    {@render content()}
  </a>
{:else}
  <button
    type={explained ? 'button' : type}
    class={classes}
    disabled={(disabled && !explained) || loading}
    aria-disabled={explained || undefined}
    aria-busy={loading || undefined}
    {...rest}
    title={explained ? disabledReason : rest.title}
    onclick={handleClick}
  >
    {@render content()}
  </button>
{/if}
