<script lang="ts">
  /**
   * Le bouton d'invitation de la page, partout le même.
   *
   * Dès que le visiteur a nommé son serveur, il dit « Ajouter Kotbo à Les
   * Nerds » au lieu d'une formule générale : c'est le motif d'identité de la
   * v2 (DESIGN.md), et c'est ce qui rend le clic naturel. On n'invite plus un
   * bot, on termine ce qu'on vient de monter.
   *
   * Le lien emporte les réglages du serveur monté (`encodeKit`), et le clic est
   * mesuré avant que le navigateur parte vers l'API.
   */
  import { inviteUrl, track } from '$lib/funnel';
  import { builder, encodeKit } from './kit.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';

  interface Props {
    /** Emplacement du bouton, repris dans la mesure (`hero`, `crisis`…). */
    content: string;
    tone?: 'accent' | 'ink' | 'light';
    size?: 'md' | 'lg';
    class?: string;
  }

  const { content, tone = 'accent', size = 'md', class: className = '' }: Props = $props();

  const TEXT = {
    fr: {
      generic: 'Ajouter Kotbo à mon serveur',
      named: (name: string) => `Ajouter Kotbo à ${name}`,
    },
    en: {
      generic: 'Add Kotbo to my server',
      named: (name: string) => `Add Kotbo to ${name}`,
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const name = $derived(builder.kit.name.trim());
  const href = $derived(inviteUrl(content, encodeKit(builder.kit)));

  const TONES = {
    accent: 'bg-indigo-600 text-white hover:bg-indigo-700',
    ink: 'bg-gray-900 text-white hover:bg-gray-800',
    light: 'bg-white text-gray-900 hover:bg-indigo-50',
  } as const;

  const SIZES = {
    md: 'min-h-11 px-5 text-sm',
    lg: 'min-h-13 px-7 text-base',
  } as const;
</script>

<a
  {href}
  onclick={() => track('invite_clicked', { content })}
  class="inline-flex max-w-full items-center justify-center rounded-xl text-center font-bold transition-colors {TONES[tone]} {SIZES[size]} {className}"
>
  <span class="truncate">{name ? t.named(name) : t.generic}</span>
</a>
