<script lang="ts">
  /**
   * L'encart qui renvoie vers ce qu'on essaie : l'accueil, où l'on monte son
   * serveur, et la démo du dashboard. Ces pages se lisent ; l'accueil se joue.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { homeOf } from '$lib/i18n/routes';

  const TEXT = {
    fr: {
      title: 'Essaie avant de lire la suite',
      body: "Sur l'accueil, tu montes ton serveur en trois questions et tu vois ce que tes membres verront. La démo montre le dashboard de ton staff, sans compte.",
      home: 'Monter mon serveur',
      demo: 'Voir la démo du dashboard',
    },
    en: {
      title: 'Try it before reading on',
      body: 'On the home page, you build your server in three questions and see what your members will see. The demo shows your staff dashboard, no account needed.',
      home: 'Build my server',
      demo: 'See the dashboard demo',
    },
  };
  const t = $derived(TEXT[getLocale()]);
</script>

<aside class="rounded-2xl border-2 border-gray-900 bg-[#f8f9fa] p-6 sm:p-8">
  <h2 class="font-headline text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">{t.title}</h2>
  <p class="mt-2 leading-relaxed text-gray-700">{t.body}</p>
  <div class="mt-5 flex flex-col flex-wrap gap-3 sm:flex-row">
    <a href="{base}{homeOf(getLocale())}#monter" class="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-xl bg-gray-900 px-5 text-sm font-bold text-white transition-colors hover:bg-gray-800">{t.home}</a>
    <a href="{base}/demo/" class="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-xl border border-gray-300 bg-white px-5 text-sm font-bold text-gray-900 transition-colors hover:border-gray-900">{t.demo}</a>
  </div>
</aside>
