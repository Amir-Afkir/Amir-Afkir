# Portfolio — Amir Afkir

Portfolio personnel de **Amir Afkir**, développeur web full-stack.

## Stack

- HTML5 / CSS3
- JavaScript ES Modules
- Netlify Forms
- Projets alimentés depuis `data/projects.json`
- Sharp pour l’optimisation locale des images

## Vérifications

```bash
npm run validate
```

La validation contrôle les identifiants projets, les chemins d’assets et les galeries. Elle est aussi exécutée automatiquement dans GitHub Actions.

## Optimisation des images

```bash
npm install
npm run optimize:images
```

Le script génère des versions WebP sans supprimer les originaux.

## Déploiement

Production : **https://amirafkir.dev/** via Netlify.
