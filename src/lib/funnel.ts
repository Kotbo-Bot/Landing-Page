/**
 * Mesure d'audience de la landing.
 *
 * kotbo.fr est un site statique servi par Cloudflare : il n'a pas de serveur à
 * lui. Ce module envoie donc ce qu'il observe à l'API du bot, seule à pouvoir
 * l'écrire. Sans lui, le tunnel d'acquisition commencerait à l'arrivée du bot
 * sur un serveur, c'est-à-dire aux seuls gagnants - on ne saurait jamais
 * combien de visiteurs lisent les tarifs puis s'en vont.
 *
 * ── Les contraintes ne sont pas décoratives ─────────────────────────────────
 *
 * Ce fichier est écrit pour tenir dans l'exemption de consentement que la CNIL
 * accorde à la mesure d'audience. Chacune des règles ci-dessous en est une
 * condition, et en lever une seule obligerait à afficher une bannière sur tout
 * le site (voir la page /cookies) :
 *
 *   - aucun cookie, et un identifiant en `sessionStorage` qui meurt avec
 *     l'onglet ;
 *   - aucun outil tiers, aucun script externe : tout part vers api.kotbo.fr ;
 *   - du référent, seule la **catégorie** est transmise - l'URL complète d'un
 *     moteur de recherche contient la requête tapée, donc une donnée
 *     personnelle ;
 *   - rien n'est jamais rapproché d'un compte Discord ;
 *   - `Do Not Track`, `Global Privacy Control` et le refus explicite coupent
 *     tout envoi.
 *
 * ── Ne jamais gêner le visiteur ─────────────────────────────────────────────
 *
 * Tout est enveloppé : un stockage inaccessible, un réseau coupé, une API
 * éteinte ne doivent produire ni erreur visible, ni retard. `sendBeacon` remet
 * l'envoi au navigateur, qui s'en occupe même si la page se ferme dans la
 * seconde - et dont la réponse n'est jamais lue.
 */
import { browser } from '$app/environment';

/**
 * Étapes que ce site peut déclarer.
 *
 * Recopiées et non importées : la landing est un dépôt séparé, elle n'a pas
 * accès à `@kotbo/contracts` où vit la liste complète. La duplication est
 * volontairement limitée à l'amont du tunnel, et sans conséquence sur les
 * données : c'est le bot qui tranche, en refusant tout ce qui n'est pas dans sa
 * propre liste (`isPublicAcquisitionStep`). Un nom qui divergerait ici serait
 * ignoré la-bas, jamais ecrit de travers.
 */
export type FunnelStep =
  | 'site_visit'
  | 'pricing_viewed'
  | 'comparison_viewed'
  | 'faq_opened'
  | 'sales_clicked'
  /**
   * Premier geste dans une zone jouable (`content` : `builder`, `crisis`,
   * `commands`, `rankcard`). Sans elle, on saurait combien invitent le bot,
   * jamais combien ont joué avant.
   */
  | 'playground_started'
  /** La zone jouable menée au bout : serveur monté, soirée réglée, carte téléchargée. */
  | 'playground_completed'
  | 'invite_clicked';

/**
 * Canaux de provenance reconnus, alignés sur `ACQUISITION_REFERRERS`.
 * Le bot refuse toute valeur hors de cette liste.
 */
type Referrer = 'google' | 'bing' | 'duckduckgo' | 'discord' | 'internal' | 'direct' | 'other';

const REFERRER_HOSTS: ReadonlyArray<readonly [RegExp, Referrer]> = [
  [/(^|\.)google\./i, 'google'],
  [/(^|\.)bing\./i, 'bing'],
  [/(^|\.)duckduckgo\./i, 'duckduckgo'],
  [/(^|\.)(discord\.com|discordapp\.com|discord\.gg)$/i, 'discord'],
  [/(^|\.)kotbo\.fr$/i, 'internal'],
];

/**
 * Classe un référent en canal, et ne renvoie que ça.
 *
 * C'est la fonction qui garde la mesure dans l'exemption de consentement :
 * l'URL complète d'une recherche Google contient la requête tapée. Elle ne doit
 * jamais quitter le navigateur, et le seul moyen sûr de s'en assurer est de ne
 * jamais la mettre dans le corps envoyé.
 */
function classifyReferrer(referrer: string | null | undefined): Referrer {
  if (!referrer) return 'direct';

  let host = referrer.trim();
  if (!host) return 'direct';

  try {
    host = new URL(host).hostname;
  } catch {
    host = host.replace(/^https?:\/\//i, '').split('/')[0] ?? '';
  }
  if (!host) return 'direct';

  for (const [pattern, channel] of REFERRER_HOSTS) {
    if (pattern.test(host)) return channel;
  }
  return 'other';
}

/** Point de collecte, côté bot. */
const ENDPOINT = 'https://api.kotbo.fr/api/public/funnel';

/** Identifiant de visite. `sessionStorage` : il meurt avec l'onglet. */
const VISITOR_KEY = 'kotbo:vid';
/** Refus explicite, posé par l'interrupteur de la page /cookies. */
const OPT_OUT_KEY = 'kotbo:no-measure';

/** Étapes déjà envoyées dans cette page. Une section vue l'est une fois. */
const sent = new Set<string>();

/**
 * Le visiteur a-t-il refusé, d'une manière ou d'une autre ?
 *
 * Trois signaux, tous respectés sans discussion : le refus explicite mémorisé
 * par la page /cookies, et les deux signaux que le navigateur peut émettre de
 * lui-même. Un stockage inaccessible fait pencher vers le refus - en cas de
 * doute on ne mesure pas.
 */
function optedOut(): boolean {
  if (!browser) return true;

  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.doNotTrack === '1' || nav.globalPrivacyControl === true) return true;

  try {
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    return true;
  }
}

