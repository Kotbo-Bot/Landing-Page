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
  (accueil `/` et `/en`, articles et leur index). Sur ces pages, l'URL décide de la langue,
  jamais le navigateur des robots : Googlebot rend le JS en `en-US`. Une nouvelle
  page bilingue s'ajoute là et dans `src/routes/sitemap.xml/+server.ts` ; si elle porte du
  JSON-LD, aussi dans `PATHS` de `seo/jsonld.js` et dans `allJsonLd()`.
- **JSON-LD sous CSP.** Il est injecté en ligne et autorisé par empreinte :
  tout son contenu vient de `src/lib/seo/jsonld.js`, que `svelte.config.js`
  importe au build. Pas de JSON-LD construit ailleurs.

## Architecture

| Dossier | Contenu |
| --- | --- |
| `src/routes/` | Les routes : accueil (`/`, `/en`), index des articles (`/fonctionnalites`, `/en/features`), article staff (`/gestion-staff-discord`, `/en/discord-staff-management`), articles de la console (`/fonctionnalites/<slug>`), pages légales, page d'erreur. |
| `src/lib/pages/` | L'accueil, l'index des articles, l'article staff et le gabarit des articles de la console, rendus par leurs deux routes. |
| `src/lib/articles/` | Les articles : la liste (`posts.ts`), le texte de l'article staff (`staff.ts`), le gabarit (`Article.svelte`), la barre forum et la liste des sujets. |
| `src/lib/seo/` | `Seo.svelte` (balises, `hreflang`), `jsonld.js`, `faq.js`. |
| `src/lib/v3/` | L'accueil, une zone par fichier, et ce que tout le site partage : barre du haut, pied de page, châssis des autres pages (`Shell`), bouton d'invitation, FAQ, cadre des écrans du dashboard (`DashStage`). |
| `src/lib/dash/` | Les écrans du dashboard recopiés (`screens/`), jouables sur des membres fictifs (`cast.ts`). |
| `src/lib/playground/` | Ce que l'accueil garde de la v2 : le kit du parcours d'installation (`kit.svelte.ts`), les aperçus Discord, la carte de rang. |
| `src/lib/components/` | `LegalPageLayout.svelte`, le gabarit des pages légales. |
| `src/lib/data/` | Pages de la console (`features.ts`), chiffres des communautés (`stats.svelte.ts`), `proof.ts` (témoignages réels, vide par défaut). |
| `static/ktb/`, `static/rank/` | Emojis du bot, polices de la carte de rang avec leurs licences. |
| `static/llms.txt`, `robots.txt` | Référencement et lecture par les assistants IA. `llms.txt` recopie les tarifs et le nombre de modules : le tenir aligné sur `v3/Price.svelte` et `v3/modules.ts`. Le sitemap est généré (`src/routes/sitemap.xml/`). |

## Articles

`/fonctionnalites` est l'index des articles, présenté comme un salon forum
Discord (`DESIGN.md`). L'article staff y est épinglé : il s'écrit ici
(`articles/staff.ts`), parce qu'il montre les vrais écrans du dashboard, et
garde son URL hors de `/fonctionnalites`. Les autres articles,
`/fonctionnalites/<slug>` et `/en/features/<slug>`, ne s'écrivent pas
ici : elles se rédigent et se publient dans la console admin de dash.kotbo.fr
(`/admin/feature-pages`, dépôt `Kotbo`). Au build, `scripts/fetch-features.mjs`
lit `api.kotbo.fr/api/public/feature-pages` et écrit
`src/lib/data/feature-pages.json` ; si l'API ne répond pas ou ne renvoie rien,
le fichier du dépôt sert tel quel. Publier une page relance le déploiement du
site (`repository_dispatch` `feature-pages`), et un build quotidien rattrape un
signal perdu. `bun run build:offline` construit sans appeler l'API.

## Notes de version

Une note par mise à jour, `/nouveautes/<slug>` et `/en/whats-new/<slug>`,
listées par `/nouveautes`. Le texte vit dans `articles/releases.js` (JS simple,
lu par `seo/jsonld.js`), réécrit depuis la release GitHub de la version. Une
nouvelle version s'ajoute en tête du tableau : elle devient la note épinglée
du forum des articles et la ligne sous le héros (`teaser`).

## Blog

Les annonces de l'équipe, `/blog/<slug>` et `/en/blog/<slug>`. Le texte vit
dans `articles/blog.js`, sur le modèle d'une note de version plus un auteur ;
un billet s'ajoute en tête du tableau. L'index `/blog` rassemble tout le site
(`ALL_POSTS`) : les billets, puis les articles, puis les notes de version.

## L'accueil v3

L'accueil vit dans `src/lib/v3/` : la page se lit comme un serveur Discord, une
zone par salon (`v3/channels.ts`, dont les `id` sont les ancres que les autres
pages visent). Elle parle au fondateur d'un serveur qui a un staff : le film du héros,
sa nuit sans Kotbo, le QG staff (écrans du dashboard recopiés dans `dash/screens`, voir `dash/cast.ts`),
l'addition, les modules (catalogue recopié dans `v3/modules.ts`, dont le compte
alimente tous les « N modules » de la page), le serveur MCP (`#ia`), la
confiance, le prix, la FAQ. `v3/AddButton` emporte encore le kit
(`playground/kit.svelte.ts`, `?kit=`) jusqu'au parcours d'installation, mais
plus aucune zone de l'accueil ne le règle.

Les autres pages (articles, légal, erreur) reprennent la barre du haut, le
pied de page et la nuit de l'accueil (`v3/Shell`) ; `html.v3` est posé dans
`app.html`, pour tout le site.

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
