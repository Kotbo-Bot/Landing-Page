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
  `playground/kit.svelte.ts`, les fonds et la courbe d'XP de `playground/rank/draw.ts`,
  les étapes de `funnel.ts`). Toute modification se vérifie dans le dépôt produit.
- **Aucun script tiers.** `src/lib/funnel.ts` explique pourquoi : le site tient
  dans l'exemption de consentement de la CNIL. Le lire avant d'y toucher.
- **Bilingue FR/EN.** Tout texte affiché vit dans un dictionnaire `TEXT = { fr, en }`
  au sommet de son composant. Un texte codé en dur dans le balisage est un bug.

## Architecture

| Dossier | Contenu |
| --- | --- |
| `src/routes/` | L'accueil et les pages légales. |
| `src/lib/sections/` | Les zones de l'accueil, une par fichier. |
| `src/lib/playground/` | Les zones jouables : le serveur monté (`kit.svelte.ts`), l'onboarding du héros, les aperçus Discord, la carte de rang. |
| `src/lib/components/` | Zones reprises de la v1 (catalogue, comparatif, tarifs, FAQ) et écrans du dashboard reconstitués (`mockups/`). |
| `src/lib/data/` | `media.ts` (captures et vidéos à fournir), `proof.ts` (témoignages réels, vide par défaut). |
| `static/ktb/`, `static/rank/` | Emojis du bot, polices et emojis de la carte de rang, avec leurs licences. |

## Le principe de la v2

Le visiteur essaie avant de lire. Le héros est un onboarding en trois questions
qui monte un serveur dans un aperçu Discord ; la soirée qui dérape, la console
de commandes et l'atelier de carte de rang suivent. Chaque zone se termine sur
`InviteButton`, qui reprend le nom du serveur monté et emporte ses réglages
(`?kit=`) jusqu'au parcours d'installation du dashboard, qui ne les redemande pas.

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
