// `/en/` plutôt que `/en` : la page devient `en/index.html`, à côté du dossier
// `en/` de la page staff. Un hébergeur statique (GitHub Pages) ne sait pas
// servir à la fois `en.html` et un dossier `en/`.
export const trailingSlash = 'always';
