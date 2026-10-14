/**
 * Le thème de l'accueil (sombre ou clair), posé avant le premier affichage.
 *
 * Le choix du visiteur vit dans `localStorage` (`v3/ThemeToggle.svelte`). Ce
 * script tourne en ligne dans le <head> (`hooks.server.ts`) pour que la page
 * ne s'affiche pas en sombre puis bascule. Sans choix enregistré, c'est le
 * sombre : la direction artistique part de la nuit du dashboard (DESIGN.md).
 *
 * La CSP l'autorise par son empreinte, calculée sur cette chaîne dans
 * `svelte.config.js` : modifier le texte suffit, l'empreinte suit.
 */
export const THEME_KEY = 'kotbo-theme';

export const THEME_BOOT = `try{if(localStorage.getItem('${THEME_KEY}')==='light')document.documentElement.dataset.theme='light'}catch(e){}`;
