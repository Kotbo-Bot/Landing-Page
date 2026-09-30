/**
 * Le serveur que le visiteur monte sur la page.
 *
 * C'est l'objet central de la v2 : le héros l'écrit, les autres zones le
 * relisent (le nom du serveur dans les aperçus, le bouton d'invitation qui dit
 * « Ajouter Kotbo à Les Nerds »), et le lien d'invitation en emporte la partie
 * qui a un sens pour le vrai serveur.
 *
 * ── Ce qui part au bot, et ce qui reste ici ─────────────────────────────────
 *
 * Le parcours d'installation du dashboard pose déjà les mêmes questions : la
 * vocation du serveur, les pistes à configurer, le niveau de modération. Les
 * clés ci-dessous sont donc recopiées de `apps/dashboard/src/lib/onboarding`
 * (`ThemeKey`, `TrackKey`, `ModerationLevel`) - ce dépôt n'a pas accès au
 * produit, et une clé qui divergerait serait ignorée là-bas, jamais appliquée
 * de travers. Le parcours reprend ces réponses au lieu de les redemander.
 *
 * Le nom, l'icône et le message d'accueil restent dans le navigateur : le vrai
 * serveur a déjà un nom, et un texte libre n'a rien à faire dans une URL.
 *
 * ── Mémoire ─────────────────────────────────────────────────────────────────
 *
 * `localStorage`, parce que c'est le visiteur qui construit et qu'il s'attend à
 * retrouver son serveur en revenant. Rien n'en sort : ce n'est pas de la mesure
 * d'audience, c'est l'état d'un outil qu'il utilise (la page /cookies le dit).
 */
import { browser } from '$app/environment';

export type ThemeKey = 'communaute' | 'gaming' | 'entraide' | 'creation';
export type ModerationLevel = 'light' | 'standard' | 'strict';

/**
 * Les pistes que le visiteur peut cocher. `structure` n'y est pas : le
 * parcours la coche d'office, et la décocher ici n'aurait aucun effet visible.
 * `mcp` non plus : le pilotage par IA ne se montre pas dans un aperçu Discord.
 */
export type TrackKey =
  | 'greeting'
  | 'rules'
  | 'tickets'
  | 'moderation'
  | 'levels'
  | 'economy'
  | 'animation'
  | 'staff'
  | 'logs';

export const THEME_KEYS: readonly ThemeKey[] = ['communaute', 'gaming', 'entraide', 'creation'];
export const TRACK_KEYS: readonly TrackKey[] = [
  'greeting',
  'rules',
  'tickets',
  'moderation',
  'levels',
  'economy',
  'animation',
  'staff',
  'logs',
];
export const MODERATION_LEVELS: readonly ModerationLevel[] = ['light', 'standard', 'strict'];

/**
 * Icônes proposées pour le serveur : les emojis que la carte de rang du bot
 * embarque déjà (Twemoji, CC-BY 4.0, voir `static/rank/emojis/NOTICE.md`).
 */
export const SERVER_ICONS = [
  '1f3ae', '1f525', '1f680', '1f98a', '1f43a', '1f451', '1f48e', '1f3af',
  '1f3a7', '1f338', '1f30a', '1fa90',
] as const;
export type ServerIcon = (typeof SERVER_ICONS)[number];

/** Pistes cochées d'office, par vocation. Ce qu'un serveur de ce genre utilise d'abord. */
const DEFAULT_TRACKS: Record<ThemeKey, TrackKey[]> = {
  communaute: ['greeting', 'rules', 'tickets', 'moderation', 'levels'],
  gaming: ['greeting', 'tickets', 'moderation', 'levels', 'economy'],
  entraide: ['greeting', 'rules', 'tickets', 'moderation', 'staff'],
  creation: ['greeting', 'rules', 'moderation', 'levels', 'animation'],
};

export interface Kit {
  name: string;
  icon: ServerIcon;
  theme: ThemeKey;
  tracks: TrackKey[];
  moderation: ModerationLevel;
  /** Texte d'accueil. `{membre}` et `{serveur}` sont remplacés à l'affichage. */
  welcome: string;
  /** Les pistes ont été réglées à la main : changer de vocation ne les écrase plus. */
  tracksEdited: boolean;
  /** Le visiteur a-t-il touché à quelque chose ? Tant que non, rien n'est retenu. */
  touched: boolean;
}

const STORAGE_KEY = 'kotbo-kit';
const NAME_MAX = 32;
export const WELCOME_MAX = 180;

function initialKit(): Kit {
  return {
    name: '',
    icon: '1f3ae',
    theme: 'communaute',
    tracks: [...DEFAULT_TRACKS.communaute],
    moderation: 'standard',
    welcome: '',
    tracksEdited: false,
    touched: false,
  };
}

