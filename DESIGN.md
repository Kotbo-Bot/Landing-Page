# Direction artistique - kotbo.fr (v2)

Source de vérité de l'apparence du site vitrine. Quand une décision de style se
pose, la réponse se cherche ici avant de s'inventer ailleurs.

## Le concept

**Le visiteur monte son serveur sur la page.**

La v1 montrait Kotbo. La v2 le fait essayer : chaque zone forte de l'accueil
est une chose à faire (monter un serveur, calmer une soirée qui dérape, taper
une commande, fabriquer sa carte de rang). Le bouton d'invitation arrive à la
fin de chacune, quand le visiteur a déjà quelque chose qu'il ne veut pas perdre.

Deux matières, et elles ne se mélangent pas :

- **Le tableau** : fond clair piqué de points, post-its, écriture au marqueur.
  C'est l'espace du visiteur, ses notes, ses hésitations.
- **Discord** : les aperçus sont des clients Discord sombres, aux couleurs de
  Discord. Ce sont les seuls objets sombres posés sur le tableau, parce que
  c'est là que le résultat se voit. Ils sont nets, droits, jamais tournés.

Deux zones passent en **aplat encre**, pleine largeur, façon affiche : la
soirée qui dérape (c'est la nuit, le serveur déraille) et les chiffres des
communautés (gros chiffres blancs, rien d'autre). C'est l'apport de la
référence Humanitour : un registre franc pour les moments où la page parle
fort, et le reste de la page au calme.

## Dials

`ENERGY 3 / RHYTHM 3 / MOTION 3`

- **Energy 3** : la page doit donner envie de cliquer dès le premier écran.
  Le héros est un outil, pas une affiche.
- **Rhythm 3** : chaque zone a sa composition (outil en deux colonnes, fil de
  discussion minuté, console de commandes, atelier de carte, aplat de
  chiffres). Le comparatif et les tarifs restent grillés : c'est leur propos.
- **Motion 3** : le mouvement montre une conséquence. Un salon apparaît quand
  on coche son module, un message tombe quand un membre arrive, un incident
  s'efface quand on le règle, la barre d'XP se remplit. Rien ne flotte ni ne
  pulse en boucle. `prefers-reduced-motion` coupe les déplacements, les
  changements d'état restent visibles.
  Exception validée : le film de présentation (`KotboFilm`, fin de la zone
  dashboard, rendu par `motion/`) boucle. Il se met en pause hors écran ou sur
  son bouton Pause, et ne démarre jamais seul en mouvement réduit.

## Palette

| Rôle | Valeur | Pourquoi |
| --- | --- | --- |
| `--color-board` | `#f8f9fa` | Surface du tableau, reprise de la v1. |
| encre (`gray-900`) | `#111827` | Texte, boutons secondaires, aplats. |
| accent (`indigo-600`) | `#4f46e5` | La couleur de Kotbo sur la v1. Réservée à l'action principale (inviter le bot) et au cercle au marqueur. |
| `--color-marker-red` | `#ff4d4d` | Ce qui déraille : incidents, urgences. Jamais décoratif. Texte courant en `red-700`. |
| Discord | `#313338`, `#2b2d31`, `#1e1f22` | Les vraies surfaces de Discord, dans les aperçus uniquement. |

Les post-its gardent leurs trois teintes de papier. Ils ne portent pas de
texte d'information, seulement des annotations.

## Typographie

| Famille | Rôle | Pourquoi |
| --- | --- | --- |
| Manrope 800 | Titres | Reprise de la v1. Ronde et dense, elle tient le très gros corps de la couverture. |
| Inter | Texte et interfaces | La police du dashboard : la page et le produit parlent pareil. |
| Caveat | Annotations | La voix du visiteur. Elle commente, elle n'informe jamais. |

Pas de libellés en capitales étirées, pas de boutons en capitales : la v1 en
abusait.

## Pictogrammes

Les pictogrammes sont les emojis du bot (`static/ktb/`), ceux que les membres
voient dans les messages de Kotbo. Pas de bibliothèque d'icônes générique :
un picto sur la page doit être un picto que le produit utilise.

## Motifs d'identité

1. **Le post-it scotché** porte les notes du visiteur.
2. **Le cercle au marqueur** entoure un mot, une fois par zone au plus.
3. **Le bouton d'invitation personnalisé** : dès que le visiteur a nommé son
   serveur, tous les boutons disent « Ajouter Kotbo à <son serveur> ».

## Composition

- Une zone, un point focal. Sur le héros, c'est l'aperçu Discord.
- Rayons : 8 px pour les champs, 12 px pour les boutons, 16 px pour les
  cartes. Les aperçus Discord ont les rayons de Discord.
- Les ombres marquent la hauteur : un post-it a une ombre courte, un aperçu
  Discord une ombre longue. Rien d'autre ne flotte.
- Pas de glassmorphisme, pas de halo, pas de dégradé de fond.

## Données

- Les aperçus sont une démo, annoncée comme telle. Les membres qui y
  apparaissent sont fictifs.
- Les chiffres réels (communautés, membres) viennent de `api.kotbo.fr`. Si
  l'API ne répond pas, la zone se masque.
- Les témoignages et serveurs mis en avant vivent dans `src/lib/data/proof.ts`.
  Liste vide, bloc absent.

## Accessibilité

- Texte courant à 4,5:1 sur son fond réel, gros titres à 3:1.
- Tout se joue au clavier, avec un anneau de focus visible.
- Les jeux se lancent sur une action du visiteur, jamais tout seuls hors
  écran.
