<script lang="ts">
  /**
   * Le bouton d'invitation de l'accueil v3, partout le même.
   *
   * Il emporte la config choisie dans « /setup » (`encodeKit`) jusqu'au
   * parcours d'installation du dashboard, et mesure le clic avant de partir.
   * Le logo Discord dit où l'on va : on quitte le site pour l'écran
   * d'autorisation de Discord, pas pour un formulaire.
   */
  import { inviteUrl, track } from '$lib/funnel';
  import { builder, encodeKit } from '$lib/playground/kit.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';

  interface Props {
    /** Emplacement du bouton, repris dans la mesure (`hero`, `final`…). */
    content: string;
    size?: 'sm' | 'md' | 'lg';
    tone?: 'primary' | 'white';
    class?: string;
  }

  const { content, size = 'md', tone = 'primary', class: className = '' }: Props = $props();

  const TEXT = {
    fr: { label: 'Ajouter à Discord', short: 'Ajouter' },
    en: { label: 'Add to Discord', short: 'Add' },
  };
  const t = $derived(TEXT[getLocale()]);
  const href = $derived(inviteUrl(content, encodeKit(builder.kit)));

  const SIZES = {
    sm: 'min-h-10 gap-2 px-4 text-sm',
    md: 'min-h-12 gap-2.5 px-5 text-base',
    lg: 'min-h-14 gap-3 px-7 text-lg',
  } as const;
  const TONES = {
    primary: 'bg-[#4f46e5] text-white hover:bg-[#4338ca]',
    white: 'bg-white text-night hover:bg-indigo-100',
  } as const;
</script>

<a
  {href}
  onclick={() => track('invite_clicked', { content })}
  class="group inline-flex items-center justify-center rounded-xl font-bold transition-[background-color,transform] active:translate-y-px {SIZES[size]} {TONES[tone]} {className}"
>
  <svg aria-hidden="true" viewBox="0 0 24 24" class="{size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} shrink-0 fill-current">
    <path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.44.87-.61 1.25a18.3 18.3 0 0 0-5.49 0 12.6 12.6 0 0 0-.62-1.25.08.08 0 0 0-.08-.04 19.7 19.7 0 0 0-4.88 1.52.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 0 0 .03.05 19.9 19.9 0 0 0 5.99 3.03.08.08 0 0 0 .08-.03c.46-.63.87-1.3 1.23-1.99a.08.08 0 0 0-.04-.1 13.1 13.1 0 0 1-1.87-.9.08.08 0 0 1-.01-.13l.37-.29a.07.07 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08 0l.37.3a.08.08 0 0 1 0 .13c-.6.35-1.22.65-1.87.9a.08.08 0 0 0-.04.1c.36.7.77 1.36 1.22 1.99a.08.08 0 0 0 .08.03 19.8 19.8 0 0 0 6-3.03.08.08 0 0 0 .03-.05c.5-5.18-.84-9.67-3.55-13.66a.06.06 0 0 0-.03-.03ZM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.96 2.42-2.16 2.42Zm7.97 0c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.94 2.42-2.16 2.42Z" />
  </svg>
  <span class={size === 'sm' ? 'hidden sm:inline' : ''}>{t.label}</span>
  {#if size === 'sm'}<span class="sm:hidden">{t.short}</span>{/if}
</a>