/**
 * Relit ce que le navigateur a gardé, clé par clé.
 *
 * L'objet peut venir d'une version antérieure de la page : une piste renommée
 * depuis est écartée, une vocation inconnue revient au défaut. Rejeter l'objet
 * entier ferait perdre au visiteur le nom qu'il avait tapé.
 */
function restore(): Kit {
  const kit = initialKit();
  if (!browser) return kit;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return kit;
    const saved = JSON.parse(raw) as Partial<Record<keyof Kit, unknown>>;

    if (typeof saved.name === 'string') kit.name = saved.name.slice(0, NAME_MAX);
    if (SERVER_ICONS.includes(saved.icon as ServerIcon)) kit.icon = saved.icon as ServerIcon;
    if (THEME_KEYS.includes(saved.theme as ThemeKey)) kit.theme = saved.theme as ThemeKey;
    if (MODERATION_LEVELS.includes(saved.moderation as ModerationLevel)) {
      kit.moderation = saved.moderation as ModerationLevel;
    }
    if (Array.isArray(saved.tracks)) {
      kit.tracks = saved.tracks.filter((t): t is TrackKey => TRACK_KEYS.includes(t as TrackKey));
    }
    if (typeof saved.welcome === 'string') kit.welcome = saved.welcome.slice(0, WELCOME_MAX);
    kit.tracksEdited = saved.tracksEdited === true;
    kit.touched = saved.touched === true;
  } catch {
    // Stockage refusé ou objet illisible : on repart d'un serveur vierge.
  }
  return kit;
}

let kit = $state<Kit>(initialKit());
let restored = $state(false);

function persist(): void {
  if (!browser || !kit.touched) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(kit));
  } catch {
    // Navigation privée, quota plein : le serveur vaut pour cette visite.
  }
}

function touch(): void {
  kit.touched = true;
  persist();
}

export const builder = {
  get kit(): Kit {
    return kit;
  },

  /** Vrai une fois la mémoire relue. Évite d'afficher « bon retour » avant de savoir. */
  get restored(): boolean {
    return restored;
  },

  /** Le nom à afficher : celui tapé, sinon un nom par défaut lisible. */
  displayName(fallback: string): string {
    return kit.name.trim() || fallback;
  },

  /** À appeler une fois côté client. */
  hydrate(): void {
    if (restored) return;
    kit = restore();
    restored = true;
  },

  setName(value: string): void {
    kit.name = value.slice(0, NAME_MAX);
    touch();
  },

  setIcon(icon: ServerIcon): void {
    kit.icon = icon;
    touch();
  },

  /**
   * Changer de vocation remet les pistes par défaut de la nouvelle, sauf si le
   * visiteur les a déjà réglées à la main : écraser ses choix pour un clic sur
   * « Du jeu » serait la meilleure façon de le décourager.
   */
  setTheme(theme: ThemeKey): void {
    kit.theme = theme;
    if (!kit.tracksEdited) kit.tracks = [...DEFAULT_TRACKS[theme]];
    touch();
  },

  toggleTrack(track: TrackKey): void {
    kit.tracks = kit.tracks.includes(track)
      ? kit.tracks.filter((t) => t !== track)
      : TRACK_KEYS.filter((t) => t === track || kit.tracks.includes(t));
    kit.tracksEdited = true;
    touch();
  },

  setModeration(level: ModerationLevel): void {
    kit.moderation = level;
    touch();
  },

  setWelcome(value: string): void {
    kit.welcome = value.slice(0, WELCOME_MAX);
    touch();
  },

  has(track: TrackKey): boolean {
    return kit.tracks.includes(track);
  },

  /** Oublie tout : le visiteur veut recommencer. */
  reset(): void {
    kit = initialKit();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Rien à effacer.
    }
  },
};

/**
 * La partie du serveur qui voyage jusqu'au dashboard, en une chaîne courte.
 *
 * `1.gaming.standard.greeting-tickets-levels` : version, vocation, niveau de
 * modération, pistes. Le jeu de caractères est volontairement étroit
 * (`[a-z0-9.-]`) : l'API du bot la recopie telle quelle dans une redirection
 * et la refuse au moindre caractère hors de ce jeu.
 *
 * `null` tant que le visiteur n'a rien construit : un lien d'invitation qui
 * porterait les réglages par défaut ferait croire au parcours qu'on les a
 * choisis.
 */
export function encodeKit(value: Kit): string | null {
  if (!value.touched) return null;
  const tracks = TRACK_KEYS.filter((t) => value.tracks.includes(t));
  return ['1', value.theme, value.moderation, tracks.join('-') || 'none'].join('.');
}
