# CLAUDE.md

Site vitrine de **Kotbo**, le bot et dashboard de gestion pour communautés
Discord. Dépôt séparé du produit (`Kotbo/`), déployé en statique sur `kotbo.fr`.

## Lancer le projet

```bash
bun install
bun run dev        # vite dev
bun run build      # sortie statique dans build/
bun run check      # svelte-check
```

## Contraintes structurantes

- **Site 100 % statique.** `adapter-static`, aucun serveur par requête. Tout ce
  qui a besoin d'un serveur passe par `api.kotbo.fr`.
- **Dépôt séparé.** Pas d'accès aux paquets du produit : les valeurs partagées
  sont recopiées à la main et le disent en commentaire (`product.ts`, les clés de
  `playground/kit.svelte.ts`, les fonds, les succès et la courbe d'XP de `playground/rank/draw.ts`,
  les étapes de `funnel.ts`). Toute modification se vérifie dans le dépôt produit.
- **Aucun script tiers.** `src/lib/funnel.ts` explique pourquoi : le site tient
  dans l'exemption de consentement de la CNIL. Le lire avant d'y toucher.
- **Bilingue FR/EN.** Tout texte affiché vit dans un dictionnaire `TEXT = { fr, en }`
  au sommet de son composant. Un texte codé en dur dans le balisage est un bug.
  Exception : les FAQ vivent dans `src/lib/seo/faq.js`, parce que le même texte
  nourrit le JSON-LD `FAQPage`.
- **Une URL par langue** pour les pages listées dans `src/lib/i18n/routes.ts`
  (accueil `/` et `/en`, page staff, pages fonctionnalités). Sur ces pages, l'URL décide de la langue,
  jamais le navigateur des robots : Googlebot rend le JS en `en-US`. Une nouvelle
  page bilingue s'ajoute là et dans `src/routes/sitemap.xml/+server.ts` ; si elle porte du
  JSON-LD, aussi dans `PATHS` de `seo/jsonld.js`.
- **JSON-LD sous CSP.** Il est injecté en ligne et autorisé par empreinte :
  tout son contenu vient de `src/lib/seo/jsonld.js`, que `svelte.config.js`
  importe au build. Pas de JSON-LD construit ailleurs.

## Architecture

| Dossier | Contenu |
| --- | --- |
| `src/routes/` | Les routes : accueil (`/`, `/en`), page staff (`/gestion-staff-discord`, `/en/discord-staff-management`), fonctionnalités (`/fonctionnalites`, `/en/features`), pages légales. |
| `src/lib/pages/` | L'accueil, la page staff et les pages fonctionnalités, rendus par leurs deux routes. |
| `src/lib/seo/` | `Seo.svelte` (balises, `hreflang`), `jsonld.js`, `faq.js`. |
| `src/lib/v3/` | L'accueil v3 : une zone par fichier, la barre du haut, le film du héros, le bouton d'invitation. |
| `src/lib/sections/` | Barre et pied de page des pages hors accueil, zones de la v2. |
| `src/lib/playground/` | Les zones jouables : le serveur monté (`kit.svelte.ts`), l'onboarding du héros, les aperçus Discord, la carte de rang. |
| `src/lib/components/` | Zones reprises de la v1 (catalogue, comparatif, tarifs, FAQ) et écrans du dashboard reconstitués (`mockups/`). |
| `src/lib/data/` | `media.ts` (captures et vidéos à fournir), `proof.ts` (témoignages réels, vide par défaut). |
| `static/ktb/`, `static/rank/` | Emojis du bot, polices de la carte de rang avec leurs licences. |
| `static/llms.txt`, `robots.txt` | Référencement et lecture par les assistants IA. `llms.txt` recopie les tarifs : le tenir aligné sur `Pricing.svelte`. Le sitemap est généré (`src/routes/sitemap.xml/`). |

## Pages fonctionnalités

Les pages `/fonctionnalites/<slug>` et `/en/features/<slug>` ne s'écrivent pas
ici : elles se rédigent et se publient dans la console admin de dash.kotbo.fr
(`/admin/feature-pages`, dépôt `Kotbo`). Au build, `scripts/fetch-features.mjs`
lit `api.kotbo.fr/api/public/feature-pages` et écrit
`src/lib/data/feature-pages.json` ; si l'API ne répond pas ou ne renvoie rien,
le fichier du dépôt sert tel quel. Publier une page relance le déploiement du
site (`repository_dispatch` `feature-pages`), et un build quotidien rattrape un
signal perdu. `bun run build:offline` construit sans appeler l'API.

## L'accueil v3

L'accueil vit dans `src/lib/v3/` : la page se lit comme un serveur Discord, une
zone par salon (`v3/channels.ts`, dont les `id` sont les ancres que les autres
pages visent). Elle parle au fondateur d'un serveur qui a un staff : le film du héros,
sa nuit sans Kotbo, le QG staff (écrans du dashboard recopiés dans `dash/screens`, voir `dash/cast.ts`),
l'addition, les modules, les profils de serveur, la confiance, le prix, la FAQ.
Le profil choisi dans `#setup` écrit le kit (`playground/kit.svelte.ts`) et
`v3/AddButton` l'emporte (`?kit=`) jusqu'au parcours d'installation.

Les zones jouables de la v2 (`sections/`, `playground/builder/`) ne sont plus
montées sur l'accueil.

Deux règles :

1. **Aucune commande morte.** Un bouton d'aperçu modifie l'état de l'aperçu, ou
   il n'existe pas. Les commandes montrées sont celles du bot, vérifiées dans son
   code.
2. **Aucune donnée inventée présentée comme réelle.** Les aperçus sont annoncés
   comme des démos. Les chiffres des communautés viennent de `api.kotbo.fr` : si
   l'API ne répond pas, la zone se masque.

## Direction artistique

`DESIGN.md` fait foi.

## antislop

Pour tout travail d'UI, de copy ou de mise en page, charger la skill `antislop`
puis la skill adaptée (`antislop-ui`, `antislop-copywriting`, `antislop-human`,
`antislop-layoutmobile`, `antislop-code`). La direction vient de `DESIGN.md` ;
antislop n'est qu'un filtre par-dessus. Demander avant de commencer si antislop
s'applique pendant le travail ou en audit après coup.
