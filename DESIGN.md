# Direction artistique - kotbo.fr

Source de vérité de l'apparence du site vitrine. Quand une décision de style se
pose, la réponse se cherche ici avant de s'inventer ailleurs.

Tout le site est en v3 : l'accueil, les articles, les pages légales et la page
d'erreur partagent la même nuit, la même barre du haut (`v3/Nav`) et le même
pied de page (`v3/Footer`). La v2 (le tableau à points, les post-its, le
marqueur) n'existe plus.

# v3 : la nuit du dashboard

## Le concept

**La page est un serveur Discord.** Chaque zone est un salon (`v3/channels.ts`),
ouvert par sa barre de salon (nom + sujet). La navigation tient dans une seule
barre en haut (`v3/Nav`), un panneau sous elle sur téléphone. La cible, le fondateur d'un serveur
qui a un staff, vit dans Discord : il lit la page dans une grammaire qu'il
connaît par cœur.

Le héros dit en trois secondes ce que c'est (bot Discord + dashboard), pour qui
(les serveurs qui ont un staff), pourquoi lui (la pile de bots part, le staff
est géré). Le film de 20 s (Vimeo, `v3/HeroVideo`) est à gauche du texte, visible
sans défiler ; sur téléphone, il suit le titre.

## Palette

Les surfaces sombres du dashboard (zinc) et son indigo. Jetons dans
`routes/layout.css` (`night`, `night-2..4`, `line`, `fog`, `mist`, `glow`…).

| Rôle | Valeur | Usage |
| --- | --- | --- |
| fond | `#09090b` / `#111113` | Les zones alternent entre les deux. |
| texte | `#fafafa`, `mist #d4d4d8`, `fog #a1a1aa` | `fog` est le plus clair autorisé pour du texte courant. |
| action | `#4f46e5` | Le bouton « Ajouter à Discord » et l'aplat final. Rien d'autre. |
| états | `alarm #f87171`, `ok #4ade80`, `amber #fbbf24` | Ce qui déraille, ce qui est réglé. Jamais décoratif. |
| Discord | `#313338`, `#2b2d31`, `#1e1f22` | Dans les aperçus Discord seulement. |

Le ticket de caisse est le seul objet clair de la page : c'est le moment où l'on
compte, il se lit comme un papier.

**Mode clair.** Le visiteur peut passer l'accueil en clair (soleil à côté de la
langue, `v3/ThemeToggle`). Les mêmes jetons prennent des valeurs zinc claires
sous `[data-theme='light']` (`routes/layout.css`), et `ink` porte le texte
principal (blanc la nuit, noir en clair) : `text-white` ne sert plus qu'à ce
qui reste blanc dans les deux thèmes. Ce qui montre un vrai écran sombre
(aperçus Discord, journaux du bot, écrans du dashboard, téléphone) porte
`stay-dark` et garde la nuit. Le sombre reste le thème par défaut.

## Typographie

Celle du dashboard : **Outfit** 800/900 pour les titres, **Inter** pour le texte,
**JetBrains Mono** uniquement pour ce qu'une machine écrit (journaux, ticket de
caisse). Pas de mono décoratif, pas de sur-titre au-dessus des titres, pas de
mot coloré dans un titre. `text-balance` sur les titres.

## Garde-fous anti-slop

Passés au crible des skills antislop, `frontend-design` (Anthropic),
impeccable, taste-skill et humanizer. À ne pas réintroduire :

- halo flouté, grille de fond, ombre colorée, bouton qui « glow », point qui pulse ;
- pilule au-dessus du H1, étoiles en glyphes, chaîne de « · » ;
- grille bento ou rangée de cartes identiques icône + titre + texte ;
- bordure gauche colorée hors de vrais embeds Discord, emoji dans l'interface
  (ils restent permis dans les noms de salons des aperçus, comme dans Discord) ;
- fade-up sur chaque zone, rebond, texte invisible tant que le JS n'a pas tourné ;
- même mise en page deux fois de suite : chaque zone a sa forme (film,
  téléphone qui vibre, onglets, ticket, index, console MCP, conversation, phrase-tarif) ;
- en copy : « c'est pas X, c'est Y », fragments en rafale, triplets, mots creux
  (permettre, optimiser, robuste, écosystème…), tiret cadratin.

## Ton

Tutoiement, oral, celui des admins sous les tutos Discord (« frr », « modo »,
« fonda », « kick »), sans forcer l'argot. Une blague par zone au plus. Les
scènes (téléphone, conversation, journaux) sont annoncées fictives.

## Données

Inchangé : chiffres réels de `api.kotbo.fr` ou rien ; prix concurrents en ordre
de grandeur, datés (`v3/Receipt`) ; Kotbo opposé à son prix le plus bas.

---

# Les articles : le forum du serveur

Si l'accueil est un serveur Discord, les articles en sont le salon forum : un
sujet par article (`articles/`). L'index (`/fonctionnalites`) se lit comme la
liste des sujets, l'article staff épinglé en tête, les pages de la console
ensuite ; chaque article s'ouvre sur la barre « forum › sujet »
(`articles/ForumBar`), qui sert de fil d'Ariane.

- **Un sujet par ligne, pas de cartes.** La liste se lit de haut en bas :
  pictogramme du module (emoji du bot), titre, résumé, étiquette, temps de
  lecture calculé sur le texte réel.
- **Une colonne de lecture.** Sous le titre : l'auteur (Kotbo) et le temps de
  lecture, comme la ligne d'auteur d'un message. Le texte tient sur une
  colonne, le sommaire le suit à droite sur grand écran.
- **Les vrais écrans, quand l'article en a.** L'article staff montre les
  écrans du dashboard (`v3/DashStage`), jouables et annoncés fictifs. Les
  pages de la console n'en ont pas : pas d'illustration de remplissage.
- **Fin d'article** : la FAQ (même liste que l'accueil, `v3/FaqList`), trois
  autres sujets, puis l'invitation sur `night-2`. L'aplat indigo reste
  réservé au dernier appel de l'accueil.

Les pages légales gardent le même châssis (`v3/Shell`, sans barre
d'invitation) : titre, sommaire, texte sur les jetons de la v3, donc lisible
dans les deux thèmes.
