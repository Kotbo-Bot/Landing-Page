<script lang="ts">
  /**
   * Le serveur se monte en trois questions, une à la fois.
   *
   * Première version : un formulaire complet à gauche de l'aperçu. Tout était
   * là, et c'était le problème - un premier écran qui demande sept choix d'un
   * coup ressemble à une page de réglages, pas à un début. Ici, comme dans
   * l'onboarding d'Async, une seule question occupe l'écran, la réponse fait
   * avancer, et l'aperçu change à chaque clic. Les réglages fins (modération,
   * message d'accueil) attendent la fin, repliés.
   *
   * Un visiteur qui revient avec un serveur déjà monté arrive directement au
   * résultat : on ne lui repose pas des questions auxquelles il a répondu.
   */
  import {
    builder,
    MODERATION_LEVELS,
    SERVER_ICONS,
    THEME_KEYS,
    TRACK_KEYS,
    WELCOME_MAX,
    type TrackKey,
  } from '../kit.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { track } from '$lib/funnel';
  import { TRIAL_DAYS } from '$lib/product';
  import { ktb, twemoji } from '../discord/theme';
  import InviteButton from '../InviteButton.svelte';

  type Step = 'name' | 'theme' | 'tracks' | 'ready';
  const STEPS: Step[] = ['name', 'theme', 'tracks', 'ready'];

  const TEXT = {
    fr: {
      progress: (n: number) => `Étape ${n} sur 3`,
      name: {
        question: 'Comment s’appelle ton serveur ?',
        placeholder: 'Les Nerds, Team Nova…',
        iconLabel: 'Choisis-lui une icône',
      },
      theme: { question: (name: string) => `Qu’est-ce qu’on fait sur ${name} ?` },
      themes: {
        communaute: { label: 'Une communauté', pitch: 'On discute, on se retrouve, on organise des choses.' },
        gaming: { label: 'Du jeu', pitch: 'Des vocaux, des niveaux, une économie.' },
        entraide: { label: 'De l’entraide', pitch: 'On pose des questions, les tickets font le reste.' },
        creation: { label: 'De la création', pitch: 'On publie, on montre, on commente.' },
      },
      tracks: {
        question: 'Qu’est-ce que Kotbo prend en charge ?',
        hint: 'On a coché l’essentiel pour ce genre de serveur. Regarde l’aperçu bouger.',
      },
      trackLabels: {
        greeting: 'L’accueil',
        rules: 'Le règlement',
        tickets: 'Le support',
        moderation: 'La modération',
        levels: 'Les niveaux',
        economy: 'L’économie',
        animation: 'Les quêtes',
        staff: 'Ton équipe',
        logs: 'Les logs',
      },
      ready: {
        title: (name: string) => `${name} est prêt.`,
        body: 'Il ne manque que Kotbo. Ajoute-le : l’installation guidée reprend ta vocation, tes modules et ta modération.',
        trial: `${TRIAL_DAYS} jours d’essai, sans carte pour commencer.`,
        refine: 'Affiner avant d’ajouter',
        edit: 'Modifier mes réponses',
      },
      fallbackName: 'ton serveur',
      next: 'Continuer',
      back: 'Retour',
      moderationLabel: 'Niveau de modération',
      moderationLevels: { light: 'Légère', standard: 'Standard', strict: 'Stricte' },
      welcomeLabel: 'Le message d’accueil',
      welcomeHint: '{membre} et {serveur} sont remplacés à l’arrivée de chaque membre.',
      welcomePlaceholder: 'Bienvenue {membre} sur {serveur} !',
      reset: 'Tout recommencer',
    },
    en: {
      progress: (n: number) => `Step ${n} of 3`,
      name: {
        question: 'What’s your server called?',
        placeholder: 'The Nerds, Team Nova…',
        iconLabel: 'Pick an icon for it',
      },
      theme: { question: (name: string) => `What happens on ${name}?` },
      themes: {
        communaute: { label: 'A community', pitch: 'People chat, meet up, organise things.' },
        gaming: { label: 'Gaming', pitch: 'Voice channels, levels, an economy.' },
        entraide: { label: 'Help & support', pitch: 'People ask questions, tickets do the rest.' },
        creation: { label: 'Creative work', pitch: 'People post, show, comment.' },
      },
      tracks: {
        question: 'What should Kotbo take care of?',
        hint: 'We ticked the essentials for this kind of server. Watch the preview change.',
      },
      trackLabels: {
        greeting: 'Welcome',
        rules: 'Rules',
        tickets: 'Support',
        moderation: 'Moderation',
        levels: 'Levels',
        economy: 'Economy',
        animation: 'Quests',
        staff: 'Your team',
        logs: 'Logs',
      },
      ready: {
        title: (name: string) => `${name} is ready.`,
        body: 'All it needs is Kotbo. Add it: the guided setup picks up your purpose, modules and moderation.',
        trial: `${TRIAL_DAYS}-day trial, no card to start.`,
        refine: 'Fine-tune before adding',
        edit: 'Change my answers',
      },
      fallbackName: 'your server',
      next: 'Continue',
      back: 'Back',
      moderationLabel: 'Moderation level',
      moderationLevels: { light: 'Light', standard: 'Standard', strict: 'Strict' },
      welcomeLabel: 'Welcome message',
      welcomeHint: '{member} and {server} are filled in when each member joins.',
      welcomePlaceholder: 'Welcome {member} to {server}!',
      reset: 'Start over',
    },
  };

  /** Le pictogramme du bot qui correspond à chaque piste, celui que ses messages portent. */
  const TRACK_ICONS: Record<TrackKey, string> = {
    greeting: 'online',
    rules: 'news',
    tickets: 'ticket',
    moderation: 'shield',
    levels: 'level',
    economy: 'coins',
    animation: 'star',
    staff: 'mod',
    logs: 'stats',
  };

  interface Props {
    /** Prévient le héros qu'on est arrivé au bout, pour afficher l'aperçu sur téléphone. */
    onstep?: (step: Step) => void;
  }

  const { onstep }: Props = $props();

  const t = $derived(TEXT[getLocale()]);
  const kit = $derived(builder.kit);
  const name = $derived(kit.name.trim() || t.fallbackName);

  let step = $state<Step>('name');
  let heading = $state<HTMLElement | null>(null);
  let played = false;
  let completed = false;

  /** Reprend au bout pour un visiteur qui revient avec un serveur déjà monté. */
  export function resume(): void {
    if (builder.kit.touched && builder.kit.name.trim()) go('ready', false);
  }

  function started(): void {
    if (played) return;
    played = true;
    track('playground_started', { content: 'builder' });
  }

  function go(next: Step, focus = true): void {
    step = next;
    onstep?.(next);
    if (next === 'ready' && !completed) {
      completed = true;
      track('playground_completed', { content: 'builder' });
    }
    // Le titre de l'étape prend le focus : un lecteur d'écran annonce la
    // nouvelle question au lieu de rester sur un bouton qui a disparu.
    if (focus) queueMicrotask(() => heading?.focus());
  }

  const index = $derived(STEPS.indexOf(step));

  function submitName(event: SubmitEvent): void {
    event.preventDefault();
    started();
    go('theme');
  }
