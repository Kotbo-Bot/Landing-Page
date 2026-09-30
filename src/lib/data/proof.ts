/**
 * Témoignages d'administrateurs, à remplir à la main.
 *
 * Chaque entrée doit être réelle et publiée avec l'accord écrit de la personne
 * (nom affiché, serveur, citation mot pour mot). Tant que la liste est vide, le
 * bloc n'existe pas sur la page : un faux témoignage coûte plus cher qu'une
 * absence de témoignage.
 *
 * Les serveurs mis en avant, eux, ne vivent pas ici : ils viennent de
 * `api.kotbo.fr/api/public/stats`, avec leur nombre de membres à jour.
 */
export interface Testimonial {
  /** Citation exacte, dans sa langue d'origine. */
  quote: string;
  /** Tel que la personne veut être nommée (pseudo Discord accepté). */
  author: string;
  /** Son rôle sur le serveur : « fondateur », « responsable modération »… */
  role: { fr: string; en: string };
  server: string;
  /** Icône du serveur, déposée dans `static/proof/`. Facultative. */
  serverIcon?: string;
}

export const TESTIMONIALS: Testimonial[] = [];
