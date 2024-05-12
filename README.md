# Doftopia - API 

Ceci est l'api de Doftopia, elle comporte toute les routes pour servir les données du jeu au site. Les fonctionnalités concernant les utilisateurs sont dans une autre API Interne au site Web.
Ce projet à pour but de rendre possible l'accessibilité au données du jeu dofus simplement pour tout developpeur qui aimerait construire son projet.

Le repo est vital pour le bon fonctionnement du site Doftopia dans un environnement de test ou de developpement.

### Technologies Principales :

- **Express.js** : Framework minimaliste pour construire des applications web Node.js, utilisé pour la gestion des routes et des API.
- **MySql** : Système de gestion de base de données relationnelle, utilisé pour stocker les données de l'application.

### Fonctionnalités Clés :

Retourner des objets JSON en réponse a une requête.

## Installation

Doftopia - API nécessite [Node.js](https://nodejs.org/) v18+ pour fonctionner

pour modifier un fichier vous aurez besoin de modifier le code des fichier typescript puis il faudra les build une fois vos modifications terminées 

```sh
yarn tsc dbFiller.js && yarn tsc api.ts
```

Installer les dépendances
```sh
yarn install
```

*si vous installez une instance locale du projet vous aurez besoin de remplir votre base de données, pour se faire lancez d'abord le fichier dbFiller.js*

```sh
node dbFiller.js
```

une fois votre base de données remplie démarrez l'api

```sh
node api.js
```


## Licence

Ce projet est sous licence [Creative Commons Attribution 4.0 International License](link_to_license). Vous êtes libre de partager et d'adapter le contenu de Doftopia, tant que vous en citez la source et que vous ne le faites pas à des fins commerciales.

## Contact

Pour toute question, suggestion ou commentaire, n'hésitez pas à nous contacter via [contact@doniban.fr](mailto:contact@doniban.fr) ou à ouvrir une issue sur ce repository.