</script>

<div class="flex min-h-104 flex-col">
  {#if step !== 'ready'}
    <div class="flex items-center gap-3">
      <p class="text-sm font-semibold text-gray-600">{t.progress(index + 1)}</p>
      <div class="flex gap-1.5" aria-hidden="true">
        {#each [0, 1, 2] as i (i)}
          <span class="h-1.5 w-8 rounded-full {i <= index ? 'bg-indigo-600' : 'bg-gray-300'}"></span>
        {/each}
      </div>
    </div>
  {/if}

  {#key step}
    <div class="step-in mt-5 flex-1">
      {#if step === 'name'}
        <form onsubmit={submitName}>
          <h2 bind:this={heading} tabindex="-1" class="font-headline text-3xl font-extrabold tracking-tight text-gray-900 outline-none sm:text-4xl">
            <label for="kit-name">{t.name.question}</label>
          </h2>
          <input
            id="kit-name"
            type="text"
            autocomplete="off"
            maxlength="32"
            value={kit.name}
            oninput={(e) => {
              started();
              builder.setName(e.currentTarget.value);
            }}
            placeholder={t.name.placeholder}
            class="mt-5 w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3.5 text-xl font-semibold text-gray-900 placeholder:font-normal placeholder:text-gray-500 focus:border-indigo-600 focus:outline-none"
          />
          <fieldset class="mt-6">
            <legend class="text-sm font-bold text-gray-900">{t.name.iconLabel}</legend>
            <div class="mt-2 flex flex-wrap gap-1.5">
              {#each SERVER_ICONS as icon (icon)}
                <label class="relative">
                  <input
                    type="radio"
                    name="kit-icon"
                    value={icon}
                    checked={kit.icon === icon}
                    onchange={() => {
                      started();
                      builder.setIcon(icon);
                    }}
                    class="peer sr-only"
                  />
                  <span
                    class="grid h-11 w-11 cursor-pointer place-items-center rounded-lg border-2 border-transparent bg-white transition-colors peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-600 hover:border-gray-300"
                  >
                    <img src={twemoji(icon)} alt={String.fromCodePoint(parseInt(icon, 16))} width="24" height="24" class="h-6 w-6" />
                  </span>
                </label>
              {/each}
            </div>
          </fieldset>
          <button
            type="submit"
            disabled={!kit.name.trim()}
            class="mt-8 min-h-12 rounded-xl bg-gray-900 px-7 font-bold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
          >
            {t.next}
          </button>
        </form>
      {:else if step === 'theme'}
        <fieldset>
          <legend class="contents">
            <h2 bind:this={heading} tabindex="-1" class="font-headline text-3xl font-extrabold tracking-tight text-gray-900 outline-none sm:text-4xl">
              {t.theme.question(name)}
            </h2>
          </legend>
          <div class="mt-6 grid gap-3 sm:grid-cols-2">
            {#each THEME_KEYS as theme (theme)}
              <button
                type="button"
                aria-pressed={kit.theme === theme}
                onclick={() => {
                  started();
                  builder.setTheme(theme);
                  go('tracks');
                }}
                class="rounded-xl border-2 px-4 py-4 text-left transition-colors {kit.theme === theme && kit.touched
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-900 hover:border-gray-900'}"
              >
                <span class="block text-lg font-bold">{t.themes[theme].label}</span>
                <span class="mt-1 block text-sm leading-snug opacity-80">{t.themes[theme].pitch}</span>
              </button>
            {/each}
          </div>
        </fieldset>
        <button type="button" onclick={() => go('name')} class="mt-6 min-h-11 text-sm font-semibold text-gray-700 underline underline-offset-4">
          {t.back}
        </button>
      {:else if step === 'tracks'}
        <fieldset>
          <legend class="contents">
            <h2 bind:this={heading} tabindex="-1" class="font-headline text-3xl font-extrabold tracking-tight text-gray-900 outline-none sm:text-4xl">
              {t.tracks.question}
            </h2>
          </legend>
          <p class="mt-2 text-gray-700">{t.tracks.hint}</p>
          <div class="mt-5 flex flex-wrap gap-2">
            {#each TRACK_KEYS as key (key)}
              <label class="relative">
                <input
                  type="checkbox"
                  checked={kit.tracks.includes(key)}
                  onchange={() => {
                    started();
                    builder.toggleTrack(key);
                  }}
                  class="peer sr-only"
                />
                <span
                  class="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition-colors peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-600 hover:border-gray-400"
                >
                  <img src={ktb(TRACK_ICONS[key])} alt="" width="18" height="18" class="h-4.5 w-4.5 rounded-sm bg-white/90 p-px" />
                  {t.trackLabels[key]}
                </span>
              </label>
            {/each}
          </div>
        </fieldset>
        <div class="mt-8 flex items-center gap-5">
          <button type="button" onclick={() => go('ready')} class="min-h-12 rounded-xl bg-gray-900 px-7 font-bold text-white transition-colors hover:bg-gray-800">
            {t.next}
          </button>
          <button type="button" onclick={() => go('theme')} class="min-h-11 text-sm font-semibold text-gray-700 underline underline-offset-4">
            {t.back}
          </button>
        </div>
      {:else}
        <h2 bind:this={heading} tabindex="-1" class="font-headline text-4xl font-extrabold tracking-tight text-gray-900 outline-none sm:text-5xl">
          {t.ready.title(kit.name.trim() || t.fallbackName)}
        </h2>
        <p class="mt-3 max-w-md text-lg leading-relaxed text-gray-700">{t.ready.body}</p>
        <div class="mt-7"><InviteButton content="hero" size="lg" /></div>
        <p class="mt-3 text-sm font-semibold text-gray-900">{t.ready.trial}</p>

        <details class="group mt-8 max-w-md rounded-xl border-2 border-gray-200 bg-white">
          <summary class="flex min-h-12 cursor-pointer items-center px-4 font-semibold text-gray-900">{t.ready.refine}</summary>
          <div class="space-y-6 border-t border-gray-200 px-4 py-5">
            {#if kit.tracks.includes('moderation')}
              <fieldset>
                <legend class="text-sm font-bold text-gray-900">{t.moderationLabel}</legend>
                <div class="mt-2 inline-flex rounded-xl border-2 border-gray-200 bg-white p-1">
                  {#each MODERATION_LEVELS as level (level)}
                    <label class="relative">
                      <input
                        type="radio"
                        name="kit-moderation"
                        value={level}
                        checked={kit.moderation === level}
                        onchange={() => builder.setModeration(level)}
                        class="peer sr-only"
                      />
                      <span class="inline-flex min-h-10 cursor-pointer items-center rounded-lg px-4 text-sm font-semibold text-gray-700 peer-checked:bg-gray-900 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-indigo-600">
                        {t.moderationLevels[level]}
                      </span>
                    </label>
                  {/each}
                </div>
              </fieldset>
            {/if}
            {#if kit.tracks.includes('greeting')}
              <div>
                <label for="kit-welcome" class="block text-sm font-bold text-gray-900">{t.welcomeLabel}</label>
                <textarea
                  id="kit-welcome"
                  rows="2"
                  maxlength={WELCOME_MAX}
                  value={kit.welcome}
                  oninput={(e) => builder.setWelcome(e.currentTarget.value)}
                  placeholder={t.welcomePlaceholder}
                  class="mt-2 w-full resize-none rounded-lg border-2 border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-500 focus:border-indigo-600 focus:outline-none"
                ></textarea>
                <p class="mt-1 text-sm text-gray-600">{t.welcomeHint}</p>
              </div>
            {/if}
          </div>
        </details>

        <div class="mt-5 flex flex-wrap gap-x-6 gap-y-2">
          <button type="button" onclick={() => go('name')} class="min-h-11 text-sm font-semibold text-gray-700 underline underline-offset-4">
            {t.ready.edit}
          </button>
          <button
            type="button"
            onclick={() => {
              builder.reset();
              completed = false;
              go('name');
            }}
            class="min-h-11 text-sm font-semibold text-gray-700 underline underline-offset-4"
          >
            {t.reset}
          </button>
        </div>
      {/if}
    </div>
  {/key}
</div>
