# jf-avatars

## Description

Le projet **jf-avatars** est une application JavaScript qui permet de sélectionner des avatars depuis une galerie d'images dans un environnement compatible avec **Jellyfin**. Cette fonctionnalité utilise une modal personnalisée pour offrir à l'utilisateur une interface visuelle permettant de parcourir, filtrer et choisir une image de profil.

## Fonctionnalités

- **Sélection d'avatars** : Interface pour choisir un avatar dans une galerie d'images.
- **Grille d'images** : Affichage dynamique des images sous forme de grille avec ajustement pour les écrans de différentes tailles.
- **Recherche et filtrage** : Recherche d'images par nom et possibilité de filtrer les images par catégorie via un dropdown.
- **Gestion des images sélectionnées** : Gestion de l'état visuel des images (en couleur pour les images sélectionnées, en niveaux de gris pour celles non sélectionnées).
- **Responsive** : Adaptation automatique de l'interface selon la taille de l'écran (bureau, tablette, mobile).

## Structure du projet

Voici les fichiers principaux du projet :

- **index.js** : Point d'entrée pour initialiser l'application.
- **constants.js** : Fichier contenant les constantes globales utilisées par l'application (sections, images, etc.).
- **events.js** : Fichier contenant les gestionnaires d'événements pour la recherche, le filtrage, et la gestion des événements de redimensionnement.
- **props.js** : Ce fichier stocke les propriétés dynamiques et l'état de l'application (par exemple, l'image sélectionnée).
- **style.js** : Contient des fonctions pour ajuster le style et la disposition de la modal en fonction de la taille de l'écran.
- **ui-elements.js** : Contient les fonctions pour générer les éléments de l'interface utilisateur comme les boutons, le dropdown, la barre de recherche, et la grille d'images.

## Utilisation

### Injection du script

Il y a deux possibilités pour intégrer le script dans votre projet :

1. **Injection directe dans `index.html`** :

```html
<script type="module" src="https://monsite/js/dist/main.js" defer></script>
```

2. **Injection avec Nginx** :

```nginx
location / {
    proxy_pass http://backend_server;  # Reverse proxy vers votre backend
    sub_filter '</body>' '<script type="module" src="https://monsite/js/dist/main.js" defer></script></body>';
    sub_filter_once on;  # Appliquer la modification une seule fois
}
```

### Fonctionnement général

- **Chargement de la modal de sélection d'avatars** : Le script vérifie l'existence du bouton `#btnDeleteImage`, crée un nouveau bouton et le place avant le bouton de suppression.
- **Sélection d'images** : Cliquez sur une image pour la sélectionner. Les images déjà sélectionnées apparaîtront en couleur, tandis que les autres resteront en niveaux de gris.
- **Recherche d'images** : Utilisez la barre de recherche pour trouver des images spécifiques par nom.
- **Filtrage par catégorie** : Utilisez le dropdown pour filtrer les images par section.

### Modification de la langue via CSS

Il est possible de modifier les textes affichés dans l'interface (comme le titre, les libellés des filtres, les boutons, etc.) en utilisant des variables CSS. Ces textes sont récupérés dynamiquement avec `getComputedStyle`, permettant ainsi de personnaliser facilement la langue de l'application sans toucher directement au code JavaScript.

Le préfixe utilisé dans l'application est défini comme suit :

```javascript
const prefix = "jf-avatars";
```

Voici les éléments personnalisables avec les variables CSS associées :

- **Titre de la modal** : `--jf-avatars-title`
- **Libellé du filtre** : `--jf-avatars-filter-label`
- **Option par défaut du filtre** : `--jf-avatars-filter-default-option`
- **Libellé de la barre de recherche** : `--jf-avatars-search-label`
- **Bouton Annuler** : `--jf-avatars-btn-cancel`
- **Bouton Valider** : `--jf-avatars-btn-validate`
- **Bouton Afficher plus d'avatars** : `--jf-avatars-btn-show`

Exemple d'utilisation dans un fichier CSS pour changer la langue :

```css
:root {
  --jf-avatars-title: "Select your avatar";
  --jf-avatars-filter-label: "Filter by";
  --jf-avatars-filter-default-option: "Choose an option";
  --jf-avatars-search-label: "Search for an avatar...";
  --jf-avatars-btn-cancel: "Cancel";
  --jf-avatars-btn-validate: "Validate";
  --jf-avatars-btn-show: "More avatars";
}
```

Dans le code JavaScript, ces valeurs sont récupérées de la manière suivante :

```javascript
title:
  cleanProperty(
    getComputedStyle(document.body).getPropertyValue(`--${prefix}-title`)
  ) || "Sélectionner votre avatar",
filterLabel:
  cleanProperty(
    getComputedStyle(document.body).getPropertyValue(`--${prefix}-filter-label`)
  ) || "Filtrer par",
// etc.
```

Cela permet une gestion flexible des langues via CSS, facilitant l'internationalisation de l'interface.

### Intégration avec le thème Jellyfin

**IMPORTANT** : Chaque élément créé avec ce script s'appuie sur le thème Jellyfin, ce qui permet une intégration transparente, même si vous utilisez un thème personnalisé.

### Spécifications sur le nommage des images

Les images doivent respecter un schéma de nommage précis : `NomDossier-nom_image.png`. De plus, les images doivent être rangées dans le dossier `src/img` et triées dans des sous-dossiers en fonction du thème de l'image.

## JSDoc

Le projet est entièrement documenté avec JSDoc. Pour générer la documentation à partir du code source, vous pouvez exécuter la commande suivante :

```bash
npm run docs
```

Cela créera une documentation complète dans un répertoire `docs`.

## Fichiers JSDoc

Chaque fonction est documentée avec JSDoc, vous pouvez générer des fichiers de documentation HTML pour comprendre plus en détail les paramètres et le fonctionnement de chaque fonction.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
