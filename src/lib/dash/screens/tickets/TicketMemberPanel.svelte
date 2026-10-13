<!--
  Profil de l'auteur du ticket, à droite de la conversation comme le panneau
  de profil de Discord.

  Recopie de `Kotbo/apps/dashboard/src/lib/components/tickets/TicketMemberPanel.svelte`
  (branche `recette`). Le dashboard lit le dossier (`fetchMemberCase`) et le
  résumé (`fetchMemberSummary`) du membre par l'API ; ici le dossier vient des
  données partagées de la fiche membre (`fixtures/members.ts`, la même que
  celle de la fenêtre « Dossier détaillé ») et le résumé de
  `fixtures/tickets.ts`. « Fiche
  complète » mène dans le dashboard à la page du membre : l'aperçu n'a pas
  cette page, le bouton ouvre la même fiche que « Dossier détaillé ».
-->
<script lang="ts">
  import { Button, Papicon } from '$lib/dash/ui';
  import { memberAvatarSrc } from '$lib/dash/media';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { memberCaseFor } from '$lib/dash/fixtures/members';
  import type { DemoMemberSummary } from '$lib/dash/fixtures/tickets';

  const TEXT = {
    fr: {
      memberFallback: 'Membre',
      warn: 'Avert.',
      timeout: 'Sourdine',
      kick: 'Exclusion',
      ban: 'Ban',
      left: 'Parti',
      memberSince: 'Membre depuis',
      joined: 'Arrivé le',
      accountCreated: 'Compte créé le',
      roles: (count: number) => `Rôles (${count})`,
      record: 'Casier',
      recordClean: 'Aucune sanction.',
      tickets: 'Tickets ouverts',
      ticketsCount: (count: number) => `${count} ticket(s) ouvert(s) au total`,
      rating: (rating: number) => `note moyenne ${rating}/5`,
      note: 'Note du staff',
      openCase: 'Dossier détaillé',
      openProfile: 'Fiche complète',
    },
    en: {
      memberFallback: 'Member',
      warn: 'Warns',
      timeout: 'Timeouts',
      kick: 'Kicks',
      ban: 'Bans',
      left: 'Left',
      memberSince: 'Member since',
      joined: 'Joined',
      accountCreated: 'Account created',
      roles: (count: number) => `Roles (${count})`,
      record: 'Record',
      recordClean: 'No sanctions.',
      tickets: 'Tickets opened',
      ticketsCount: (count: number) => `${count} ticket(s) opened in total`,
      rating: (rating: number) => `average rating ${rating}/5`,
      note: 'Staff note',
      openCase: 'Full case file',
      openProfile: 'Full profile',
    },
  };

  const {
    userId,
    summary,
    fallbackName = '',
    onopencase,
  }: {
    userId: string;
    summary: DemoMemberSummary | null;
    fallbackName?: string;
    /** Ouvre le dossier détaillé (sanctions, notes, actions) dans la fenêtre de la page. */
    onopencase: (userId: string, name: string) => void;
  } = $props();

  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const dateLocale = $derived(locale === 'fr' ? 'fr-FR' : 'en-GB');

  const caseData = $derived(memberCaseFor(userId, locale));
  const profile = $derived(caseData?.profile ?? null);
  const name = $derived(profile?.displayName || profile?.globalName || profile?.username || fallbackName || t.memberFallback);
  const banner = $derived(
    profile?.bannerUrl
      ? `url("${profile.bannerUrl}") center / cover`
      : profile?.accentColor
        ? `#${profile.accentColor.toString(16).padStart(6, '0')}`
        : 'var(--primary-color)',
  );

  const formatDate = (iso: string | null | undefined) =>
    iso ? new Date(iso).toLocaleDateString(dateLocale, { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

  /** Casier : sanctions non archivées, comptées par type, plus les trois dernières. */
  const record = $derived.by(() => {
    const sanctions = (caseData?.sanctions ?? []).filter((sanction) => !sanction.archivedAt);
    const counts = { WARN: 0, TIMEOUT: 0, KICK: 0, BAN: 0 };
    for (const sanction of sanctions) {
      if (sanction.type === 'WARN') counts.WARN += 1;
      else if (sanction.type === 'TIMEOUT') counts.TIMEOUT += 1;
      else if (sanction.type === 'KICK') counts.KICK += 1;
      else counts.BAN += 1;
    }
    return { total: sanctions.length, counts, recent: sanctions.slice(0, 3) };
  });

  const SANCTION_LABEL: Record<string, 'warn' | 'timeout' | 'kick' | 'ban'> = {
    WARN: 'warn',
    TIMEOUT: 'timeout',
    KICK: 'kick',
    TEMP_BAN: 'ban',
    BAN: 'ban',
    SOFTBAN: 'ban',
  };

  const SIGNAL_CLASS = {
    danger: 'bg-error/10 text-error',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-surface-container text-on-surface-variant',
  } as const;
</script>

<div class="tmp">
  <div class="tmp__banner" style="background: {banner};"></div>
  <div class="tmp__head">
    <img class="tmp__avatar" src={memberAvatarSrc(profile?.avatarUrl, name, userId)} alt="" />
    <div class="flex flex-wrap gap-1 justify-end pt-2">
      {#if profile && !profile.isOnServer}<span class="tmp-chip bg-surface-container text-on-surface-variant">{t.left}</span>{/if}
      {#if profile?.staffGrade}<span class="tmp-chip bg-primary/10 text-primary">{profile.staffGrade}</span>{/if}
    </div>
  </div>

  <div class="tmp__body">
    <div>
      <p class="text-base font-bold text-on-surface leading-tight truncate">{name}</p>
      <p class="text-body-sm text-on-surface-variant truncate">@{profile?.username ?? userId}{#if profile?.pronouns} · {profile.pronouns}{/if}</p>
    </div>

    {#if summary && summary.signals.length > 0}
      <div class="flex flex-wrap gap-1">
        {#each summary.signals.slice(0, 4) as signal (signal.key)}
          <span class="tmp-chip {SIGNAL_CLASS[signal.tone]}">{signal.label[locale]}</span>
        {/each}
      </div>
    {/if}

    <section class="tmp__section">
      <h4>{t.memberSince}</h4>
      <dl class="tmp__dates">
        <div><dt><Papicon icon="log-in" size={12} /> {t.joined}</dt><dd>{formatDate(profile?.guildJoinedAt)}</dd></div>
        <div><dt><Papicon icon="user" size={12} /> {t.accountCreated}</dt><dd>{formatDate(profile?.accountCreatedAt)}</dd></div>
      </dl>
    </section>

    {#if caseData && caseData.roles.length > 0}
      <section class="tmp__section">
        <h4>{t.roles(caseData.roles.length)}</h4>
        <div class="flex flex-wrap gap-1">
          {#each caseData.roles.slice(0, 12) as role (role.id)}
            <span class="tmp-role"><span class="w-2 h-2 rounded-full" style="background: {role.color && role.color !== '#000000' ? role.color : 'var(--outline-variant)'}"></span>{role.name}</span>
          {/each}
          {#if caseData.roles.length > 12}<span class="tmp-role">+{caseData.roles.length - 12}</span>{/if}
        </div>
      </section>
    {/if}

    <section class="tmp__section">
      <h4>{t.record}</h4>
      {#if record.total === 0}
        <p class="text-body-sm text-on-surface-variant">{t.recordClean}</p>
      {:else}
        <div class="tmp__counts">
          <div><strong>{record.counts.WARN}</strong><span>{t.warn}</span></div>
          <div><strong>{record.counts.TIMEOUT}</strong><span>{t.timeout}</span></div>
          <div><strong>{record.counts.KICK}</strong><span>{t.kick}</span></div>
          <div><strong>{record.counts.BAN}</strong><span>{t.ban}</span></div>
        </div>
        <ul class="space-y-1.5 mt-2">
          {#each record.recent as sanction (sanction.id)}
            <li class="text-2xs text-on-surface-variant">
              <span class="font-semibold text-on-surface">{SANCTION_LABEL[sanction.type] ? t[SANCTION_LABEL[sanction.type]] : sanction.type}</span>
              · {formatDate(sanction.createdAt)}
              {#if sanction.reason}<span class="block truncate">{sanction.reason}</span>{/if}
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    {#if summary}
      <section class="tmp__section">
        <h4>{t.tickets}</h4>
        <p class="text-body-sm text-on-surface">
          {t.ticketsCount(summary.support.tickets)}
          {#if summary.support.averageRating !== null}<span class="text-on-surface-variant"> · {t.rating(summary.support.averageRating)}</span>{/if}
        </p>
      </section>
    {/if}

    {#if profile?.moderatorNote}
      <section class="tmp__section">
        <h4>{t.note}</h4>
        <p class="text-body-sm text-on-surface whitespace-pre-line line-clamp-4">{profile.moderatorNote}</p>
      </section>
    {/if}

    <div class="flex flex-col gap-1.5 pt-1">
      <Button size="sm" icon="folder" fullWidth onclick={() => onopencase(userId, name)}>{t.openCase}</Button>
      <Button size="sm" variant="ghost" icon="user" fullWidth onclick={() => onopencase(userId, name)}>{t.openProfile}</Button>
    </div>
  </div>
</div>

<style>
  .tmp {
    height: 100%;
    overflow-y: auto;
  }
  .tmp__banner {
    height: 4.5rem;
  }
  .tmp__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0 0.9rem;
    margin-top: -2.25rem;
  }
  .tmp__avatar {
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 999px;
    border: 5px solid var(--surface-container-low);
    background: var(--surface-container);
    object-fit: cover;
    flex-shrink: 0;
  }
  .tmp__body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.5rem 0.9rem 1rem;
  }
  .tmp__section {
    padding: 0.7rem 0.8rem;
    border-radius: 0.6rem;
    background: var(--surface-container-lowest);
  }
  .tmp__section h4 {
    margin-bottom: 0.4rem;
    font-size: 0.6875rem;
    font-weight: 700;
    color: var(--on-surface-variant);
  }
  .tmp__dates {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.75rem;
  }
  .tmp__dates div {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .tmp__dates dt {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--on-surface-variant);
  }
  .tmp__dates dd {
    color: var(--on-surface);
  }
  .tmp__counts {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.25rem;
    text-align: center;
  }
  .tmp__counts strong {
    display: block;
    font-size: 1rem;
    color: var(--on-surface);
    font-variant-numeric: tabular-nums;
  }
  .tmp__counts span {
    font-size: 0.6875rem;
    color: var(--on-surface-variant);
  }
  .tmp-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.1rem 0.45rem;
    border-radius: 999px;
    font-size: 0.6875rem;
    font-weight: 500;
  }
  .tmp-role {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.1rem 0.4rem;
    border-radius: 0.35rem;
    background: var(--surface-container);
    font-size: 0.6875rem;
    color: var(--on-surface);
  }
</style>