/**
 * Identifiant de cette visite, créé au besoin.
 *
 * Aléatoire, jamais dérivé de quoi que ce soit qui identifie la personne. Son
 * seul rôle : savoir qu'une même visite a lu les tarifs *puis* installé le bot,
 * plutôt que de compter deux personnes. Renvoie `null` si le stockage est
 * refusé - la mesure fonctionne alors sans recoller les étapes, ce qui est
 * dégradé mais correct.
 */
export function visitorId(): string | null {
  if (!browser || optedOut()) return null;

  try {
    const existing = sessionStorage.getItem(VISITOR_KEY);
    if (existing) return existing;

    const fresh = crypto.randomUUID();
    sessionStorage.setItem(VISITOR_KEY, fresh);
    return fresh;
  } catch {
    return null;
  }
}

interface TrackOptions {
  /** Emplacement précis du clic (`hero`, `pricing`, `faq`…). */
  content?: string;
  /** Chemin de la page, quand il ajoute quelque chose. */
  path?: string;
  /** N'envoyer qu'une fois par page. Vrai par défaut. */
  once?: boolean;
}

/**
 * Signale le franchissement d'une étape.
 *
 * Ne renvoie rien et ne jette jamais : l'appelant est du code d'interface, il
 * n'a ni à attendre ni à rattraper quoi que ce soit.
 */
export function track(step: FunnelStep, options: TrackOptions = {}): void {
  if (!browser || optedOut()) return;

  const key = `${step}:${options.content ?? ''}`;
  if (options.once !== false) {
    if (sent.has(key)) return;
    sent.add(key);
  }

  try {
    const payload: Record<string, unknown> = {
      step,
      source: 'landing',
      visitorId: visitorId(),
    };
    if (options.content) payload.content = options.content;
    if (options.path) payload.path = options.path;

    // La catégorie, jamais l'URL. `document.referrer` est vide dès la deuxième
    // page d'une navigation interne : c'est voulu, seule la première visite
    // porte une provenance.
    if (step === 'site_visit') {
      payload.referrer = classifyReferrer(document.referrer);
    }

    const body = JSON.stringify(payload);

    // `sendBeacon` d'abord : il survit à la fermeture de l'onglet, ce qui est
    // exactement le cas d'un clic sortant vers Discord. `fetch` en repli, avec
    // `keepalive` pour la même raison.
    if (typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
      return;
    }

    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
      mode: 'cors',
    }).catch(() => {
      // Une mesure perdue n'a aucune conséquence pour le visiteur.
    });
  } catch {
    // Idem : on ne casse jamais la page pour une statistique.
  }
}

/**
 * Action Svelte : signale une étape quand l'élément devient réellement visible.
 *
 * « La section tarifs a été vue » ne peut pas se déduire de sa présence dans le
 * document - elle y est dès le premier octet. C'est l'affichage à l'écran qui
 * fait l'événement, d'où l'observateur, déconnecté au premier déclenchement.
 *
 * Le site utilise déjà ce mécanisme pour ses animations (`lib/actions/reveal`) :
 * on le réutilise plutôt que d'en introduire un second.
 */
export function trackOnView(node: HTMLElement, step: FunnelStep) {
  if (!browser || optedOut()) return {};

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      track(step);
      observer.disconnect();
    },
    // Un tiers de la section visible : assez pour dire qu'elle a été lue, pas
    // assez pour rater ceux qui défilent vite.
    { threshold: 0.33 },
  );

  observer.observe(node);
  return { destroy: () => observer.disconnect() };
}

/**
 * URL d'invitation qualifiée.
 *
 * La page portait une seule constante partagée par ses cinq boutons : on savait
 * qu'un clic venait de la landing, jamais lequel des cinq l'avait produit -
 * c'est-à-dire jamais ce qui convainc réellement.
 *
 * L'identifiant de visite voyage dans l'URL parce que c'est le seul moyen de
 * relier ce clic au serveur qui en sortira peut-être : le dashboard est sur un
 * autre domaine, rien de ce que stocke ce site ne lui est lisible.
 *
 * `kit` porte les réglages du serveur monté sur la page (voir
 * `playground/kit.svelte.ts`). Il voyage même quand la mesure est refusée : ce
 * n'est pas une statistique mais ce que le visiteur a demandé qu'on installe.
 */
export function inviteUrl(content: string, kit: string | null = null): string {
  const params = new URLSearchParams({ utm_source: 'landing', utm_content: content });
  const vid = visitorId();
  if (vid) params.set('vid', vid);
  if (kit) params.set('kit', kit);
  return `https://api.kotbo.fr/api/public/invite?${params.toString()}`;
}
