<script lang="ts">
  /**
   * L'atelier de carte de rang : le visiteur fabrique la sienne et repart avec.
   *
   * C'est la zone la plus « membre » de la page. Les autres parlent à celui qui
   * gère le serveur ; celle-ci lui fait vivre ce que ses membres verront en
   * tapant /rank. Le fichier téléchargé est le même format que celui du bot,
   * ce qui en fait un objet qu'on montre, et une raison d'y revenir.
   *
   * La photo reste dans le navigateur : elle est lue en `blob:` local, jamais
   * envoyée, et la phrase sous le bouton le dit.
   */
  import { onDestroy } from 'svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { track } from '$lib/funnel';
  import { reveal } from '$lib/actions/reveal';
  import RankCanvas from '$lib/playground/rank/RankCanvas.svelte';
  import { BACKGROUNDS, FONTS, type FontId } from '$lib/playground/rank/draw';
  import { twemoji } from '$lib/playground/discord/theme';
  import InviteButton from '$lib/playground/InviteButton.svelte';
  import HandDrawnArrow from '$lib/components/ui/HandDrawnArrow.svelte';

  const EMOJIS = [
    '1f525', '2b50', '1f451', '1f48e', '1f680', '1f3ae', '1f3af', '1f3c6', '26a1', '2728',
    '1f98a', '1f43a', '1f480', '1f9ca', '1f30a', '1f319', '1f338', '1f340', '1f3a7', '1fa90',
  ];
  const EMOJI_MAX = 3;

  const TEXT = {
    fr: {
      title: 'Fabrique ta carte de rang.',
      intro:
        'C’est la carte que tes membres reçoivent en tapant /rank : mêmes dimensions, mêmes fonds, même calcul d’XP que le bot. Règle-la, télécharge-la.',
      cardLabel: (name: string, level: number) => `Carte de rang de ${name}, niveau ${level}`,
      nameLabel: 'Pseudo',
      namePlaceholder: 'Ton pseudo',
      fallbackName: 'Toi',
      photoLabel: 'Photo',
      photoButton: 'Choisir une image',
      photoRemove: 'Retirer la photo',
      photoNote: 'Ta photo reste dans ton navigateur : elle n’est envoyée nulle part.',
      bgLabel: 'Fond',
      fontLabel: 'Police du pseudo',
      emojiLabel: (n: number) => `Emojis (${n}/${EMOJI_MAX})`,
      levelLabel: 'Niveau',
      progressLabel: 'Avancement dans le niveau',
      download: 'Télécharger ma carte',
      downloaded: 'Carte enregistrée. Tes membres auront la leur avec /rank.',
      annotation: 'un vrai PNG, comme le bot',
      fileName: 'carte-de-rang-kotbo.png',
      badFile: 'Ce fichier n’est pas une image lisible.',
    },
    en: {
      title: 'Make your rank card.',
      intro:
        'This is the card your members get when they type /rank: same size, same backgrounds, same XP maths as the bot. Tune it, download it.',
      cardLabel: (name: string, level: number) => `Rank card for ${name}, level ${level}`,
      nameLabel: 'Username',
      namePlaceholder: 'Your username',
      fallbackName: 'You',
      photoLabel: 'Photo',
      photoButton: 'Choose an image',
      photoRemove: 'Remove photo',
      photoNote: 'Your photo stays in your browser: it is not sent anywhere.',
      bgLabel: 'Background',
      fontLabel: 'Username font',
      emojiLabel: (n: number) => `Emojis (${n}/${EMOJI_MAX})`,
      levelLabel: 'Level',
      progressLabel: 'Progress within the level',
      download: 'Download my card',
      downloaded: 'Card saved. Your members get theirs with /rank.',
      annotation: 'a real PNG, like the bot',
      fileName: 'kotbo-rank-card.png',
      badFile: 'This file is not a readable image.',
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const locale = $derived(getLocale());

  let name = $state('');
  let backgroundId = $state('default');
  let font = $state<FontId>('default');
  let emojiCodes = $state<string[]>(['1f525']);
  let level = $state(12);
  let progress = $state(64);
  let avatarSrc = $state<string | null>(null);
  let fileError = $state(false);
  let saved = $state(false);
  let canvas = $state<HTMLCanvasElement | null>(null);
  let fileInput = $state<HTMLInputElement | null>(null);
  let played = false;

  const displayName = $derived(name.trim() || t.fallbackName);
  const tag = $derived(`@${displayName.toLowerCase().replace(/\s+/g, '')}`);
  const rank = $derived(Math.max(1, Math.round(90 / level)));

  function started(): void {
    saved = false;
    if (played) return;
    played = true;
    track('playground_started', { content: 'rankcard' });
  }

  function toggleEmoji(code: string): void {
    started();
    if (emojiCodes.includes(code)) emojiCodes = emojiCodes.filter((c) => c !== code);
    else if (emojiCodes.length < EMOJI_MAX) emojiCodes = [...emojiCodes, code];
  }

  function pickPhoto(event: Event & { currentTarget: HTMLInputElement }): void {
    started();
    const file = event.currentTarget.files?.[0];
    fileError = false;
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      fileError = true;
      return;
    }
    if (avatarSrc) URL.revokeObjectURL(avatarSrc);
    avatarSrc = URL.createObjectURL(file);
  }

  function removePhoto(): void {
    if (avatarSrc) URL.revokeObjectURL(avatarSrc);
    avatarSrc = null;
    if (fileInput) fileInput.value = '';
  }

  function download(): void {
    canvas?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = t.fileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      saved = true;
      track('playground_completed', { content: 'rankcard' });
    }, 'image/png');
  }

  onDestroy(() => {
    if (avatarSrc) URL.revokeObjectURL(avatarSrc);
  });
