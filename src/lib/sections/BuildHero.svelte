<script lang="ts">
  /**
   * Le héros : un onboarding, dès le premier écran.
   *
   * Emprunt direct à l'onboarding d'Async (« premier niveau gratuit, sans
   * compte ») : la valeur arrive avant qu'on demande quoi que ce soit. Le
   * visiteur répond à trois questions (le nom, la vocation, les modules) et
   * voit un Discord se monter à côté. Au bout, « Ajouter Kotbo à Les Nerds » :
   * il a déjà quelque chose à perdre en partant, et le lien emporte ses choix
   * jusqu'au parcours d'installation, qui ne les redemande pas.
   *
   * Tout tient dans la hauteur de l'écran : un titre court, la question du
   * moment, l'aperçu. Rien d'autre ne réclame l'attention avant la fin.
   *
   * Sur téléphone, l'aperçu ne tient pas à côté des questions. Il apparaît
   * sous la question dès la deuxième étape, là où l'on commence à le voir
   * changer.
   */
  import { onMount } from 'svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { builder } from '$lib/playground/kit.svelte';
  import BuilderSteps from '$lib/playground/builder/BuilderSteps.svelte';
  import BuilderPreview from '$lib/playground/builder/BuilderPreview.svelte';
  import MarkerCircle from '$lib/components/ui/MarkerCircle.svelte';
  import HandDrawnArrow from '$lib/components/ui/HandDrawnArrow.svelte';

  const TEXT = {
    fr: {
      titleStart: 'Monte ton',
      titleWord: 'serveur',
      titleEnd: 'Discord ici. Ajoute Kotbo après.',
      demoNote: 'Aperçu de démonstration : les membres qui y passent sont fictifs.',
      welcomeBack: (name: string) => `Content de te revoir. ${name} est resté comme tu l’as laissé.`,
      annotation: 'il se monte en direct',
    },
    en: {
      titleStart: 'Build your',
      titleWord: 'server',
      titleEnd: 'here. Add Kotbo after.',
      demoNote: 'Demo preview: the members you see are fictional.',
      welcomeBack: (name: string) => `Welcome back. ${name} is just as you left it.`,
      annotation: 'it builds live',
    },
  };

  const t = $derived(TEXT[getLocale()]);

  let steps = $state<ReturnType<typeof BuilderSteps> | null>(null);
  let step = $state<'name' | 'theme' | 'tracks' | 'ready'>('name');
  let returning = $state(false);

  onMount(() => {
    builder.hydrate();
    returning = builder.kit.touched && builder.kit.name.trim().length > 0;
    if (returning) steps?.resume();
  });
</script>

<section id="monter" aria-labelledby="hero-title" class="relative">
  <div class="mx-auto flex max-w-360 flex-col px-4 pb-14 pt-6 sm:px-8 lg:min-h-[calc(100svh-4.5rem)] lg:pb-12 lg:pt-8">
    <h1 id="hero-title" class="hero-enter max-w-4xl font-headline text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl xl:text-6xl">
      {t.titleStart}
      <MarkerCircle color="blue" class="text-indigo-600" animated>{t.titleWord}</MarkerCircle>
      {t.titleEnd}
    </h1>
    {#if returning}
      <p class="mt-4 self-start rounded-lg bg-[var(--color-postit-yellow)] px-3 py-1.5 text-sm font-semibold text-gray-900">
        {t.welcomeBack(builder.kit.name.trim())}
      </p>
    {/if}

    <div class="hero-enter hero-delay-2 mt-8 grid flex-1 items-start gap-10 lg:mt-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:gap-16">
      <BuilderSteps bind:this={steps} onstep={(next) => (step = next)} />

      <div class="relative {step === 'name' ? 'hidden lg:block' : ''}">
        <!-- Annotation du visiteur : elle commente, elle n'informe pas. -->
        <div aria-hidden="true" class="pointer-events-none absolute -top-9 right-10 hidden items-end gap-1 xl:flex">
          <span class="-rotate-3 font-hand text-2xl text-indigo-700">{t.annotation}</span>
          <HandDrawnArrow direction="down-right" class="h-10 w-10 text-indigo-700" />
        </div>
        <BuilderPreview />
        <p class="mt-2 text-sm text-gray-600">{t.demoNote}</p>
      </div>
    </div>
  </div>
</section>
