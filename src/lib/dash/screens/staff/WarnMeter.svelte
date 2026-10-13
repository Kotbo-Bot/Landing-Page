<!--
  Où en est un membre sur l'échelle des avertissements : un cran par
  avertissement actif, jusqu'au seuil de rétrogradation. Recopie du dashboard.
-->
<script lang="ts">
  import { getLocale } from '$lib/i18n/state.svelte';

  const TEXT = {
    fr: { none: 'aucun avertissement actif', reached: 'seuil de rétrogradation atteint', left: (n: number) => `encore ${n} avant rétrogradation` },
    en: { none: 'no active warning', reached: 'demotion threshold reached', left: (n: number) => `${n} left before demotion` },
  };

  const {
    count,
    threshold,
    showLabel = true,
  }: { count: number; threshold: number; showLabel?: boolean } = $props();

  const t = $derived(TEXT[getLocale()]);
  const steps = $derived(Math.max(1, Math.min(threshold || 3, 8)));
  const tone = $derived(count === 0 ? 'idle' : count >= steps ? 'danger' : count >= steps - 1 ? 'warning' : 'notice');
  const label = $derived(count === 0 ? t.none : count >= steps ? t.reached : t.left(steps - count));
</script>

<span class="warn-meter warn-meter--{tone}" title="{count}/{steps} · {label}">
  <span class="warn-meter__track" aria-hidden="true">
    {#each Array(steps) as _, i (i)}
      <span class="warn-meter__step" class:on={i < count}></span>
    {/each}
  </span>
  {#if showLabel}
    <span class="warn-meter__label tabular-nums">{count}/{steps}</span>
  {/if}
  <span class="sr-only">{label}</span>
</span>

<style>
  .warn-meter {
    --tone: var(--on-surface-variant);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  .warn-meter--notice { --tone: var(--warning-color); }
  .warn-meter--warning { --tone: var(--warning-color); }
  .warn-meter--danger { --tone: var(--error-color); }

  .warn-meter__track {
    display: inline-flex;
    gap: 3px;
  }
  .warn-meter__step {
    width: 10px;
    height: 6px;
    border-radius: 2px;
    background: var(--surface-container-high);
    transition: background-color 0.2s ease;
  }
  .warn-meter__step.on {
    background: var(--tone);
  }
  .warn-meter__label {
    font-size: 0.75rem;
    color: var(--on-surface-variant);
  }
  .warn-meter--warning .warn-meter__label,
  .warn-meter--danger .warn-meter__label {
    color: var(--tone);
    font-weight: 600;
  }
</style>
