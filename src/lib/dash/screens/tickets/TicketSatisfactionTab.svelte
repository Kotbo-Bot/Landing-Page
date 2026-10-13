<!--
  Satisfaction du support : note moyenne, répartition, notes par membre du
  staff avec leurs commentaires, avis récents.

  Recopie de `Kotbo/apps/dashboard/src/lib/components/tickets/TicketSatisfactionTab.svelte`
  (branche `recette`). Les avis viennent des données de démo ; la fenêtre
  « Voir tous les avis » liste ceux du membre du staff choisi, sans pagination
  (la démo en a peu). Les avis récents s'arrêtent à deux pour tenir dans le
  cadre.
-->
<script lang="ts">
  import { Papicon } from '$lib/dash/ui';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { castById } from '$lib/dash/cast';
  import { buildReviews, SATISFACTION_TOTALS } from '$lib/dash/fixtures/tickets';
  import { dialog } from './a11y';

  const TEXT = {
    fr: {
      ratings: ['', 'Tres insatisfait', 'Insatisfait', 'Neutre', 'Satisfait', 'Tres satisfait'],
      userFallback: (userId: string) => `Utilisateur ${userId}`,
      userId: (userId: string) => `ID ${userId}`,
      responses: (count: number) => `${count} réponses`,
      byStaff: 'Satisfaction par staff',
      noStaffData: 'Aucune donnée par staff.',
      reviewsCount: (count: number) => `(${count} avis)`,
      noComment: 'Aucun commentaire',
      commentsCount: (count: number) => `${count} commentaires`,
      viewAll: 'Voir tous les avis',
      moreComments: (count: number) => `Voir ${count} commentaires de plus`,
      recent: 'Avis récents',
      noReview: 'Aucun avis pour le moment.',
      handledBy: (name: string) => `Traité par ${name}`,
      reviewsOf: (name: string) => `Avis de ${name}`,
      commentsOnly: 'Avec commentaire',
      close: 'Annuler',
    },
    en: {
      ratings: ['', 'Very unsatisfied', 'Unsatisfied', 'Neutral', 'Satisfied', 'Very satisfied'],
      userFallback: (userId: string) => `User ${userId}`,
      userId: (userId: string) => `ID ${userId}`,
      responses: (count: number) => `${count} responses`,
      byStaff: 'Satisfaction per staff',
      noStaffData: 'No data per staff.',
      reviewsCount: (count: number) => `(${count} reviews)`,
      noComment: 'No comment',
      commentsCount: (count: number) => `${count} comments`,
      viewAll: 'View all reviews',
      moreComments: (count: number) => `View ${count} more comments`,
      recent: 'Recent reviews',
      noReview: 'No review yet.',
      handledBy: (name: string) => `Handled by ${name}`,
      reviewsOf: (name: string) => `Reviews for ${name}`,
      commentsOnly: 'With comment',
      close: 'Cancel',
    },
  };

  const {
    onopenmember,
  }: {
    /** Ouvre le dossier d'un membre, que la page affiche. */
    onopenmember: (userId: string) => void;
  } = $props();

  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const dateLocale = $derived(locale === 'fr' ? 'fr-FR' : 'en-GB');

  type SatisfactionPerson = { userId: string; username?: string | null; displayName?: string | null; avatarUrl?: string | null };

  const ratingEmojis = ['', '\u{1F621}', '\u{1F615}', '\u{1F610}', '\u{1F642}', '\u{1F929}'];

  const person = (userId: string): SatisfactionPerson | null => {
    const member = castById(userId);
    return member ? { userId, username: member.username, displayName: member.displayName, avatarUrl: member.avatarUrl } : null;
  };

  // Mise en forme de `fetchSatisfactionData` : vue globale, par staff, récents.
  const reviews = buildReviews().map((review) => ({ ...review, user: person(review.userId), staff: person(review.staffId) }));
  const totalResponses = SATISFACTION_TOTALS.distribution.reduce((sum, count) => sum + count, 0);
  const satisfactionData = {
    global: {
      averageRating: SATISFACTION_TOTALS.distribution.reduce((sum, count, index) => sum + count * (index + 1), 0) / totalResponses,
      totalResponses,
      distribution: [5, 4, 3, 2, 1].map((rating) => ({ rating, count: SATISFACTION_TOTALS.distribution[rating - 1] })),
      recent: reviews.slice(0, 2),
    },
    byStaff: SATISFACTION_TOTALS.byStaff.map((row) => {
      const withComment = reviews.filter((review) => review.staffId === row.staffId && review.comment);
      return { ...row, staff: person(row.staffId), commentCount: withComment.length, recentComments: withComment.slice(0, 2) };
    }),
  };

  function getSatisfactionPersonName(who: SatisfactionPerson | null | undefined, userId: string): string {
    return who?.displayName || who?.username || t.userFallback(userId);
  }

  function getSatisfactionPersonHandle(who: SatisfactionPerson | null | undefined, userId: string): string {
    return who?.username ? `@${who.username}` : t.userId(userId);
  }

  function getSatisfactionInitials(who: SatisfactionPerson | null | undefined, userId: string): string {
    const name = getSatisfactionPersonName(who, userId).trim();
    const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
    return initials || userId.slice(0, 2);
  }

  function getRatingColor(rating: number): string {
    if (rating >= 4.5) return 'var(--color-success)';
    if (rating >= 3.5) return 'var(--color-primary, #5865F2)';
    if (rating >= 2.5) return 'var(--color-warning)';
    return 'var(--color-error)';
  }

  // Ligne staff dépliée : aperçu des derniers commentaires.
  let expandedStaffId = $state<string | null>(null);

  function toggleStaffComments(staffId: string) {
    expandedStaffId = expandedStaffId === staffId ? null : staffId;
  }

  // Fenêtre « Voir tous les avis »
  let reviewsModalStaff = $state<{ staffId: string; staff: SatisfactionPerson | null } | null>(null);
  let reviewsModalCommentsOnly = $state(false);
  const reviewsModalItems = $derived(
    reviewsModalStaff
      ? reviews.filter((review) => review.staffId === reviewsModalStaff!.staffId && (!reviewsModalCommentsOnly || review.comment))
      : [],
  );
  const reviewsModalTotal = $derived(satisfactionData.byStaff.find((row) => row.staffId === reviewsModalStaff?.staffId)?.totalResponses ?? 0);

  function openStaffReviews(staffId: string, staff: SatisfactionPerson | null) {
    reviewsModalStaff = { staffId, staff };
    reviewsModalCommentsOnly = false;
  }

  function closeStaffReviews() {
    reviewsModalStaff = null;
  }
