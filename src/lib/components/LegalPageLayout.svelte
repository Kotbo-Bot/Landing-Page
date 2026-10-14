<script lang="ts">
  /**
   * Le gabarit des pages légales : la barre et le pied de page du site
   * (`v3/Shell`, sans barre d'invitation), un titre, le sommaire qui suit la
   * lecture sur grand écran, et le texte.
   *
   * Les pages écrivent leur texte en HTML simple (`policy-section`,
   * `info-box`, `table-wrap`…) : la mise en forme vit ici, sur les jetons de
   * `routes/layout.css`, et suit donc le thème choisi.
   */
  import type { Snippet } from 'svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import Shell from '$lib/v3/Shell.svelte';

  type SectionLink = { id: string; label: string };

  const {
    title,
    subtitle,
    sections = [],
    children,
  }: {
    title: string;
    subtitle?: string;
    sections?: SectionLink[];
    children: Snippet;
  } = $props();

  const TEXT = {
    fr: { toc: 'Sommaire' },
    en: { toc: 'Contents' },
  };
  const t = $derived(TEXT[getLocale()]);
</script>

<Shell invite={false}>
  <header class="border-b border-line">
    <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
      <h1 class="max-w-4xl text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-ink sm:text-5xl">{title}</h1>
      {#if subtitle}<p class="mt-5 text-sm text-fog">{subtitle}</p>{/if}
    </div>
  </header>

  <div class="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20 lg:py-20">
    {#if sections.length}
      <nav aria-labelledby="toc-title" class="lg:sticky lg:top-24 lg:self-start">
        <p id="toc-title" class="text-sm font-semibold text-ink">{t.toc}</p>
        <ol class="mt-3 border-l border-line text-sm">
          {#each sections as section (section.id)}
            <li><a href="#{section.id}" class="-ml-px block border-l border-transparent py-2 pl-4 leading-snug text-fog transition-colors hover:border-ink hover:text-ink">{section.label}</a></li>
          {/each}
        </ol>
      </nav>
    {/if}

    <div class="prose-policy min-w-0 max-w-3xl {sections.length ? '' : 'lg:col-span-2'}">
      {@render children()}
    </div>
  </div>
</Shell>

<style>
  .prose-policy {
    color: var(--color-mist);
    line-height: 1.75;
  }

  .prose-policy :global(.policy-section) {
    margin-bottom: 3.5rem;
    padding-bottom: 3rem;
    border-bottom: 1px solid var(--color-line);
    scroll-margin-top: 6rem;
  }
  .prose-policy :global(.policy-section:last-child) { border-bottom: none; }

  /* Le numéro de la section, repris du sommaire. */
  .prose-policy :global(.section-badge) {
    font-family: var(--font-display);
    font-size: 0.875rem;
    font-weight: 800;
    color: var(--color-fog);
    margin-bottom: 0.5rem;
  }

  .prose-policy :global(h2) {
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: var(--color-ink);
    margin-bottom: 1rem;
    text-wrap: balance;
  }
  .prose-policy :global(h3) {
    font-family: var(--font-display);
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-ink);
    margin-top: 1.75rem;
    margin-bottom: 0.5rem;
  }
  .prose-policy :global(h4) { color: var(--color-ink); }
  .prose-policy :global(strong) { color: var(--color-ink); }

  .prose-policy :global(p) { margin-bottom: 1rem; }

  .prose-policy :global(ul) { list-style: disc; padding-left: 1.25rem; margin-bottom: 1rem; }
  .prose-policy :global(ul li) { margin-bottom: 0.5rem; }
  .prose-policy :global(ul li::marker) { color: var(--color-glow); }
  .prose-policy :global(ol) { list-style: decimal; padding-left: 1.25rem; margin-bottom: 1rem; }

  .prose-policy :global(a) {
    color: var(--color-glow);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .prose-policy :global(a:hover) { text-decoration-thickness: 2px; }

  .prose-policy :global(hr) { border-color: var(--color-line); }

  /* Un encadré : une précision, un avertissement (`warn`), un interdit (`danger`). */
  .prose-policy :global(.info-box) {
    background: var(--color-night-3);
    border: 1px solid var(--color-line-2);
    border-radius: 0.875rem;
    padding: 1rem 1.25rem;
    font-size: 0.9375rem;
    line-height: 1.65;
  }
  .prose-policy :global(.info-box p:last-child) { margin-bottom: 0; }
  .prose-policy :global(.info-box.warn) { border-color: var(--color-amber); }
  .prose-policy :global(.info-box.danger) { border-color: var(--color-alarm); }

  .prose-policy :global(.table-wrap) { overflow-x: auto; padding: 1px; }
  .prose-policy :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.25rem 0 1.5rem;
    font-size: 0.875rem;
    border: 1px solid var(--color-line);
  }
  .prose-policy :global(th) {
    background: var(--color-night-3);
    font-weight: 700;
    color: var(--color-ink);
    padding: 0.75rem 1rem;
    text-align: left;
  }
  .prose-policy :global(td) {
    padding: 0.7rem 1rem;
    border-top: 1px solid var(--color-line);
    vertical-align: top;
  }

  .prose-policy :global(code) {
    font-family: var(--font-mono);
    background: var(--color-night-3);
    color: var(--color-ink);
    padding: 0.12rem 0.35rem;
    border-radius: 0.35rem;
    font-size: 0.82em;
  }

  .prose-policy :global(.rights-grid) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
    margin: 1.25rem 0;
  }
  .prose-policy :global(.right-card) {
    background: var(--color-night-2);
    border: 1px solid var(--color-line);
    border-radius: 1rem;
    padding: 1.1rem 1.25rem;
  }
  .prose-policy :global(.right-card h4) {
    font-size: 0.95rem;
    font-weight: 700;
    margin-bottom: 0.4rem;
  }
  .prose-policy :global(.right-card p) {
    font-size: 0.875rem;
    color: var(--color-fog);
    margin: 0;
  }
  .prose-policy :global(.art) {
    font-size: 0.75rem;
    color: var(--color-fog);
  }

  .prose-policy :global(.contact-card) {
    background: var(--color-night-2);
    border: 1px solid var(--color-line);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-top: 1rem;
  }
</style>
