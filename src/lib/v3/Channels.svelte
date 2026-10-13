<script lang="ts">
  /**
   * La colonne de salons, à gauche, sur ordinateur.
   *
   * La page se lit comme un serveur : chaque zone est un salon. Le salon à
   * l'écran est surligné, comme dans Discord, et ceux que le visiteur n'a pas
   * encore vus gardent la pastille blanche des messages non lus. Elle
   * s'éteint quand la zone passe à l'écran : on voit ce qu'il reste à lire.
   * Sous les salons, les liens qui mènent hors de l'accueil (`SideLinks`) :
   * l'accueil n'a pas de barre du haut. En bas, à la place du panneau
   * utilisateur de Discord, le bouton.
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { TRIAL_DAYS } from '$lib/product';
  import { CHANNELS, type ChannelId } from './channels';
  import AddButton from './AddButton.svelte';
  import SideLinks from './SideLinks.svelte';

  const TEXT = {
    fr: { label: 'Salons de la page', trial: `${TRIAL_DAYS} jours offerts, sans carte`, server: 'Kotbo', home: 'Kotbo, accueil' },
    en: { label: 'Page channels', trial: `${TRIAL_DAYS} days free, no card`, server: 'Kotbo', home: 'Kotbo, home' },
  };
  const t = $derived(TEXT[getLocale()]);
  const groups = $derived(CHANNELS[getLocale()]);

  let current = $state<ChannelId>('bienvenue');
  let seen = $state<ChannelId[]>(['bienvenue']);

  onMount(() => {
    const ids = groups.flatMap((g) => g.channels.map((c) => c.id));
    const nodes = ids.map((id) => document.getElementById(id)).filter((n): n is HTMLElement => n !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id as ChannelId;
          current = id;
          if (!seen.includes(id)) seen = [...seen, id];
        }
      },
      { rootMargin: '-56px 0px -86% 0px' },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  });
</script>

<aside class="sticky top-0 hidden h-svh flex-col border-r border-line bg-night-2 lg:flex">
  <a href="{base}{getLocale() === 'fr' ? '/' : '/en'}" aria-label={t.home} class="flex h-12 shrink-0 items-center gap-2.5 border-b border-line px-4">
    <img src="{base}/favicon.svg" alt="" width="24" height="24" class="h-6 w-6 rounded-md" />
    <span class="font-display text-[15px] font-bold text-white">{t.server}</span>
  </a>
  <nav aria-label={t.label} class="flex-1 overflow-y-auto px-2 py-3">
    {#each groups as group (group.label)}
      <p class="mb-1 mt-4 px-2 text-xs font-semibold uppercase tracking-wide text-fog first:mt-1">{group.label}</p>
      <ul class="space-y-px">
        {#each group.channels as channel (channel.id)}
          {@const active = current === channel.id}
          {@const unread = !seen.includes(channel.id)}
          <li class="relative">
            {#if unread}
              <span aria-hidden="true" class="absolute -left-2 top-1/2 h-2 w-1 -translate-y-1/2 rounded-r-full bg-white"></span>
            {/if}
            <a
              href="#{channel.id}"
              aria-current={active ? 'location' : undefined}
              class="flex min-h-9 items-center gap-1.5 rounded-md px-2 text-[15px] transition-colors {active
                ? 'bg-night-4 text-white'
                : unread
                  ? 'font-semibold text-white hover:bg-night-3'
                  : 'text-fog hover:bg-night-3 hover:text-mist'}"
            >
              <span aria-hidden="true" class="text-lg leading-none text-fog">#</span>
              <span class="truncate" translate="no">{channel.name}</span>
            </a>
          </li>
        {/each}
      </ul>
    {/each}
    <SideLinks />
  </nav>
  <div class="shrink-0 border-t border-line bg-[#0c0c0e] p-3">
    <AddButton content="channels" class="w-full" />
    <p class="mt-2 text-center text-xs text-fog">{t.trial}</p>
  </div>
</aside>