</script>

<div class="sat-grid">
  <!-- Vue d'ensemble -->
  <div class="sat-card sat-overview-card">
    <div class="sat-avg-rating" style="color: {getRatingColor(satisfactionData.global.averageRating)}">
      <span class="sat-avg-value">{satisfactionData.global.averageRating.toFixed(1)}</span>
      <span class="sat-avg-max">/5</span>
    </div>
    <p class="sat-avg-label">{t.responses(satisfactionData.global.totalResponses)}</p>

    <div class="sat-distribution">
      {#each satisfactionData.global.distribution as d (d.rating)}
        <div class="sat-dist-row">
          <span class="sat-dist-label">{ratingEmojis[d.rating]} {d.rating}</span>
          <div class="sat-dist-bar">
            <div class="sat-dist-fill" style="width: {(d.count / satisfactionData.global.totalResponses) * 100}%"></div>
          </div>
          <span class="sat-dist-count">{d.count}</span>
        </div>
      {/each}
    </div>
  </div>

  <!-- Par membre du staff -->
  <div class="sat-card sat-staff-card">
    <h3 class="sat-card-title">{t.byStaff}</h3>
    <div class="sat-staff-list">
      {#each satisfactionData.byStaff as staff (staff.staffId)}
        {@const isExpanded = expandedStaffId === staff.staffId}
        {@const commentCount = staff.commentCount}
        {@const previews = staff.recentComments}
        <div class="sat-staff-item" class:sat-staff-item--open={isExpanded}>
          <div class="sat-staff-row">
            <button type="button" class="sat-person-main sat-clickable-person" onclick={() => onopenmember(staff.staffId)}>
              {#if staff.staff?.avatarUrl}
                <img src={staff.staff.avatarUrl} alt="" class="sat-person-avatar" />
              {:else}
                <span class="sat-person-avatar sat-avatar-fallback">{getSatisfactionInitials(staff.staff, staff.staffId)}</span>
              {/if}
              <span class="sat-person-text">
                <span class="sat-person-name">{getSatisfactionPersonName(staff.staff, staff.staffId)}</span>
                <span class="sat-person-handle">{getSatisfactionPersonHandle(staff.staff, staff.staffId)}</span>
              </span>
            </button>
            <div class="sat-staff-rating" style="color: {getRatingColor(staff.averageRating)}">
              {staff.averageRating.toFixed(1)}/5
            </div>
            <span class="sat-staff-count">{t.reviewsCount(staff.totalResponses)}</span>
            <div class="sat-staff-actions">
              <button
                type="button"
                class="sat-staff-chip"
                class:sat-staff-chip-muted={commentCount === 0}
                disabled={commentCount === 0}
                aria-expanded={isExpanded}
                title={commentCount === 0 ? t.noComment : t.commentsCount(commentCount)}
                aria-label={commentCount === 0 ? t.noComment : t.commentsCount(commentCount)}
                onclick={() => toggleStaffComments(staff.staffId)}
              >
                <Papicon icon="message-square" size={13} />
                <span>{commentCount}</span>
                {#if commentCount > 0}
                  <Papicon icon={isExpanded ? 'chevron-up' : 'chevron-down'} size={13} />
                {/if}
              </button>
              <button type="button" class="sat-staff-chip" onclick={() => openStaffReviews(staff.staffId, staff.staff)}>
                {t.viewAll}
              </button>
            </div>
          </div>

          {#if isExpanded}
            <div class="sat-comment-list">
              {#each previews as review (review.id)}
                <div class="sat-comment">
                  <div class="sat-comment-head">
                    <span class="sat-comment-emoji">{ratingEmojis[review.rating]}</span>
                    <button type="button" class="sat-comment-author sat-clickable-person" onclick={() => onopenmember(review.userId)}>
                      {getSatisfactionPersonName(review.user, review.userId)}
                    </button>
                    <span class="sat-comment-date">{new Date(review.createdAt).toLocaleDateString(dateLocale)}</span>
                  </div>
                  <p class="sat-comment-body">{review.comment?.[locale]}</p>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <!-- Avis récents -->
  <div class="sat-card sat-recent-card">
    <h3 class="sat-card-title">{t.recent}</h3>
    <div class="sat-recent-list">
      {#each satisfactionData.global.recent as review (review.id)}
        <div class="sat-review-item">
          <div class="sat-review-row">
            <span class="sat-review-emoji">{ratingEmojis[review.rating]}</span>
            <button type="button" class="sat-review-user sat-clickable-person" onclick={() => onopenmember(review.userId)}>
              {#if review.user?.avatarUrl}
                <img src={review.user.avatarUrl} alt="" class="sat-person-avatar" />
              {:else}
                <span class="sat-person-avatar sat-avatar-fallback">{getSatisfactionInitials(review.user, review.userId)}</span>
              {/if}
              <span class="sat-person-text">
                <span class="sat-person-name">{getSatisfactionPersonName(review.user, review.userId)}</span>
                <span class="sat-person-handle">{getSatisfactionPersonHandle(review.user, review.userId)}</span>
              </span>
            </button>
            {#if review.staff}
              <span class="sat-review-staff">{t.handledBy(getSatisfactionPersonName(review.staff, review.staffId))}</span>
            {/if}
            <span class="sat-review-date">{new Date(review.createdAt).toLocaleDateString(dateLocale)}</span>
          </div>
          {#if review.comment}
            <p class="sat-review-comment">{review.comment[locale]}</p>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- Avis d'un membre du staff -->
{#if reviewsModalStaff}
  <div class="absolute inset-0 z-100 flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal="true" aria-labelledby="sat-reviews-title" use:dialog={closeStaffReviews}>
    <div class="bg-surface border border-outline-variant/30 rounded-xl w-full max-w-2xl max-h-[85%] flex flex-col shadow-sm animate-in zoom-in-95 duration-300">
      <div class="flex items-center gap-3 p-6 border-b border-outline-variant/20">
        {#if reviewsModalStaff.staff?.avatarUrl}
          <img src={reviewsModalStaff.staff.avatarUrl} alt="" class="w-10 h-10 rounded-full object-cover" />
        {:else}
          <span class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold">
            {getSatisfactionInitials(reviewsModalStaff.staff, reviewsModalStaff.staffId)}
          </span>
        {/if}
        <div class="min-w-0 flex-1">
          <h3 id="sat-reviews-title" class="text-base font-semibold truncate">{t.reviewsOf(getSatisfactionPersonName(reviewsModalStaff.staff, reviewsModalStaff.staffId))}</h3>
          <p class="text-2xs text-on-surface-variant">{t.reviewsCount(reviewsModalTotal)}</p>
        </div>
        <button type="button" class="sat-staff-chip" class:sat-chip-active={reviewsModalCommentsOnly} aria-pressed={reviewsModalCommentsOnly} onclick={() => (reviewsModalCommentsOnly = !reviewsModalCommentsOnly)}>
          <Papicon icon="message-square" size={13} />
          {t.commentsOnly}
        </button>
        <button type="button" onclick={closeStaffReviews} aria-label={t.close} class="p-2 rounded-lg hover:bg-surface-container transition-colors">
          <Papicon icon="close" size={18} />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-3">
        {#if reviewsModalItems.length === 0}
          <p class="sat-empty">{t.noReview}</p>
        {:else}
          {#each reviewsModalItems as review (review.id)}
            <div class="sat-comment">
              <div class="sat-comment-head">
                <span class="sat-comment-emoji">{ratingEmojis[review.rating]}</span>
                <button type="button" class="sat-comment-author sat-clickable-person" onclick={() => { closeStaffReviews(); onopenmember(review.userId); }}>
                  {getSatisfactionPersonName(review.user, review.userId)}
                </button>
                <span class="sat-comment-rating" style="color: {getRatingColor(review.rating)}">{t.ratings[review.rating]}</span>
                <span class="sat-comment-date">{new Date(review.createdAt).toLocaleDateString(dateLocale)}</span>
              </div>
              {#if review.comment}
                <p class="sat-comment-body">{review.comment[locale]}</p>
              {:else}
                <p class="sat-comment-body sat-comment-empty">{t.noComment}</p>
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .sat-grid { display: grid; grid-template-columns: 300px 1fr; gap: 1rem; }
  .sat-card { background: var(--color-surface, rgba(255,255,255,0.05)); border: 1px solid var(--color-outline-variant); border-radius: 12px; padding: 1.25rem; }
  .sat-card-title { margin: 0 0 1rem; font-size: 0.95rem; color: var(--color-on-surface-variant); }

  .sat-overview-card { text-align: center; }
  .sat-avg-rating { display: flex; align-items: baseline; justify-content: center; gap: 0.25rem; }
  .sat-avg-value { font-size: 3rem; font-weight: 700; }
  .sat-avg-max { font-size: 1rem; color: color-mix(in srgb, var(--color-on-surface-variant) 75%, transparent); }
  .sat-avg-label { color: color-mix(in srgb, var(--color-on-surface-variant) 75%, transparent); font-size: 0.875rem; margin: 0.5rem 0 1.5rem; }

  .sat-distribution { display: flex; flex-direction: column; gap: 0.5rem; }
  .sat-dist-row { display: grid; grid-template-columns: 40px 1fr 30px; align-items: center; gap: 0.5rem; }
  .sat-dist-label { font-size: 0.85rem; }
  .sat-dist-bar { height: 8px; background: var(--color-outline-variant); border-radius: 4px; overflow: hidden; }
  .sat-dist-fill { height: 100%; background: var(--color-primary, #5865F2); border-radius: 4px; }
  .sat-dist-count { text-align: right; font-size: 0.8rem; color: color-mix(in srgb, var(--color-on-surface-variant) 75%, transparent); }

  .sat-staff-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .sat-staff-item { border-radius: 10px; border: 1px solid transparent; transition: border-color 160ms ease, background-color 160ms ease; }
  .sat-staff-item--open { border-color: var(--color-outline-variant); background: var(--color-surface-container, rgba(255,255,255,0.03)); }
  .sat-staff-row { display: flex; align-items: center; gap: 0.75rem; width: 100%; padding: 0.55rem; border-radius: 8px; text-align: left; }
  .sat-staff-rating { font-weight: 600; }
  .sat-staff-count { font-size: 0.8rem; color: color-mix(in srgb, var(--color-on-surface-variant) 75%, transparent); }
  .sat-staff-actions { display: flex; align-items: center; gap: 0.35rem; margin-left: auto; flex: 0 0 auto; }
  .sat-staff-chip {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.28rem 0.55rem; border-radius: 999px; cursor: pointer;
    border: 1px solid var(--color-outline-variant);
    background: transparent; color: var(--color-on-surface-variant);
    font: inherit; font-size: 0.72rem; font-weight: 700; white-space: nowrap;
    transition: background-color 160ms ease, color 160ms ease, border-color 160ms ease;
  }
  .sat-staff-chip:hover:not(:disabled) { background: var(--color-surface-container-high, rgba(255,255,255,0.08)); color: var(--color-on-surface); }
  .sat-staff-chip:focus-visible { outline: 2px solid var(--color-primary, #5865F2); outline-offset: 2px; }
  .sat-staff-chip-muted { opacity: 0.45; cursor: default; }
  .sat-chip-active { border-color: var(--color-primary, #5865F2); color: var(--color-primary, #5865F2); }

  .sat-comment-list { display: flex; flex-direction: column; gap: 0.5rem; padding: 0 0.55rem 0.65rem 3.35rem; }
  .sat-comment { border-left: 2px solid var(--color-primary, #5865F2); padding: 0.35rem 0 0.35rem 0.65rem; }
  .sat-comment-head { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.75rem; }
  .sat-comment-emoji { font-size: 0.95rem; }
  .sat-comment-author { font-weight: 700; border-radius: 4px; padding: 0 0.15rem; }
  .sat-comment-rating { font-weight: 600; }
  .sat-comment-date { color: color-mix(in srgb, var(--color-on-surface-variant) 75%, transparent); margin-left: auto; }
  /* Un avis est du texte libre : il doit passer à la ligne, jamais déborder. */
  .sat-comment-body { margin: 0.2rem 0 0; font-size: 0.82rem; line-height: 1.45; white-space: pre-wrap; overflow-wrap: anywhere; color: var(--color-on-surface); }
  .sat-comment-empty { font-style: italic; color: color-mix(in srgb, var(--color-on-surface-variant) 75%, transparent); }

  .sat-recent-card { grid-column: 1 / -1; }
  .sat-recent-list { display: flex; flex-direction: column; gap: 0.25rem; }
  .sat-review-item { padding: 0.35rem 0; border-bottom: 1px solid var(--color-outline-variant); }
  .sat-review-item:last-child { border-bottom: 0; }
  .sat-review-row { display: grid; grid-template-columns: 2rem minmax(180px, 260px) minmax(0, 1fr) auto; align-items: center; gap: 0.75rem; padding: 0.1rem 0; font-size: 0.85rem; }
  .sat-review-emoji { font-size: 1.1rem; }
  .sat-review-user { min-width: 0; }
  .sat-review-staff { color: color-mix(in srgb, var(--color-on-surface-variant) 75%, transparent); font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sat-review-comment {
    margin: 0.15rem 0 0.35rem 2.75rem; font-size: 0.82rem; line-height: 1.45;
    white-space: pre-wrap; overflow-wrap: anywhere;
    color: var(--color-on-surface);
    border-left: 2px solid var(--color-outline-variant); padding-left: 0.6rem;
  }
  .sat-review-date { color: color-mix(in srgb, var(--color-on-surface-variant) 75%, transparent); font-size: 0.75rem; }

  .sat-clickable-person { border: 0; background: transparent; color: inherit; cursor: pointer; font: inherit; padding: 0; transition: background-color 160ms ease, color 160ms ease; }
  .sat-clickable-person:hover { background: var(--color-surface-container-high, rgba(255,255,255,0.08)); }
  .sat-clickable-person:focus-visible { outline: 2px solid var(--color-primary, #5865F2); outline-offset: 2px; }
  .sat-person-main,
  .sat-review-user { display: flex; align-items: center; gap: 0.65rem; text-align: left; }
  .sat-person-main { flex: 1; min-width: 0; }
  .sat-person-avatar { width: 2rem; height: 2rem; border-radius: 999px; object-fit: cover; flex: 0 0 auto; }
  .sat-avatar-fallback { display: inline-flex; align-items: center; justify-content: center; background: var(--color-primary, #5865F2); color: white; font-size: 0.68rem; font-weight: 800; }
  .sat-person-text { display: flex; flex-direction: column; min-width: 0; line-height: 1.15; }
  .sat-person-name { color: var(--color-on-surface); font-size: 0.86rem; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sat-person-handle { color: color-mix(in srgb, var(--color-on-surface-variant) 75%, transparent); font-size: 0.7rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .sat-empty { color: color-mix(in srgb, var(--color-on-surface-variant) 75%, transparent); font-style: italic; }
</style>