</script>

<section id="carte" aria-labelledby="rank-title" class="py-20 lg:py-28">
  <div class="mx-auto max-w-360 px-4 sm:px-8">
    <div use:reveal={{ direction: 'up' }} class="max-w-3xl">
      <h2 id="rank-title" class="font-headline text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{t.title}</h2>
      <p class="mt-4 text-lg leading-relaxed text-gray-700">{t.intro}</p>
    </div>

    <div class="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
      <div class="lg:sticky lg:top-24">
        <div class="relative">
          <div aria-hidden="true" class="pointer-events-none absolute -top-10 right-4 hidden items-end gap-1 sm:flex">
            <span class="-rotate-2 font-hand text-2xl text-indigo-700">{t.annotation}</span>
            <HandDrawnArrow direction="curved-down" class="h-10 w-10 text-indigo-700" />
          </div>
          <div class="rounded-3xl bg-[#1e1f22] p-3 shadow-[0_30px_70px_-20px_rgba(17,24,39,0.55)] sm:p-4">
            <RankCanvas
              bind:canvas
              name={displayName}
              {tag}
              {level}
              progress={progress / 100}
              {rank}
              {backgroundId}
              {font}
              {avatarSrc}
              {emojiCodes}
              label={t.cardLabel(displayName, level)}
            />
          </div>
        </div>
        <div class="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onclick={download}
            class="min-h-12 rounded-xl bg-gray-900 px-6 font-bold text-white transition-colors hover:bg-gray-800"
          >
            {t.download}
          </button>
          {#if saved}
            <p class="text-sm font-semibold text-gray-900" aria-live="polite">{t.downloaded}</p>
          {/if}
        </div>
        {#if saved}
          <div class="mt-5"><InviteButton content="rankcard" /></div>
        {/if}
      </div>

      <div class="space-y-7">
        <div>
          <label for="rank-name" class="block text-sm font-bold text-gray-900">{t.nameLabel}</label>
          <input
            id="rank-name"
            type="text"
            maxlength="24"
            autocomplete="off"
            bind:value={name}
            oninput={started}
            placeholder={t.namePlaceholder}
            class="mt-2 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-indigo-600 focus:outline-none"
          />
        </div>

        <div>
          <p class="text-sm font-bold text-gray-900" id="rank-photo-label">{t.photoLabel}</p>
          <div class="mt-2 flex flex-wrap items-center gap-3">
            <input
              bind:this={fileInput}
              id="rank-photo"
              type="file"
              accept="image/*"
              onchange={pickPhoto}
              aria-labelledby="rank-photo-label"
              class="peer sr-only"
            />
            <label
              for="rank-photo"
              class="inline-flex min-h-11 cursor-pointer items-center rounded-xl border-2 border-gray-900 bg-white px-4 text-sm font-bold text-gray-900 hover:bg-gray-900 hover:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-600"
            >
              {t.photoButton}
            </label>
            {#if avatarSrc}
              <button type="button" onclick={removePhoto} class="min-h-11 text-sm font-semibold text-gray-700 underline underline-offset-4">
                {t.photoRemove}
              </button>
            {/if}
          </div>
          {#if fileError}
            <p class="mt-2 text-sm font-semibold text-red-700" role="alert">{t.badFile}</p>
          {/if}
          <p class="mt-2 text-sm text-gray-600">{t.photoNote}</p>
        </div>

        <fieldset>
          <legend class="text-sm font-bold text-gray-900">{t.bgLabel}</legend>
          <div class="mt-2 flex flex-wrap gap-2">
            {#each BACKGROUNDS as bg (bg.id)}
              <label class="relative" title={bg.label[locale]}>
                <input
                  type="radio"
                  name="rank-bg"
                  value={bg.id}
                  bind:group={backgroundId}
                  onchange={started}
                  class="peer sr-only"
                />
                <span class="sr-only">{bg.label[locale]}</span>
                <span
                  aria-hidden="true"
                  class="block h-11 w-14 cursor-pointer rounded-lg border-2 border-transparent ring-offset-2 peer-checked:border-gray-900 peer-checked:ring-2 peer-checked:ring-gray-900 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-indigo-600"
                  style="background: linear-gradient(135deg, {bg.gradient[0].color} 0%, {bg.gradient[bg.gradient.length - 1].color} 55%, {bg.accent[bg.accent.length - 1].color} 100%)"
                ></span>
              </label>
            {/each}
          </div>
        </fieldset>

        <div>
          <label for="rank-font" class="block text-sm font-bold text-gray-900">{t.fontLabel}</label>
          <select
            id="rank-font"
            bind:value={font}
            onchange={started}
            class="mt-2 min-h-11 w-full rounded-lg border-2 border-gray-300 bg-white px-3 text-gray-900 focus:border-indigo-600 focus:outline-none"
          >
            {#each FONTS as f (f.id)}
              <option value={f.id}>{f.label[locale]}</option>
            {/each}
          </select>
        </div>

        <fieldset>
          <legend class="text-sm font-bold text-gray-900">{t.emojiLabel(emojiCodes.length)}</legend>
          <div class="mt-2 flex flex-wrap gap-1.5">
            {#each EMOJIS as code (code)}
              {@const on = emojiCodes.includes(code)}
              <button
                type="button"
                aria-pressed={on}
                onclick={() => toggleEmoji(code)}
                disabled={!on && emojiCodes.length >= EMOJI_MAX}
                class="grid h-11 w-11 place-items-center rounded-lg border-2 transition-colors disabled:opacity-40 {on
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-transparent bg-white hover:border-gray-300'}"
              >
                <img src={twemoji(code)} alt={String.fromCodePoint(parseInt(code, 16))} width="24" height="24" class="h-6 w-6" />
              </button>
            {/each}
          </div>
        </fieldset>

        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label for="rank-level" class="flex justify-between text-sm font-bold text-gray-900">
              {t.levelLabel}<span class="tabular-nums">{level}</span>
            </label>
            <input id="rank-level" type="range" min="1" max="60" bind:value={level} oninput={started} class="mt-3 w-full accent-indigo-600" />
          </div>
          <div>
            <label for="rank-progress" class="flex justify-between text-sm font-bold text-gray-900">
              {t.progressLabel}<span class="tabular-nums">{progress} %</span>
            </label>
            <input id="rank-progress" type="range" min="0" max="100" bind:value={progress} oninput={started} class="mt-3 w-full accent-indigo-600" />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
