/**
 * Les captures et vidéos réelles que la page sait afficher.
 *
 * Chaque entrée est un emplacement prêt : tant que `src` vaut `null`, la page
 * garde son rendu HTML (les écrans reconstitués de `components/mockups`) ou
 * masque le bloc. Pour activer un média, déposer le fichier dans `static/media/`
 * et renseigner `src` (et `poster` pour une vidéo). Rien d'autre à toucher.
 *
 * Formats attendus : captures en WebP ou PNG à 2× la taille affichée ; boucles
 * en WebM (VP9) sans son, moins de 2 Mo, avec une image `poster` pour le
 * premier affichage et pour `prefers-reduced-motion`.
 */
export interface MediaSlot {
  /** Ce que le fichier doit montrer. Sert aussi de texte alternatif. */
  alt: { fr: string; en: string };
  kind: 'image' | 'video';
  src: string | null;
  poster?: string | null;
  /** Taille intrinsèque, pour réserver la place et éviter le saut de mise en page. */
  width: number;
  height: number;
}

export const MEDIA = {
  /** Fiche membre du dashboard, pleine largeur (zone « dashboard »). */
  dashboardProfile: {
    alt: { fr: 'Fiche membre dans le dashboard Kotbo', en: 'Member profile in the Kotbo dashboard' },
    kind: 'image',
    src: null,
    width: 2480,
    height: 1280,
  },
  /** Vue de l'équipe du dashboard (zone « dashboard », colonne gauche). */
  dashboardStaff: {
    alt: { fr: 'Vue de l’équipe dans le dashboard Kotbo', en: 'Staff view in the Kotbo dashboard' },
    kind: 'image',
    src: null,
    width: 1200,
    height: 880,
  },
  /** Dossier d'une sanction (zone « dashboard », colonne droite). */
  dashboardSanction: {
    alt: { fr: 'Dossier d’une sanction dans le dashboard Kotbo', en: 'Sanction record in the Kotbo dashboard' },
    kind: 'image',
    src: null,
    width: 1200,
    height: 800,
  },
  /**
   * Le parcours d'installation guidée, de l'ajout du bot au serveur monté.
   * Boucle de 20 à 30 s. Tant qu'elle manque, le bloc « après le clic » ne
   * s'affiche pas.
   */
  setupWalkthrough: {
    alt: {
      fr: 'Installation guidée de Kotbo : le serveur se monte étape par étape',
      en: 'Kotbo guided setup: the server is built step by step',
    },
    kind: 'video',
    src: null,
    poster: null,
    width: 1600,
    height: 1000,
  },
} satisfies Record<string, MediaSlot>;

export type MediaKey = keyof typeof MEDIA;
